/**
 * 任务停滞判定（纯函数，便于单测）。
 * 只有「进行中 + 本轮 running + 不是等审批 + 超过 stallMs 没有任何事件」才算卡住。
 */
export function isTaskStalled(task, { now = Date.now(), stallMs = 15 * 60 * 1000 } = {}) {
  if (!task || task.status !== '进行中' || task.lastRun?.status !== 'running') return false;
  if (String(task.lastRun.currentActivity || '').includes('等待老板审批')) return false;
  const lastEvent = Date.parse(task.lastRun.lastEventAt || task.lastRun.startedAt || task.updatedAt || '') || 0;
  if (!lastEvent || now - lastEvent < stallMs) return false;
  const handledAt = Date.parse(task.lastRun.stallHandledAt || '') || 0;
  if (handledAt && now - handledAt < stallMs) return false;
  return true;
}
