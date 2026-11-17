/**
 * 工具 / 技能目录的种子与规范化。
 * 目录是公司资产的真源：员工档案里的 tools / skills 只是对目录条目的引用（按 code / name）。
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/** OPC 一人公司技能：从 WorkBuddy 技能库导入后按公司语境改写，保证每次交付前真实执行 D1–D12 闸门。 */
const OPC_DELIVERY_SELFCHECK = readFileSync(
  new URL('./skills/ai-delivery-selfcheck.md', import.meta.url),
  'utf8',
).trim();

/** 每个员工都必须具备的基础工具：对齐 DSH 标准模式的工具面。 */
export const BASE_EMPLOYEE_TOOLS = [
  'read',
  'write',
  'terminal',
  'web.search',
  'todo',
  'present',
  'task',
  'memory',
];

/** 全部公司工具 + 标准模式原生工具：管理岗（秘书/人事）默认全开。 */
export const FULL_PERMISSION_CODES = [
  'project.read',
  'project.write',
  'project.admin',
  'task.read',
  'task.write',
  'task.assign',
  'employee.read',
  'employee.create',
  'employee.admin',
  'employee.contact',
  'skill.assign',
  'tool.assign',
  'tool.create',
  'permission.request',
  'permission.admin',
  'asset.read',
  'asset.write',
  'asset.server',
  'asset.device',
  'asset.company',
  'finance.read',
  'finance.write',
  'ledger.read',
  'ledger.write',
  'docs.write',
  'memory.write',
  'audit.read',
  'audit.write',
  'system.admin',
  'model.admin',
  'gateway.admin',
  'company.admin',
];

export const COMPANY_MCP_TOOL_CODES = [
  'task',
  'employee.read',
  'employee.contact',
  'employee.admin',
  'skill.assign',
  'tool.create',
  'tool.assign',
  'permission.request',
  'docs',
  'review',
  'deliverable.submit',
  'delivery.preflight',
  'ledger',
  'memory',
  'asset.server',
  'asset.device',
  'asset.company',
  'permission.admin',
  'audit.company',
  'repair.company',
  'gateway.admin',
];

/** 全部员工工具：标准模式原生工具 + 公司 MCP 工具。 */
export const FULL_EMPLOYEE_TOOLS = [
  ...new Set([
    'read',
    'write',
    'terminal',
    'web.search',
    'todo',
    'present',
    'task',
    'memory',
    ...COMPANY_MCP_TOOL_CODES,
  ]),
];

const TOOL_SEEDS = [
  {
    code: 'read',
    name: '文件读取',
    category: '文件',
    risk: 'L0',
    kind: 'native',
    implementation: 'dsh-tool-fs',
    description: '读取工位、项目工作区与资料文件。',
  },
  {
    code: 'write',
    name: '文件写入',
    category: '文件',
    risk: 'L2',
    kind: 'native',
    implementation: 'dsh-tool-fs',
    description: '创建、修改、删除文件；写前会进入审批并生成快照。',
  },
  {
    code: 'terminal',
    name: '终端命令',
    category: '执行',
    risk: 'L3',
    kind: 'native',
    implementation: 'dsh-tool-pwsh / dsh-tool-bash',
    description: '在工位目录里执行命令（Windows 为 PowerShell，其他平台为 bash）；受沙箱与审批策略约束。',
  },
  {
    code: 'web.search',
    name: '联网搜索',
    category: '信息',
    risk: 'L1',
    kind: 'native',
    implementation: 'dsh-tool-web',
    description: '检索公开网页与资料，用于市场、竞品和素材核实。',
  },
  {
    code: 'todo',
    name: '任务清单',
    category: '协作',
    risk: 'L0',
    kind: 'native',
    implementation: 'dsh-tool-todo',
    description: '让员工在多步任务中维护自己的执行清单。',
  },
  {
    code: 'present',
    name: '交付展示',
    category: '协作',
    risk: 'L1',
    kind: 'native',
    implementation: 'dsh-tool-present',
    description: '把本轮产出的文件正式登记为交付物，附带文件清单。',
  },
  {
    code: 'task',
    name: '任务管理',
    category: '管理',
    risk: 'L2',
    kind: 'company',
    implementation: 'mcp:company.create_task / list_tasks / update_task',
    description: '创建任务、查看任务、更新任务状态。',
    companyActions: ['create_task', 'list_tasks', 'update_task'],
  },
  {
    code: 'memory',
    name: '公司知识库',
    category: '知识',
    risk: 'L1',
    kind: 'company',
    implementation: 'mcp:company.list_memories / read_memory / save_memory',
    description: '维护设备、服务器、服务、流程与项目参数；员工执行任务时自动读取相关全文。',
    companyActions: ['list_memories', 'read_memory', 'save_memory'],
  },
  {
    code: 'employee.read',
    name: '员工查询',
    category: '管理',
    risk: 'L1',
    kind: 'company',
    implementation: 'mcp:company.list_employees',
    description: '查看员工档案、岗位、工具、技能与负载。',
    companyActions: ['list_employees'],
  },
  {
    code: 'employee.contact',
    name: '同事沟通',
    category: '协作',
    risk: 'L1',
    kind: 'company',
    implementation: 'mcp:company.contact_employee / check_employee_messages',
    description: '直接找同事沟通：对方空闲直接拿回复；对方在忙则进入收件箱，稍后用 check_employee_messages 取回复。不要自己假装同事回答。',
    companyActions: ['list_employees', 'contact_employee', 'check_employee_messages'],
  },
  {
    code: 'employee.admin',
    name: '员工管理',
    category: '管理',
    risk: 'L3',
    kind: 'company',
    implementation: 'mcp:company.search_market / hire_employee / update_employee / list_employees',
    description: '按岗位模板招聘、修改员工档案、查看员工目录；招聘前可搜索 WorkBuddy 专家/技能市场，并从最热前 10 名中随机选择。',
    companyActions: ['search_market', 'hire_employee', 'update_employee', 'list_employees'],
  },
  {
    code: 'skill.assign',
    name: '技能分配',
    category: '管理',
    risk: 'L3',
    kind: 'company',
    implementation: 'mcp:company.assign_skills',
    description: '从技能目录给员工分配或移除技能。',
    companyActions: ['assign_skills'],
  },
  {
    code: 'tool.create',
    name: '新建工具',
    category: '管理',
    risk: 'L3',
    kind: 'company',
    implementation: 'mcp:company.save_tool',
    description: '在工具目录新建或更新工具；秘书和人事可以直接维护。',
    companyActions: ['save_tool'],
  },
  {
    code: 'tool.assign',
    name: '工具分配',
    category: '管理',
    risk: 'L3',
    kind: 'company',
    implementation: 'mcp:company.assign_tools',
    description: '从工具目录给员工分配或移除工具。',
    companyActions: ['assign_tools'],
  },
  {
    code: 'asset.server',
    name: '机房服务器',
    category: '资产',
    risk: 'L2',
    kind: 'company',
    implementation: 'mcp:company.list_servers / save_server / delete_server / scan_server_services / register_server_services / save_service / delete_service',
    description: '维护服务器台账与机房服务：新增/修改/删除服务器，登记服务、扫描端口、配置启停命令和自动启动。',
    companyActions: ['list_servers', 'save_server', 'delete_server', 'scan_server_services', 'register_server_services', 'save_service', 'delete_service'],
  },
  {
    code: 'asset.device',
    name: '设备资产',
    category: '资产',
    risk: 'L2',
    kind: 'company',
    implementation: 'mcp:company.list_devices / read_device / save_device / delete_device',
    description: '维护公司设备台账：打印机、工作站、相机、网络设备等的型号、序列号、位置、状态、参数、连接方式和负责人。',
    companyActions: ['list_devices', 'read_device', 'save_device', 'delete_device'],
  },
  {
    code: 'gateway.admin',
    name: '公司网关管理',
    category: '管理',
    risk: 'L2',
    kind: 'company',
    implementation: 'mcp:company.gateway_overview / gateway_add_account / gateway_checkin / gateway_models / gateway_policy / gateway_import / gateway_export / gateway_import_remote',
    description: '管理内置网关：查看账号与积分、生成授权链接、签到、模型开关与档位、夜间低耗、导入导出账号。',
    companyActions: ['gateway_overview', 'gateway_add_account', 'gateway_checkin', 'gateway_models', 'gateway_policy', 'gateway_import', 'gateway_export', 'gateway_import_remote'],
  },
  {
    code: 'asset.company',
    name: '公司资产',
    category: '资产',
    risk: 'L2',
    kind: 'company',
    implementation: 'mcp:company.company_asset_overview / list_catalog / save_tool / save_skill / save_expert / assign_skills / assign_tools / assign_experts / save_memory / list_memories',
    description: '盘点与维护公司资产：工具、技能、专家、知识库、文档、项目与员工，并查看资产总览。',
    companyActions: ['company_asset_overview', 'list_catalog', 'save_tool', 'save_skill', 'save_expert', 'assign_skills', 'assign_tools', 'assign_experts', 'save_memory', 'list_memories'],
  },
  {
    code: 'permission.admin',
    name: '权限管理',
    category: '管理',
    risk: 'L3',
    kind: 'company',
    implementation: 'mcp:company.update_employee（permissions）/ request_permission',
    description: '调整员工权限范围、发起权限申请；仅人事行政和管理层可用。',
    companyActions: ['update_employee', 'request_permission'],
  },
  {
    code: 'audit.company',
    name: '公司体检',
    category: '管理',
    risk: 'L1',
    kind: 'company',
    implementation: 'mcp:company.audit_company',
    description: '体检项目与公司资料：项目域查描述/技术栈/入口/成员/里程碑/知识/收支/证书，公司域查工具/技能/专家/知识库/服务器/设备/员工模型/备份。',
    companyActions: ['audit_company'],
  },
  {
    code: 'repair.company',
    name: '缺口转任务',
    category: '管理',
    risk: 'L2',
    kind: 'company',
    implementation: 'mcp:company.repair_company',
    description: '把体检发现的缺口转成维护任务：项目缺口派秘书，公司/工具/技能/专家/知识库/服务器/设备缺口派人事。',
    companyActions: ['repair_company'],
  },
  {
    code: 'permission.request',
    name: '权限申请',
    category: '管理',
    risk: 'L3',
    kind: 'company',
    implementation: 'mcp:company.request_permission',
    description: '发起权限变更申请，生成决策卡交由老板审批。',
    companyActions: ['request_permission'],
  },
  {
    code: 'docs',
    name: '文档处理',
    category: '文件',
    risk: 'L1',
    kind: 'company',
    implementation: 'mcp:company.list_documents / read_document',
    description: '读取公司文档目录与文档内容，用于制度和资料类工作。',
    companyActions: ['list_documents', 'read_document'],
  },
  {
    code: 'review',
    name: '审阅',
    category: '质量',
    risk: 'L1',
    kind: 'company',
    implementation: 'mcp:company.list_pending_deliverables / read_deliverable / review_deliverable',
    description: '查看待验收交付物与验收标准，输出审阅意见；秘书可直接通过或打回，打回需写清原因。',
    companyActions: ['list_pending_deliverables', 'read_deliverable', 'review_deliverable'],
  },
  {
    code: 'deliverable.submit',
    name: '提交交付物',
    category: '质量',
    risk: 'L1',
    kind: 'company',
    implementation: 'company-tools/submit_deliverable',
    description: '把工位或项目工作区里的真实文件登记成交付物并挂到任务上，返回可打开链接；产出文件后必须用它，不能只发路径。',
    companyActions: ['submit_deliverable'],
  },
  {
    code: 'delivery.preflight',
    name: '交付前自检',
    category: '质量',
    risk: 'L0',
    kind: 'company',
    implementation: 'company-tools/delivery_preflight',
    description: '按交付标准自动扫描文件：空文件、占位符、未替换变量、敏感信息、本地路径、断链和 JSON/CSV 结构，输出阻断项与自检报告。',
    companyActions: ['delivery_preflight'],
  },
  {
    code: 'ledger',
    name: '账务',
    category: '财务',
    risk: 'L1',
    kind: 'company',
    implementation: 'mcp:company.ledger_summary',
    description: '读取项目成本、token 用量与预算使用率。',
    companyActions: ['ledger_summary'],
  },
  {
    code: 'media.export',
    name: '媒体导出',
    category: '内容',
    risk: 'L2',
    kind: 'planned',
    implementation: '',
    description: '导出视频、字幕与封面；需要接入 ffmpeg / 剪辑服务后可用。',
  },
  {
    code: 'model3d',
    name: '3D 建模',
    category: '生产',
    risk: 'L2',
    kind: 'planned',
    implementation: '',
    description: '建模、拆件与支撑生成；需要接入 Blender / 建模服务后可用。',
  },
  {
    code: 'print',
    name: '打印切片',
    category: '生产',
    risk: 'L2',
    kind: 'planned',
    implementation: '',
    description: '切片、打印与质检记录；需要接入切片软件 / 打印机后可用。',
  },
  {
    code: 'order.read',
    name: '订单查询',
    category: '业务',
    risk: 'L0',
    kind: 'planned',
    implementation: '',
    description: '读取订单与售后数据；需要接入订单系统后可用。',
  },
];

const SKILL_GUIDE = {
  'AI交付前全自动自检技能': ['OPC 一人公司', '任何一次向用户交付结果之前，按 D1–D12 闸门逐项扫描整条回复（含结尾），拦截责任转嫁、半途交付、最优步隐藏、伪阻断提问、尾巴豁免、语言后门和先盖章后干活。'],
  目标拆解: ['管理', '把目标拆成可交付的里程碑、负责人和验收标准。'],
  项目管理: ['管理', '定义项目目标、范围、团队、里程碑、风险和验收，推动项目按计划交付。'],
  项目推进: ['管理', '老板给目标后主动拆解、派活、跟进、验收、返工、进入下一步，不逐步等老板安排；只在目标不清或越界时请示。'],
  交付验收: ['质量', '对照任务验收标准检查交付物，给出通过或打回结论；打回必须写清可执行的修改要求。'],
  项目资料维护: ['管理', '维护项目描述、技术栈、快捷入口、成员、里程碑、版本、收支、资料证书和笔记。'],
  知识库维护: ['管理', '把设备、服务器、服务、流程、客户和项目参数写成可执行的 Markdown 知识，及时更新过期内容。'],
  工具目录维护: ['管理', '维护工具目录的编码、名称、类别、风险、实现方式、启用状态，并分配给岗位。'],
  技能目录维护: ['管理', '维护技能目录的说明、SOP 内容、分类和启用状态，绑定到岗位。'],
  专家库维护: ['管理', '维护专家资料、擅长领域、绑定员工/项目，保证专家能力可被调用。'],
  服务器台账: ['资产', '维护服务器名称、接入方式、地址、SSH 账号、分组、状态与服务清单。'],
  服务登记: ['资产', '扫描并登记端口、进程、容器，给服务起人类可读名称，配置启停和健康检查。'],
  设备资产管理: ['资产', '维护设备型号、序列号、位置、状态、规格、连接方式和负责人。'],
  公司资产盘点: ['资产', '定期盘点服务器、设备、工具、技能、专家、知识库，发现缺口并生成维护任务。'],
  排期: ['管理', '按依赖关系和资源负载排出可执行的日期与顺序。'],
  日报: ['管理', '汇总当天进展、卡点、下一步与需要老板拍板的事项。'],
  招聘: ['管理', '根据岗位模板与目录，匹配工具、技能和专家，完成员工入职。'],
  岗位设计: ['管理', '定义岗位职责、汇报关系、工具面、技能要求和验收口径。'],
  权限管理: ['管理', '按最小权限原则分配工具、数据和审批级别。'],
  员工档案: ['管理', '维护员工身份、岗位、项目、工具、技能和归档状态。'],
  选题: ['内容', '结合受众、平台和竞争环境提出可执行的选题方向。'],
  分镜: ['内容', '把脚本拆成镜头、景别、动作、台词和时长。'],
  脚本: ['内容', '写出结构完整、冲突明确、可拍摄的脚本。'],
  剪辑: ['内容', '按节奏完成镜头组接、转场、字幕和音轨。'],
  字幕: ['内容', '生成与音轨对齐、断句合理的字幕。'],
  封面: ['内容', '设计符合平台规格和点击逻辑的封面。'],
  建模: ['生产', '根据设定完成可打印/可渲染的三维模型。'],
  拆件: ['生产', '把模型拆成可打印部件并设计连接结构。'],
  支撑: ['生产', '为打印模型设计支撑与摆放方向。'],
  切片: ['生产', '把模型切片为打印机可执行的路径与参数。'],
  打印: ['生产', '执行打印并记录设备、材料与过程异常。'],
  质检: ['质量', '按验收标准检查尺寸、外观、结构与功能。'],
  客服: ['客户', '接待客户、理解诉求并给出可执行的解决方案。'],
  售后: ['客户', '处理退换、赔付、异常订单并沉淀问题。'],
  话术: ['客户', '按场景编写合规、清晰、有温度的话术。'],
  归档: ['管理', '按目录规范整理文件、命名并建立索引。'],
  行政: ['管理', '处理日常行政、会议、用品和流程事务。'],
  审阅: ['质量', '按验收标准逐项审阅交付物并给出结论。'],
  质量把关: ['质量', '在交付前识别事实、合规、逻辑和格式问题。'],
  核算: ['财务', '核算成本、收入、毛利与项目盈亏。'],
  报价: ['财务', '根据成本、风险和市场价格形成报价方案。'],
  对账: ['财务', '核对订单、付款、发票和账本记录。'],
  需求分析: ['通用', '澄清目标、范围、约束和验收标准。'],
  编码: ['通用', '按方案实现功能并保证可运行、可维护。'],
  自测: ['通用', '按验收清单验证功能并记录遗留问题。'],
  数据复盘: ['通用', '对比目标与实际，解释差异并提出下一步。'],
  内容排期: ['内容', '按渠道、素材和产能安排内容发布时间。'],
  事实核对: ['质量', '核对事实、数据、引用和来源可信度。'],
  质量门槛: ['质量', '定义交付必须达到的最低质量标准。'],
  预算管理: ['财务', '制定预算、跟踪使用率并预警超支。'],
  客户沟通: ['客户', '准确理解客户意图并保持信息同步。'],
  问题归集: ['客户', '把零散问题归类、定级并推动解决。'],
};

/** 需要完整 SKILL.md 的内置技能：内容会进入员工上下文，必须能直接照着执行。 */
const SKILL_DETAIL = {
  'AI交付前全自动自检技能': {
    instructions:
      '任何一次向老板或客户交付结果之前（present_files、最终总结、下结论、状态汇报、提问/征询），必须对整条消息（含结尾）逐项扫描 D1–D12 闸门，并在消息末尾附「闸门快照」；命中任一项就返工重跑，直到全空再交付。',
    content: OPC_DELIVERY_SELFCHECK,
    prompt: OPC_DELIVERY_SELFCHECK,
    priority: true,
  },
};

/** 已有公司库升级时也要补上的内置技能。 */
export const BUILTIN_OPC_SKILLS = ['AI交付前全自动自检技能'];

export function skillCategoryFor(name) {
  return SKILL_GUIDE[String(name || '').trim()]?.[0] || '通用';
}

export function skillDescriptionFor(name) {
  const guide = SKILL_GUIDE[String(name || '').trim()];
  return guide?.[1] || `在相关任务中运用「${name}」，输出可执行、可验收的结果。`;
}

export function skillInstructionsFor(name) {
  const key = String(name || '').trim();
  const detail = SKILL_DETAIL[key];
  if (detail?.instructions) return detail.instructions;
  const guide = SKILL_GUIDE[key];
  return guide?.[1] || `使用「${name}」时：先确认目标与约束，再给出步骤或产出，最后按验收标准自检。`;
}

export function skillContentFor(name, description = '') {
  const key = String(name || '').trim();
  return SKILL_DETAIL[key]?.content || buildSkillContent(key, String(description || skillDescriptionFor(key)));
}

export function skillPromptFor(name, description = '') {
  const key = String(name || '').trim();
  return SKILL_DETAIL[key]?.prompt || skillContentFor(key, description);
}

export function isPrioritySkill(name) {
  return SKILL_DETAIL[String(name || '').trim()]?.priority === true;
}

export function skillIdFor(name) {
  return `skill-${createHash('sha1').update(String(name || '').trim()).digest('hex').slice(0, 10)}`;
}

export function toolIdFor(code) {
  return `tool-${String(code || '').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '')}`;
}

export function normalizeToolEntry(entry = {}) {
  const code = String(entry.code || entry.id || '').trim();
  const seed = TOOL_SEEDS.find((item) => item.code === code) || {};
  return {
    id: entry.id || toolIdFor(code),
    code,
    name: String(entry.name || seed.name || code),
    category: String(entry.category || seed.category || '扩展'),
    risk: String(entry.risk || seed.risk || 'L1'),
    kind: ['native', 'company', 'planned'].includes(entry.kind) ? entry.kind : seed.kind || 'planned',
    implementation: String(entry.implementation || seed.implementation || ''),
    companyActions: Array.isArray(entry.companyActions)
      ? entry.companyActions.map(String)
      : Array.isArray(seed.companyActions)
        ? [...seed.companyActions]
        : [],
    description: String(entry.description || seed.description || ''),
    enabled: entry.enabled !== false,
    builtin: entry.builtin !== undefined ? Boolean(entry.builtin) : Boolean(seed.code),
    createdAt: entry.createdAt || new Date().toISOString(),
  };
}

export function seedToolCatalog() {
  return TOOL_SEEDS.map((entry) => normalizeToolEntry({ ...entry, builtin: true }));
}

/** 生成一份可执行的 SKILL.md；没有手写内容时用它兜底，保证技能不是一句口号。 */
export function buildSkillContent(name, description) {
  const title = String(name || '技能').trim();
  const summary = String(description || '').trim();
  return [
    `# ${title}`,
    '',
    summary || '按岗位标准完成这一类工作。',
    '',
    '## 适用场景',
    `- 需要做「${title}」相关的工作时。`,
    '',
    '## 执行步骤',
    '1. 先确认输入与边界：需要哪些材料、由谁提供、什么算完成。',
    '2. 按岗位标准产出第一版，写清关键判断与取舍理由。',
    '3. 自查：事实能否核对、结论是否有依据、有没有漏项。',
    '4. 交付时给出：结论、依据、下一步、需要老板拍板的问题。',
    '',
    '## 输出要求',
    '- 先给结论，再给细节，不要空话。',
    '- 涉及数字要说明口径与来源。',
    '- 不确定的地方写「待确认」，不要编造。',
    '',
    '## 验收标准',
    '- 产出能被直接使用或评审，而不是只给思路。',
  ].join('\n');
}

export function normalizeSkillEntry(entry = {}) {
  const name = String(entry.name || entry.id || '').trim();
  const description = String(entry.description || skillDescriptionFor(name));
  return {
    id: entry.id || skillIdFor(name),
    name,
    category: String(entry.category || skillCategoryFor(name)),
    description,
    instructions: String(entry.instructions || skillInstructionsFor(name)),
    content: String(entry.content || skillContentFor(name, description)),
    promptContent: String(entry.promptContent || skillPromptFor(name, description)),
    priority: entry.priority === true || isPrioritySkill(name),
    source: String(entry.source || 'builtin'),
    enabled: entry.enabled !== false,
    builtin: entry.builtin !== undefined ? Boolean(entry.builtin) : true,
    createdAt: entry.createdAt || new Date().toISOString(),
  };
}

export function seedSkillCatalog(employees = []) {
  const names = new Set();
  for (const employee of employees) {
    for (const name of employee.skills || []) names.add(name);
  }
  for (const name of Object.keys(SKILL_GUIDE)) names.add(name);
  return [...names].filter(Boolean).map((name) => normalizeSkillEntry({ name, builtin: true }));
}

export function ensureBuiltinSkills(catalog, names = []) {
  const list = Array.isArray(catalog) ? catalog : [];
  const existing = new Set(list.map((item) => item.name));
  for (const name of names) {
    const trimmed = String(name || '').trim();
    if (!trimmed || existing.has(trimmed)) continue;
    list.push(normalizeSkillEntry({ name: trimmed, builtin: true }));
    existing.add(trimmed);
  }
  return list;
}

export function ensureSkillEntries(catalog, names = []) {
  const list = Array.isArray(catalog) ? catalog : [];
  const existing = new Set(list.map((item) => item.name));
  for (const name of names) {
    const trimmed = String(name || '').trim();
    if (!trimmed || existing.has(trimmed)) continue;
    list.push(normalizeSkillEntry({ name: trimmed, builtin: false }));
    existing.add(trimmed);
  }
  return list;
}

export function ensureToolEntries(catalog, codes = []) {
  const list = Array.isArray(catalog) ? catalog : [];
  const existing = new Set(list.map((item) => item.code));
  for (const code of codes) {
    const trimmed = String(code || '').trim();
    if (!trimmed || existing.has(trimmed)) continue;
    list.push(normalizeToolEntry({ code: trimmed, builtin: false }));
    existing.add(trimmed);
  }
  return list;
}
