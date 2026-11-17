#!/usr/bin/env node
/**
 * 原网关账号导出脚本（给 Agent 用）。
 *
 * 在运行旧 workbuddy2api 的机器上执行：
 *   node scripts/gateway-export.mjs --dir ~/wb2api/auths --out gateway-accounts.json
 *
 * 产物是 { format: "workbuddy-accounts", accounts: [{account, auth}] }，
 * 可以直接拖进「一人公司 → 网关 → 导入导出 → 上传 JSON 导入」。
 *
 * 兼容：
 * - 原网关 auths/workbuddy-*.json（{account, auth} 嵌套）
 * - cockpit 扁平格式（uid / nickname / access_token / refresh_token）
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

function arg(name, fallback = '') {
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  const prefixed = process.argv.find((item) => item.startsWith(`--${name}=`));
  return prefixed ? prefixed.split('=').slice(1).join('=') : fallback;
}

const rawDir = arg('dir', join(homedir(), 'wb2api', 'auths'));
const dir = rawDir.startsWith('~') ? join(homedir(), rawDir.slice(1)) : resolve(rawDir);
const out = resolve(arg('out', 'gateway-accounts.json'));

const files = (await readdir(dir).catch(() => [])).filter((name) => name.endsWith('.json'));
if (!files.length) {
  console.error(`没有在 ${dir} 找到 *.json。请用 --dir 指向原网关的 auths 目录。`);
  process.exit(1);
}

const accounts = [];
const skipped = [];
for (const file of files) {
  try {
    const raw = JSON.parse(await readFile(join(dir, file), 'utf8'));
    const account = raw.account && typeof raw.account === 'object' ? raw.account : raw;
    const auth = raw.auth && typeof raw.auth === 'object' ? raw.auth : raw;
    const uid = String(account.uid || account.user_id || raw.uid || '').trim();
    const accessToken = String(auth.accessToken || auth.access_token || raw.access_token || '').trim();
    const refreshToken = String(auth.refreshToken || auth.refresh_token || raw.refresh_token || '').trim();
    if (!uid || !accessToken) {
      skipped.push({ file, reason: '缺少 uid 或 accessToken' });
      continue;
    }
    accounts.push({
      account: {
        uid,
        nickname: String(account.nickname || account.name || uid),
        enterpriseId: String(account.enterpriseId || account.enterprise_id || ''),
        ...(String(raw.realm || account.realm || '').toLowerCase() === 'global' ? { realm: 'global' } : {}),
      },
      auth: {
        accessToken,
        refreshToken,
        expiresAt: auth.expiresAt || auth.expires_at || raw.expires_at || 0,
      },
    });
  } catch (error) {
    skipped.push({ file, reason: error instanceof Error ? error.message : String(error) });
  }
}

const payload = {
  format: 'workbuddy-accounts',
  version: 1,
  source: 'gateway-export',
  exportedAt: new Date().toISOString(),
  accounts,
};
await writeFile(out, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`已导出 ${accounts.length} 个账号 → ${out}`);
if (skipped.length) console.log(`跳过 ${skipped.length} 个：${skipped.map((item) => `${item.file}（${item.reason}）`).join('；')}`);
console.log('接下来：把文件交给一人公司工作台 → 网关 → 导入导出 → 上传 JSON 导入。');
