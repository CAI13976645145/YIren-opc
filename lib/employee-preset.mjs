/**
 * 员工原生 agent preset 的唯一生成器。
 *
 * 同一个函数同时服务两条路径：
 * 1. 构建静态 bundle（presets/employee-presets/cordis.patch.yml），dsh 启动时加载；
 * 2. 新员工入职时通过 opc-runtime-bridge 的 /presets 运行时注册，无需重启。
 */

import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

// 桌面端数据放在 userData（OC_DATA_DIR），不能再用安装目录里的 data/
const DATA_DIR = process.env.OC_DATA_DIR
  ? resolve(process.env.OC_DATA_DIR)
  : fileURLToPath(new URL('../data/', import.meta.url));

const MCP_SERVER_PATH = fileURLToPath(new URL('../mcp/company-tools.mjs', import.meta.url));
const AGENT_TOKEN_PATH = join(DATA_DIR, 'runtime', 'agent-tools.token');
const COMPANY_TOOL_CODES = [
  'task',
  'employee.read',
  'employee.contact',
  'employee.admin',
  'skill.assign',
  'tool.assign',
  'permission.request',
  'docs',
  'review',
  'deliverable.submit',
  'delivery.preflight',
  'ledger',
  'memory',
  'tool.create',
  'asset.server',
  'asset.device',
  'asset.company',
  'permission.admin',
  'audit.company',
  'repair.company',
  'gateway.admin',
];

export function buildEmployeePersona(employee) {
  return `你是${employee.name}，岗位是${employee.role}。${employee.desc || ''} 你在“一人公司”工作台里直接向老板汇报。回答要简短、具体、先给结论；不要以编程助手或 AI 模型的身份自我介绍；不要提及 dsh、opc-workbench 或代码仓库，除非老板明确问。`;
}

export function buildEmployeeProfile(employee) {
  return [
    `【你的工作区】${employee.workspacePath || employee.cwd || `employees/${employee.id}`}`,
    '【项目工位】参与项目时，项目工作区下的 workstations/<你的员工ID> 是你的项目工位，产出直接留在项目里。',
    `【可用工具】${(employee.tools || []).join('、') || '无'}`,
    `【技能】${(employee.skills || []).join('、') || '无'}`,
    `【权限】${(employee.permissions || []).join('、') || '无'}`,
    '【交付】产出文件后必须调用 submit_deliverable 把真实文件登记成交付物（files 传相对工位的路径），不能只发文件路径；交付物会自动出现在老板的交付物页和对话卡片里。',
  ].join('\n');
}

export function presetIdFor(employee) {
  return `emp-${String(employee.id || '').replace(/^e-/, '')}`;
}

/** 预设结构版本：改动标准工具集时递增，避免旧签名复用过期预设。 */
export const PRESET_SCHEMA_VERSION = 9;

/** 管理岗（秘书/主管）：只做拆解、派活、验收，不亲自执行。 */
export function isManagementEmployee(employee = {}) {
  return employee.id === 'e-jiang' || /秘书|主管|幕僚长|chief of staff/i.test(String(employee.role || ''));
}

/**
 * 员工预设 = DSH 标准模式工具集 + 公司工具。
 *
 * 标准模式里的工具是所有岗位的基础工作能力，不再按岗位裁剪：
 * 文件读写、终端、联网、技能、任务清单、交付展示、后台任务、定时任务、
 * 目标、子代理、工作流。岗位差异通过「公司工具」和提示词体现。
 *
 * 验收等只读场景传 { readOnly: true }：只保留读、搜索、技能、清单等非写入工具。
 */
export function buildPresetPlugins(employee, options = {}) {
  const readOnly = options.readOnly === true;
  // 默认人人都有标准模式工具；只有显式传 management: true 才裁剪执行类工具。
  const management = options.management === true;
  const tools = new Set(Array.isArray(employee.tools) ? employee.tools : []);

  const plugins = [
    {
      id: 'persona',
      name: '@deepseek-ai/dsh-persona',
      config: { prefix: buildEmployeePersona(employee) },
    },
    {
      id: 'agent-instructions',
      name: '@deepseek-ai/dsh-agent-instructions',
      config: { maxBytes: 65536 },
    },
    { id: 'time-context', name: '@deepseek-ai/dsh-time-context' },
    {
      id: 'tool-fs',
      name: '@deepseek-ai/dsh-tool-fs',
      config: {
        read: true,
        readImage: true,
        write: !readOnly,
        edit: !readOnly,
        applyPatch: false,
      },
    },
    {
      id: 'tool-fs-search',
      name: '@deepseek-ai/dsh-tool-fs-search',
      config: { sampleOverCapGlobResults: false },
    },
    // 技能：标准模式自带文件系统技能 + skill 工具
    { id: 'skill-filesystem', name: '@deepseek-ai/dsh-skill-filesystem' },
    { id: 'tool-skill', name: '@deepseek-ai/dsh-tool-skill' },
    // 目标与计划
    { id: 'command-goal', name: '@deepseek-ai/dsh-command-goal' },
    { id: 'tool-goal', name: '@deepseek-ai/dsh-tool-goal' },
    { id: 'tool-ask-user', name: '@deepseek-ai/dsh-tool-ask-user' },
    {
      id: 'tool-todo',
      name: '@deepseek-ai/dsh-tool-todo',
      config: { allowParallelInProgress: true },
    },
    {
      id: 'tool-web',
      name: '@deepseek-ai/dsh-tool-web',
      config: { fetch: true, searchTimeoutMs: 60000 },
    },
    {
      id: 'tool-present',
      name: '@deepseek-ai/dsh-tool-present',
      config: { maxFiles: 8 },
    },
  ];

  // 管理岗不挂执行类工具（终端、后台任务、定时任务、子代理），只保留读、写文档、联网、清单等管理能力
  if (!readOnly && !management) {
    plugins.push(
      // 终端工具：shell-env 由宿主 profile 提供，这里只挂模型侧工具（Windows 走 PowerShell）
      process.platform === 'win32'
        ? { id: 'tool-shell', name: '@deepseek-ai/dsh-tool-pwsh' }
        : { id: 'tool-shell', name: '@deepseek-ai/dsh-tool-bash' },
      { id: 'tool-jobs', name: '@deepseek-ai/dsh-tool-jobs' },
      { id: 'tool-schedule', name: '@deepseek-ai/dsh-tool-schedule' },
      // 子代理：拆活、并行调研
      { id: 'tool-subagent-control', name: '@deepseek-ai/dsh-tool-subagent-control' },
      {
        id: 'tool-subagent',
        name: '@deepseek-ai/dsh-tool-subagent',
        config: { provider: 'spawn', toolName: 'subagent', modelSelection: true, modelDiscovery: true },
      },
      {
        id: 'tool-subagent-fork',
        name: '@deepseek-ai/dsh-tool-subagent',
        config: { provider: 'fork', toolName: 'subagent_fork' },
      },
    );
  }
  const companyTools = COMPANY_TOOL_CODES.filter((code) => tools.has(code));
  if (companyTools.length > 0) {
    plugins.push({
      id: 'mcp-company',
      name: '@deepseek-ai/dsh-mcp-client',
      config: {
        serverName: 'company',
        transport: 'stdio',
        command: process.execPath,
        args: [MCP_SERVER_PATH],
        env: {
          COMPANY_API: `http://127.0.0.1:${process.env.PORT || 4399}`,
          COMPANY_TOKEN_FILE: AGENT_TOKEN_PATH,
          COMPANY_EMPLOYEE_ID: employee.id,
          COMPANY_EMPLOYEE_NAME: employee.name,
        },
        // 同事沟通需要等对方跑完一整轮模型，30 秒会必然超时
        toolCallTimeoutMs: 180000,
        failOnStartupError: false,
      },
    });
  }
  return plugins;
}

/** 生成静态 bundle 里的一个 YAML 行组。 */
export function buildPresetPatchBlock(employee, order, options = {}) {
  const id = presetIdFor(employee);
  const lines = [
    `    - id: preset-${id}`,
    "      name: '@deepseek-ai/dsh-agent-preset'",
    '      config:',
    `        id: ${id}`,
    `        order: ${order}`,
    `        name: ${JSON.stringify(`${employee.name} · ${employee.role}`)}`,
    `        description: ${JSON.stringify(String(employee.desc || ''))}`,
    '        plugins:',
  ];

  const plugins = buildPresetPlugins(employee).map((plugin) => {
    if (!options.portable || plugin.id !== 'mcp-company') return plugin;
    // 静态 bundle 会随安装包分发到任意机器，不能写入构建机的绝对路径。
    // 去掉 COMPANY_TOKEN_FILE，让 MCP 子进程用 DSH 继承的 OC_DATA_DIR 找真实数据目录。
    return {
      ...plugin,
      config: {
        ...plugin.config,
        env: {
          COMPANY_API: 'http://127.0.0.1:4399',
          COMPANY_EMPLOYEE_ID: employee.id,
          COMPANY_EMPLOYEE_NAME: employee.name,
        },
      },
    };
  });

  for (const plugin of plugins) {
    lines.push(`          - id: ${plugin.id}`);
    lines.push(`            name: '${plugin.name}'`);
    if (plugin.config && Object.keys(plugin.config).length > 0) {
      lines.push('            config:');
      for (const [key, value] of Object.entries(plugin.config)) {
        if (typeof value === 'string') {
          lines.push(`              ${key}: ${JSON.stringify(value)}`);
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          lines.push(`              ${key}: ${value}`);
        } else {
          lines.push(`              ${key}: ${JSON.stringify(value)}`);
        }
      }
    }
  }
  return lines.join('\n');
}
