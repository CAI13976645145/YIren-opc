import { spawn } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
// 桌面端会把数据目录放到用户目录（OC_DATA_DIR），这里必须读同一份设置
const dataDir = process.env.OC_DATA_DIR ? resolve(process.env.OC_DATA_DIR) : join(root, 'data');
const settingsPath = join(dataDir, 'settings.json');
const patchPath = join(dataDir, 'runtime', 'dsh-model.patch.yml');
const DSH_VERSION = process.env.OC_DSH_VERSION || '0.2.2-rc.1';

/** 与服务端 providerKeyEnv 保持一致 */
function providerKeyEnv(id) {
  return `OPC_MODEL_KEY_${String(id || 'provider')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toUpperCase()}`;
}

/**
 * 员工终端（PowerShell）继承宿主 PATH。Windows 上 PATH 里可能残留已删除的
 * Python 版本，导致 python 指向不存在的 exe。这里把本机实际可用的最新版本前置。
 */
async function preferredPythonDir() {
  const base = join(homedir(), '.workbuddy', 'binaries', 'python', 'versions');
  try {
    const dirs = (await readdir(base))
      .filter((name) => existsSync(join(base, name, 'python.exe')))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return dirs.length ? join(base, dirs[dirs.length - 1]) : '';
  } catch {
    return '';
  }
}

let settings = {};
try {
  settings = JSON.parse(await readFile(settingsPath, 'utf8'));
} catch {
  /* 没有设置文件时按原 profile 启动 */
}

let providers = (Array.isArray(settings.providers) ? settings.providers : []).filter(
  (item) => item && item.enabled !== false && item.baseUrl && Array.isArray(item.models) && item.models.length,
);
// 兼容只有顶层字段的老设置（服务端还没迁移落盘时也能启动）
if (!providers.length && settings.baseUrl && settings.model) {
  providers = [
    {
      id: settings.provider || 'custom',
      name: settings.provider || '自定义模型 API',
      baseUrl: settings.baseUrl,
      apiKey: settings.apiKey || '',
      enabled: true,
      models: [{ id: settings.model, name: settings.model }],
    },
  ];
}
const hasModel = providers.length > 0 || Boolean(settings.model && settings.baseUrl);
const patchExists = hasModel && existsSync(patchPath);
if (patchExists) console.log(`使用模型配置：${patchPath}`);
else if (hasModel) console.log('没有生成模型配置补丁，按原 profile 启动');
else console.log('尚未配置模型服务，按原 profile 启动（启动后在界面里完成模型配置）');

const env = { ...process.env };
// 多模型服务：每家一个凭据环境变量，dsh 按 provider 解析
for (const provider of providers) {
  if (provider.apiKey) env[providerKeyEnv(provider.id)] = provider.apiKey;
}
// 兼容单 provider 老配置
if (settings.apiKey) env.OPC_MODEL_API_KEY = settings.apiKey;

const pythonDir = await preferredPythonDir();
if (pythonDir) {
  env.PATH = `${pythonDir}${delimiter}${env.PATH || env.Path || ''}`;
  env.Path = env.PATH;
  console.log(`员工终端 Python：${pythonDir}`);
}
// 本地回环不走系统代理，避免公司工具与审批回调被代理拦截
env.NO_PROXY = '127.0.0.1,localhost';
env.no_proxy = '127.0.0.1,localhost';
// 审批策略：默认启用 DSH Auto review（逐次 AI 审查）；设置里关掉则退回旧的人工闸门
env.OPC_AUTO_REVIEW =
  settings.approvalPolicy && settings.approvalPolicy.autoReview === false ? '0' : '1';
if (!env.OPC_APPROVAL_URL) env.OPC_APPROVAL_URL = `http://127.0.0.1:${process.env.PORT || 4399}`;

/** 内置 DSH 运行时：resources/dsh（打包后）或仓库根目录 dsh-bundle（开发）。 */
function findDshBundle() {
  const candidates = [
    process.env.OC_DSH_BUNDLE,
    join(root, '..', 'dsh'),
    join(root, 'dsh-bundle'),
  ].filter(Boolean);
  for (const dir of candidates) {
    if (
      existsSync(join(dir, 'node.exe')) &&
      existsSync(join(dir, 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js'))
    ) {
      return dir;
    }
  }
  return '';
}

/** DSH 的用户目录：放 profile、日志、凭据，不写进安装目录。 */
function resolveDshHome() {
  return process.env.OC_DSH_HOME ? resolve(process.env.OC_DSH_HOME) : join(dataDir, 'dsh-home');
}

/**
 * 首次启动复制内置 profile；升级时同步本地插件代码并补齐必需的 bundle。
 * 早期版本只在首次启动复制，导致升级后仍跑旧版 opc-runtime-bridge。
 */
const REQUIRED_BUNDLES = [
  '@deepseek-ai/dsh-base',
  '@deepseek-ai/dsh-web-app',
  '@local/employee-presets',
  '@local/opc-probe',
  '@local/opc-runtime-bridge',
];
const LOCAL_PLUGIN_DIRS = ['employee-presets', 'opc-probe', 'opc-runtime-bridge'];

function ensureProfile(bundleDir, dshHome) {
  const source = join(bundleDir, 'profile', 'profiles', 'opc-workbench');
  const target = join(dshHome, 'profiles', 'opc-workbench');
  const fresh = !existsSync(join(target, 'package.json')) || process.env.OC_DSH_PROFILE_RESET === '1';
  mkdirSync(dirname(target), { recursive: true });
  if (fresh) {
    cpSync(source, target, { recursive: true, force: true });
    console.log(`已初始化 DSH profile：${target}`);
    return;
  }
  // 升级：权限/审批配置随安装包更新（默认 danger-full-access + 不询问审批）
  for (const name of ['cordis.patch.yml']) {
    const from = join(source, name);
    const to = join(target, name);
    if (!existsSync(from)) continue;
    try {
      cpSync(from, to, { force: true });
    } catch (error) {
      console.warn(`同步 DSH 配置失败（${name}）：`, error instanceof Error ? error.message : String(error));
    }
  }
  // 升级：本地插件（审批桥）随安装包更新
  for (const name of LOCAL_PLUGIN_DIRS) {
    const from = join(source, 'node_modules', '@local', name);
    const to = join(target, 'node_modules', '@local', name);
    if (!existsSync(from)) continue;
    try {
      cpSync(from, to, { recursive: true, force: true });
    } catch (error) {
      console.warn(`同步本地插件失败（${name}）：`, error instanceof Error ? error.message : String(error));
    }
  }
  // 补齐 bundle：Auto review 插件是 0.31 新增的审批方式
  try {
    const pkgPath = join(target, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    pkg.dsh = pkg.dsh && typeof pkg.dsh === 'object' ? pkg.dsh : {};
    pkg.dsh.profile = pkg.dsh.profile && typeof pkg.dsh.profile === 'object' ? pkg.dsh.profile : {};
    const bundles = Array.isArray(pkg.dsh.profile.bundles) ? pkg.dsh.profile.bundles : [];
    const added = REQUIRED_BUNDLES.filter((item) => !bundles.includes(item));
    if (added.length) {
      pkg.dsh.profile.bundles = [...bundles, ...added];
      writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
      console.log(`已更新 DSH profile bundles：${added.join(', ')}`);
    }
  } catch (error) {
    console.warn('更新 DSH profile 失败：', error instanceof Error ? error.message : String(error));
  }
  // 权限预设：老 profile 没有显式 defaultPreset，Windows 上会因“组合不匹配任何预设”启动失败，
  // 审批事件只留在 DSH 对话页。这里给已有 profile 补一次，之后不再重复写。
  try {
    const patchFile = join(target, 'cordis.patch.yml');
    let patchText = readFileSync(patchFile, 'utf8');
    if (!/^\s*-\s*id:\s*permission\b/m.test(patchText)) {
      patchText += [
        '',
        '# 显式声明默认权限预设：否则 Windows 上沙箱默认值 + approval=ask 组合不匹配任何预设，',
        '# permission 插件会启动失败，审批事件只留在 DSH 对话页、进不了公司收件箱。',
        '- id: permission',
        '  name: "@deepseek-ai/dsh-permission-presets"',
        '  config:',
        '    defaultPreset: workspace-write',
        '',
      ].join('\n');
      writeFileSync(patchFile, patchText, 'utf8');
      console.log('已补充 DSH permission 默认预设（workspace-write）');
    }
  } catch (error) {
    console.warn('补充 DSH permission 配置失败：', error instanceof Error ? error.message : String(error));
  }
}

/**
 * 直接调用 npm 自带的 npx-cli.js，绕开 cmd 的引号与中文路径问题。
 * 之前的 shell:true 写法在 "C:\Program Files\nodejs\npx.cmd" 上会报「'C:\Program' 不是内部或外部命令」。
 */
function spawnNpx(npxArgs) {
  const candidates = [
    join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npx-cli.js'),
    join(process.env.ProgramFiles || 'C:\\Program Files', 'nodejs', 'node_modules', 'npm', 'bin', 'npx-cli.js'),
  ];
  const cli = candidates.find((item) => existsSync(item));
  if (cli) {
    return spawn(process.execPath, [cli, ...npxArgs], {
      cwd: root,
      env,
      stdio: 'inherit',
      windowsHide: true,
    });
  }
  return spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', npxArgs, {
    cwd: root,
    env,
    stdio: 'inherit',
    windowsHide: true,
    shell: process.platform === 'win32',
  });
}

const dshArgs = ['--profile', 'opc-workbench', ...(patchExists ? ['--patch', patchPath] : [])];
const bundleDir = findDshBundle();
let child;
if (bundleDir) {
  const dshHome = resolveDshHome();
  ensureProfile(bundleDir, dshHome);
  console.log(`使用内置 DSH：${bundleDir}`);
  const nodeExe = join(bundleDir, 'node.exe');
  const cli = join(bundleDir, 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js');
  child = spawn(nodeExe, [cli, ...dshArgs], {
    cwd: root,
    env: { ...env, DSH_HOME: dshHome },
    stdio: 'inherit',
    windowsHide: true,
  });
} else {
  console.log('未找到内置 DSH 运行时，回退到 npx（需要本机 Node.js）');
  child = spawnNpx(['-y', `@deepseek-ai/dsh@${DSH_VERSION}`, ...dshArgs]);
}

child.on('error', (error) => {
  console.error('启动 dsh 失败：', error.message);
  process.exit(1);
});
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
