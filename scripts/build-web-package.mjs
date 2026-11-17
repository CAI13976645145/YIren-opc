import fs from 'node:fs';
import path from 'node:path';

const src = 'C:/Users/蔡/WorkBuddy/2026-11-14-16-28-12/one-company';
const pkg = JSON.parse(fs.readFileSync(path.join(src, 'package.json'), 'utf8'));
const version = pkg.version;
const dst = path.join(src, 'dist', `一人公司-Web-${version}`);
fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(path.join(dst, 'app'), { recursive: true });
for (const item of ['server.mjs', 'package.json', 'lib', 'mcp', 'presets', 'scripts', 'public', 'vendor']) {
  fs.cpSync(path.join(src, item), path.join(dst, 'app', item), { recursive: true });
}
fs.mkdirSync(path.join(dst, 'app', 'data'), { recursive: true });
fs.copyFileSync(path.join(src, 'data', 'seed.json'), path.join(dst, 'app', 'data', 'seed.json'));
fs.copyFileSync(path.join(src, 'data', 'settings.json'), path.join(dst, 'app', 'data', 'settings.json'));
fs.copyFileSync(path.join(src, 'docs', '使用指南.html'), path.join(dst, '使用指南.html'));

const startBat = [
  '@echo off',
  'chcp 65001 >nul',
  'title 一人公司',
  'cd /d "%~dp0"',
  'echo 正在启动 Web 客户端...',
  'start "一人公司 Web" /min cmd /c "cd /d "%~dp0app" && node server.mjs"',
  'timeout /t 2 >nul',
  'echo 正在启动 AI 运行时（首次可能需要下载，请稍候）...',
  'start "一人公司 DSH" /min cmd /c "cd /d "%~dp0app" && node scripts\\start-dsh.mjs"',
  'timeout /t 3 >nul',
  'start "" http://127.0.0.1:4399',
  'exit /b 0',
  '',
].join('\r\n');
fs.writeFileSync(path.join(dst, '启动一人公司.bat'), startBat);

const stopBat = [
  '@echo off',
  'chcp 65001 >nul',
  'title 停止一人公司',
  'for %%p in (4399 3081 7863) do (',
  '  for /f "tokens=5" %%a in (\'netstat -ano ^| findstr :%%p ^| findstr LISTENING\') do (',
  '    taskkill /PID %%a /T /F >nul 2>&1',
  '  )',
  ')',
  'echo 已停止。',
  'pause',
  '',
].join('\r\n');
fs.writeFileSync(path.join(dst, '停止一人公司.bat'), stopBat);

fs.writeFileSync(
  path.join(dst, '说明.txt'),
  [
    '一人公司 · Web 客户端（免安装）',
    `版本 ${version}`,
    '',
    '双击「启动一人公司.bat」启动 Web 与 AI 运行时，浏览器打开 http://127.0.0.1:4399',
    '双击「停止一人公司.bat」停止。',
    '',
    '首次打开会自动弹出模型配置向导：填 API 端点 / 密钥 / 模型 ID 即可。',
    '数据在 app\\data，首次启动为空白公司（仅保留秘书与人事行政专员）。',
    '',
    '注意：Web 包不含 AI 运行时，需要本机 Node.js 18+，首次启动会用 npx 下载 DSH。',
    '完全离线请使用 Electron 安装版（已内嵌 DSH + Node 运行时）。',
  ].join('\r\n'),
);

console.log('web package built:', dst);
