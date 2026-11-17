/**
 * 交付前自检（delivery_preflight）
 *
 * 只做「机器能查」的部分：文件存在性、空文件、占位符、未替换模板变量、
 * 敏感凭据、本地绝对路径、Markdown 断链、JSON/CSV 结构、文件大小。
 * 语义判断（需求是否对齐、事实是否有来源）由调用方按技能要求人工复核。
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';

const TEXT_EXTENSIONS = new Set([
  '.md', '.markdown', '.txt', '.json', '.csv', '.tsv', '.html', '.htm',
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.yml', '.yaml',
  '.sql', '.log', '.xml', '.ini', '.env', '.sh', '.ps1', '.bat', '.css', '.scss',
]);

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.svn', '.snapshots', '.cache', '.tmp',
  'dist', 'dist-electron', 'dist-electron-v54', 'dist-electron-v55',
  'dist-electron-v56', 'dist-electron-v57', 'dist-electron-v58', 'dist-electron-v59',
]);

const PLACEHOLDER_RULES = [
  { re: /\b(TODO|FIXME|TBD)\b/, code: 'placeholder', message: '存在 TODO / FIXME / TBD 未完成标记' },
  { re: /(待补充|待填写|待插入|待完善|此处省略|占位符|示例文本)/, code: 'placeholder', message: '存在「待补充」类占位文字' },
  { re: /Lorem ipsum/i, code: 'placeholder', message: '存在 Lorem ipsum 占位文本' },
  { re: /\{\{[^}\n]{1,80}\}\}|\$\{[^}\n]{1,80}\}|<%[^%\n]{1,80}%>/, code: 'template', message: '存在未替换的模板变量' },
];

const SECRET_RULES = [
  { re: /\bsk-[A-Za-z0-9_-]{16,}\b/, message: '疑似 API Key（sk- 开头）' },
  { re: /\bAKIA[0-9A-Z]{16}\b/, message: '疑似 AWS Access Key' },
  { re: /-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----/, message: '包含私钥内容' },
];

const SOFT_SECRET_RULE = /(password|passwd|pwd|secret|api[_-]?key|access[_-]?token|refresh[_-]?token)\s*[:=]\s*["']?([^\s"',，。]{8,})/i;
const ABSOLUTE_PATH_RULE = /(?:[A-Za-z]:[\\/]Users[\\/][^\s\\/]+|\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/)/;

function toPosix(value) {
  return String(value || '').replace(/\\/g, '/');
}

function insideRoot(root, target) {
  const rel = toPosix(relative(root, target));
  return rel === '' || (!rel.startsWith('../') && rel !== '..' && !isAbsolute(rel));
}

async function collectFiles(dir, out, limit, sinceMs = 0) {
  if (out.length >= limit) return;
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (out.length >= limit) return;
    if (entry.name.startsWith('.') && entry.name !== '.env') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name.toLowerCase())) continue;
      await collectFiles(full, out, limit, sinceMs);
      continue;
    }
    if (!entry.isFile()) continue;
    if (sinceMs) {
      const info = await stat(full).catch(() => null);
      if (!info || info.mtimeMs < sinceMs) continue;
    }
    out.push(full);
  }
}

function displayPath(file, roots) {
  for (const root of roots) {
    if (insideRoot(root, file)) return toPosix(relative(root, file)) || '.';
  }
  return toPosix(file);
}

function lineNumberAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i += 1) if (text[i] === '\n') line += 1;
  return line;
}

function excerptOf(line) {
  return String(line || '').trim().slice(0, 120);
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

function looksBinary(buffer) {
  const limit = Math.min(buffer.length, 4096);
  for (let i = 0; i < limit; i += 1) if (buffer[i] === 0) return true;
  return false;
}

function scanMarkdownLinks(text, file, displayName, blockers) {
  const seen = new Set();
  const linkRe = /!?\[[^\]\n]*\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g;
  let match;
  while ((match = linkRe.exec(text))) {
    const raw = match[1].trim();
    if (!raw) continue;
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw)) continue;
    if (raw.startsWith('/')) continue; // 站点绝对路径，服务端才有意义
    const target = decodeURIComponent(raw.split('#')[0].split('?')[0]);
    if (!target) continue;
    const resolved = resolve(dirname(file), target);
    if (existsSync(resolved)) continue;
    const key = `${raw}@${lineNumberAt(text, match.index)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    blockers.push({
      path: displayName,
      check: 'broken-link',
      message: `Markdown 链接指向的文件不存在：${raw}`,
      line: lineNumberAt(text, match.index),
      excerpt: excerptOf(text.slice(match.index).split('\n')[0]),
    });
  }
}

function makeReport({ files, blockers, warnings, roots }) {
  const lines = [];
  lines.push('## 交付前自检报告');
  lines.push(`- 检查时间：${new Date().toLocaleString('zh-CN', { hour12: false })}`);
  lines.push(`- 检查范围：${roots.map((root) => toPosix(root)).join('；') || '未提供'}`);
  lines.push(`- 文件数量：${files.length}`);
  lines.push(`- 结论：${blockers.length ? '打回（存在阻断项）' : warnings.length ? '有条件放行（存在提醒项）' : '放行'}`);
  lines.push('');
  lines.push('### 机器检查结果');
  lines.push(`- 阻断项：${blockers.length}`);
  lines.push(`- 提醒项：${warnings.length}`);
  if (blockers.length) {
    lines.push('');
    lines.push('### 阻断项清单（必须修复后重跑）');
    for (const item of blockers.slice(0, 40)) {
      lines.push(`- [BLOCKER] ${item.path}${item.line ? `:${item.line}` : ''}｜${item.message}${item.excerpt ? `｜${item.excerpt}` : ''}`);
    }
  }
  if (warnings.length) {
    lines.push('');
    lines.push('### 提醒项清单（确认或说明后可放行）');
    for (const item of warnings.slice(0, 40)) {
      lines.push(`- [WARN] ${item.path}${item.line ? `:${item.line}` : ''}｜${item.message}`);
    }
  }
  lines.push('');
  lines.push('### 语义自检（需逐条回答）');
  lines.push('1. 需求对齐：是否逐条覆盖任务要求和验收标准？');
  lines.push('2. 事实与来源：每个数字、引用、结论是否有来源？');
  lines.push('3. 口径一致：指标、单位、时间范围是否统一？');
  lines.push('4. 可复现：别人能否按文档得到同样结果？');
  lines.push('5. 边界与异常：空数据、超时、失败、权限不足是否写清？');
  lines.push('6. 合规与权限：是否含隐私、口令、内部路径或未授权素材？');
  lines.push('7. 收尾完整：文件名、版本、日期、负责人、附件清单是否齐全？');
  lines.push('');
  lines.push('### 下一步');
  lines.push(blockers.length ? '先修复全部阻断项，再调用 delivery_preflight 重跑，直到 0 阻断。' : '补齐语义自检结论后提交；有条件放行需写明条件和截止时间。');
  return lines.join('\n');
}

export async function runDeliveryPreflight({ paths = [], roots = [], maxFiles = 40, sinceHours = 48 } = {}) {
  const cleanRoots = roots.map((item) => resolve(String(item || ''))).filter(Boolean);
  if (!cleanRoots.length) throw new Error('没有可扫描的工作区，无法自检');
  const limit = Math.max(1, Math.min(200, Number(maxFiles) || 40));
  const inputs = (Array.isArray(paths) ? paths : [paths]).map((item) => String(item || '').trim()).filter(Boolean);

  const targets = [];
  const rejected = [];
  if (inputs.length) {
    for (const input of inputs) {
      const target = isAbsolute(input) ? resolve(input) : resolve(cleanRoots[0], input);
      if (!cleanRoots.some((root) => insideRoot(root, target))) {
        rejected.push({ path: input, reason: '不在你的工位或项目工作区内' });
        continue;
      }
      const info = await stat(target).catch(() => null);
      if (!info) {
        rejected.push({ path: input, reason: '文件或目录不存在' });
        continue;
      }
      if (info.isDirectory()) await collectFiles(target, targets, limit);
      else targets.push(target);
    }
  } else {
    const cutoff = Date.now() - Math.max(1, Number(sinceHours) || 48) * 3600 * 1000;
    for (const root of cleanRoots) await collectFiles(root, targets, limit, cutoff);
  }

  const files = [...new Set(targets)].slice(0, limit);
  const blockers = [];
  const warnings = [];
  const scanned = [];

  for (const file of files) {
    const info = await stat(file).catch(() => null);
    if (!info || !info.isFile()) continue;
    const path = displayPath(file, cleanRoots);
    const ext = extname(file).toLowerCase();
    scanned.push({ path, size: info.size, extension: ext || '无' });
    if (info.size === 0) {
      blockers.push({ path, check: 'empty', message: '空文件（0 字节）' });
      continue;
    }
    if (!TEXT_EXTENSIONS.has(ext)) continue;

    const buffer = await readFile(file).catch(() => null);
    if (!buffer) {
      warnings.push({ path, check: 'read', message: '无法读取文件内容' });
      continue;
    }
    if (looksBinary(buffer)) {
      warnings.push({ path, check: 'binary', message: '扩展名是文本类型，但内容像二进制，已跳过内容检查' });
      continue;
    }
    const text = buffer.toString('utf8').slice(0, 512 * 1024);
    const lines = text.split(/\r?\n/);

    for (const rule of PLACEHOLDER_RULES) {
      const index = text.search(rule.re);
      if (index >= 0) {
        const lineNo = lineNumberAt(text, index);
        blockers.push({ path, check: rule.code, message: rule.message, line: lineNo, excerpt: excerptOf(lines[lineNo - 1]) });
      }
    }

    for (const rule of SECRET_RULES) {
      const index = text.search(rule.re);
      if (index >= 0) {
        const lineNo = lineNumberAt(text, index);
        blockers.push({ path, check: 'secret', message: rule.message, line: lineNo, excerpt: excerptOf(lines[lineNo - 1]).replace(/(sk-|AKIA)[A-Za-z0-9_-]+/g, '$1***') });
      }
    }

    const softSecret = text.match(SOFT_SECRET_RULE);
    if (softSecret) {
      const value = String(softSecret[2] || '');
      if (!/^(x{3,}|\*{3,}|<.*>|your|example|placeholder|change-me|todo)/i.test(value)) {
        const lineNo = lineNumberAt(text, softSecret.index || 0);
        warnings.push({ path, check: 'credential', message: `疑似明文口令或令牌（${softSecret[1]}）`, line: lineNo });
      }
    }

    const absMatch = text.match(ABSOLUTE_PATH_RULE);
    if (absMatch) {
      const lineNo = lineNumberAt(text, absMatch.index || 0);
      warnings.push({ path, check: 'local-path', message: `包含本地绝对路径：${excerptOf(absMatch[0])}`, line: lineNo });
    }

    if (ext === '.md' || ext === '.markdown') scanMarkdownLinks(text, file, path, blockers);

    if (ext === '.json') {
      try {
        JSON.parse(text);
      } catch (error) {
        blockers.push({ path, check: 'json', message: `JSON 解析失败：${error instanceof Error ? error.message : String(error)}` });
      }
    }

    if (ext === '.csv' || ext === '.tsv') {
      const delimiter = ext === '.tsv' ? '\t' : ',';
      const dataLines = lines.filter((line) => line.trim());
      if (dataLines.length > 1) {
        const headerCount = ext === '.tsv' ? dataLines[0].split('\t').length : splitCsvLine(dataLines[0]).length;
        let mismatch = 0;
        for (let i = 1; i < dataLines.length; i += 1) {
          const count = ext === '.tsv' ? dataLines[i].split('\t').length : splitCsvLine(dataLines[i]).length;
          if (count !== headerCount) mismatch += 1;
        }
        if (mismatch) warnings.push({ path, check: 'csv', message: `${mismatch} 行字段数与表头不一致（表头 ${headerCount} 列）` });
      }
    }
  }

  if (!files.length && !rejected.length) {
    warnings.push({ path: '（范围）', check: 'scope', message: '没有找到可检查的文件：请传 paths，或先产出交付物' });
  }

  const report = makeReport({ files: scanned, blockers, warnings, roots: cleanRoots });
  return {
    ok: blockers.length === 0 && rejected.length === 0,
    scanned,
    rejected,
    blockers,
    warnings,
    summary: `${scanned.length} 个文件，${blockers.length} 个阻断，${warnings.length} 个提醒`,
    report,
    note: blockers.length
      ? '存在阻断项，不能交付。修复后重新调用 delivery_preflight。'
      : '机器检查通过；请继续完成语义自检并把报告随交付物一起提交。',
  };
}
