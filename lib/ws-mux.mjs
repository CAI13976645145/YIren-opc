/**
 * 轻量 WebSocket 多路复用通道（零依赖）。
 *
 * 与 DS Bot 的 /api/remote.mux 同构：
 * - 浏览器只维持一条 WebSocket；
 * - 每条逻辑流用 streamId 区分；
 * - 服务端下发 {streamId, type:'item'|'snapshot'|'error'|'end', revision, value}；
 * - 审批事件走保留 streamId `$events`，与对话流共用同一条连接。
 */
import { createHash, randomUUID } from 'node:crypto';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

function encodeFrame(text) {
  const payload = Buffer.from(text, 'utf8');
  const length = payload.length;
  let header;
  if (length < 126) {
    header = Buffer.alloc(2);
    header[1] = length;
  } else if (length < 65536) {
    header = Buffer.alloc(4);
    header[1] = 126;
    header.writeUInt16BE(length, 2);
  } else {
    header = Buffer.alloc(10);
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(length), 2);
  }
  header[0] = 0x81; // FIN + text
  return Buffer.concat([header, payload]);
}

function closeFrame(code = 1000, reason = '') {
  const reasonBuffer = Buffer.from(reason, 'utf8').slice(0, 120);
  const payload = Buffer.alloc(2 + reasonBuffer.length);
  payload.writeUInt16BE(code, 0);
  reasonBuffer.copy(payload, 2);
  const header = Buffer.from([0x88, payload.length]);
  return Buffer.concat([header, payload]);
}

class MuxConnection {
  constructor(socket, hub) {
    this.socket = socket;
    this.hub = hub;
    this.buffer = Buffer.alloc(0);
    this.fragments = [];
    this.fragmentOpcode = 0;
    this.alive = true;
    this.id = randomUUID();
    socket.on('data', (chunk) => this.#onData(chunk));
    socket.on('close', () => this.#cleanup());
    socket.on('error', () => this.#cleanup());
    socket.setNoDelay?.(true);
  }

  send(payload) {
    if (!this.alive) return;
    try {
      this.socket.write(encodeFrame(typeof payload === 'string' ? payload : JSON.stringify(payload)));
    } catch {
      this.#cleanup();
    }
  }

  close(code = 1000, reason = '') {
    if (!this.alive) return;
    this.alive = false;
    try {
      this.socket.write(closeFrame(code, reason));
      this.socket.end();
    } catch {
      /* ignore */
    }
    this.#cleanup();
  }

  #cleanup() {
    if (!this.alive) return;
    this.alive = false;
    this.hub.connections.delete(this);
    this.hub.onClose?.(this);
    try {
      this.socket.destroy();
    } catch {
      /* ignore */
    }
  }

  #onData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 2) {
      const first = this.buffer[0];
      const second = this.buffer[1];
      const fin = (first & 0x80) !== 0;
      const opcode = first & 0x0f;
      const masked = (second & 0x80) !== 0;
      let length = second & 0x7f;
      let offset = 2;
      if (length === 126) {
        if (this.buffer.length < 4) return;
        length = this.buffer.readUInt16BE(2);
        offset = 4;
      } else if (length === 127) {
        if (this.buffer.length < 10) return;
        const big = this.buffer.readBigUInt64BE(2);
        if (big > BigInt(16 * 1024 * 1024)) {
          this.close(1009, 'frame too large');
          return;
        }
        length = Number(big);
        offset = 10;
      }
      const maskOffset = offset;
      if (masked) offset += 4;
      if (this.buffer.length < offset + length) return;
      let payload = this.buffer.subarray(offset, offset + length);
      if (masked) {
        const mask = this.buffer.subarray(maskOffset, maskOffset + 4);
        const decoded = Buffer.alloc(length);
        for (let i = 0; i < length; i += 1) decoded[i] = payload[i] ^ mask[i % 4];
        payload = decoded;
      }
      this.buffer = this.buffer.subarray(offset + length);

      if (opcode === 0x8) {
        this.close(1000, 'bye');
        return;
      }
      if (opcode === 0x9) {
        const pong = Buffer.concat([Buffer.from([0x8a, payload.length]), payload]);
        try {
          this.socket.write(pong);
        } catch {
          /* ignore */
        }
        continue;
      }
      if (opcode === 0x0) {
        this.fragments.push(payload);
        if (fin) {
          const full = Buffer.concat(this.fragments);
          this.fragments = [];
          if (this.fragmentOpcode === 1) this.#dispatch(full.toString('utf8'));
          this.fragmentOpcode = 0;
        }
        continue;
      }
      if (opcode === 0x1) {
        if (!fin) {
          this.fragmentOpcode = 1;
          this.fragments = [payload];
          continue;
        }
        this.#dispatch(payload.toString('utf8'));
      }
    }
  }

  #dispatch(text) {
    let message;
    try {
      message = JSON.parse(text);
    } catch {
      this.send({ type: 'error', error: 'invalid json' });
      return;
    }
    try {
      this.hub.onMessage?.(this, message);
    } catch (error) {
      this.send({ streamId: message?.streamId || '', type: 'error', error: error instanceof Error ? error.message : String(error) });
    }
  }
}

export class MuxHub {
  constructor() {
    this.connections = new Set();
    this.onMessage = null;
    this.onClose = null;
    this.path = '/api/remote.mux';
    this.heartbeat = null;
  }

  attach(server, { path = '/api/remote.mux', onMessage, onClose } = {}) {
    this.path = path;
    this.onMessage = onMessage;
    this.onClose = onClose;
    server.on('upgrade', (req, socket) => {
      let pathname = '';
      try {
        pathname = new URL(req.url || '/', 'http://127.0.0.1').pathname;
      } catch {
        socket.destroy();
        return;
      }
      if (pathname !== this.path) {
        socket.destroy();
        return;
      }
      const key = String(req.headers['sec-websocket-key'] || '');
      if (!key) {
        socket.destroy();
        return;
      }
      const accept = createHash('sha1').update(`${key}${GUID}`).digest('base64');
      socket.write(
        [
          'HTTP/1.1 101 Switching Protocols',
          'Upgrade: websocket',
          'Connection: Upgrade',
          `Sec-WebSocket-Accept: ${accept}`,
          '',
          '',
        ].join('\r\n'),
      );
      this.connections.add(new MuxConnection(socket, this));
    });
    this.heartbeat = setInterval(() => {
      for (const connection of this.connections) {
        if (!connection.alive) continue;
        try {
          connection.send({ type: 'ping', time: Date.now() });
        } catch {
          /* ignore */
        }
      }
    }, 25_000);
    this.heartbeat.unref?.();
  }

  broadcast(streamId, message) {
    for (const connection of this.connections) {
      if (connection.alive) connection.send({ streamId, ...message });
    }
  }

  sendTo(connection, streamId, message) {
    if (connection?.alive) connection.send({ streamId, ...message });
  }

  close() {
    if (this.heartbeat) clearInterval(this.heartbeat);
    for (const connection of [...this.connections]) connection.close(1001, 'server shutdown');
  }
}

export function createMuxHub() {
  return new MuxHub();
}
