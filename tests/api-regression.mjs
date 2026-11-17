#!/usr/bin/env node
/**
 * 一人公司 · 全量 API 回归测试
 * 用法：BASE=http://127.0.0.1:4401 node tests/api-regression.mjs
 * 说明：请在数据副本上运行（默认 4401 沙箱实例），避免污染正式 data/store.json
 */

const BASE = process.env.BASE || 'http://127.0.0.1:4401';
const results = [];
let currentSection = '未分组';

const C = { green: '\x1b[32m', red: '\x1b[31m', gray: '\x1b[90m', bold: '\x1b[1m', reset: '\x1b[0m' };

function section(name) {
  currentSection = name;
  console.log(`\n${C.bold}▌ ${name}${C.reset}`);
}

async function req(method, path, body, headers = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'content-type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, json, text, headers: res.headers };
}

function record(name, ok, detail) {
  results.push({ section: currentSection, name, ok, detail });
  const tag = ok ? `${C.green}PASS${C.reset}` : `${C.red}FAIL${C.reset}`;
  console.log(`  ${tag}  ${name}${detail ? `  ${C.gray}${detail}${C.reset}` : ''}`);
}

async function test(name, fn) {
  try {
    const detail = await fn();
    record(name, true, detail || '');
  } catch (error) {
    record(name, false, error instanceof Error ? error.message : String(error));
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function expectOk(r, label = '') {
  assert(r.status >= 200 && r.status < 300, `${label} HTTP ${r.status} ${(r.text || '').slice(0, 220)}`);
  assert(r.json && r.json.ok === true, `${label} ok!=true ${(r.text || '').slice(0, 220)}`);
  return r.json;
}

function expectStatus(r, code, label = '') {
  assert(r.status === code, `${label} 期望 ${code} 实际 ${r.status} ${(r.text || '').slice(0, 200)}`);
  return r;
}

async function sse(path, body, timeoutMs = 240_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(BASE + path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    const events = [];
    for (const chunk of text.split('\n\n')) {
      const line = chunk.split('\n').find((l) => l.startsWith('data:'));
      if (!line) continue;
      try {
        events.push(JSON.parse(line.slice(5).trim()));
      } catch {
        /* 忽略非 JSON 事件 */
      }
    }
    return { status: res.status, events, text };
  } finally {
    clearTimeout(timer);
  }
}

const ids = {};

async function main() {
  console.log(`${C.bold}一人公司 · 全量 API 回归${C.reset}  ${BASE}  ${new Date().toLocaleString('zh-CN')}`);

  /* ============ A. 基础状态 ============ */
  section('A. 基础 / 状态');
  await req('POST', '/api/autonomy', { enabled: '0' }).catch(() => {});
  await test('GET /api/health 健康检查', async () => {
    const j = expectOk(await req('GET', '/api/health'));
    assert(j.app === '一人公司', 'app 名称不符');
    return `v${j.version}`;
  });
  await test('GET /api/state 全量状态', async () => {
    const j = expectOk(await req('GET', '/api/state'));
    assert(Array.isArray(j.state.employees) && j.state.employees.length >= 2, '员工数据异常');
    ids.employee = j.state.employees.find((e) => !e.archived).id;
    let project = j.state.projects[0];
    if (!project) {
      const created = expectOk(await req('POST', '/api/projects', { name: '回归测试项目', type: '研发', desc: '自动化' }));
      project = created.project;
      ids.newProject = project.id;
    }
    ids.project = project.id;
    ids.task = j.state.tasks[0]?.id || '';
  });

  /* ============ B. 设置 ============ */
  section('B. 设置 / 模型');
  await test('GET /api/settings 读取设置', async () => {
    const j = expectOk(await req('GET', '/api/settings'));
    assert(j.settings && j.settings.model, '缺少模型配置');
    assert(j.usage !== undefined, '缺少 usage');
    return `model=${j.settings.model}`;
  });
  await test('POST /api/settings 保存设置（幂等回写）', async () => {
    const cur = (await req('GET', '/api/settings')).json.settings;
    const j = expectOk(
      await req('POST', '/api/settings', {
        provider: cur.provider,
        baseUrl: cur.baseUrl,
        model: cur.model,
        temperature: cur.temperature,
        maxTokens: cur.maxTokens,
      }),
    );
    return `model=${j.settings.model}`;
  });
  await test('POST /api/settings 非法 BaseURL 应为 400', async () => {
    const r = await req('POST', '/api/settings', { baseUrl: 'ftp://x' });
    expectStatus(r, 400);
    return r.json?.code;
  });
  await test('POST /api/settings/test 模型连通性', async () => {
    const r = await req('POST', '/api/settings/test', {});
    assert(r.status === 200, `HTTP ${r.status}`);
    return `ok=${r.json.ok} latency=${r.json.latencyMs ?? '-'}ms`;
  });
  await test('POST /api/settings/channels/test 渠道测试（webhook 缺参校验）', async () => {
    const r = await req('POST', '/api/settings/channels/test', { channel: 'webhook' });
    assert([200, 400].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status}`;
  });
  await test('GET /api/models 模型目录', async () => {
    const r = await req('GET', '/api/models');
    assert(r.status === 200, `HTTP ${r.status}`);
    return `bridge=${r.json.bridge} ${r.json.catalog ? '有目录' : '无目录'}`;
  });

  /* ============ C. 账本 / 审计 / 通知 ============ */
  section('C. 账本 / 审计 / 通知');
  await test('GET /api/ledger 账本汇总', async () => {
    const j = expectOk(await req('GET', '/api/ledger?range=7d'));
    return `summary=${Boolean(j.summary || j.usage)} rows=${(j.rows || j.entries || []).length}`;
  });
  await test('GET /api/ledger/export CSV 导出', async () => {
    const r = await req('GET', '/api/ledger/export?range=7d');
    assert(r.status === 200, `HTTP ${r.status}`);
    assert((r.headers.get('content-type') || '').includes('csv'), '不是 CSV');
    return `${r.text.length} 字节`;
  });
  await test('GET /api/audit 审计日志', async () => {
    const j = expectOk(await req('GET', '/api/audit?limit=20'));
    assert(Array.isArray(j.records), '缺少 records 数组');
    assert(j.records.length > 0, '审计日志为空');
    return `${j.records.length} 条 / 总计 ${j.total ?? '—'}`;
  });
  await test('GET /api/audit/verify 哈希链校验', async () => {
    const j = expectOk(await req('GET', '/api/audit/verify'));
    assert(j.chain && j.chain.ok === true, `哈希链异常：${JSON.stringify(j.chain)}`);
    return `${j.chain.total} 条链路完整`;
  });
  await test('GET /api/audit/export 审计导出', async () => {
    const r = await req('GET', '/api/audit/export');
    assert(r.status === 200, `HTTP ${r.status}`);
    return `${r.text.length} 字节`;
  });
  await test('GET /api/notifications 通知列表', async () => {
    const j = expectOk(await req('GET', '/api/notifications'));
    assert(Array.isArray(j.notifications), 'notifications 非数组');
    ids.notification = j.notifications[0]?.id;
    return `${j.notifications.length} 条`;
  });
  await test('POST /api/notifications/read 标记已读', async () => {
    const j = expectOk(await req('POST', '/api/notifications/read', { all: true }));
    assert(j.unread === 0, '仍有未读');
    return '全部已读';
  });
  await test('POST /api/notifications/delete 删除通知（无 id 应安全返回）', async () => {
    const r = await req('POST', '/api/notifications/delete', {});
    assert([200, 400, 404].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status}`;
  });

  /* ============ D. 公司资产目录 ============ */
  section('D. 公司资产 / 目录');
  await test('GET /api/tools 工具目录', async () => {
    const j = expectOk(await req('GET', '/api/tools'));
    ids.tool = j.tools.find((t) => !t.builtin && t.kind !== 'planned')?.code || j.tools[0]?.code;
    return `${j.tools.length} 个工具`;
  });
  await test('GET /api/skills 技能目录', async () => {
    const j = expectOk(await req('GET', '/api/skills'));
    ids.skill = j.skills.find((s) => !s.builtin)?.name || j.skills[0]?.name;
    return `${j.skills.length} 个技能`;
  });
  await test('GET /api/experts 专家目录', async () => {
    const j = expectOk(await req('GET', '/api/experts'));
    ids.expert = j.experts[0]?.id;
    return `${j.experts.length} 位专家`;
  });
  await test('GET /api/experts/content 专家正文', async () => {
    const j = expectOk(await req('GET', `/api/experts/content?id=${encodeURIComponent(ids.expert)}`));
    assert(typeof j.content === 'string', 'content 非字符串');
    return `${j.content.length} 字`;
  });
  await test('GET /api/experts/workbuddy 扫描本地专家', async () => {
    const j = expectOk(await req('GET', '/api/experts/workbuddy'));
    ids.wbPackage = j.candidates?.[0]?.packageName;
    return `候选 ${j.total} 个 / 已扫 ${j.scanned}`;
  });
  await test('GET /api/templates 模板市场', async () => {
    const j = expectOk(await req('GET', '/api/templates'));
    const list = j.templates || [];
    ids.tplProject = list.find((t) => t.type === 'project')?.id;
    ids.tplRole = list.find((t) => t.type === 'role')?.id;
    ids.tplAcceptance = list.find((t) => t.type === 'acceptance')?.id;
    assert(ids.tplProject && ids.tplRole, '缺少项目/岗位模板');
    return `${list.length} 个模板`;
  });
  await test('GET /api/templates/export 模板导出', async () => {
    const r = await req('GET', `/api/templates/export?id=${encodeURIComponent(ids.tplProject)}`);
    assert(r.status === 200, `HTTP ${r.status}`);
    return `${r.text.length} 字节`;
  });

  /* ============ E. 员工全生命周期 ============ */
  section('E. 员工全生命周期');
  await test('POST /api/employees 新建员工', async () => {
    const j = expectOk(
      await req('POST', '/api/employees', {
        name: '回归测试员',
        role: '测试工程师',
        dept: '质量部',
        desc: '自动化回归创建',
        tools: ['read', 'write'],
        skills: [ids.skill],
      }),
    );
    ids.newEmployee = j.employee.id;
    return `${j.employee.name} preset=${j.preset?.ok}`;
  });
  await test('POST /api/employees/update 更新员工', async () => {
    const j = expectOk(
      await req('POST', '/api/employees/update', {
        id: ids.newEmployee,
        role: '高级测试工程师',
        desc: '回归更新',
      }),
    );
    assert(j.employee.role === '高级测试工程师', '角色未更新');
    return j.employee.role;
  });
  await test('POST /api/employees/hire 按岗位模板招聘', async () => {
    const j = expectOk(
      await req('POST', '/api/employees/hire', {
        roleTemplateId: ids.tplRole,
        name: '模板招聘员',
        projectIds: [ids.project],
      }),
    );
    ids.hiredEmployee = j.employee.id;
    return `${j.employee.role} 技能${j.employee.skills.length} 工具${j.employee.tools.length} 专家${(j.employee.expertIds || []).length}`;
  });
  await test('POST /api/tools/assign 分配工具（批量）', async () => {
    const j = expectOk(await req('POST', '/api/tools/assign', { toolCode: ids.tool, employeeIds: [ids.newEmployee] }));
    return `更新 ${j.updated}`;
  });
  await test('POST /api/skills/assign 分配技能（批量）', async () => {
    const j = expectOk(await req('POST', '/api/skills/assign', { skillName: ids.skill, employeeIds: [ids.newEmployee] }));
    return `更新 ${j.updated}`;
  });
  await test('POST /api/experts/assign 绑定专家', async () => {
    const j = expectOk(
      await req('POST', '/api/experts/assign', {
        expertIds: [ids.expert],
        employeeIds: [ids.newEmployee],
        projectIds: [ids.project],
      }),
    );
    return `${j.experts.length} 位专家`;
  });
  await test('GET /api/agent-tools/context-preview 上下文预览', async () => {
    const j = expectOk(
      await req('GET', `/api/agent-tools/context-preview?employeeId=${ids.newEmployee}&projectId=${ids.project}`),
    );
    assert(j.employee, '缺少员工摘要');
    return `${j.employee.name} 记忆${j.memoryCount ?? (j.memories || []).length}`;
  });
  await test('POST /api/employees/archive 归档交接', async () => {
    const j = expectOk(await req('POST', '/api/employees/archive', { id: ids.newEmployee, handoverTo: ids.employee, reason: '回归测试' }));
    assert(j.employee.archived === true, '未标记归档');
    return `转交 ${j.reassigned} 个任务`;
  });
  await test('POST /api/employees/restore 恢复员工', async () => {
    const j = expectOk(await req('POST', '/api/employees/restore', { id: ids.newEmployee }));
    assert(j.employee.archived === false, '未恢复');
    return '已恢复';
  });

  /* ============ F. 项目 ============ */
  section('F. 项目');
  await test('POST /api/projects 新建项目', async () => {
    const j = expectOk(await req('POST', '/api/projects', { name: '回归测试项目', type: '研发', desc: '自动化' }));
    ids.newProject = j.project.id;
    return j.project.name;
  });
  await test('POST /api/projects/update 更新项目', async () => {
    const j = expectOk(await req('POST', '/api/projects/update', { id: ids.newProject, status: '进行中', desc: '回归更新' }));
    assert(j.project.status === '进行中', '状态未更新');
    return j.project.status;
  });
  await test('POST /api/projects/snapshot 创建快照', async () => {
    const j = expectOk(await req('POST', '/api/projects/snapshot', { projectId: ids.newProject, label: '回归快照' }));
    ids.snapshot = j.snapshot.id;
    return j.snapshot.id;
  });
  await test('GET /api/projects/snapshots 快照列表', async () => {
    const j = expectOk(await req('GET', `/api/projects/snapshots?projectId=${ids.newProject}`));
    assert(j.snapshots.length >= 1, '快照为空');
    return `${j.snapshots.length} 个快照`;
  });
  await test('POST /api/projects/rollback 回滚（需确认）', async () => {
    const r1 = await req('POST', '/api/projects/rollback', { projectId: ids.newProject, snapshotId: ids.snapshot });
    expectStatus(r1, 400, '未确认');
    const j = expectOk(
      await req('POST', '/api/projects/rollback', { projectId: ids.newProject, snapshotId: ids.snapshot, confirm: true }),
    );
    return '已回滚';
  });

  /* ============ G. 任务 ============ */
  section('G. 任务');
  await test('POST /api/tasks 新建任务', async () => {
    const j = expectOk(
      await req('POST', '/api/tasks', {
        title: '回归任务 · 主流程',
        project: ids.newProject,
        assignee: ids.hiredEmployee,
        priority: '高',
        due: '今天 18:00',
        acceptance: '自动化验收',
        autoRun: '0',
      }),
    );
    ids.newTask = j.task.id;
    return j.task.title;
  });
  await test('POST /api/tasks/update 更新任务', async () => {
    const j = expectOk(await req('POST', '/api/tasks/update', { id: ids.newTask, priority: '紧急', status: '进行中' }));
    assert(j.task.priority === '紧急', '优先级未更新');
    return j.task.priority;
  });
  await test('POST /api/tasks/toggle 勾选完成 / 取消', async () => {
    const a = expectOk(await req('POST', '/api/tasks/toggle', { id: ids.newTask }));
    assert(a.state.tasks.find((t) => t.id === ids.newTask).status === '已完成', '未完成');
    const b = expectOk(await req('POST', '/api/tasks/toggle', { id: ids.newTask }));
    assert(b.state.tasks.find((t) => t.id === ids.newTask).status !== '已完成', '未取消完成');
    return '双向切换正常';
  });
  await test('POST /api/tasks/from-message 从消息建任务', async () => {
    expectOk(await req('POST', '/api/messages', { chatKey: 'employee:' + ids.employee, message: { text: '请把这份回归报告整理成任务' } }));
    const state = (await req('GET', '/api/state')).json.state;
    const msg = state.chats['employee:' + ids.employee].slice(-1)[0];
    const j = expectOk(
      await req('POST', '/api/tasks/from-message', {
        chatKey: 'employee:' + ids.employee,
        messageId: msg.id,
        project: ids.newProject,
        assignee: ids.hiredEmployee,
      }),
    );
    ids.msgTask = j.task.id;
    return j.task.title;
  });
  await test('POST /api/tasks/handoff 任务转交', async () => {
    const st = (await req('GET', '/api/state')).json.state;
    const target = st.employees.find((e) => !e.archived && e.id !== ids.employee) || st.employees.find((e) => !e.archived);
    ids.employee = target.id;
    const j = expectOk(await req('POST', '/api/tasks/handoff', { taskId: ids.msgTask, toEmployeeId: ids.employee, note: '回归转交' }));
    return j.handoff.toName;
  });
  await test('POST /api/tasks/run 启动执行（预期 202 或并发限制）', async () => {
    const r = await req('POST', '/api/tasks/run', { id: ids.newTask });
    assert([202, 409, 429, 400].includes(r.status), `HTTP ${r.status}`);
    ids.runningTask = ids.newTask;
    return `HTTP ${r.status} ${r.json?.code || r.json?.message || ''}`;
  });
  await test('POST /api/tasks/cancel 停止不存在的运行应 404', async () => {
    const r = await req('POST', '/api/tasks/cancel', { id: 't-not-exist' });
    expectStatus(r, 404);
    return r.json?.code;
  });
  await test('POST /api/tasks/resume 断点继续（预期 202/409）', async () => {
    const r = await req('POST', '/api/tasks/resume', { id: ids.newTask });
    assert([202, 409].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status}`;
  });
  await test('POST /api/tasks/review 验收（无待验收应 400）', async () => {
    const r = await req('POST', '/api/tasks/review', { taskId: ids.newTask, action: 'approve' });
    assert([200, 400].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status} ${r.json?.code || ''}`;
  });
  await test('POST /api/autonomy 自主开工开关', async () => {
    const on = expectOk(await req('POST', '/api/autonomy', { enabled: '1', maxConcurrency: 2 }));
    const off = expectOk(await req('POST', '/api/autonomy', { enabled: '0' }));
    assert(off.autonomy.enabled === false, '关闭失败');
    return `enabled=${on.autonomy.enabled} 并发=${on.autonomy.maxConcurrency}（测试后已关闭）`;
  });

  /* ============ H. 交付物 ============ */
  section('H. 交付物');
  await test('POST /api/deliverables/upload 本地上传', async () => {
    const content = Buffer.from('# 回归测试交付物\n\n这是一份自动化生成的交付物。', 'utf8').toString('base64');
    const j = expectOk(
      await req('POST', '/api/deliverables/upload', {
        name: '回归交付物.md',
        taskId: ids.newTask,
        contentBase64: content,
        note: '回归上传',
      }),
    );
    ids.deliverable = j.deliverable.id;
    return `${j.deliverable.name} v${j.deliverable.version}`;
  });
  await test('GET /api/deliverables/content 预览正文', async () => {
    const j = expectOk(await req('GET', `/api/deliverables/content?id=${ids.deliverable}`));
    assert(String(j.text || '').includes('回归测试'), `正文不符：${String(j.text || '').slice(0, 80)}`);
    assert(j.binary === false, 'markdown 不应为二进制');
    return `${String(j.text).length} 字`;
  });
  await test('GET /api/deliverables/raw 原文下载', async () => {
    const r = await req('GET', `/api/deliverables/raw?id=${ids.deliverable}`);
    assert(r.status === 200 && r.text.length > 0, `HTTP ${r.status}`);
    return `${r.text.length} 字节`;
  });
  await test('GET /api/office/preview Office 预览（md 走降级）', async () => {
    const r = await req('GET', `/api/office/preview?id=${ids.deliverable}`);
    assert(r.status === 200, `HTTP ${r.status}`);
    return `ok=${r.json.ok}`;
  });
  await test('POST /api/deliverables/review 打回（缺原因应 400）', async () => {
    const r = await req('POST', '/api/deliverables/review', { id: ids.deliverable, action: 'reject' });
    expectStatus(r, 400);
    return r.json?.code;
  });
  await test('POST /api/deliverables/review 验收通过', async () => {
    const j = expectOk(await req('POST', '/api/deliverables/review', { id: ids.deliverable, action: 'approve', comment: '回归通过' }));
    assert(j.deliverable.status === '已通过', '状态未更新');
    return j.deliverable.status;
  });
  await test('POST /api/deliverables 提交工作区文件', async () => {
    const r = await req('POST', '/api/deliverables', { taskId: ids.newTask, filePath: 'README.md', name: 'README.md' });
    assert([200, 400, 404].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status} ${r.json?.code || ''}`;
  });

  /* ============ I. 记忆 ============ */
  section('I. 记忆');
  await test('POST /api/memories 新建记忆', async () => {
    const j = expectOk(
      await req('POST', '/api/memories', {
        name: '回归记忆',
        content: '这是回归测试写入的记忆内容。',
        scope: '项目',
        project: ids.newProject,
      }),
    );
    ids.memory = j.memory.id;
    return `${j.memory.name} v${j.memory.version}`;
  });
  await test('GET /api/memories 列表', async () => {
    const j = expectOk(await req('GET', '/api/memories'));
    return `${j.memories.length} 条`;
  });
  await test('GET /api/memories/:id 详情', async () => {
    const j = expectOk(await req('GET', `/api/memories/${encodeURIComponent(ids.memory)}`));
    assert(j.content.includes('回归测试'), '正文不符');
    return j.content.length + ' 字';
  });
  await test('POST /api/memories/update 更新（版本+1）', async () => {
    const j = expectOk(await req('POST', '/api/memories/update', { id: ids.memory, content: '回归记忆 v2', note: '回归更新' }));
    assert(j.memory.version === 2, `版本 ${j.memory.version}`);
    return `v${j.memory.version}`;
  });
  await test('POST /api/memories/update 版本冲突应 409', async () => {
    const r = await req('POST', '/api/memories/update', { id: ids.memory, content: '冲突写入', baseVersion: 1 });
    expectStatus(r, 409);
    return r.json?.code;
  });
  await test('POST /api/memories/rollback 回滚版本', async () => {
    const j = expectOk(await req('POST', '/api/memories/rollback', { id: ids.memory, version: 1 }));
    return `v${j.memory.version}`;
  });

  /* ============ J. 决策 / 审批 / 外部动作 ============ */
  section('J. 决策 / 审批 / 外部动作');
  await test('POST /api/decisions 提交决策卡', async () => {
    const j = expectOk(
      await req('POST', '/api/decisions', {
        title: '回归决策：是否继续扩编',
        background: '自动化测试',
        recommendation: '建议暂缓',
        impact: '人力成本',
        project: ids.newProject,
        owner: ids.employee,
      }),
    );
    ids.decision = j.decision.id;
    return j.decision.title;
  });
  await test('POST /api/decisions/resolve 拍板', async () => {
    const j = expectOk(await req('POST', '/api/decisions/resolve', { id: ids.decision, result: 'approve' }));
    assert(j.decision.result === 'approve', '未记录结果');
    return j.decision.result;
  });
  await test('POST /api/approvals/request 写前审批', async () => {
    const j = expectOk(
      await req('POST', '/api/approvals/request', {
        employeeId: ids.employee,
        projectId: ids.newProject,
        toolName: 'write',
        arguments: { file_path: 'store.json', content: '# 回归写入覆盖测试' },
        sessionId: 'sess-regression',
      }),
    );
    ids.approval = j.approvalId;
    return j.approvalId;
  });
  await test('GET /api/approvals/:id 查询审批', async () => {
    const j = expectOk(await req('GET', `/api/approvals/${ids.approval}`));
    assert(j.approval.status === 'pending', `期望 pending 实际 ${j.approval.status}`);
    assert(j.approval.level === 2, `期望 L2 实际 L${j.approval.level}`);
    return `${j.approval.levelLabel}`;
  });
  await test('POST /api/approvals/decide 拒绝需原因', async () => {
    const r = await req('POST', '/api/approvals/decide', { id: ids.approval, action: 'reject' });
    expectStatus(r, 400);
    return r.json?.code;
  });
  await test('POST /api/approvals/decide 批准', async () => {
    const j = expectOk(await req('POST', '/api/approvals/decide', { id: ids.approval, action: 'approve', comment: '回归批准' }));
    return 'approved';
  });
  await test('POST /api/outbound 外部动作（转审批）', async () => {
    const j = expectOk(
      await req('POST', '/api/outbound', {
        channel: 'email',
        recipient: 'test@example.com',
        subject: '回归测试',
        body: '自动化外部动作',
        projectId: ids.newProject,
        employeeId: ids.employee,
      }),
    );
    ids.outboundApproval = j.approval.id;
    return `${j.approval.levelLabel}`;
  });
  await test('POST /api/approvals/decide 批准外部动作（写入 outbox）', async () => {
    const j = expectOk(
      await req('POST', '/api/approvals/decide', { id: ids.outboundApproval, action: 'approve', allowSimilar: true }),
    );
    return `outbox=${j.state.outbox.length}`;
  });

  /* ============ K. 工位 / 项目文件 ============ */
  section('K. 工位 / 项目文件');
  await test('GET /api/project-files 项目文件', async () => {
    const j = expectOk(await req('GET', `/api/project-files?projectId=${ids.newProject}`));
    assert(Array.isArray(j.projects), 'projects 非数组');
    const files = j.projects.find((p) => p.id === ids.newProject)?.files || [];
    return `${files.length} 个文件`;
  });
  await test('GET /api/stations 工位列表', async () => {
    const j = expectOk(await req('GET', `/api/stations?projectId=${ids.newProject}`));
    return `${(j.stations || []).length} 个工位`;
  });
  await test('POST /api/stations/sync 同步工位', async () => {
    const r = await req('POST', '/api/stations/sync', { projectId: ids.newProject, employeeId: ids.hiredEmployee });
    assert([200, 400].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status}`;
  });
  await test('POST /api/stations/clean 清理工位（需确认）', async () => {
    const r1 = await req('POST', '/api/stations/clean', { projectId: ids.newProject, employeeId: ids.hiredEmployee });
    expectStatus(r1, 400, '未确认');
    const j = expectOk(await req('POST', '/api/stations/clean', { projectId: ids.newProject, employeeId: ids.hiredEmployee, confirm: true }));
    return '已清理';
  });
  await test('GET /api/employee-files 员工文件', async () => {
    const st = (await req('GET', '/api/state')).json.state;
    ids.employee = st.employees.find((e) => !e.archived).id;
    const j = expectOk(await req('GET', `/api/employee-files?employeeId=${ids.employee}&projectId=${ids.project}`));
    assert(Array.isArray(j.files), 'files 非数组');
    return `${j.files.length} 个文件`;
  });

  /* ============ L. 团队 / 报表 / 绩效 / 组织 / 检索 ============ */
  section('L. 团队 / 运营中心');
  await test('GET /api/teams 团队列表', async () => {
    const j = expectOk(await req('GET', '/api/teams'));
    return `${j.teams.length} 个团队`;
  });
  await test('POST /api/teams 新建团队', async () => {
    const j = expectOk(
      await req('POST', '/api/teams', { name: '回归测试组', dept: '质量部', lead: ids.employee, members: [ids.employee, ids.hiredEmployee] }),
    );
    ids.team = j.team.id;
    return `${j.team.name} ${j.team.members.length} 人`;
  });
  await test('POST /api/teams/delete 删除团队', async () => {
    expectOk(await req('POST', '/api/teams/delete', { id: ids.team }));
    return '已删除';
  });
  await test('POST /api/reports/generate 生成日报', async () => {
    const j = expectOk(await req('POST', '/api/reports/generate', { kind: 'daily' }));
    ids.report = j.report.id;
    return j.report.title || 'ok';
  });
  await test('GET /api/reports 报表列表', async () => {
    const j = expectOk(await req('GET', '/api/reports'));
    return `${j.reports.length} 份`;
  });
  await test('GET /api/reports/export 报表导出', async () => {
    const r = await req('GET', `/api/reports/export?id=${encodeURIComponent(ids.report)}`);
    assert(r.status === 200, `HTTP ${r.status}`);
    assert(r.text.length > 0, '报表内容为空');
    return `${r.text.length} 字节`;
  });
  await test('GET /api/performance 绩效', async () => {
    const j = expectOk(await req('GET', '/api/performance?days=7'));
    assert(j.performance && Array.isArray(j.performance.rows), 'performance.rows 缺失');
    return `${j.performance.rows.length} 人`;
  });
  await test('GET /api/org 组织矩阵', async () => {
    const j = expectOk(await req('GET', '/api/org'));
    assert(j.org && Array.isArray(j.org.departments), 'org.departments 缺失');
    return `${j.org.departments.length} 部门 / ${j.org.matrix.length} 人`;
  });
  await test('GET /api/search 混合检索', async () => {
    const j = expectOk(await req('GET', '/api/search?q=%E6%89%8B%E5%8A%9E'));
    return `${(j.results || []).length} 条结果`;
  });

  /* ============ M. 模板应用 / 自动化 ============ */
  section('M. 模板 / 自动化');
  await test('POST /api/templates/import 导入模板', async () => {
    const j = expectOk(
      await req('POST', '/api/templates/import', {
        templates: [{ type: 'acceptance', name: '回归验收模板', desc: '自动化', payload: { acceptance: '全部自动化用例通过' } }],
      }),
    );
    ids.customTpl = j.imported[0].id;
    return j.imported[0].name;
  });
  await test('POST /api/templates/apply 项目模板套用', async () => {
    const j = expectOk(await req('POST', '/api/templates/apply', { id: ids.tplProject, projectId: ids.newProject }));
    return `生成任务 ${j.createdTasks}`;
  });
  await test('POST /api/templates/apply 验收模板套用', async () => {
    const j = expectOk(await req('POST', '/api/templates/apply', { id: ids.customTpl, projectId: ids.newProject }));
    return '已写入项目默认验收';
  });
  await test('POST /api/schedules 新建定时任务', async () => {
    const j = expectOk(
      await req('POST', '/api/schedules', {
        name: '回归定时任务',
        type: 'daily',
        time: '09:30',
        action: 'report',
        reportKind: 'daily',
        enabled: true,
      }),
    );
    ids.schedule = j.schedule.id;
    return j.schedule.name;
  });
  await test('GET /api/schedules 定时任务列表', async () => {
    const j = expectOk(await req('GET', '/api/schedules'));
    return `${j.schedules.length} 个`;
  });
  await test('POST /api/schedules/toggle 启停', async () => {
    const j = expectOk(await req('POST', '/api/schedules/toggle', { id: ids.schedule, enabled: false }));
    return `enabled=${j.schedule.enabled}`;
  });
  await test('POST /api/schedules/run 手动运行', async () => {
    const j = expectOk(await req('POST', '/api/schedules/run', { id: ids.schedule }));
    return `run=${j.run.status}`;
  });
  await test('POST /api/schedules/delete 删除', async () => {
    expectOk(await req('POST', '/api/schedules/delete', { id: ids.schedule }));
    return '已删除';
  });

  /* ============ N. 会议 ============ */
  section('N. 会议');
  await test('POST /api/meetings 创建会议', async () => {
    const j = expectOk(
      await req('POST', '/api/meetings', {
        title: '回归圆桌',
        projectId: ids.newProject,
        participants: [ids.employee, ids.hiredEmployee],
        agenda: '回归测试同步',
        rounds: 1,
      }),
    );
    ids.meeting = j.meeting.id;
    return `${j.meeting.title} ${j.meeting.participants.length} 人`;
  });
  await test('GET /api/meetings 会议列表', async () => {
    const j = expectOk(await req('GET', '/api/meetings'));
    return `${j.meetings.length} 场`;
  });
  await test('GET /api/meetings/:id/minutes 纪要下载', async () => {
    const r = await req('GET', `/api/meetings/${ids.meeting}/minutes`);
    assert(r.status === 200, `HTTP ${r.status}`);
    return `${r.text.length} 字节`;
  });
  await test('POST /api/meetings/end 结束会议并生成行动项', async () => {
    const j = expectOk(await req('POST', '/api/meetings/end', { id: ids.meeting }));
    return `行动项 ${j.meeting.actionItems.length}`;
  });
  await test('POST /api/meetings/action 行动项转任务', async () => {
    const state = (await req('GET', '/api/state')).json.state;
    const meeting = state.meetings.find((m) => m.id === ids.meeting);
    const action = meeting.actionItems.find((a) => !a.createdTaskId);
    if (!action) return '无未转行动项，跳过';
    const j = expectOk(await req('POST', '/api/meetings/action', { meetingId: ids.meeting, actionId: action.id }));
    return j.task.title;
  });

  /* ============ O. 机房 / 服务器 ============ */
  section('O. 机房 / 服务器');
  await test('GET /api/servers 服务器与环境', async () => {
    let j = expectOk(await req('GET', '/api/servers'));
    if (!j.servers.length) {
      expectOk(await req('POST', '/api/servers', { name: '回归服务器', host: '127.0.0.1', mode: '本地', group: '测试' }));
      j = expectOk(await req('GET', '/api/servers'));
    }
    ids.server = j.servers[0].id;
    return `${j.servers.length} 台`;
  });
  await test('POST /api/servers/check 实时健康检查', async () => {
    const j = expectOk(await req('POST', '/api/servers/check', {}));
    return `${j.servers.length} 台 / ${j.checkedAt}`;
  });
  await test('POST /api/servers 新增服务器', async () => {
    const j = expectOk(
      await req('POST', '/api/servers', { name: '回归节点', host: '127.0.0.1', mode: 'local', group: '测试' }),
    );
    ids.newServer = j.server.id;
    return j.server.name;
  });
  await test('POST /api/servers/service 添加服务', async () => {
    const j = expectOk(
      await req('POST', '/api/servers/service', {
        serverId: ids.newServer,
        name: '回归服务',
        runtime: 'node',
        port: 4999,
        workdir: '.',
        command: 'node -e "setTimeout(()=>{},60000)"',
      }),
    );
    ids.newService = j.service.id;
    return j.service.name;
  });
  await test('POST /api/servers/action 启动服务', async () => {
    const r = await req('POST', '/api/servers/action', { serverId: ids.newServer, serviceId: ids.newService, action: 'start' });
    assert([200, 500].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status} ${r.json?.service?.status || r.json?.error || ''}`;
  });
  await test('POST /api/servers/action 重启服务', async () => {
    const r = await req('POST', '/api/servers/action', { serverId: ids.newServer, serviceId: ids.newService, action: 'restart' });
    assert([200, 500].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status}`;
  });
  await test('POST /api/servers/action 停止服务', async () => {
    const r = await req('POST', '/api/servers/action', { serverId: ids.newServer, serviceId: ids.newService, action: 'stop' });
    assert([200, 500].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status}`;
  });
  await test('GET /api/servers/log 服务日志', async () => {
    const r = await req('GET', `/api/servers/log?serverId=${ids.newServer}&serviceId=${ids.newService}`);
    assert([200, 404].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status}`;
  });
  await test('POST /api/servers/batch 批量操作', async () => {
    const r = await req('POST', '/api/servers/batch', { action: 'start', targets: [{ serverId: ids.newServer, serviceId: ids.newService }] });
    assert([200, 400].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status}`;
  });
  await test('POST /api/servers/autostart 随应用自启', async () => {
    const j = expectOk(await req('POST', '/api/servers/autostart', { enabled: false }));
    return `autoStart=${j.serverSettings.autoStart}`;
  });
  await test('POST /api/servers/ssh-test 本机模式应拒绝', async () => {
    const r = await req('POST', '/api/servers/ssh-test', { id: ids.newServer });
    expectStatus(r, 400);
    return r.json?.code;
  });
  await test('POST /api/servers/service/delete 删除服务', async () => {
    expectOk(await req('POST', '/api/servers/service/delete', { serverId: ids.newServer, serviceId: ids.newService }));
    return '已删除';
  });
  await test('POST /api/servers/delete 删除服务器', async () => {
    expectOk(await req('POST', '/api/servers/delete', { id: ids.newServer }));
    return '已删除';
  });

  /* ============ P. 工具 / 技能 / 专家 CRUD ============ */
  section('P. 资产 CRUD');
  await test('POST /api/tools 新建工具', async () => {
    const j = expectOk(
      await req('POST', '/api/tools', { code: 'regression.tool', name: '回归工具', kind: 'native', description: '自动化' }),
    );
    ids.customTool = j.tool.code;
    return j.tool.code;
  });
  await test('POST /api/tools 更新工具', async () => {
    const j = expectOk(await req('POST', '/api/tools', { code: ids.customTool, name: '回归工具 v2', kind: 'native' }));
    return j.tool.name;
  });
  await test('POST /api/tools/delete 删除工具', async () => {
    expectOk(await req('POST', '/api/tools/delete', { code: ids.customTool }));
    return '已删除';
  });
  await test('POST /api/tools/delete 内置工具应拒绝', async () => {
    const r = await req('POST', '/api/tools/delete', { code: 'read' });
    assert([400, 404].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status}`;
  });
  await test('POST /api/skills 新建技能', async () => {
    const j = expectOk(await req('POST', '/api/skills', { name: '回归技能', category: '测试', description: '自动化' }));
    ids.customSkill = j.skill.name;
    return j.skill.name;
  });
  await test('POST /api/skills 更新技能', async () => {
    const j = expectOk(await req('POST', '/api/skills', { name: ids.customSkill, category: '测试', description: 'v2' }));
    return j.skill.description;
  });
  await test('POST /api/skills/delete 删除技能', async () => {
    expectOk(await req('POST', '/api/skills/delete', { name: ids.customSkill }));
    return '已删除';
  });
  await test('POST /api/experts 新建专家', async () => {
    const j = expectOk(
      await req('POST', '/api/experts', {
        name: '回归专家',
        profession: '测试架构',
        description: '自动化',
        employeeIds: [ids.employee],
        projectIds: [ids.newProject],
      }),
    );
    ids.customExpert = j.expert.id;
    return j.expert.name;
  });
  await test('POST /api/experts 更新专家', async () => {
    const j = expectOk(await req('POST', '/api/experts', { id: ids.customExpert, description: '更新后的专家描述' }));
    return j.expert.description;
  });
  await test('POST /api/experts/delete 删除专家', async () => {
    expectOk(await req('POST', '/api/experts/delete', { id: ids.customExpert }));
    return '已删除';
  });
  await test('POST /api/experts/import 从 WorkBuddy 导入专家', async () => {
    if (!ids.wbPackage) return '本机无候选，跳过';
    const r = await req('POST', '/api/experts/import', { packageNames: [ids.wbPackage] });
    assert([200, 500].includes(r.status), `HTTP ${r.status}`);
    return `HTTP ${r.status} 导入 ${r.json?.count ?? 0}`;
  });

  /* ============ Q. 真实员工对话 ============ */
  section('Q. 真实员工对话（dsh）');
  await test('POST /api/chat/stream 单聊流式', async () => {
    const r = await sse('/api/chat/stream', { employeeId: ids.employee, text: '只回复两个字：收到' }, 180_000);
    assert(r.status === 200, `HTTP ${r.status} ${r.text.slice(0, 200)}`);
    const done = r.events.find((e) => e.type === 'done' || e.type === 'message-done');
    const err = r.events.find((e) => e.type === 'error');
    assert(!err, `流内错误：${err?.error}`);
    assert(r.events.length > 0, '无 SSE 事件');
    return `${r.events.length} 事件 ${done ? '有完成事件' : ''}`;
  });
  await test('POST /api/chat 阻塞式对话', async () => {
    const r = await req('POST', '/api/chat', { employeeId: ids.employee, text: '只回复两个字：在的' });
    assert(r.status === 200, `HTTP ${r.status} ${r.text.slice(0, 200)}`);
    return `reply=${String(r.json.reply || r.json.message?.text || '').slice(0, 30)}`;
  });
  await test('POST /api/group-chat/stream 项目群流式', async () => {
    const r = await sse('/api/group-chat/stream', { projectId: ids.project, text: '同步一下今天的进展' }, 480_000);
    assert(r.status === 200, `HTTP ${r.status} ${r.text.slice(0, 200)}`);
    assert(r.events.length > 0, '无 SSE 事件');
    return `${r.events.length} 事件`;
  });
  await test('POST /api/chat/cancel 非法 runId 应 404', async () => {
    const r = await req('POST', '/api/chat/cancel', { runId: 'run-not-exist' });
    expectStatus(r, 404);
    return r.json?.code;
  });

  /* ============ R. 公司内部工具（MCP） ============ */
  section('R. 公司内部工具接口');
  await test('POST /api/agent-tools/execute 无令牌应 401', async () => {
    const r = await req('POST', '/api/agent-tools/execute', { tool: 'list_catalog', args: {} });
    expectStatus(r, 401);
    return r.json?.code;
  });
  await test('POST /api/agent-tools/execute 有令牌执行 list_catalog', async () => {
    const fs = await import('node:fs/promises');
    const tokenFile = `${process.env.OC_DATA_DIR || 'C:/Users/蔡/AppData/Local/Temp/oc-regression/data'}/runtime/agent-tools.token`;
    const token = (await fs.readFile(tokenFile, 'utf8')).trim();
    const r = await req('POST', '/api/agent-tools/execute', { tool: 'list_catalog', args: {} }, { 'x-company-token': token, 'x-company-employee': ids.employee });
    assert(r.status === 200, `HTTP ${r.status} ${r.text.slice(0, 200)}`);
    return `工具数 ${r.json.result?.tools?.length ?? '—'}`;
  });

  /* ============ 汇总 ============ */
  const total = results.length;
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);

  console.log(`\n${C.bold}════════ 回归汇总 ════════${C.reset}`);
  console.log(`总计 ${total} 项 · ${C.green}通过 ${passed}${C.reset} · ${failed.length ? C.red : ''}失败 ${failed.length}${C.reset}`);
  if (failed.length) {
    console.log(`\n${C.red}失败明细：${C.reset}`);
    for (const f of failed) console.log(`  [${f.section}] ${f.name} → ${f.detail}`);
  }
  const bySection = {};
  for (const r of results) {
    bySection[r.section] = bySection[r.section] || { pass: 0, fail: 0 };
    bySection[r.section][r.ok ? 'pass' : 'fail'] += 1;
  }
  console.log('\n分节：');
  for (const [k, v] of Object.entries(bySection)) console.log(`  ${k}: ${v.pass} 通过 / ${v.fail} 失败`);

  const fs = await import('node:fs/promises');
  await fs.writeFile(
    new URL('./api-regression-report.json', import.meta.url),
    JSON.stringify({ base: BASE, at: new Date().toISOString(), total, passed, failed: failed.length, results }, null, 2),
    'utf8',
  );
  process.exit(failed.length ? 1 : 0);
}

main().catch((error) => {
  console.error('回归脚本崩溃：', error);
  process.exit(2);
});
