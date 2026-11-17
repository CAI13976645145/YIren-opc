/**
 * 一人公司 · 内置 WorkBuddy2API 网关。
 *
 * 设计原则：
 * - 网关是本工作台的一部分，随公司服务一起启动，只监听 127.0.0.1，不对局域网暴露。
 * - 二进制放在 vendor/gateway，账号、配置、用量全部落在公司数据目录 data/gateway。
 * - 工作台前端/员工工具只通过本模块的管理接口操作网关，不再连接外部 7863。
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const BIN_DIR = fileURLToPath(new URL('../vendor/gateway/', import.meta.url));

function binaryName() {
  if (process.platform === 'win32') return 'wb2api.exe';
  return 'wb2api';
}

function binaryPath() {
  return join(BIN_DIR, binaryName());
}

function randomKey() {
  return `sk-oc-${randomBytes(24).toString('base64url')}`;
}

function canListen(port) {
  return new Promise((resolve) => {
    const probe = createServer();
    probe.once('error', () => resolve(false));
    probe.once('listening', () => probe.close(() => resolve(true)));
    probe.listen(port, '127.0.0.1');
  });
}

async function pickPort(preferred) {
  for (let port = preferred; port < preferred + 40; port += 1) {
    if (await canListen(port)) return port;
  }
  throw new Error('本机没有可用的网关端口（7863-7902 都被占用）');
}

/** 默认配置以 wb2api-panel 的官方字段为准，只把监听收紧到回环。 */
function defaultConfig(port, dataDir, apiKey) {
  return {
    listen: `127.0.0.1:${port}`,
    api_key: apiKey,
    auth_dir: join(dataDir, 'auths'),
    state_file: join(dataDir, 'data', 'state.json'),
    panel: { package_detail_limit: 5 },
    logging: {
      request_archive_enabled: true,
      request_retention_days: 7,
      request_archive_max_mb: 100,
      request_client_info: true,
    },
    server: { read_timeout: '300s' },
    cooldown: { soft_rate: '600s', soft_rate_max: '2h' },
    schedule: {
      checkin_hours: [9, 21],
      travel_hours: [9, 21],
      activity_hours: [10],
      keepalive_hours: [22],
      blackcat_hours: [23],
      growth_hours: [1],
      checkin_enabled: true,
      travel_enabled: true,
      activity_enabled: true,
      keepalive_enabled: true,
      blackcat_enabled: true,
      growth_enabled: true,
      include_disabled_in_tasks: false,
      balance_refresh_enabled: true,
      balance_refresh_minutes: 5,
    },
    global: { enabled: true, chat_base: '', billing_base: '' },
    upstream: {
      timeout_seconds: 120,
      header_timeout_seconds: 120,
      idle_timeout_seconds: 300,
      user_agent: '',
      client_version: '',
      cli_version: '',
      client_name: '',
      device_token: '',
      device_token_file: '',
      passthrough_ip: false,
    },
    features: { sanitize_blacklist_fingerprints: true },
    prompt: { mode: 'passthrough', file: '' },
    upstash: { url: '', token: '' },
    pool: { max_in_flight: 3, max_in_flight_global: 12 },
  };
}

export class GatewayService {
  constructor({ dataDir, logDir, preferredPort = 7863 }) {
    this.dataDir = dataDir;
    this.gatewayDir = join(dataDir, 'gateway');
    this.authDir = join(this.gatewayDir, 'auths');
    this.stateDir = join(this.gatewayDir, 'data');
    this.configPath = join(this.gatewayDir, 'config.json');
    this.logDir = logDir || join(dataDir, 'server-logs');
    this.logPath = join(this.logDir, 'gateway.log');
    this.preferredPort = preferredPort;
    this.process = null;
    this.port = 0;
    this.apiKey = '';
    this.status = 'stopped';
    this.lastError = '';
    this.startedAt = 0;
    this.restarts = 0;
    this.stopping = false;
    this.restartTimer = null;
    this.readyPromise = null;
    this.logStream = null;
  }

  ensureDirs() {
    mkdirSync(this.authDir, { recursive: true });
    mkdirSync(this.stateDir, { recursive: true });
    mkdirSync(this.logDir, { recursive: true });
  }

  readConfig() {
    try {
      return JSON.parse(readFileSync(this.configPath, 'utf8'));
    } catch {
      return null;
    }
  }

  /** 生成或补齐配置；保留用户改过的 checkin_hours 等字段。 */
  async ensureConfig() {
    this.ensureDirs();
    const existing = this.readConfig() || {};
    const port = Number(String(existing.listen || '').split(':').pop()) || this.preferredPort;
    const freePort = (await canListen(port)) ? port : await pickPort(this.preferredPort);
    const apiKey = String(existing.api_key || '').trim() || randomKey();
    const merged = {
      ...defaultConfig(freePort, this.gatewayDir, apiKey),
      ...existing,
      listen: `127.0.0.1:${freePort}`,
      api_key: apiKey,
      auth_dir: this.authDir,
      state_file: join(this.stateDir, 'state.json'),
    };
    await writeFile(this.configPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
    this.port = freePort;
    this.apiKey = apiKey;
    return merged;
  }

  baseUrl() {
    return this.port ? `http://127.0.0.1:${this.port}` : '';
  }

  async fetchPanel(path, options = {}) {
    if (!this.port || !this.apiKey) throw new Error('内置网关还没有启动');
    const response = await fetch(`${this.baseUrl()}/panel/api/${String(path).replace(/^\/+/, '')}`, {
      method: options.method || 'GET',
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        accept: 'application/json',
        ...(options.body ? { 'content-type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(options.timeout || 30_000),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || data.message || `网关面板 HTTP ${response.status}`);
    }
    return data;
  }

  async fetchHealth(timeout = 2_500) {
    if (!this.port) return { ok: false, reachable: false };
    try {
      const response = await fetch(`${this.baseUrl()}/healthz`, { signal: AbortSignal.timeout(timeout) });
      const data = await response.json().catch(() => ({}));
      // 0 个可用账号时网关返回 503，但进程是活的；有 service 字段就说明已启动
      return { ...data, ok: response.ok, reachable: Boolean(data.service || response.ok), statusCode: response.status };
    } catch {
      return { ok: false, reachable: false };
    }
  }

  async waitReady(timeoutMs = 20_000) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      const health = await this.fetchHealth(1_500);
      if (health.reachable) return health;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    throw new Error(this.lastError || '内置网关启动超时');
  }

  appendLog(line) {
    try {
      const stamp = new Date().toISOString();
      writeFileSync(this.logPath, `[${stamp}] ${line}\n`, { flag: 'a' });
    } catch {
      /* 日志写不进去不影响网关 */
    }
  }

  async start() {
    if (this.process && this.status === 'running') return this.status;
    if (this.readyPromise) return this.readyPromise;
    this.readyPromise = this.#startOnce().finally(() => {
      this.readyPromise = null;
    });
    return this.readyPromise;
  }

  async #startOnce() {
    const bin = binaryPath();
    if (!existsSync(bin)) {
      this.status = 'missing';
      this.lastError = `找不到内置网关程序：${bin}`;
      this.appendLog(this.lastError);
      return this.status;
    }
    await this.ensureConfig();
    this.stopping = false;
    this.status = 'starting';
    this.appendLog(`启动网关，端口 ${this.port}`);
    const child = spawn(bin, ['-config', this.configPath], {
      cwd: this.gatewayDir,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, GIN_MODE: 'release' },
    });
    this.process = child;
    this.startedAt = Date.now();
    const pipe = (chunk, level) => {
      const text = String(chunk || '').trim();
      if (!text) return;
      this.appendLog(`${level} ${text.slice(0, 2000)}`);
      if (/panic|fatal error|address already in use|bind: /i.test(text) && this.status !== 'running') {
        this.lastError = text.slice(0, 500);
      }
    };
    child.stdout?.on('data', (chunk) => pipe(chunk, 'out'));
    child.stderr?.on('data', (chunk) => pipe(chunk, 'err'));
    child.on('exit', (code, signal) => {
      this.appendLog(`网关退出 code=${code} signal=${signal || ''}`);
      this.process = null;
      if (this.stopping) {
        this.status = 'stopped';
        return;
      }
      this.status = 'error';
      this.lastError = `网关进程退出（code=${code}）`;
      // 异常退出自动拉起，最多连续 5 次
      if (this.restarts < 5) {
        this.restarts += 1;
        const delay = Math.min(10_000, 1_000 * this.restarts);
        this.appendLog(`将在 ${delay}ms 后重启（第 ${this.restarts} 次）`);
        this.restartTimer = setTimeout(() => {
          this.start().catch((error) => {
            this.status = 'error';
            this.lastError = error.message;
          });
        }, delay);
      }
    });
    try {
      const health = await this.waitReady();
      this.status = 'running';
      this.lastError = '';
      this.restarts = 0;
      this.appendLog(`网关就绪：${JSON.stringify(health)}`);
    } catch (error) {
      this.status = 'error';
      this.lastError = error.message;
      this.appendLog(`网关启动失败：${error.message}`);
    }
    return this.status;
  }

  async stop() {
    this.stopping = true;
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    const child = this.process;
    if (!child) {
      this.status = 'stopped';
      return;
    }
    const pid = child.pid;
    try {
      if (process.platform === 'win32') {
        await new Promise((resolve) => {
          const killer = spawn('taskkill', ['/pid', String(pid), '/T', '/F'], { windowsHide: true });
          killer.on('exit', () => resolve());
          killer.on('error', () => resolve());
        });
      } else {
        child.kill('SIGTERM');
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (this.process) child.kill('SIGKILL');
      }
    } catch {
      /* 进程可能已经退出 */
    }
    this.process = null;
    this.status = 'stopped';
    this.appendLog('网关已停止');
  }

  async restart() {
    await this.stop();
    this.restarts = 0;
    this.stopping = false;
    return this.start();
  }

  async snapshot() {
    const health = await this.fetchHealth();
    let overview = null;
    let config = null;
    if (health.ok) {
      try {
        overview = await this.fetchPanel('overview', { timeout: 12_000 });
      } catch (error) {
        overview = { error: error.message };
      }
      try {
        const data = await this.fetchPanel('config', { timeout: 8_000 });
        const raw = data.config || {};
        // 只回传排程/并发等非敏感项，绝不把 api_key、上游令牌带到前端
        config = {
          listen: raw.listen || '',
          schedule: raw.schedule || null,
          pool: raw.pool || null,
          cooldown: raw.cooldown || null,
        };
      } catch {
        config = null;
      }
    }
    const accounts = Array.isArray(overview?.accounts)
      ? overview.accounts.map((item) => ({
          uid: String(item.uid || ''),
          nickname: String(item.nickname || item.uid || '账号'),
          credits: Number(item.credits) || 0,
          creditsTotal: Number(item.credits_total) || 0,
          creditsEarliestExpiry: String(item.credits_earliest_expiry || ''),
          creditsEarliestRemaining: Number(item.credits_earliest_remaining) || 0,
          realm: String(item.realm || 'cn'),
          disabled: item.disabled === true,
          paused: item.paused === true,
          cooling: item.cooling === true,
          checkinDone: item.checkin_done === true,
          successCount: Number(item.success_count) || 0,
          lastSuccess: String(item.last_success || ''),
          lastError: String(item.last_err || ''),
          consecutiveFails: Number(item.consecutive_fails) || 0,
          inFlight: Number(item.in_flight) || 0,
          lastModel: String(item.token_usage?.last_model || ''),
          requestCount: Number(item.token_usage?.request_count) || 0,
          promptTokens: Number(item.token_usage?.prompt_tokens) || 0,
          completionTokens: Number(item.token_usage?.completion_tokens) || 0,
          totalTokens: Number(item.token_usage?.total_tokens) || 0,
          lastUsedAt: String(item.token_usage?.last_used_at || ''),
        }))
      : [];
    const healthy = accounts.filter((item) => !item.disabled && !item.cooling).length;
    return {
      ok: this.status === 'running',
      reachable: health.reachable === true,
      status: this.status,
      service: health.service || 'workbuddy2api',
      version: overview?.version || '',
      baseUrl: this.baseUrl(),
      port: this.port,
      hasApiKey: Boolean(this.apiKey),
      apiKeyMasked: this.apiKey ? `${this.apiKey.slice(0, 6)}••••${this.apiKey.slice(-4)}` : '',
      authRequired: overview?.auth_required !== false,
      uptimeSec: Number(overview?.uptime_sec) || Math.round((Date.now() - this.startedAt) / 1000),
      healthy: overview ? Number(overview.healthy) || healthy : healthy,
      total: overview ? Number(overview.total) || accounts.length : accounts.length,
      coolings: Number(overview?.cooling) || 0,
      disabled: Number(overview?.disabled) || 0,
      paused: Number(overview?.paused) || 0,
      credits: accounts.reduce((sum, item) => sum + item.credits, 0),
      accounts,
      config,
      processId: this.process?.pid || 0,
      lastError: this.lastError,
      logPath: this.logPath,
    };
  }

  /** 读 auths 目录里的原始凭据，供导出/备份使用。 */
  async listAuths() {
    const { readdir } = await import('node:fs/promises');
    const files = await readdir(this.authDir).catch(() => []);
    const list = [];
    for (const file of files.filter((name) => name.endsWith('.json')).sort()) {
      try {
        const raw = JSON.parse(await readFile(join(this.authDir, file), 'utf8'));
        const account = raw.account || raw;
        list.push({
          file,
          uid: String(account.uid || ''),
          nickname: String(account.nickname || account.uid || ''),
          enterpriseId: String(account.enterpriseId || ''),
          accessToken: String(raw.auth?.accessToken || raw.accessToken || ''),
          refreshToken: String(raw.auth?.refreshToken || raw.refreshToken || ''),
          expiresAt: raw.auth?.expiresAt || raw.expiresAt || '',
          realm: String(raw.realm || account.realm || 'cn'),
        });
      } catch {
        /* 跳过损坏文件 */
      }
    }
    return list;
  }

  /** 写入一个账号。兼容 {account,auth}、扁平账号、cockpit snake_case。 */
  async addAuth(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const account = source.account && typeof source.account === 'object' ? source.account : source;
    const auth = source.auth && typeof source.auth === 'object' ? source.auth : source;
    const uid = String(account.uid || account.user_id || source.uid || '').trim();
    const accessToken = String(
      auth.accessToken || auth.access_token || source.accessToken || source.access_token || '',
    ).trim();
    const refreshToken = String(
      auth.refreshToken || auth.refresh_token || source.refreshToken || source.refresh_token || '',
    ).trim();
    if (!uid) throw new Error('账号缺少 uid');
    if (!accessToken) throw new Error(`账号 ${uid} 缺少 accessToken`);
    const payload = {
      account: {
        enterpriseId: String(account.enterpriseId || account.enterprise_id || ''),
        nickname: String(account.nickname || account.name || uid),
        uid,
      },
      auth: {
        accessToken,
        refreshToken,
        expiresAt: auth.expiresAt || auth.expires_at || source.expires_at || 0,
      },
    };
    // 原网关文件的 realm 不在 auth 里，用文件名/接口参数补；默认 cn
    const realm = String(source.realm || account.realm || raw.realm || 'cn').toLowerCase() === 'global' ? 'global' : 'cn';
    if (realm === 'global') payload.account.realm = 'global';
    const file = join(this.authDir, `workbuddy-${uid}.json`);
    await writeFile(file, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    return { uid, file, nickname: payload.account.nickname };
  }
}

export function createGatewayService(options) {
  return new GatewayService(options);
}
