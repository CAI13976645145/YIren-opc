#!/usr/bin/env node
/**
 * 端到端验证：新建项目 → 组队 → 建任务 → 员工开工 → 产出代码文件 → 交付物
 * 用法：BASE=http://127.0.0.1:4401 node tests/e2e-new-project.mjs
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:4401';
const DATA = process.env.OC_DATA_DIR || 'C:/Users/蔡/AppData/Local/Temp/oc-regression3/data';
const EMPLOYEE = process.env.OC_EMPLOYEE || 'e-jiang';
// 沙箱里跑时，bridge 的写审批会打到正式实例；这里自动批准，验证完整链路
const APPROVAL_BASE = process.env.APPROVAL_BASE || 'http://127.0.0.1:4399';
let autoApproved = 0;

async function approvePendingForSandbox() {
  if (!process.env.OC_AUTO_APPROVE) return;
  try {
    const res = await fetch(`${APPROVAL_BASE}/api/state`);
    const payload = await res.json();
    const pending = (payload.state?.approvals || []).filter(
      (item) => item.status === 'pending' && String(item.filePath || '').includes('oc-regression'),
    );
    for (const item of pending) {
      await fetch(`${APPROVAL_BASE}/api/approvals/decide`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: item.id, action: 'approve', comment: 'E2E 自动批准（沙箱）', allowSimilar: true }),
      });
      autoApproved += 1;
    }
  } catch {
    /* 忽略 */
  }
}

const steps = [];
const log = (name, ok, detail = '') => {
  steps.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`);
};

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, json, text };
}

async function walk(dir, prefix = '') {
  let out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out = out.concat(await walk(join(dir, entry.name), rel));
    else out.push(rel);
  }
  return out;
}

async function main() {
  console.log(`端到端：新项目写代码  ${BASE}\n`);

  await req('POST', '/api/autonomy', { enabled: '0' }).catch(() => {});

  // 1. 建项目
  const created = await req('POST', '/api/projects', {
    name: `E2E 代码验证 ${Date.now().toString().slice(-5)}`,
    type: '研发',
    desc: '自动化端到端：验证新项目里员工能否写代码',
  });
  if (!created.json?.ok) throw new Error(`建项目失败：${created.text.slice(0, 200)}`);
  const project = created.json.project;
  log('新建项目', true, `${project.id} · ${project.workspacePath}`);

  const projectFiles0 = await walk(project.workspacePath);
  log('项目工作区已创建', true, `${projectFiles0.length} 个初始文件`);

  // 2. 组队：建一个小队并套到项目编制上
  const team = await req('POST', '/api/teams', {
    name: `E2E 小组 ${Date.now().toString().slice(-4)}`,
    dept: '研发',
    lead: EMPLOYEE,
    members: [EMPLOYEE],
    defaultProjectId: project.id,
  });
  if (!team.json?.ok) throw new Error(`建团队失败：${team.text.slice(0, 200)}`);
  await req('POST', '/api/projects/update', { id: project.id, teamId: team.json.team.id, status: '进行中' });
  const afterTeam = (await req('GET', '/api/state')).json.state.projects.find((item) => item.id === project.id);
  log('项目组队', afterTeam.team.includes(EMPLOYEE), `团队 ${afterTeam.team.length} 人`);

  // 3. 建任务
  const taskRes = await req('POST', '/api/tasks', {
    title: '写一个 Python 命令行待办工具',
    project: project.id,
    assignee: EMPLOYEE,
    priority: '高',
    acceptance:
      '在项目工作区创建 todo.py（支持 add/list/done 三个子命令）与 README.md（含用法示例），代码要能直接运行。',
    autoRun: '0',
  });
  if (!taskRes.json?.ok) throw new Error(`建任务失败：${taskRes.text.slice(0, 200)}`);
  const task = taskRes.json.task;
  log('新建任务', true, `${task.id} · ${task.title}`);

  // 4. 开工
  const run = await req('POST', '/api/tasks/run', { id: task.id });
  log('任务开工', [200, 202].includes(run.status), `HTTP ${run.status} ${run.json?.message || run.json?.code || ''}`);

  // 5. 等待完成
  const started = Date.now();
  let finalTask = null;
  while (Date.now() - started < 320_000) {
    await new Promise((r) => setTimeout(r, 3000));
    await approvePendingForSandbox();
    const state = (await req('GET', '/api/state')).json.state;
    finalTask = state.tasks.find((item) => item.id === task.id);
    if (finalTask && ['待验收', '已完成', '阻塞'].includes(finalTask.status)) break;
  }
  log('任务结束', Boolean(finalTask), `状态 ${finalTask?.status} / 运行 ${finalTask?.lastRun?.status} / 自动批准 ${autoApproved}`);
  if (finalTask?.lastRun?.error) log('执行错误', false, finalTask.lastRun.error.slice(0, 160));

  // 6. 工作区产物
  const stationPath = join(DATA, 'workspaces', 'stations', project.id, EMPLOYEE);
  const stationFiles = await walk(stationPath);
  log('员工工位文件', stationFiles.length > 0, `${stationFiles.length} 个：${stationFiles.slice(0, 8).join(', ')}`);

  const projectFiles = await walk(project.workspacePath);
  log('项目工作区文件', projectFiles.length > 0, `${projectFiles.length} 个：${projectFiles.slice(0, 8).join(', ')}`);

  const codeFiles = projectFiles.filter((file) => /\.(py|js|ts|json|md|html|css|sh)$/.test(file));
  log('代码/文档文件', codeFiles.length > 0, codeFiles.slice(0, 10).join(', '));

  // 7. 交付物
  const state = (await req('GET', '/api/state')).json.state;
  const deliverables = state.deliverables.filter((item) => item.taskId === task.id);
  log('交付物登记', deliverables.length > 0, `${deliverables.length} 份：${deliverables.map((d) => d.name).join(', ')}`);
  if (deliverables[0]) {
    const detail = await req('GET', `/api/deliverables/content?id=${deliverables[0].id}`);
    log('交付物正文可读', detail.json?.ok === true, `${String(detail.json?.text || '').length} 字`);
  }

  // 8. 抽样读代码
  const py = projectFiles.find((file) => file.endsWith('.py'));
  if (py) {
    const content = await readFile(join(project.workspacePath, py), 'utf8');
    log('Python 文件内容', content.length > 50, `${py} · ${content.length} 字 · 首行 ${content.split('\n')[0].slice(0, 60)}`);
  } else {
    log('Python 文件内容', false, '未找到 .py 文件');
  }

  const okCount = steps.filter((s) => s.ok).length;
  console.log(`\n结果：${okCount}/${steps.length} 通过`);
  console.log(`项目：${project.id}`);
  process.exit(okCount === steps.length ? 0 : 1);
}

main().catch((error) => {
  console.error('E2E 崩溃：', error.message);
  process.exit(2);
});
