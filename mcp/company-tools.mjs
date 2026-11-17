#!/usr/bin/env node
/**
 * 一人公司 · 公司内部 MCP 工具服务。
 * 通过 stdio 暴露“招聘、分配、任务、账本、文档、审阅”等公司能力给 dsh 员工。
 * 真正的数据修改统一走一人公司 HTTP API，避免两个进程同时写 store.json。
 */

import readline from 'node:readline';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const TOKEN_FILE = process.env.COMPANY_TOKEN_FILE || '';
const EMPLOYEE_ID = process.env.COMPANY_EMPLOYEE_ID || '';

/**
 * preset 里的路径与端口是构建机写死的默认值。
 * 这里按「当前进程环境 → TOKEN_FILE 上级目录 → APPDATA」顺序找真实数据目录，
 * 再从中读取 agent-tools.token 与 api-port.txt，保证开发端口/安装路径变化都能用。
 */
function candidateDataDirs() {
  const dirs = new Set();
  // preset 里带的 token 路径是每个员工最准确的身份来源，优先于全局 OC_DATA_DIR
  if (TOKEN_FILE) dirs.add(dirname(dirname(TOKEN_FILE)));
  if (process.env.OC_DATA_DIR) dirs.add(process.env.OC_DATA_DIR);
  if (process.env.APPDATA) dirs.add(join(process.env.APPDATA, 'one-company-desktop', 'data'));
  return [...dirs].filter(Boolean);
}

function resolveDataHome() {
  for (const dir of candidateDataDirs()) {
    try {
      readFileSync(join(dir, 'runtime', 'agent-tools.token'), 'utf8');
      return dir;
    } catch {
      /* 继续找 */
    }
  }
  return '';
}

const DATA_HOME = resolveDataHome();
const TOKEN_PATH = DATA_HOME ? join(DATA_HOME, 'runtime', 'agent-tools.token') : TOKEN_FILE;
const PORT_FILE = DATA_HOME ? join(DATA_HOME, 'runtime', 'api-port.txt') : '';

const API = (() => {
  let port = String(process.env.PORT || '').trim();
  if (PORT_FILE) {
    try {
      const value = readFileSync(PORT_FILE, 'utf8').trim();
      if (value) port = value;
    } catch {
      /* 回退到 PORT */
    }
  }
  return `http://127.0.0.1:${port || '4399'}`;
})();

const tools = [
  {
    name: 'list_catalog',
    description:
      '读取公司目录：岗位模板、工具、技能、专家、员工。招聘或分配前先调用它，所有分配项必须来自目录，不要编造。',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['all', 'roles', 'tools', 'skills', 'experts', 'employees'],
          description: '要读取的目录类型，默认 all',
        },
      },
    },
  },
  {
    name: 'list_employees',
    description: '查看员工档案、岗位、部门、工具、技能、专家绑定和当前负载。招聘前用它了解现有团队。',
    inputSchema: {
      type: 'object',
      properties: {
        includeArchived: { type: 'boolean', description: '是否包含已归档员工，默认 false' },
      },
    },
  },
  {
    name: 'search_market',
    description:
      '搜索 WorkBuddy 专家市场 / SkillHub 技能市场（含使用量与安装量，技能全量约 22 万）。招聘前先按岗位关键词搜索；市场热门取使用量前 10，可随机选择一个，不要编造市场上不存在的专家或技能。',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['expert', 'skill', 'all'], description: '搜索专家、技能或全部，默认 expert' },
        query: { type: 'string', description: '岗位/能力关键词，例如：前端、视频剪辑、财务分析、3D建模' },
        limit: { type: 'number', description: '返回数量，默认 10，最多 50' },
        hot: { type: 'boolean', description: 'true 表示只按使用量取最热门的 N 个，忽略关键词' },
      },
    },
  },
  {
    name: 'hire_employee',
    description:
      '按岗位模板招聘一名新的 Agent 员工。会自动从目录分配工具、技能和已绑定的专家，并写入员工岗位记忆。',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: '新员工姓名' },
        roleTemplateId: { type: 'string', description: '岗位模板 ID，例如 tpl-role-content' },
        dept: { type: 'string', description: '部门，留空使用模板默认部门' },
        desc: { type: 'string', description: '补充职责说明' },
        projectIds: { type: 'array', items: { type: 'string' }, description: '加入的项目 ID 列表' },
        skillNames: { type: 'array', items: { type: 'string' }, description: '额外技能名称，必须来自技能目录' },
        toolCodes: { type: 'array', items: { type: 'string' }, description: '额外工具编码，必须来自工具目录' },
        expertIds: { type: 'array', items: { type: 'string' }, description: '要绑定的专家 ID 列表' },
        model: { type: 'string', description: '员工使用的模型 ID。留空会按岗位自动匹配（研发优先推理模型、内容优先视觉模型、客服优先快速模型）' },
        provider: { type: 'string', description: '模型服务 ID，配合 model 使用；留空自动选' },
        modelEffort: { type: 'string', enum: ['off', 'low', 'medium', 'high'], description: '思考强度，留空按岗位自动选择' },
        marketAuto: { type: 'boolean', description: 'true 表示从 WorkBuddy 市场按岗位搜索，并在最热前 10 名专家/技能中各随机选 1 个' },
      },
      required: ['name', 'roleTemplateId'],
    },
  },
  {
    name: 'update_employee',
    description: '修改员工档案：姓名、岗位、部门、职责、工具、技能、权限、模型。只传需要修改的字段。',
    inputSchema: {
      type: 'object',
      properties: {
        employeeId: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string' },
        dept: { type: 'string' },
        desc: { type: 'string' },
        tools: { type: 'array', items: { type: 'string' } },
        skills: { type: 'array', items: { type: 'string' } },
        permissions: { type: 'array', items: { type: 'string' } },
        model: { type: 'string', description: '模型 ID；传 auto 表示按岗位重新自动匹配' },
        provider: { type: 'string', description: '模型服务 ID' },
        modelEffort: { type: 'string', enum: ['off', 'low', 'medium', 'high'] },
        modelTier: { type: 'string', enum: ['high', 'standard', 'basic'], description: '模型档位；夜间低耗策略按档位生效' },
      },
      required: ['employeeId'],
    },
  },
  {
    name: 'assign_skills',
    description: '把技能目录里的技能分配给员工，或移除员工已有技能。',
    inputSchema: {
      type: 'object',
      properties: {
        employeeId: { type: 'string' },
        skillNames: { type: 'array', items: { type: 'string' }, description: '最终技能列表；空数组表示清空' },
      },
      required: ['employeeId', 'skillNames'],
    },
  },
  {
    name: 'assign_tools',
    description: '把工具目录里的工具分配给员工，或移除员工已有工具。',
    inputSchema: {
      type: 'object',
      properties: {
        employeeId: { type: 'string' },
        toolCodes: { type: 'array', items: { type: 'string' }, description: '最终工具列表；空数组表示清空' },
      },
      required: ['employeeId', 'toolCodes'],
    },
  },
  {
    name: 'save_tool',
    description: '新建或更新公司工具目录里的工具。秘书和人事可以用它把新的能力登记成工具，再分配给员工。',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: '工具编码，例如 media.export' },
        name: { type: 'string', description: '工具显示名称' },
        category: { type: 'string', description: '类别，例如 文件/媒体/管理/扩展' },
        description: { type: 'string', description: '工具用途说明' },
        implementation: { type: 'string', description: '实现方式，例如 mcp:company.xxx 或 本地命令' },
        risk: { type: 'string', description: '风险等级 L0-L4' },
        kind: { type: 'string', enum: ['native', 'company', 'planned'], description: '工具类型' },
        enabled: { type: 'boolean', description: '是否启用，默认 true' },
      },
      required: ['code', 'name'],
    },
  },
  {
    name: 'save_server',
    description: '新建或更新公司服务器台账（机房）：名称、接入方式（本机/SSH）、地址、端口、SSH 用户、分组、标签、说明。已有服务器传 serverId。',
    inputSchema: {
      type: 'object',
      properties: {
        serverId: { type: 'string', description: '已有服务器 ID；留空表示新建' },
        name: { type: 'string', description: '服务器名称，例如 ComfyUI 工作站' },
        mode: { type: 'string', enum: ['local', 'ssh'], description: '本机或 SSH 远程' },
        host: { type: 'string', description: 'IP 或主机名' },
        sshPort: { type: 'number' },
        sshUser: { type: 'string' },
        sshKeyPath: { type: 'string', description: '私钥路径，可留空使用默认密钥' },
        group: { type: 'string', description: '分组，例如 本机 / 渲染集群' },
        tags: { type: 'array', items: { type: 'string' } },
        note: { type: 'string' },
      },
      required: ['name'],
    },
  },
  {
    name: 'delete_server',
    description: '从机房台账删除一台服务器。只删服务器记录，不删除服务器上的实际服务。',
    inputSchema: {
      type: 'object',
      properties: { serverId: { type: 'string' } },
      required: ['serverId'],
    },
  },
  {
    name: 'save_service',
    description: '在指定服务器下新建或更新一个服务（Web/API/Worker/渲染/数据库等），可配置端口、启动/停止命令、健康检查、管理台、自动启动。',
    inputSchema: {
      type: 'object',
      properties: {
        serverId: { type: 'string' },
        serviceId: { type: 'string', description: '已有服务 ID；留空新建' },
        name: { type: 'string' },
        projectId: { type: 'string' },
        type: { type: 'string', enum: ['web', 'api', 'worker', 'render', 'db', 'other'] },
        runtime: { type: 'string', enum: ['process', 'docker', 'k8s'] },
        port: { type: 'number' },
        manageUrl: { type: 'string' },
        healthUrl: { type: 'string' },
        cwd: { type: 'string' },
        startCommand: { type: 'string' },
        stopCommand: { type: 'string' },
        autoStart: { type: 'boolean' },
        group: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        containerName: { type: 'string' },
        namespace: { type: 'string' },
        note: { type: 'string' },
      },
      required: ['serverId', 'name'],
    },
  },
  {
    name: 'delete_service',
    description: '从服务器下删除一个服务记录。只删台账记录，不停止实际进程。',
    inputSchema: {
      type: 'object',
      properties: { serverId: { type: 'string' }, serviceId: { type: 'string' } },
      required: ['serverId', 'serviceId'],
    },
  },
  {
    name: 'save_device',
    description: '新建或更新公司设备资产：名称、类别、型号、序列号、位置、状态、负责人、规格参数、连接方式、标签、备注。',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: '已有设备 ID；留空新建' },
        name: { type: 'string' },
        category: { type: 'string', description: '例如 3D打印机 / 工作站 / 相机 / 网络设备' },
        model: { type: 'string' },
        serial: { type: 'string' },
        location: { type: 'string' },
        status: { type: 'string', enum: ['可用', '占用', '维修', '停用'] },
        owner: { type: 'string' },
        specs: { type: 'string', description: '规格参数、耗材、限制' },
        connection: { type: 'string', description: 'IP、端口、软件或操作方式' },
        tags: { type: 'array', items: { type: 'string' } },
        note: { type: 'string' },
      },
      required: ['name'],
    },
  },
  {
    name: 'delete_device',
    description: '删除公司设备资产记录。',
    inputSchema: {
      type: 'object',
      properties: { deviceId: { type: 'string' } },
      required: ['deviceId'],
    },
  },
  {
    name: 'save_skill',
    description: '新建或更新公司技能目录里的技能：名称、说明、分类、做法说明、技能内容。',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        instructions: { type: 'string' },
        content: { type: 'string', description: '完整 SKILL.md 内容，留空自动生成' },
        enabled: { type: 'boolean' },
      },
      required: ['name'],
    },
  },
  {
    name: 'save_expert',
    description: '新建或更新专家：名称、职业、领域、简介、技能、标签、绑定员工/项目。',
    inputSchema: {
      type: 'object',
      properties: {
        expertId: { type: 'string', description: '已有专家 ID；留空新建' },
        name: { type: 'string' },
        profession: { type: 'string' },
        domain: { type: 'string' },
        bio: { type: 'string' },
        description: { type: 'string' },
        skills: { type: 'array', items: { type: 'string' } },
        tags: { type: 'array', items: { type: 'string' } },
        employeeIds: { type: 'array', items: { type: 'string' } },
        projectIds: { type: 'array', items: { type: 'string' } },
        rate: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['name'],
    },
  },
  {
    name: 'delete_expert',
    description: '删除专家，并解除它与员工/项目的绑定。',
    inputSchema: {
      type: 'object',
      properties: { expertId: { type: 'string' } },
      required: ['expertId'],
    },
  },
  {
    name: 'company_asset_overview',
    description: '汇总公司资产：服务器、机房服务、设备、工具、技能、专家、知识库、文档、项目、员工，适合人事行政盘点。',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'update_project',
    description: '维护项目资料：名称、描述、状态、版本、用户数、技术栈、快捷入口、合同金额、笔记。用于补齐项目缺失内容。',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: '项目 ID' },
        name: { type: 'string' },
        desc: { type: 'string' },
        status: { type: 'string' },
        version: { type: 'string' },
        users: { type: 'number' },
        techStack: { type: 'array', items: { type: 'string' } },
        links: {
          type: 'object',
          description: '快捷入口：web/api/db/admin/repo/deploy/payment/analytics/docs/design',
          additionalProperties: { type: 'string' },
        },
        contractAmount: { type: 'number' },
        notes: { type: 'string' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'audit_company',
    description: '体检公司资料：秘书域检查项目描述、技术栈、快捷入口、成员、里程碑、知识、收支、资料证书；人事域检查公司信息、工具、技能、专家、知识库、服务器、设备、员工模型、模型能力和备份。返回缺口清单。',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: '只看某个项目，留空检查全部' },
        scope: { type: 'string', enum: ['project', 'company', 'all'], description: 'project=秘书项目体检，company=人事公司体检，all=全部（默认）' },
      },
    },
  },
  {
    name: 'repair_company',
    description: '把公司体检发现的缺口转成维护任务：项目缺口派给秘书，公司/工具/技能/专家/知识库/服务器/设备等缺口派给人事。',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: '只处理某个项目，留空处理全部' },
        scope: { type: 'string', enum: ['project', 'company', 'all'], description: '处理范围，默认 all' },
        assigneeId: { type: 'string', description: '强制指定负责人；留空按缺口归属派给秘书或人事' },
      },
    },
  },
  {
    name: 'assign_experts',
    description: '把专家绑定到员工和/或项目。绑定后，专家内容会进入对应员工/项目的上下文。',
    inputSchema: {
      type: 'object',
      properties: {
        expertIds: { type: 'array', items: { type: 'string' } },
        employeeIds: { type: 'array', items: { type: 'string' } },
        projectIds: { type: 'array', items: { type: 'string' } },
      },
      required: ['expertIds'],
    },
  },
  {
    name: 'create_task',
    description: '创建任务并指派给员工，可指定项目、优先级、截止和验收标准。',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        projectId: { type: 'string' },
        assigneeId: { type: 'string' },
        priority: { type: 'string', enum: ['低', '中', '高', '紧急'] },
        due: { type: 'string' },
        acceptance: { type: 'string' },
      },
      required: ['title', 'projectId', 'assigneeId'],
    },
  },
  {
    name: 'list_tasks',
    description: '查看任务列表，可按项目、员工或状态过滤。',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string' },
        assigneeId: { type: 'string' },
        status: { type: 'string' },
      },
    },
  },
  {
    name: 'update_task',
    description: '更新任务状态、负责人、优先级、截止或验收标准。',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string' },
        status: { type: 'string', enum: ['待办', '进行中', '待验收', '已完成', '阻塞'] },
        assigneeId: { type: 'string' },
        priority: { type: 'string', enum: ['低', '中', '高', '紧急'] },
        due: { type: 'string' },
        acceptance: { type: 'string' },
      },
      required: ['taskId'],
    },
  },
  {
    name: 'ledger_summary',
    description: '读取账本汇总：总成本、token、按项目/员工/模型的成本分布。',
    inputSchema: {
      type: 'object',
      properties: { days: { type: 'number', description: '最近多少天，默认 30' } },
    },
  },
  {
    name: 'list_documents',
    description: '列出公司文档目录，可按关键词过滤。',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' } },
    },
  },
  {
    name: 'read_document',
    description: '读取指定文档的全文。',
    inputSchema: {
      type: 'object',
      properties: { documentId: { type: 'string' } },
      required: ['documentId'],
    },
  },
  {
    name: 'list_pending_deliverables',
    description: '查看待验收交付物与验收标准。',
    inputSchema: {
      type: 'object',
      properties: { projectId: { type: 'string' } },
    },
  },
  {
    name: 'read_deliverable',
    description: '读取交付物内容与状态。',
    inputSchema: {
      type: 'object',
      properties: { deliverableId: { type: 'string' } },
      required: ['deliverableId'],
    },
  },
  {
    name: 'review_deliverable',
    description: '验收交付物：approve 通过 / reject 打回（打回必须写原因）。秘书作为项目总负责人用它做验收，不需要老板逐步安排。',
    inputSchema: {
      type: 'object',
      properties: {
        deliverableId: { type: 'string' },
        action: { type: 'string', enum: ['approve', 'reject'] },
        comment: { type: 'string', description: '验收意见；reject 时必填' },
      },
      required: ['deliverableId', 'action'],
    },
  },
  {
    name: 'submit_deliverable',
    description:
      '把工位或项目工作区里的真实文件登记成交付物（挂到任务或项目），返回交付物 ID 和可打开链接。产出方案、文档、代码或图片后必须用它，不能只在聊天里发路径。',
    inputSchema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string' },
          description: '文件相对工位的路径，可多个；主文件放第一个',
        },
        taskId: { type: 'string', description: '关联任务 ID，可留空' },
        projectId: { type: 'string', description: '项目 ID；留空时按任务或员工所在项目推断' },
        name: { type: 'string', description: '交付物名称，留空用主文件名' },
        note: { type: 'string', description: '交付说明' },
      },
      required: ['files'],
    },
  },
  {
    name: 'delivery_preflight',
    description:
      '交付前自动自检：扫描交付物里的空文件、TODO/占位符、未替换模板变量、密钥泄漏、本地绝对路径、Markdown 断链、JSON/CSV 结构，返回阻断项、提醒项和可直接粘贴的《交付前自检报告》。不传 paths 时扫描你最近 48 小时改过的文件。',
    inputSchema: {
      type: 'object',
      properties: {
        paths: {
          type: 'array',
          items: { type: 'string' },
          description: '要检查的文件或目录；绝对路径，或相对你的工位/项目工作区',
        },
        maxFiles: { type: 'number', description: '最多检查多少个文件，默认 40，上限 200' },
      },
    },
  },
  {
    name: 'request_permission',
    description: '发起权限申请，生成决策卡等待老板审批。',
    inputSchema: {
      type: 'object',
      properties: {
        employeeId: { type: 'string', description: '申请人员工 ID，默认当前员工' },
        permission: { type: 'string', description: '权限编码，例如 finance.read' },
        reason: { type: 'string', description: '申请理由' },
      },
      required: ['permission', 'reason'],
    },
  },
  {
    name: 'list_projects',
    description: '查看公司项目列表：项目 ID、名称、类型、状态、进度、参与人数。创建任务或分派工作前先看它。',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: '按状态过滤，例如 进行中/规划中/已完成' },
        includeArchived: { type: 'boolean', description: '是否包含已归档项目，默认 false' },
      },
    },
  },
  {
    name: 'create_project',
    description: '新建一个项目。会自动创建项目工作区与初始快照，并把创建人加入项目组。',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: '项目名称' },
        type: { type: 'string', description: '项目类型，例如 研发/内容/设计/运营' },
        desc: { type: 'string', description: '项目目标与范围说明' },
        status: { type: 'string', description: '初始状态，默认 规划中' },
        employeeIds: { type: 'array', items: { type: 'string' }, description: '初始成员员工 ID' },
        due: { type: 'string', description: '目标日期，可填 待定' },
        params: { type: 'string', description: '项目关键参数：尺寸、精度、预算、产能、设备、账号等，会写入项目知识库' },
        process: { type: 'string', description: '项目流程/工序/验收标准，会写入项目知识库' },
      },
      required: ['name'],
    },
  },
  {
    name: 'scan_projects',
    description: '扫描工作区里已经存在的目录，识别出还没登记成项目的旧项目。返回候选目录名、路径、文件数和推测类型。',
    inputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', description: '要扫描的根目录；留空扫描默认工作区' },
        adopt: { type: 'boolean', description: '是否把扫到的目录直接登记为项目，默认 false（只返回候选）' },
      },
    },
  },
  {
    name: 'list_devices',
    description: '查看公司设备清单：名称、类别、型号、状态、位置。需要设备参数或借用设备前先查它。',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: '按类别过滤，例如 3D打印机/服务器/工作站/测试设备' },
        status: { type: 'string', description: '按状态过滤：可用/占用/维修/停用' },
        query: { type: 'string', description: '按名称、型号、标签搜索' },
      },
    },
  },
  {
    name: 'read_device',
    description: '读取一台设备的完整信息：型号、序列号、位置、状态、规格参数、连接方式、负责人、标签和备注。',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: '设备 ID，可先用 list_devices 查' },
        name: { type: 'string', description: '设备名称，deviceId 为空时按名称匹配' },
      },
    },
  },
  {
    name: 'list_servers',
    description: '查看公司服务器：名称、模式（本机/SSH）、地址、在线状态、已登记服务。扫描服务器前先看它。',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'scan_server_services',
    description:
      '扫描一台服务器上正在运行的服务，返回监听端口、进程命令行、Docker 容器、systemd 服务。拿到结果后由你判断每个端口是什么服务并命名，再用 register_server_services 登记。不要直接把端口号当服务名。',
    inputSchema: {
      type: 'object',
      properties: {
        serverId: { type: 'string', description: '服务器 ID，可先用 list_servers 查' },
        serverName: { type: 'string', description: '服务器名称，serverId 为空时按名称匹配' },
      },
    },
  },
  {
    name: 'ssh_exec',
    description:
      '在已登记的 SSH 服务器上执行一条远程命令，使用服务器台账里的地址、用户和私钥。适合查看 GPU、磁盘、ComfyUI、Docker、日志等；不要用它执行删除、关机、格式化等破坏性操作。',
    inputSchema: {
      type: 'object',
      properties: {
        serverId: { type: 'string', description: '服务器 ID，可先用 list_servers 查' },
        serverName: { type: 'string', description: '服务器名称，serverId 为空时按名称匹配' },
        command: { type: 'string', description: '远程执行的命令，例如 nvidia-smi / df -h / docker ps' },
        timeoutMs: { type: 'number', description: '超时毫秒数，默认 30000' },
      },
      required: ['command'],
    },
  },
  {
    name: 'register_server_services',
    description:
      '把扫描出来的服务登记到服务器下。名称要用人类可读的服务名（例如 Ollama、ComfyUI、Netdata），不要用「python :11434」。已存在同端口服务时更新名称与命令。',
    inputSchema: {
      type: 'object',
      properties: {
        serverId: { type: 'string', description: '服务器 ID' },
        serverName: { type: 'string', description: '服务器名称，serverId 为空时按名称匹配' },
        services: {
          type: 'array',
          description: '要登记的服务列表',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: '人类可读名称，例如 ComfyUI' },
              port: { type: 'number', description: '监听端口' },
              type: { type: 'string', enum: ['web', 'api', 'worker', 'render', 'db', 'other'] },
              runtime: { type: 'string', enum: ['process', 'docker', 'k8s'] },
              containerName: { type: 'string', description: 'Docker 容器名（runtime=docker 时）' },
              startCommand: { type: 'string', description: '启动命令，不知道就留空' },
              stopCommand: { type: 'string' },
              cwd: { type: 'string', description: '工作目录' },
              healthUrl: { type: 'string', description: '健康检查地址，例如 http://127.0.0.1:11434/api/tags' },
              manageUrl: { type: 'string', description: '管理台地址' },
              group: { type: 'string', description: '分组，默认「扫描发现」' },
              note: { type: 'string', description: '判断依据，例如「命令行是 ollama serve」' },
            },
            required: ['name', 'port'],
          },
        },
      },
      required: ['services'],
    },
  },
  {
    name: 'list_memories',
    description:
      '查看公司知识库/记忆列表：服务器、设备、服务、流程、项目参数、制度等。维护前先列出已有条目，避免重复。',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'string', enum: ['公司', '团队', '项目', '员工'], description: '按层级过滤' },
        category: { type: 'string', description: '按分类过滤，例如 服务器/设备/服务/流程/项目参数' },
        layer: { type: 'string', enum: ['rule', 'note', 'log'], description: '按记忆层过滤：rule 规则 / note 笔记 / log 日志' },
        query: { type: 'string', description: '按名称、摘要、正文关键词搜索' },
        limit: { type: 'number', description: '最多返回条数，默认 30' },
      },
    },
  },
  {
    name: 'search_memories',
    description:
      '按当前问题检索记忆，返回最相关的条目（BM25 + 项目/岗位加权）。回答前不确定公司是否记过某个参数、流程、决定时，先用它搜一遍，再决定是否 read_memory 取全文。',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '要检索的问题或关键词，例如「18080 服务 端口」「3D 打印 参数」' },
        scope: { type: 'string', enum: ['公司', '团队', '项目', '员工'], description: '限定层级，默认全部可见范围' },
        layer: { type: 'string', enum: ['rule', 'note', 'log'], description: '限定记忆层' },
        limit: { type: 'number', description: '返回条数，默认 8，最多 30' },
      },
      required: ['query'],
    },
  },
  {
    name: 'read_memory',
    description: '读取一条公司知识/记忆的全文。员工执行任务前需要设备参数、服务地址、项目流程时用它。',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: '记忆 ID' },
        name: { type: 'string', description: '记忆名称，id 为空时按名称模糊匹配' },
      },
    },
  },
  {
    name: 'save_memory',
    description:
      '新建或更新公司知识/记忆（仅秘书、人事行政可用）。设备型号与参数、服务器地址与账号说明、服务端口与启动方式、业务流程、项目参数都写这里。scope 选「公司」或「项目」，内容要写清型号、地址、端口、参数、步骤和注意事项。写入后进入记忆索引并按问题召回，员工需要全文时用 read_memory。',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: '要更新的记忆 ID；为空则按名称匹配，仍没有就新建' },
        name: { type: 'string', description: '记忆名称，例如「ComfyUI 服务器」「3D 打印设备参数」「项目 X 流程与参数」' },
        scope: { type: 'string', enum: ['公司', '团队', '项目', '员工'], description: '默认公司' },
        category: { type: 'string', enum: ['公司制度', '服务器', '设备', '服务', '流程', '项目参数', '客户', '其他'] },
        layer: { type: 'string', enum: ['rule', 'note', 'log'], description: '记忆层：rule 长期规则 / note 项目笔记 / log 日志（90 天过期）；默认按名称自动判断' },
        content: { type: 'string', description: 'Markdown 全文：型号、地址、端口、参数、步骤、注意事项' },
        projectId: { type: 'string', description: 'scope=项目 时填项目 ID' },
        employeeId: { type: 'string', description: 'scope=员工 时填员工 ID' },
        teamId: { type: 'string', description: 'scope=团队 时填团队 ID' },
        tags: { type: 'array', items: { type: 'string' }, description: '检索标签' },
        pinned: { type: 'boolean', description: '是否置顶（重要知识每轮都注入）' },
      },
      required: ['name', 'content'],
    },
  },
  {
    name: 'gateway_overview',
    description:
      '查看公司内置网关：运行状态、账号池、积分、签到情况、模型策略。人事/行政/秘书可用。需要账号余额、谁没签到、网关是否正常时先调它。',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'gateway_add_account',
    description:
      '生成 WorkBuddy 账号授权链接（添加网关账户）。返回的 url 要发给老板在浏览器登录；登录完成后账号会自动进池。人事/行政/秘书可用。',
    inputSchema: {
      type: 'object',
      properties: {
        realm: { type: 'string', enum: ['cn', 'global'], description: '国内版 cn（默认）或国际版 global' },
      },
    },
  },
  {
    name: 'gateway_checkin',
    description:
      '立即执行网关签到（赚当天积分）。不传 uid 就签到全部账号；传 uid 只签到指定账号。人事/行政/秘书可用。',
    inputSchema: {
      type: 'object',
      properties: {
        uid: { type: 'string', description: '账号 uid；留空表示全部账号' },
      },
    },
  },
  {
    name: 'gateway_models',
    description:
      '查看或设置网关模型：不传 models 时返回模型目录（含积分倍率、上下文、是否免费、档位）；传 models 数组可批量启用/停用、设置档位（high/standard/basic）和免费标记。人事/行政/秘书可用。',
    inputSchema: {
      type: 'object',
      properties: {
        models: {
          type: 'array',
          description: '要保存的模型策略；不传则只查询',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              enabled: { type: 'boolean' },
              tier: { type: 'string', enum: ['high', 'standard', 'basic'] },
              free: { type: 'boolean' },
              note: { type: 'string' },
            },
            required: ['id'],
          },
        },
      },
    },
  },
  {
    name: 'gateway_policy',
    description:
      '查看或设置网关策略：夜间低耗（几点到几点、切哪个模型、影响哪些档位员工）和自动签到时段。人事/行政/秘书可用。',
    inputSchema: {
      type: 'object',
      properties: {
        night: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            start: { type: 'string', description: 'HH:MM，例如 23:00' },
            end: { type: 'string', description: 'HH:MM，例如 08:00' },
            model: { type: 'string', description: '夜间使用的模型 ID，例如 cn:hy4flash-free' },
            tiers: { type: 'array', items: { type: 'string', enum: ['high', 'standard', 'basic'] } },
            effort: { type: 'string', enum: ['off', 'low', 'medium', 'high'] },
          },
        },
        checkin: {
          type: 'object',
          properties: {
            auto: { type: 'boolean' },
            hours: { type: 'array', items: { type: 'number' } },
          },
        },
      },
    },
  },
  {
    name: 'gateway_import',
    description:
      '把 Agent 从原网关导出的账号 JSON 导入公司网关。支持原网关 auths 文件、账号数组、{format:"workbuddy-accounts",accounts:[...]} 导出包。人事/行政/秘书可用。',
    inputSchema: {
      type: 'object',
      properties: {
        accounts: { type: 'array', description: '账号数组；每项可以是 {account,auth} 或扁平账号对象' },
        payload: { type: 'object', description: '也可以直接传整份导出 JSON' },
      },
    },
  },
  {
    name: 'gateway_export',
    description:
      '导出公司网关账号凭据到 outbox 文件，用于备份或迁移到其他机器。返回文件路径和账号数量。人事/行政/秘书可用。',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'gateway_import_remote',
    description:
      '从机房台账里的一台服务器直接读取原网关 auths 目录并导入公司网关。适合旧网关还在另一台机器上运行时做迁移。人事/行政/秘书可用。',
    inputSchema: {
      type: 'object',
      properties: {
        serverId: { type: 'string', description: '服务器 ID' },
        serverName: { type: 'string', description: '服务器名称，serverId 为空时按名称匹配' },
        authDir: { type: 'string', description: '原网关授权目录，默认 ~/wb2api/auths' },
      },
    },
  },
  {
    name: 'ask_user',
    description: '向老板发起选择式提问（单选/多选）。仅秘书可用；其他员工调用会自动转给秘书江叙，由秘书统一向老板确认。不要用自由文本追问，凡是能用选项表达的都走这个工具。',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: '这组问题的标题，例如「需求确认」' },
        intro: { type: 'string', description: '一句话说明为什么要问' },
        questions: {
          type: 'array',
          description: '问题列表，按顺序逐条提问',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '问题标识，留空自动生成' },
              title: { type: 'string', description: '问题本身' },
              type: { type: 'string', enum: ['single', 'multi'], description: '单选或多选' },
              required: { type: 'boolean', description: '是否必答，默认 true' },
              allowCustom: { type: 'boolean', description: '是否允许自己填写其他答案，默认 true；老板始终可以自由输入' },
              options: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    label: { type: 'string' },
                    desc: { type: 'string' },
                  },
                  required: ['label'],
                },
              },
            },
            required: ['title', 'options'],
          },
        },
      },
      required: ['title', 'questions'],
    },
  },
  {
    name: 'contact_employee',
    description: '主动找同事沟通。公司规定员工只能联系秘书江叙（e-jiang），不能直接联系其他员工；秘书可以联系任何员工。对方空闲时会等回复；对方在忙时消息进入收件箱并立即返回“已送达”，不要反复等待，稍后用 check_employee_messages 查看回复。',
    inputSchema: {
      type: 'object',
      properties: {
        employeeId: { type: 'string', description: '同事员工 ID，可先用 list_employees 查' },
        employeeName: { type: 'string', description: '同事姓名，employeeId 为空时按姓名匹配' },
        projectId: { type: 'string', description: '可选：让这次沟通带上某个项目的上下文' },
        message: { type: 'string', description: '要说清楚的事：背景、需要他做什么、什么时候要' },
      },
      required: ['message'],
    },
  },
  {
    name: 'check_employee_messages',
    description: '查看同事已经回复但你还没读的消息。contact_employee 返回 queued 或对方在忙时，用它取回复；返回后标记为已读。',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: '最多返回几条，默认 10' },
      },
    },
  },

];

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

async function resolveToken() {
  const candidates = [TOKEN_PATH, TOKEN_FILE].filter(Boolean);
  for (const file of candidates) {
    try {
      const value = (await readFile(file, 'utf8')).trim();
      if (value) return value;
    } catch {
      /* 继续尝试下一个 */
    }
  }
  return '';
}

async function callApi(tool, args) {
  const token = await resolveToken();

  const response = await fetch(`${API}/api/agent-tools/execute`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-company-token': token,
      'x-company-employee': EMPLOYEE_ID,
    },
    body: JSON.stringify({ tool, args }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }
  return payload.result;
}

async function handleRequest(message) {
  const { id, method, params } = message;
  if (method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'one-company-tools', version: '1.0.0' },
      },
    });
    return;
  }
  if (method === 'notifications/initialized') return;
  if (method === 'ping') {
    send({ jsonrpc: '2.0', id, result: {} });
    return;
  }
  if (method === 'tools/list') {
    send({ jsonrpc: '2.0', id, result: { tools } });
    return;
  }
  if (method === 'tools/call') {
    const name = params?.name;
    const args = params?.arguments || {};
    try {
      const result = await callApi(name, args);
      send({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          isError: false,
        },
      });
    } catch (error) {
      send({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: `工具执行失败：${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        },
      });
    }
    return;
  }
  send({
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  });
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', (line) => {
  const text = line.trim();
  if (!text) return;
  let message;
  try {
    message = JSON.parse(text);
  } catch {
    return;
  }
  if (message.id === undefined || message.id === null) {
    if (message.method === 'notifications/initialized') return;
    return;
  }
  void handleRequest(message);
});
