const { app, BrowserWindow, Tray, Menu, dialog, shell, nativeImage, ipcMain, desktopCapturer, screen } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const { spawn } = require('node:child_process');

const APP_PORT = Number(process.env.OC_PORT || 4399);
const APP_URL = `http://127.0.0.1:${APP_PORT}`;
const isDev = !app.isPackaged;
const ROOT = isDev ? path.join(__dirname, '..') : path.join(process.resourcesPath, 'app');
const USER_DATA = app.getPath('userData');
const DATA_ROOT_FILE = path.join(USER_DATA, 'data-root.json');
let DATA_ROOT = USER_DATA;
let DATA_DIR = path.join(USER_DATA, 'data');
let LOG_DIR = path.join(USER_DATA, 'logs');

let mainWindow = null;
let tray = null;
let serverProcess = null;
let dshProcess = null;
let dshRestarts = 0;
let restartingDsh = false;
let dshPatchMtime = 0;
let quitting = false;
let serverReady = false;
let dshStatus = 'stopped';
let updateConfig = null;

/* ---------------- 数据目录 ---------------- */
function defaultDataRoot() {
  if (process.platform === 'win32' && fs.existsSync('D:\\')) {
    return 'D:\\一人公司工作区';
  }
  return path.join(app.getPath('documents'), '一人公司工作区');
}

function readDataRoot() {
  try {
    const value = JSON.parse(fs.readFileSync(DATA_ROOT_FILE, 'utf8'));
    return value && value.dataRoot ? String(value.dataRoot) : '';
  } catch {
    return '';
  }
}

function writeDataRoot(root) {
  fs.mkdirSync(USER_DATA, { recursive: true });
  fs.writeFileSync(DATA_ROOT_FILE, `${JSON.stringify({ dataRoot: root, updatedAt: new Date().toISOString() }, null, 2)}\n`, 'utf8');
}

function applyDataRoot(root) {
  DATA_ROOT = root;
  DATA_DIR = path.join(root, 'data');
  LOG_DIR = path.join(root, 'logs');
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

async function chooseDataRoot() {
  const result = await dialog.showOpenDialog({
    title: '选择数据存放位置',
    defaultPath: defaultDataRoot(),
    buttonLabel: '使用这个目录',
    properties: ['openDirectory', 'createDirectory'],
  });
  if (result.canceled || !result.filePaths[0]) return '';
  return path.join(result.filePaths[0], '一人公司工作区');
}

/**
 * 首次启动选择数据位置：
 * - 已有旧数据：默认迁移到 D:\一人公司工作区，或继续用原目录
 * - 全新安装：默认 D:\一人公司工作区，也可另选
 * 选定的根目录下放 data/ 与 logs/。
 */
async function prepareDataRoot() {
  const configured = readDataRoot();
  if (configured) {
    try {
      applyDataRoot(configured);
      return;
    } catch (error) {
      console.warn('配置的数据目录不可用，改用默认目录：', error.message);
    }
  }

  const fallback = defaultDataRoot();
  const legacyData = path.join(USER_DATA, 'data');
  const hasLegacy = fs.existsSync(path.join(legacyData, 'store.json'));

  let root = fallback;
  if (hasLegacy) {
    const answer = await dialog.showMessageBox({
      type: 'question',
      title: '数据存放位置',
      message: '检测到已有数据，要迁移到新的工作区吗？',
      detail: `默认新工作区：${fallback}\n\n数据会包含公司、员工、项目、任务、记忆、审批和上传文件。迁移会复制一份，原目录保留。`,
      buttons: ['迁移到新工作区', '继续使用原目录', '选择其他目录'],
      defaultId: 0,
      cancelId: 1,
    });
    if (answer.response === 2) {
      const chosen = await chooseDataRoot();
      if (chosen) root = chosen;
    } else if (answer.response === 1) {
      root = USER_DATA;
    }
    if (root !== USER_DATA) {
      const nextData = path.join(root, 'data');
      if (path.resolve(nextData) !== path.resolve(legacyData)) {
        try {
          fs.cpSync(legacyData, nextData, { recursive: true, force: false, errorOnExist: false });
        } catch (error) {
          dialog.showErrorBox('迁移数据失败', `${error.message}\n将先继续使用原目录。`);
          root = USER_DATA;
        }
      }
    }
  } else {
    const answer = await dialog.showMessageBox({
      type: 'question',
      title: '选择数据存放位置',
      message: '一人公司的数据放在哪里？',
      detail: `默认：${fallback}\n\n公司、员工、项目、任务、记忆、审批和上传文件都会保存在这里。也可以点「选择其他目录」。`,
      buttons: ['使用默认位置', '选择其他目录'],
      defaultId: 0,
      cancelId: 0,
    });
    if (answer.response === 1) {
      const chosen = await chooseDataRoot();
      if (chosen) root = chosen;
    }
  }

  applyDataRoot(root);
  writeDataRoot(root);
}

ipcMain.handle('oc:open-data-dir', () => shell.openPath(DATA_DIR));
ipcMain.handle('oc:get-data-dir', () => DATA_DIR);
function missingInstallFiles() {
  return [
    path.join(ROOT, 'server.mjs'),
    path.join(ROOT, 'scripts', 'start-dsh.mjs'),
    path.join(ROOT, 'public', 'index.html'),
    path.join(process.resourcesPath, 'dsh', 'node.exe'),
  ].filter((file) => !fs.existsSync(file));
}
ipcMain.handle('oc:capture-screen', async () => {
  const display = screen.getPrimaryDisplay();
  const width = Math.min(3840, Math.max(1280, Math.round(display.size.width * (display.scaleFactor || 1))));
  const height = Math.min(2160, Math.max(720, Math.round(display.size.height * (display.scaleFactor || 1))));
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width, height },
    fetchWindowIcons: false,
  });
  const source = sources.find((item) => String(item.display_id) === String(display.id)) || sources[0];
  if (!source || source.thumbnail.isEmpty()) throw new Error('没有找到可截图的屏幕');
  return `data:image/png;base64,${source.thumbnail.toPNG().toString('base64')}`;
});

function ensureDirs() {
  for (const dir of [    DATA_DIR,
    LOG_DIR,
    path.join(DATA_DIR, 'workspaces', 'employees'),
    path.join(DATA_DIR, 'workspaces', 'company'),
    path.join(DATA_DIR, 'workspaces', 'projects'),
    path.join(DATA_DIR, 'workspaces', 'stations'),
    path.join(DATA_DIR, 'backups'),
    path.join(DATA_DIR, 'runtime'),
    path.join(DATA_DIR, 'uploads'),
    path.join(DATA_DIR, 'outbox'),
    path.join(DATA_DIR, 'memory'),
    path.join(DATA_DIR, 'reports'),
    path.join(DATA_DIR, 'server-logs'),
    path.join(DATA_DIR, 'shadow-repos'),
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }
  for (const file of ['seed.json', 'settings.json']) {
    const target = path.join(DATA_DIR, file);
    if (!fs.existsSync(target)) {
      const source = path.join(ROOT, 'data', file);
      if (fs.existsSync(source)) fs.copyFileSync(source, target);
    }
  }
}

function logStream(name) {
  const file = path.join(LOG_DIR, `${name}.log`);
  return fs.createWriteStream(file, { flags: 'a' });
}

/* ---------------- 服务进程 ---------------- */
function startServer() {
  if (serverProcess) return;
  const out = logStream('server');
  serverProcess = spawn(process.execPath, [path.join(ROOT, 'server.mjs')], {
    cwd: ROOT,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      PORT: String(APP_PORT),
      OC_DATA_DIR: DATA_DIR,
      OC_DESKTOP: '1',
      NO_PROXY: '127.0.0.1,localhost',
      no_proxy: '127.0.0.1,localhost',
    },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  serverProcess.stdout.pipe(out);
  serverProcess.stderr.pipe(out);
  serverProcess.on('exit', (code) => {
    serverReady = false;
    serverProcess = null;
    if (!quitting) {
      updateTray();
      dialog.showErrorBox('一人公司服务已退出', `本地服务异常退出（code ${code}）。\n日志：${path.join(LOG_DIR, 'server.log')}`);
    }
  });
}

/**
 * DSH 通过项目的 scripts/start-dsh.mjs 启动：
 * 它负责读取同一份 data/settings.json、生成 --patch 参数、注入多模型服务凭据
 * 以及把本机可用 Python 前置到 PATH。这样桌面端与命令行启动行为完全一致。
 */
async function startDsh() {
  if (process.env.OC_SKIP_DSH === '1') {
    dshStatus = 'external';
    updateTray();
    return;
  }
  if (dshProcess) return;
  // 已经有外部 DSH 在跑时直接复用，避免端口冲突
  if (await checkHealth('http://127.0.0.1:3081/opc-runtime/v1/health')) {
    dshStatus = 'external';
    updateTray();
    return;
  }
  dshStatus = 'starting';
  updateTray();
  const out = logStream('dsh');
  const launcher = path.join(ROOT, 'scripts', 'start-dsh.mjs');
  const errorLog = path.join(LOG_DIR, 'dsh.log');
  if (!fs.existsSync(launcher)) {
    dshStatus = 'stopped';
    updateTray();
    dialog.showErrorBox('AI 运行时缺失', `找不到启动脚本：${launcher}`);
    return;
  }
  dshProcess = spawn(process.execPath, [launcher], {
    cwd: ROOT,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      OC_DATA_DIR: DATA_DIR,
      OPC_APPROVAL_URL: APP_URL,
      NO_PROXY: '127.0.0.1,localhost',
      no_proxy: '127.0.0.1,localhost',
    },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  dshProcess.stdout.pipe(out);
  dshProcess.stderr.pipe(out);
  dshProcess.on('error', (error) => {
    dshProcess = null;
    dshStatus = 'stopped';
    updateTray();
    dialog.showErrorBox('AI 运行时启动失败', `${error.message}\n日志：${errorLog}`);
  });
  dshProcess.on('exit', (code) => {
    dshProcess = null;
    dshStatus = 'stopped';
    updateTray();
    if (restartingDsh) {
      // 由 restartDsh() 统一拉起，避免双重启动
      return;
    }
    if (!quitting && dshRestarts < 3) {
      dshRestarts += 1;
      setTimeout(() => startDsh(), 4000);
    }
  });
  // 通过健康检查标记为 running
  const timer = setInterval(() => {
    checkHealth('http://127.0.0.1:3081/opc-runtime/v1/health')
      .then((ok) => {
        if (ok) {
          dshStatus = 'running';
          updateTray();
          clearInterval(timer);
        }
      })
      .catch(() => {});
  }, 3000);
}

/** Windows 下父进程退出不会带走 npx → dsh 子进程，必须整棵树杀。 */
function killTree(pid) {
  if (!pid) return;
  if (process.platform === 'win32') {
    spawn('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  } else {
    try {
      process.kill(-pid, 'SIGTERM');
    } catch {
      try {
        process.kill(pid, 'SIGTERM');
      } catch {
        /* ignore */
      }
    }
  }
}

/** 找到监听指定端口的进程并结束整棵树（用于清理上次残留的 DSH）。 */
function killPortOccupant(port) {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32' ? 'netstat.exe' : 'lsof';
    const args = process.platform === 'win32' ? ['-ano'] : ['-ti', 'tcp:' + port];
    const child = spawn(cmd, args, { windowsHide: true });
    let out = '';
    child.stdout.on('data', (chunk) => {
      out += chunk.toString();
    });
    child.on('close', () => {
      const pids = new Set();
      if (process.platform === 'win32') {
        for (const line of out.split(/\r?\n/)) {
          if (!line.includes(':' + port) || !line.includes('LISTENING')) continue;
          const parts = line.trim().split(/\s+/);
          const pid = Number(parts[parts.length - 1]);
          if (Number.isFinite(pid) && pid > 0 && pid !== process.pid) pids.add(pid);
        }
      } else {
        for (const line of out.split(/\r?\n/)) {
          const pid = Number(line.trim());
          if (Number.isFinite(pid) && pid > 0) pids.add(pid);
        }
      }
      for (const pid of pids) killTree(pid);
      resolve(pids.size);
    });
    child.on('error', () => resolve(0));
  });
}

/** 保存模型设置后补丁会变，自动重启 AI 运行时让新配置立即生效。 */
function restartDsh(reason = '') {
  dshRestarts = 0;
  if (!dshProcess) {
    void startDsh();
    return;
  }
  restartingDsh = true;
  try {
    const log = logStream('dsh');
    log.write(`\n[main] ${new Date().toISOString()} ${reason || '手动重启'}，正在重启 AI 运行时\n`);
  } catch {
    /* ignore */
  }
  const pid = dshProcess.pid;
  killTree(pid);
  dshProcess = null;
  setTimeout(() => {
    restartingDsh = false;
    void startDsh();
  }, 2000);
}

/** 轮询模型补丁：服务端保存模型服务后会重写该文件。 */
function watchModelPatch() {
  const patch = path.join(DATA_DIR, 'runtime', 'dsh-model.patch.yml');
  try {
    dshPatchMtime = fs.statSync(patch).mtimeMs;
  } catch {
    dshPatchMtime = 0;
  }
  setInterval(() => {
    let mtime = 0;
    try {
      mtime = fs.statSync(patch).mtimeMs;
    } catch {
      mtime = 0;
    }
    if (mtime && mtime !== dshPatchMtime) {
      dshPatchMtime = mtime;
      restartDsh('模型配置已更新');
    }
  }, 3000);
}

/* ---------------- 健康检查 ---------------- */
function checkHealth(url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 1500 }, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await checkHealth(`${APP_URL}/api/health`)) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

/* ---------------- 窗口 ---------------- */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#f6f7f9',
    title: '一人公司',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'splash.html'));
  mainWindow.once('ready-to-show', () => {
    if (!process.argv.includes('--hidden')) mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!quitting) {
      event.preventDefault();
      mainWindow.hide();
      if (tray && !app.__trayHintShown) {
        app.__trayHintShown = true;
        tray.displayBalloon?.({
          title: '一人公司还在运行',
          content: '窗口已收起到托盘，右键托盘图标可以退出。',
        });
      }
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

async function loadApp() {
  const ok = await waitForServer();
  if (!ok) {
    dialog.showErrorBox(
      '一人公司启动失败',
      `本地服务在 30 秒内没有就绪。\n请检查日志：${path.join(LOG_DIR, 'server.log')}`,
    );
    return;
  }
  serverReady = true;
  if (mainWindow && !mainWindow.isDestroyed()) {
    await mainWindow.loadURL(APP_URL);
    if (!process.argv.includes('--hidden')) mainWindow.show();
  }
  updateTray();
}

/* ---------------- 托盘 ---------------- */
function updateTray() {
  if (!tray) return;
  const statusText = serverReady ? '服务运行中' : '服务启动中…';
  const dshText =
    dshStatus === 'running'
      ? 'DSH 运行中'
      : dshStatus === 'starting'
        ? 'DSH 启动中…'
        : dshStatus === 'external'
          ? 'DSH 已外部运行'
          : 'DSH 未运行';
  tray.setToolTip(`一人公司 · ${statusText} · ${dshText}`);
  const autoStart = app.getLoginItemSettings().openAtLogin;
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: '打开一人公司', click: () => showWindow() },
      { label: `${statusText} · ${dshText}`, enabled: false },
      { type: 'separator' },
      { label: '重启本地服务', click: () => restartServer() },
      { label: '重启 AI 运行时', click: () => restartDsh('托盘手动重启') },
      {
        label: '开机自启',
        type: 'checkbox',
        checked: autoStart,
        click: (item) => setAutoStart(item.checked),
      },
      { label: '检查更新', click: () => checkForUpdates(true) },
      { type: 'separator' },
      { label: '打开数据目录', click: () => shell.openPath(DATA_DIR) },
      { label: '打开日志目录', click: () => shell.openPath(LOG_DIR) },
      { type: 'separator' },
      { label: '退出', click: () => quitApp() },
    ]),
  );
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png'));
  tray = new Tray(icon);
  tray.on('click', () => showWindow());
  updateTray();
}

function showWindow() {
  if (!mainWindow) createWindow();
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

async function restartServer() {
  if (serverProcess) {
    const old = serverProcess;
    serverProcess = null;
    old.kill();
  }
  serverReady = false;
  updateTray();
  startServer();
  await loadApp();
}

/* ---------------- 自启 / 更新 ---------------- */
function setAutoStart(enabled) {
  app.setLoginItemSettings({
    openAtLogin: enabled,
    path: process.execPath,
    args: ['--hidden'],
  });
  updateTray();
}

function readUpdateConfig() {
  if (updateConfig) return updateConfig;
  const file = path.join(USER_DATA, 'update.json');
  try {
    updateConfig = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    updateConfig = null;
  }
  return updateConfig;
}

let updateProgressWindow = null;

/** 下载更新时显示一个置顶小窗，避免 153MB 下载期间看起来像卡死。 */
function openUpdateProgress(version) {
  if (updateProgressWindow && !updateProgressWindow.isDestroyed()) return updateProgressWindow;
  const win = new BrowserWindow({
    width: 460,
    height: 190,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    show: false,
    backgroundColor: '#0f172a',
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true },
  });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;font-family:"Microsoft YaHei",sans-serif;background:#0f172a;color:#e2e8f0;padding:24px;box-sizing:border-box}
    h2{margin:0 0 8px;font-size:15px;font-weight:600}
    #sub{font-size:12px;color:#94a3b8;margin-bottom:16px;line-height:1.5}
    .track{height:8px;background:#1e293b;border-radius:999px;overflow:hidden}
    #bar{height:100%;width:0%;background:linear-gradient(90deg,#38bdf8,#6366f1);transition:width .2s}
    #pct{margin-top:10px;font-size:12px;color:#cbd5e1;display:flex;justify-content:space-between;gap:12px}
  </style></head><body>
    <h2>正在下载更新 ${version}</h2>
    <div id="sub">下载完成后会自动安装并重启，请不要关闭客户端。</div>
    <div class="track"><div id="bar"></div></div>
    <div id="pct"><span id="left">0%</span><span id="right"></span></div>
    <script>
      window.setProgress = (percent, right) => {
        document.getElementById('bar').style.width = percent + '%';
        document.getElementById('left').textContent = percent + '%';
        document.getElementById('right').textContent = right || '';
      };
      window.setMessage = (title, sub) => {
        document.querySelector('h2').textContent = title;
        if (sub) document.getElementById('sub').textContent = sub;
      };
    </script>
  </body></html>`;
  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
  win.once('ready-to-show', () => win.show());
  win.on('closed', () => {
    updateProgressWindow = null;
  });
  updateProgressWindow = win;
  return win;
}

async function checkForUpdates(manual = false) {
  const config = readUpdateConfig();
  try {
    const { autoUpdater } = require('electron-updater');
    // 优先用开发者写入的 update.json（自定义静态更新源）；
    // 没有时用安装包内 electron-builder 生成的 app-update.yml（GitHub Releases 等）。
    if (config && config.url) {
      autoUpdater.setFeedURL({ provider: config.provider || 'generic', url: config.url });
    } else {
      const packagedFeed = path.join(process.resourcesPath, 'app-update.yml');
      if (!fs.existsSync(packagedFeed)) {
        if (manual) {
          dialog.showMessageBox({
            type: 'info',
            title: '检查更新',
            message: '当前安装包还没有配置更新源',
            detail:
              `可以在 ${path.join(USER_DATA, 'update.json')} 写入 ` +
              '{"url":"https://your-server/updates/"}，或使用带 app-update.yml 的正式发布包。当前版本：' +
              app.getVersion(),
          });
        }
        return;
      }
    }
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    // 直接全量下载：0.40.x 的旧 blockmap 没有随新版本发布，差量请求只会多一次 404 和等待
    autoUpdater.disableDifferentialDownload = true;
    autoUpdater.autoRunAppAfterInstall = true;
    autoUpdater.logger = console;
    const result = await autoUpdater.checkForUpdates();
    if (!result || !result.updateInfo) return;
    if (result.updateInfo.version === app.getVersion()) {
      if (manual) {
        dialog.showMessageBox({ type: 'info', title: '检查更新', message: '当前已是最新版本', detail: app.getVersion() });
      }
      return;
    }
    const answer = await dialog.showMessageBox({
      type: 'question',
      buttons: ['下载并安装', '稍后'],
      defaultId: 0,
      title: '发现新版本',
      message: `新版本 ${result.updateInfo.version} 可用`,
      detail: `当前版本 ${app.getVersion()}，安装包约 153MB，下载完成后会自动安装并重启。`,
    });
    if (answer.response !== 0) return;
    openUpdateProgress(result.updateInfo.version);
    autoUpdater.on('download-progress', (progress) => {
      const win = updateProgressWindow;
      if (!win || win.isDestroyed()) return;
      const percent = Math.max(0, Math.min(100, Math.round(Number(progress?.percent) || 0)));
      const left = `${(Number(progress?.transferred) / 1024 / 1024).toFixed(0)} / ${(Number(progress?.total) / 1024 / 1024).toFixed(0)} MB`;
      const speed = progress?.bytesPerSecond ? `${(Number(progress.bytesPerSecond) / 1024 / 1024).toFixed(1)} MB/s` : '';
      win.webContents
        .executeJavaScript(`window.setProgress(${percent}, ${JSON.stringify(`${left}  ${speed}`)})`)
        .catch(() => {});
    });
    autoUpdater.once('update-downloaded', () => {
      const win = updateProgressWindow;
      if (win && !win.isDestroyed()) {
        win.webContents
          .executeJavaScript("window.setMessage('下载完成，正在安装…', '客户端会关闭并自动重启，请稍候')")
          .catch(() => {});
      }
      setTimeout(() => autoUpdater.quitAndInstall(false, true), 900);
    });
    try {
      await autoUpdater.downloadUpdate();
    } catch (error) {
      if (updateProgressWindow && !updateProgressWindow.isDestroyed()) updateProgressWindow.destroy();
      dialog.showMessageBox({
        type: 'error',
        title: '下载更新失败',
        message: '更新包下载失败',
        detail: `${error && error.message ? error.message : error}\n\n可以稍后重试，或到 GitHub Releases 手动下载安装包。`,
      });
    }
  } catch (error) {
    if (manual) {
      dialog.showMessageBox({
        type: 'warning',
        title: '检查更新失败',
        message: '无法连接更新源',
        detail: String(error && error.message ? error.message : error),
      });
    }
  }
}

/* ---------------- 生命周期 ---------------- */
function quitApp() {
  quitting = true;
  try {
    if (serverProcess) serverProcess.kill();
    if (dshProcess) killTree(dshProcess.pid);
  } catch {
    /* ignore */
  }
  app.quit();
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => showWindow());

  app.whenReady().then(async () => {
    const missing = missingInstallFiles();
    if (missing.length) {
      dialog.showErrorBox(
        '安装不完整',
        `缺少以下文件：\n${missing.join('\n')}\n\n请先通过托盘退出旧版本，再重新运行安装包覆盖安装。`,
      );
      app.quit();
      return;
    }
    await prepareDataRoot();
    ensureDirs();
    createTray();
    createWindow();
    // 如果端口上已经有服务（开发/重复启动），直接复用
    // 接管本地 AI 运行时端口：上次残留或外部实例会导致模型配置不生效
    await killPortOccupant(3081);
    const already = await checkHealth(`${APP_URL}/api/health`);
    if (!already) startServer();
    startDsh();
    watchModelPatch();
    await loadApp();
    setTimeout(() => checkForUpdates(false), 8000);
  });

  app.on('window-all-closed', (event) => {
    // 托盘常驻，不退出
    event.preventDefault?.();
  });

  app.on('before-quit', () => {
    quitting = true;
  });

  app.on('activate', () => showWindow());
}
