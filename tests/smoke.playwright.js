async (page) => {
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(`pageerror:${e.message}`));
  await page.goto('http://127.0.0.1:4399/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const nav = await page.evaluate(() => document.querySelectorAll('.nav-item[data-view]').length);
  const guideBtn = await page.locator('[data-action="open-guide"]').count();
  const result = { nav, guideBtn, views: [], errors };
  for (const view of ['deliverables', 'tasks', 'employees', 'datacenter']) {
    if (view === 'datacenter') {
      await page.locator('[data-action="toggle-datacenter"]').click().catch(() => {});
      await page.waitForTimeout(200);
      await page.locator('#datacenter-sub [data-action="open-datacenter"]').first().click().catch(() => {});
    } else {
      await page.locator(`.nav-item[data-view="${view}"]`).first().click({ force: true }).catch(() => {});
    }
    await page.waitForTimeout(400);
    result.views.push(await page.evaluate(() => ({
      title: document.getElementById('view-title')?.textContent?.trim(),
      len: (document.getElementById('view')?.innerText || '').trim().length,
    })));
  }
  const popupPromise = page.waitForEvent('popup', { timeout: 6000 }).catch(() => null);
  await page.locator('[data-action="open-guide"]').click({ force: true }).catch(() => {});
  const popup = await popupPromise;
  result.guideOpened = Boolean(popup);
  if (popup) {
    result.guideUrl = popup.url();
    await popup.close().catch(() => {});
  }
  return result;
}
