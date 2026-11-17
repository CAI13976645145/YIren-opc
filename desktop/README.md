# 一人公司 · 桌面客户端（Electron）

把 Web 客户端 + 原生 DSH 运行时打包成一个桌面应用：托盘常驻、开机自启、自动更新。

## 开发运行

```bash
cd desktop
npm install
npm start
```

开发模式下会直接复用仓库根目录的 `server.mjs`、`public/`、`data/`。

## 打包

```bash
cd desktop
npm run dist        # Windows NSIS 安装包 → ../dist-electron/一人公司-Setup-0.30.0.exe
npm run dist:dir    # 只出免安装目录 → ../dist-electron/win-unpacked
```

产物：

| 文件 | 用途 |
| --- | --- |
| `一人公司-Setup-0.30.0.exe` | 安装版（可选目录、桌面/开始菜单快捷方式） |
| `一人公司-Setup-0.30.0.exe.blockmap` | 增量更新用 |
| `latest.yml` | 自动更新元数据 |
| `win-unpacked/` | 免安装绿色版目录 |

## 内嵌 DSH 运行时

```bash
node scripts/prepare-dsh-bundle.mjs     # 生成 dsh-bundle/（约 948 MB）
node scripts/trim-dsh-bundle.mjs --drop-ts   # 精简到约 325 MB
```

- 从 npx 缓存找到 `@deepseek-ai/dsh@0.2.2-rc.1`，连同 node.exe 一起复制
- 把 profile 的 `@local/*` link 依赖实体化（employee-presets / opc-probe / opc-runtime-bridge）
- 删除 darwin/linux/arm64 的 prebuilds 与 sharp-wasm32，减小体积
- electron-builder 通过 `extraResources` 打进 `resources/dsh`

## 模型配置

- 首次打开（settings.json 为空）会自动弹出三步配置向导：欢迎 → 填 API 端点/密钥/模型 ID → 完成
- 设置 → 模型设置支持多个模型服务：添加 / 编辑 / 删除 / 设为默认 / 测试连接
- 保存后自动重写 `data/runtime/dsh-model.patch.yml`；桌面端 3 秒内检测到变化并重启 DSH
- 旧版本只有一组 provider/baseUrl/apiKey/model 字段，启动时自动迁移成一条「模型服务」，密钥不丢

## 架构

```
Electron 主进程 (main.js)
├─ 子进程：server.mjs（Node 模式，127.0.0.1:4399）
│    └─ 数据放在 %APPDATA%/one-company-desktop/data（可写，不随安装目录）
├─ 子进程：resources/dsh/node.exe + @deepseek-ai/dsh/lib/bin.js --profile opc-workbench（127.0.0.1:3081）
│    ├─ DSH 运行时已内嵌：node.exe(87MB) + node_modules(238MB) + profile，无需本机 Node/npx
│    ├─ DSH_HOME 指向 data/dsh-home，首次启动自动初始化 profile
│    ├─ 找不到内嵌运行时才回退到 npx（开发模式）
│    ├─ 启动前先接管 3081（清理上次残留进程树，避免旧配置继续生效）
│    ├─ 保存模型后监听 data/runtime/dsh-model.patch.yml，自动重启 DSH 加载新配置
│    └─ 托盘提供「重启 AI 运行时」
├─ BrowserWindow → http://127.0.0.1:4399（启动时先显示 splash，服务就绪后切换）
└─ Tray：打开 / 重启服务 / 开机自启 / 检查更新 / 数据目录 / 日志目录 / 退出
```

- 关闭窗口 = 收起到托盘，不退出；托盘右键「退出」才真正结束进程。
- 单实例：重复启动会唤起已运行的窗口。
- 服务异常退出会弹错误框，并给出日志路径。

## 托盘

| 菜单项 | 行为 |
| --- | --- |
| 打开一人公司 | 显示主窗口 |
| 服务状态 | 显示 Web / DSH 当前状态（只读） |
| 重启本地服务 | 重启 Web 子进程并等待就绪 |
| 开机自启 | `app.setLoginItemSettings`，带 `--hidden` 启动 |
| 检查更新 | 有更新源时检查并下载安装；没有则提示配置方法 |
| 打开数据目录 / 日志目录 | 资源管理器打开 |
| 退出 | 结束 Web 与 DSH 子进程并退出 |

## 自动更新

1. 在 `desktop/package.json` 的 `build.publish[0].url` 填你的更新服务器地址（默认是占位地址）。
2. `npm run dist` 后，把以下文件上传到该地址：
   - `latest.yml`
   - `一人公司-Setup-x.y.z.exe`
   - `一人公司-Setup-x.y.z.exe.blockmap`
3. 客户端启动 8 秒后会自动检查一次；也可以托盘 →「检查更新」手动触发。
4. 也可以不改包，直接在用户数据目录放 `update.json`：
   ```json
   { "url": "https://your-server/one-company/updates/" }
   ```

> 自动更新只对**安装版**生效；绿色版目录不会自动替换自身。

## 数据与日志

| 路径 | 内容 |
| --- | --- |
| `%APPDATA%\one-company-desktop\data` | 业务数据（store.json、workspaces、uploads…） |
| `%APPDATA%\one-company-desktop\logs\server.log` | Web 服务日志 |
| `%APPDATA%\one-company-desktop\logs\dsh.log` | DSH 运行时日志 |
| `%APPDATA%\one-company-desktop\update.json` | 可选的更新源配置 |

卸载不会删除数据目录（`deleteAppDataOnUninstall: false`）。

## 环境变量

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `OC_PORT` | `4399` | Web 端口（调试用） |
| `OC_SKIP_DSH` | - | `1` 时不启动内置 DSH（用于只测前端/复用外部 DSH） |

## 已知限制

- DSH 通过本机 `npx` 启动，需要机器上有 Node.js 18+；首次会下载 `@deepseek-ai/dsh@0.2.2-rc.1`（之后走缓存）。
- 没有把 880MB 的 DSH 依赖塞进安装包；如要完全离线，可把 `node_modules` 作为 `extraResources` 一起打包。
- 未做代码签名，Windows SmartScreen 可能提示"未知发布者"。
