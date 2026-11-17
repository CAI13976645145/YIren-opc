#!/usr/bin/env node
/**
 * 把 electron-builder 的构建产物发布到 GitHub Releases。
 *
 * 用法：
 *   GITHUB_TOKEN=ghp_xxx node scripts/publish-github-release.mjs [构建目录]
 *
 * 不传构建目录时，自动挑选 dist-electron-v* 中版本号最新的一个。
 * 需要的文件：一人公司-Setup-<version>.exe、.exe.blockmap、latest.yml
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OWNER = 'CAI13976645145';
const REPO = 'YIren-opc';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

if (!TOKEN) {
  console.error('缺少 GITHUB_TOKEN（需要 repo / contents:write 权限）');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'desktop', 'package.json'), 'utf8'));
const version = pkg.version;
const tag = `v${version}`;

function resolveDistDir() {
  const arg = process.argv[2];
  if (arg) return path.resolve(arg);
  const dirs = fs
    .readdirSync(ROOT)
    .filter((name) => /^dist-electron-v\d+$/.test(name))
    .map((name) => ({ name, mtime: fs.statSync(path.join(ROOT, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  if (!dirs.length) throw new Error('找不到 dist-electron-v* 构建目录');
  return path.join(ROOT, dirs[0].name);
}

const distDir = resolveDistDir();
const exeName = `OneCompany-Setup-${version}.exe`;
const localFiles = [exeName, `${exeName}.blockmap`, 'latest.yml'].map((name) => path.join(distDir, name));
for (const file of localFiles) {
  if (!fs.existsSync(file)) throw new Error(`缺少构建产物：${file}`);
}

// latest.yml 里的文件名是 electron-builder 生成的 ASCII 安全名（中文 artifactName 会被转写），
// Release 资产必须按这个名字上传，否则客户端更新会 404。
const latestYml = fs.readFileSync(path.join(distDir, 'latest.yml'), 'utf8');
const declared = latestYml.match(/^\s*-\s*url:\s*(.+)$/m) || latestYml.match(/^path:\s*(.+)$/m);
if (!declared) throw new Error('latest.yml 里找不到安装包文件名');
const remoteExe = declared[1].trim();

const assets = [
  { file: localFiles[0], name: remoteExe },
  { file: localFiles[1], name: `${remoteExe}.blockmap` },
  { file: localFiles[2], name: 'latest.yml' },
];

async function api(url, options = {}) {
  const res = await fetch(url.startsWith('http') ? url : `https://api.github.com${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'one-company-release-script',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const message = body && body.message ? body.message : String(body).slice(0, 300);
    const error = new Error(`${res.status} ${message}`);
    error.status = res.status;
    throw error;
  }
  return body;
}

async function ensureRelease() {
  try {
    const existing = await api(`/repos/${OWNER}/${REPO}/releases/tags/${tag}`);
    console.log(`复用已有 Release：${tag}`);
    return existing;
  } catch (error) {
    if (error.status !== 404) throw error;
  }
  console.log(`创建 Release：${tag}`);
  return api(`/repos/${OWNER}/${REPO}/releases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tag_name: tag,
      target_commitish: 'main',
      name: `一人公司 ${version}`,
      body: `自动更新版本 ${version}\n\n- 安装包：${exeName}\n- 更新清单：latest.yml`,
      draft: false,
      prerelease: false,
    }),
  });
}

async function uploadAsset(release, asset) {
  const { file, name } = asset;
  const old = (release.assets || []).find((item) => item.name === name);
  if (old) {
    await api(`/repos/${OWNER}/${REPO}/releases/assets/${old.id}`, { method: 'DELETE' });
    console.log(`覆盖旧资产：${name}`);
  }
  const data = fs.readFileSync(file);
  const uploadUrl = `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`;
  const result = await api(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(data.length) },
    body: data,
  });
  console.log(`已上传：${name} (${(data.length / 1024 / 1024).toFixed(1)} MB)`);
  return result;
}

const release = await ensureRelease();
for (const asset of assets) await uploadAsset(release, asset);
console.log(`\n完成：https://github.com/${OWNER}/${REPO}/releases/tag/${tag}`);
