/**
 * dsh bridge client —— 把本地运行的 dsh 控制面（opc-runtime-bridge）包成
 * “给某个员工发一句话，等一轮文本回复”的最小接口。
 *
 * 依赖：127.0.0.1:3081 上运行中的 opc-runtime-bridge（dsh 0.2.2-rc.1）。
 * 这不是 dsh 官方 SDK；只是当前阶段最容易验证的跨进程控制面。
 */

import { randomUUID } from 'node:crypto';

const BASE = (process.env.DSH_BRIDGE_URL || 'http://127.0.0.1:3081/opc-runtime/v1').replace(/\/+$/, '');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function bridgeFetch(path, options = {}) {
  const { timeoutMs = 60_000, ...rest } = options;
  const signal = options.signal || AbortSignal.timeout(timeoutMs);
  const response = await fetch(`${BASE}${path}`, {
    ...rest,
    signal,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({ ok: false, error: 'invalid bridge response' }));
  if (!response.ok || !payload.ok) {
    const error = new Error(payload.error || `bridge HTTP ${response.status}`);
    error.status = response.status;
    error.code = payload.code;
    throw error;
  }
  return payload;
}

/** 在 dsh 运行时注册/更新一个员工原生 preset（无需重启控制面）。 */
export async function registerEmployeePreset(definition) {
  const id = String(definition?.id || '').trim();
  if (!id) throw new Error('preset id 必填');
  if (!Array.isArray(definition.plugins)) throw new Error('preset plugins 必填');
  return bridgeFetch('/presets', {
    method: 'POST',
    body: JSON.stringify({
      id,
      name: definition.name || id,
      description: definition.description || '',
      plugins: definition.plugins,
    }),
  });
}

/** 把一条用户消息插进正在跑的 turn（DSH steer 语义：下一个 step 就会读到）。 */
export async function steerSession(sessionId, text, options = {}) {
  if (!sessionId) throw new Error('sessionId 必填');
  return bridgeFetch(`/sessions/${encodeURIComponent(sessionId)}/messages`, {
    method: 'POST',
    timeoutMs: options.timeoutMs || 15_000,
    body: JSON.stringify({
      text: String(text || ''),
      mode: 'steer',
      kind: options.kind === 'company' ? 'company' : 'chat',
      requestId: options.requestId || '',
    }),
  });
}

/** 读取一个会话的实时状态（是否还在跑、有没有工具任务在执）。 */
export async function sessionState(sessionId) {
  if (!sessionId) return null;
  return bridgeFetch(`/sessions/${encodeURIComponent(sessionId)}/state`, { timeoutMs: 8_000 });
}

/** 取消一个正在跑的 turn（幂等）。 */
export async function cancelSession(sessionId) {
  if (!sessionId) return false;
  try {
    await bridgeFetch(`/sessions/${encodeURIComponent(sessionId)}/cancel`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    return true;
  } catch {
    return false;
  }
}

async function ensureSession(sessionKey, sessions, options = {}) {
  const existing = sessions && sessions[sessionKey];
  const wantedCwd = options.cwd || '';
  const wantedPreset = options.agentPreset || '';
  const sameCwd = !wantedCwd || existing?.cwd === wantedCwd;
  const samePreset = !wantedPreset || existing?.preset === wantedPreset;
  const usable = existing && existing.sessionId && sameCwd && samePreset;

  if (usable) {
    try {
      const check = await bridgeFetch(`/sessions/${encodeURIComponent(existing.sessionId)}/result`);
      if (check.ok) return { ...existing };
    } catch (error) {
      if (error.status !== 404) throw error;
      // 应用重启后 DSH 进程内存里没有这个 Session，但磁盘上有 session.v4.jsonl.zstd；
      // 先让桥接从磁盘恢复同一个 sessionId，恢复成功就继续用它，不再新建会话。
      try {
        const resumed = await bridgeFetch(`/sessions/${encodeURIComponent(existing.sessionId)}/resume`, {
          method: 'POST',
          body: '{}',
        });
        if (resumed?.ok) {
          return {
            ...existing,
            lastIndex: Number.isInteger(resumed.lastIndex) ? resumed.lastIndex : 0,
            updatedAt: new Date().toISOString(),
          };
        }
      } catch (resumeError) {
        console.warn('[dsh-chat] 会话恢复失败，改为新建：', existing.sessionId, resumeError?.message || resumeError);
      }
    }
  }

  const body = {};
  if (wantedCwd) body.cwd = wantedCwd;
  if (wantedPreset) body.agentPreset = wantedPreset;
  if (options.employeeId) body.employeeId = options.employeeId;
  if (options.projectId) body.projectId = options.projectId;
  // chat = 老板亲自对话；company = 任务/验收/内部协作，不弹公司审批
  body.kind = options.kind === 'chat' ? 'chat' : 'company';
  let created;
  try {
    created = await bridgeFetch('/sessions', { method: 'POST', body: JSON.stringify(body) });
  } catch (error) {
    if (error.code === 'SESSION_LIMIT' || error.status === 429) {
      await reclaimIdleSessions(8);
      created = await bridgeFetch('/sessions', { method: 'POST', body: JSON.stringify(body) });
    } else {
      throw error;
    }
  }
  return {
    sessionId: created.sessionId,
    lastIndex: 0,
    cwd: wantedCwd,
    preset: wantedPreset,
  };
}

function extractText(message) {
  const content = message && message.content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((part) => part && part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('');
}

/**
 * 给员工发一句话，等一轮结束，返回文本与 usage。
 * 会话按 employeeId 持久化在传入的 sessions 对象里（由调用方落 store.json）。
 */
export async function chatWithEmployee(employeeId, text, sessions, options = {}) {
  console.log('[dsh-chat] start', employeeId, options.sessionKey || employeeId);
  const sessionKey = options.sessionKey || employeeId;
  // steer：老板插话。消息直接进 DSH 会话收件箱，不排在 chat 锁后面；
  // 即使员工正在跑任务，也会在下一个 step 读到。
  const delivery = options.delivery === 'steer' ? 'steer' : 'queue';
  const requestId = String(options.requestId || '').trim() || (delivery === 'steer' ? randomUUID() : '');
  // resumeSession：上一轮只是前端断开/超时，DSH 那一轮还在跑；直接从 lastIndex 续读事件，
  // 不重新 POST 消息，避免「点继续」变成又发一遍。
  let resuming = Boolean(options.resumeSession?.sessionId);
  if (resuming) {
    // 只有「DSH 里这个 turn 仍然 running」才按游标续读；应用重启后 session 不在了、
    // 或上一轮已经结束，就退回普通续写（会从磁盘恢复同一会话后重新发一条续写提示）。
    try {
      const check = await bridgeFetch(`/sessions/${encodeURIComponent(options.resumeSession.sessionId)}/result`);
      if (!check.ok || (check.status && check.status !== 'running')) resuming = false;
    } catch (error) {
      if (error.status === 404) resuming = false;
      else throw error;
    }
  }
  let session;
  let routed = false;
  if (resuming) {
    session = { ...options.resumeSession, key: sessionKey, cancelled: false };
    sessions[sessionKey] = session;
    console.log('[dsh-chat] resume turn', session.sessionId, 'from', session.lastIndex ?? 0);
  } else {
    await pruneSessionStore(sessions);
    session = await ensureSession(sessionKey, sessions, options);
    // 上一轮被“停止”只是取消了 turn，不代表这个 Session 报废；
    // 标记必须在下一轮开始时清掉，否则会永远新建会话、上下文丢失。
    session.cancelled = false;
    // 立刻登记到会话表：一轮可能跑很久，期间老板插话必须能复用同一个 Session，
    // 不能等本轮结束才保存，否则插话会新建一个旁路会话。
    sessions[sessionKey] = session;
    console.log('[dsh-chat] session', session.sessionId);
    const effortChanged = Boolean(options.reasoningEffort) && session.reasoningEffort !== options.reasoningEffort;
    if (options.model && (session.model !== options.model || session.provider !== options.provider || effortChanged)) {
      try {
        const selected = await bridgeFetch(`/sessions/${encodeURIComponent(session.sessionId)}/model`, {
          method: 'POST',
          timeoutMs: 30_000,
          body: JSON.stringify({
            provider: options.provider || 'custom',
            model: options.model,
            ...(options.reasoningEffort ? { reasoningEffort: options.reasoningEffort } : {}),
          }),
        });
        session.model = selected?.selected?.model || options.model;
        session.provider = selected?.selected?.provider || options.provider || 'custom';
        session.reasoningEffort = options.reasoningEffort || session.reasoningEffort || '';
        session.routeId = options.routeId || '';
        routed = Boolean(options.routeId);
      } catch (error) {
        throw new Error(`模型路由失败（${options.model}）：${error.message}`);
      }
    }

    console.log('[dsh-chat] posting message', session.sessionId, delivery);
    await bridgeFetch(`/sessions/${encodeURIComponent(session.sessionId)}/messages`, {
      method: 'POST',
      timeoutMs: 15_000,
      body: JSON.stringify({
        text,
        images: Array.isArray(options.images) ? options.images : [],
        kind: options.kind === 'chat' ? 'chat' : 'company',
        mode: delivery,
        requestId,
      }),
    });
    console.log('[dsh-chat] message posted', session.sessionId);
    console.log();
  }

  const started = Date.now();
  // 默认不设总时长上限：复杂任务可能跑十几分钟甚至更久，活没干完不能停。
  // 需要硬上限时显式传 timeoutMs>0 或设置 OC_CHAT_TIMEOUT_MS。
  const configuredTimeout = options.timeoutMs !== undefined ? Number(options.timeoutMs) : Number(process.env.OC_CHAT_TIMEOUT_MS || 0);
  const timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? Math.max(30_000, configuredTimeout) : 0;
  const deadline = timeoutMs ? started + timeoutMs : Infinity;
  // 总时长不设上限，但 DSH 连续十几分钟一条事件都没有，基本可以判定会话已经僵死；
  // 到点主动报超时，前端可以停止/重发，而不是永远显示“正在处理”。
  const configuredIdle = options.idleTimeoutMs !== undefined ? Number(options.idleTimeoutMs) : Number(process.env.OC_CHAT_IDLE_TIMEOUT_MS || 900_000);
  const idleTimeoutMs = Number.isFinite(configuredIdle) && configuredIdle > 0 ? Math.max(60_000, configuredIdle) : 0;
  let lastIndex = Number.isInteger(session.lastIndex) ? session.lastIndex : 0;
  // steer 可能插进一个已经跑了一半的 turn，此时看不到本轮 turn/start，
  // 所以直接按“已经在 turn 里”处理，等本轮 turn/end 收尾即可。
  let sawTurnStart = resuming || delivery === 'steer';
  let sawOurMessage = delivery !== 'steer';
  let lastEventAt = Date.now();
  let lastHeartbeatAt = 0;
  let finished = false;
  const texts = [];
  const reasoningTexts = [];
  const tools = [];
  const toolByCallId = new Map();
  // 把轮询到的中间事件实时抛给上层（server.mjs 再转成 SSE），不再等整轮结束才显示
  const emit = typeof options.onEvent === 'function' ? options.onEvent : () => {};
  const usageTotals = { inputTokens: 0, outputTokens: 0, totalTokens: 0, cacheReadTokens: 0 };
  let sawUsage = false;

  while (Date.now() < deadline) {
    if (options.signal?.aborted) {
      const error = new Error('已停止生成');
      error.code = 'ABORTED';
      error.partial = texts.join('\n').trim();
      error.partialReasoning = reasoningTexts.join('\n\n').trim();
      error.partialTools = tools;
      error.partialSession = { ...session, lastIndex, lastUsedAt: Date.now(), updatedAt: new Date().toISOString() };
      throw error;
    }
    await sleep(350);
    const payload = await bridgeFetch(
      `/sessions/${encodeURIComponent(session.sessionId)}/events?since=${lastIndex}`,
      options.signal ? { signal: options.signal } : {},
    );
    if ((payload.events || []).length > 0) lastEventAt = Date.now();
    if (Date.now() - lastHeartbeatAt >= 10_000) {
      lastHeartbeatAt = Date.now();
      emit({
        type: 'heartbeat',
        idleMs: Date.now() - lastEventAt,
        turnEnded: payload.turnEnded === true,
        totalEvents: payload.nextIndex || lastIndex,
      });
    }
    if (idleTimeoutMs && Date.now() - lastEventAt > idleTimeoutMs) {
      const error = new Error(`DSH 已 ${Math.round(idleTimeoutMs / 60_000)} 分钟没有任何事件，会话疑似卡住`);
      error.code = 'TIMEOUT';
      error.partial = texts.join('\n').trim();
      error.partialReasoning = reasoningTexts.join('\n\n').trim();
      error.partialTools = tools;
      error.partialSession = { ...session, lastIndex, lastUsedAt: Date.now(), updatedAt: new Date().toISOString() };
      throw error;
    }

    for (const frame of payload.events || []) {
      const event = frame && frame.event ? frame.event : {};
      if (event.type === 'turn/start') sawTurnStart = true;
      if (event.type === 'user/message' && requestId) {
        const rpcId = event.data && event.data.source && event.data.source.rpcId;
        if (rpcId === requestId) sawOurMessage = true;
      }

      if (event.type === 'approval/asked') {
        // Auto review 拒绝后由 DSH 审批服务询问老板；审批项由 opc-runtime-bridge 写入公司收件箱
        const data = event.data || {};
        emit({
          type: 'approval',
          approvalId: data.id || '',
          toolName: data.toolName || '',
          reason: data.reason || '需要老板确认',
        });
      }

      if (event.type === 'approval/decided') {
        emit({ type: 'approval-result', outcome: (event.data && event.data.outcome) || '' });
      }

      if (event.type === 'assistant/message') {
        const message = event.data && event.data.message;
        const part = extractText(message);
        const blocks = message && Array.isArray(message.content) ? message.content : [];
        const reasoning = blocks
          .filter((block) => block && block.type === 'reasoning' && typeof block.text === 'string')
          .map((block) => block.text)
          .join('\n')
          .trim();
        if (reasoning) {
          reasoningTexts.push(reasoning);
          emit({ type: 'reasoning', text: reasoning });
        }
        if (part) {
          texts.push(part);
          emit({ type: 'assistant', text: part });
        }
        const usage = event.data && event.data.usage;
        if (usage) {
          sawUsage = true;
          usageTotals.inputTokens += Number(usage.inputTokens || 0);
          usageTotals.outputTokens += Number(usage.outputTokens || 0);
          usageTotals.totalTokens += Number(usage.totalTokens || 0);
          usageTotals.cacheReadTokens += Number(usage.cacheReadTokens || 0);
        }
      }

      if (event.type === 'tool/call') {
        const data = event.data || {};
        const tool = {
          callId: data.callId || '',
          name: data.name || 'tool',
          arguments: typeof data.arguments === 'string' ? data.arguments : JSON.stringify(data.arguments || ''),
          result: '',
          isError: false,
        };
        tools.push(tool);
        if (tool.callId) toolByCallId.set(tool.callId, tool);
        emit({ type: 'tool-call', tool });
      }

      if (event.type === 'tool/result') {
        const data = event.data || {};
        const callId = data.message && data.message.toolCallId ? data.message.toolCallId : data.toolCallId;
        const tool = callId ? toolByCallId.get(callId) : null;
        if (tool) {
          const resultText = extractText(data.message);
          tool.result = resultText.slice(0, 2000);
          tool.isError = Boolean(data.message && data.message.isError);
          emit({ type: 'tool-result', tool });
        }
      }

      if (event.type === 'step/start' || event.type === 'step/end') {
        emit({ type: 'step', phase: event.type === 'step/start' ? 'start' : 'end', step: event.data && event.data.step });
      }

      if (event.type === 'turn/end' && sawTurnStart && sawOurMessage) finished = true;
    }

    if (typeof payload.nextIndex === 'number') lastIndex = payload.nextIndex;
    if (payload.status === 'error') throw new Error(payload.error || 'dsh 会话出错');
    if (finished) break;
  }

  if (!finished && timeoutMs) {
    const error = new Error(`对话超时（${Math.round(timeoutMs / 1000)} 秒）`);
    error.code = 'TIMEOUT';
    error.partial = texts.join('\n').trim();
    error.partialReasoning = reasoningTexts.join('\n\n').trim();
    error.partialTools = tools;
    error.partialSession = { ...session, lastIndex, lastUsedAt: Date.now(), updatedAt: new Date().toISOString() };
    throw error;
  }

  const finalSession = {
    ...session,
    lastIndex,
    lastUsedAt: Date.now(),
    updatedAt: new Date().toISOString(),
    cwd: options.cwd || session.cwd || '',
    preset: options.agentPreset || session.preset || '',
    model: session.model || '',
    provider: session.provider || '',
    routeId: session.routeId || '',
  };
  // 本轮结束后立刻把游标写回会话表，下一轮（或插话 watcher）从正确位置继续读，
  // 不会重放上一轮的事件，也不会把上一轮文本拼进新回复。
  sessions[sessionKey] = finalSession;
  return {
    session: finalSession,
    sessionId: session.sessionId,
    model: session.model || options.model || '',
    provider: session.provider || options.provider || '',
    routed,
    text: texts.join('\n').trim() || (resuming ? '' : '（本轮没有文本回复）'),
    reasoning: reasoningTexts.join('\n\n').trim(),
    usage: sawUsage ? usageTotals : null,
    tools,
  };
}


/** 列出 bridge 当前持有的会话 */
export async function listBridgeSessions() {
  const payload = await bridgeFetch('/sessions');
  return payload.sessions || [];
}

/** 关闭一个 bridge 会话（幂等） */
export async function closeSession(sessionId) {
  if (!sessionId) return false;
  try {
    await bridgeFetch(`/sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    if (error.status === 404) return true;
    throw error;
  }
}

/** 回收最久未使用的空闲会话，缓解 dsh 会话上限 */
export async function reclaimIdleSessions(limit = 8) {
  let sessions = [];
  try {
    sessions = await listBridgeSessions();
  } catch {
    return 0;
  }
  const idle = sessions
    .filter((item) => item.status !== 'active' || item.turnEnded)
    .sort((a, b) => Number(a.lastUsedAt || 0) - Number(b.lastUsedAt || 0))
    .slice(0, Math.max(0, limit));
  let closed = 0;
  for (const item of idle) {
    try {
      if (await closeSession(item.sessionId)) closed += 1;
    } catch {
      /* 单个失败不影响整体回收 */
    }
  }
  return closed;
}


/** 控制本地会话表规模，超限时淘汰最久未用的会话并通知 bridge 释放 */
export async function pruneSessionStore(sessions, limit = 120) {
  if (!sessions || typeof sessions !== 'object') return 0;
  const entries = Object.entries(sessions);
  if (entries.length <= limit) return 0;
  entries.sort((a, b) => Number(a[1]?.lastUsedAt || 0) - Number(b[1]?.lastUsedAt || 0));
  const drop = entries.slice(0, entries.length - limit);
  for (const [key, session] of drop) {
    delete sessions[key];
    if (session?.sessionId) {
      void closeSession(session.sessionId).catch(() => {});
    }
  }
  return drop.length;
}
