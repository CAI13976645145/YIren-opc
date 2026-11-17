/**
 * 把 DSH 运行时（node.exe + node_modules + profile）整理成可随 Electron 安装包分发的目录。
 *
 * 产物：
 *   dsh-bundle/
 *     node.exe
 *     node_modules/            @deepseek-ai/dsh 及全部依赖
 *     profile/profiles/opc-workbench/
 *     manifest.json
 *
 * 用法：node scripts/prepare-dsh-bundle.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const root = fileURLToPath(new URL('../', import.meta.url));
const DSH_VERSION = process.env.OC_DSH_VERSION || '0.2.2-rc.1';
const dst = path.join(root, 'dsh-bundle');

function log(msg) {
  console.log(`[dsh-bundle] ${msg}`);
}

/** 在 npx 缓存里找已下载的 dsh 包 */
function findDshPackage() {
  const explicit = process.env.OC_DSH_PACKAGE_DIR;
  if (explicit && fs.existsSync(path.join(explicit, '@deepseek-ai', 'dsh', 'package.json'))) {
    return path.join(explicit, '@deepseek-ai', 'dsh');
  }
  const cacheRoots = [
    path.join(os.homedir(), 'AppData', 'Local', 'npm-cache', '_npx'),
    path.join(os.homedir(), '.npm', '_npx'),
  ];
  for (const cacheRoot of cacheRoots) {
    if (!fs.existsSync(cacheRoot)) continue;
    for (const entry of fs.readdirSync(cacheRoot)) {
      const candidate = path.join(cacheRoot, entry, 'node_modules', '@deepseek-ai', 'dsh');
      const pkgPath = path.join(candidate, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.version === DSH_VERSION) return candidate;
      } catch {
        /* ignore */
      }
    }
  }
  throw new Error(`没有找到 @deepseek-ai/dsh@${DSH_VERSION}，请先运行一次 npm run dsh 让它下载`);
}

function dirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSize(full);
    else if (entry.isFile()) total += fs.statSync(full).size;
  }
  return total;
}

/** 这些目录只对其他平台有用，删掉可减小安装包 */
const PRUNE_PATTERNS = [
  /node_modules[\\/]node-pty[\\/]prebuilds[\\/](darwin|linux|win32-arm64)/i,
  /node_modules[\\/]@img[\\/]sharp-wasm32/i,
];

function copyTree(src, dest) {
  fs.cpSync(src, dest, {
    recursive: true,
    dereference: true,
    filter: (source) => !PRUNE_PATTERNS.some((rule) => rule.test(source)),
  });
}

async function main() {
  const reuseModules =
    process.env.OC_DSH_REBUILD !== '1' &&
    fs.existsSync(path.join(dst, 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js'));
  if (reuseModules) {
    log('复用已有 node_modules，跳过重新复制');
  } else {
    log('清理旧产物');
    fs.rmSync(dst, { recursive: true, force: true });
  }
  fs.mkdirSync(dst, { recursive: true });

  const dshPkg = findDshPackage();
  const nodeModules = path.resolve(dshPkg, '..', '..');
  log(`使用 DSH：${dshPkg}`);
  log(`依赖目录：${nodeModules}`);

  // 1. Node 运行时（dsh 要求 node >= 24.9）
  const localNode = path.join(path.dirname(process.execPath), 'node.exe');
  const nodeExe = fs.existsSync(localNode) ? localNode : process.execPath;
  if (!fs.existsSync(path.join(dst, 'node.exe'))) fs.copyFileSync(nodeExe, path.join(dst, 'node.exe'));
  log(`Node 运行时：${nodeExe}（${(fs.statSync(nodeExe).size / 1024 / 1024).toFixed(0)} MB）`);

  // 2. node_modules
  if (!reuseModules) {
    log('复制 node_modules（约 900 MB，需要 1-3 分钟）…');
    const targetModules = path.join(dst, 'node_modules');
    copyTree(nodeModules, targetModules);
    log('node_modules 复制完成');
  }

  // 3. profile（默认角色卡 / 运行时桥 / 探针）
  const profileSrc = path.join(os.homedir(), '.dsh', 'profiles', 'opc-workbench');
  if (!fs.existsSync(profileSrc)) throw new Error(`找不到 dsh profile：${profileSrc}`);
  const profileDst = path.join(dst, 'profile', 'profiles', 'opc-workbench');
  fs.mkdirSync(profileDst, { recursive: true });
  for (const file of ['cordis.yml', 'cordis.patch.yml']) {
    fs.copyFileSync(path.join(profileSrc, file), path.join(profileDst, file));
  }

  // 3.1 本地插件包实体化（原 profile 用 link: 指向开发目录，换机器会失效）
  const localMap = [
    ['employee-presets', path.join(root, 'presets', 'employee-presets')],
    ['opc-probe', path.join(os.homedir(), 'WorkBuddy', '2026-11-14-03-11-04', 'opc-workbench', 'experiments', 'minimal-host-plugin')],
    ['opc-runtime-bridge', path.join(os.homedir(), 'WorkBuddy', '2026-11-14-03-11-04', 'opc-workbench', 'dsh', 'opc-runtime-bridge')],
  ];
  const localDst = path.join(profileDst, 'node_modules', '@local');
  fs.mkdirSync(localDst, { recursive: true });
  for (const [name, source] of localMap) {
    if (!fs.existsSync(source)) throw new Error(`缺少本地插件包：${source}`);
    fs.cpSync(source, path.join(localDst, name), { recursive: true, dereference: true });
    log(`实体化插件：@local/${name}`);
  }

  // 3.2 package.json 改写为相对 link，避免带出构建机的绝对路径
  const profilePkg = JSON.parse(fs.readFileSync(path.join(profileSrc, 'package.json'), 'utf8'));
  profilePkg.dependencies = {
    '@local/employee-presets': 'link:./node_modules/@local/employee-presets',
    '@local/opc-probe': 'link:./node_modules/@local/opc-probe',
    '@local/opc-runtime-bridge': 'link:./node_modules/@local/opc-runtime-bridge',
  };
  fs.writeFileSync(path.join(profileDst, 'package.json'), `${JSON.stringify(profilePkg, null, 2)}\n`);

  // 4. manifest
  const manifest = {
    dshVersion: DSH_VERSION,
    nodeVersion: process.version,
    builtAt: new Date().toISOString(),
    sizeBytes: dirSize(dst),
  };
  fs.writeFileSync(path.join(dst, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  log(`完成：${dst}`);
  log(`总大小：${(manifest.sizeBytes / 1024 / 1024).toFixed(0)} MB`);
}

main().catch((error) => {
  console.error(`[dsh-bundle] 失败：${error.message}`);
  process.exit(1);
});
