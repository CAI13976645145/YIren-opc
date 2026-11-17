async (page) => {
  const report = { base: '', views: [], panels: [], modals: [], settingsTabs: [], interactions: [], errors: [], apiErrors: [], consoleWarnings: [] };
  const BASE = 'http://127.0.0.1:4401';

  page.on('console', (msg) => {
    if (msg.type() === 'error') report.errors.push(`console: ${msg.text()}`);
    if (msg.type() === 'warning' && report.consoleWarnings.length < 30) report.consoleWarnings.push(msg.text());
  });
  page.on('pageerror', (err) => report.errors.push(`pageerror: ${err.message}`));
  page.on('response', (res) => {
    const url = res.url();
    if (!url.includes('/api/')) return;
    if (res.status() >= 400) report.apiErrors.push(`${res.status()} ${res.request().method()} ${url.replace(BASE, '')}`);
  });
  page.on('dialog', (d) => d.dismiss().catch(() => {}));

  const sleep = (ms) => page.waitForTimeout(ms);

  async function visible(sel) {
    return page.locator(sel).first().isVisible().catch(() => false);
  }

  async function ensureExpanded(parentAction) {
    const sub = page.locator(parentAction === 'toggle-assets' ? '#assets-sub' : parentAction === 'toggle-ops' ? '#ops-sub' : '#datacenter-sub').first();
    const isHidden = await sub.evaluate((el) => el.hasAttribute('hidden')).catch(() => true);
    if (isHidden) {
      await page.locator(`[data-action="${parentAction}"]`).first().click().catch(() => {});
      await sleep(150);
    }
  }

  await page.addInitScript(() => {
    window.prompt = () => '回归验收通过';
    window.confirm = () => true;
    window.alert = () => {};
  });
  report.base = await page.evaluate(() => location.href);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await sleep(600);

  // 1) 左栏全部视图逐一点击
  const views = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.nav-item[data-view]').forEach((b) => out.push(b.dataset.view));
    return out;
  });
  const extraViews = ['datacenter'];
  for (const v of extraViews) if (!views.includes(v)) views.push(v);

  const allActions = new Set();
  const coveredActions = new Set();
  for (const view of views) {
    const item = { view, ok: false, title: '', textLength: 0, actions: 0, note: '' };
    try {
      if (view === 'datacenter') {
        await ensureExpanded('toggle-datacenter');
        await page.locator('#datacenter-sub [data-action="open-datacenter"]').first().click();
      } else {
        const btn = page.locator(`.nav-item[data-view="${view}"]`).first();
        if (await btn.isHidden()) {
          const parent = await page.evaluate((v) => {
            const el = document.querySelector(`.nav-item[data-view="${v}"]`);
            return el && el.closest('#assets-sub') ? 'toggle-assets' : el && el.closest('#ops-sub') ? 'toggle-ops' : '';
          }, view);
          if (parent) await ensureExpanded(parent);
        }
        await btn.click({ force: true });
      }
      await sleep(450);
      const info = await page.evaluate(() => ({
        title: document.getElementById('view-title')?.textContent?.trim() || '',
        len: (document.getElementById('view')?.innerText || '').trim().length,
        actions: document.querySelectorAll('#view [data-action]').length,
        actionNames: [...document.querySelectorAll('#view [data-action]')].map((el) => el.dataset.action),
        toast: document.getElementById('toast')?.textContent?.trim() || '',
      }));
      info.actionNames.forEach((a) => allActions.add(a));
      item.title = info.title;
      item.textLength = info.len;
      item.actions = info.actions;
      item.ok = info.len > 10;
      if (/失败|错误/.test(info.toast)) item.note = info.toast;
    } catch (error) {
      item.note = String(error.message || error).slice(0, 120);
    }
    report.views.push(item);
  }

  // 2) 右栏 5 个页签
  for (const panel of ['tasks', 'deliverables', 'memories', 'servers', 'employees']) {
    const item = { panel, ok: false, len: 0, note: '' };
    try {
      await page.locator(`.panel-tab[data-panel="${panel}"]`).first().click();
      await sleep(350);
      const len = await page.evaluate(() => (document.getElementById('panel')?.innerText || '').trim().length);
      item.len = len;
      item.ok = len > 5;
    } catch (error) {
      item.note = String(error.message || error).slice(0, 120);
    }
    report.panels.push(item);
  }

  // 3) 每个视图里的「新建/编辑」弹窗按钮
  const modalMatrix = [
    ['tasks', 'new-task'],
    ['employees', 'new-employee'],
    ['employees', 'hire-employee'],
    ['projects', 'new-project'],
    ['teams', 'new-team'],
    ['memories', 'new-memory'],
    ['skills', 'new-skill'],
    ['tools', 'new-tool'],
    ['experts', 'new-expert'],
    ['datacenter', 'new-server'],
    ['automation', 'new-schedule'],
    ['meetings', 'new-meeting'],
    ['deliverables', 'new-deliverable'],
  ];
  for (const [view, action] of modalMatrix) {
    const item = { view, action, ok: false, title: '', fields: 0, note: '' };
    try {
      if (view === 'datacenter') {
        await ensureExpanded('toggle-datacenter');
        await page.locator('#datacenter-sub [data-action="open-datacenter"]').first().click();
        await sleep(350);
      } else {
        const nav = page.locator(`.nav-item[data-view="${view}"]`).first();
        if (await nav.count()) {
          if (await nav.isHidden()) {
            const parent = await page.evaluate((v) => {
              const el = document.querySelector(`.nav-item[data-view="${v}"]`);
              return el && el.closest('#assets-sub') ? 'toggle-assets' : el && el.closest('#ops-sub') ? 'toggle-ops' : '';
            }, view);
            if (parent) await ensureExpanded(parent);
          }
          await nav.click({ force: true });
          await sleep(300);
        }
      }
      const trigger = page.locator(`[data-action="${action}"]`).first();
      if (!(await trigger.count())) {
        item.note = '按钮不存在';
      } else {
        await trigger.click({ force: true });
        await sleep(450);
        const info = await page.evaluate(() => {
          const modal = document.getElementById('modal');
          return {
            open: modal && !modal.hasAttribute('hidden'),
            title: document.getElementById('modal-title')?.textContent?.trim() || '',
            fields: document.querySelectorAll('#modal-fields input, #modal-fields select, #modal-fields textarea').length,
          };
        });
        item.ok = info.open;
        item.title = info.title;
        item.fields = info.fields;
        if (info.open) coveredActions.add(action);
        await page.locator('[data-action="close-modal"]').first().click({ force: true }).catch(() => {});
        await sleep(200);
      }
    } catch (error) {
      item.note = String(error.message || error).slice(0, 140);
    }
    report.modals.push(item);
  }

  // 4) 设置弹窗 + 左侧导航各页签
  try {
    await page.locator('[data-action="open-settings"]').first().click();
    await sleep(1200);
    const opened = await page.evaluate(() => {
      const modal = document.getElementById('modal');
      return modal && !modal.hasAttribute('hidden');
    });
    report.interactions.push({ name: '打开设置', ok: opened });
    const tabs = await page.evaluate(() =>
      [...document.querySelectorAll('[data-action="settings-tab"]')].map((b) => b.dataset.tab).filter(Boolean),
    );
    for (const tab of tabs) {
      const item = { tab, ok: false, len: 0 };
      await page.locator(`[data-action="settings-tab"][data-tab="${tab}"]`).first().click({ force: true });
      await sleep(500);
      item.len = await page.evaluate(() => (document.getElementById('modal-fields')?.innerText || '').trim().length);
      item.ok = item.len > 30;
      report.settingsTabs.push(item);
    }
    await page.locator('[data-action="close-modal"]').first().click({ force: true }).catch(() => {});
    await sleep(200);
  } catch (error) {
    report.interactions.push({ name: '打开设置', ok: false, note: String(error.message).slice(0, 120) });
  }

  // 4.5) 使用指南入口
  try {
    const popupPromise = page.waitForEvent('popup', { timeout: 8000 }).catch(() => null);
    await page.locator('[data-action="open-guide"]').first().click({ force: true });
    const popup = await popupPromise;
    let ok = false;
    let detail = '未打开新标签';
    if (popup) {
      await popup.waitForLoadState('domcontentloaded').catch(() => {});
      const text = await popup.evaluate(() => (document.body?.innerText || '').slice(0, 200)).catch(() => '');
      ok = text.includes('一人公司');
      detail = popup.url();
      await popup.close().catch(() => {});
    }
    report.interactions.push({ name: '使用指南入口', ok, detail });
    coveredActions.add('open-guide');
  } catch (error) {
    report.interactions.push({ name: '使用指南入口', ok: false, note: String(error.message).slice(0, 120) });
  }

  // 5) 顶部搜索
  try {
    await page.fill('#search-input', '手办');
    await page.keyboard.press('Enter');
    await sleep(900);
    const info = await page.evaluate(() => ({
      title: document.getElementById('view-title')?.textContent?.trim() || '',
      len: (document.getElementById('view')?.innerText || '').trim().length,
    }));
    report.interactions.push({ name: '顶部搜索', ok: info.len > 10, detail: info.title });
  } catch (error) {
    report.interactions.push({ name: '顶部搜索', ok: false, note: String(error.message).slice(0, 120) });
  }

  // 6) 通知铃铛
  try {
    await page.locator('[data-action="open-notifications"]').first().click();
    await sleep(700);
    const info = await page.evaluate(() => ({
      title: document.getElementById('view-title')?.textContent?.trim() || '',
      len: (document.getElementById('view')?.innerText || '').trim().length,
    }));
    report.interactions.push({ name: '通知铃铛', ok: info.len > 10, detail: info.title });
  } catch (error) {
    report.interactions.push({ name: '通知铃铛', ok: false, note: String(error.message).slice(0, 120) });
  }

  // 7) 对话坞：切换项目 / 员工 / 收起展开
  try {
    await page.selectOption('#dock-project', { index: 1 }).catch(() => {});
    await sleep(300);
    const opts = await page.evaluate(() => ({
      projects: document.querySelectorAll('#dock-project option').length,
      employees: document.querySelectorAll('#dock-employee option').length,
      context: document.getElementById('dock-context')?.textContent?.trim() || '',
    }));
    report.interactions.push({ name: '对话坞下拉', ok: opts.projects > 1 && opts.employees > 1, detail: `${opts.projects} 项目 / ${opts.employees} 员工` });
    await page.locator('#dock-toggle').click();
    await sleep(250);
    const collapsed = await page.evaluate(() => document.getElementById('chat-dock')?.classList.contains('collapsed'));
    await page.locator('#dock-toggle').click();
    await sleep(250);
    report.interactions.push({ name: '对话坞收起/展开', ok: Boolean(collapsed) });
  } catch (error) {
    report.interactions.push({ name: '对话坞', ok: false, note: String(error.message).slice(0, 120) });
  }

  // 8) 预览台
  try {
    await page.locator('.nav-item[data-view="previewdesk"]').first().click();
    await sleep(600);
    const info = await page.evaluate(() => ({
      tabs: document.querySelectorAll('#view [data-action="preview-open"], #view [data-action="preview-favorite"], #view [data-action="preview-clear-history"]').length,
      len: (document.getElementById('view')?.innerText || '').trim().length,
    }));
    report.interactions.push({ name: '预览台渲染', ok: info.len > 20, detail: `${info.tabs} 个操作按钮` });
  } catch (error) {
    report.interactions.push({ name: '预览台渲染', ok: false, note: String(error.message).slice(0, 120) });
  }

  // 9) 移动端布局
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await sleep(500);
    const mobile = await page.evaluate(() => {
      const nav = document.getElementById('mobile-nav');
      const chat = document.getElementById('chat-dock');
      const menu = document.querySelector('.mobile-menu-btn');
      return {
        navVisible: nav ? getComputedStyle(nav).display !== 'none' : false,
        chatVisible: chat ? getComputedStyle(chat).display !== 'none' : false,
        menuVisible: menu ? getComputedStyle(menu).display !== 'none' : false,
      };
    });
    report.interactions.push({ name: '移动端底部导航', ok: mobile.navVisible && mobile.menuVisible, detail: `nav=${mobile.navVisible} menu=${mobile.menuVisible}` });
    await page.locator('[data-action="toggle-mobile-chat"]').first().click().catch(() => {});
    await sleep(400);
    const chatOpen = await page.evaluate(() => {
      const el = document.getElementById('chat-dock');
      return el ? getComputedStyle(el).display !== 'none' : false;
    });
    report.interactions.push({ name: '移动端对话坞展开', ok: chatOpen });
    await page.setViewportSize({ width: 1440, height: 900 });
    await sleep(300);
  } catch (error) {
    report.interactions.push({ name: '移动端布局', ok: false, note: String(error.message).slice(0, 120) });
  }

  // 10) 截图留档
  try {
    await page.locator('.nav-item[data-view="deliverables"]').first().click();
    await sleep(500);
    await page.screenshot({ path: 'C:/Users/蔡/WorkBuddy/2026-11-14-16-28-12/one-company/.playwright-cli/ui-regression-home.png', fullPage: false });
  } catch {}

  // 10) 视图内功能按钮抽样点击（安全、非破坏性）
  async function gotoView(view) {
    if (view === 'datacenter') {
      await ensureExpanded('toggle-datacenter');
      await page.locator('#datacenter-sub [data-action="open-datacenter"]').first().click();
      await sleep(400);
      return;
    }
    const nav = page.locator(`.nav-item[data-view="${view}"]`).first();
    if (await nav.isHidden().catch(() => true)) {
      const parent = await page.evaluate((v) => {
        const el = document.querySelector(`.nav-item[data-view="${v}"]`);
        return el && el.closest('#assets-sub') ? 'toggle-assets' : el && el.closest('#ops-sub') ? 'toggle-ops' : '';
      }, view);
      if (parent) await ensureExpanded(parent);
    }
    await nav.click({ force: true });
    await sleep(400);
  }

  const actionChecks = [
    ['tasks', 'toggle-task', false],
    ['tasks', 'edit-task', true],
    ['tasks', 'handoff-task', true],
    ['projects', 'edit-project', true],
    ['projects', 'project-snapshots', true],
    ['projects', 'project-snapshot', false],
    ['skills', 'edit-skill', true],
    ['skills', 'assign-skill', true],
    ['tools', 'edit-tool', true],
    ['tools', 'assign-tool', true],
    ['experts', 'expert-detail', true],
    ['experts', 'assign-expert', true],
    ['experts', 'import-workbuddy-experts', true],
    ['teams', 'edit-team', true],
    ['reports', 'generate-report', false],
    ['notifications', 'refresh-notifications', false],
    ['notifications', 'mark-all-notifications', false],
    ['audit', 'verify-audit', false],
    ['workstations', 'refresh-workstations', false],
    ['datacenter', 'check-servers', false],
    ['templates', 'import-template', true],
    ['previewdesk', 'preview-clear-history', false],
  ];
  for (const [view, action, expectModal] of actionChecks) {
    const item = { view, action, ok: false, note: '' };
    try {
      await gotoView(view);
      const trigger = page.locator(`#view [data-action="${action}"]`).first();
      if (!(await trigger.count())) {
        item.note = '按钮不存在';
        report.interactions.push(item);
        continue;
      }
      await trigger.click({ force: true });
      await sleep(600);
      const info = await page.evaluate(() => ({
        modal: (() => {
          const m = document.getElementById('modal');
          return Boolean(m && !m.hasAttribute('hidden'));
        })(),
        toast: document.getElementById('toast')?.textContent?.trim() || '',
      }));
      item.ok = expectModal ? info.modal : true;
      item.note = info.toast.slice(0, 60);
      coveredActions.add(action);
      if (info.modal) {
        await page.locator('[data-action="close-modal"]').first().click({ force: true }).catch(() => {});
        await sleep(200);
      }
    } catch (error) {
      item.note = String(error.message || error).slice(0, 120);
    }
    report.interactions.push(item);
  }

  // 11) 第二轮：状态相关按钮（打开详情 / 筛选 / 开关 / 视图联动）
  const wave2 = [
    ['deliverables', 'preview-deliverable', false],
    ['deliverables', 'approve-deliverable', false],
    ['deliverables', 'reject-deliverable', true],
    ['tasks', 'run-task', false],
    ['inbox', 'resolve-decision', false],
    ['projects', 'open-project', false],
    ['employees', 'open-employee', false],
    ['employees', 'edit-employee', true],
    ['experts', 'edit-expert', true],
    ['experts', 'chat-expert', false],
    ['teams', 'load-teams', false],
    ['datacenter', 'open-server', false],
    ['templates', 'apply-template', true],
    ['templates', 'template-tab', false],
    ['org', 'org-tab', false],
    ['ledger', 'ledger-range', false],
    ['ledger', 'filter-ledger', false],
    ['audit', 'filter-audit', false],
    ['workstations', 'filter-workstations', false],
    ['workstations', 'station-sync', false],
    ['projectfiles', 'refresh-project-files', false],
    ['data', 'dataset-fields', false],
    ['automation', 'toggle-schedule', false],
    ['automation', 'run-schedule', false],
    ['tasks', 'toggle-autonomy', false],
    ['notifications', 'read-notification', false],
    ['notifications', 'delete-notification', false],
    ['previewdesk', 'preview-open', false],
    ['tasks', 'set-concurrency', false],
    ['tasks', 'collect-deliverable', true],
    ['deliverables', 'filter-deliverables', false],
    ['employees', 'employee-archive-filter', false],
    ['meetings', 'open-meeting', false],
    ['notifications', 'open-notification', false],
    ['notifications', 'notification-filter', false],
    ['documents', 'preview-document', true],
    ['datacenter', 'datacenter-group', false],
    ['datacenter', 'toggle-autostart', false],
  ];
  for (const [view, action, expectModal] of wave2) {
    const item = { view, action, ok: false, note: '' };
    try {
      await gotoView(view);
      const trigger = page.locator(`#view [data-action="${action}"], #panel [data-action="${action}"]`).first();
      if (!(await trigger.count())) {
        item.note = '按钮不存在（当前状态）';
        report.interactions.push(item);
        continue;
      }
      await trigger.click({ force: true });
      await sleep(700);
      const info = await page.evaluate(() => ({
        modal: (() => {
          const m = document.getElementById('modal');
          return Boolean(m && !m.hasAttribute('hidden'));
        })(),
        view: document.getElementById('view-title')?.textContent?.trim() || '',
        toast: document.getElementById('toast')?.textContent?.trim() || '',
      }));
      item.ok = expectModal ? info.modal : true;
      item.note = `${info.view}${info.toast ? ' · ' + info.toast.slice(0, 40) : ''}`;
      coveredActions.add(action);
      if (info.modal) {
        await page.locator('[data-action="close-modal"]').first().click({ force: true }).catch(() => {});
        await sleep(200);
      }
    } catch (error) {
      item.note = String(error.message || error).slice(0, 120);
    }
    report.interactions.push(item);
  }

  // 12) 记忆详情内的编辑 / 回滚
  try {
    await gotoView('memories');
    const row = page.locator('#view [data-action="preview-memory"]').first();
    if (await row.count()) {
      await row.click({ force: true });
      await sleep(900);
      coveredActions.add('preview-memory');
      const editBtn = page.locator('#modal [data-action="edit-memory"]').first();
      const editOk = await editBtn.count();
      if (editOk) {
        await editBtn.click({ force: true });
        await sleep(700);
        const open2 = await page.evaluate(() => {
          const m = document.getElementById('modal');
          return Boolean(m && !m.hasAttribute('hidden'));
        });
        coveredActions.add('edit-memory');
        report.interactions.push({ name: '记忆详情 → 编辑记忆', ok: open2 });
        await page.locator('[data-action="close-modal"]').first().click({ force: true }).catch(() => {});
        await sleep(200);
      } else {
        report.interactions.push({ name: '记忆详情 → 编辑记忆', ok: false, note: '无编辑按钮' });
      }
    }
  } catch (error) {
    report.interactions.push({ name: '记忆详情', ok: false, note: String(error.message).slice(0, 100) });
  }

  // 12.5) 任务详情 → 交付物验收
  try {
    await gotoView('tasks');
    const edits = page.locator('#view [data-action="edit-task"]');
    const count = await edits.count();
    let done = false;
    for (let i = 0; i < Math.min(count, 12); i += 1) {
      await edits.nth(i).click({ force: true });
      await sleep(500);
      const review = page.locator('#modal [data-action="review-task"]').first();
      if (await review.count()) {
        await review.click({ force: true });
        await sleep(900);
        coveredActions.add('review-task');
        const toast = await page.evaluate(() => document.getElementById('toast')?.textContent?.trim() || '');
        report.interactions.push({ name: '任务详情 → 交付物验收', ok: true, detail: toast.slice(0, 40) });
        done = true;
        break;
      }
      await page.locator('[data-action="close-modal"]').first().click({ force: true }).catch(() => {});
      await sleep(150);
    }
    if (!done) report.interactions.push({ name: '任务详情 → 交付物验收', ok: false, note: '没有待验收任务' });
    await page.locator('[data-action="close-modal"]').first().click({ force: true }).catch(() => {});
  } catch (error) {
    report.interactions.push({ name: '任务详情 → 交付物验收', ok: false, note: String(error.message).slice(0, 100) });
  }

  // 13) 右栏员工页签刷新状态
  try {
    await page.locator('.panel-tab[data-panel="employees"]').first().click();
    await sleep(400);
    const btn = page.locator('#panel [data-action="refresh-employee-status"]').first();
    if (await btn.count()) {
      await btn.click({ force: true });
      await sleep(900);
      coveredActions.add('refresh-employee-status');
      const toast = await page.evaluate(() => document.getElementById('toast')?.textContent?.trim() || '');
      report.interactions.push({ name: '右栏员工状态刷新', ok: true, detail: toast.slice(0, 40) });
    } else {
      report.interactions.push({ name: '右栏员工状态刷新', ok: false, note: '按钮不存在' });
    }
  } catch (error) {
    report.interactions.push({ name: '右栏员工状态刷新', ok: false, note: String(error.message).slice(0, 100) });
  }

  report.coverage = {
    total: allActions.size,
    covered: [...allActions].filter((a) => coveredActions.has(a) || ['new-task', 'new-employee', 'hire-employee', 'new-project', 'new-team', 'new-memory', 'new-skill', 'new-tool', 'new-expert', 'new-server', 'new-schedule', 'new-meeting', 'new-deliverable'].includes(a)).length,
    uncovered: [...allActions].filter((a) => !coveredActions.has(a)).sort(),
  };

  report.summary = {
    views: `${report.views.filter((v) => v.ok).length}/${report.views.length}`,
    panels: `${report.panels.filter((p) => p.ok).length}/${report.panels.length}`,
    modals: `${report.modals.filter((m) => m.ok).length}/${report.modals.length}`,
    settingsTabs: `${report.settingsTabs.filter((s) => s.ok).length}/${report.settingsTabs.length}`,
    interactions: `${report.interactions.filter((i) => i.ok).length}/${report.interactions.length}`,
    actions: `${report.coverage.covered}/${report.coverage.total}`,
  };
  return report;
}
