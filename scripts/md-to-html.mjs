#!/usr/bin/env node
/**
 * 极简 Markdown → 单文件 HTML（用于把 docs/*.md 渲染成可分享的阅读页）
 * 支持：h1-h4、段落、无序/有序列表、表格、围栏代码、引用、hr、粗体、行内代码、链接
 * 用法：node scripts/md-to-html.mjs docs/使用指南.md docs/使用指南.html
 */
import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('用法：node scripts/md-to-html.mjs <input.md> <output.html>');
  process.exit(1);
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function inline(text) {
  let value = escapeHtml(text);
  value = value.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);
  value = value.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${href}">${label}</a>`);
  return value;
}

const lines = (await readFile(input, 'utf8')).replace(/\r\n/g, '\n').split('\n');
const out = [];
let i = 0;
let title = basename(input, '.md');

while (i < lines.length) {
  const line = lines[i];

  // 围栏代码
  if (/^```/.test(line)) {
    const lang = line.slice(3).trim();
    const buf = [];
    i += 1;
    while (i < lines.length && !/^```/.test(lines[i])) {
      buf.push(lines[i]);
      i += 1;
    }
    i += 1;
    out.push(`<pre class="code"${lang ? ` data-lang="${escapeHtml(lang)}"` : ''}><code>${escapeHtml(buf.join('\n'))}</code></pre>`);
    continue;
  }

  // 标题
  const heading = /^(#{1,4})\s+(.*)$/.exec(line);
  if (heading) {
    const level = heading[1].length;
    const text = heading[2].trim();
    if (level === 1) title = text;
    const id = text
      .toLowerCase()
      .replace(/[`*_]/g, '')
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');
    out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
    i += 1;
    continue;
  }

  // 分隔线
  if (/^---+\s*$/.test(line)) {
    out.push('<hr />');
    i += 1;
    continue;
  }

  // 引用
  if (/^>\s?/.test(line)) {
    const buf = [];
    while (i < lines.length && /^>\s?/.test(lines[i])) {
      buf.push(lines[i].replace(/^>\s?/, ''));
      i += 1;
    }
    out.push(`<blockquote>${buf.map((item) => inline(item)).join('<br />')}</blockquote>`);
    continue;
  }

  // 表格
  if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
    const header = line.split('|').slice(1, -1).map((cell) => cell.trim());
    i += 2;
    const rows = [];
    while (i < lines.length && /^\|/.test(lines[i])) {
      rows.push(lines[i].split('|').slice(1, -1).map((cell) => cell.trim()));
      i += 1;
    }
    out.push('<div class="table-wrap"><table>');
    out.push(`<thead><tr>${header.map((cell) => `<th>${inline(cell)}</th>`).join('')}</tr></thead>`);
    out.push('<tbody>');
    for (const row of rows) {
      out.push(`<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`);
    }
    out.push('</tbody></table></div>');
    continue;
  }

  // 列表
  if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
    const ordered = /^\s*\d+\./.test(line);
    const items = [];
    while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
      items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''));
      i += 1;
    }
    out.push(ordered ? '<ol>' : '<ul>');
    for (const item of items) out.push(`<li>${inline(item)}</li>`);
    out.push(ordered ? '</ol>' : '</ul>');
    continue;
  }

  // 空行
  if (!line.trim()) {
    i += 1;
    continue;
  }

  // 段落（连续非空行）
  const buf = [];
  while (i < lines.length && lines[i].trim() && !/^(#|>|```|\||\s*([-*]|\d+\.)\s|---)/.test(lines[i])) {
    buf.push(lines[i].trim());
    i += 1;
  }
  out.push(`<p>${inline(buf.join(' '))}</p>`);
}

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
  :root{
    --bg:#f6f7f9; --card:#ffffff; --text:#1f2430; --muted:#6b7280;
    --line:#e8eaf0; --accent:#2f6bff; --accent-soft:#eef3ff; --code-bg:#f4f6fa;
    --radius:18px;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
    line-height:1.75;font-size:15px}
  .shell{max-width:980px;margin:32px auto;padding:0 20px 80px}
  .doc{background:var(--card);border:1px solid var(--line);border-radius:26px;
    padding:44px 52px;box-shadow:0 18px 50px rgba(31,36,48,.06)}
  h1{font-size:30px;line-height:1.35;margin:0 0 8px;letter-spacing:-.02em}
  h2{font-size:21px;margin:40px 0 12px;padding-top:18px;border-top:1px solid var(--line)}
  h3{font-size:17px;margin:26px 0 8px}
  h4{font-size:15px;margin:20px 0 6px;color:var(--muted)}
  p{margin:10px 0}
  a{color:var(--accent);text-decoration:none}
  a:hover{text-decoration:underline}
  code{background:var(--code-bg);border-radius:6px;padding:2px 6px;font-size:.92em;
    font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  pre.code{background:#0f1420;color:#e7ecf5;border-radius:14px;padding:18px 20px;overflow:auto;
    font-size:13px;line-height:1.7;margin:14px 0}
  pre.code code{background:none;padding:0;color:inherit}
  .table-wrap{overflow:auto;margin:14px 0;border:1px solid var(--line);border-radius:14px}
  table{border-collapse:collapse;width:100%;font-size:14px}
  th,td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
  th{background:#fafbff;font-weight:600;color:#39404f;white-space:nowrap}
  tr:last-child td{border-bottom:none}
  blockquote{margin:14px 0;padding:12px 16px;background:var(--accent-soft);
    border-left:3px solid var(--accent);border-radius:10px;color:#35405a}
  hr{border:none;border-top:1px solid var(--line);margin:28px 0}
  ul,ol{margin:10px 0;padding-left:22px}
  li{margin:5px 0}
  .doc > h1 + p{color:var(--muted)}
  @media (max-width:720px){
    .shell{margin:12px auto;padding:0 10px 48px}
    .doc{padding:26px 20px;border-radius:18px}
    h1{font-size:24px}
  }
</style>
</head>
<body>
<div class="shell"><article class="doc">
${out.join('\n')}
</article></div>
</body>
</html>
`;

await writeFile(output, html, 'utf8');
console.log(`已生成 ${output}（${(html.length / 1024).toFixed(1)} KB）`);
