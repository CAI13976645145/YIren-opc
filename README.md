# 一人公司 · Web 客户端

独立 Web 客户端，不依赖 company-console，不依赖 dsh 插件。

## 当前进度

- 第 1 步：可运行页面骨架（已完成）
- 第 2 步：本地数据持久化（已完成）
- 第 3 步：接入第一个真实员工会话（已完成）
- 第 4 步：多员工真实会话、项目群协作与工具卡片（已完成）
- 第 5 步：原生角色卡与运行时 cwd / 工具面隔离（已完成）
- 第 6 步：项目群逐字流式、动态角色卡、任务转交、员工档案编辑（已完成）
- 第 7 步：对话建任务、工位交付物、预览与验收闭环（已完成）
- 第 8 步：设置面板、模型 API 配置、Token 用量统计（已完成）
- 第 9 步：项目真实工作区、Git 影子快照与一键回滚（已完成）
- 第 10 步：写前审批、收件箱审批卡与拒绝回传（已完成）
- 第 11 步：L0-L4 审批分级、L1 自动放行与同类授权（已完成）
- 第 12 步：设置页左侧导航、L4 外部动作与本地 outbox（已完成）
- 第 13 步：设置页外部渠道接口：邮件 SMTP / 企业微信机器人 / 通用 Webhook（已完成）
- 第 14 步：左栏公司资产：文档管理、技能、记忆、工具、专家、数据、项目文件（已完成）
- 第 15 步：P0 核心：任务完整模型、员工自主开工、Markdown 记忆、决策卡、真实账本、交付物上传与版本（已完成）
- 第 16 步：多员工并行执行：按员工加锁、并发槽位 1-4、同一员工不并行（已完成）
- 第 17 步：P1：日报周报、会议模式、组织绩效、模型路由、混合检索、模板市场、定时任务、任务级 worktree、预算预警、Office 预览、移动端（已完成）
- 第 18 步：机房：服务器登记、项目服务配置、运行状态、启动/重启/停止与管理台预览（已完成）
- 第 19 步：右栏员工状态与对话入口；机房指标、服务日志与运行配置（已完成）
- 第 20 步：审计日志、团队实体、项目内独立工位、会话中断/继续、任务多交付物、记忆版本冲突、员工归档、账本筛选与耗时、通知中心、机房运维补齐（已完成）
- 第 21 步：预览台：交付物与服务管理台统一预览，收藏与本次历史（已完成）
- 第 22 步：工具 / 技能 / 专家目录、公司内部 MCP 工具、岗位模板招聘、记忆按范围注入、WorkBuddy 专家导入（已完成）
- 第 23 步：全量回归（接口 126 项 + UI 72 项全绿）、修复 dsh 会话上限 32 的 P0、使用指南与回归报告（已完成）
- 第 24 步：新项目端到端验证（员工写代码 → 工位 → 项目工作区 → 交付物 12/12）、任务超时放宽到 5 分钟、中断自动归档部分产出（已完成）
- 第 25 步：L2 写操作自动预审（确定性规则 + AI 预审，对齐 dsh-experimental-auto-review 策略）、员工终端工具（Windows PowerShell / 其他平台 bash）、终端命令分级与审批（已完成）
- 第 26 步：Electron 桌面客户端（托盘 / 单实例 / 开机自启 / 自动更新 / 内置启动 DSH）、NSIS 安装包与免安装目录（已完成）
- 第 27 步：清空演示内容（仅保留秘书与人事行政专员，项目/任务/交付/团队/记忆/账本全部归零），桌面端与 Web 包同步为空白公司（已完成）
- 第 28 步：多模型服务管理（可添加/编辑/删除/切换，本地优先不依赖控制面）、首次启动配置向导、修复桌面端 DSH 启动（npx 路径空格 / 多 provider 凭据 / OC_DATA_DIR）（已完成）
- 第 29 步：DSH 运行时内嵌进安装包（node.exe + node_modules + profile），不依赖本机 Node/npx；首次启动自动初始化 DSH_HOME（已完成）
- 第 30 步：SSH 扫描修复（私钥路径解析 / 密钥下拉 / 错误翻译）、对话滚动保持（已完成）
- 第 31 步：对话页展示思考过程与工具调用、Markdown 规范输出、提问卡自动弹窗、服务器扫描改由秘书执行（已完成）
- 第 32 步：项目下拉自动同步、对话超时 5 分钟并保留部分输出、审批通知自动已读（已完成）
- 第 33 步：业务决策支持自由选择 A/B/C、提问卡改成 DS-Bot 式逐题作答（已完成）
- 第 34 步：审批策略三档 + 风险引擎（只读/低/中自动，红线人工）、任务超时 15 分钟可续跑、左栏版本号（已完成）
- 第 35 步：Auto review 审批（对齐 `@deepseek-ai/dsh-experimental-auto-review` 的 low/medium/high 口径；强制工具调用让模型只提交 risk/decision/reason；low 直接放行、medium 需任务明确授权、high 拒绝并转人工、审查失败 fail-closed）（已完成）
- 第 36 步：公司知识库（服务器/设备/服务/流程/项目参数分类；秘书/人事用 `save_memory` 维护；员工上下文注入全文；服务器登记自动同步；新建项目自动生成参数与流程知识）（已完成）
- 第 37 步：员工工作区直接绑定（默认公司目录 `workspaces/company/employees/<id>`，可填绝对路径）、项目工位改到项目工作区 `workstations/<员工>`、中文输入法回车不再误发送、工具调用整组可折叠（已完成）
- 第 38 步：Ticket / Mandate / Policy 版本（任务带授权范围与依据版本，执行前复核，策略收紧或撤销授权时阻塞；审批策略每次变更生成新版本并写入审批记录；任务列表显示 Ticket 阶段）（已完成）
- 第 39 步：项目归档/删除、数据备份与数据位置（项目页支持归档/恢复/删除；设置→数据备份支持快照、导出 JSON、恢复；安装版首次启动选择数据目录，默认 D:\一人公司工作区）（已完成）
- 第 40 步：交付物版本整合与归档（同一任务多版合并为一张卡、历史版本预览、活跃/待验收/已通过/已打回/已归档筛选、单个/批量归档；删除项目级联归档任务与交付物，不再残留显示）（已完成）
- 第 41 步：模型扫描与能力配置（模型服务编辑器支持扫描 `/models`、自动推测图片/思考能力、逐模型配置图片输入/思考/上下文/最大输出；补丁写入 `input: image` 与 `reasoningEfforts`）（已完成）
- 第 42 步：安装与截图修复（安装包安装前自动结束旧进程，启动时检查 resources/app 与 dsh 完整性；桌面端截图改走主进程 `desktopCapturer`，不再依赖 Electron 不支持的 `getDisplayMedia`）（已完成）
- 第 43 步：项目详情 7 页签（概览收入/成本/用户/进度/月收入图/技术栈/待办；10 类快捷入口悬停复制；收支记录；里程碑与发版自动更新版本；前后端检测历史与续费；资料证书；自动保存笔记）（已完成）
- 第 44 步：公司设备资产（设备类别/型号/序列号/位置/状态/规格/连接/负责人/标签；MCP `list_devices` / `read_device` 让员工按需提取；设备摘要进入公司上下文）（已完成）
- 第 45 步：秘书/人事主动维护（秘书、人事可 `save_tool` 新建工具；招聘权限收归人事，秘书只整理岗位需求；新增 `update_project` / `audit_company` / `repair_company`，公司体检把项目缺口转维护任务；修复对话模型选择被重置）（已完成）
- 第 46 步：员工模型与双域体检、经营账本、任务归档（招聘/新建员工按岗位自动匹配推理/视觉/快速模型并写入员工档案，员工卡片和档案显示当前模型；公司体检拆成项目·秘书域与公司·人事域，覆盖工具/技能/专家/知识库/服务器/设备/员工模型/模型能力/备份；账本新增收入、固定成本、模型成本、毛利、月度趋势、项目损益、成本构成、收支流水、续费日历；任务支持单个/批量归档与恢复）（已完成）
- 第 47 步：提问卡支持自由输入与跳过（逐题作答面板始终显示「其他答案 / 补充说明」输入框；答题弹窗改为真实单选/多选控件 + 自定义输入；多选时自定义内容追加到已选项，单选时覆盖选项；所有题都可「跳过本题」并记为（跳过）；服务端 `ask_user` 默认允许自定义答案）（已完成）
- 第 48 步：右栏优化（移除记忆页签，保留任务/交付/员工/服务器 4 页签并强制单行；任务按执行中→进行中→待办→待验收→阻塞排序，已完成默认折叠到「查看已完成」；任务和交付物整行可点击查看；员工页签显示「正在执行：任务名」）（已完成）
- 第 49 步：人事行政资产维护工具（HR 增加 asset.server / asset.device / asset.company / permission.admin 工具与 server.admin / device.admin / asset.admin / permission.admin 权限；新增 save_server、delete_server、save_service、delete_service、save_device、delete_device、save_skill、save_expert、delete_expert、company_asset_overview MCP 工具；仅人事行政/管理层可用；员工上下文注入资产维护说明）（已完成）
- 第 50 步：思考档位与职责技能（修复流式对话忽略 body.model/reasoningEffort；`chatWithEmployee` 在模型不变时也同步思考档位；补齐快速/低/标准/深度四档，模型不支持思考时提示；模型能力按名称自动标注并写入 reasoningEfforts；秘书/人事默认改为均衡推理模型、中等思考；重写两人职责描述与技能基线，补齐项目管理、项目资料维护、知识库维护、工具/技能/专家目录、服务器台账、服务登记、设备资产、公司资产盘点等技能；提问输入框加渲染签名，5 秒轮询不再重建、不再清空拼音）（已完成）
- 第 51 步：员工之间直接沟通（新增 `employee.contact` 工具并默认授予所有员工；`contact_employee` 支持按员工 ID/姓名找同事、带项目上下文、等待对方回复；沟通记录写入双方对话并标「同事沟通」，同时写审计；MCP 工具超时从 30 秒放宽到 180 秒；修复 DSH 重启后员工预设未重新注册导致回退 standard、以及多个数据目录下 MCP 读到错误 token/端口的问题；预设注册失败会后台重试，聊天/任务/群聊/会议前再兜底注册）（已完成）
- 第 52 步：对话页刷新体验（消息列表按签名增量更新，状态轮询/流式输出不再整块重建历史；流式只更新当前回复气泡；滚动按消息锚点恢复，向上阅读时不被新消息拽到底部；工具卡/思考过程展开状态保留；每个对话记住自己的滚动位置；修复 5 秒员工状态轮询触发整页 render 把对话刷掉）（已完成）
- 第 53 步：同事沟通异步收件箱与清空上下文（contact_employee 对方在忙时立即返回 queued 并入收件箱，对方空闲后自动处理；新增 check_employee_messages 取回复并标记已读；服务重启把 processing 消息恢复为 pending；员工卡新增「清空上下文」清会话和对话但保留项目/任务/记忆；异步队列不再占用 MCP 调用时间，避免工具卡住被中断）（已完成）
- 第 54 步：秘书成为项目总负责人（老板只给目标/边界/最终目的；秘书自主澄清、拆解、派活、跟进、验收、打回返工、继续下一步；新增 review_deliverable 验收工具；员工任务完成后自动生成「验收并推进」任务并自动运行；验收任务使用只读 preset，避免写操作审批卡住；秘书移除 terminal；项目内只读工具允许访问项目根；审批桥支持 agent id/employeeId/cwd 多路匹配，避免审批丢失导致任务卡死；审批策略写入 settings.json 让 DSH 正确关闭 Auto review）（已完成）
- 第 55 步：真实图片→3D→切片基线（ComfyUI 192.168.110.5:8188 用 Trellis.2 图生3D，GLB 11MB/118,964 面；trimesh 转 STL；Snapmaker Orca 2.4.1 + U1 0.4 喷嘴 + 0.2mm 层高 + PLA 输出 56MB G-code，预估 10h36m、约 90.6g；只切片不打印；工作流脚本、订单 schema、报价与客服 SOP 已落到拾光手办项目 workflow/）（已完成）

```bash
cd one-company
npm start
# 浏览器打开 http://127.0.0.1:4399
# 另开一个终端启动 dsh 控制面（会读取设置里的模型配置）：
npm run dsh
```

## 文档

- [使用指南](docs/使用指南.md) —— 从启动、招聘、立项、任务、交付、审批到机房与设置的完整操作手册
- [回归测试报告](docs/回归测试报告.md) —— 测试范围、126 项接口 + 71 项 UI 结果、缺陷与修复、复跑方式

## 回归测试

```bash
# 接口全量回归（需先把沙箱实例起在 4401）
BASE=http://127.0.0.1:4401 npm run test:api

# UI 全按钮回归（需 playwright-cli）
playwright-cli open about:blank --browser=msedge
playwright-cli run-code --filename=tests/ui-regression.playwright.js
playwright-cli close
```

## 页面能力

- 白色圆润画风：浅色底、白色卡片、16-20px 圆角、轻阴影
- 三栏布局：左侧导航 / 中间自适应工作区 / 右侧任务抽屉
- 中栏顶部标题栏贴顶，宽度自适应
- 中栏默认显示交付物，可切换任务、记忆、收件箱、项目、员工、账本、日报周报、会议、组织绩效、团队、自动化、审计日志、通知中心、模板市场、员工工位、预览台
- 左栏「机房」聚合服务器总览与每台服务器入口；「运营中心」聚合日报周报、会议、组织绩效、自动化；「公司资产」聚合文档、技能、记忆、工具、专家、数据、项目文件、模板市场
- 顶部搜索框走服务端混合检索，结果带来源与引用路径
- 底部常驻对话坞：可选择项目或员工，默认秘书 Agent 江叙
- 对话坞顶部有拖拽把手，可手动拉高/拉低，也可一键收起
- 右栏常驻：任务 / 交付 / 记忆 / 服务器 / 员工五个页签
- 交付物按项目筛选，任务可勾选，决策可批准 / 退回
- 新建项目、新建任务、招聘员工均可落库
- 员工卡片支持“编辑档案”，可直接改工具、技能、权限、工位
- 任务行支持“转交”，交接记录会同时写入项目群和接收人员工会话
- 每条员工回复都有“建任务”，任务会记录来源会话、消息 ID、时间和原话摘录
- 任务行支持“交付”，从责任员工工位目录选择文件，挂到任务上等待验收
- 交付物支持文本/图片/PDF 预览、通过、打回；打回必须填原因
- 任务来源可一键跳回原对话并高亮原消息

## 员工与原生角色卡

当前 10 名员工，包含 **沈舟 · 人事行政专员**。

每个员工都有：

| 字段 | 说明 |
|---|---|
| `cwd` | 工位目录，实际落在 `data/workspaces/employees/<id>` |
| `tools` | 可用工具清单 |
| `skills` | 技能清单 |
| `permissions` | 权限清单 |
| `runtimePreset` | 员工编辑后生成的新版原生 preset（如有） |

原生角色卡：

- 10 个内置员工 preset 定义在 `one-company/presets/employee-presets/cordis.patch.yml`
- preset id 为 `emp-jiang`、`emp-shenzhou`、`emp-lin` 等
- 已作为本地 bundle 安装到 `opc-workbench` profile
- 创建会话时同时传入 `cwd` 与 `agentPreset`
- **新建员工**：通过 `POST /opc-runtime/v1/presets` 在运行中的 dsh 动态注册，无需重启
- **编辑员工**：生成 `emp-<id>-r<revision>` 新版 preset，下一轮会话生效，避免和内置 preset 冲突

工具面（运行时强制，不是提示词约束）：

- 没有 `read` 工具的员工，preset 里没有 `read` / `read_image`
- 没有 `write` 工具的员工，preset 里没有 `write` / `edit` / `apply_patch`
- 没有 `web.search` 工具的员工，preset 里没有 Web 工具
- 不挂载 shell / 终端工具，避免员工执行任意命令

## 真实员工会话

- 所有员工 1:1 对话走真实 dsh（`127.0.0.1:3081` 的 opc-runtime-bridge，dsh 0.2.2-rc.1）
- 1:1 回复是 SSE 流式输出，带“正在思考…”与 token 用量
- 工具调用显示为工具卡片（工具名、参数、结果）
- 项目群按项目编制最多 3 名员工顺序真实发言，逐字流式输出，后发言者能看到前一位的回复
- 回复里出现 `@同事姓名` 时，该同事会被加入发言队列，形成真实 A2A 交办
- 群聊里的 `@姓名` 会高亮显示

依赖：本机需要有一个运行中的 dsh 控制面。

```powershell
cd C:\Users\蔡\WorkBuddy\2026-11-14-16-28-12\one-company
npm run dsh
```

`npm run dsh` 会读取 `data/settings.json`：配置了 API Key 时加载 `data/runtime/dsh-model.patch.yml`，否则按原 `opc-workbench` profile 启动。

当前限制：

- 细粒度权限已经在工具层落实为“有没有该工具”；对外发送、付款还没有对应工具，因此暂不做运行时审批流
- 项目群一次最多 4 名员工发言，避免成本失控
- 交付物支持从员工工位收取和桌面本地上传；单文件最大 20MB
- 自动开工默认并发 2，可在任务页调到 1-4；同一员工不会并行接两个任务
- 员工执行任务时如果请求超出项目工作区的写权限，任务会失败并提示调整权限策略
- 桌面客户端（托盘、原生通知、开机自启、自动更新）仍未制作，目前是 Web 页面（移动端已适配）
- P1 模型路由按会话切换模型；成本仍按全局输入/输出单价估算，不按单模型价格分别计算
- 检索的“向量”是本地字符 n-gram 哈希向量，不是大模型 embedding；适合本地零依赖场景，语义泛化有限
- Office 预览只还原文字与表格内容，不还原字体、颜色、图片和版式；旧格式 doc/xls/ppt 不支持
- 会议每轮每位参会员工都是一次真实模型调用；3 人 2 轮就是 6 次，建议控制参会人数与轮次
- 定时任务的站会只创建草稿，不会自动调用模型；日报/周报/巡检/快照会直接执行
- 任务级 worktree 依赖 git；项目工作区需要先有可提交内容，否则任务会阻塞并提示原因
- 移动端按“只读 + 审批 + 决策”设计，隐藏了新建/编辑/开工/转交等写操作入口；完整操作仍在桌面端
- 机房本机服务会用当前系统用户执行你配置的启动/停止命令，只登记可信服务器与命令
- 远程服务的启动/停止依赖系统 `ssh` 命令和免密钥登录；Windows 本机停止进程使用 `taskkill /T /F`
- 服务器状态基于端口 / 健康检查 URL 探测，不代表进程内部一定健康；本机服务日志在 `data/server-logs/`
- 机房指标目前只采集本机 CPU / 内存 / 磁盘 / 运行时长；远程节点指标待接入 SSH 采集
- 服务日志只读取本机 `data/server-logs/`；`autoStart` 目前是登记标记，不会随系统自动启动
- 快照回滚不会删除未跟踪文件；外部目录必须已存在；群聊前后自动快照对超大目录可能较慢
- 所有文件写入都会逐次审批；Auto review 放行的不生成审批卡，转人工的审批超过 10 分钟会自动拒绝
- L4 外部动作目前只写入本地 outbox；设置里已能配置邮件/企业微信/Webhook 接口并测试连接，但批准外发还不会自动调用这些渠道
- 渠道密码与签名密钥以明文保存在本机 `data/settings.json`，接口只回显掩码
- “同类授权”按同一文件生效，不是整个任务目录
- 模型设置写入本机 `data/settings.json`（含 API Key 明文），新会话直接生效；旧会话可重启 dsh 控制面同步进程默认配置
- dsh 控制面重启后旧 session 会失效；应用会自动新建 session，历史消息仍在本地面板，但模型上下文会重新开始
- 动态注册的 preset 只存在于 dsh 进程内；应用重启会重新注册，dsh 重启后也会自动补注册

## 任务与交付物闭环（第 7 步）

1. 员工在对话里给出方案，老板点消息下方“建任务”
2. 任务记录 `source`：来源会话 `chatKey`、消息 ID、发送人、时间、原话摘录
3. 员工用 `write` 工具把产出写进自己的工位目录
4. 老板在任务行点“交付”，从工位文件列表选择文件，填写交付说明
5. 交付物状态变 `待验收`，任务状态变 `待验收`
6. 老板预览内容，选择“通过”或“打回”
7. 通过：交付物 `已通过`，任务 `已完成`
8. 打回：必须填原因，交付物 `已打回`，任务回到 `进行中`，意见自动发回责任员工会话

支持预览：

- 文本：`.md`、`.txt`、`.csv`、`.json`、`.js`、`.ts`、`.html` 等
- 图片：`.png`、`.jpg`、`.jpeg`、`.webp`、`.gif`
- 文档：`.pdf`

文件访问被限制在员工工位目录内，交付物路径同时限制在 `data/` 下。

## 设置与 Token 用量（第 8 步）

左下角“设置”按钮打开设置面板，包含三块：

### 模型设置（DSH 风格）

设置 → 模型设置，按 dsh 的 Models 页面重组：

- 顶部「默认模型」卡片：显示当前提供商、模型名称、模型 ID、连接状态、密钥状态与推理档位
- 「更换模型」打开可搜索的模型选择器，按提供商分组列出 dsh 目录中的全部模型
- 「模型提供商」列表：DeepSeek 账号优先，其次是当前提供商和第三方提供商；每行显示模型数量与可用状态，可展开查看模型
- 当前提供商的编辑卡片：API 密钥（可显示/隐藏，保存后只回显掩码）、API 端点
- 「自定义设置」折叠区：Provider ID、模型 ID、Temperature、Max Tokens、Context Window、输入/输出价格、清除密钥
- 保存后写入 `data/settings.json` 并生成 `data/runtime/dsh-model.patch.yml`
- 新会话会直接使用保存后的默认模型；旧会话可重启 `npm run dsh` 让进程默认配置同步
- 没有 API Key 时，`npm run dsh` 保留原 profile，避免误覆盖当前可用模型

“测试连接”会请求 `{baseUrl}/models`，返回 HTTP 状态、延迟和模型数量。401 会明确提示需要 API Key。

### Token 用量

每次真实模型调用都会记录：

- 时间、员工、项目、来源（1:1 / 项目群）
- 模型与 Provider
- 输入 tokens、输出 tokens、总 tokens、缓存读取 tokens
- 按输入/输出价格估算成本
- sessionId

设置面板显示今日汇总、近 7 日汇总、按员工汇总和最近调用明细。记录保存在 `data/store.json` 的 `usage` 数组中，最多保留 5000 条。

### 运行状态

显示 3081 控制面是否运行、dsh 版本和模型补丁路径。

## 项目真实工作区与快照（第 9 步）

每个项目都有 `workspacePath`：

- 新建项目时可以填写本机已有目录，留空则自动使用 `data/workspaces/projects/<projectId>`
- 项目群会话的 cwd 使用项目工作区，不写个人工位
- 项目群使用独立 session key（`<employeeId>:project:<projectId>`），与员工 1:1 会话分开，互不串上下文
- 交付物从项目工作区收取
- 项目卡显示工作区路径，支持“目录”编辑

Git 影子快照：

- 每个项目一个独立影子仓库：`data/shadow-repos/<projectId>.git`
- 不创建、不修改真实项目里的 `.git`
- 不移动 HEAD，只写 `refs/snapshots/<projectId>/latest`
- 自动排除 `node_modules`、`.git`、`dist`、`build`、日志等
- 支持手动快照、项目创建初始快照、群聊前后自动快照、交付物提交快照
- 回滚使用 `git read-tree --reset -u`，只覆盖快照跟踪的文件；未跟踪文件不会被删除
- 回滚必须二次确认

项目卡操作：

- 快照：立即生成一份影子快照
- 历史：查看快照列表、文件数、commit id
- 目录：修改项目工作区路径

## 写前审批（第 10 步）

员工执行 `write`、`edit`、`apply_patch` 前会先暂停，等待老板在收件箱审批：

1. 桥接插件监听 `tools/pre-execute`
2. 写工具请求 `POST /api/approvals/request`
3. 服务端先做写前快照（项目工作区或员工工位）
4. 收件箱出现“写操作审批”卡，显示员工、项目、工具、文件路径、参数预览、写前快照
5. 老板点“批准写入”，桥接插件放行，文件才真正落盘
6. 老板点“拒绝”，必须填写原因；工具调用失败，文件不会写入，原因回到员工会话

控制面不可用或审批超时会拒绝写操作，不会默认放行。

审批记录保存在 `data/store.json` 的 `approvals` 数组，包含 `pending / approved / rejected` 状态。

## L0-L4 审批分级（第 11 步）

| 级别 | 场景 | 默认策略 |
|---|---|---|
| L0 | 读文件、搜索 | 不进审批，直接放行 |
| L1 | 新建文件 | 默认自动放行，可在设置里关闭 |
| L2 | 修改已有文件、edit | 每次都审批 |
| L3 | apply_patch、批量变更 | 每次都审批，卡片标红 |
| L4 | 外部发送、付款等高风险操作 | 强制审批，不可绕过 |

审批卡会显示级别、员工、项目、工具、文件路径、参数预览和写前快照。

同类授权：

- 批准时可勾选“本会话内该文件不再询问”
- 生成 30 分钟有效的 `approvalGrants`
- 同一会话、同一员工、同一工具、同一文件的 L2 写入会自动放行
- L3/L4 不会使用同类授权自动放行

设置面板新增“写操作审批策略”，可开关 L1 新建文件自动放行；L2-L4 始终需要审批。

## 设置页导航与外部动作（第 12 步）

设置页左侧导航 + 右侧内容：

- 模型设置
- 外部渠道
- 审批策略
- Token 用量
- 运行状态

切换到“Token 用量”或“运行状态”时隐藏保存按钮，避免误保存。

## 外部渠道配置（第 13 步）

设置 → 外部渠道，三组接口配置：

| 渠道 | 配置项 | 连接测试 |
|---|---|---|
| 邮件 SMTP | 主机、端口、SSL/STARTTLS、账号、密码/授权码、发件人、默认收件人 | TCP 端口连通性（不校验账号密码） |
| 企业微信机器人 | Webhook URL | 真实 POST 一条测试文本，检查 errcode |
| 通用 Webhook | URL、Bearer 签名密钥 | 真实 POST 一条 ping，检查 HTTP 状态 |

- 配置保存在 `data/settings.json` 的 `channels` 字段
- 密码和签名密钥保存后在接口中只返回掩码，不回显明文
- 当前只做“配置 + 测试”，L4 外发审批仍写本地 `data/outbox`，不会自动调用这些渠道
- 后续接真实发送时，可直接复用这份配置

L4 外部动作：

- 项目卡新增“外发”
- 支持渠道：邮件、企业微信、Webhook
- 填写收件人、主题、正文
- 生成 L4 审批卡，收件箱审批
- 批准后写入本地 `data/outbox/<id>.json`，记录 `queued-local-outbox`
- 当前是本地演练，不接真实外部渠道，不会真的发邮件或调用 webhook

## 公司资产导航（第 14 步）

左栏新增“公司资产”父级菜单，可折叠展开；展开后包含 7 个入口：

| 入口 | 页面内容 |
|---|---|
| 文档管理 | 公司制度、产品文档、内容脚本、质量标准、经营报告，可预览正文 |
| 技能 | 从员工档案聚合的技能地图，显示掌握员工 |
| 记忆 | 公司 / 项目 / 员工四级 Markdown 记忆 |
| 工具 | 从员工档案聚合的工具面、风险等级与可用员工 |
| 专家 | 内部专家可直接进入对话；外部专家登记与预约 |
| 数据 | 投放、订单、客服、产能、调研等数据集，可查看字段 |
| 项目文件 | 扫描每个项目工作区的真实文件，显示路径、大小与更新时间 |

## P0 核心能力（第 15 步）

### 任务完整模型

- 字段：标题、项目、负责人、状态、优先级、截止、验收标准、前置任务、自动开工、执行记录
- 任务详情可编辑全部字段
- 前置任务未完成时，任务不允许开工
- 执行成功后自动生成交付物并进入待验收

### 员工自主开工

- 任务页右上角开关：`自动开工：开 / 关`
- 开启后调度器每 5 秒检查一次待办队列
- 并发槽位 1-4，默认 2，可在任务页切换
- 不同员工可以同时执行不同任务
- 同一员工同一时间只执行一个任务，避免会话和上下文冲突
- 任务使用独立的 `employee:task` 会话，不污染员工 1:1 上下文
- 执行结果写入项目群和员工会话
- 失败会标记为“阻塞”，并保留失败原因，可手动重跑

### 多员工并行（第 16 步）

- 全局串行锁改为按员工加锁：`employee:<id>`
- 不同员工的任务、1:1 对话、项目群发言互不阻塞
- 任务页显示当前并行数，例如 `并行 2/2`
- 任务卡显示正在执行的员工与任务名
- 服务重启时，之前处于“执行中”的任务会标记为“阻塞”，不会假装还在运行

### 公司记忆

- 记忆落盘到 `data/memory/`，按公司 / 团队 / 项目 / 员工分目录
- 新建记忆后进入 `store.json` 元数据，并写入 Markdown 文件
- 员工上下文会读取最近 8 条记忆摘要
- 交付物验收通过、决策处理完成后会自动写入记忆

### 决策卡

- 员工执行任务时可输出 `DECISION: {...}`，系统自动生成决策卡
- 也支持 `POST /api/decisions` 手动创建
- 决策处理结果会写入项目记忆

### 账本与交付物

- 账本页改为读取真实 `usage` 记录，不再使用种子 ledger
- 支持按项目 / 员工 / 来源查看，并导出 CSV
- 交付物支持从桌面选择文件上传，最大 20MB
- 同一任务多次提交会记录版本号 `v1 / v2 / ...`
- 员工任务产出的文本交付物可直接预览

## P1 能力（第 17 步）

### P1-01 日报 / 周报

- 左栏「运营中心 → 日报周报」
- 日报/周报都是从真实数据聚合，不需要员工再写一遍：任务完成、交付通过/打回、阻塞、模型 tokens/成本、待决策、待审批、预算使用率
- 报告落库 `store.reports`，同时写 Markdown 到 `data/reports/`
- 支持预览、下载 `.md`；保留最近 200 份
- 项目周报按项目分段输出，包含本期完成、进行中、阻塞、交付物与预算

### P1-02 会议模式

- 新建会议：选项目、议程、轮次（1-3）与参会员工（默认带入项目编制）
- 「开始会议」后按轮次逐人真实调用 dsh，逐字流式显示
- 每位员工只看得到自己岗位视角与已有发言，避免复读
- 自动从发言里的 `ACTION: 标题｜负责人｜截止` 解析行动项
- 结束后生成会议纪要，写入项目记忆，并自动生成「转成任务」按钮

### P1-03 组织架构视图

- 左栏「运营中心 → 组织绩效 → 组织架构」
- 团队-项目矩阵：每个员工在哪些项目编制内、当前各项目挂几个任务
- 部门卡片显示汇报关系；员工档案新增「汇报对象」，默认汇报给江叙
- 人员负载 = 进行中 + 待验收任务数，超过 2 个标为高负载

### P1-04 员工绩效

- 同一页「员工绩效」页签，支持近 7 / 30 / 90 天
- 指标：完成任务、交付物、通过/打回、返工率、平均周期、按时率、tokens、真实成本
- 完成任务与交付物按责任员工归集；没有时间戳的历史任务只计入总量，不参与周期与按时率

### P1-05 模型路由

- 设置 → 模型路由
- 规则作用域：员工 / 部门 / 项目 / 优先级 / 默认
- 命中顺序：员工 → 项目 → 部门 → 优先级 → 默认
- 模型目录来自 dsh 控制面：`GET /opc-runtime/v1/models`
- 真实生效：桥接新增 `POST /opc-runtime/v1/sessions/:id/model`，会话下一轮切到指定 provider/model
- 用量记录会写入实际模型、provider 与 `routed` 标记
- 已实测：江叙路由到 `aa / cn:glm-5.3-flash` 后，真实回复与 usage 都记录为新模型

### P1-06 记忆检索

- 顶部搜索框改为服务端检索：全文 BM25 + 本地字符 n-gram 哈希向量（不依赖外部 embedding）
- 覆盖记忆、文档、任务、交付物、项目、员工、对话消息
- 每条结果显示类型、摘要、来源路径与得分；点击可跳到对应页面 / 对话
- `GET /api/search?q=...` 可直接调用

### P1-07 模板市场

- 左栏「公司资产 → 模板市场」
- 内置 4 套项目模板（研发 / 运营 / 知识工作 / 内容生产）、6 套岗位模板、4 套验收模板
- 项目模板可直接应用到项目，按岗位关键词匹配现有员工并生成任务
- 岗位模板可带入招聘表单；验收模板可查看并复制到任务验收标准
- 支持 JSON 导入 / 导出，自定义模板落 `store.customTemplates`

### P1-08 定时任务

- 左栏「运营中心 → 自动化」
- 支持每天 / 每周 / 固定间隔
- 动作：创建站会草稿、生成日报、生成周报、项目快照、控制面巡检
- 内置演示：每日早会、每日经营日报、周五项目周报、控制面巡检（默认暂停）
- 调度器每 20 秒检查一次，执行记录保留最近 300 条
- 站会只创建草稿，不自动调用模型；日报/周报/巡检可直接执行

### P1-09 移动端

- ≤ 820px 自动切换移动布局：侧栏变抽屉、右栏隐藏、底部 5 个 Tab（交付 / 任务 / 收件箱 / 对话 / 更多）
- 对话坞变成底部弹层
- 移动端保留只读浏览、审批、决策、交付验收；隐藏新建/编辑/开工/转交等写操作入口
- 已用 393×659 视口验证：无横向滚动，底部导航 56px，侧栏默认收起

### P1-10 任务级 worktree

- 任务详情可勾选「任务级隔离区（Git worktree，验收后合并）」
- 执行前先给项目做影子快照，再从快照 commit 创建独立的 `data/worktrees/<projectId>/<taskId>` 工作树
- 员工只写隔离区；执行完成后自动提交为 `refs/tasks/<taskId>`，记录变更文件数
- 验收通过自动合并回项目工作区；也可在任务行手动「合并」或丢弃
- 已实测：`hello.txt` 在隔离区生成、提交、合并回 `data/workspaces/projects/p-web`
- 如果项目工作区没有可提交内容或 git 不可用，会明确失败并阻塞任务，不会偷偷写主工作区

### P1-11 预算预警

- 项目新建 / 设置里可填预算与预警线（默认 80%）
- 项目卡、账本页显示预算使用率；超过预警线标红
- 日报/周报的「风险与卡点」会自动带出预算预警
- 只预警，不强制熔断

### P1-12 Office 预览

- 支持 `.docx`、`.xlsx`、`.pptx` 在线预览
- 零依赖实现：直接解析 Office 的 ZIP + XML，不依赖 Office / LibreOffice
- Word 按段落展示；Excel 按工作表渲染表格（最多 200 行 / 20 表）；PPT 按幻灯片展示文字
- 旧格式 `.doc` / `.xls` / `.ppt` 不支持，提示下载后打开
- `GET /api/office/preview?id=<deliverableId>` 可单独调用

## 机房与服务器（第 18 步）

左栏新增「机房」父菜单，展开后是服务器选择：

- 「服务器总览」：所有服务器的在线状态、服务数量、运行中数量
- 每台服务器单独入口，显示在线 / 离线 / 未检测
- 添加、编辑服务器：名称、接入方式（本机 / SSH 远程）、主机、SSH 端口、SSH 用户、私钥路径、说明
- 添加、编辑项目服务：服务名称、关联项目、类型、端口、管理台 URL、健康检查 URL、运行目录、启动命令、停止命令、是否建议随服务器启动

服务状态：

- 端口探测：`host:port` 可连接视为运行中
- 健康检查：配置了 `healthUrl` 时请求该地址，HTTP 2xx/3xx/4xx 视为运行中
- 本地进程：启动后记录 PID，用 PID 判断进程是否还活着
- 状态缓存 5 秒，机房页和右栏服务器面板每 10 秒刷新一次

服务操作：

- 本机服务：用 `startCommand` 启动，记录 PID；停止时优先执行 `stopCommand`，没有则按 PID 结束进程树；重启 = 停止 + 等待 + 启动
- SSH 远程服务：通过系统 `ssh` 命令执行 `cd <cwd> && nohup <startCommand>` 和 `stopCommand`，需要提前配置免密钥登录
- 启动 / 重启 / 停止前会做状态判断，避免重复启动已在监听的服务
- 管理台：右栏服务行提供 ↗ 按钮，打开内嵌 iframe 预览；被 X-Frame-Options / CSP 拦截时可点「新窗口打开」

右栏新增「服务器」页签：

- 顶部实时汇总在线 / 离线数量与最后更新时间
- 每台服务器显示在线状态、分组/主机、运行中服务数、CPU / 内存或离线原因
- 每个服务显示运行中 / 已停止 / 未检测状态
- 每个服务提供 ▶ 启动、↻ 重启、■ 停止、↗ 管理台预览
- 打开服务器页签立即刷新，停留时每 5 秒自动刷新
- 服务器名称可点击进入机房详情

右栏新增「员工」页签：

- 员工列表按实时状态分组：工作中 / 等待审批 / 空闲 / 阻塞
- 状态来源：正在执行的任务、待审批写操作、未处理决策、阻塞任务
- 每行显示姓名、岗位、当前任务或等待事项
- 点击员工会展开底部对话坞并切换到该员工的 1:1 对话
- 状态每 5 秒刷新一次

机房监控与日志：

- 本机服务器显示 CPU、内存、磁盘、运行时长、主机名与系统版本
- 远程 SSH 服务器通过 SSH 采集同样的指标；采集失败会显示原因
- 服务卡片可展开「运行配置」，查看运行目录、启动/停止命令、健康检查、管理台、依赖、容器与最近操作
- 每个服务提供「日志」按钮，查看最近 200 行本机服务日志
- 服务器与服务都有健康历史；服务从运行变为停止、服务器离线会自动生成通知
- 状态每 10 秒刷新，指标缓存 6 秒（远程失败缓存 60 秒，避免反复等待 SSH 超时）

### 内置演示服务器

| 服务器 | 接入 | 服务 |
|---|---|---|
| 本机 · 拾光工作站 | 本机 | 一人公司 Web（4399）、dsh 控制面（3081） |
| 渲染节点 · 3090 | SSH | ComfyUI（8188） |

远程节点是示例配置，实际使用前需要把主机、SSH 用户和私钥路径改成自己的。

## 审计 / 团队 / 工位 / 通知（第 20 步）

### 审计日志

- 左栏「运营中心 → 审计日志」
- 记录：项目、任务、交付物、审批、员工、记忆、团队、设置、服务器/服务、定时任务、工位归档等写操作
- 字段：时间、操作人（老板 / AI 员工）、动作、对象、摘要、详情、状态、耗时、级别
- 哈希链：每条记录带 `prevHash` 与 `hash`，可一键校验是否被篡改
- 支持按动作、操作人、关键词筛选；支持 CSV 导出
- API：`GET /api/audit`、`GET /api/audit/verify`、`GET /api/audit/export`

### 团队实体

- 左栏「运营中心 → 团队」
- 团队字段：名称、部门、职能、负责人、成员、默认项目、共享记忆范围、备注
- 团队卡片显示成员、负责人、默认项目与当前任务负载
- 项目新建 / 设置可选择所属团队，自动带入团队成员
- API：`GET /api/teams`、`POST /api/teams`、`POST /api/teams/delete`

### 项目内独立工位

- 每个「员工 × 项目」都有独立工位：`data/workspaces/stations/<projectId>/<employeeId>`
- 员工在项目群、1:1 对话、任务执行时都以自己的项目工位为执行目录
- 任务完成后自动把工位里新产生/修改的文件归档回项目共享工作区
- 左栏「公司资产 → 员工工位」可查看工位、文件数、大小、最近修改时间
- 支持手动「归档到项目」「查看文件」「清理工位」
- API：`GET /api/stations`、`POST /api/stations/sync`、`POST /api/stations/clean`

### 会话中断 / 继续

- 对话生成时显示「停止生成」；停止后保留已生成的部分，标记「已停止」
- 点「继续生成」会带上中断前的上下文继续补完
- 中断会取消 dsh 当前 turn；继续时会自动重建可用会话，不会卡死在已取消的 session
- 任务执行也支持「停止」和「继续」；任务中断后状态回到待办并保留断点

### 任务多交付物

- 任务可以挂多份交付物，任务详情显示交付物清单
- 每份交付物可单独预览 / 通过 / 打回
- 「全部通过」会一次性审核该任务所有待验收交付物；只有全部处理完任务才进入已完成
- 任务列表显示「交付 N · 待验 M」标记

### 记忆版本 / 冲突

- 每次修改记忆生成新版本，记录版本号、内容、摘要、修改人、说明、时间
- 保存时携带 `baseVersion`；如果期间被其他操作修改，返回 409 `MEMORY_CONFLICT`，不会静默覆盖
- 记忆预览显示版本历史，可回滚到任意历史版本
- 检测到 Markdown 文件被外部修改时显示冲突提示，可选择「以文件为准」
- API：`POST /api/memories/update`、`POST /api/memories/rollback`

### 员工归档

- 员工卡片提供「归档离职」；可选择交接人
- 归档后不再接新任务、不进入项目群、不进入对话选择器
- 未完成任务自动转交；项目团队与团队实体成员同步替换为交接人
- 自动生成「离职交接」记忆；历史会话、交付物、账本记录全部保留
- 支持「恢复在职」
- API：`POST /api/employees/archive`、`POST /api/employees/restore`

### 账本筛选 / 耗时

- 账本支持今日 / 近 7 天 / 近 30 天 / 全部，以及员工、项目、模型、来源筛选
- 汇总卡显示调用次数、输入/输出 tokens、平均耗时
- 每条调用记录显示耗时；CSV 导出按当前筛选条件导出
- 所有对话、群聊、任务、会议调用都会记录 `durationMs`
- API：`GET /api/ledger`

### 通知中心

- 顶部铃铛与左栏「运营中心 → 通知中心」
- 通知来源：待审批、待决策、交付物待验收、任务完成/失败/中断、会议结束、定时任务失败、服务器离线/服务停止、员工归档、工位归档
- 支持全部 / 未读筛选、单条已读、全部已读、删除、跳转详情
- 每 15 秒自动刷新未读数
- API：`GET /api/notifications`、`POST /api/notifications/read`、`POST /api/notifications/delete`

### 机房模块补齐

- 远程服务器通过 SSH 采集 CPU / 内存 / 磁盘 / 负载 / 运行时长 / 主机名
- 服务器与服务健康历史（最近 20/60 次），状态变化自动发通知
- 服务分组、标签、服务器分组与标签筛选
- 服务依赖关系：启动时先拉起依赖，停止时先停依赖它的服务
- 批量启动 / 重启 / 停止（详情页勾选服务）
- 服务运行方式：本机/SSH 进程、Docker 容器、Kubernetes 工作负载
- 服务随一人公司启动（`autoStart` + 总开关）
- SSH 连接测试、危险操作二次确认、所有服务操作写审计日志

## 预览台（第 21 步）

- 左栏新增「预览台」，所有交付物预览都在这里打开，不再弹窗
- 预览来源：
  - 交付物卡片、右栏「交付」、任务详情里的交付物
  - 服务器 / 右栏「服务器」里的「管理台」按钮
- 预览内容支持 Markdown / 文本、图片、PDF、docx / xlsx / pptx Office 预览
- 服务管理台以 iframe 内嵌显示；被 X-Frame-Options / CSP 拦截时可「新窗口打开」
- 左侧分两栏：
  - 收藏的内容：localStorage 持久化，点 ☆ 收藏
  - 本次历史内容：当前浏览器会话内最近 30 条，可清空
- 刷新页面后会自动恢复上次打开的预览（本次会话内）
- 预览头部显示名称、项目、负责人、版本、状态；待验收交付物可直接通过 / 打回
- 移动端自动改为上下布局

## 工具 / 技能 / 专家目录（第 22 步）

### 工具目录

- 工具分成三类：
  - `native`：直接由 dsh 原生插件实现，例如 `read` / `write` / `web.search` / `todo` / `present`
  - `company`：由一人公司的 MCP 工具服务实现，例如招聘、分配、任务、账本、文档、审阅
  - `planned`：目录里保留，但还没接入外部服务，例如 `media.export` / `model3d` / `print` / `order.read`
- 员工 preset 只加载分配到且已接入的工具；`planned` 工具不会假装可用
- 工具目录页面可以新增、编辑、批量分配给员工；分配后立即注册新的 preset revision

### 技能目录

- 技能不再是员工档案里的自由文本，而是有名称、类别、简介和执行指引的目录条目
- 招聘时人事专员从技能目录读取并分配
- 员工上下文会注入「岗位技能」指引，不再只列技能标签

### 专家目录

- 从本机 WorkBuddy 的专家包目录读取：
  - `~/.workbuddy/plugins/cache/experts/*/*/.codebuddy-plugin/plugin.json`
  - `~/.workbuddy/plugins/cache/my-experts/*/*/.codebuddy-plugin/plugin.json`
- 导入时读取 manifest、agent markdown 和技能标签，完整内容保存到 `data/experts/<package>.md`
- 专家可以绑定员工和/或项目；绑定后专家摘要会进入对应员工/项目的上下文
- 支持新增、编辑、绑定、查看档案；导入只读，不执行专家包里的脚本

### 岗位模板招聘

- 员工页新增「按岗位模板招聘」
- 人事行政专员沈舟会读取岗位模板、工具目录、技能目录、专家目录，自动完成：
  - 工具分配
  - 技能分配
  - 专家匹配与绑定
  - 项目加入
  - 岗位记忆写入
- 也支持沈舟在对话中通过 MCP 工具 `mcp__company__hire_employee` 完成招聘

### 记忆按范围注入

- 记忆支持公司 / 团队 / 项目 / 员工四级，团队记忆新增 `teamId`
- 运行时只注入：
  - 公司级记忆
  - 当前员工所属团队的团队记忆
  - 当前项目的项目记忆
  - 当前员工的员工记忆
- 不再把所有项目记忆发给所有员工

### 公司内部 MCP 工具

dsh preset 会按员工工具面挂载 `@deepseek-ai/dsh-mcp-client`，工具服务为 `mcp/company-tools.mjs`，提供：

- `list_catalog` / `list_employees`
- `hire_employee` / `update_employee`
- `assign_skills` / `assign_tools` / `assign_experts`
- `create_task` / `list_tasks` / `update_task`
- `ledger_summary`
- `list_documents` / `read_document`
- `list_pending_deliverables` / `read_deliverable`
- `request_permission`

## 本地持久化

- 数据文件：`data/store.json`（首次启动自动从 `data/seed.json` 生成）
- 员工工位目录：`data/workspaces/employees/<id>`
- 页面刷新、关闭浏览器、重启服务都不会丢数据
- 重置演示数据：

```bash
curl -X POST http://127.0.0.1:4399/api/reset
```

## API

| 方法 | 路径 | 作用 |
|---|---|---|
| GET | `/api/health` | 健康检查 |
| GET | `/api/state` | 读取全部状态 |
| GET | `/api/settings` | 读取模型设置、Token 用量汇总与控制面状态 |
| POST | `/api/settings` | 保存模型设置并生成 dsh 补丁 |
| POST | `/api/settings/test` | 测试模型连接 |
| POST | `/api/settings/channels/test` | 测试邮件 / 企业微信 / Webhook 渠道连接 |
| POST | `/api/chat` | 给员工发消息，等待完整回复 |
| POST | `/api/chat/stream` | 给员工发消息，SSE 流式回复 |
| POST | `/api/group-chat/stream` | 项目群多员工逐字流式对话 |
| POST | `/api/group-chat` | 项目群完整回复（兼容旧接口） |
| POST | `/api/messages` | 追加一条普通对话消息 |
| POST | `/api/decisions/resolve` | 处理一条决策 |
| POST | `/api/tasks/toggle` | 切换任务完成状态 |
| POST | `/api/tasks/handoff` | 把任务转交给其他员工并留下交接记录 |
| POST | `/api/tasks/from-message` | 从指定对话消息创建任务并记录来源 |
| POST | `/api/tasks/update` | 修改任务字段、优先级、验收标准、依赖与自动开工 |
| POST | `/api/tasks/run` | 手动让任务负责人开工 |
| POST | `/api/autonomy` | 开启 / 暂停自动开工调度器 |
| GET | `/api/memories` | 读取记忆元数据列表 |
| POST | `/api/memories` | 新建 Markdown 记忆 |
| GET | `/api/memories/:id` | 读取单条记忆正文 |
| POST | `/api/decisions` | 创建决策卡 |
| GET | `/api/ledger/export` | 导出真实用量 CSV |
| POST | `/api/deliverables/upload` | 本地上传交付物（base64，最大 20MB） |
| GET | `/api/employee-files?employeeId=` | 列出员工工位目录里的文件 |
| GET | `/api/project-files` | 列出所有项目工作区及其真实文件 |
| POST | `/api/deliverables` | 从工位文件提交交付物并挂到任务 |
| GET | `/api/deliverables/content?id=` | 读取交付物预览内容 |
| GET | `/api/deliverables/raw?id=` | 读取交付物原文件（图片/PDF/文本） |
| POST | `/api/deliverables/review` | 通过或打回交付物 |
| POST | `/api/projects` | 新建项目（可绑定真实工作区目录） |
| POST | `/api/projects/update` | 修改项目名称、描述、状态、工作区目录 |
| POST | `/api/projects/snapshot` | 为项目创建 Git 影子快照 |
| GET | `/api/projects/snapshots?projectId=` | 查看项目快照列表 |
| POST | `/api/projects/rollback` | 回滚到指定快照（必须 confirm=true） |
| POST | `/api/approvals/request` | 员工写操作请求审批（桥接插件调用） |
| GET | `/api/approvals/:id` | 查询审批状态（桥接插件轮询） |
| POST | `/api/approvals/decide` | 批准或拒绝写操作 |
| POST | `/api/outbound` | 创建 L4 外部动作并进入审批 |
| POST | `/api/tasks` | 新建任务 |
| POST | `/api/employees` | 招聘员工（含工具/技能/权限/工位） |
| POST | `/api/employees/update` | 编辑员工档案并刷新运行时角色卡 |
| GET | `/api/reports` | 报告列表 |
| POST | `/api/reports/generate` | 生成日报 / 周报 |
| GET | `/api/reports/export?id=` | 下载报告 Markdown |
| GET | `/api/performance?days=` | 员工绩效 |
| GET | `/api/org` | 组织架构与团队-项目矩阵 |
| GET | `/api/search?q=` | 全文 + 本地向量检索 |
| GET | `/api/templates` | 模板列表（内置 + 自定义） |
| POST | `/api/templates/import` | 导入模板 JSON |
| GET | `/api/templates/export?id=` | 导出模板 JSON |
| POST | `/api/templates/apply` | 把项目模板应用到项目 |
| GET | `/api/schedules` | 定时任务与执行记录 |
| POST | `/api/schedules` | 新建 / 修改定时任务 |
| POST | `/api/schedules/toggle` | 启用 / 暂停 |
| POST | `/api/schedules/run` | 立即执行 |
| POST | `/api/schedules/delete` | 删除 |
| GET | `/api/meetings` | 会议列表 |
| POST | `/api/meetings` | 新建会议 |
| POST | `/api/meetings/run` | SSE 逐人真实发言 |
| POST | `/api/meetings/end` | 结束并生成纪要 |
| POST | `/api/meetings/action` | 行动项转任务 |
| GET | `/api/meetings/:id/minutes` | 下载会议纪要 |
| POST | `/api/tasks/worktree` | 查询 / 合并 / 丢弃任务隔离区 |
| GET | `/api/office/preview?id=` | Office 预览 |
| GET | `/api/models` | 代理 dsh 模型目录 |
| GET | `/api/servers` | 服务器列表与实时服务状态、指标 |
| POST | `/api/servers` | 新建 / 修改服务器 |
| POST | `/api/servers/delete` | 删除服务器 |
| POST | `/api/servers/check` | 强制刷新服务器状态 |
| POST | `/api/servers/service` | 新建 / 修改项目服务 |
| POST | `/api/servers/service/delete` | 删除项目服务 |
| POST | `/api/servers/action` | 启动 / 停止 / 重启服务 |
| GET | `/api/servers/log` | 读取本机服务日志 |
| GET | `/api/employees/status` | 员工实时状态（工作 / 等待审批 / 空闲 / 阻塞） |
| POST | `/api/employees/hire` | 按岗位模板招聘并自动分配工具/技能/专家 |
| GET / POST | `/api/tools` | 工具目录读取 / 新增或更新 |
| POST | `/api/tools/assign` | 批量分配工具给员工 |
| GET / POST | `/api/skills` | 技能目录读取 / 新增或更新 |
| POST | `/api/skills/assign` | 批量分配技能给员工 |
| GET / POST | `/api/experts` | 专家目录读取 / 新增或更新 |
| POST | `/api/experts/assign` | 绑定专家到员工/项目 |
| GET | `/api/experts/workbuddy` | 扫描本机 WorkBuddy 专家包 |
| POST | `/api/experts/import` | 导入选中的 WorkBuddy 专家 |
| GET | `/api/experts/content?id=` | 读取专家完整内容 |
| POST | `/api/agent-tools/execute` | 公司内部 MCP 工具执行入口（需令牌） |
| GET | `/api/agent-tools/context-preview` | 查看员工/项目的上下文与记忆范围 |
| POST | `/api/employees/archive` | 员工归档并交接任务 |
| POST | `/api/employees/restore` | 恢复归档员工 |
| GET | `/api/teams` | 团队列表与负载 |
| POST | `/api/teams` | 新建 / 修改团队 |
| POST | `/api/teams/delete` | 删除团队 |
| GET | `/api/audit` | 审计日志（动作 / 操作人 / 关键词筛选） |
| GET | `/api/audit/verify` | 校验审计哈希链 |
| GET | `/api/audit/export` | 导出审计 CSV |
| GET | `/api/ledger` | 账本筛选与汇总（含耗时） |
| GET | `/api/notifications` | 通知列表与未读数 |
| POST | `/api/notifications/read` | 单条 / 全部已读 |
| POST | `/api/notifications/delete` | 删除通知 |
| POST | `/api/memories/update` | 更新记忆（带 baseVersion 冲突检测） |
| POST | `/api/memories/rollback` | 回滚记忆到历史版本 |
| GET | `/api/stations` | 员工 × 项目工位列表 |
| POST | `/api/stations/sync` | 工位文件归档到项目 |
| POST | `/api/stations/clean` | 清理工位（confirm=true） |
| POST | `/api/tasks/cancel` | 停止任务执行并保留断点 |
| POST | `/api/tasks/resume` | 从断点继续任务 |
| POST | `/api/tasks/review` | 任务级批量验收（多交付物） |
| POST | `/api/chat/cancel` | 停止对话生成 |
| POST | `/api/servers/ssh-test` | 测试 SSH 连接 |
| POST | `/api/servers/batch` | 批量启动 / 停止 / 重启服务 |
| POST | `/api/servers/autostart` | 服务随一人公司启动开关 |
| POST | `/api/reset` | 重置为种子数据 |

## 目录

```text
one-company/
├─ server.mjs          # 零依赖 Node 服务：静态资源 + JSON API + SSE + 本地存储
├─ lib/
│  ├─ dsh-bridge.mjs   # dsh 控制面客户端：会话 / 消息 / 事件 / 工具 / cwd+preset / 模型切换 / 动态 preset
│  ├─ employee-preset.mjs # 员工 persona 与工具面生成器（静态 bundle 和动态注册共用）
│  ├─ p1.mjs           # 报告 / 绩效 / 组织 / 检索 / 定时任务纯逻辑
│  └─ office-preview.mjs # docx / xlsx / pptx 零依赖解析
├─ scripts/
│  ├─ generate-presets.mjs # 生成内置员工静态 preset bundle
│  └─ start-dsh.mjs    # 按设置生成的环境启动 dsh 控制面
├─ presets/
│  └─ employee-presets # 10 个内置员工原生 agent preset
├─ package.json
├─ data/
│  ├─ seed.json        # 首次启动的种子数据
│  ├─ store.json       # 运行时数据（自动生成）
│  ├─ settings.json    # 模型设置、渠道接口与价格设置（自动生成）
│  ├─ runtime/         # dsh-model.patch.yml 等运行时配置
│  ├─ reports/         # 日报 / 周报 Markdown
│  ├─ worktrees/       # 任务级 Git worktree 隔离区
│  ├─ server-logs/      # 本机服务启动日志
│  ├─ experts/         # 从 WorkBuddy 导入的专家全文
│  ├─ shadow-repos/    # 每个项目一个 Git 影子仓库
│  ├─ outbox/          # L4 外部动作的本地演练回执
│  ├─ workspaces/
│  │  ├─ employees/    # 员工个人工位
│  │  ├─ projects/     # 项目共享工作区
│  │  └─ stations/     # 员工 × 项目独立工位
│  └─ store.json 内还保存 auditLog（哈希链）与 notifications（通知中心）
├─ mcp/
│  └─ company-tools.mjs # 公司内部 MCP 工具服务（stdio）
└─ public/
   ├─ index.html
   ├─ styles.css
   ├─ data.js          # 页面内置兜底数据
   └─ app.js           # 页面渲染与交互
```

## 常用维护命令

```bash
# 修改内置员工后重新生成静态 preset bundle
npm run presets:generate

# 重置演示数据
curl -X POST http://127.0.0.1:4399/api/reset
```

## 已知限制（第 20 步）

- 审计日志哈希链只能证明“本地记录未被改动”，不能防止同时篡改记录和重算整条链；需要更强保证时应把链头定期外存或签名
- 远程服务器指标依赖 SSH 免密钥登录；SSH 不通时指标显示失败原因，不会伪造数据
- Docker / K8s 服务操作依赖本机已安装 `docker` / `kubectl`，且当前账号有权限；状态探测仍以端口 / 健康检查 URL 为主
- `autoStart` 是“随一人公司启动”，不是操作系统级开机自启；系统级自启需要桌面客户端或系统服务
- 工位自动归档只复制任务期间修改的文件，单文件上限 5MB；二进制大文件仍建议走交付物上传
- 记忆版本只保留最近 30 个版本
- 团队删除不会删除员工和历史任务；项目仍保留原成员快照
- 通知中心目前是本地站内通知，没有系统托盘 / 原生推送
- 会话中断依赖 dsh 的 cancel 能力；中断后继续会重建会话并携带断点文本，不保证模型逐字接续

## 已知限制（第 22 步）

- `planned` 工具（媒体导出 / 3D 建模 / 打印切片 / 订单查询）只有目录和分配关系，尚未接入 ffmpeg、Blender、切片软件或订单系统
- 公司内部 MCP 工具依赖 dsh 能加载 `@deepseek-ai/dsh-mcp-client`；dsh 不可用时员工回退 `standard` preset，工具面会变宽，需要在恢复后重新注册 preset
- 专家导入只读取本地 WorkBuddy 专家包的 manifest、agent markdown 和标签，不执行专家包内的脚本；专家进入上下文的是简介 + 900 字摘要，完整内容保存在 `data/experts/`
- 记忆进入上下文的是 120 字摘要，不是全文；记忆检索仍是本地混合检索，不是 embedding
- 岗位模板招聘会自动匹配专家；如果要精确指定专家，在招聘弹窗里勾选或招聘后用“专家 → 绑定”调整

## 自动更新与发布（GitHub Releases）

- 仓库：<https://github.com/CAI13976645145/YIren-opc>（public）
- 更新源：<https://github.com/CAI13976645145/YIren-opc/releases>
- 打包配置：`desktop/package.json` → `build.publish`（provider = github），electron-builder 会在安装包 `resources/app-update.yml` 写入更新源

发布流程：

```bash
# 1. 改版本号（package.json 与 desktop/package.json 保持一致）
# 2. 打包
cd desktop
./node_modules/.bin/electron-builder --win nsis --publish never -c.directories.output=../dist-electron-vNN

# 3. 上传 Release（需要 repo contents:write 的 PAT）
GITHUB_TOKEN=ghp_xxx node ../scripts/publish-github-release.mjs ../dist-electron-vNN
```

客户端行为：启动 8 秒后静默检查更新；菜单「检查更新」可手动触发；发现新版本后弹窗确认，下载完成自动安装重启。
更新清单为 Release 中的 `latest.yml`，安装包为 `OneCompany-Setup-<version>.exe`，两者必须同时上传。

> 0.40.0 及更早的安装包没有内置 `app-update.yml`，需要手动安装一次 0.40.1，之后才能走自动更新。
> 仓库若改为 private，客户端下载 Release 需要带 token，自动更新会失效，建议保持 public。

### 国内网络加速

GitHub 直连下载 Release 很慢（实测约 27KB/s，153MB 要一个多小时）。可以在客户端用户目录写 `update.json` 走镜像：

```json
{
  "provider": "generic",
  "url": "https://ghfast.top/https://github.com/CAI13976645145/YIren-opc/releases/latest/download/"
}
```

Windows 路径：`%APPDATA%\one-company-desktop\update.json`（`update.json` 优先级高于安装包内的 `app-update.yml`）。
镜像可用性会变，失效时删掉这个文件就回到官方源；`gh-proxy.com`、`ghproxy.net` 可作备选。
