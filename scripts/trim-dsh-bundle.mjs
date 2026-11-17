/**
 * 精简 dsh-bundle：删除运行期不需要的文件，减小安装包。
 *
 * 只用安全项：
 *   1. 重复的嵌套 zod（验证过 57 份都是同一版本，Node 会向上查找顶层那份）
 *   2. *.pdb（Windows 调试符号）
 *   3. *.map（source map）
 *   4. *.d.ts（TypeScript 类型声明）
 *   5. *.md（文档）
 *   6. 非入口的 *.ts 源码（已确认没有包的 main/exports 指向 .ts）
 *
 * 用法：node scripts/trim-dsh-bundle.mjs [--drop-ts]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const bundle = path.join(root, 'dsh-bundle');
const modules = path.join(bundle, 'node_modules');
const dropTs = process.argv.includes('--drop-ts');

if (!fs.existsSync(modules)) {
  console.error('没有 dsh-bundle/node_modules，先运行 npm run prepare:dsh');
  process.exit(1);
}

function sizeOf(p) {
  try {
    const st = fs.statSync(p);
    if (st.isFile()) return st.size;
    if (!st.isDirectory()) return 0;
    let total = 0;
    for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
      total += sizeOf(path.join(p, entry.name));
    }
    return total;
  } catch {
    return 0;
  }
}

const before = sizeOf(bundle);
let removedBytes = 0;
let removedFiles = 0;

function remove(target, label) {
  try {
    fs.rmSync(target, { recursive: true, force: true });
    removedFiles += 1;
  } catch (error) {
    console.warn(`  跳过 ${label}：${error.message}`);
  }
}

/** 找到所有 node_modules/zod，排除顶层那份 */
function findNestedZod(dir, isRoot = false) {
  const hits = [];
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return hits;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name === 'node_modules') {
      if (!isRoot) {
        const zod = path.join(full, 'zod');
        if (fs.existsSync(zod)) hits.push(zod);
      }
      continue;
    }
    hits.push(...findNestedZod(full, false));
  }
  return hits;
}

console.log('1) 清理重复 zod');
const zods = findNestedZod(modules, true);
console.log(`  找到 ${zods.length} 份嵌套 zod`);
for (const dir of zods) remove(dir, path.relative(modules, dir));

console.log('2) 清理调试符号');
for (const entry of fs.readdirSync(modules, { withFileTypes: true })) {
  const full = path.join(modules, entry.name);
  if (entry.isDirectory()) {
    for (const file of fs.readdirSync(full, { withFileTypes: true })) {
      if (file.isFile() && file.name.endsWith('.pdb')) remove(path.join(full, file.name), file.name);
    }
  }
}

console.log('3) 清理 source map / 类型声明 / 文档');
function sweep(dir) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      sweep(full);
      continue;
    }
    if (!entry.isFile()) continue;
    if (entry.name.endsWith('.map') || entry.name.endsWith('.d.ts') || entry.name.endsWith('.md')) {
      remove(full, entry.name);
    }
  }
}
sweep(modules);

if (dropTs) {
  console.log('4) 清理 .ts 源码');
  function sweepTs(dir) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') continue;
        sweepTs(full);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
        remove(full, entry.name);
      }
    }
  }
  sweepTs(modules);
}

const after = sizeOf(bundle);
console.log(`\n完成：${(before / 1048576).toFixed(0)} MB → ${(after / 1048576).toFixed(0)} MB，释放 ${(removedBytes / 1048576).toFixed(0)} MB`);
