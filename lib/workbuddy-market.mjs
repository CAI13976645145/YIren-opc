/**
 * WorkBuddy 专家 / 技能市场读数。
 *
 * WorkBuddy 桌面端把市场首屏缓存在 ~/.workbuddy/storage/<user>/scoped/<scope>/
 *   - skill-market.json：技能市场分类与 use_stat（使用量 / 安装量）
 *   - swr.json：expert-market:experts（专家市场与 useCount）
 * 这里只读缓存，不调用 WorkBuddy 的登录接口，也不执行市场包里的脚本。
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { randomInt } from 'node:crypto';
import { scanWorkbuddyExperts } from './expert-import.mjs';

const CACHE_TTL_MS = 5 * 60_000;
let cache = { at: 0, value: null };

const SKILLHUB_BASE = 'https://lightmake.site';
let remoteSkillCache = { at: 0, items: [], total: 0 };

function normalizeRemoteSkill(raw) {
  const slug = String(raw?.slug || raw?.name || '').trim();
  const name = String(raw?.name || raw?.displayName || slug).trim();
  if (!name && !slug) return null;
  const namespace = raw?.namespace && typeof raw.namespace === 'object'
    ? String(raw.namespace.canonicalName || raw.namespace.publicSlug || raw.namespace.handle || '')
    : '';
  return {
    id: String(raw?.id || slug || name),
    type: 'skill',
    name: slug || name,
    displayName: String(raw?.displayName || raw?.display_name || name),
    description: String(raw?.description_zh || raw?.description || ''),
    useCount: Number(raw?.downloads) || 0,
    installCount: Number(raw?.installs) || 0,
    stars: Number(raw?.stars) || 0,
    version: String(raw?.version || ''),
    icon: String(raw?.iconUrl || raw?.icon_url || ''),
    categories: [raw?.category, ...(Array.isArray(raw?.subCategories) ? raw.subCategories : []), ...(Array.isArray(raw?.tags) ? raw.tags : [])]
      .filter(Boolean).map(String),
    namespace,
    publisher: String(raw?.publisher || raw?.ownerName || ''),
    source: 'skillhub',
    sourceLabel: 'SkillHub 技能市场',
    updatedAt: raw?.updated_at ? new Date(Number(raw.updated_at)).toISOString() : '',
  };
}

async function remoteJson(path) {
  const response = await fetch(`${SKILLHUB_BASE}${path}`, {
    signal: AbortSignal.timeout(10_000),
    headers: { accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`SkillHub HTTP ${response.status}`);
  return response.json();
}

async function readRemoteSkillTop(force = false) {
  if (!force && remoteSkillCache.items.length && Date.now() - remoteSkillCache.at < CACHE_TTL_MS) return remoteSkillCache;
  try {
    const payload = await remoteJson('/api/skills?page=1&pageSize=100&sortBy=downloads&order=desc');
    const rows = Array.isArray(payload?.data?.skills) ? payload.data.skills : [];
    const items = rows.map(normalizeRemoteSkill).filter(Boolean);
    remoteSkillCache = { at: Date.now(), items, total: Number(payload?.data?.total) || items.length };
  } catch {
    /* 网络不可用时继续用本地缓存 */
  }
  return remoteSkillCache;
}

async function searchRemoteSkills(query, limit) {
  try {
    const payload = await remoteJson(`/api/v1/search?q=${encodeURIComponent(query)}&limit=${Math.max(1, Math.min(50, Number(limit) || 20))}`);
    const rows = Array.isArray(payload?.results) ? payload.results : [];
    return rows.map(normalizeRemoteSkill).filter(Boolean);
  } catch {
    return [];
  }
}

function zh(value, fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value.zh || value.en || fallback;
}

async function latestFile(paths) {
  let best = null;
  for (const path of paths) {
    try {
      const info = await stat(path);
      if (!info.isFile()) continue;
      if (!best || info.mtimeMs > best.mtimeMs) best = { path, mtimeMs: info.mtimeMs };
    } catch {
      /* 不存在就跳过 */
    }
  }
  return best?.path || '';
}

async function storageScopes() {
  const base = join(homedir(), '.workbuddy', 'storage');
  if (!existsSync(base)) return [];
  const scopes = [];
  let users = [];
  try {
    users = await readdir(base, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const user of users) {
    if (!user.isDirectory()) continue;
    const scopedRoot = join(base, user.name, 'scoped');
    let scoped = [];
    try {
      scoped = await readdir(scopedRoot, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const item of scoped) {
      if (item.isDirectory()) scopes.push(join(scopedRoot, item.name));
    }
  }
  return scopes;
}

function normalizeSkill(raw) {
  const name = String(raw?.name || raw?.skill_id || '').trim();
  if (!name) return null;
  const stat = raw.use_stat || {};
  return {
    id: String(raw.skill_id || `wb-skill-${name}`),
    type: 'skill',
    name,
    displayName: zh(raw.display_name_zh || raw.display_name, name),
    description: zh(raw.description_zh || raw.description, ''),
    useCount: Number(stat.use_count) || 0,
    installCount: Number(stat.install_count) || 0,
    version: String(raw.version || ''),
    icon: String(raw.icon || ''),
    categories: Array.isArray(raw.categories) ? raw.categories.map(String) : [],
    source: 'workbuddy-market',
    sourceLabel: 'WorkBuddy 技能市场',
    updatedAt: String(raw.updated_at || ''),
  };
}

function normalizeExpert(raw) {
  const marketId = String(raw?.marketExpertId || raw?.sourceId || raw?.id || '').trim();
  const name = zh(raw?.displayName || raw?.name, '');
  if (!marketId || !name) return null;
  return {
    id: `wb-expert-${marketId}`,
    marketExpertId: marketId,
    type: 'expert',
    name,
    profession: zh(raw.profession, '专家'),
    description: zh(raw.description, ''),
    useCount: Number(raw.useCount) || 0,
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => zh(tag)).filter(Boolean) : [],
    categoryId: String(raw.categoryId || ''),
    plugin: String(raw.plugin || ''),
    version: String(raw.version || ''),
    avatar: String(raw.avatar || ''),
    source: 'workbuddy-market',
    sourceLabel: 'WorkBuddy 专家市场',
    updatedAt: String(raw.updatedAt || ''),
  };
}

async function readSkillMarket() {
  const scopes = await storageScopes();
  const path = await latestFile(scopes.map((scope) => join(scope, 'skill-market.json')));
  if (!path) return [];
  let doc;
  try {
    doc = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return [];
  }
  const items = [];
  for (const value of Object.values(doc || {})) {
    if (!value || typeof value !== 'object') continue;
    const buckets = [
      ...(Array.isArray(value.skills) ? value.skills : []),
      ...(Array.isArray(value.featured?.skills) ? value.featured.skills : []),
      ...(Array.isArray(value.primaryList?.skills) ? value.primaryList.skills : []),
    ];
    for (const raw of buckets) {
      const skill = normalizeSkill(raw);
      if (skill) items.push(skill);
    }
  }
  return dedupe(items, (item) => item.id || item.name);
}

async function readExpertMarket() {
  const scopes = await storageScopes();
  const candidates = [];
  for (const scope of scopes) {
    const path = join(scope, 'swr.json');
    if (!existsSync(path)) continue;
    try {
      const info = await stat(path);
      candidates.push({ path, mtimeMs: info.mtimeMs });
    } catch {
      /* ignore */
    }
  }
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  for (const { path } of candidates) {
    let doc;
    try {
      doc = JSON.parse(await readFile(path, 'utf8'));
    } catch {
      continue;
    }
    const key = Object.keys(doc || {}).find((item) => item.includes('expert-market:experts'));
    const rows = key ? doc[key]?.data : null;
    if (!Array.isArray(rows) || !rows.length) continue;
    return dedupe(rows.map(normalizeExpert).filter(Boolean), (item) => item.marketExpertId);
  }
  // 没有市场缓存时退回本地专家包（热度记为 0）。
  const local = await scanWorkbuddyExperts().catch(() => ({ candidates: [] }));
  return (local.candidates || []).map((item) => ({
    id: `wb-expert-local-${item.packageName}`,
    marketExpertId: '',
    type: 'expert',
    name: item.name,
    profession: item.profession || '专家',
    description: item.description || '',
    useCount: 0,
    tags: item.skills || [],
    categoryId: '',
    plugin: item.packageName,
    version: item.packageVersion,
    avatar: '',
    source: 'workbuddy-local',
    sourceLabel: 'WorkBuddy 本地专家包',
    updatedAt: '',
  }));
}

function dedupe(items, keyOf) {
  const map = new Map();
  for (const item of items) {
    const key = keyOf(item);
    if (!key) continue;
    const previous = map.get(key);
    if (!previous || (item.useCount || 0) > (previous.useCount || 0)) map.set(key, item);
  }
  return [...map.values()];
}

export async function loadWorkbuddyMarket(force = false) {
  if (!force && cache.value && Date.now() - cache.at < CACHE_TTL_MS) return cache.value;
  const [localSkills, experts, remote] = await Promise.all([
    readSkillMarket(),
    readExpertMarket(),
    readRemoteSkillTop(),
  ]);
  const skills = dedupe([...remote.items, ...localSkills], (item) => item.name || item.displayName);
  const value = {
    skills,
    experts,
    skillTotal: remote.total || skills.length,
    expertTotal: experts.length,
    readAt: new Date().toISOString(),
  };
  cache = { at: Date.now(), value };
  return value;
}

function queryTokens(query) {
  const parts = String(query || '')
    .split(/[\s,，、/|;；:：()（）]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2);
  const tokens = new Set(parts);
  // 中文岗位名常连写（研发工程师）：补二元词，避免整串匹配不到任何市场条目。
  for (const part of parts) {
    if (/[\u4e00-\u9fa5]/.test(part) && part.length >= 4) {
      for (let index = 0; index <= part.length - 2; index += 1) tokens.add(part.slice(index, index + 2));
    }
  }
  return [...tokens];
}

function scoreMatch(item, query) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const text = [
    item.name,
    item.displayName,
    item.profession,
    item.description,
    ...(item.tags || []),
    ...(item.categories || []),
  ].filter(Boolean).join(' ').toLowerCase();
  let score = text.includes(q) ? 6 : 0;
  for (const token of queryTokens(query)) {
    if (token && text.includes(token.toLowerCase())) score += 1;
  }
  if (score === 0) return 0;
  if (String(item.name || '').toLowerCase().includes(q)) score += 3;
  if (String(item.displayName || '').toLowerCase().includes(q)) score += 2;
  return score;
}

export async function searchWorkbuddyMarket({ type = 'all', query = '', limit = 20, sort = 'hot' } = {}) {
  const market = await loadWorkbuddyMarket();
  const rows = [];
  if (type !== 'expert') {
    const remote = query ? await searchRemoteSkills(query, Math.max(limit, 20)) : [];
    for (const item of [...remote, ...market.skills]) {
      const match = scoreMatch(item, query);
      if (match > 0) rows.push({ ...item, match });
    }
  }
  if (type !== 'skill') {
    for (const item of market.experts) {
      const match = scoreMatch(item, query);
      if (match > 0) rows.push({ ...item, match });
    }
  }
  rows.sort((a, b) => (sort === 'hot' ? (b.match || 0) - (a.match || 0) || b.useCount - a.useCount : a.name.localeCompare(b.name, 'zh-CN')));
  return rows.slice(0, Math.max(1, Math.min(100, Number(limit) || 20)));
}

export async function topWorkbuddyMarket(type, limit = 10) {
  const market = await loadWorkbuddyMarket();
  const rows = type === 'expert' ? market.experts : market.skills;
  return [...rows].sort((a, b) => b.useCount - a.useCount).slice(0, Math.max(1, Math.min(50, Number(limit) || 10)));
}

export async function findWorkbuddyItem(type, id) {
  const key = String(id || '').trim();
  if (!key) return null;
  const market = await loadWorkbuddyMarket();
  if (type === 'expert') {
    return market.experts.find((item) => item.id === key || item.marketExpertId === key) || null;
  }
  const local = market.skills.find((item) => item.id === key || item.name === key || item.displayName === key);
  if (local) return local;
  // 搜索页返回的技能可能不在市场 TOP100 里，按 slug/name 再查一次远端搜索。
  const remote = await searchRemoteSkills(key, 20);
  return remote.find((item) => item.id === key || item.name === key || item.displayName === key)
    || remote[0]
    || null;
}

export async function pickRandomWorkbuddy(type, { limit = 10, query = '' } = {}) {
  const rows = query
    ? (await searchWorkbuddyMarket({ type, query, limit: 50 })).sort((a, b) => b.useCount - a.useCount)
    : await topWorkbuddyMarket(type, limit);
  const pool = rows.slice(0, Math.max(1, Math.min(10, Number(limit) || 10)));
  if (!pool.length) return null;
  return pool[randomInt(pool.length)];
}
