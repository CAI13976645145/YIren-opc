/**
 * 从本机 WorkBuddy 的专家包目录读取专家内容。
 * 只读取 manifest 与 agent markdown，不执行专家包里的脚本。
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative, resolve } from 'node:path';

const PALETTE = ['#0d9488', '#3b82f6', '#6366f1', '#d97706', '#dc2626', '#0f766e', '#7c3aed', '#0891b2'];

function pickZh(value, fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value.zh || value.en || fallback;
}

function compareVersion(a, b) {
  const pa = String(a).split(/[.-]/).map((item) => Number(item) || 0);
  const pb = String(b).split(/[.-]/).map((item) => Number(item) || 0);
  for (let index = 0; index < Math.max(pa.length, pb.length); index += 1) {
    const diff = (pa[index] || 0) - (pb[index] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function stripFrontmatter(text) {
  return String(text || '')
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/^#\s+.*$/m, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function readPackage(packageDir, version) {
  const root = join(packageDir, version);
  const manifestPath = [
    join(root, '.codebuddy-plugin', 'plugin.json'),
    join(root, 'plugin.json'),
  ].find((path) => existsSync(path));
  if (!manifestPath) return null;
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    return null;
  }
  const agentRel = Array.isArray(manifest.agents) ? manifest.agents[0] : '';
  const agentPath = agentRel ? resolve(root, agentRel) : '';
  let agentText = '';
  if (agentPath && existsSync(agentPath)) {
    try {
      agentText = await readFile(agentPath, 'utf8');
    } catch {
      agentText = '';
    }
  }
  if (!agentText) {
    const fallbackAgent = join(root, 'agents', `${manifest.agentName || manifest.name}.md`);
    if (existsSync(fallbackAgent)) {
      try {
        agentText = await readFile(fallbackAgent, 'utf8');
      } catch {
        agentText = '';
      }
    }
  }
  const prompt = stripFrontmatter(agentText);
  const description = pickZh(manifest.displayDescription, manifest.description || '');
  const tags = Array.isArray(manifest.tags)
    ? manifest.tags.map((tag) => pickZh(tag)).filter(Boolean)
    : [];
  const skills = Array.from(
    new Set([
      ...tags,
      ...(Array.isArray(manifest.skills) ? manifest.skills.map((item) => String(item).split('/').filter(Boolean).pop()) : []),
    ]),
  ).filter(Boolean);
  const packageName = String(manifest.name || packageDir.split(/[/\\]/).pop());
  return {
    packageName,
    packageVersion: String(manifest.version || version),
    packagePath: root,
    manifestPath,
    agentPath,
    avatarPath: manifest.avatar ? resolve(root, manifest.avatar) : '',
    name: pickZh(manifest.displayName, packageName),
    title: pickZh(manifest.profession, '专家'),
    profession: pickZh(manifest.profession, '专家'),
    description,
    bio: description.slice(0, 240),
    type: manifest.expertType === 'team' ? '团队' : '专家',
    tags,
    skills: skills.slice(0, 12),
    quickPrompts: Array.isArray(manifest.quickPrompts)
      ? manifest.quickPrompts.map((item) => pickZh(item)).filter(Boolean).slice(0, 6)
      : [],
    promptExcerpt: prompt.slice(0, 1600),
    promptLength: prompt.length,
    source: 'workbuddy',
    sourceLabel: 'WorkBuddy 本地专家',
    importedAt: '',
  };
}

export async function scanWorkbuddyExperts() {
  const home = homedir();
  const roots = [
    join(home, '.workbuddy', 'plugins', 'cache', 'experts'),
    join(home, '.workbuddy', 'plugins', 'cache', 'my-experts'),
  ];
  const candidates = [];
  const seen = new Set();
  const scanned = [];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    scanned.push(root);
    let packages = [];
    try {
      packages = await readdir(root, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const pkg of packages) {
      if (!pkg.isDirectory()) continue;
      const packageDir = join(root, pkg.name);
      let versions = [];
      try {
        versions = (await readdir(packageDir, { withFileTypes: true })).filter((item) => item.isDirectory());
      } catch {
        continue;
      }
      const sorted = versions.map((item) => item.name).sort(compareVersion).reverse();
      for (const version of sorted) {
        const item = await readPackage(packageDir, version);
        if (!item) continue;
        if (seen.has(item.packageName)) break;
        seen.add(item.packageName);
        const color = PALETTE[candidates.length % PALETTE.length];
        candidates.push({
          ...item,
          id: `wb-${item.packageName}`,
          color,
          status: '可调用',
          rating: 0,
          rate: '',
          employeeIds: [],
          projectIds: [],
          enabled: true,
        });
        break;
      }
    }
  }
  candidates.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  return { candidates, scanned, total: candidates.length };
}

export function relativeToHome(path) {
  if (!path) return '';
  try {
    return relative(homedir(), path) || path;
  } catch {
    return path;
  }
}
