/**
 * 零依赖 Office 预览：docx / xlsx / pptx 本质是 ZIP + XML。
 * 这里只做“看得见内容”的轻量预览，不还原完整版式。
 */
import { inflateRawSync } from 'node:zlib';

function findEocd(buffer) {
  const min = Math.max(0, buffer.length - 65557);
  for (let index = buffer.length - 22; index >= min; index -= 1) {
    if (buffer.readUInt32LE(index) === 0x06054b50) return index;
  }
  return -1;
}

function readZipEntries(buffer) {
  const eocd = findEocd(buffer);
  if (eocd < 0) throw new Error('不是有效的 ZIP / Office 文件');
  const count = buffer.readUInt16LE(eocd + 10);
  const centralOffset = buffer.readUInt32LE(eocd + 16);
  const entries = new Map();
  let offset = centralOffset;
  for (let index = 0; index < count; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString('utf8', offset + 46, offset + 46 + nameLength).replace(/\\/g, '/');
    entries.set(name, { method, compressedSize, localOffset });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function readZipFile(buffer, entry) {
  if (!entry) return null;
  const { localOffset, compressedSize, method } = entry;
  if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error('ZIP 本地头损坏');
  const nameLength = buffer.readUInt16LE(localOffset + 26);
  const extraLength = buffer.readUInt16LE(localOffset + 28);
  const dataStart = localOffset + 30 + nameLength + extraLength;
  const data = buffer.subarray(dataStart, dataStart + compressedSize);
  if (method === 0) return data;
  if (method === 8) return inflateRawSync(data);
  throw new Error(`不支持的 ZIP 压缩方式：${method}`);
}

function xmlText(buffer, entry) {
  const data = readZipFile(buffer, entry);
  return data ? data.toString('utf8') : '';
}

function decodeXml(value) {
  return String(value || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, '&');
}

function stripTags(xml) {
  return decodeXml(String(xml || '').replace(/<[^>]+>/g, ''));
}

function docxPreview(buffer) {
  const entries = readZipEntries(buffer);
  const xml = xmlText(buffer, entries.get('word/document.xml'));
  if (!xml) throw new Error('docx 缺少 word/document.xml');
  const paragraphs = xml
    .split(/<\/w:p>/)
    .map((part) =>
      decodeXml(
        part
          .replace(/<w:tab[^>]*\/>/g, '\t')
          .replace(/<w:br[^>]*\/>/g, '\n')
          .replace(/<[^>]+>/g, ''),
      ).trim(),
    )
    .filter(Boolean);
  return {
    kind: 'docx',
    paragraphs,
    text: paragraphs.join('\n'),
    meta: { paragraphCount: paragraphs.length },
  };
}

function columnIndex(ref) {
  const letters = String(ref || '').replace(/[^A-Z]/gi, '').toUpperCase();
  let value = 0;
  for (const char of letters) value = value * 26 + (char.charCodeAt(0) - 64);
  return Math.max(0, value - 1);
}

function parseSharedStrings(xml) {
  if (!xml) return [];
  return [...xml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) =>
    decodeXml(
      [...match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
        .map((item) => item[1])
        .join(''),
    ),
  );
}

function parseSheet(xml, shared) {
  const rows = [];
  for (const rowMatch of String(xml || '').matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = [];
    for (const cellMatch of rowMatch[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attrs = cellMatch[1];
      const body = cellMatch[2];
      const ref = /r="([^"]+)"/.exec(attrs)?.[1] || '';
      const type = /t="([^"]+)"/.exec(attrs)?.[1] || '';
      const index = columnIndex(ref);
      let value = '';
      if (type === 's') {
        const raw = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1] || '';
        value = shared[Number(raw)] || '';
      } else if (type === 'inlineStr') {
        value = decodeXml([...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((item) => item[1]).join(''));
      } else if (type === 'b') {
        value = /<v>1<\/v>/.test(body) ? 'TRUE' : 'FALSE';
      } else {
        value = decodeXml(/<v>([\s\S]*?)<\/v>/.exec(body)?.[1] || '');
      }
      while (cells.length < index) cells.push('');
      cells[index] = value;
    }
    if (cells.some((cell) => String(cell).trim())) rows.push(cells);
    if (rows.length >= 200) break;
  }
  return rows;
}

function xlsxPreview(buffer) {
  const entries = readZipEntries(buffer);
  const shared = parseSharedStrings(xmlText(buffer, entries.get('xl/sharedStrings.xml')));
  const workbook = xmlText(buffer, entries.get('xl/workbook.xml'));
  const rels = xmlText(buffer, entries.get('xl/_rels/workbook.xml.rels'));
  const relMap = new Map();
  for (const match of rels.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const attrs = match[1];
    const id = /Id="([^"]+)"/.exec(attrs)?.[1];
    const target = /Target="([^"]+)"/.exec(attrs)?.[1];
    if (id && target) relMap.set(id, target.replace(/^\/?xl\//, '').replace(/^\//, ''));
  }
  const sheets = [];
  for (const match of workbook.matchAll(/<sheet\b([^>]*)\/?>/g)) {
    const attrs = match[1];
    const name = decodeXml(/name="([^"]+)"/.exec(attrs)?.[1] || `Sheet${sheets.length + 1}`);
    const rid = /r:id="([^"]+)"/.exec(attrs)?.[1] || '';
    const target = relMap.get(rid) || `worksheets/sheet${sheets.length + 1}.xml`;
    const path = target.startsWith('xl/') ? target : `xl/${target}`;
    const xml = xmlText(buffer, entries.get(path)) || xmlText(buffer, entries.get(path.replace('xl/', '')));
    sheets.push({ name, rows: parseSheet(xml, shared) });
    if (sheets.length >= 20) break;
  }
  if (!sheets.length) {
    for (const [name] of entries) {
      if (!/^xl\/worksheets\/sheet\d+\.xml$/.test(name)) continue;
      sheets.push({ name: `Sheet${sheets.length + 1}`, rows: parseSheet(xmlText(buffer, entries.get(name)), shared) });
      if (sheets.length >= 20) break;
    }
  }
  const text = sheets
    .map((sheet) => `【${sheet.name}】\n${sheet.rows.map((row) => row.join('\t')).join('\n')}`)
    .join('\n\n');
  return { kind: 'xlsx', sheets, text, meta: { sheetCount: sheets.length } };
}

function pptxPreview(buffer) {
  const entries = readZipEntries(buffer);
  const slideNames = [...entries.keys()]
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => Number(a.match(/(\d+)/)[1]) - Number(b.match(/(\d+)/)[1]));
  const slides = slideNames.map((name, index) => {
    const xml = xmlText(buffer, entries.get(name));
    const paragraphs = xml
      .split(/<\/a:p>/)
      .map((part) =>
        decodeXml([...part.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g)].map((item) => item[1]).join(''))
          .replace(/<[^>]*>/g, '')
          .trim(),
      )
      .filter(Boolean);
    return { index: index + 1, title: paragraphs[0] || `第 ${index + 1} 页`, paragraphs };
  });
  return {
    kind: 'pptx',
    slides,
    text: slides.map((slide) => `【第 ${slide.index} 页】\n${slide.paragraphs.join('\n')}`).join('\n\n'),
    meta: { slideCount: slides.length },
  };
}

export function officePreview(buffer, extension = '') {
  const ext = String(extension || '').replace(/^\./, '').toLowerCase();
  let result;
  if (ext === 'docx') result = docxPreview(buffer);
  else if (ext === 'xlsx') result = xlsxPreview(buffer);
  else if (ext === 'pptx') result = pptxPreview(buffer);
  else throw new Error(`不支持的 Office 格式：.${ext || '未知'}（目前支持 docx / xlsx / pptx）`);
  const text = String(result.text || '');
  if (text.length > 300000) {
    result.text = `${text.slice(0, 300000)}\n…（内容过长，已截断）`;
    result.truncated = true;
  }
  return { ok: true, ...result };
}
