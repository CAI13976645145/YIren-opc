/**
 * P1 能力：日报/周报、绩效、组织视图、记忆检索（全文 + 本地向量）、模板。
 * 纯函数，只读传入的 store，不负责落盘。
 */

export const PROJECT_TEMPLATES = [
  {
    id: 'tpl-project-dev',
    type: 'project',
    name: '研发项目',
    desc: '从需求到验收的标准研发流程，适合 Web / App / 工具类项目。',
    icon: 'dev',
    payload: {
      type: '研发',
      desc: '需求拆解 → 方案 → 实现 → 自测 → 验收',
      roles: ['产品/项目负责人', '研发工程师', '测试/审阅'],
      tasks: [
        { title: '需求拆解与验收标准', role: '产品/项目负责人', acceptance: '输出需求清单、范围边界、验收清单' },
        { title: '技术方案与排期', role: '研发工程师', acceptance: '输出技术方案、风险点、里程碑' },
        { title: '核心功能实现', role: '研发工程师', acceptance: '功能可运行，关键路径有说明' },
        { title: '自测与验收', role: '测试/审阅', acceptance: '按验收清单逐项通过，遗留问题列明' },
      ],
      acceptance: '功能可运行；关键路径有说明；验收清单逐项通过；无阻塞级缺陷。',
    },
  },
  {
    id: 'tpl-project-ops',
    type: 'project',
    name: '运营项目',
    desc: '目标 → 排期 → 投放 → 复盘的运营闭环。',
    icon: 'ops',
    payload: {
      type: '运营',
      desc: '目标拆解 → 内容排期 → 投放执行 → 数据复盘',
      roles: ['运营负责人', '内容策划', '数据分析'],
      tasks: [
        { title: '目标拆解与指标口径', role: '运营负责人', acceptance: '目标、指标、口径、周期写清楚' },
        { title: '内容与渠道排期', role: '内容策划', acceptance: '输出排期表，明确渠道、素材、负责人' },
        { title: '投放执行与监控', role: '运营负责人', acceptance: '按排期执行，异常有记录' },
        { title: '数据复盘', role: '数据分析', acceptance: '输出复盘报告，含结论与下一步动作' },
      ],
      acceptance: '目标可量化；排期可执行；数据可追溯；复盘有结论和下一步。',
    },
  },
  {
    id: 'tpl-project-knowledge',
    type: 'project',
    name: '知识工作',
    desc: '调研、方案、报告类项目的通用流程。',
    icon: 'knowledge',
    payload: {
      type: '知识',
      desc: '资料收集 → 分析框架 → 初稿 → 审阅 → 定稿',
      roles: ['研究负责人', '资料整理', '审阅人'],
      tasks: [
        { title: '资料收集与来源清单', role: '资料整理', acceptance: '来源可追溯，标注时间与可信度' },
        { title: '分析框架', role: '研究负责人', acceptance: '框架完整，问题与结论对应' },
        { title: '初稿撰写', role: '研究负责人', acceptance: '结构完整，论据充分' },
        { title: '审阅与定稿', role: '审阅人', acceptance: '事实核对完成，结论明确' },
      ],
      acceptance: '来源可追溯；结构完整；结论明确；可直接交付给外部读者。',
    },
  },
  {
    id: 'tpl-project-content',
    type: 'project',
    name: '内容生产',
    desc: '选题到成片的内容流水线，适合漫剧、短视频、图文。',
    icon: 'content',
    payload: {
      type: '运营',
      desc: '选题 → 脚本 → 分镜 → 制作 → 发布',
      roles: ['内容策划', '编剧', '剪辑/制作', '审阅人'],
      tasks: [
        { title: '选题与受众', role: '内容策划', acceptance: '选题理由、目标受众、传播点清楚' },
        { title: '脚本/大纲', role: '编剧', acceptance: '结构完整，冲突与节奏明确' },
        { title: '分镜与制作', role: '剪辑/制作', acceptance: '分镜可执行，成片符合脚本' },
        { title: '审阅与发布', role: '审阅人', acceptance: '无事实/合规问题，发布信息完整' },
      ],
      acceptance: '选题成立；脚本可拍；成片符合规范；发布信息完整。',
    },
  },
];

export const ROLE_TEMPLATES = [
  {
    id: 'tpl-role-dev',
    type: 'role',
    name: '研发工程师',
    desc: '能读代码、写实现、做自测的工程岗位。',
    payload: { role: '研发工程师', dept: '技术部', tools: ['read', 'write', 'task'], skills: ['需求分析', '编码', '自测'], permissions: ['project.read', 'project.write', 'task.write'] },
  },
  {
    id: 'tpl-role-ops',
    type: 'role',
    name: '运营专员',
    desc: '负责目标拆解、排期、投放与复盘。',
    payload: { role: '运营专员', dept: '运营部', tools: ['read', 'write', 'task'], skills: ['目标拆解', '排期', '数据复盘'], permissions: ['project.read', 'project.write', 'task.write'] },
  },
  {
    id: 'tpl-role-content',
    type: 'role',
    name: '内容策划',
    desc: '负责选题、脚本、内容排期与传播点。',
    payload: { role: '内容策划', dept: '内容部', tools: ['read', 'write', 'task'], skills: ['选题', '脚本', '内容排期'], permissions: ['project.read', 'project.write', 'task.write'] },
  },
  {
    id: 'tpl-role-review',
    type: 'role',
    name: '审阅人',
    desc: '只读审阅，负责质量门槛与事实核对。',
    payload: { role: '审阅人', dept: '支持部', tools: ['read', 'task'], skills: ['审阅', '事实核对', '质量门槛'], permissions: ['project.read', 'task.write'] },
  },
  {
    id: 'tpl-role-finance',
    type: 'role',
    name: '财务',
    desc: '负责报价、成本、预算与现金流判断。',
    payload: { role: '财务', dept: '支持部', tools: ['read', 'write', 'task'], skills: ['报价', '成本核算', '预算管理'], permissions: ['project.read', 'finance.read', 'task.write'] },
  },
  {
    id: 'tpl-role-support',
    type: 'role',
    name: '客服',
    desc: '负责客户沟通、售后与问题归集。',
    payload: { role: '客服', dept: '运营部', tools: ['read', 'write', 'task'], skills: ['客户沟通', '售后', '问题归集'], permissions: ['project.read', 'task.write'] },
  },
];

export const ACCEPTANCE_TEMPLATES = [
  {
    id: 'tpl-accept-code',
    type: 'acceptance',
    name: '代码交付',
    desc: '功能、可运行、有说明、无阻塞缺陷。',
    payload: {
      acceptance:
        '1. 功能按需求可运行，关键路径有操作说明；\n2. 代码结构清晰，无调试残留；\n3. 自测通过，遗留问题列明；\n4. 交付物包含变更说明与验证步骤。',
    },
  },
  {
    id: 'tpl-accept-content',
    type: 'acceptance',
    name: '内容稿件',
    desc: '结构完整、事实准确、可直接发布。',
    payload: {
      acceptance:
        '1. 标题、结构、结论完整；\n2. 事实与数据有来源；\n3. 无错别字与合规风险；\n4. 附带发布用摘要与标签。',
    },
  },
  {
    id: 'tpl-accept-design',
    type: 'acceptance',
    name: '视觉设计',
    desc: '风格一致、尺寸齐全、可落地。',
    payload: {
      acceptance:
        '1. 符合品牌风格与使用场景；\n2. 提供源文件与导出图；\n3. 尺寸、命名、切图规范；\n4. 标注交互与状态说明。',
    },
  },
  {
    id: 'tpl-accept-report',
    type: 'acceptance',
    name: '数据报告',
    desc: '口径清楚、可追溯、有结论。',
    payload: {
      acceptance:
        '1. 指标口径与数据来源写清楚；\n2. 关键结论有数据支撑；\n3. 异常与局限说明；\n4. 给出可执行的下一步建议。',
    },
  },
];

export const BUILTIN_TEMPLATES = [...PROJECT_TEMPLATES, ...ROLE_TEMPLATES, ...ACCEPTANCE_TEMPLATES];

function pad(value) {
  return String(value).padStart(2, '0');
}

export function localDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfDay(value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function periodRange(kind, reference = new Date()) {
  const now = reference instanceof Date ? reference : new Date(reference);
  if (kind === 'weekly') {
    const end = new Date(now);
    const start = startOfDay(new Date(now.getTime() - 6 * 86400000));
    return { start, end, label: `${localDateKey(start)} ~ ${localDateKey(end)}` };
  }
  const start = startOfDay(now);
  const end = new Date(now);
  return { start, end, label: localDateKey(now) };
}

function inRange(value, start, end) {
  if (!value) return false;
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return false;
  return time >= start.getTime() && time <= end.getTime() + 86400000 - 1;
}

function taskDoneAt(task) {
  return task.completedAt || (task.status === '已完成' ? task.updatedAt : '') || '';
}

function short(text, size = 120) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  return value.length > size ? `${value.slice(0, size)}…` : value;
}

function moneyValue(value) {
  return `¥${Number(value || 0).toFixed(4)}`;
}

function table(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell ?? '').replace(/\|/g, '/')).join(' | ')} |`),
  ].join('\n');
}

export function buildReport(store, kind = 'daily', options = {}) {
  const range = periodRange(kind, options.reference || new Date());
  const { start, end } = range;
  const employees = store.employees || [];
  const projects = store.projects || [];
  const tasks = store.tasks || [];
  const deliverables = store.deliverables || [];
  const usage = store.usage || [];
  const approvals = store.approvals || [];
  const decisions = store.decisions || [];
  const resolved = new Set(store.resolved || []);

  const windowUsage = usage.filter((row) => inRange(row.time, start, end));
  const tokens = windowUsage.reduce((sum, row) => sum + Number(row.totalTokens || 0), 0);
  const cost = windowUsage.reduce((sum, row) => sum + Number(row.cost || 0), 0);
  const doneTasks = tasks.filter((task) => task.status === '已完成' && inRange(taskDoneAt(task), start, end));
  const newDeliverables = deliverables.filter((item) => inRange(item.submittedAt || item.time, start, end));
  const approved = deliverables.filter((item) => item.status === '已通过' && inRange(item.reviewedAt || item.submittedAt, start, end));
  const rejected = deliverables.filter((item) => item.status === '已打回' && inRange(item.reviewedAt || item.submittedAt, start, end));
  const blocked = tasks.filter((task) => task.status === '阻塞');
  const active = tasks.filter((task) => task.status === '进行中' || task.status === '待验收');
  const pendingApprovals = approvals.filter((item) => item.status === 'pending');
  const pendingDecisions = decisions.filter((item) => !resolved.has(item.id));

  const employeeName = (id) => employees.find((item) => item.id === id)?.name || '未分配';
  const projectName = (id) => projects.find((item) => item.id === id)?.name || '未归集';

  const byEmployee = employees
    .map((emp) => {
      const done = doneTasks.filter((task) => task.assignee === emp.id);
      const ownDeliverables = newDeliverables.filter((item) => item.owner === emp.id);
      const ownUsage = windowUsage.filter((row) => row.employeeId === emp.id);
      return {
        emp,
        done: done.length,
        deliverables: ownDeliverables.length,
        tokens: ownUsage.reduce((sum, row) => sum + Number(row.totalTokens || 0), 0),
        cost: ownUsage.reduce((sum, row) => sum + Number(row.cost || 0), 0),
      };
    })
    .filter((row) => row.done || row.deliverables || row.tokens || row.cost);

  const projectSections = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.project === project.id);
    const done = projectTasks.filter((task) => task.status === '已完成' && inRange(taskDoneAt(task), start, end));
    const doing = projectTasks.filter((task) => task.status === '进行中' || task.status === '待验收');
    const blockedTasks = projectTasks.filter((task) => task.status === '阻塞');
    const projectDeliverables = newDeliverables.filter((item) => item.project === project.id);
    const lines = [
      `### ${project.name}（${project.type} · ${project.status} · ${project.progress || 0}%）`,
      `- 本期完成：${done.map((task) => task.title).join('、') || '无'}`,
      `- 进行中：${doing.map((task) => `${task.title}（${employeeName(task.assignee)}）`).join('、') || '无'}`,
      `- 阻塞：${blockedTasks.map((task) => task.title).join('、') || '无'}`,
      `- 交付物：${projectDeliverables.map((item) => `${item.name}（${item.status}）`).join('、') || '无'}`,
    ];
    const budget = Number(project.budget || 0);
    if (budget > 0) {
      const projectCost = usage
        .filter((row) => row.projectId === project.id)
        .reduce((sum, row) => sum + Number(row.cost || 0), 0);
      lines.push(`- 预算：${moneyValue(projectCost)} / ¥${budget.toFixed(2)}（${Math.min(999, Math.round((projectCost / budget) * 100))}%）`);
    }
    return lines.join('\n');
  });

  const risks = [
    ...blocked.map((task) => `任务「${task.title}」阻塞：${short(task.lastRun?.error || task.result || '等待处理', 100)}`),
    ...projects
      .filter((project) => Number(project.budget || 0) > 0)
      .map((project) => {
        const projectCost = usage
          .filter((row) => row.projectId === project.id)
          .reduce((sum, row) => sum + Number(row.cost || 0), 0);
        const ratio = projectCost / Number(project.budget);
        const warning = Number(project.budgetWarning || 80) / 100;
        return ratio >= warning ? `项目「${project.name}」预算使用 ${Math.round(ratio * 100)}%，超过预警线 ${Math.round(warning * 100)}%。` : '';
      })
      .filter(Boolean),
    ...pendingDecisions.map((item) => `待决策：${item.title}（建议：${short(item.recommendation, 60)}）`),
    ...pendingApprovals.map((item) => `待审批：${item.employeeName || '员工'} · ${item.toolName} · ${item.filePath || item.channel || ''}`),
  ];

  const nextSteps = [];
  if (blocked.length) nextSteps.push('先处理阻塞任务，明确卡点与责任人。');
  if (pendingDecisions.length) nextSteps.push(`处理 ${pendingDecisions.length} 张决策卡，避免任务停等。`);
  if (pendingApprovals.length) nextSteps.push(`处理 ${pendingApprovals.length} 条写操作/外发审批。`);
  if (active.length) nextSteps.push(`跟进 ${active.length} 个进行中任务，优先推进高优先级项。`);
  if (!nextSteps.length) nextSteps.push('保持当前节奏，安排下一批可交付任务。');

  const title = `${kind === 'weekly' ? '周报' : '日报'} · ${range.label}`;
  const markdown = [
    `# ${title}`,
    '',
    `公司：${store.company?.name || '一人公司'}　周期：${range.label}`,
    '',
    '## 一、本期结论',
    `- 完成任务 ${doneTasks.length} 个，新增交付物 ${newDeliverables.length} 份，验收通过 ${approved.length} 份，打回 ${rejected.length} 份。`,
    `- 模型调用 ${windowUsage.length} 次，消耗 ${tokens.toLocaleString()} tokens，成本 ${moneyValue(cost)}。`,
    `- 待决策 ${pendingDecisions.length} 项，待审批 ${pendingApprovals.length} 项，阻塞任务 ${blocked.length} 个。`,
    '',
    '## 二、项目进展',
    projectSections.join('\n\n') || '暂无项目。',
    '',
    '## 三、员工产出',
    byEmployee.length
      ? table(
          ['员工', '完成任务', '交付物', 'Tokens', '成本'],
          byEmployee.map((row) => [row.emp.name, row.done, row.deliverables, row.tokens.toLocaleString(), moneyValue(row.cost)]),
        )
      : '本期没有员工产出记录。',
    '',
    '## 四、风险与卡点',
    risks.length ? risks.map((item) => `- ${item}`).join('\n') : '- 暂无阻塞、预算预警或待决策事项。',
    '',
    '## 五、下一步建议',
    nextSteps.map((item) => `- ${item}`).join('\n'),
    '',
    `> 生成时间：${new Date().toLocaleString('zh-CN', { hour12: false })}`,
  ].join('\n');

  return {
    id: `rp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind,
    title,
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    periodLabel: range.label,
    createdAt: new Date().toISOString(),
    markdown,
    summary: {
      tasksDone: doneTasks.length,
      deliverables: newDeliverables.length,
      approved: approved.length,
      rejected: rejected.length,
      blocked: blocked.length,
      tokens,
      cost: Number(cost.toFixed(6)),
      pendingDecisions: pendingDecisions.length,
      pendingApprovals: pendingApprovals.length,
      calls: windowUsage.length,
    },
  };
}

function parseDueAt(task) {
  if (task.dueAt) return new Date(task.dueAt);
  const value = String(task.due || '').trim();
  if (!value) return null;
  if (value === '今天') {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  }
  const match = /^(\d{1,2})-(\d{1,2})$/.exec(value);
  if (match) {
    const date = new Date();
    date.setMonth(Number(match[1]) - 1, Number(match[2]));
    date.setHours(23, 59, 59, 999);
    return date;
  }
  return null;
}

export function buildPerformance(store, days = 30) {
  const end = new Date();
  const start = new Date(end.getTime() - Math.max(1, Number(days) || 30) * 86400000);
  const tasks = store.tasks || [];
  const deliverables = store.deliverables || [];
  const usage = store.usage || [];
  const employees = store.employees || [];
  const projects = store.projects || [];

  const rows = employees.map((emp) => {
    const ownTasks = tasks.filter((task) => task.assignee === emp.id);
    const done = ownTasks.filter((task) => task.status === '已完成' && (!taskDoneAt(task) || inRange(taskDoneAt(task), start, end)));
    const ownDeliverables = deliverables.filter((item) => item.owner === emp.id && (!item.submittedAt || inRange(item.submittedAt, start, end)));
    const approved = ownDeliverables.filter((item) => item.status === '已通过').length;
    const rejected = ownDeliverables.filter((item) => item.status === '已打回').length;
    const reviewed = approved + rejected;
    const ownUsage = usage.filter((row) => row.employeeId === emp.id && inRange(row.time, start, end));
    const tokens = ownUsage.reduce((sum, row) => sum + Number(row.totalTokens || 0), 0);
    const cost = ownUsage.reduce((sum, row) => sum + Number(row.cost || 0), 0);
    const cycles = done
      .map((task) => {
        const from = task.createdAt ? new Date(task.createdAt).getTime() : NaN;
        const to = taskDoneAt(task) ? new Date(taskDoneAt(task)).getTime() : NaN;
        return Number.isFinite(from) && Number.isFinite(to) && to > from ? (to - from) / 3600000 : null;
      })
      .filter((value) => value !== null);
    const withDue = done.filter((task) => parseDueAt(task));
    const onTime = withDue.filter((task) => {
      const due = parseDueAt(task);
      const finished = taskDoneAt(task) ? new Date(taskDoneAt(task)) : null;
      return due && finished && finished.getTime() <= due.getTime();
    }).length;
    return {
      employeeId: emp.id,
      name: emp.name,
      role: emp.role,
      dept: emp.dept,
      color: emp.color,
      projects: ownTasks.map((task) => projects.find((item) => item.id === task.project)?.name).filter(Boolean).filter((value, index, list) => list.indexOf(value) === index),
      tasksDone: done.length,
      tasksActive: ownTasks.filter((task) => task.status === '进行中' || task.status === '待验收').length,
      tasksBlocked: ownTasks.filter((task) => task.status === '阻塞').length,
      deliverables: ownDeliverables.length,
      approved,
      rejected,
      reworkRate: reviewed ? Number(((rejected / reviewed) * 100).toFixed(1)) : 0,
      avgCycleHours: cycles.length ? Number((cycles.reduce((sum, value) => sum + value, 0) / cycles.length).toFixed(1)) : null,
      onTimeRate: withDue.length ? Number(((onTime / withDue.length) * 100).toFixed(1)) : null,
      tokens,
      cost: Number(cost.toFixed(6)),
      calls: ownUsage.length,
    };
  });

  return {
    days: Math.max(1, Number(days) || 30),
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    rows: rows.sort((a, b) => b.tasksDone + b.deliverables - (a.tasksDone + a.deliverables)),
    total: {
      tasksDone: rows.reduce((sum, row) => sum + row.tasksDone, 0),
      deliverables: rows.reduce((sum, row) => sum + row.deliverables, 0),
      tokens: rows.reduce((sum, row) => sum + row.tokens, 0),
      cost: Number(rows.reduce((sum, row) => sum + row.cost, 0).toFixed(6)),
    },
  };
}

export function buildOrg(store) {
  const employees = store.employees || [];
  const projects = store.projects || [];
  const tasks = store.tasks || [];
  const byId = new Map(employees.map((emp) => [emp.id, emp]));
  const departments = [...new Set(employees.map((emp) => emp.dept || '未分组'))];
  return {
    departments: departments.map((dept) => {
      const members = employees.filter((emp) => (emp.dept || '未分组') === dept);
      return {
        name: dept,
        members: members.map((emp) => ({
          id: emp.id,
          name: emp.name,
          role: emp.role,
          color: emp.color,
          reportsTo: emp.reportsTo || '',
          reportsToName: byId.get(emp.reportsTo)?.name || '',
          load: tasks.filter((task) => task.assignee === emp.id && (task.status === '进行中' || task.status === '待验收')).length,
          projects: projects
            .filter((project) => (project.team || []).includes(emp.id) || project.id === emp.projectId)
            .map((project) => project.id),
        })),
      };
    }),
    matrix: employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      dept: emp.dept,
      color: emp.color,
      cells: projects.map((project) => {
        const inTeam = (project.team || []).includes(emp.id);
        const activeTasks = tasks.filter((task) => task.project === project.id && task.assignee === emp.id && (task.status === '进行中' || task.status === '待验收')).length;
        return { projectId: project.id, inTeam, activeTasks };
      }),
      load: tasks.filter((task) => task.assignee === emp.id && (task.status === '进行中' || task.status === '待验收')).length,
    })),
    projects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      type: project.type,
      team: (project.team || []).map((id) => byId.get(id)?.name || id),
      members: (project.team || []).length,
      activeTasks: tasks.filter((task) => task.project === project.id && (task.status === '进行中' || task.status === '待验收')).length,
    })),
    reportsTo: employees.map((emp) => ({ id: emp.id, name: emp.name, reportsTo: emp.reportsTo || '', reportsToName: byId.get(emp.reportsTo)?.name || '' })),
  };
}

/* ---------------- 检索：BM25 + 字符 n-gram 哈希向量 ---------------- */

function tokenize(text) {
  const value = String(text || '').toLowerCase();
  const tokens = [];
  for (const part of value.split(/[\s，。！？、；：,.!?;:()[\]{}"'`~@#$%^&*+=|\\/<>-]+/)) {
    if (!part) continue;
    if (/[\u4e00-\u9fa5]/.test(part)) {
      for (let index = 0; index < part.length; index += 1) {
        tokens.push(part[index]);
        if (index + 1 < part.length) tokens.push(part.slice(index, index + 2));
      }
    } else {
      tokens.push(part);
    }
  }
  return tokens;
}

function hashVector(tokens, size = 128) {
  const vector = new Float64Array(size);
  for (const token of tokens) {
    let hash = 2166136261;
    for (let index = 0; index < token.length; index += 1) {
      hash ^= token.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    const slot = Math.abs(hash) % size;
    vector[slot] += (hash & 1) === 0 ? 1 : -1;
  }
  let norm = 0;
  for (const value of vector) norm += value * value;
  norm = Math.sqrt(norm) || 1;
  for (let index = 0; index < size; index += 1) vector[index] /= norm;
  return vector;
}

function cosine(a, b) {
  let sum = 0;
  for (let index = 0; index < a.length; index += 1) sum += a[index] * b[index];
  return sum;
}

export function searchAll(store, query, options = {}) {
  const q = String(query || '').trim();
  if (!q) return { query: '', total: 0, results: [] };
  const limit = Math.min(80, Math.max(1, Number(options.limit) || 30));
  const employeeName = (id) => store.employees?.find((item) => item.id === id)?.name || '';
  const projectName = (id) => store.projects?.find((item) => item.id === id)?.name || '';
  const docs = [];

  const push = (type, id, title, text, extra = {}) => {
    const body = String(text || '').replace(/\s+/g, ' ').trim();
    if (!body && !title) return;
    docs.push({ type, id, title, text: body, ...extra });
  };

  for (const item of store.memories || []) {
    push('memory', item.id, item.name, `${item.summary || ''} ${item.content || ''}`, { subtitle: `${item.scope}记忆 · ${projectName(item.projectId) || employeeName(item.employeeId) || '公司'}`, view: 'memories', path: item.path || '' });
  }
  for (const item of store.documents || []) {
    push('document', item.id, item.title || item.name, `${item.category || ''} ${item.summary || ''} ${item.content || ''}`, { subtitle: item.category || '公司文档', view: 'documents', path: item.path || '' });
  }
  for (const item of store.tasks || []) {
    push('task', item.id, item.title, `${item.acceptance || ''} ${item.result || ''} ${employeeName(item.assignee)} ${projectName(item.project)}`, { subtitle: `任务 · ${item.status} · ${employeeName(item.assignee) || '未分配'}`, view: 'tasks', path: '' });
  }
  for (const item of store.deliverables || []) {
    push('deliverable', item.id, item.name, `${item.note || ''} ${item.content || ''} ${projectName(item.project)}`, { subtitle: `交付物 · ${item.status} · ${projectName(item.project)}`, view: 'deliverables', path: item.path || '' });
  }
  for (const item of store.projects || []) {
    push('project', item.id, item.name, `${item.desc || ''} ${item.type || ''} ${item.status || ''}`, { subtitle: `项目 · ${item.type} · ${item.status}`, view: 'projects', path: item.workspacePath || '' });
  }
  for (const item of store.employees || []) {
    push('employee', item.id, item.name, `${item.role || ''} ${item.desc || ''} ${(item.skills || []).join(' ')}`, { subtitle: `员工 · ${item.role}`, view: 'employees', path: item.cwd || '' });
  }
  for (const [chatKey, messages] of Object.entries(store.chats || {})) {
    for (const message of messages || []) {
      const from = message.from === 'me' ? '老板' : employeeName(message.from) || '员工';
      const where = chatKey.startsWith('project:') ? projectName(chatKey.split(':')[1]) : from;
      push('message', message.id, `${where} · ${message.time || ''}`, message.text, { subtitle: `对话 · ${from}`, view: 'deliverables', chatKey, path: '' });
    }
  }

  const queryTokens = tokenize(q);
  const queryVector = hashVector(queryTokens);
  const docTokens = docs.map((doc) => tokenize(`${doc.title} ${doc.text} ${doc.subtitle || ''}`));
  const avgLen = docTokens.reduce((sum, tokens) => sum + tokens.length, 0) / Math.max(1, docs.length);
  const df = new Map();
  for (const tokens of docTokens) {
    for (const token of new Set(tokens)) df.set(token, (df.get(token) || 0) + 1);
  }
  const N = docs.length;
  const k1 = 1.2;
  const b = 0.75;
  const results = [];
  docs.forEach((doc, index) => {
    const tokens = docTokens[index];
    const counts = new Map();
    for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1);
    let bm25 = 0;
    for (const token of queryTokens) {
      const tf = counts.get(token) || 0;
      if (!tf) continue;
      const n = df.get(token) || 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      bm25 += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (tokens.length / Math.max(1, avgLen)))));
    }
    const vectorScore = cosine(queryVector, hashVector(tokens));
    const score = bm25 * 0.75 + vectorScore * 4;
    if (score <= 0.01) return;
    const lower = `${doc.title} ${doc.text}`.toLowerCase();
    const qLower = q.toLowerCase();
    const at = lower.indexOf(qLower);
    const start = at >= 0 ? Math.max(0, at - 40) : 0;
    const snippet = `${at > 40 ? '…' : ''}${doc.text.slice(start, start + 120)}${doc.text.length > start + 120 ? '…' : ''}`;
    results.push({ ...doc, score: Number(score.toFixed(3)), snippet });
  });
  results.sort((a, b) => b.score - a.score);
  return { query: q, total: results.length, results: results.slice(0, limit) };
}

/* ---------------- 定时任务 ---------------- */

export function normalizeSchedule(input = {}) {
  const type = ['daily', 'weekly', 'interval'].includes(input.type) ? input.type : 'daily';
  const time = /^\d{2}:\d{2}$/.test(input.time || '') ? input.time : '09:00';
  const weekday = Math.max(1, Math.min(7, Number(input.weekday) || 1));
  const intervalMinutes = Math.max(5, Math.min(1440, Number(input.intervalMinutes) || 60));
  const action = ['report-daily', 'report-weekly', 'meeting-standup', 'snapshot-projects', 'health-check'].includes(input.action)
    ? input.action
    : 'health-check';
  return {
    id: input.id || `sc-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name: String(input.name || '定时任务').slice(0, 60),
    type,
    time,
    weekday,
    intervalMinutes,
    action,
    projectId: input.projectId || '',
    enabled: input.enabled !== false,
    lastRunAt: input.lastRunAt || '',
    nextRunAt: input.nextRunAt || '',
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

export function nextRunAt(schedule, from = new Date()) {
  const now = new Date(from);
  if (schedule.type === 'interval') {
    return new Date(now.getTime() + Math.max(5, Number(schedule.intervalMinutes) || 60) * 60000).toISOString();
  }
  const [hour, minute] = String(schedule.time || '09:00').split(':').map(Number);
  const next = new Date(now);
  next.setSeconds(0, 0);
  if (schedule.type === 'weekly') {
    const target = Math.max(1, Math.min(7, Number(schedule.weekday) || 1));
    const jsTarget = target === 7 ? 0 : target;
    next.setHours(hour, minute, 0, 0);
    let delta = (jsTarget - next.getDay() + 7) % 7;
    if (delta === 0 && next.getTime() <= now.getTime()) delta = 7;
    next.setDate(next.getDate() + delta);
    return next.toISOString();
  }
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  return next.toISOString();
}
