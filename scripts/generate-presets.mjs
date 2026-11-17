import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { buildPresetPatchBlock } from '../lib/employee-preset.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const seed = JSON.parse(await readFile(`${root}data/seed.json`, 'utf8'));
// 以当前 store 为准（可能已经通过界面给员工加过工具/技能），store 缺失时退回 seed
let current = {};
try {
  current = JSON.parse(await readFile(`${root}data/store.json`, 'utf8'));
} catch {
  current = {};
}
const liveById = new Map((current.employees || []).map((item) => [item.id, item]));
const employees = seed.employees.map((employee) => liveById.get(employee.id) || employee);
const lines = ['- insert:'];
employees.forEach((employee, index) => {
  lines.push(buildPresetPatchBlock(employee, 101 + index, { portable: true }));
});
lines.push('');
await writeFile(`${root}presets/employee-presets/cordis.patch.yml`, lines.join('\n'), 'utf8');
console.log(`generated ${employees.length} employee presets`);
