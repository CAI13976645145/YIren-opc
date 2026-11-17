/* 一人公司 · 第 1 步页面骨架（mock 数据，无后端） */

const DATA = window.COMPANY_DATA;

const state = {
  data: structuredClone(DATA),
  view: 'deliverables',
  chat: 'employee:e-jiang',
  panel: 'tasks',
  panelShowDone: false,
  search: '',
  filterProject: 'all',
  projectShowArchived: false,
  taskShowArchived: false,
  projectDetailId: '',
  projectTab: 'overview',
  projectNotesTimer: null,
  companyAudit: null,
  companyAuditScope: 'all',
  deliverableFilter: 'active',
  deliverableVersions: [],
  backupInfo: null,
  memoryArchiveOpen: false,
  memoryArchiveList: null,
  contextBreakdown: null,
  contextEmployeeId: '',
  contextProjectId: '',
  resolved: new Set(),
  taskDone: new Set(),
  dockCollapsed: false,
  dockHeight: 330,
  streaming: null,
  chatScrollPositions: {},
  highlightMessage: null,
  settings: null,
  settingsTab: 'model',
  pendingRollback: null,
  projectFiles: null,
  projectFilesLoading: false,
  assetsOpen: false,
  opsOpen: false,
  reports: [],
  meetings: [],
  meetingId: '',
  meetingStreaming: null,
  org: null,
  performance: null,
  performanceDays: 30,
  orgTab: 'matrix',
  templates: [],
  templateTab: 'project',
  schedules: [],
  scheduleRuns: [],
  searchResults: null,
  searchLoading: false,
  modelCatalog: null,
  modelDraft: null,
  modelPickerOpen: false,
  gateway: null,
  gatewayLoading: false,
  gatewayTab: 'overview',
  gatewayModels: [],
  gatewayModelsLoading: false,
  gatewayLogin: null,
  gatewayLoginTimer: null,
  gatewayBusy: '',
  gatewayLog: [],
  muxSocket: null,
  muxReady: null,
  muxStreams: new Map(),
  muxRpc: new Map(),
  muxSeq: 0,
  expandedProviders: [],
  modelAdvancedOpen: false,
  providerDraft: null,
  providerTest: null,
  onboarding: null,
  attachments: [],
  composerModels: null,
  providerModelsOpen: '',
  datacenterOpen: false,
  servers: [],
  serversLoading: false,
  sshKeys: [],
  sshKeysLoaded: false,
  questionPopupSeen: new Set(),
  questionFlow: null,
  serverCheckAt: '',
  selectedServerId: '',
  serverActionBusy: '',
  employeeStatuses: [],
  employeeStatusAt: '',
  employeeFilter: 'all',
  employeeShowArchived: false,
  teams: [],
  audit: null,
  auditLoading: false,
  auditFilter: { action: '', actor: '', q: '' },
  notifications: [],
  notificationUnread: 0,
  notificationFilter: 'all',
  workstations: [],
  workstationsLoading: false,
  workstationProject: 'all',
  ledgerData: null,
  ledgerLoading: false,
  ledgerFilter: { range: 'all', employee: '', project: '', model: '', source: '' },
  memoryDetail: null,
  chatRunId: '',
  chatStopping: false,
  datacenterGroup: 'all',
  batchSelected: [],
  serviceGroupFilter: 'all',
  socialFeed: [],
  workbuddyExperts: [],
  workbuddyExpertsLoading: false,
  workbuddyImported: [],
  imState: null,
  imLoading: false,
  imEmployeeId: '',
  imProvision: null,
  imTimer: null,
  imDraft: null,
  previewDesk: {
    currentId: '',
    payload: null,
    loading: false,
    error: '',
    history: [],
    favorites: [],
  },
};

const ASSET_VIEWS = ['documents', 'skills', 'memories', 'tools', 'devices', 'experts', 'data', 'projectfiles', 'workstations', 'templates'];
const OPS_VIEWS = ['reports', 'meetings', 'org', 'teams', 'automation', 'audit', 'notifications'];

const VIEW_TITLES = {
  deliverables: '交付物',
  previewdesk: '预览台',
  tasks: '任务',
  memories: '记忆',
  inbox: '收件箱',
  projects: '项目',
  employees: '员工',
  ledger: '账本',
  documents: '文档管理',
  skills: '技能',
  tools: '工具',
  experts: '专家',
  data: '数据',
  projectfiles: '项目文件',
  workstations: '员工工位',
  templates: '模板市场',
  reports: '日报周报',
  meetings: '会议',
  org: '组织与绩效',
  teams: '团队',
  automation: '自动化',
  audit: '审计日志',
  notifications: '通知中心',
  datacenter: '机房',
  search: '检索',
};

const ICONS = {
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/></svg>',
  task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/></svg>',
  inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 14h4l2 3h4l2-3h4"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h6l2 2h10v11H3z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5c2.8.3 4.5 2 4.5 4.5"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>',
  coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M9 10h6M9 14h6M12 8v8"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 12h6M9 16h4"/></svg>',
  skill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.4 5.1 5.6.7-4.1 3.9 1 5.5-4.9-2.7-4.9 2.7 1-5.5L4 8.8l5.6-.7z"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6.5a4 4 0 0 0-5.4 5.4L4 17v3h3l5.1-5.1a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z"/></svg>',
  expert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="8" r="3.2"/><path d="M4 20c0-3.3 2.7-5.5 6-5.5 1.3 0 2.5.3 3.5.9"/><path d="m18 13 .8 1.8 2 .2-1.5 1.4.4 2-1.7-1-1.7 1 .4-2-1.5-1.4 2-.2z"/></svg>',
  data: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
  files: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h6l2 2h10v11H3z"/><path d="M13 11h5v5h-5z"/></svg>',
  assets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/></svg>',
  report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14v18H5z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  meeting: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2.6"/><circle cx="16" cy="8" r="2.6"/><path d="M3 19c0-2.6 2.2-4.4 5-4.4s5 1.8 5 4.4"/><path d="M13.5 15.2c.8-.4 1.6-.6 2.5-.6 2.8 0 5 1.8 5 4.4"/></svg>',
  org: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="17" width="6" height="4" rx="1"/><rect x="15" y="17" width="6" height="4" rx="1"/><path d="M12 7v4M6 17v-2h12v2"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>',
  template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/></svg>',
  station: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="18" height="8" rx="2"/><path d="M6 12V8h12v4"/><path d="M9 8V5h6v3"/><path d="M8 16h.01M12 16h4"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.2 2.2L15.5 9.5"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9"/><path d="M10 18a2 2 0 0 0 4 0"/></svg>',
  preview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m10 9 2-2 2 2M12 7v5"/></svg>',
};

/* ---------------- helpers ---------------- */

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/** 轻量 Markdown 渲染：不引第三方库，覆盖模型最常用的输出格式。 */
function renderInlineMarkdown(value) {
  let text = escapeHtml(value);
  text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  text = text.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
  );
  text = text.replace(/@([\u4e00-\u9fa5A-Za-z0-9_]+)/g, '<span class="mention">@$1</span>');
  return text;
}

function isMarkdownTableStart(lines, index) {
  const head = lines[index] || '';
  const divider = lines[index + 1] || '';
  return head.includes('|') && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(divider) && divider.includes('-');
}

function renderMarkdown(value) {
  const text = String(value ?? '').replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  const out = [];
  let index = 0;

  const flushParagraph = (buffer) => {
    const content = buffer.join('\n').trim();
    if (!content) return;
    out.push(`<p>${content.split('\n').map(renderInlineMarkdown).join('<br />')}</p>`);
  };

  while (index < lines.length) {
    const line = lines[index];

    if (/^\s*$/.test(line)) {
      index += 1;
      continue;
    }

    const fence = line.match(/^\s*```\s*([\w+-]*)\s*$/);
    if (fence) {
      const language = fence[1] || '';
      const code = [];
      index += 1;
      while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      out.push(
        `<pre class="md-code"><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(
          code.join('\n'),
        )}</code></pre>`,
      );
      continue;
    }

    const heading = line.match(/^\s*(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = Math.min(6, heading[1].length);
      out.push(`<h${level}>${renderInlineMarkdown(heading[2].trim())}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(line)) {
      out.push('<hr />');
      index += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^\s*>\s?/, ''));
        index += 1;
      }
      out.push(`<blockquote>${quote.map(renderInlineMarkdown).join('<br />')}</blockquote>`);
      continue;
    }

    if (isMarkdownTableStart(lines, index)) {
      const splitCells = (row) =>
        row
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((cell) => cell.trim());
      const headers = splitCells(line);
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim() !== '') {
        rows.push(splitCells(lines[index]));
        index += 1;
      }
      out.push(
        `<div class="md-table-wrap"><table class="md-table"><thead><tr>${headers
          .map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`)
          .join('')}</tr></thead><tbody>${rows
          .map((cells) => `<tr>${cells.map((cell) => `<td>${renderInlineMarkdown(cell)}</td>`).join('')}</tr>`)
          .join('')}</tbody></table></div>`,
      );
      continue;
    }

    const listItem = line.match(/^\s*([-*+]|\d+\.)\s+(.*)$/);
    if (listItem) {
      const ordered = /^\d+\.$/.test(listItem[1]);
      const items = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*([-*+]|\d+\.)\s+(.*)$/);
        if (!match) break;
        items.push(match[2]);
        index += 1;
      }
      out.push(
        `<${ordered ? 'ol' : 'ul'}>${items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</${
          ordered ? 'ol' : 'ul'
        }>`,
      );
      continue;
    }

    const paragraph = [];
    while (index < lines.length) {
      const current = lines[index];
      if (/^\s*$/.test(current)) break;
      if (/^\s*```/.test(current)) break;
      if (/^\s*#{1,6}\s+/.test(current)) break;
      if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(current)) break;
      if (/^\s*>\s?/.test(current)) break;
      if (/^\s*([-*+]|\d+\.)\s+/.test(current)) break;
      if (isMarkdownTableStart(lines, index)) break;
      paragraph.push(current);
      index += 1;
    }
    flushParagraph(paragraph);
  }

  return out.join('');
}

function formatMessageText(value) {
  return renderMarkdown(value);
}

function employee(id) {
  return state.data.employees.find((item) => item.id === id);
}

function project(id) {
  return state.data.projects.find((item) => item.id === id);
}

function employeeModelLabel(emp) {
  if (!emp) return '未配置';
  if (emp.effectiveModel?.label) return emp.effectiveModel.label;
  if (emp.modelProfile?.model) {
    const found = composerModelEntries().find(
      (entry) => entry.id === emp.modelProfile.model && (!emp.modelProfile.provider || entry.provider === emp.modelProfile.provider),
    );
    const effort = { off: '快速', low: '低', medium: '中', high: '高' }[emp.modelProfile.effort] || '';
    return `${found?.name || emp.modelProfile.model}${effort ? ` · ${effort}` : ''}`;
  }
  const settings = state.settings?.settings || state.settings || {};
  const routes = Array.isArray(settings.modelRoutes) ? settings.modelRoutes : [];
  const route =
    routes.find((item) => item.scope === 'employee' && item.match === emp.id) ||
    routes.find((item) => item.scope === 'dept' && item.match === emp.dept) ||
    routes.find((item) => item.scope === 'default');
  if (route?.model) return `${route.model} · 路由`;
  return settings.model ? `${settings.model} · 默认` : '未配置';
}

function modelSourceLabel(source) {
  return {
    employee: '岗位模型',
    'route:employee': '员工路由',
    'route:project': '项目路由',
    'route:dept': '部门路由',
    'route:priority': '优先级路由',
    'route:default': '默认路由',
    settings: '公司默认',
  }[source] || '';
}

function employeeModelSelectOptions(profile = {}, autoLabel = '按岗位自动匹配') {
  const entries = composerModelEntries();
  const options = [`<option value="">${escapeHtml(autoLabel)}</option>`];
  if (!entries.length) {
    options.push('<option value="" disabled>还没有配置模型服务</option>');
    return options.join('');
  }
  const providers = [...new Set(entries.map((entry) => entry.provider))];
  for (const provider of providers) {
    const group = entries.filter((entry) => entry.provider === provider);
    options.push(`<optgroup label="${escapeHtml(group[0].providerName || provider)}">`);
    for (const entry of group) {
      const selected = profile?.model && entry.id === profile.model && (!profile.provider || entry.provider === profile.provider);
      options.push(
        `<option value="${escapeHtml(`${entry.provider}::${entry.id}`)}" ${selected ? 'selected' : ''}>${escapeHtml(entry.name)}${entry.efforts?.length ? ' · 可思考' : ''}</option>`,
      );
    }
    options.push('</optgroup>');
  }
  return options.join('');
}

function employeeEffortOptions(value = '') {
  return [
    ['', '按岗位自动'],
    ['off', '快速（关闭思考）'],
    ['low', '低'],
    ['medium', '中'],
    ['high', '高'],
  ]
    .map(([key, label]) => `<option value="${key}" ${String(value || '') === key ? 'selected' : ''}>${label}</option>`)
    .join('');
}

function statusClass(status) {
  if (status === '工作中') return 'status-working';
  if (status === '等待审批') return 'status-waiting';
  if (status === '阻塞') return 'status-blocked';
  return 'status-idle';
}

function typeClass(type) {
  if (type === '研发') return 'dev';
  if (type === '运营') return 'ops';
  return 'knowledge';
}

function money(value) {
  return `¥${Number(value).toFixed(2)}`;
}

function shortPath(value) {
  const parts = String(value || '').split(/[\\/]/).filter(Boolean);
  return parts.length > 2 ? `…/${parts.slice(-2).join('/')}` : parts.join('/');
}

function avatar(emp, extra = '') {
  if (!emp) return '';
  return `<span class="avatar ${extra}" style="--c:${emp.color}">${escapeHtml(emp.name.slice(0, 1))}</span>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    if (el.dataset.hydrated === '1') return;
    el.innerHTML = ICONS[el.dataset.icon] || '';
    el.dataset.hydrated = '1';
  });
}

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    cache: 'no-store',
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({ ok: false, error: 'invalid response' }));
  if (!response.ok || !payload.ok) {
    const error = new Error(payload.error || `HTTP ${response.status}`);
    error.payload = payload;
    throw error;
  }
  return payload;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsDataURL(file);
  });
}

function decisionPending(item) {
  if (!item || !item.id) return false;
  if (state.resolved?.has(item.id)) return false;
  if (item.resolvedAt || item.result) return false;
  return true;
}

function applyServerState(next) {
  if (!next || typeof next !== 'object') return;
  state.data = next;
  state.resolved = new Set(Array.isArray(next.resolved) ? next.resolved : []);
  state.taskDone = new Set(Array.isArray(next.taskDone) ? next.taskDone : []);
}

async function loadP1Data() {
  const [reports, meetings, templates, schedules] = await Promise.allSettled([
    api('/api/reports'),
    api('/api/meetings'),
    api('/api/templates'),
    api('/api/schedules'),
  ]);
  if (reports.status === 'fulfilled') state.reports = reports.value.reports || [];
  if (meetings.status === 'fulfilled') state.meetings = meetings.value.meetings || [];
  if (templates.status === 'fulfilled') state.templates = templates.value.templates || [];
  if (schedules.status === 'fulfilled') {
    state.schedules = schedules.value.schedules || [];
    state.scheduleRuns = schedules.value.runs || [];
  }
}

async function loadTeams() {
  try {
    const payload = await api('/api/teams');
    state.teams = payload.teams || [];
  } catch (error) {
    console.warn('读取团队失败：', error.message);
  }
  if (state.view === 'teams') render();
}

async function loadAudit() {
  state.auditLoading = true;
  const f = state.auditFilter || {};
  const params = new URLSearchParams();
  if (f.action) params.set('action', f.action);
  if (f.actor) params.set('actor', f.actor);
  if (f.q) params.set('q', f.q);
  try {
    const payload = await api(`/api/audit?${params.toString()}`);
    state.audit = payload;
  } catch (error) {
    showToast(`读取审计日志失败：${error.message}`);
  } finally {
    state.auditLoading = false;
  }
  if (state.view === 'audit') render();
}

async function loadNotifications() {
  try {
    const payload = await api('/api/notifications?limit=200');
    state.notifications = payload.notifications || [];
    state.notificationUnread = payload.unread || 0;
  } catch (error) {
    console.warn('读取通知失败：', error.message);
  }
  updateNotificationBadges();
  if (state.view === 'notifications') render();
}

function inboxPendingSignature() {
  const decisions = (state.data.decisions || []).filter(decisionPending).map((item) => item.id).join(',');
  const approvals = (state.data.approvals || []).filter((item) => item.status === 'pending').map((item) => item.id).join(',');
  return `${decisions}|${approvals}`;
}

async function refreshInboxState() {
  const before = inboxPendingSignature();
  try {
    const payload = await api('/api/state');
    applyServerState(payload.state);
    updateDecisionCount();
    if (state.view === 'inbox' && inboxPendingSignature() !== before) render();
  } catch {
    /* 后台刷新失败不打扰 */
  }
}

function updateNotificationBadges() {
  const count = Number(state.notificationUnread || 0);
  for (const id of ['bell-count', 'notif-nav-count', 'mobile-notif-count']) {
    const el = document.getElementById(id);
    if (!el) continue;
    el.textContent = String(count);
    el.hidden = count === 0;
  }
}

async function loadWorkstations() {
  state.workstationsLoading = true;
  try {
    const payload = await api('/api/stations');
    state.workstations = payload.stations || [];
  } catch (error) {
    showToast(`读取工位失败：${error.message}`);
  } finally {
    state.workstationsLoading = false;
  }
  if (state.view === 'workstations') render();
}

function ledgerRangeDates() {
  const range = state.ledgerFilter?.range || 'all';
  if (range === 'all') return { from: '', to: '' };
  const now = new Date();
  const to = now.toISOString().slice(0, 10);
  if (range === 'today') return { from: to, to };
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 1;
  const fromDate = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  return { from: fromDate.toISOString().slice(0, 10), to };
}

async function loadLedger() {
  state.ledgerLoading = true;
  const f = state.ledgerFilter || {};
  const dates = ledgerRangeDates();
  const params = new URLSearchParams();
  if (dates.from) params.set('from', dates.from);
  if (dates.to) params.set('to', dates.to);
  if (f.employee) params.set('employee', f.employee);
  if (f.project) params.set('project', f.project);
  if (f.model) params.set('model', f.model);
  if (f.source) params.set('source', f.source);
  try {
    const payload = await api(`/api/ledger?${params.toString()}`);
    state.ledgerData = payload;
  } catch (error) {
    showToast(`读取账本失败：${error.message}`);
  } finally {
    state.ledgerLoading = false;
  }
  if (state.view === 'ledger') render();
}

async function askSecretaryScanServer(serverId) {
  const server = serverById(serverId);
  if (!server) return;
  state.chat = 'employee:e-jiang';
  state.dockCollapsed = false;
  applyDockHeight();
  renderChatDock({ forceScroll: true });
  await sendMessage(
    `扫描服务器「${server.name}」，识别上面正在运行的服务并登记到机房。要求：服务名用人类可读的名字，不要用端口号；判断依据写进备注，不确定的标注待确认。`,
  );
}

async function scanServer(serverId) {
  if (!serverId) return;
  showToast('正在扫描本机服务…');
  const result = await apiSoft('/api/servers/scan', {
    method: 'POST',
    body: JSON.stringify({ serverId }),
  });
  if (!result.ok) {
    showToast(result.error || '扫描失败');
    return;
  }
  const pending = (result.candidates || []).filter((item) => !item.registered);
  if (!pending.length) {
    showToast(`扫描完成，${result.candidates.length} 个监听端口都已登记`);
    return;
  }
  const preview = pending.slice(0, 10).map((item) => `• ${item.name}`).join('\n');
  const ok = window.confirm(`发现 ${pending.length} 个未登记服务：\n${preview}${pending.length > 10 ? '\n…' : ''}\n\n要登记这些服务吗？`);
  if (!ok) return;
  const adopted = await apiSoft('/api/servers/scan', {
    method: 'POST',
    body: JSON.stringify({ serverId, adopt: true }),
  });
  if (!adopted.ok) {
    showToast(adopted.error || '登记失败');
    return;
  }
  if (adopted.state) applyServerState(adopted.state);
  await loadServers(true);
  showToast(`已登记 ${adopted.added?.length || 0} 个服务`);
}

async function loadSshKeys(force = false) {
  if (state.sshKeysLoaded && !force) return state.sshKeys;
  try {
    const payload = await api('/api/servers/ssh-keys');
    state.sshKeys = payload.keys || [];
    state.sshKeysLoaded = true;
    renderSshKeyOptions();
  } catch (error) {
    console.warn('读取 SSH 密钥失败：', error.message);
  }
  return state.sshKeys;
}

function renderSshKeyOptions() {
  const list = document.getElementById('ssh-key-list');
  if (list) {
    list.innerHTML = (state.sshKeys || [])
      .map((key) => `<option value="${escapeHtml(key.path)}">${escapeHtml(key.name)} · ${escapeHtml(key.type)}</option>`)
      .join('');
  }
  const count = document.getElementById('ssh-key-count');
  if (count) count.textContent = String((state.sshKeys || []).length);
}

async function loadServers(force = false) {
  if (state.serversLoading && !force) return;
  state.serversLoading = true;
  if (state.panel === 'servers') renderPanel();
  try {
    const payload = await api(`/api/servers${force ? '?refresh=1' : ''}`);
    state.servers = payload.servers || [];
    state.serverCheckAt = payload.checkedAt || '';
  } catch (error) {
    console.warn('读取服务器状态失败：', error.message);
  } finally {
    state.serversLoading = false;
  }
  updateNav();
  if (state.view === 'datacenter') render();
  if (state.panel === 'servers') renderPanel();
}

async function loadEmployeeStatuses() {
  try {
    const payload = await api('/api/employees/status');
    state.employeeStatuses = payload.employees || [];
    state.employeeStatusAt = new Date().toISOString();
  } catch (error) {
    console.warn('读取员工状态失败：', error.message);
  }
  // 只更新状态本身，不整页重渲染：否则 5 秒一次会把对话和历史消息一起刷掉
  if (state.panel === 'employees') renderPanel();
  if (state.view === 'employees') updateEmployeeStatusDom();
}

function updateEmployeeStatusDom() {
  for (const emp of state.data.employees || []) {
    const live = employeeLiveStatus(emp.id);
    const statusEl = document.querySelector(`[data-employee-status="${CSS.escape(emp.id)}"]`);
    if (statusEl && live) {
      const label = emp.archived ? '已归档' : live.label;
      statusEl.innerHTML = `<span class="status-dot ${emp.archived ? statusClass(emp.status) : employeeStatusClass(live.status)}"></span>${escapeHtml(label)}`;
    }
    const descEl = document.querySelector(`[data-employee-desc="${CSS.escape(emp.id)}"]`);
    if (descEl) {
      descEl.textContent = emp.archived ? emp.desc : live && live.status !== 'idle' ? live.detail : emp.desc;
    }
  }
}

function employeeLiveStatus(id) {
  return (state.employeeStatuses || []).find((item) => item.id === id) || null;
}

function employeeStatusClass(status) {
  if (status === 'working') return 'status-working';
  if (status === 'waiting') return 'status-waiting';
  if (status === 'blocked') return 'status-blocked';
  return 'status-idle';
}

function serverById(id) {
  return (state.servers || []).find((item) => item.id === id);
}

function serverStatusLabel(status) {
  return status === 'online' ? '运行中' : status === 'unknown' ? '未检测' : '离线';
}

function serviceStatusLabel(status) {
  return status === 'running' ? '运行中' : status === 'unknown' ? '未检测' : '已停止';
}

async function loadOrgData() {
  try {
    const payload = await api('/api/org');
    state.org = payload.org;
  } catch {
    state.org = null;
  }
  render();
}

async function loadPerformance() {
  try {
    const payload = await api(`/api/performance?days=${state.performanceDays}`);
    state.performance = payload.performance;
  } catch {
    state.performance = null;
  }
  render();
}

let searchTimer = null;
function scheduleServerSearch(query) {
  clearTimeout(searchTimer);
  const value = String(query || '').trim();
  if (!value) {
    state.searchResults = null;
    return;
  }
  state.searchLoading = true;
  searchTimer = setTimeout(async () => {
    try {
      const payload = await api(`/api/search?q=${encodeURIComponent(value)}`);
      if (state.search.trim() === value) {
        state.searchResults = payload;
        state.searchLoading = false;
        render();
      }
    } catch {
      state.searchLoading = false;
      state.searchResults = { total: 0, results: [] };
      render();
    }
  }, 260);
}

/** SSE 降级路径：WebSocket 不可用时仍然能聊。 */
async function streamChatSse(url, body, onEvent) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => ({ ok: false, error: `HTTP ${response.status}` }));
    const error = new Error(payload.error || `HTTP ${response.status}`);
    error.payload = payload;
    throw error;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let boundary = buffer.indexOf('\n\n');
    while (boundary >= 0) {
      const raw = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const line = raw.split('\n').find((item) => item.startsWith('data:'));
      if (line) {
        try {
          onEvent(JSON.parse(line.slice(5).trim()));
        } catch {
          /* ignore malformed event */
        }
      }
      boundary = buffer.indexOf('\n\n');
    }
  }
}

/* ---------------- WebSocket 多路复用客户端 ---------------- */

function muxUrl() {
  return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/remote.mux`;
}

function muxUnavailableError(message) {
  const error = new Error(message);
  error.code = 'MUX_UNAVAILABLE';
  return error;
}

async function connectMux() {
  if (state.muxSocket && state.muxSocket.readyState === WebSocket.OPEN) return state.muxSocket;
  if (state.muxReady) return state.muxReady;
  state.muxReady = new Promise((resolve, reject) => {
    let settled = false;
    let socket;
    try {
      socket = new WebSocket(muxUrl());
    } catch (error) {
      state.muxReady = null;
      reject(error);
      return;
    }
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      state.muxReady = null;
      try {
        socket.close();
      } catch {
        /* ignore */
      }
      reject(muxUnavailableError('WebSocket 连接超时'));
    }, 5000);
    socket.onopen = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      state.muxSocket = socket;
      state.muxReady = null;
      // 断线重连后把仍在跑的流接回去
      for (const entry of state.muxStreams.values()) {
        try {
          socket.send(JSON.stringify({ type: 'resume', streamId: entry.streamId, lastRevision: entry.lastRevision || 0 }));
        } catch {
          /* ignore */
        }
      }
      resolve(socket);
    };
    socket.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      state.muxReady = null;
      reject(muxUnavailableError('WebSocket 连接失败'));
    };
    socket.onclose = () => {
      state.muxSocket = null;
      state.muxReady = null;
      if (state.muxStreams.size) {
        setTimeout(() => {
          if (state.muxStreams.size) connectMux().catch(() => {});
        }, 1500);
      }
    };
    socket.onmessage = (event) => handleMuxFrame(event.data);
  });
  return state.muxReady;
}

function handleMuxFrame(raw) {
  let message;
  try {
    message = JSON.parse(raw);
  } catch {
    return;
  }
  if (message.type === 'ping') {
    try {
      state.muxSocket?.send(JSON.stringify({ type: 'pong', time: Date.now() }));
    } catch {
      /* ignore */
    }
    return;
  }
  if (message.streamId === '$events') {
    handleMuxGlobalEvent(message.value);
    return;
  }
  const rpc = state.muxRpc.get(message.streamId);
  if (rpc && (message.type === 'result' || message.type === 'error')) {
    clearTimeout(rpc.timer);
    state.muxRpc.delete(message.streamId);
    if (message.type === 'error') rpc.reject(new Error(message.error || 'RPC 失败'));
    else rpc.resolve(message.value || {});
    return;
  }
  const stream = state.muxStreams.get(message.streamId);
  if (!stream) return;
  if (message.type === 'snapshot') {
    stream.lastRevision = Number(message.revision) || 0;
    stream.onEvent({ type: 'mux-snapshot', snapshot: message.value || {} });
  } else if (message.type === 'item') {
    stream.lastRevision = Number(message.revision) || stream.lastRevision || 0;
    stream.onEvent(message.value);
  } else if (message.type === 'end') {
    state.muxStreams.delete(message.streamId);
    stream.resolve();
  } else if (message.type === 'error') {
    state.muxStreams.delete(message.streamId);
    const error = new Error(message.error || '流式传输失败');
    error.code = 'MUX_STREAM_ERROR';
    stream.reject(error);
  }
}

function handleMuxGlobalEvent(value) {
  if (!value || !value.type) return;
  if (value.type === 'chat-message') {
    const chatKey = String(value.chatKey || '');
    const message = value.message;
    if (!chatKey || !message || !message.id) return;
    if (!state.data.chats[chatKey]) state.data.chats[chatKey] = [];
    if (message.type === 'question' && message.question) {
      if (!state.data.userQuestions) state.data.userQuestions = [];
      if (!state.data.userQuestions.some((item) => item.id === message.question.id)) {
        state.data.userQuestions.push(message.question);
      }
    }
    if (!state.data.chats[chatKey].some((item) => item.id === message.id)) {
      state.data.chats[chatKey].push(message);
      if (state.chat === chatKey) renderChatDock();
    }
    return;
  }
  if (value.type === 'approval') {
    const approval = value.approval || {};
    showToast(`审批已进入收件箱：${approval.toolName || '操作'}`, 'warn');
    void refreshInboxState();
    loadNotifications();
  } else if (value.type === 'approval-decided') {
    void refreshInboxState();
    if (state.view === 'inbox') render();
  }
}

function streamChatMux(url, body, onEvent) {
  return new Promise(async (resolve, reject) => {
    let socket;
    try {
      socket = await connectMux();
    } catch (error) {
      reject(error);
      return;
    }
    const streamId = `chat-${Date.now().toString(36)}-${++state.muxSeq}`;
    state.muxStreams.set(streamId, { streamId, onEvent, resolve, reject, lastRevision: 0 });
    try {
      socket.send(JSON.stringify({ streamId, type: 'start', method: 'proxy.sse', payload: { url, body } }));
    } catch (error) {
      state.muxStreams.delete(streamId);
      reject(error);
    }
  });
}

/** 优先走一条 WebSocket 多路复用；失败时回退到原有 SSE。 */
async function streamChat(url, body, onEvent) {
  try {
    return await streamChatMux(url, body, onEvent);
  } catch (error) {
    if (error.code !== 'MUX_UNAVAILABLE') throw error;
    console.warn('WebSocket 通道不可用，回退 SSE：', error.message);
    return streamChatSse(url, body, onEvent);
  }
}

function muxRequest(message, timeoutMs = 20_000) {
  return new Promise(async (resolve, reject) => {
    let socket;
    try {
      socket = await connectMux();
    } catch (error) {
      reject(error);
      return;
    }
    const streamId = `rpc-${Date.now().toString(36)}-${++state.muxSeq}`;
    const timer = setTimeout(() => {
      state.muxRpc.delete(streamId);
      reject(new Error('WebSocket RPC 超时'));
    }, timeoutMs);
    state.muxRpc.set(streamId, { resolve, reject, timer });
    try {
      socket.send(JSON.stringify({ ...message, streamId }));
    } catch (error) {
      clearTimeout(timer);
      state.muxRpc.delete(streamId);
      reject(error);
    }
  });
}

function deliverableIconClass(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (ext === 'md' || ext === 'txt') return 'md';
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return 'xlsx';
  if (ext === 'pdf') return 'pdf';
  return '';
}

function deliverableExt(name) {
  return (name.split('.').pop() || 'FILE').toUpperCase().slice(0, 4);
}

/* ---------------- shell ---------------- */

function renderSidebarProjects() {
  const host = document.getElementById('sidebar-projects');
  host.innerHTML = state.data.projects
    .filter((item) => !item.archived)
    .map(
      (item) => `
      <button class="project-item ${state.filterProject === item.id ? 'active' : ''}" type="button" data-action="open-project" data-id="${item.id}">
        <span class="project-dot" style="background:${item.color}"></span>
        <span>${escapeHtml(item.name)}</span>
        <span class="mini-progress">${item.progress}%</span>
      </button>`
    )
    .join('');
}

function renderSidebarServers() {
  const host = document.getElementById('datacenter-sub');
  if (!host) return;
  host.innerHTML = `
    <button class="nav-item ${state.view === 'datacenter' && !state.selectedServerId ? 'active' : ''}" type="button" data-action="open-datacenter">
      <span class="nav-icon" data-icon="server"></span>
      <span>服务器总览</span>
    </button>
    ${(state.servers || [])
      .map(
        (server) => `<button class="nav-item nav-server-item ${state.view === 'datacenter' && state.selectedServerId === server.id ? 'active' : ''}" type="button" data-action="open-server" data-id="${escapeHtml(server.id)}">
          <span class="server-nav-dot ${server.status || 'unknown'}"></span>
          <span class="server-nav-name">${escapeHtml(server.name)}</span>
        </button>`,
      )
      .join('')}`;
  hydrateIcons(host);
}

function updateDecisionCount() {
  const decisions = state.data.decisions.filter(decisionPending).length;
  const approvals = (state.data.approvals || []).filter((item) => item.status === 'pending').length;
  const count = decisions + approvals;
  const el = document.getElementById('decision-count');
  if (el) {
    el.textContent = String(count);
    el.style.display = count > 0 ? '' : 'none';
  }
  const mobile = document.getElementById('mobile-decision-count');
  if (mobile) {
    mobile.textContent = String(count);
    mobile.style.display = count > 0 ? '' : 'none';
  }
}

function updateHeader() {
  const title = VIEW_TITLES[state.view] || '交付物';
  const titleEl = document.getElementById('view-title');
  const crumbEl = document.getElementById('breadcrumb');
  if (titleEl) titleEl.textContent = title;
  if (crumbEl) crumbEl.textContent = `${state.data.company.name} / ${title}`;
  document.querySelectorAll('.mobile-nav-item[data-mobile-view]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mobileView === state.view);
  });
}

function updateNav() {
  const assetsActive = ASSET_VIEWS.includes(state.view);
  const opsActive = OPS_VIEWS.includes(state.view);
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === state.view);
  });
  const parent = document.getElementById('assets-toggle');
  if (parent) {
    parent.classList.toggle('active', assetsActive);
    parent.classList.toggle('open', state.assetsOpen);
  }
  const sub = document.getElementById('assets-sub');
  if (sub) sub.hidden = !state.assetsOpen;
  const opsParent = document.getElementById('ops-toggle');
  if (opsParent) {
    opsParent.classList.toggle('active', opsActive);
    opsParent.classList.toggle('open', state.opsOpen);
  }
  const opsSub = document.getElementById('ops-sub');
  if (opsSub) opsSub.hidden = !state.opsOpen;
  const dcParent = document.getElementById('datacenter-toggle');
  if (dcParent) {
    dcParent.classList.toggle('active', state.view === 'datacenter');
    dcParent.classList.toggle('open', state.datacenterOpen);
  }
  const dcSub = document.getElementById('datacenter-sub');
  if (dcSub) dcSub.hidden = !state.datacenterOpen;
  renderSidebarServers();
  renderSidebarProjects();
}

/* ---------------- deliverables ---------------- */

/* ---------------- 预览台 ---------------- */

const PREVIEW_FAVORITES_KEY = 'one-company-preview-favorites';
const PREVIEW_HISTORY_KEY = 'one-company-preview-history';
const PREVIEW_CURRENT_KEY = 'one-company-preview-current';
const PREVIEW_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.svg'];

function loadPreviewStores() {
  try {
    const favorites = JSON.parse(localStorage.getItem(PREVIEW_FAVORITES_KEY) || '[]');
    state.previewDesk.favorites = Array.isArray(favorites) ? favorites.filter((item) => item && item.id) : [];
  } catch {
    state.previewDesk.favorites = [];
  }
  try {
    const history = JSON.parse(sessionStorage.getItem(PREVIEW_HISTORY_KEY) || '[]');
    state.previewDesk.history = Array.isArray(history) ? history.filter((item) => item && item.id) : [];
  } catch {
    state.previewDesk.history = [];
  }
  try {
    const currentId = sessionStorage.getItem(PREVIEW_CURRENT_KEY) || '';
    const known = currentId && [...state.previewDesk.history, ...state.previewDesk.favorites].some((item) => item.id === currentId);
    state.previewDesk.currentId = known ? currentId : '';
  } catch {
    state.previewDesk.currentId = '';
  }
  updatePreviewBadge();
}

function savePreviewFavorites() {
  try {
    localStorage.setItem(PREVIEW_FAVORITES_KEY, JSON.stringify(state.previewDesk.favorites.slice(0, 100)));
  } catch {
    /* ignore */
  }
  updatePreviewBadge();
}

function savePreviewHistory() {
  try {
    sessionStorage.setItem(PREVIEW_HISTORY_KEY, JSON.stringify(state.previewDesk.history.slice(0, 30)));
    if (state.previewDesk.currentId) sessionStorage.setItem(PREVIEW_CURRENT_KEY, state.previewDesk.currentId);
    else sessionStorage.removeItem(PREVIEW_CURRENT_KEY);
  } catch {
    /* ignore */
  }
}

function updatePreviewBadge() {
  const el = document.getElementById('preview-count');
  if (!el) return;
  const count = state.previewDesk.favorites.length;
  el.textContent = String(count);
  el.hidden = count === 0;
}

function previewDeskKindOf(item) {
  return item && (item.kind === 'console' || String(item.id || '').startsWith('console:')) ? 'console' : 'deliverable';
}

function previewDeskMeta(item) {
  if (!item) return null;
  if (previewDeskKindOf(item) === 'console') {
    const liveServer = serverById(item.serverId || '');
    const liveService = liveServer?.services?.find((row) => row.id === (item.serviceId || ''));
    const serviceStatus = liveService?.status || item.serviceStatus || item.status || 'unknown';
    return {
      id: item.id,
      kind: 'console',
      name: liveService?.name ? `${liveService.name} 管理台` : item.name || item.serviceName || '服务管理台',
      projectId: liveService?.projectId || item.projectId || '',
      owner: '',
      status: serviceStatus,
      time: item.time || '',
      version: 1,
      submittedAt: item.time || '',
      ext: 'WEB',
      favorite: state.previewDesk.favorites.some((row) => row.id === item.id),
      serverId: item.serverId || '',
      serviceId: item.serviceId || '',
      serverName: liveServer?.name || item.serverName || '',
      serviceStatus,
      url: liveService?.manageUrl || item.url || '',
    };
  }
  const live = state.data.deliverables.find((row) => row.id === item.id);
  const source = live || item;
  return {
    id: source.id,
    kind: 'deliverable',
    name: source.name || item.name || '未命名交付物',
    projectId: source.project || item.projectId || item.project || '',
    owner: source.owner || item.owner || '',
    status: source.status || item.status || '',
    time: source.time || item.time || '',
    version: source.version || item.version || 1,
    submittedAt: source.submittedAt || item.submittedAt || '',
    ext: deliverableExt(source.name || item.name || ''),
    favorite: state.previewDesk.favorites.some((row) => row.id === source.id),
  };
}

function previewDeskEntry(id, item = null) {
  const meta = previewDeskMeta(item || { id });
  if (!meta) return null;
  return {
    id: meta.id,
    kind: meta.kind,
    name: meta.name,
    projectId: meta.projectId,
    owner: meta.owner,
    status: meta.status,
    time: meta.time,
    version: meta.version,
    submittedAt: meta.submittedAt,
    ext: meta.ext,
    serverId: meta.serverId || '',
    serviceId: meta.serviceId || '',
    serverName: meta.serverName || '',
    serviceStatus: meta.serviceStatus || '',
    url: meta.url || '',
  };
}

function addPreviewHistory(item) {
  const entry = previewDeskEntry(item.id, item);
  if (!entry) return;
  state.previewDesk.history = [entry, ...state.previewDesk.history.filter((row) => row.id !== entry.id)].slice(0, 30);
  savePreviewHistory();
}

function togglePreviewFavorite(id) {
  const existing = state.previewDesk.favorites.find((row) => row.id === id);
  if (existing) {
    state.previewDesk.favorites = state.previewDesk.favorites.filter((row) => row.id !== id);
    showToast('已取消收藏');
  } else {
    const item =
      state.data.deliverables.find((row) => row.id === id) ||
      state.previewDesk.history.find((row) => row.id === id) ||
      state.previewDesk.favorites.find((row) => row.id === id);
    const entry = previewDeskEntry(id, item);
    if (!entry) return;
    state.previewDesk.favorites = [entry, ...state.previewDesk.favorites].slice(0, 100);
    showToast('已收藏到预览台');
  }
  savePreviewFavorites();
  if (state.view === 'previewdesk') render();
}

function clearPreviewHistory() {
  state.previewDesk.history = [];
  const stillFavorite = state.previewDesk.favorites.some((row) => row.id === state.previewDesk.currentId);
  if (!stillFavorite) {
    state.previewDesk.currentId = '';
    state.previewDesk.payload = null;
    state.previewDesk.error = '';
  }
  savePreviewHistory();
  if (state.view === 'previewdesk') render();
  showToast('本次预览历史已清空');
}

async function openPreviewDesk(id) {
  const item = state.data.deliverables.find((row) => row.id === id);
  if (!item) {
    showToast('找不到这个交付物');
    return;
  }
  closeModal();
  state.view = 'previewdesk';
  state.previewDesk.currentId = id;
  state.previewDesk.payload = null;
  state.previewDesk.error = '';
  state.previewDesk.loading = true;
  addPreviewHistory(item);
  render();
  await loadPreviewContent(id);
}

function openConsolePreview(serverId, serviceId) {
  const server = serverById(serverId);
  const service = server?.services?.find((row) => row.id === serviceId);
  if (!server || !service) {
    showToast('找不到这个服务');
    return;
  }
  closeModal();
  const id = `console:${server.id}:${service.id}`;
  const entry = {
    id,
    kind: 'console',
    name: `${service.name} 管理台`,
    projectId: service.projectId || '',
    serverId: server.id,
    serviceId: service.id,
    serverName: server.name,
    serviceStatus: service.status,
    status: service.status,
    url: service.manageUrl || '',
    time: new Date().toISOString(),
    version: 1,
    ext: 'WEB',
  };
  state.view = 'previewdesk';
  state.previewDesk.currentId = id;
  state.previewDesk.loading = false;
  state.previewDesk.payload = { kind: 'console', url: entry.url };
  state.previewDesk.error = service.manageUrl ? '' : '这个服务还没有配置管理台 URL。';
  addPreviewHistory(entry);
  render();
  showToast(`已在预览台打开 ${service.name} 管理台`);
}

function openPreviewItem(id) {
  const deliverable = state.data.deliverables.find((row) => row.id === id);
  if (deliverable) {
    openPreviewDesk(id);
    return;
  }
  const entry = state.previewDesk.history.find((row) => row.id === id) || state.previewDesk.favorites.find((row) => row.id === id);
  if (entry?.kind === 'console') {
    openConsolePreview(entry.serverId, entry.serviceId);
    return;
  }
  showToast('找不到这个预览内容');
}

async function restorePreviewDesk() {
  const id = state.previewDesk.currentId;
  if (!id) return;
  const entry =
    state.previewDesk.history.find((row) => row.id === id) ||
    state.previewDesk.favorites.find((row) => row.id === id);
  if (!entry) {
    state.previewDesk.currentId = '';
    savePreviewHistory();
    return;
  }
  if (previewDeskKindOf(entry) === 'console') {
    state.previewDesk.loading = false;
    state.previewDesk.payload = entry.url ? { kind: 'console', url: entry.url } : null;
    state.previewDesk.error = entry.url ? '' : '这个服务还没有配置管理台 URL。';
    if (state.view === 'previewdesk') render();
    return;
  }
  if (!state.data.deliverables.some((row) => row.id === id)) {
    state.previewDesk.currentId = '';
    state.previewDesk.payload = null;
    savePreviewHistory();
    return;
  }
  await loadPreviewContent(id);
}

async function loadPreviewContent(id) {
  const requestId = id;
  try {
    const payload = await api(`/api/deliverables/content?id=${encodeURIComponent(id)}`);
    const item = payload.deliverable || {};
    let view = { kind: 'text', text: payload.text || '', missing: Boolean(payload.missing), truncated: Boolean(payload.truncated) };
    if (payload.binary && payload.url) {
      if (payload.ext === '.pdf') {
        view = { kind: 'pdf', url: payload.url, size: payload.size };
      } else if (['.docx', '.xlsx', '.pptx'].includes(payload.ext)) {
        view = { kind: 'office-loading' };
        try {
          const office = await api(`/api/office/preview?id=${encodeURIComponent(id)}`);
          view = office.ok
            ? { kind: 'office', preview: office.preview, name: item.name || '' }
            : { kind: 'unsupported', text: office.error || 'Office 预览失败' };
        } catch (error) {
          view = { kind: 'unsupported', text: `Office 预览失败：${error.message}` };
        }
      } else if (PREVIEW_IMAGE_EXTENSIONS.includes(payload.ext)) {
        view = { kind: 'image', url: payload.url, size: payload.size };
      } else {
        view = { kind: 'unsupported', text: '该格式暂不支持内嵌预览，可点“新窗口打开”查看原文件。' };
      }
    } else if (payload.binary) {
      view = { kind: 'unsupported', text: '该格式暂不支持内嵌预览，可到员工工位打开原文件。' };
    }
    if (state.previewDesk.currentId !== requestId) return;
    state.previewDesk.payload = view;
  } catch (error) {
    if (state.previewDesk.currentId !== requestId) return;
    state.previewDesk.error = `读取失败：${error.message}`;
  } finally {
    if (state.previewDesk.currentId === requestId) {
      state.previewDesk.loading = false;
      if (state.view === 'previewdesk') render();
    }
  }
}

function renderPreviewDeskListItem(item) {
  const meta = previewDeskMeta(item);
  if (!meta) return '';
  const active = state.previewDesk.currentId === meta.id;
  const subtitle =
    meta.kind === 'console'
      ? `${escapeHtml(meta.serverName || '服务器')} · ${escapeHtml(serviceStatusLabel(meta.serviceStatus || 'unknown'))}`
      : `${escapeHtml(project(meta.projectId)?.name || '未归集')} · v${meta.version || 1} · ${escapeHtml(meta.status || '')}`;
  return `
    <div class="previewdesk-item ${active ? 'active' : ''}">
      <button class="previewdesk-item-main" type="button" data-action="preview-open" data-id="${escapeHtml(meta.id)}">
        <span class="previewdesk-file ${meta.kind === 'console' ? 'web' : deliverableIconClass(meta.name)}">${escapeHtml(meta.ext || 'FILE')}</span>
        <span class="previewdesk-item-copy">
          <strong>${escapeHtml(meta.name)}</strong>
          <span>${subtitle}</span>
        </span>
      </button>
      <button class="previewdesk-star ${meta.favorite ? 'on' : ''}" type="button" title="${meta.favorite ? '取消收藏' : '收藏'}" data-action="preview-favorite" data-id="${escapeHtml(meta.id)}">${meta.favorite ? '★' : '☆'}</button>
    </div>`;
}

function renderPreviewDeskViewer() {
  const desk = state.previewDesk;
  if (!desk.currentId) {
    return `<div class="previewdesk-empty">
      <div class="previewdesk-empty-icon">▣</div>
      <strong>预览台</strong>
      <p>从左侧收藏或本次历史里选一份交付物 / 服务管理台；也可以直接在交付物、任务详情、右栏交付或服务器管理台点开，预览都会在这里显示。</p>
    </div>`;
  }
  const meta = previewDeskMeta(
    state.previewDesk.history.find((row) => row.id === desk.currentId) ||
      state.previewDesk.favorites.find((row) => row.id === desk.currentId) ||
      { id: desk.currentId },
  );
  const isConsole = meta?.kind === 'console';
  const live = !isConsole ? state.data.deliverables.find((row) => row.id === desk.currentId) : null;
  const header = `
    <div class="previewdesk-viewer-head">
      <div class="previewdesk-viewer-title">
        <span class="previewdesk-file big ${isConsole ? 'web' : deliverableIconClass(meta?.name || '')}">${escapeHtml(meta?.ext || 'FILE')}</span>
        <div>
          <h3>${escapeHtml(meta?.name || (isConsole ? '服务管理台' : '交付物'))}</h3>
          <div class="previewdesk-meta">${
            isConsole
              ? `${escapeHtml(meta?.serverName || '服务器')} · ${escapeHtml(project(meta?.projectId)?.name || '未关联项目')} · <span class="server-status ${meta?.serviceStatus || 'unknown'}"><i></i>${escapeHtml(serviceStatusLabel(meta?.serviceStatus || 'unknown'))}</span>`
              : `${escapeHtml(project(meta?.projectId)?.name || '未归集')} · ${escapeHtml(employee(meta?.owner)?.name || '未知负责人')} · v${meta?.version || 1} · ${escapeHtml(meta?.status || '')}${meta?.submittedAt ? ` · ${escapeHtml(formatDateTime(meta.submittedAt))}` : ''}`
          }</div>
        </div>
      </div>
      <div class="previewdesk-viewer-actions">
        <button class="btn ghost small" type="button" data-action="preview-favorite" data-id="${escapeHtml(desk.currentId)}">${meta?.favorite ? '★ 已收藏' : '☆ 收藏'}</button>
        ${
          isConsole
            ? `<button class="btn ghost small" type="button" data-action="preview-reload-console">刷新</button><a class="btn ghost small" href="${escapeHtml(meta?.url || '#')}" target="_blank" rel="noreferrer">新窗口打开</a><button class="btn ghost small" type="button" data-action="open-server" data-id="${escapeHtml(meta?.serverId || '')}">进入机房</button>`
            : `<a class="btn ghost small" href="/api/deliverables/raw?id=${encodeURIComponent(desk.currentId)}" target="_blank" rel="noreferrer">新窗口打开</a>${live && live.status === '待验收' ? `<button class="btn primary small" type="button" data-action="approve-deliverable" data-id="${escapeHtml(desk.currentId)}">通过</button><button class="btn ghost small danger-text" type="button" data-action="reject-deliverable" data-id="${escapeHtml(desk.currentId)}">打回</button>` : ''}`
        }
      </div>
    </div>`;
  const files = !isConsole && live ? (live.stationFiles || []) : [];
  const fileBar = files.length > 1
    ? `<div class="previewdesk-files"><span>交付文件 ${files.length} 个</span>${files.slice(0, 80).map((file) => `<a href="/api/deliverables/raw-file?id=${encodeURIComponent(desk.currentId)}&path=${encodeURIComponent(file)}" target="_blank" rel="noreferrer" title="${escapeHtml(file)}">${escapeHtml(file)}</a>`).join('')}${files.length > 80 ? `<i>还有 ${files.length - 80} 个…</i>` : ''}</div>`
    : '';
  let body = '';
  if (isConsole) {
    body = desk.error
      ? `<div class="previewdesk-error">${escapeHtml(desk.error)}</div>`
      : `<iframe class="preview-frame console-frame previewdesk-console-frame" src="${escapeHtml(meta?.url || '')}" title="${escapeHtml(meta?.name || '服务管理台')}"></iframe><div class="modal-note">如果管理台禁止被嵌入（X-Frame-Options / CSP），请点“新窗口打开”。</div>`;
  } else if (desk.loading) body = '<div class="previewdesk-loading"><span class="typing-dot"></span>正在读取文件…</div>';
  else if (desk.error) body = `<div class="previewdesk-error">${escapeHtml(desk.error)}</div>`;
  else if (!desk.payload) body = '<div class="previewdesk-loading">还没有内容。</div>';
  else if (desk.payload.kind === 'office-loading') body = '<div class="previewdesk-loading"><span class="typing-dot"></span>正在解析 Office 文件…</div>';
  else if (desk.payload.kind === 'text') {
    body = `<div class="previewdesk-doc"><pre class="preview-text">${escapeHtml(desk.payload.text || '（空文件）')}</pre>${desk.payload.missing ? '<div class="modal-note">这是演示交付物，还没有绑定物理文件。</div>' : ''}${desk.payload.truncated ? '<div class="modal-note">文件较大，只显示前 200KB。</div>' : ''}</div>`;
  } else if (desk.payload.kind === 'image') {
    body = `<div class="previewdesk-image-wrap"><img class="preview-image" src="${escapeHtml(desk.payload.url)}" alt="${escapeHtml(meta?.name || '交付物')}" /></div>`;
  } else if (desk.payload.kind === 'pdf') {
    body = `<iframe class="preview-frame previewdesk-frame" src="${escapeHtml(desk.payload.url)}" title="PDF 预览"></iframe>`;
  } else if (desk.payload.kind === 'office') {
    body = `<div class="office-preview previewdesk-office">${renderOfficePreview(desk.payload.preview, desk.payload.name || '')}</div>`;
  } else {
    body = `<div class="previewdesk-error">${escapeHtml(desk.payload.text || '该文件暂不支持预览。')}</div>`;
  }
  return `<div class="previewdesk-viewer">${header}${fileBar}<div class="previewdesk-content">${body}</div></div>`;
}

function renderPreviewDeskPage() {
  const desk = state.previewDesk;
  const favorites = desk.favorites.map((item) => renderPreviewDeskListItem(item)).filter(Boolean).join('');
  const history = desk.history.map((item) => renderPreviewDeskListItem(item)).filter(Boolean).join('');
  return `
    <div class="page previewdesk-page">
      <div class="section-head">
        <h2>预览台 <span class="hint">交付物预览、服务管理台、收藏与本次历史都在这里</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="preview-clear-history" ${desk.history.length ? '' : 'disabled'}>清空本次历史</button>
        </div>
      </div>
      <div class="previewdesk-layout">
        <aside class="previewdesk-side">
          <div class="previewdesk-summary">
            <span><strong>${desk.favorites.length}</strong> 收藏</span>
            <span><strong>${desk.history.length}</strong> 本次浏览</span>
          </div>
          <div class="previewdesk-section">
            <div class="previewdesk-section-head"><span>收藏的内容</span><span>${desk.favorites.length}</span></div>
            <div class="previewdesk-list">${favorites || '<div class="previewdesk-list-empty">还没有收藏。在预览右上角点“☆ 收藏”。</div>'}</div>
          </div>
          <div class="previewdesk-section">
            <div class="previewdesk-section-head"><span>本次历史内容</span><span>${desk.history.length}</span></div>
            <div class="previewdesk-list">${history || '<div class="previewdesk-list-empty">本次还没有打开过内容。</div>'}</div>
          </div>
        </aside>
        <section class="previewdesk-main">${renderPreviewDeskViewer()}</section>
      </div>
    </div>`;
}

function deliverableMatchesFilter(item, filter) {
  if (filter === 'archived') return item.archived === true;
  if (item.archived) return false;
  if (filter === 'pending') return item.status === '待验收';
  if (filter === 'approved') return item.status === '已通过';
  if (filter === 'rejected') return item.status === '已打回';
  return true;
}

function groupDeliverableItems(items) {
  const groups = new Map();
  for (const item of items) {
    const key = item.taskId || `${item.project || ''}|${item.name || ''}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.values()]
    .map((versions) => {
      versions.sort(
        (a, b) =>
          Number(b.version || 1) - Number(a.version || 1) ||
          String(b.time || '').localeCompare(String(a.time || '')),
      );
      return { latest: versions[0], versions, count: versions.length };
    })
    .sort((a, b) => String(b.latest.time || '').localeCompare(String(a.latest.time || '')));
}

function renderDeliverablesPage() {
  const unresolved = state.data.decisions.filter(decisionPending).length;
  const totalCost = state.data.ledger.reduce((sum, row) => sum + row.cost, 0);
  const all = state.data.deliverables || [];
  const active = all.filter((item) => !item.archived);
  const activeTasks = state.data.tasks.filter((item) => !item.archived && (item.status === '进行中' || item.status === '待验收')).length;
  const byProject =
    state.filterProject === 'all'
      ? all
      : all.filter((item) => item.project === state.filterProject);
  const list = groupDeliverableItems(byProject.filter((item) => deliverableMatchesFilter(item, state.deliverableFilter)));
  const tabs = [
    { id: 'active', label: '活跃', count: active.length },
    { id: 'pending', label: '待验收', count: active.filter((item) => item.status === '待验收').length },
    { id: 'approved', label: '已通过', count: active.filter((item) => item.status === '已通过').length },
    { id: 'rejected', label: '已打回', count: active.filter((item) => item.status === '已打回').length },
    { id: 'archived', label: '已归档', count: all.filter((item) => item.archived).length },
  ];

  return `
    <div class="page">
      <div class="metric-strip">
        <div class="metric-card">
          <div class="metric-label"><span class="metric-icon" data-icon="inbox"></span> 待决策</div>
          <div class="metric-value">${unresolved}</div>
          <div class="metric-sub">只放需要你拍板的事</div>
        </div>
        <div class="metric-card">
          <div class="metric-label"><span class="metric-icon" data-icon="activity"></span> 进行中任务</div>
          <div class="metric-value">${activeTasks}</div>
          <div class="metric-sub">覆盖 ${new Set(state.data.tasks.filter((t) => !t.archived && t.status !== '待办').map((t) => t.project)).size} 个项目</div>
        </div>
        <div class="metric-card">
          <div class="metric-label"><span class="metric-icon" data-icon="check"></span> 活跃交付</div>
          <div class="metric-value">${active.length}</div>
          <div class="metric-sub">${active.filter((d) => d.status === '待验收').length} 个待验收</div>
        </div>
        <div class="metric-card">
          <div class="metric-label"><span class="metric-icon" data-icon="coins"></span> 今日成本</div>
          <div class="metric-value">${money(totalCost)}</div>
          <div class="metric-sub">按员工与项目归集</div>
        </div>
      </div>

      <div class="section-head">
        <h2>交付物 <span class="hint">同一任务的多版已合并显示，旧版可在「历史版本」里看</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="archive-processed-deliverables">归档已处理</button>
          <button class="link-btn" type="button" data-action="new-deliverable">上传交付物</button>
        </div>
      </div>

      <div class="filter-bar">
        ${tabs.map((item) => `<button class="filter-pill ${state.deliverableFilter === item.id ? 'active' : ''}" type="button" data-action="filter-deliverables-status" data-id="${item.id}">${item.label} ${item.count}</button>`).join('')}
      </div>
      <div class="filter-bar">
        <button class="filter-pill ${state.filterProject === 'all' ? 'active' : ''}" type="button" data-action="filter-deliverables" data-id="all">全部项目</button>
        ${state.data.projects
          .filter((item) => !item.archived)
          .map(
            (item) => `
          <button class="filter-pill ${state.filterProject === item.id ? 'active' : ''}" type="button" data-action="filter-deliverables" data-id="${item.id}">
            ${escapeHtml(item.name)}
          </button>`,
          )
          .join('')}
      </div>

      <div class="deliverable-grid">
        ${
          list.length
            ? list.map((group) => renderDeliverableCard(group.latest, group)).join('')
            : '<div class="empty">这个筛选下没有交付物。去底部对话框给员工派个活。</div>'
        }
      </div>
    </div>`;
}

function renderDeliverableCard(item, group = null) {
  const owner = employee(item.owner);
  const proj = project(item.project);
  const task = state.data.tasks.find((candidate) => candidate.id === item.taskId);
  const statusTag =
    item.status === '待验收'
      ? 'warn'
      : item.status === '已通过'
        ? 'ok'
        : item.status === '已打回'
          ? 'danger'
          : item.status === '已提交'
            ? 'info'
            : 'muted';
  return `
    <div class="deliverable-card" data-action="preview-deliverable" data-id="${item.id}">
      <div class="dc-head">
        <span class="dc-icon ${deliverableIconClass(item.name)}">${escapeHtml(deliverableExt(item.name))}</span>
        <div class="dc-title-wrap">
          <div class="dc-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
          <div class="dc-sub" title="${escapeHtml(`${proj?.name || ''}${task ? ` · ${task.title}` : ''}`)}">${escapeHtml(proj?.name || '')}${task ? ` · ${escapeHtml(task.title)}` : ''}</div>
        </div>
      </div>
      <div class="dc-tags">
        <span class="tag ${statusTag}">${escapeHtml(item.status)}</span>
        <span class="tag muted">${escapeHtml(proj?.name || '')}</span>
        ${item.version ? `<span class="tag info">v${item.version}</span>` : ''}
        ${(item.stationFiles || []).length > 1 ? `<span class="tag muted">${(item.stationFiles || []).length} 个文件</span>` : ''}
        ${item.fileKind === 'code' ? '<span class="tag info">代码</span>' : ''}
        ${group && group.count > 1 ? `<span class="tag info">共 ${group.count} 版</span>` : ''}
        ${item.archived ? '<span class="tag muted">已归档</span>' : ''}
      </div>
      ${
        item.reviewComment
          ? `<div class="dc-review" title="${escapeHtml(item.reviewComment)}">${escapeHtml(item.reviewComment)}</div>`
          : ''
      }
      <div class="dc-footer">
        <span class="owner">${avatar(owner, 'sm')} ${escapeHtml(owner?.name || '')}</span>
        <span>${escapeHtml(item.time)} 提交</span>
      </div>
      <div class="dc-actions">
        <button type="button" data-action="preview-deliverable" data-id="${item.id}">预览</button>
        ${
          group && group.count > 1
            ? `<button type="button" data-action="deliverable-versions" data-task="${escapeHtml(item.taskId || '')}" data-name="${escapeHtml(item.name || '')}">历史版本</button>`
            : ''
        }
        ${
          !item.archived && item.status !== '已通过'
            ? `<button type="button" class="ok" data-action="approve-deliverable" data-id="${item.id}">通过</button>
               <button type="button" class="danger" data-action="reject-deliverable" data-id="${item.id}">打回</button>`
            : ''
        }
        ${item.archived
          ? `<button type="button" data-action="unarchive-deliverable" data-id="${item.id}">恢复</button>`
          : `<button type="button" data-action="archive-deliverable" data-id="${item.id}">归档</button>`}
      </div>
    </div>`;
}

/* ---------------- tasks ---------------- */

function renderTasksPage() {
  const auto = Boolean(state.data.autonomy?.enabled);
  const maxConcurrency = Number(state.data.autonomy?.maxConcurrency || 2);
  const all = state.data.tasks || [];
  const activeTasks = all.filter((task) => !task.archived);
  const archivedTasks = all.filter((task) => task.archived);
  const tasks = state.taskShowArchived ? archivedTasks : activeTasks;
  const running = activeTasks.filter((task) => task.lastRun?.status === 'running');
  const queued = activeTasks.filter((task) => task.status === '待办').length;
  return `
    <div class="page">
      <div class="section-head">
        <h2>任务 <span class="hint">所有项目里的最小工作单元</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="archive-processed-tasks">归档已完成</button>
          <button class="btn ${auto ? 'primary' : 'ghost'} small" type="button" data-action="toggle-autonomy">自动开工：${auto ? '开' : '关'}</button>
          <button class="link-btn" type="button" data-action="new-task">新建任务</button>
        </div>
      </div>
      <div class="task-toolbar">
        <div class="tab-switch">
          <button class="tab-btn ${!state.taskShowArchived ? 'active' : ''}" type="button" data-action="task-archive-filter" data-value="active">活跃 ${activeTasks.length}</button>
          <button class="tab-btn ${state.taskShowArchived ? 'active' : ''}" type="button" data-action="task-archive-filter" data-value="archived">已归档 ${archivedTasks.length}</button>
        </div>
        <span class="tag ${auto ? 'ok' : 'muted'}">${auto ? '调度器运行中' : '调度器已暂停'}</span>
        <span class="task-toolbar-hint">并行 <strong>${running.length}/${maxConcurrency}</strong> · 待办 ${queued}</span>
        <div class="concurrency-control">
          <span>并发</span>
          ${[1, 2, 3, 4].map((value) => `<button class="concurrency-btn ${maxConcurrency === value ? 'active' : ''}" type="button" data-action="set-concurrency" data-value="${value}">${value}</button>`).join('')}
        </div>
        ${running.map((task) => `<span class="running-chip">${escapeHtml(employee(task.assignee)?.name || '员工')} · ${escapeHtml(task.title)}</span>`).join('')}
      </div>
      <div class="task-list">
        ${tasks.map(renderTaskRow).join('') || `<div class="empty">${state.taskShowArchived ? '还没有归档任务。' : '没有活跃任务。归档项目下的任务已自动隐藏。'}</div>`}
      </div>
    </div>`;
}

function taskPriorityClass(priority) {
  if (priority === '紧急') return 'danger';
  if (priority === '高') return 'warn';
  if (priority === '低') return 'muted';
  return 'info';
}

function taskStatusClass(status) {
  if (status === '进行中') return 'warn';
  if (status === '待验收') return 'info';
  if (status === '已完成') return 'ok';
  if (status === '阻塞') return 'danger';
  return 'muted';
}

function renderTaskRow(task) {
  const done = state.taskDone.has(task.id) || task.status === '已完成';
  const emp = employee(task.assignee);
  const proj = project(task.project);
  const running = task.lastRun?.status === 'running';
  const lastRun = task.lastRun || {};
  const taskDeliverables = (state.data.deliverables || []).filter((item) => item.taskId === task.id);
  const pendingDeliverables = taskDeliverables.filter((item) => item.status === '待验收');
  return `
    <div class="task-row ${done ? 'done' : ''} ${task.archived ? 'archived' : ''}">
      <button class="task-check ${done ? 'done' : ''}" type="button" data-action="toggle-task" data-id="${task.id}" title="切换完成">✓</button>
      <div class="task-main">
        <button class="task-title task-title-btn" type="button" data-action="edit-task" data-id="${task.id}">${escapeHtml(task.title)}</button>
        <div class="task-sub">
          <span>${escapeHtml(proj?.name || (task.company ? '公司事务' : ''))}</span>
          <span>·</span>
          <span>${escapeHtml(emp?.name || '')}</span>
          ${task.archived ? '<span class="tag muted">已归档</span>' : ''}
          ${task.stageLabel ? `<span class="tag ${task.stage === 'person/review' || task.stage === 'person/answer' ? 'warn' : task.stage?.startsWith('person/') ? 'danger' : task.stage === 'working' ? 'info' : 'muted'}">${escapeHtml(task.stageLabel)}</span>` : ''}
          <span class="tag ${taskPriorityClass(task.priority)} task-priority">${escapeHtml(task.priority || '中')}</span>
          ${task.dependencies?.length ? `<span class="task-dep">前置 ${task.dependencies.length}</span>` : ''}
          ${taskDeliverables.length ? `<span class="tag muted">交付 ${taskDeliverables.length}${pendingDeliverables.length ? ` · 待验 ${pendingDeliverables.length}` : ''}</span>` : ''}
          ${task.worktree?.status ? `<span class="tag ${task.worktree.status === '待合并' ? 'warn' : task.worktree.status === 'error' ? 'danger' : 'muted'}">隔离区 ${escapeHtml(task.worktree.status)}</span>` : ''}
          ${running && lastRun.currentActivity ? `<span class="tag info">${escapeHtml(lastRun.currentActivity)}</span>` : ''}
          ${task.stalled ? `<span class="tag danger">疑似卡住</span>` : ''}
          ${running && lastRun.lastEventAt ? `<span class="tag muted">最后活动 ${escapeHtml(formatDateTime(lastRun.lastEventAt))}</span>` : ''}
        </div>
        ${task.acceptance ? `<div class="task-acceptance">验收：${escapeHtml(task.acceptance)}</div>` : ''}
        ${
          lastRun.status === 'error'
            ? `<div class="task-run-error">执行失败：${escapeHtml(lastRun.error || '')}</div>`
            : lastRun.status === 'success'
              ? `<div class="task-run-ok">最近执行：${escapeHtml(formatDateTime(lastRun.finishedAt))}${lastRun.auto ? ' · 自动' : ''} · ${Number(lastRun.tokens || 0).toLocaleString()} tokens${lastRun.stationFiles ? ` · 工位归档 ${lastRun.stationFiles} 个文件` : ''}</div>`
              : lastRun.status === 'interrupted'
                ? `<div class="task-run-warn">${lastRun.reason === 'timeout' ? '执行超时' : '已停止'}，保留断点${lastRun.partial ? ` · ${String(lastRun.partial).length} 字` : ''}</div>`
                : ''
        }
        ${
          task.source
            ? `<button class="task-source" type="button" data-action="open-task-source" data-id="${task.id}">来自对话 · ${escapeHtml(task.source.time || '')} · 查看原话</button>`
            : ''
        }
      </div>
      <div class="task-side">
        <span>${escapeHtml(task.due)}</span>
        <span class="task-status"><span class="tag ${taskStatusClass(task.status)}">${escapeHtml(task.status)}</span></span>
        ${
          task.archived
            ? `<button class="task-handoff" type="button" data-action="unarchive-task" data-id="${task.id}" title="恢复到活跃任务">恢复</button>`
            : `${
                running
                  ? `<button class="task-handoff task-run-btn running" type="button" data-action="cancel-task" data-id="${task.id}" title="停止执行">停止</button>`
                  : `<button class="task-handoff task-run-btn" type="button" data-action="${lastRun.status === 'interrupted' ? 'resume-task' : 'run-task'}" data-id="${task.id}" title="${lastRun.status === 'interrupted' ? '从断点继续' : '让负责人执行任务'}">${lastRun.status === 'interrupted' ? '继续' : task.status === '待办' ? '开工' : '重跑'}</button>`
              }
              <button class="task-handoff" type="button" data-action="collect-deliverable" data-id="${task.id}" title="从员工工位收取交付物">交付</button>
              <button class="task-handoff" type="button" data-action="handoff-task" data-id="${task.id}" title="转交给其他员工">转交</button>
              ${task.worktree?.status === '待合并' ? `<button class="task-handoff worktree-merge" type="button" data-action="merge-worktree" data-id="${task.id}" title="把隔离区改动合并回项目工作区">合并</button>` : ''}
              <button class="task-handoff" type="button" data-action="archive-task" data-id="${task.id}" title="归档后不再出现在活跃任务里">归档</button>`
        }
      </div>
    </div>`;
}

/* ---------------- memories ---------------- */

async function loadGateway(force = false) {
  if (state.gatewayLoading) return;
  state.gatewayLoading = true;
  try {
    const payload = await api('/api/gateway');
    state.gateway = payload.gateway || null;
    const count = Number(state.gateway?.accounts?.length || 0);
    const badge = document.getElementById('gateway-nav-count');
    if (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    }
  } catch (error) {
    state.gateway = { configured: true, ok: false, status: 'error', error: error.message, accounts: [] };
  } finally {
    state.gatewayLoading = false;
  }
  if (state.view === 'gateway' || force) render();
}

async function loadGatewayModels(force = false) {
  if (state.gatewayModelsLoading) return;
  if (!force && state.gatewayModels.length) return;
  state.gatewayModelsLoading = true;
  if (state.view === 'gateway') render();
  try {
    const payload = await api('/api/gateway/models');
    state.gatewayModels = Array.isArray(payload.models) ? payload.models : [];
    if (payload.policy && state.gateway) state.gateway.policy = payload.policy;
  } catch (error) {
    showToast(`读取模型目录失败：${error.message}`, 'warn');
  } finally {
    state.gatewayModelsLoading = false;
  }
  if (state.view === 'gateway') render();
}

function gatewayStatusMeta(gateway) {
  if (!gateway) return { text: '读取中', cls: 'muted' };
  if (gateway.ok) return { text: '运行中', cls: 'ok' };
  if (gateway.status === 'starting') return { text: '启动中', cls: 'warn' };
  if (gateway.status === 'missing') return { text: '缺少程序', cls: 'bad' };
  if (gateway.status === 'stopped') return { text: '已停止', cls: 'muted' };
  return { text: '异常', cls: 'bad' };
}

function gatewayAccountStatus(item) {
  if (item.disabled) return { text: '已停用', cls: 'muted' };
  if (item.cooling) return { text: '冷却中', cls: 'warn' };
  if (item.paused) return { text: '已暂停', cls: 'muted' };
  return { text: '可用', cls: 'ok' };
}

function renderGatewayAccountCard(item) {
  const status = gatewayAccountStatus(item);
  return `<div class="gateway-account-card">
    <div class="gateway-account-head">
      <div>
        <strong>${escapeHtml(item.nickname || item.uid)}</strong>
        <span class="tag ${status.cls}">${status.text}</span>
        ${item.checkinDone ? '<span class="tag ok">今日已签到</span>' : '<span class="tag warn">今日未签到</span>'}
      </div>
      <div class="gateway-credit">${Number(item.credits || 0).toLocaleString()} <span>/ ${Number(item.creditsTotal || 0).toLocaleString()}</span></div>
    </div>
    <div class="gateway-account-meta">
      <span>${item.realm === 'global' ? '国际版' : '国内版'}</span>
      <span>${escapeHtml(item.uid.slice(0, 8))}…</span>
      <span>成功 ${Number(item.successCount || 0).toLocaleString()} 次</span>
      <span>${escapeHtml(item.lastModel || '未使用')}</span>
      ${item.lastSuccess && !item.lastSuccess.startsWith('0001') ? `<span>${escapeHtml(formatDateTime(item.lastSuccess))}</span>` : ''}
    </div>
    ${item.lastError && item.lastError.startsWith('0001') === false ? `<div class="gateway-account-error">${escapeHtml(item.lastError.slice(0, 160))}</div>` : ''}
    <div class="gateway-account-actions">
      <button class="btn ghost small" type="button" data-action="gateway-account" data-uid="${escapeHtml(item.uid)}" data-op="checkin">签到</button>
      <button class="btn ghost small" type="button" data-action="gateway-account" data-uid="${escapeHtml(item.uid)}" data-op="balance">刷新余额</button>
      <button class="btn ghost small" type="button" data-action="gateway-account" data-uid="${escapeHtml(item.uid)}" data-op="${item.disabled ? 'revive' : 'disable'}">${item.disabled ? '恢复' : '停用'}</button>
      <button class="btn ghost small" type="button" data-action="gateway-account" data-uid="${escapeHtml(item.uid)}" data-op="${item.paused ? 'resume' : 'pause'}">${item.paused ? '继续调度' : '暂停调度'}</button>
      <button class="btn ghost small danger" type="button" data-action="gateway-account" data-uid="${escapeHtml(item.uid)}" data-op="remove">移除</button>
    </div>
  </div>`;
}

function gatewayTabs(gateway) {
  const tabs = [
    ['overview', '概览'],
    ['accounts', `账户 ${gateway?.accounts?.length || 0}`],
    ['checkin', '签到'],
    ['models', '模型'],
    ['routing', '夜间与档位'],
    ['transfer', '导入导出'],
    ['settings', '服务设置'],
  ];
  return `<div class="gateway-tabs">${tabs
    .map(
      ([key, label]) =>
        `<button class="gateway-tab ${state.gatewayTab === key ? 'active' : ''}" type="button" data-action="gateway-tab" data-tab="${key}">${label}</button>`,
    )
    .join('')}</div>`;
}

function renderGatewayOverview(gateway, accounts) {
  const policy = gateway.policy || {};
  const night = policy.night || {};
  const checkinDone = accounts.filter((item) => item.checkinDone).length;
  const models = state.gatewayModels || [];
  return `
    <div class="gateway-grid">
      <div class="gateway-stat"><span>服务状态</span><strong>${gateway.ok ? '运行中' : escapeHtml(gateway.status || '异常')}</strong><small>${escapeHtml(gateway.baseUrl || '')}</small></div>
      <div class="gateway-stat"><span>可用 / 总账号</span><strong>${Number(gateway.healthy || 0)} / ${Number(gateway.total || accounts.length)}</strong><small>总积分 ${Number(gateway.credits || 0).toLocaleString()}</small></div>
      <div class="gateway-stat"><span>今日签到</span><strong>${checkinDone} / ${accounts.length}</strong><small>${policy.checkin?.auto ? `自动 ${ (policy.checkin.hours || []).map((h) => `${h}:00`).join('、') }` : '自动签到关闭'}</small></div>
      <div class="gateway-stat"><span>模型 / 夜间策略</span><strong>${models.length || '—'}</strong><small>${night.enabled ? `${night.start}-${night.end} → ${escapeHtml(night.model || '未选')}` : '未启用'}</small></div>
    </div>
    ${gateway.error ? `<div class="gateway-alert bad">${escapeHtml(gateway.error)}</div>` : ''}
    <div class="gateway-columns">
      <div class="gateway-card">
        <h4>模型服务</h4>
        <p class="gateway-note">把内置网关加入「模型服务」后，员工的对话和任务会走公司账号池。</p>
        <div class="gateway-inline">
          <span class="tag ${gateway.providerAdded ? 'ok' : 'muted'}">${gateway.providerAdded ? '已加入' : '未加入'}</span>
          <button class="btn primary small" type="button" data-action="gateway-add-provider">${gateway.providerAdded ? '同步模型' : '加入模型服务'}</button>
          <button class="btn ghost small" type="button" data-action="gateway-sync-models">刷新模型目录</button>
        </div>
      </div>
      <div class="gateway-card">
        <h4>账号池</h4>
        <p class="gateway-note">${accounts.length ? `共 ${accounts.length} 个账号，${gateway.healthy || 0} 个可用。` : '还没有账号。添加 WorkBuddy 账号后即可使用免费积分。'}</p>
        <div class="gateway-inline">
          <button class="btn primary small" type="button" data-action="gateway-open-add">添加账户</button>
          <button class="btn ghost small" type="button" data-action="gateway-checkin-all">全部签到</button>
        </div>
      </div>
    </div>
    <div class="gateway-card">
      <h4>最近签到</h4>
      <div class="gateway-history">
        ${(gateway.checkins || []).slice(0, 8).map((item) => `<div class="gateway-history-row">
          <span class="tag ${item.ok ? 'ok' : 'bad'}">${item.ok ? '成功' : '失败'}</span>
          <strong>${escapeHtml(item.nickname || item.uid || '全部账号')}</strong>
          <span>${escapeHtml(item.action)}</span>
          <span class="spacer"></span>
          <span class="hint">${escapeHtml(formatDateTime(item.time))}</span>
        </div>`).join('') || '<div class="gateway-empty">还没有签到记录。</div>'}
      </div>
    </div>`;
}

function renderGatewayAccounts(accounts) {
  return `<div class="gateway-toolbar">
      <div><strong>${accounts.length}</strong> 个账号 <span class="hint">总积分 ${Number(accounts.reduce((sum, item) => sum + Number(item.credits || 0), 0)).toLocaleString()}</span></div>
      <div class="gateway-inline">
        <button class="btn ghost small" type="button" data-action="gateway-balance-all">刷新全部余额</button>
        <button class="btn ghost small" type="button" data-action="gateway-refresh">刷新</button>
        <button class="btn primary small" type="button" data-action="gateway-open-add">添加账户</button>
      </div>
    </div>
    <div class="gateway-account-list">
      ${accounts.map(renderGatewayAccountCard).join('') || '<div class="gateway-empty">还没有登录账号。点「添加账户」生成授权链接，用浏览器登录 WorkBuddy。</div>'}
    </div>`;
}

function renderGatewayCheckin(gateway, accounts) {
  const done = accounts.filter((item) => item.checkinDone).length;
  return `<div class="gateway-toolbar">
      <div>今日已签到 <strong>${done}</strong> / ${accounts.length} <span class="hint">签到可领当天积分，网关也会按设置自动签到。</span></div>
      <div class="gateway-inline">
        <button class="btn primary small" type="button" data-action="gateway-checkin-all">全部签到</button>
      </div>
    </div>
    <div class="gateway-checkin-list">
      ${accounts.map((item) => `<div class="gateway-checkin-row">
        <span class="tag ${item.checkinDone ? 'ok' : 'warn'}">${item.checkinDone ? '已签到' : '未签到'}</span>
        <strong>${escapeHtml(item.nickname || item.uid)}</strong>
        <span class="hint">${Number(item.credits || 0).toLocaleString()} 积分</span>
        <span class="spacer"></span>
        <button class="btn ghost small" type="button" data-action="gateway-account" data-uid="${escapeHtml(item.uid)}" data-op="checkin" ${item.checkinDone ? 'disabled' : ''}>立即签到</button>
        <button class="btn ghost small" type="button" data-action="gateway-account" data-uid="${escapeHtml(item.uid)}" data-op="balance">刷新余额</button>
      </div>`).join('') || '<div class="gateway-empty">还没有账号。</div>'}
    </div>
    <div class="gateway-card">
      <h4>签到记录</h4>
      <div class="gateway-history">
        ${(gateway.checkins || []).slice(0, 20).map((item) => `<div class="gateway-history-row">
          <span class="tag ${item.ok ? 'ok' : 'bad'}">${item.ok ? '成功' : '失败'}</span>
          <strong>${escapeHtml(item.nickname || item.uid || '全部账号')}</strong>
          <span>${escapeHtml(item.action)}</span>
          <span class="spacer"></span>
          <span class="hint">${escapeHtml(formatDateTime(item.time))}</span>
        </div>`).join('') || '<div class="gateway-empty">还没有签到记录。</div>'}
      </div>
    </div>`;
}

function renderGatewayModels() {
  const models = state.gatewayModels || [];
  if (state.gatewayModelsLoading) return '<div class="gateway-empty">正在从网关读取模型目录…</div>';
  return `<div class="gateway-toolbar">
      <div><strong>${models.length}</strong> 个模型 <span class="hint">勾选会进入「模型服务」；档位用于夜间低耗策略。</span></div>
      <div class="gateway-inline">
        <button class="btn ghost small" type="button" data-action="gateway-sync-models">重新同步</button>
        <button class="btn primary small" type="button" data-action="gateway-save-models">保存模型策略</button>
      </div>
    </div>
    <div class="gateway-model-table">
      <div class="gateway-model-head"><span></span><span>模型</span><span>倍率</span><span>上下文</span><span>能力</span><span>档位</span><span>免费</span></div>
      ${models.map((model) => `<div class="gateway-model-row" data-model-row="${escapeHtml(model.id)}">
        <label class="gateway-check"><input type="checkbox" data-gateway-model="enabled" data-id="${escapeHtml(model.id)}" ${model.enabled ? 'checked' : ''} /></label>
        <div class="gateway-model-name"><strong>${escapeHtml(model.name)}</strong><span>${escapeHtml(model.id)}</span></div>
        <span class="gateway-model-rate">${escapeHtml(model.credits || '—')}</span>
        <span>${model.contextWindow ? `${Math.round(model.contextWindow / 1000)}K` : '—'} / ${model.maxOutputTokens ? `${Math.round(model.maxOutputTokens / 1000)}K` : '—'}</span>
        <span class="gateway-model-tags">${model.vision ? '<span class="tag muted">图片</span>' : ''}${model.reasoning ? '<span class="tag muted">推理</span>' : ''}</span>
        <select data-gateway-model="tier" data-id="${escapeHtml(model.id)}" class="gateway-select">
          ${['high', 'standard', 'basic'].map((tier) => `<option value="${tier}" ${model.tier === tier ? 'selected' : ''}>${{ high: '高能力', standard: '标准', basic: '基础' }[tier]}</option>`).join('')}
        </select>
        <label class="gateway-check"><input type="checkbox" data-gateway-model="free" data-id="${escapeHtml(model.id)}" ${model.free ? 'checked' : ''} /></label>
      </div>`).join('') || '<div class="gateway-empty">网关没有返回模型。先添加账号，或点「重新同步」。</div>'}
    </div>`;
}

function renderGatewayRouting(gateway) {
  const policy = gateway.policy || {};
  const night = policy.night || {};
  const models = (state.gatewayModels || []).filter((item) => item.enabled);
  const employees = (state.data.employees || []).filter((item) => !item.archived);
  return `<div class="gateway-columns">
    <div class="gateway-card">
      <h4>夜间低耗策略</h4>
      <p class="gateway-note">到达设定时段后，指定档位的员工自动切到夜间模型；白天恢复原模型，不改员工档案。</p>
      <div class="gateway-form-grid">
        <label class="gateway-check-line"><input id="gateway-night-enabled" type="checkbox" ${night.enabled ? 'checked' : ''} /> 启用夜间切换</label>
        <label>开始时间<input id="gateway-night-start" type="time" value="${escapeHtml(night.start || '23:00')}" /></label>
        <label>结束时间<input id="gateway-night-end" type="time" value="${escapeHtml(night.end || '08:00')}" /></label>
        <label class="full">夜间模型<select id="gateway-night-model">
          <option value="">选择模型…</option>
          ${models.map((model) => `<option value="${escapeHtml(model.id)}" ${night.model === model.id ? 'selected' : ''}>${escapeHtml(model.name)} · ${escapeHtml(model.credits || '')}${model.free ? ' · 免费' : ''}</option>`).join('')}
        </select></label>
        <label>思考强度<select id="gateway-night-effort">
          ${[['off', '关闭（最省）'], ['low', '低'], ['medium', '中'], ['high', '高']].map(([value, label]) => `<option value="${value}" ${(night.effort || 'off') === value ? 'selected' : ''}>${label}</option>`).join('')}
        </select></label>
      </div>
      <div class="gateway-tier-checks">
        <span>影响档位：</span>
        ${[['basic', '基础岗'], ['standard', '标准岗'], ['high', '高能力岗']].map(([value, label]) => `<label class="gateway-check-line"><input type="checkbox" data-gateway-night-tier="${value}" ${(night.tiers || []).includes(value) ? 'checked' : ''} /> ${label}</label>`).join('')}
      </div>
      <div class="gateway-inline"><button class="btn primary small" type="button" data-action="gateway-save-policy">保存夜间策略</button></div>
    </div>
    <div class="gateway-card">
      <h4>员工模型档位</h4>
      <p class="gateway-note">档位决定夜间是否降级。高能力岗默认不降，基础岗默认降。</p>
      <div class="gateway-tier-list">
        ${employees.map((employee) => {
          const tier = employee.modelProfile?.tier || (/研发|工程|开发|架构|算法|技术|数据|财务|审阅|分析|法务/i.test(`${employee.role || ''} ${employee.dept || ''}`) ? 'high' : /秘书|人事|行政|HR|主管|管理|助理/i.test(`${employee.role || ''} ${employee.dept || ''}`) ? 'standard' : 'basic');
          return `<div class="gateway-tier-row">
            <strong>${escapeHtml(employee.name)}</strong>
            <span class="hint">${escapeHtml(employee.role)}</span>
            <span class="spacer"></span>
            <select class="gateway-select" data-gateway-employee-tier="${escapeHtml(employee.id)}">
              ${[['high', '高能力'], ['standard', '标准'], ['basic', '基础']].map(([value, label]) => `<option value="${value}" ${tier === value ? 'selected' : ''}>${label}</option>`).join('')}
            </select>
            <button class="btn ghost small" type="button" data-action="gateway-save-employee-tier" data-id="${escapeHtml(employee.id)}">保存</button>
          </div>`;
        }).join('') || '<div class="gateway-empty">还没有员工。</div>'}
      </div>
    </div>
  </div>`;
}

function renderGatewayTransfer(gateway) {
  const servers = state.data.servers || [];
  return `<div class="gateway-columns">
    <div class="gateway-card">
      <h4>从原网关导入</h4>
      <p class="gateway-note">旧网关还在别的机器上时，直接用 SSH 读取它的 <code>auths/</code> 目录，不需要手工拷贝。</p>
      <p class="gateway-note gateway-warn">导入前请先停止旧网关进程：两个网关同时刷新同一个账号的令牌，会互相把对方顶下线。导入完成后由公司网关接管签到和保活。</p>
      <div class="gateway-form-grid">
        <label class="full">服务器<select id="gateway-import-server">
          <option value="">选择机房台账里的服务器…</option>
          ${servers.map((server) => `<option value="${escapeHtml(server.id)}">${escapeHtml(server.name)} · ${escapeHtml(server.host || '')}</option>`).join('')}
        </select></label>
        <label class="full">原网关授权目录<input id="gateway-import-authdir" value="~/wb2api/auths" placeholder="~/wb2api/auths" /></label>
      </div>
      <div class="gateway-inline"><button class="btn primary small" type="button" data-action="gateway-import-remote">开始导入</button></div>
    </div>
    <div class="gateway-card">
      <h4>上传 JSON 导入</h4>
      <p class="gateway-note">支持原网关 auths 文件、账号数组、<code>{"format":"workbuddy-accounts","accounts":[…]}</code> 导出包。</p>
      <input id="gateway-import-file" type="file" accept=".json,application/json" hidden />
      <div class="gateway-inline">
        <button class="btn primary small" type="button" data-action="gateway-pick-import">选择 JSON 文件</button>
        <button class="btn ghost small" type="button" data-action="gateway-export">导出当前账号</button>
      </div>
      <div class="settings-hint">导出文件包含账号凭据，只放在公司数据目录或交给老板保管。</div>
    </div>
  </div>
  <div class="gateway-card">
    <h4>给 Agent 的导出方式</h4>
    <p class="gateway-note">让 Agent 在原网关机器上运行下面的脚本，会把 <code>auths/*.json</code> 合并成一份可导入的 JSON。Linux 机器通常自带 Python 3，不需要安装 Node：</p>
    <pre class="gateway-code">python3 gateway-export.py --dir ~/wb2api/auths --out gateway-accounts.json</pre>
    <p class="gateway-note">然后把 <code>gateway-accounts.json</code> 拖到「上传 JSON 导入」。也可以让员工直接调用 <code>gateway_import_remote</code> 工具，从机房服务器导入。</p>
    <div class="gateway-inline">
      <button class="btn ghost small" type="button" data-action="gateway-copy-agent">复制 Agent 指令</button>
      <button class="btn ghost small" type="button" data-action="gateway-download-script">下载 Python 脚本</button>
      <button class="btn ghost small" type="button" data-action="gateway-download-script-node">下载 Node 脚本</button>
    </div>
  </div>`;
}

function renderGatewaySettings(gateway) {
  const policy = gateway.policy || {};
  return `<div class="gateway-columns">
    <div class="gateway-card">
      <h4>内置服务</h4>
      <div class="gateway-kv"><span>状态</span><strong>${escapeHtml(gateway.status || '')}</strong></div>
      <div class="gateway-kv"><span>监听</span><strong>${escapeHtml(gateway.baseUrl || '—')}</strong></div>
      <div class="gateway-kv"><span>版本</span><strong>${escapeHtml(gateway.version || '—')}</strong></div>
      <div class="gateway-kv"><span>进程</span><strong>${gateway.processId || '—'}</strong></div>
      <div class="gateway-kv"><span>API Key</span><strong>${escapeHtml(gateway.apiKeyMasked || '—')}</strong></div>
      <div class="gateway-kv"><span>日志</span><strong class="gateway-path">${escapeHtml(gateway.logPath || '—')}</strong></div>
      <div class="gateway-inline">
        <button class="btn ghost small" type="button" data-action="gateway-start-service">启动</button>
        <button class="btn ghost small" type="button" data-action="gateway-restart-service">重启</button>
        <button class="btn ghost small danger" type="button" data-action="gateway-stop-service">停止</button>
        <button class="btn ghost small" type="button" data-action="gateway-open-panel">高级面板</button>
      </div>
      <div class="settings-hint">网关只监听 127.0.0.1，不向局域网暴露；随公司服务一起启动。</div>
    </div>
    <div class="gateway-card">
      <h4>自动签到</h4>
      <p class="gateway-note">网关会在设定时点自动签到。也可以随时手动「全部签到」。</p>
      <div class="gateway-form-grid">
        <label class="gateway-check-line"><input id="gateway-checkin-auto" type="checkbox" ${policy.checkin?.auto !== false ? 'checked' : ''} /> 启用自动签到</label>
        <label>签到时点<input id="gateway-checkin-hours" value="${(policy.checkin?.hours || [9, 21]).join(', ')}" placeholder="9, 21" /></label>
      </div>
      <div class="gateway-inline"><button class="btn primary small" type="button" data-action="gateway-save-checkin">保存签到设置</button></div>
    </div>
  </div>`;
}

function renderGatewayPage() {
  const gateway = state.gateway;
  if (!gateway) {
    return `<div class="gateway-page"><div class="gateway-empty">${state.gatewayLoading ? '正在读取网关…' : '正在连接网关…'}</div></div>`;
  }
  const accounts = Array.isArray(gateway.accounts) ? gateway.accounts : [];
  const status = gatewayStatusMeta(gateway);
  let body = '';
  if (state.gatewayTab === 'accounts') body = renderGatewayAccounts(accounts);
  else if (state.gatewayTab === 'checkin') body = renderGatewayCheckin(gateway, accounts);
  else if (state.gatewayTab === 'models') body = renderGatewayModels();
  else if (state.gatewayTab === 'routing') body = renderGatewayRouting(gateway);
  else if (state.gatewayTab === 'transfer') body = renderGatewayTransfer(gateway);
  else if (state.gatewayTab === 'settings') body = renderGatewaySettings(gateway);
  else body = renderGatewayOverview(gateway, accounts);
  return `<div class="gateway-page">
    <div class="gateway-hero">
      <div>
        <h3>公司网关 <span class="tag ${status.cls}">${status.text}</span> <span class="gateway-local">仅本机</span></h3>
        <p>随公司启动的内置 WorkBuddy 网关：账号池、签到、模型与夜间低耗都在这里管理，不再连接外部 7863。</p>
      </div>
      <div class="gateway-hero-actions">
        <button class="btn ghost small" type="button" data-action="gateway-refresh">刷新</button>
        <button class="btn ghost small" type="button" data-action="gateway-open-panel" ${gateway.ok ? '' : 'disabled'}>高级面板</button>
        <button class="btn primary small" type="button" data-action="gateway-open-add">添加账户</button>
      </div>
    </div>
    ${gatewayTabs(gateway)}
    <div class="gateway-body">${body}</div>
  </div>`;
}

function clearGatewayLoginTimer() {
  if (state.gatewayLoginTimer) {
    clearInterval(state.gatewayLoginTimer);
    state.gatewayLoginTimer = null;
  }
}

function renderGatewayAddPanel() {
  const login = state.gatewayLogin;
  const fields = document.getElementById('modal-fields');
  const primary = document.getElementById('modal-primary');
  if (!fields || !login) return;
  if (primary) primary.style.display = 'none';
  fields.innerHTML = `
    <div class="gateway-add-copy">用浏览器打开下面的链接，登录 WorkBuddy 账号。登录成功后这里会自动检测并把账号加入网关。</div>
    <div class="gateway-auth-url">${escapeHtml(login.url || '')}</div>
    <div class="gateway-inline">
      <button class="btn primary small" type="button" data-action="gateway-open-auth-url">打开授权链接</button>
      <button class="btn ghost small" type="button" data-action="gateway-copy-auth-url">复制链接</button>
    </div>
    <div id="gateway-add-status" class="gateway-add-status">等待登录…</div>`;
}

function startGatewayLoginPoll() {
  clearGatewayLoginTimer();
  state.gatewayLoginTimer = setInterval(async () => {
    if (!state.gatewayLogin?.state) {
      clearGatewayLoginTimer();
      return;
    }
    try {
      const payload = await api(`/api/gateway/login/poll?state=${encodeURIComponent(state.gatewayLogin.state)}`);
      const status = document.getElementById('gateway-add-status');
      if (payload.done) {
        clearGatewayLoginTimer();
        if (status) status.textContent = `已添加 ${payload.nickname || payload.uid || ''}，正在载入账号池…`;
        closeModal();
        showToast(`账号已添加：${payload.nickname || payload.uid || ''}`, 'ok');
        await loadGateway(true);
        await loadGatewayModels(true);
      } else if (status) {
        status.textContent = '等待登录…（登录完成后会自动检测）';
      }
    } catch (error) {
      clearGatewayLoginTimer();
      const status = document.getElementById('gateway-add-status');
      if (status) status.textContent = `登录检测失败：${error.message}`;
    }
  }, 3000);
}

function memorySourceLabel(item) {
  const source = String(item?.source || 'manual');
  if (source === 'memory-review') return '自动评审';
  if (source === 'deliverable-approval' || source === 'ledger-migration') return '交付台账';
  if (source === 'system') return '系统同步';
  if (source === 'manual') return '手动';
  return source;
}

function renderMemoryActivity(memories) {
  const recent = [...memories]
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    .slice(0, 8);
  if (!recent.length) return '<div class="empty">还没有记忆动态。</div>';
  return recent
    .map(
      (item) => `
      <div class="memory-row memory-activity-row">
        <span class="tag muted">${escapeHtml(memorySourceLabel(item))}</span>
        <div class="memory-main">
          <div class="memory-name">${escapeHtml(item.name)} · v${Number(item.version || 1)}</div>
          <div class="memory-path">${escapeHtml(item.layer === 'rule' ? '规则' : item.layer === 'log' ? '日志' : '笔记')} · ${escapeHtml(item.scope || '公司')} · ${escapeHtml(formatDateTime(item.updatedAt))}</div>
        </div>
        ${Array.isArray(item.versions) && item.versions.length > 1 ? `<button class="btn ghost small" type="button" data-action="undo-memory" data-id="${escapeHtml(item.id)}">撤销</button>` : ''}
      </div>`,
    )
    .join('');
}

function renderMemoryArchive() {
  const list = state.memoryArchiveList || [];
  if (!state.memoryArchiveOpen) return '';
  return `
    <div class="memory-archive">
      <div class="section-head">
        <h3>归档箱 <span class="hint">占位、过期、重复合并的记忆；恢复后重新进入索引</span></h3>
        <button class="link-btn" type="button" data-action="toggle-memory-archive">收起</button>
      </div>
      <div class="memory-list">
        ${list
          .map(
            (item) => `
          <div class="memory-row memory-activity-row">
            <span class="tag muted">${escapeHtml(item.layer === 'rule' ? '规则' : item.layer === 'log' ? '日志' : '笔记')}</span>
            <div class="memory-main">
              <div class="memory-name">${escapeHtml(item.name)}</div>
              <div class="memory-path">${escapeHtml(item.archiveReason || '已归档')} · ${escapeHtml(formatDateTime(item.updatedAt))}</div>
            </div>
            <button class="btn ghost small" type="button" data-action="restore-memory" data-id="${escapeHtml(item.id)}">恢复</button>
          </div>`,
          )
          .join('') || '<div class="empty">归档箱是空的。</div>'}
      </div>
    </div>`;
}

function renderMemoriesPage() {
  const memories = (state.data.memories || []).filter((item) => item.status !== 'archived');
  const archivedCount = Number(state.data.memoriesArchived || 0);
  return `
    <div class="page">
      <div class="section-head">
        <h2>公司知识库 <span class="hint">设备 / 服务器 / 服务 / 流程 / 项目参数；员工每轮只带一行索引和相关的 3-4 条正文，需要细节再用 read_memory 取全文</span></h2>
        <button class="link-btn" type="button" data-action="new-memory">新建知识</button>
      </div>
      <div class="asset-metrics">
        <div class="metric-card"><div class="metric-label">知识总数</div><div class="metric-value">${memories.length}</div><div class="metric-sub">Markdown 落盘</div></div>
        <div class="metric-card"><div class="metric-label">服务器 / 设备</div><div class="metric-value">${memories.filter((item) => ['服务器', '设备', '服务'].includes(item.category)).length}</div><div class="metric-sub">地址、端口、参数</div></div>
        <div class="metric-card"><div class="metric-label">流程 / 项目参数</div><div class="metric-value">${memories.filter((item) => ['流程', '项目参数'].includes(item.category)).length}</div><div class="metric-sub">工序与验收标准</div></div>
        <div class="metric-card"><div class="metric-label">归档</div><div class="metric-value">${archivedCount}</div><div class="metric-sub"><button class="link-btn" type="button" data-action="toggle-memory-archive">${state.memoryArchiveOpen ? '收起归档箱' : '打开归档箱'}</button></div></div>
      </div>
      ${renderMemoryArchive()}
      <div class="section-head">
        <h3>最近动态 <span class="hint">自动评审、交付台账和手动修改都会留版本，可撤销</span></h3>
      </div>
      <div class="memory-list memory-activity">${renderMemoryActivity(memories)}</div>
      <div class="section-head"><h3>全部记忆</h3></div>
      <div class="memory-list">
        ${memories.map(renderMemoryRow).join('') || '<div class="empty">还没有记忆。新建后员工会在下一轮对话里引用。</div>'}
      </div>
    </div>`;
}

function renderMemoryRow(item) {
  const layerLabel = { rule: '规则', note: '笔记', log: '日志' }[item.layer] || '笔记';
  return `
    <button class="memory-row" type="button" data-action="preview-memory" data-id="${item.id}">
      <span class="memory-icon">MD</span>
      <div class="memory-main">
        <div class="memory-name">${escapeHtml(item.name)}${item.pinned ? ' <span class="pill pill-ok">置顶</span>' : ''}</div>
        <div class="memory-path">${escapeHtml(item.path)}${item.summary ? ` · ${escapeHtml(item.summary)}` : ''}</div>
      </div>
      <span class="tag muted">${layerLabel}</span>
      <span class="tag muted">${escapeHtml(item.category || '其他')}</span>
      <span class="tag muted">${escapeHtml(item.scope)}</span>
      <span class="tag muted">v${Number(item.version || 1)}</span>
      <span class="memory-time">${escapeHtml(formatDateTime(item.updatedAt))}</span>
    </button>`;
}

async function openMemoryPreview(id) {
  openModal('memory-preview', id);
  const body = document.getElementById('memory-preview-body');
  if (!body) return;
  try {
    const payload = await api(`/api/memories/${encodeURIComponent(id)}`);
    const memory = payload.memory || {};
    state.memoryDetail = payload;
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = `${memory.name || '记忆'} · v${memory.version || 1}`;
    const content = String(payload.content || memory.summary || '（空记忆）').replace(/^---[\s\S]*?---\s*/, '');
    const versions = memory.versions || [];
    body.innerHTML = `
      <div class="preview-meta">${escapeHtml(memory.category || '其他')} · ${escapeHtml(memory.scope || '')} · ${escapeHtml(memory.path || '')} · 当前 v${memory.version || 1} · ${escapeHtml(formatDateTime(memory.updatedAt))}</div>
      ${payload.fileState?.externalChange ? '<div class="conflict-banner">检测到 Markdown 文件被外部修改，当前内容与记忆库不一致。可点“以文件为准”或“覆盖文件”。</div>' : ''}
      <pre class="preview-text memory-text">${escapeHtml(content)}</pre>
      <div class="memory-version-head">
        <strong>版本历史</strong>
        <div class="memory-version-actions">
          <button class="btn primary small" type="button" data-action="edit-memory" data-id="${escapeHtml(memory.id)}">编辑记忆</button>
          ${payload.fileState?.externalChange ? `<button class="btn ghost small" type="button" data-action="memory-file-adopt" data-id="${escapeHtml(memory.id)}">以文件为准</button>` : ''}
        </div>
      </div>
      <div class="memory-versions">
        ${versions
          .map(
            (version) => `<div class="memory-version-row ${Number(version.version) === Number(memory.version) ? 'current' : ''}">
          <span class="memory-version-no">v${version.version}</span>
          <div class="memory-version-info"><strong>${escapeHtml(version.note || '更新')}</strong><span>${escapeHtml(version.editor || 'system')} · ${escapeHtml(formatDateTime(version.updatedAt))} · ${Number(String(version.content || '').length).toLocaleString()} 字</span></div>
          ${Number(version.version) === Number(memory.version) ? '<span class="pill pill-ok">当前</span>' : `<button class="link-btn" type="button" data-action="rollback-memory" data-id="${escapeHtml(memory.id)}" data-version="${version.version}">回滚到此版</button>`}
        </div>`,
          )
          .join('') || '<div class="hint">暂无版本记录。</div>'}
      </div>`;
  } catch (error) {
    body.textContent = `读取失败：${error.message}`;
  }
}

async function runTaskNow(id) {
  try {
    const payload = await api('/api/tasks/run', { method: 'POST', body: JSON.stringify({ id }) });
    applyServerState(payload.state);
    render();
    showToast('任务已开始执行，完成后会自动生成交付物');
    pollTaskRun(id, 20);
  } catch (error) {
    showToast(`开工失败：${error.message}`);
  }
}

function pollTaskRun(taskId, attemptsLeft) {
  setTimeout(async () => {
    try {
      const payload = await api('/api/state');
      applyServerState(payload.state);
      if (state.view === 'tasks') render();
      const task = state.data.tasks.find((item) => item.id === taskId);
      if (task?.lastRun?.status === 'running' && attemptsLeft > 0) {
        pollTaskRun(taskId, attemptsLeft - 1);
      } else if (task?.lastRun?.status === 'success') {
        showToast(`任务「${task.title}」执行完成，已生成交付物`);
        render();
      } else if (task?.lastRun?.status === 'error') {
        showToast(`任务执行失败：${task.lastRun.error || '未知错误'}`);
      }
    } catch {
      /* 忽略轮询错误 */
    }
  }, 3000);
}

async function refreshTaskState() {
  try {
    const payload = await api('/api/state');
    applyServerState(payload.state);
    if (state.view === 'tasks') render();
  } catch {
    /* 忽略后台刷新错误 */
  }
}

async function toggleAutonomy() {
  try {
    const enabled = !state.data.autonomy?.enabled;
    const payload = await api('/api/autonomy', { method: 'POST', body: JSON.stringify({ enabled }) });
    applyServerState(payload.state);
    render();
    showToast(enabled ? '自动开工已开启：待办任务会按并行槽位执行' : '自动开工已暂停');
  } catch (error) {
    showToast(`切换失败：${error.message}`);
  }
}

async function setConcurrency(value) {
  try {
    const payload = await api('/api/autonomy', {
      method: 'POST',
      body: JSON.stringify({ maxConcurrency: Number(value) || 2 }),
    });
    applyServerState(payload.state);
    render();
    showToast(`并行槽位已设为 ${payload.autonomy?.maxConcurrency || value}`);
  } catch (error) {
    showToast(`设置失败：${error.message}`);
  }
}

/* ---------------- company assets ---------------- */

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`;
  if (value < 1024 * 1024 * 1024 * 1024) return `${(value / 1024 / 1024 / 1024).toFixed(1)} GB`;
  return `${(value / 1024 / 1024 / 1024 / 1024).toFixed(1)} TB`;
}

function documentStatusClass(status) {
  if (status === '已发布') return 'ok';
  if (status === '评审中') return 'warn';
  return 'muted';
}

function renderDocumentsPage() {
  const documents = state.data.documents || [];
  const published = documents.filter((item) => item.status === '已发布').length;
  const categories = new Set(documents.map((item) => item.category)).size;
  const scopes = new Set(documents.map((item) => item.scope)).size;
  return `
    <div class="page">
      <div class="section-head">
        <h2>文档管理 <span class="hint">公司制度、产品文档、合同与报告统一归档</span></h2>
        <span class="tag muted">${documents.length} 份文档</span>
      </div>
      <div class="asset-metrics">
        <div class="metric-card"><div class="metric-label">文档总数</div><div class="metric-value">${documents.length}</div><div class="metric-sub">${categories} 个分类</div></div>
        <div class="metric-card"><div class="metric-label">已发布</div><div class="metric-value">${published}</div><div class="metric-sub">${documents.length - published} 份待处理</div></div>
        <div class="metric-card"><div class="metric-label">归档范围</div><div class="metric-value">${scopes}</div><div class="metric-sub">公司 / 项目 / 员工</div></div>
        <div class="metric-card"><div class="metric-label">最近更新</div><div class="metric-value" style="font-size:16px">${escapeHtml(formatDateTime(documents[0]?.updatedAt))}</div><div class="metric-sub">${escapeHtml(documents[0]?.name || '—')}</div></div>
      </div>
      <div class="asset-list">
        ${documents
          .map(
            (doc) => `
          <div class="doc-row">
            <span class="doc-ext">${escapeHtml(doc.name.split('.').pop()?.toUpperCase() || 'DOC')}</span>
            <div class="doc-main">
              <div class="doc-name">${escapeHtml(doc.name)}</div>
              <div class="doc-path">${escapeHtml(doc.path)} · ${escapeHtml(doc.summary || '')}</div>
            </div>
            <span class="tag muted">${escapeHtml(doc.category)}</span>
            <span class="tag muted">${escapeHtml(doc.scope)}</span>
            <span class="doc-owner">${avatar(employee(doc.ownerId), 'sm')} ${escapeHtml(employee(doc.ownerId)?.name || '未归档')}</span>
            <span class="doc-meta">${escapeHtml(formatDateTime(doc.updatedAt))}<br>${formatBytes(doc.size)}</span>
            <span class="tag ${documentStatusClass(doc.status)}">${escapeHtml(doc.status)}</span>
            <button class="btn ghost small" type="button" data-action="preview-document" data-id="${doc.id}">查看</button>
          </div>`,
          )
          .join('')}
      </div>
    </div>`;
}

function skillCategory(name) {
  if (/(招聘|岗位|权限|员工|行政|归档)/.test(name)) return '人事行政';
  if (/(核算|报价|对账|财务)/.test(name)) return '财务';
  if (/(分镜|脚本|选题|剪辑|字幕|封面|内容)/.test(name)) return '内容';
  if (/(建模|拆件|支撑|切片|打印|质检)/.test(name)) return '生产';
  if (/(客服|售后|话术|订单)/.test(name)) return '客户';
  if (/(目标|排期|日报|管理)/.test(name)) return '管理';
  if (/(审阅|质量|把关)/.test(name)) return '质量';
  return '通用';
}

function skillDescription(category) {
  const map = {
    人事行政: '招聘、岗位设计、员工档案与权限分配',
    财务: '成本核算、报价测算与对账',
    内容: '选题、分镜、脚本、剪辑与封面包装',
    生产: '3D 建模、拆件、打印与质检',
    客户: '客服接待、售后处理与话术',
    管理: '目标拆解、排期与日常汇报',
    质量: '交付审阅与质量把关',
    通用: '跨岗位通用协作技能',
  };
  return map[category] || map['通用'];
}

function skillCatalog() {
  const map = new Map();
  for (const emp of state.data.employees) {
    for (const name of emp.skills || []) {
      if (!map.has(name)) map.set(name, { name, employees: [] });
      map.get(name).employees.push(emp);
    }
  }
  return [...map.values()].sort((a, b) => b.employees.length - a.employees.length || a.name.localeCompare(b.name, 'zh-CN'));
}

function skillEmployees(name) {
  return state.data.employees.filter((emp) => (emp.skills || []).includes(name));
}

function renderSkillsPage() {
  const catalog = Array.isArray(state.data.skillCatalog) && state.data.skillCatalog.length
    ? state.data.skillCatalog
    : skillCatalog().map((item) => ({
        id: item.name,
        name: item.name,
        category: skillCategory(item.name),
        description: skillDescription(skillCategory(item.name)),
        employees: item.employees,
      }));
  const categories = new Set(catalog.map((item) => item.category)).size;
  const used = catalog.filter((item) => skillEmployees(item.name).length > 0).length;
  return `
    <div class="page">
      <div class="section-head">
        <h2>技能目录 <span class="hint">人事专员招聘时从这里读取并分配</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="open-market" data-type="skill">WorkBuddy 热门 TOP10</button>
          <button class="btn primary small" type="button" data-action="new-skill">新增技能</button>
        </div>
      </div>
      <div class="asset-metrics">
        <div class="metric-card"><div class="metric-label">技能总数</div><div class="metric-value">${catalog.length}</div><div class="metric-sub">${categories} 个类别</div></div>
        <div class="metric-card"><div class="metric-label">已分配</div><div class="metric-value">${used}</div><div class="metric-sub">至少 1 名员工掌握</div></div>
        <div class="metric-card"><div class="metric-label">未分配</div><div class="metric-value">${catalog.length - used}</div><div class="metric-sub">可从目录分配给员工</div></div>
        <div class="metric-card"><div class="metric-label">覆盖员工</div><div class="metric-value">${state.data.employees.length}</div><div class="metric-sub">全员技能档案</div></div>
      </div>
      <div class="catalog-grid">
        ${catalog
          .map((item) => {
            const people = skillEmployees(item.name);
            return `
            <div class="catalog-card">
              <div class="catalog-top"><span class="tag info">${escapeHtml(item.category || '通用')}</span><span class="catalog-count">${people.length} 人</span></div>
              <h3 class="catalog-title">${escapeHtml(item.name)}</h3>
              <p class="catalog-desc">${escapeHtml(item.description || '')}</p>
              <p class="catalog-instruction">${escapeHtml(item.instructions || '')}</p>
              <div class="catalog-people">${people.map((emp) => `<span class="catalog-person">${avatar(emp, 'sm')} ${escapeHtml(emp.name)}</span>`).join('') || '<span class="hint">尚未分配给员工</span>'}</div>
              <div class="catalog-actions">
                <button class="btn ghost small" type="button" data-action="assign-skill" data-id="${escapeHtml(item.id || item.name)}" data-name="${escapeHtml(item.name)}">分配给员工</button>
                <button class="btn ghost small" type="button" data-action="view-skill" data-id="${escapeHtml(item.id || item.name)}">查看 SKILL</button>
                <button class="btn ghost small" type="button" data-action="edit-skill" data-id="${escapeHtml(item.id || item.name)}">编辑</button>
              </div>
            </div>`;
          })
          .join('')}
      </div>
    </div>`;
}

const TOOL_META = {
  read: { label: '文件读取', category: '文件', risk: 'L0', desc: '读取工位与项目工作区文件' },
  write: { label: '文件写入', category: '文件', risk: 'L2', desc: '创建与修改文件，写前需审批' },
  'web.search': { label: '联网搜索', category: '信息', risk: 'L1', desc: '检索公开网页与资料' },
  'media.export': { label: '媒体导出', category: '内容', risk: 'L2', desc: '导出视频、字幕与封面' },
  model3d: { label: '3D 建模', category: '生产', risk: 'L2', desc: '建模、拆件与支撑生成' },
  print: { label: '打印切片', category: '生产', risk: 'L2', desc: '切片、打印与质检记录' },
  'order.read': { label: '订单查询', category: '业务', risk: 'L0', desc: '读取订单与售后数据' },
  docs: { label: '文档处理', category: '文件', risk: 'L2', desc: '整理、归档与生成文档' },
  review: { label: '审阅', category: '质量', risk: 'L0', desc: '审阅交付物与验收标准' },
  ledger: { label: '账务', category: '财务', risk: 'L1', desc: '成本归集、报价与对账' },
  'employee.admin': { label: '员工管理', category: '管理', risk: 'L3', desc: '招聘、档案与员工状态管理' },
  'skill.assign': { label: '技能分配', category: '管理', risk: 'L3', desc: '为员工分配技能与岗位能力' },
  'tool.assign': { label: '工具分配', category: '管理', risk: 'L3', desc: '为员工分配工具面' },
  'permission.request': { label: '权限申请', category: '管理', risk: 'L3', desc: '发起权限变更与审批' },
};

function toolMeta(code) {
  return TOOL_META[code] || { label: code, category: '扩展', risk: '—', desc: '自定义工具' };
}

function toolCatalog() {
  const map = new Map();
  for (const emp of state.data.employees) {
    for (const code of emp.tools || []) {
      if (!map.has(code)) map.set(code, { code, employees: [] });
      map.get(code).employees.push(emp);
    }
  }
  return [...map.values()].sort((a, b) => b.employees.length - a.employees.length || a.code.localeCompare(b.code));
}

function toolEmployees(code) {
  return state.data.employees.filter((emp) => (emp.tools || []).includes(code));
}

function renderToolsPage() {
  const catalog = Array.isArray(state.data.toolCatalog) && state.data.toolCatalog.length
    ? state.data.toolCatalog
    : toolCatalog().map((item) => {
        const meta = toolMeta(item.code);
        return {
          id: item.code,
          code: item.code,
          name: meta.label,
          category: meta.category,
          risk: meta.risk,
          kind: 'planned',
          implementation: '',
          description: meta.desc,
          employees: item.employees,
        };
      });
  const native = catalog.filter((item) => item.kind === 'native').length;
  const company = catalog.filter((item) => item.kind === 'company').length;
  const planned = catalog.filter((item) => item.kind === 'planned').length;
  const kindLabel = (kind) => (kind === 'native' ? '已接入' : kind === 'company' ? '公司内部' : '待接入');
  return `
    <div class="page">
      <div class="section-head">
        <h2>工具目录 <span class="hint">工具面按目录分配，preset 会真实加载对应能力</span></h2>
        <div class="head-actions">
          <button class="btn primary small" type="button" data-action="new-tool">新增工具</button>
        </div>
      </div>
      <div class="asset-metrics">
        <div class="metric-card"><div class="metric-label">工具总数</div><div class="metric-value">${catalog.length}</div><div class="metric-sub">${native} 个原生 / ${company} 个公司内部</div></div>
        <div class="metric-card"><div class="metric-label">已接入</div><div class="metric-value">${native + company}</div><div class="metric-sub">会进入员工预设</div></div>
        <div class="metric-card"><div class="metric-label">待接入</div><div class="metric-value">${planned}</div><div class="metric-sub">需要外部服务或脚本</div></div>
        <div class="metric-card"><div class="metric-label">已分配</div><div class="metric-value">${catalog.filter((item) => toolEmployees(item.code).length > 0).length}</div><div class="metric-sub">至少 1 名员工可用</div></div>
      </div>
      <div class="catalog-grid">
        ${catalog
          .map((item) => {
            const people = toolEmployees(item.code);
            const kind = item.kind || 'planned';
            return `
            <div class="catalog-card ${kind === 'planned' ? 'catalog-card-planned' : ''}">
              <div class="catalog-top"><span class="tag ${kind === 'native' ? 'ok' : kind === 'company' ? 'info' : 'muted'}">${kindLabel(kind)}</span><span class="catalog-count">${escapeHtml(item.risk || '—')} · ${escapeHtml(item.category || '扩展')}</span></div>
              <h3 class="catalog-title">${escapeHtml(item.name)}</h3>
              <div class="catalog-code">${escapeHtml(item.code)}</div>
              <p class="catalog-desc">${escapeHtml(item.description || '')}</p>
              <div class="catalog-implementation">${escapeHtml(item.implementation || '尚未接入实现')}</div>
              <div class="catalog-people">${people.map((emp) => `<span class="catalog-person">${avatar(emp, 'sm')} ${escapeHtml(emp.name)}</span>`).join('') || '<span class="hint">尚未分配给员工</span>'}</div>
              <div class="catalog-actions">
                <button class="btn ghost small" type="button" data-action="assign-tool" data-id="${escapeHtml(item.code)}">分配给员工</button>
                <button class="btn ghost small" type="button" data-action="edit-tool" data-id="${escapeHtml(item.code)}">编辑</button>
              </div>
            </div>`;
          })
          .join('')}
      </div>
    </div>`;
}

async function deleteDevice(id) {
  try {
    const payload = await api('/api/devices', {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id }),
    });
    if (payload.state) applyServerState(payload.state);
    render();
    showToast('设备已删除');
  } catch (error) {
    showToast(`删除设备失败：${error.message}`);
  }
}

function deviceStatusClass(status) {
  if (status === '可用') return 'ok';
  if (status === '占用') return 'info';
  if (status === '维修') return 'warn';
  if (status === '停用') return 'muted';
  return 'muted';
}

function renderDevicesPage() {
  const devices = [...(state.data.devices || [])].sort((a, b) => String(a.name).localeCompare(String(b.name), 'zh-CN'));
  const available = devices.filter((item) => item.status === '可用').length;
  return `
    <div class="page">
      <div class="section-head">
        <h2>设备 <span class="hint">${devices.length} 台 · ${available} 台可用；员工需要时通过 list_devices / read_device 提取</span></h2>
        <button class="btn primary small" type="button" data-action="new-device">新增设备</button>
      </div>
      <div class="asset-metrics">
        <div class="metric-card"><div class="metric-label">设备总数</div><div class="metric-value">${devices.length}</div><div class="metric-sub">打印机 / 服务器 / 工作站</div></div>
        <div class="metric-card"><div class="metric-label">可用</div><div class="metric-value">${available}</div><div class="metric-sub">可被员工借用</div></div>
        <div class="metric-card"><div class="metric-label">占用 / 维修</div><div class="metric-value">${devices.filter((item) => ['占用', '维修'].includes(item.status)).length}</div><div class="metric-sub">占用中或待修</div></div>
        <div class="metric-card"><div class="metric-label">类别</div><div class="metric-value">${new Set(devices.map((item) => item.category).filter(Boolean)).size}</div><div class="metric-sub">按用途分类</div></div>
      </div>
      <div class="device-grid">
        ${devices.map((item) => `
          <div class="device-card">
            <div class="device-head">
              <span class="device-icon">${escapeHtml((item.category || '设').slice(0, 1))}</span>
              <div class="device-title">
                <strong>${escapeHtml(item.name)}</strong>
                <span>${escapeHtml(item.category || '其他')} · ${escapeHtml(item.model || '型号未填')}</span>
              </div>
              <span class="tag ${deviceStatusClass(item.status)}">${escapeHtml(item.status)}</span>
            </div>
            <div class="device-meta">
              <span>位置：${escapeHtml(item.location || '未填')}</span>
              <span>负责人：${escapeHtml(item.owner || '未指定')}</span>
              ${item.serial ? `<span>序列号：${escapeHtml(item.serial)}</span>` : ''}
            </div>
            ${item.specs ? `<div class="device-specs">${escapeHtml(item.specs)}</div>` : ''}
            ${item.connection ? `<div class="device-connection">连接：${escapeHtml(item.connection)}</div>` : ''}
            <div class="device-tags">${(item.tags || []).map((tag) => `<span class="tag muted">${escapeHtml(tag)}</span>`).join('') || '<span class="hint">还没有标签</span>'}</div>
            <div class="catalog-actions">
              <button class="btn ghost small" type="button" data-action="edit-device" data-id="${escapeHtml(item.id)}">编辑</button>
              <button class="link-danger" type="button" data-action="delete-device" data-id="${escapeHtml(item.id)}">删除</button>
            </div>
          </div>`).join('') || '<div class="empty">还没有设备。点「新增设备」登记 printer、服务器、工作站、测试仪等。</div>'}
      </div>
    </div>`;
}

function expertStatusClass(status) {
  if (status === '可预约' || status === '可调用') return 'ok';
  if (status === '忙碌') return 'warn';
  return 'muted';
}

function expertPeople(expert) {
  const ids = Array.isArray(expert.employeeIds) && expert.employeeIds.length
    ? expert.employeeIds
    : expert.employeeId
      ? [expert.employeeId]
      : [];
  return ids.map((id) => employee(id)).filter(Boolean);
}

function expertProjects(expert) {
  return (expert.projectIds || []).map((id) => project(id)).filter(Boolean);
}

function renderExpertsPage() {
  const experts = state.data.experts || [];
  const internal = experts.filter((item) => item.type === '内部' || item.employeeId || (item.employeeIds || []).length).length;
  const workbuddy = experts.filter((item) => item.source === 'workbuddy').length;
  const bound = experts.filter((item) => expertPeople(item).length || expertProjects(item).length).length;
  return `
    <div class="page">
      <div class="section-head">
        <h2>专家目录 <span class="hint">可从 WorkBuddy 导入，绑定员工或项目后进入上下文</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="open-market" data-type="expert">WorkBuddy 热门 TOP10</button>
          <button class="btn ghost small" type="button" data-action="import-workbuddy-experts">从 WorkBuddy 导入</button>
          <button class="btn primary small" type="button" data-action="new-expert">新增专家</button>
        </div>
      </div>
      <div class="asset-metrics">
        <div class="metric-card"><div class="metric-label">专家总数</div><div class="metric-value">${experts.length}</div><div class="metric-sub">${internal} 位绑定员工 / ${workbuddy} 位来自 WorkBuddy</div></div>
        <div class="metric-card"><div class="metric-label">已绑定</div><div class="metric-value">${bound}</div><div class="metric-sub">绑定员工或项目</div></div>
        <div class="metric-card"><div class="metric-label">可调用</div><div class="metric-value">${experts.filter((item) => item.enabled !== false).length}</div><div class="metric-sub">启用中的专家</div></div>
        <div class="metric-card"><div class="metric-label">覆盖领域</div><div class="metric-value">${new Set(experts.map((item) => (item.domain || item.profession || '').split('/')[0].trim())).size}</div><div class="metric-sub">品牌、增长、内容、研发等</div></div>
      </div>
      <div class="expert-grid">
        ${experts
          .map((expert) => {
            const people = expertPeople(expert);
            const projects = expertProjects(expert);
            return `
          <div class="expert-card">
            <div class="expert-top">
              <span class="avatar lg" style="--c:${expert.color || '#0d9488'}">${escapeHtml((expert.name || '?').slice(0, 1))}</span>
              <div class="expert-head">
                <div class="expert-name">${escapeHtml(expert.name)}</div>
                <div class="expert-title">${escapeHtml(expert.profession || expert.title || '专家')}</div>
              </div>
              <span class="tag ${expert.source === 'workbuddy' ? 'info' : expert.type === '内部' ? 'ok' : 'muted'}">${expert.source === 'workbuddy' ? 'WorkBuddy' : escapeHtml(expert.type || '外部')}</span>
            </div>
            <div class="expert-domain">${escapeHtml(expert.domain || expert.profession || '')}</div>
            <p class="expert-bio">${escapeHtml(expert.bio || expert.description || '')}</p>
            <div class="expert-skills">${(expert.skills || []).slice(0, 8).map((skill) => `<span class="tag muted">${escapeHtml(skill)}</span>`).join('')}</div>
            <div class="expert-bindings">绑定员工：${people.map((emp) => escapeHtml(emp.name)).join('、') || '无'}　项目：${projects.map((proj) => escapeHtml(proj.name)).join('、') || '无'}</div>
            <div class="expert-foot">
              <span class="expert-rating">${expert.source === 'workbuddy' ? '本地专家包' : `★ ${escapeHtml(String(expert.rating || 0))} · ${escapeHtml(expert.rate || '内部')}`}</span>
              <span class="tag ${expertStatusClass(expert.status)}">${escapeHtml(expert.status || '可调用')}</span>
            </div>
            <div class="expert-actions">
              <button class="btn ghost small" type="button" data-action="expert-detail" data-id="${expert.id}">查看档案</button>
              <button class="btn ghost small" type="button" data-action="edit-expert" data-id="${expert.id}">编辑</button>
              <button class="btn ghost small" type="button" data-action="assign-expert" data-id="${expert.id}">绑定</button>
              ${people[0] ? `<button class="btn primary small" type="button" data-action="chat-expert" data-id="${people[0].id}">进入对话</button>` : ''}
            </div>
          </div>`;
          })
          .join('') || '<div class="empty">还没有专家，点右上角从 WorkBuddy 导入。</div>'}
      </div>
    </div>`;
}

function renderDataPage() {
  const datasets = state.data.datasets || [];
  const totalRows = datasets.reduce((sum, item) => sum + Number(item.rows || 0), 0);
  const projectCount = new Set(datasets.map((item) => item.projectId)).size;
  return `
    <div class="page">
      <div class="section-head">
        <h2>数据 <span class="hint">项目指标、订单、日志与调研样本</span></h2>
        <span class="tag muted">${datasets.length} 个数据集</span>
      </div>
      <div class="asset-metrics">
        <div class="metric-card"><div class="metric-label">数据集</div><div class="metric-value">${datasets.length}</div><div class="metric-sub">${projectCount} 个项目</div></div>
        <div class="metric-card"><div class="metric-label">总行数</div><div class="metric-value">${totalRows.toLocaleString()}</div><div class="metric-sub">按当前登记口径</div></div>
        <div class="metric-card"><div class="metric-label">最近更新</div><div class="metric-value" style="font-size:16px">${escapeHtml(formatDateTime(datasets[0]?.updatedAt))}</div><div class="metric-sub">${escapeHtml(datasets[0]?.name || '—')}</div></div>
        <div class="metric-card"><div class="metric-label">数据来源</div><div class="metric-value">${new Set(datasets.map((item) => item.source)).size}</div><div class="metric-sub">平台导出与人工整理</div></div>
      </div>
      <div class="asset-table-wrap">
        <table class="asset-table">
          <thead><tr><th>数据集</th><th>类型</th><th>所属项目</th><th>行数</th><th>大小</th><th>来源</th><th>更新</th><th></th></tr></thead>
          <tbody>
            ${datasets
              .map((item) => {
                const proj = project(item.projectId);
                return `<tr>
                  <td><div class="asset-name">${escapeHtml(item.name)}</div><div class="asset-sub">${escapeHtml(item.description)}</div></td>
                  <td><span class="tag muted">${escapeHtml(item.type)}</span></td>
                  <td>${escapeHtml(proj?.name || '公司级')}</td>
                  <td>${Number(item.rows || 0).toLocaleString()}</td>
                  <td>${escapeHtml(item.size)}</td>
                  <td>${escapeHtml(item.source)}</td>
                  <td>${escapeHtml(formatDateTime(item.updatedAt))}</td>
                  <td><button class="btn ghost small" type="button" data-action="dataset-fields" data-id="${item.id}">字段</button></td>
                </tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderProjectFilesPage() {
  if (!state.projectFiles) {
    if (!state.projectFilesLoading) {
      state.projectFilesLoading = true;
      setTimeout(loadProjectFiles, 0);
    }
    return '<div class="page"><div class="empty">正在扫描项目工作区…</div></div>';
  }
  const projects = state.projectFiles;
  const totalFiles = projects.reduce((sum, item) => sum + item.fileCount, 0);
  const totalSize = projects.reduce((sum, item) => sum + item.totalSize, 0);
  return `
    <div class="page">
      <div class="section-head">
        <h2>项目文件 <span class="hint">每个项目工作区的真实文件</span></h2>
        <div class="head-actions"><span class="tag muted">${totalFiles} 个文件 · ${formatBytes(totalSize)}</span><button class="btn ghost small" type="button" data-action="refresh-project-files">刷新</button></div>
      </div>
      <div class="project-file-groups">
        ${projects
          .map(
            (item) => `
          <section class="project-file-group">
            <div class="pf-head">
              <div>
                <div class="pf-title">${escapeHtml(item.name)} <span class="type ${typeClass(item.type)}">${escapeHtml(item.type)}</span></div>
                <div class="pf-path">${escapeHtml(item.workspacePath)}</div>
              </div>
              <span class="tag muted">${item.fileCount} 个文件 · ${formatBytes(item.totalSize)}</span>
            </div>
            ${
              item.files.length
                ? `<div class="pf-files">${item.files
                    .map(
                      (file) => `<div class="pf-file">
                        <span class="pf-ext">${escapeHtml((file.name.split('.').pop() || 'file').slice(0, 4).toUpperCase())}</span>
                        <span class="pf-name" title="${escapeHtml(file.path)}">${escapeHtml(file.path)}</span>
                        <span class="pf-size">${formatBytes(file.size)}</span>
                        <span class="pf-time">${escapeHtml(formatDateTime(file.updatedAt))}</span>
                      </div>`,
                    )
                    .join('')}</div>`
                : '<div class="empty small">项目工作区里还没有文件。员工在项目群干活时会写到这里。</div>'
            }
          </section>`,
          )
          .join('')}
      </div>
    </div>`;
}

async function loadProjectFiles() {
  state.projectFilesLoading = true;
  try {
    const payload = await api('/api/project-files');
    state.projectFiles = payload.projects || [];
  } catch (error) {
    state.projectFiles = [];
    showToast(`扫描项目文件失败：${error.message}`);
  } finally {
    state.projectFilesLoading = false;
    if (state.view === 'projectfiles') render();
  }
}

/* ---------------- inbox ---------------- */

function renderInboxPage() {
  const unresolved = state.data.decisions.filter(decisionPending);
  const approvals = (state.data.approvals || []).filter((item) => item.status === 'pending');
  return `
    <div class="page">
      <div class="section-head">
        <h2>收件箱 <span class="hint">只放需要你拍板的事</span></h2>
        <span class="tag ${unresolved.length || approvals.length ? 'warn' : 'ok'}">${unresolved.length + approvals.length ? `${unresolved.length + approvals.length} 件待处理` : '已清空'}</span>
      </div>
      ${
        approvals.length
          ? `<div class="section-head"><h2>写操作审批 <span class="hint">员工写文件前会停在这里</span></h2></div>
             <div class="approval-list">${approvals.map(renderApprovalCard).join('')}</div>`
          : ''
      }
      <div class="section-head" style="margin-top:${approvals.length ? '22px' : '0'}"><h2>业务决策</h2></div>
      <div class="decision-grid">
        ${
          unresolved.length
            ? unresolved.map(renderDecisionCard).join('')
            : '<div class="empty">今天没有待拍板的业务决策。可以去交付物里看看进度。</div>'
        }
      </div>
    </div>`;
}

function renderApprovalCard(approval) {
  const emp = employee(approval.employeeId);
  const proj = project(approval.projectId);
  const levelClass = approval.level === 1 ? 'info' : approval.level === 3 ? 'danger' : 'warn';
  const isOutbound = approval.kind === 'outbound';
  const title = isOutbound
    ? `${emp?.name || approval.employeeName || '员工'} 请求外部动作`
    : `${emp?.name || approval.employeeName || '员工'} 请求 ${approval.toolName}`;
  const meta = isOutbound
    ? `${proj?.name || approval.projectName || '未关联项目'} · ${approval.channel || ''} → ${approval.recipient || ''}`
    : `${proj?.name || approval.projectName || '未关联项目'}${approval.filePath ? ` · ${approval.filePath}` : ''}${approval.policyVersion ? ` · 策略 v${approval.policyVersion}` : ''}`;
  return `
    <div class="approval-card">
      <div class="dc-top">
        <span class="tag ${levelClass}">${escapeHtml(approval.levelLabel || '写操作')}</span>
        <span class="dc-deadline">${escapeHtml(new Date(approval.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))}</span>
      </div>
      <h3 class="dc-title">${escapeHtml(title)}</h3>
      <div class="dc-meta">${escapeHtml(meta)}</div>
      ${approval.risk ? `<div class="dc-impact" title="风险：${escapeHtml({ low: '低', medium: '中', high: '高', critical: '红线' }[approval.risk] || approval.risk)} · ${escapeHtml((approval.riskReasons || []).join('；') || '规则判断')}">风险：<strong>${escapeHtml({ low: '低', medium: '中', high: '高', critical: '红线' }[approval.risk] || approval.risk)}</strong> · ${escapeHtml((approval.riskReasons || []).join('；') || '规则判断')}</div>` : ''}
      <pre class="approval-detail">${escapeHtml(approval.detail || '无参数预览')}</pre>
      ${
        approval.source === 'auto-review'
          ? `<div class="dc-impact">Auto review：<strong>AI 审查未放行</strong> · 风险 ${escapeHtml(approval.risk || 'medium')}${approval.aiReview?.reason ? ` · ${escapeHtml(approval.aiReview.reason)}` : ''}</div>`
          : approval.source === 'red-line'
            ? `<div class="dc-impact" title="红线拦截：${escapeHtml((approval.riskReasons || [])[0] || '命中确定性红线')}">红线拦截：<strong>${escapeHtml((approval.riskReasons || [])[0] || '命中确定性红线')}</strong></div>`
            : approval.source === 'runtime'
              ? `<div class="dc-impact" title="运行时审批：${escapeHtml((approval.riskReasons || [])[0] || 'DSH 请求额外权限')}">运行时审批：<strong>${escapeHtml((approval.riskReasons || [])[0] || 'DSH 请求额外权限')}</strong></div>`
              : approval.aiReview
                ? `<div class="dc-impact">AI 预审：<strong>${approval.aiReview.decision === 'allow' ? '建议放行' : '建议人工确认'}</strong> · 风险 ${escapeHtml(approval.aiReview.risk || 'unknown')} · ${escapeHtml(approval.aiReview.reason || '')}</div>`
                : ''
      }
      <div class="dc-impact">${isOutbound ? `本地 outbox 回执：批准后生成` : `写前快照：${escapeHtml(approval.snapshotId || '无快照')}`}</div>
      ${
        isOutbound
          ? ''
          : `<label class="settings-check approval-similar"><input type="checkbox" data-approval-similar="${approval.id}" /> 本会话内该文件不再询问（30 分钟）</label>`
      }
      <div class="dc-actions">
        <button class="btn primary small" type="button" data-action="approve-write" data-id="${approval.id}">${isOutbound ? '批准外发' : '批准写入'}</button>
        <button class="btn ghost small" type="button" data-action="reject-write" data-id="${approval.id}">拒绝</button>
      </div>
    </div>`;
}

function renderDecisionCard(decision) {
  const owner = employee(decision.owner);
  const proj = project(decision.project);
  return `
    <div class="decision-card">
      <div class="dc-top">
        <span class="tag warn">待决策</span>
        <span class="dc-deadline">${escapeHtml(decision.deadline)} 截止</span>
      </div>
      <h3 class="dc-title">${escapeHtml(decision.title)}</h3>
      <div class="dc-meta">${escapeHtml(owner?.name || '')} · ${escapeHtml(proj?.name || '')}</div>
      <div class="dc-context">${escapeHtml(decision.background)}</div>
      <div class="options" data-decision-options="${escapeHtml(decision.id)}">
        ${decision.options
          .map(
            (option) => `
          <label class="option selectable ${option.recommended ? 'recommended' : ''}" data-option-key="${escapeHtml(option.key)}">
            <input type="radio" name="decision-${escapeHtml(decision.id)}" value="${escapeHtml(option.key)}" ${option.recommended ? 'checked' : ''} />
            <span class="option-key">${escapeHtml(option.key)}</span>
            <span class="option-label">${escapeHtml(option.label)}</span>
            <span class="option-note">${escapeHtml(option.note)}</span>
            ${option.recommended ? '<span class="option-badge">推荐</span>' : ''}
          </label>`
          )
          .join('')}
      </div>
      <div class="dc-hint">可以点选任意选项，不一定要用推荐项。</div>
      <div class="dc-recommendation">建议：${escapeHtml(decision.recommendation)}</div>
      <div class="dc-impact">影响：${escapeHtml(decision.impact)}</div>
      <div class="dc-actions">
        <button class="btn ghost small" type="button" data-action="resolve-decision" data-id="${decision.id}" data-result="reject">让员工补充</button>
        <button class="btn primary small" type="button" data-action="resolve-decision" data-id="${decision.id}" data-result="approve">确认选择</button>
      </div>
    </div>`;
}

/* ---------------- projects ---------------- */

function renderProjectsPage() {
  const all = state.data.projects || [];
  const active = all.filter((item) => !item.archived);
  const archived = all.filter((item) => item.archived);
  const list = state.projectShowArchived ? archived : active;
  return `
    <div class="page">
      <div class="section-head">
        <h2>项目 <span class="hint">${active.length} 个进行中${archived.length ? ` · ${archived.length} 个已归档` : ''}</span></h2>
        <div class="head-actions">
          <div class="tab-switch">
            <button class="tab-btn ${!state.projectShowArchived ? 'active' : ''}" type="button" data-action="project-archive-filter" data-value="active">进行中 ${active.length}</button>
            <button class="tab-btn ${state.projectShowArchived ? 'active' : ''}" type="button" data-action="project-archive-filter" data-value="archived">已归档 ${archived.length}</button>
          </div>
          <button class="btn ghost small" type="button" data-action="company-audit">公司体检</button>
          <button class="btn primary small" type="button" data-action="new-project">新建项目</button>
        </div>
      </div>
      <div class="project-grid">
        ${list.map(renderProjectCard).join('') || `<div class="empty">${state.projectShowArchived ? '还没有归档项目。' : '还没有项目，先建一个。'}</div>`}
      </div>
    </div>`;
}

function renderProjectCard(item) {
  const team = item.team.map(employee).filter(Boolean);
  const budget = Number(item.budget || 0);
  const spent = (state.data.usage || [])
    .filter((row) => row.projectId === item.id)
    .reduce((sum, row) => sum + Number(row.cost || 0), 0);
  const ratio = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const over = budget > 0 && spent / budget >= Number(item.budgetWarning || 80) / 100;
  return `
    <div class="project-card ${item.archived ? 'archived' : ''}" data-action="open-project" data-id="${item.id}" style="--project-color:${item.color}">
      <div class="pc-top">
        <span class="type ${typeClass(item.type)}">${escapeHtml(item.type)}</span>
        ${item.archived ? '<span class="tag muted">已归档</span>' : ''}
        <span class="status-pill"><span class="status-dot ${item.status === '进行中' ? 'status-working' : 'status-idle'}"></span>${escapeHtml(item.status)}</span>
      </div>
      <h3 class="pc-title">${escapeHtml(item.name)}</h3>
      <p class="pc-desc">${escapeHtml(item.desc)}</p>
      <div class="pc-workspace" title="${escapeHtml(item.workspacePath || '')}">工作区：${escapeHtml(shortPath(item.workspacePath || '未绑定'))}</div>
      ${
        budget > 0
          ? `<div class="budget-row ${over ? 'over' : ''}"><span>预算 ${money(spent)} / ¥${budget.toFixed(0)}</span><span>${Math.round((spent / budget) * 100)}%</span></div><div class="budget-bar ${over ? 'over' : ''}"><span style="width:${ratio}%"></span></div>`
          : ''
      }
      <div class="progress"><span style="width:${item.progress}%"></span></div>
      <div class="pc-foot">
        <div class="avatar-stack">${team.map((person) => avatar(person, 'sm')).join('')}</div>
        <span><span class="progress-num">${item.progress}%</span> · ${escapeHtml(item.due)} 到期</span>
      </div>
      <div class="pc-actions">
        ${item.archived
          ? `<button type="button" data-action="unarchive-project" data-id="${item.id}">恢复项目</button>
             <button type="button" data-action="delete-project" data-id="${item.id}">删除项目</button>`
          : `<button type="button" data-action="project-snapshot" data-id="${item.id}">快照</button>
             <button type="button" data-action="project-snapshots" data-id="${item.id}">历史</button>
             <button type="button" data-action="edit-project" data-id="${item.id}">目录</button>
             <button type="button" data-action="open-outbound" data-id="${item.id}">外发</button>
             <button type="button" data-action="archive-project" data-id="${item.id}">归档</button>`}
      </div>
    </div>`;
}

/* ---------------- project detail ---------------- */

const PROJECT_LINKS = [
  { key: 'web', label: '前端', hint: '用户访问的网站' },
  { key: 'api', label: '后端 / API', hint: '接口服务地址' },
  { key: 'db', label: '数据库', hint: '数据库管理台' },
  { key: 'admin', label: '管理后台', hint: '后台管理系统' },
  { key: 'repo', label: '代码仓库', hint: 'GitHub / Gitee' },
  { key: 'deploy', label: '部署平台', hint: 'Vercel / 服务器面板' },
  { key: 'payment', label: '收款后台', hint: '支付 / 订阅管理' },
  { key: 'analytics', label: '数据统计', hint: '流量 / 用户分析' },
  { key: 'docs', label: '文档', hint: '需求 / 接口文档' },
  { key: 'design', label: '设计稿', hint: 'Figma / 蓝湖' },
];

function projectMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function projectLastMonths(count = 12) {
  const list = [];
  const now = new Date();
  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    list.push({
      key: projectMonthKey(date),
      label: `${date.getMonth() + 1}月`,
    });
  }
  return list;
}

function projectRevenueForMonth(project, monthKey) {
  return (project.revenue || [])
    .filter((item) => String(item.date || '').startsWith(monthKey))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function projectTotalRevenue(project) {
  return (project.revenue || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function projectManualMonthlyCost(project) {
  return (project.costs || []).reduce((sum, item) => {
    const amount = Number(item.amount || 0);
    if (item.cycle === '年') return sum + amount / 12;
    if (item.cycle === '一次性') return sum + amount;
    return sum + amount;
  }, 0);
}

function projectModelCostForMonth(project, monthKey) {
  return (state.data.usage || [])
    .filter((item) => item.projectId === project.id && String(item.time || '').startsWith(monthKey))
    .reduce((sum, item) => sum + Number(item.cost || 0), 0);
}

function projectCostForMonth(project, monthKey) {
  return projectManualMonthlyCost(project) + projectModelCostForMonth(project, monthKey);
}

function projectPendingTasks(projectId) {
  return (state.data.tasks || [])
    .filter((task) => task.project === projectId && !task.archived && task.status !== '已完成')
    .sort((a, b) => String(a.dueAt || a.due || '').localeCompare(String(b.dueAt || b.due || '')));
}

function projectHealthLabel(status) {
  return { ok: '正常', warn: '变慢', down: '无法连接', unknown: '待检测' }[status] || '待检测';
}

function projectHealthClass(status) {
  return { ok: 'ok', warn: 'warn', down: 'danger', unknown: 'muted' }[status] || 'muted';
}

function renderProjectRevenueChart(project) {
  const months = projectLastMonths(12);
  const values = months.map((month) => projectRevenueForMonth(project, month.key));
  const max = Math.max(1, ...values.map((value) => Math.max(0, value)));
  return `<div class="pd-chart">
    ${months
      .map((month, index) => {
        const value = values[index];
        return `<div class="pd-chart-col" title="${month.key}：${money(value)}">
          <span class="pd-chart-value">${value ? money(value) : ''}</span>
          <div class="pd-chart-bar-wrap"><span class="pd-chart-bar" style="height:${Math.max(2, (Math.max(0, value) / max) * 100)}%"></span></div>
          <span class="pd-chart-label">${month.label}</span>
        </div>`;
      })
      .join('')}
  </div>`;
}

function projectLinkChips(project, limit = 4) {
  const links = PROJECT_LINKS.filter((link) => project.links?.[link.key]).slice(0, limit);
  return links.length
    ? links.map((link) => `<button class="tag info pd-link-chip" type="button" data-action="open-project-link" data-url="${escapeHtml(project.links[link.key])}">${link.label}</button>`).join('')
    : '<span class="hint">还没有填写快捷入口</span>';
}

function renderProjectDetailPage() {
  const proj = project(state.projectDetailId);
  if (!proj) {
    return '<div class="page"><div class="empty">项目不存在或已删除。<button class="link-btn" type="button" data-action="back-projects">返回项目</button></div></div>';
  }
  const tabs = [
    ['overview', '概览'],
    ['workflow', '工作流'],
    ['links', '快捷入口'],
    ['money', '收支'],
    ['ms', '里程碑与发版'],
    ['ops', '运维'],
    ['docs', '资料证书'],
    ['notes', '笔记'],
  ];
  const activeTab = tabs.some(([key]) => key === state.projectTab) ? state.projectTab : 'overview';
  return `
    <div class="page project-detail-page">
      <div class="pd-head">
        <button class="btn ghost small" type="button" data-action="back-projects">← 项目</button>
        <div class="pd-title">
          <h2>${escapeHtml(proj.name)} <span class="tag ${proj.archived ? 'muted' : 'ok'}">${escapeHtml(proj.archived ? '已归档' : proj.status)}</span></h2>
          <div class="pd-sub">${escapeHtml(proj.type)} · ${escapeHtml(proj.version || 'v0.1.0')} · ${escapeHtml(proj.due || '待定')} 到期</div>
        </div>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="open-project-chat" data-id="${proj.id}">项目群</button>
          <button class="btn ghost small" type="button" data-action="edit-project" data-id="${proj.id}">编辑项目</button>
        </div>
      </div>
      <div class="pd-tabs">
        ${tabs.map(([key, label]) => `<button class="pd-tab ${activeTab === key ? 'active' : ''}" type="button" data-action="project-tab" data-tab="${key}">${label}</button>`).join('')}
      </div>
      <div class="pd-body">${renderProjectTabBody(proj, activeTab)}</div>
    </div>`;
}

function projectDocDeliverables(projId) {
  const list = (state.data.deliverables || [])
    .filter((item) => item.project === projId && !item.archived)
    .sort((a, b) => String(b.submittedAt || b.time || '').localeCompare(String(a.submittedAt || a.time || '')));
  const plan = list.find((item) => /方案|计划书|计划|立项|需求与方案|规划/.test(item.name || ''));
  const info = list.find((item) => /项目信息|项目总览|总览|交付说明|验收报告|运维手册|项目说明/.test(item.name || ''));
  return { plan, info };
}

function renderProjectTabBody(proj, tab) {
  const month = projectMonthKey();
  if (tab === 'overview') {
    const revenue = projectRevenueForMonth(proj, month);
    const months = projectLastMonths(12);
    const last12 = months.reduce((sum, item) => sum + projectRevenueForMonth(proj, item.key), 0);
    const cost = projectCostForMonth(proj, month);
    const pending = projectPendingTasks(proj.id);
    return `
      <div class="pd-kpis">
        <div class="pd-kpi"><span>本月收入</span><strong>${money(revenue)}</strong><small>近 12 个月 ${money(last12)}</small></div>
        <div class="pd-kpi"><span>本月成本</span><strong>${money(cost)}</strong><small>模型 ${money(projectModelCostForMonth(proj, month))} · 订阅 ${money(projectManualMonthlyCost(proj))}</small></div>
        <div class="pd-kpi"><span>${proj.status === '进行中' ? '开发进度' : '用户数'}</span><strong>${proj.status === '进行中' ? `${Number(proj.progress) || 0}%` : Number(proj.users || 0).toLocaleString()}</strong><small>${escapeHtml(proj.version || 'v0.1.0')}</small></div>
        <div class="pd-kpi"><span>合同金额</span><strong>${proj.contractAmount ? money(proj.contractAmount) : '—'}</strong><small>${proj.contractAmount ? `已收 ${money(projectTotalRevenue(proj))}` : '未设置'}</small></div>
      </div>
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>月收入</strong><span class="hint">近 12 个月，含退款</span></div>
        ${renderProjectRevenueChart(proj)}
      </div>
      <div class="pd-grid-2">
        <div class="pd-panel">
          <div class="pd-panel-head"><strong>项目信息</strong></div>
          <div class="pd-info-row"><span>简介</span><div>${escapeHtml(proj.desc || '还没写简介')}</div></div>
          <div class="pd-info-row"><span>技术栈</span><div>${(proj.techStack || []).map((item) => `<span class="tag muted">${escapeHtml(item)}</span>`).join('') || '<span class="hint">未填写</span>'}</div></div>
          <div class="pd-info-row"><span>快捷入口</span><div>${projectLinkChips(proj, 6)}</div></div>
          <div class="pd-info-row"><span>项目方案</span><div>${(() => {
            const docs = projectDocDeliverables(proj.id);
            return docs.plan
              ? `<button class="link-btn" type="button" data-action="preview-deliverable" data-id="${docs.plan.id}">${escapeHtml(docs.plan.name)}</button> <span class="tag ok">已产出</span>`
              : `<span class="hint">还没有计划书</span> <button class="btn ghost small" type="button" data-action="project-doc-task" data-kind="plan" data-id="${proj.id}">让秘书出方案</button>`;
          })()}</div></div>
          <div class="pd-info-row"><span>项目信息</span><div>${(() => {
            const docs = projectDocDeliverables(proj.id);
            return docs.info
              ? `<button class="link-btn" type="button" data-action="preview-deliverable" data-id="${docs.info.id}">${escapeHtml(docs.info.name)}</button> <span class="tag ok">已整理</span>`
              : `<span class="hint">开发完成后整理项目信息</span> <button class="btn ghost small" type="button" data-action="project-doc-task" data-kind="info" data-id="${proj.id}">让秘书整理</button>`;
          })()}</div></div>
        </div>
        <div class="pd-panel">
          <div class="pd-panel-head"><strong>待办任务</strong><span class="hint">${pending.length} 个</span></div>
          ${pending.length ? pending.slice(0, 8).map((task) => `<div class="pd-task-row"><button class="task-check" type="button" data-action="toggle-task" data-id="${task.id}" title="完成">✓</button><span class="grow">${escapeHtml(task.title)}</span><span class="tag ${task.status === '进行中' ? 'warn' : 'muted'}">${escapeHtml(task.status)}</span></div>`).join('') : '<div class="empty small">没有待办任务</div>'}
        </div>
      </div>`;
  }

  if (tab === 'workflow') {
    const statuses = ['待办', '进行中', '待验收', '已完成'];
    const tasks = (state.data.tasks || []).filter((task) => task.project === proj.id && !task.archived);
    const deliverables = (state.data.deliverables || []).filter((item) => item.project === proj.id && !item.archived);
    return `
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>项目工作流</strong><span class="hint">按任务状态查看；点任务卡片打开详情</span></div>
        <div class="pd-workflow">
          ${statuses.map((status) => `<div class="pd-workflow-col"><div class="pd-workflow-head">${status}<span>${tasks.filter((task) => task.status === status).length}</span></div>${tasks.filter((task) => task.status === status).map((task) => `<button class="pd-workflow-card" type="button" data-action="edit-task" data-id="${task.id}"><strong>${escapeHtml(task.title)}</strong><span>${escapeHtml(employee(task.assignee)?.name || '未分配')} · ${escapeHtml(task.priority || '中')}</span></button>`).join('') || '<div class="hint">空</div>'}</div>`).join('')}
        </div>
      </div>
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>最近交付物</strong><span class="hint">${deliverables.length} 个</span></div>
        ${deliverables.length ? `<div class="pd-table-wrap"><table class="pd-table"><thead><tr><th>名称</th><th>版本</th><th>状态</th><th>负责人</th></tr></thead><tbody>${deliverables.slice(0, 10).map((item) => `<tr><td><button class="link-btn" type="button" data-action="preview-deliverable" data-id="${item.id}">${escapeHtml(item.name)}</button></td><td>v${Number(item.version) || 1}</td><td>${escapeHtml(item.status)}</td><td>${escapeHtml(employee(item.owner)?.name || '')}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty small">还没有交付物</div>'}
      </div>`;
  }

  if (tab === 'links') {
    return `
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>快捷入口</strong><span class="hint">点击打开，悬停可复制地址；未填写的入口点一下去编辑</span></div>
        <div class="pd-links">
          ${PROJECT_LINKS.map((link) => {
            const url = proj.links?.[link.key] || '';
            return `<div class="pd-link-card ${url ? '' : 'empty'}" ${url ? `data-action="open-project-link" data-url="${escapeHtml(url)}"` : `data-action="edit-project" data-id="${proj.id}"`}>
              <span class="pd-link-mark">${escapeHtml(link.label.slice(0, 1))}</span>
              <div class="pd-link-main"><strong>${link.label}</strong><small>${url ? escapeHtml(url.replace(/^https?:\/\//, '').slice(0, 50)) : `${link.hint} · 点击填写`}</small></div>
              ${url ? `<button class="pd-link-copy" type="button" data-action="copy-project-link" data-url="${escapeHtml(url)}" title="复制地址">复制</button>` : ''}
            </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  if (tab === 'money') {
    const revenueRows = [...(proj.revenue || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const costRows = [...(proj.costs || [])];
    const total = projectTotalRevenue(proj);
    return `
      <div class="pd-kpis">
        <div class="pd-kpi"><span>累计收入</span><strong>${money(total)}</strong><small>${revenueRows.length} 笔记录</small></div>
        <div class="pd-kpi"><span>本月收入</span><strong>${money(projectRevenueForMonth(proj, month))}</strong><small>${month}</small></div>
        <div class="pd-kpi"><span>月固定成本</span><strong>${money(projectManualMonthlyCost(proj))}</strong><small>${costRows.length} 项成本</small></div>
        <div class="pd-kpi"><span>本月模型成本</span><strong>${money(projectModelCostForMonth(proj, month))}</strong><small>按 projectId 归集</small></div>
      </div>
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>收入记录</strong><button class="btn primary small" type="button" data-action="project-revenue-new" data-id="${proj.id}">＋ 记一笔收入</button></div>
        ${revenueRows.length ? `<div class="pd-table-wrap"><table class="pd-table"><thead><tr><th>日期</th><th>类型</th><th>渠道</th><th class="r">金额</th><th>备注</th><th></th></tr></thead><tbody>${revenueRows.map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.channel || '—')}</td><td class="r ${item.amount < 0 ? 'danger-text' : ''}">${money(item.amount)}</td><td>${escapeHtml(item.note || '')}</td><td><button class="link-danger" type="button" data-action="project-revenue-delete" data-id="${item.id}">删除</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty small">还没有收入记录</div>'}
      </div>
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>成本与订阅</strong><button class="btn ghost small" type="button" data-action="project-cost-new" data-id="${proj.id}">＋ 添加成本</button></div>
        ${costRows.length ? `<div class="pd-table-wrap"><table class="pd-table"><thead><tr><th>名称</th><th>类别</th><th class="r">金额</th><th>周期</th><th>下次续费</th><th></th></tr></thead><tbody>${costRows.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.category)}</td><td class="r">${money(item.amount)}</td><td>${escapeHtml(item.cycle)}</td><td>${item.renew ? escapeHtml(item.renew) : '—'} ${item.renew && item.cycle !== '一次性' ? `<button class="link-btn" type="button" data-action="project-cost-renew" data-id="${item.id}">已续费</button>` : ''}</td><td><button class="link-danger" type="button" data-action="project-cost-delete" data-id="${item.id}">删除</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty small">还没有成本记录</div>'}
      </div>`;
  }

  if (tab === 'ms') {
    const milestones = [...(proj.milestones || [])].sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const releases = [...(proj.releases || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    return `
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>里程碑</strong><span class="hint">打勾即完成</span></div>
        ${milestones.length ? milestones.map((item) => `<div class="pd-ms-row ${item.done ? 'done' : ''}"><button class="pd-tick ${item.done ? 'on' : ''}" type="button" data-action="project-milestone-toggle" data-id="${item.id}">✓</button><span class="grow">${escapeHtml(item.name)}</span><span class="hint">${escapeHtml(item.date || '')}</span><button class="link-danger" type="button" data-action="project-milestone-delete" data-id="${item.id}">删除</button></div>`).join('') : '<div class="empty small">还没有里程碑</div>'}
        <div class="pd-inline-form"><input id="project-ms-name" placeholder="例如：v2.0 上线 / 收二期款" /><input id="project-ms-date" type="date" /><button class="btn primary small" type="button" data-action="project-milestone-add" data-id="${proj.id}">添加</button></div>
      </div>
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>发版记录</strong><button class="btn ghost small" type="button" data-action="project-release-new" data-id="${proj.id}">＋ 记录发版</button></div>
        ${releases.length ? `<div class="pd-timeline">${releases.map((item) => `<div class="pd-timeline-item"><div class="pd-timeline-top"><strong>${escapeHtml(item.version)}</strong><span class="tag ${item.env === '生产' ? 'ok' : 'muted'}">${escapeHtml(item.env)}</span><span class="hint">${escapeHtml(item.date)}</span><button class="link-danger" type="button" data-action="project-release-delete" data-id="${item.id}">删除</button></div><div class="hint">${escapeHtml(item.note || '')}</div></div>`).join('')}</div>` : '<div class="empty small">还没有发版记录；发到「生产」会自动更新当前版本</div>'}
      </div>`;
  }

  if (tab === 'ops') {
    return `
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>服务状态</strong><button class="btn primary small" type="button" data-action="project-check" data-id="${proj.id}">立即检测</button></div>
        <div class="pd-ops-grid">
          ${['web', 'api'].map((kind) => {
            const url = proj.links?.[kind] || '';
            const health = proj.health?.[kind] || {};
            const history = Array.isArray(health.history) ? health.history.slice(-30) : [];
            return `<div class="pd-ops-card">
              <div class="pd-ops-head"><strong>${kind === 'web' ? '前端' : '后端 / API'}</strong><span class="tag ${projectHealthClass(health.status)}">${projectHealthLabel(health.status)}</span></div>
              <div class="hint">${url ? escapeHtml(url) : '未填写地址'}</div>
              <div class="pd-ops-meta"><span>最近：${health.checkedAt ? escapeHtml(formatDateTime(health.checkedAt)) : '—'}</span><span>${health.latency ? `${health.latency}ms` : '—'}</span></div>
              <div class="pd-health-history">${history.length ? history.map((item) => `<i class="${item.status === 'ok' ? 'ok' : item.status === 'warn' ? 'warn' : 'down'}" title="${escapeHtml(item.at || '')} · ${projectHealthLabel(item.status)} · ${Number(item.latency) || 0}ms"></i>`).join('') : '<span class="hint">还没有检测记录</span>'}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>到期与续费</strong></div>
        ${(proj.costs || []).filter((item) => item.renew).length ? `<div class="pd-table-wrap"><table class="pd-table"><tbody>${proj.costs.filter((item) => item.renew).sort((a, b) => String(a.renew).localeCompare(String(b.renew))).map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.category)}</td><td>${escapeHtml(item.renew)}</td><td class="r"><button class="link-btn" type="button" data-action="project-cost-renew" data-id="${item.id}">已续费</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty small">还没有填写续费日期</div>'}
      </div>`;
  }

  if (tab === 'docs') {
    const assets = [...(proj.assets || [])].sort((a, b) => String(a.expire || '9999').localeCompare(String(b.expire || '9999')));
    return `
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>资料证书</strong><button class="btn primary small" type="button" data-action="project-asset-new" data-id="${proj.id}">＋ 添加资料</button></div>
        ${assets.length ? `<div class="pd-table-wrap"><table class="pd-table"><thead><tr><th>名称</th><th>分类</th><th>编号 / 账号</th><th>到期</th><th></th></tr></thead><tbody>${assets.map((item) => `<tr><td>${escapeHtml(item.name)}<div class="hint">${escapeHtml(item.note || '')}</div></td><td>${escapeHtml(item.category)}</td><td>${escapeHtml(item.no || '—')}</td><td>${escapeHtml(item.expire || '长期')}</td><td><button class="link-danger" type="button" data-action="project-asset-delete" data-id="${item.id}">删除</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty small">还没有证书、合同或账号资料</div>'}
        <div class="hint">只记录编号 / 账号和资料位置，不要把密码或私钥正文写在这里。</div>
      </div>`;
  }

  return `
    <div class="pd-panel">
      <div class="pd-panel-head"><strong>项目笔记</strong><span class="hint">自动保存；常用命令、服务器信息、踩坑记录</span></div>
      <textarea id="project-notes" class="pd-notes" placeholder="常用命令、服务器信息、踩坑记录、客户沟通要点……">${escapeHtml(proj.notes || '')}</textarea>
      <div class="hint" id="project-notes-status">自动保存</div>
    </div>`;
}

async function openCompanyAudit(scope = state.companyAuditScope || 'all') {
  try {
    state.companyAuditScope = ['project', 'company', 'all'].includes(scope) ? scope : 'all';
    state.companyAudit = await api(`/api/company/audit?scope=${encodeURIComponent(state.companyAuditScope)}`);
    openModal('company-audit');
  } catch (error) {
    showToast(`公司体检失败：${error.message}`);
  }
}

function renderProjectDetailRefresh() {
  render();
}

async function projectDetailAction(_projectId, action, payload = {}) {
  const projectId = state.projectDetailId;
  if (!projectId) return;
  try {
    const result = await api('/api/projects/detail', {
      method: 'POST',
      body: JSON.stringify({ projectId, action, ...payload }),
    });
    if (result.state) applyServerState(result.state);
    render();
  } catch (error) {
    showToast(`项目操作失败：${error.message}`);
  }
}

async function checkProjectHealth(_projectId) {
  const projectId = state.projectDetailId;
  try {
    const result = await api('/api/projects/detail', {
      method: 'POST',
      body: JSON.stringify({ projectId, action: 'check' }),
    });
    if (result.state) applyServerState(result.state);
    render();
    const parts = Object.entries(result.result || {}).map(([kind, value]) => `${kind === 'web' ? '前端' : '后端'} ${projectHealthLabel(value.status)} ${value.latency}ms`);
    showToast(parts.length ? parts.join(' · ') : '项目还没有填写前端/后端地址');
  } catch (error) {
    showToast(`检测失败：${error.message}`);
  }
}

/* ---------------- employees ---------------- */

function renderEmployeesPage() {
  const active = state.data.employees.filter((emp) => !emp.archived);
  const archived = state.data.employees.filter((emp) => emp.archived);
  const list = state.employeeShowArchived ? archived : active;
  return `
    <div class="page">
      <div class="section-head">
        <h2>员工 <span class="hint">${active.length} 名在职 AI 员工${archived.length ? ` · ${archived.length} 名已归档` : ''}</span></h2>
        <div class="head-actions">
          <div class="tab-switch">
            <button class="tab-btn ${!state.employeeShowArchived ? 'active' : ''}" type="button" data-action="employee-archive-filter" data-value="active">在职 ${active.length}</button>
            <button class="tab-btn ${state.employeeShowArchived ? 'active' : ''}" type="button" data-action="employee-archive-filter" data-value="archived">已归档 ${archived.length}</button>
          </div>
          <button class="btn ghost small" type="button" data-action="new-employee">手动招聘</button>
          <button class="btn primary small" type="button" data-action="hire-employee">按岗位模板招聘</button>
        </div>
      </div>
      <div class="employee-grid">
        ${list.map(renderEmployeeCard).join('') || `<div class="empty">${state.employeeShowArchived ? '还没有归档员工。' : '还没有员工，先招一个。'}</div>`}
      </div>
    </div>`;
}

function renderEmployeeCard(emp) {
  const live = employeeLiveStatus(emp.id);
  return `
    <div class="employee-card ${emp.archived ? 'archived' : ''}" data-action="open-employee" data-id="${emp.id}">
      <div class="ec-top">
        ${avatar(emp, 'lg')}
        <div>
          <div class="ec-name">${escapeHtml(emp.name)} ${emp.archived ? '<span class="pill pill-muted">已归档</span>' : ''}</div>
          <div class="ec-role">${escapeHtml(emp.role)}</div>
        </div>
        <span class="ec-status" data-employee-status="${escapeHtml(emp.id)}"><span class="status-dot ${live ? employeeStatusClass(live.status) : statusClass(emp.status)}"></span>${escapeHtml(emp.archived ? '已归档' : live?.label || emp.status)}</span>
      </div>
      <p class="ec-desc" data-employee-desc="${escapeHtml(emp.id)}" title="${escapeHtml(emp.archived ? `归档于 ${formatDateTime(emp.archivedAt)}，交接给 ${employee(emp.handoverTo)?.name || '—'}` : live && live.status !== 'idle' ? live.detail : emp.desc)}">${escapeHtml(emp.archived ? `归档于 ${formatDateTime(emp.archivedAt)}，交接给 ${employee(emp.handoverTo)?.name || '—'}` : live && live.status !== 'idle' ? live.detail : emp.desc)}</p>
      <div class="ec-meta">
        <span title="当前项目：${escapeHtml(emp.project)}">当前项目：<strong>${escapeHtml(emp.project)}</strong></span>
        <span title="工作区：${escapeHtml(emp.workspacePath || emp.cwd || '—')}">工作区：<strong>${escapeHtml(emp.workspacePath || emp.cwd || '—')}</strong></span>
        <span title="工具 / 技能：${escapeHtml((emp.tools || []).join('、') || '—')} / ${escapeHtml((emp.skills || []).join('、') || '—')}">工具 / 技能：<strong>${escapeHtml((emp.tools || []).join('、') || '—')} / ${escapeHtml((emp.skills || []).join('、') || '—')}</strong></span>
        <span title="权限：${escapeHtml((emp.permissions || []).join('、') || '—')}">权限：<strong>${escapeHtml((emp.permissions || []).join('、') || '—')}</strong></span>
        <span title="专家：${escapeHtml((emp.expertIds || []).map((id) => (state.data.experts || []).find((expert) => expert.id === id)?.name).filter(Boolean).join('、') || '—')}">专家：<strong>${escapeHtml((emp.expertIds || []).map((id) => (state.data.experts || []).find((expert) => expert.id === id)?.name).filter(Boolean).join('、') || '—')}</strong></span>
        <span title="模型：${escapeHtml(employeeModelLabel(emp))}">模型：<strong>${escapeHtml(employeeModelLabel(emp))}</strong>${
          emp.effectiveModel?.source && emp.effectiveModel.source !== 'settings'
            ? ` <span class="tag muted">${escapeHtml(modelSourceLabel(emp.effectiveModel.source))}</span>`
            : ''
        }</span>
      </div>
      <div class="ec-foot">
        <span>今日成本 ${money(emp.cost)}</span>
        <div class="ec-actions">
          ${emp.archived ? '' : `<button class="link-btn" type="button" data-action="open-employee-chat" data-id="${emp.id}">进入对话</button>`}
          ${emp.archived ? `<button class="link-btn" type="button" data-action="restore-employee" data-id="${emp.id}">恢复在职</button>` : `<button class="link-btn danger-text" type="button" data-action="archive-employee" data-id="${emp.id}">归档离职</button>`}
          ${emp.archived ? '' : `<button class="link-btn" type="button" data-action="clear-employee-context" data-id="${emp.id}">清空上下文</button>`}
          <button class="link-btn" type="button" data-action="edit-employee" data-id="${emp.id}">编辑档案</button>
        </div>
      </div>
    </div>`;
}

/* ---------------- ledger ---------------- */

function renderLedgerFinance(finance) {
  if (!finance) return '';
  const monthly = finance.monthly || [];
  const maxBar = Math.max(1, ...monthly.map((item) => Math.max(Number(item.revenue || 0), Number(item.cost || 0))));
  const categoryTotal = Math.max(1, ...(finance.byCategory || []).map((item) => Number(item.amount || 0)));
  const kpis = [
    ['累计收入', money(finance.revenueTotal), `${(finance.byProject || []).filter((item) => item.revenue > 0).length} 个项目有收入`],
    ['累计支出', money(finance.costTotal), `模型 ${money(finance.modelCostTotal)} + 固定 ${money(finance.fixedCostTotal)}`],
    ['毛利', money(finance.profitTotal), finance.profitTotal >= 0 ? '收入减全部成本' : '当前为亏损'],
    ['毛利率', `${Number(finance.margin || 0).toFixed(1)}%`, `合同额 ${money(finance.contractTotal)}`],
    ['本月收入', money(finance.monthRevenue), `本月毛利 ${money(finance.monthProfit)}`],
    ['本月模型成本', money(finance.monthModelCost), `本月总支出 ${money(finance.monthCost)}`],
    ['月固定成本', money(finance.monthFixedCost), '按月付 + 年付/12 估算'],
    ['待回款', money(finance.receivable), `预算执行 ${finance.budgetTotal > 0 ? `${Math.round((finance.budgetUsed / finance.budgetTotal) * 100)}%` : '未设预算'}`],
  ];
  return `
    <div class="section-head" style="margin-top:18px">
      <h2>经营账本 <span class="hint">收入、固定成本、模型成本与毛利；按项目记录汇总，不受上方调用时间筛选影响</span></h2>
    </div>
    <div class="ledger-summary ledger-finance-summary">
      ${kpis.map(([label, value, sub]) => `<div class="metric-card"><div class="metric-label">${escapeHtml(label)}</div><div class="metric-value">${escapeHtml(value)}</div><div class="metric-sub">${escapeHtml(sub)}</div></div>`).join('')}
    </div>
    <div class="pd-panel">
      <div class="pd-panel-head"><strong>近 6 个月收入与支出</strong><span class="hint">柱 1 收入 · 柱 2 支出（模型 + 固定）</span></div>
      <div class="ledger-chart">
        ${monthly
          .map((item) => {
            const revenueHeight = Number(item.revenue || 0) > 0 ? Math.max(4, (Number(item.revenue) / maxBar) * 100) : 0;
            const costHeight = Number(item.cost || 0) > 0 ? Math.max(4, (Number(item.cost) / maxBar) * 100) : 0;
            return `<div class="ledger-chart-col">
              <div class="ledger-chart-values"><span>${money(item.revenue)}</span><span class="muted">${money(item.cost)}</span></div>
              <div class="ledger-chart-bars">
                <i class="rev" style="height:${revenueHeight}%"></i>
                <i class="cost" style="height:${costHeight}%"></i>
              </div>
              <div class="ledger-chart-label">${escapeHtml(item.key.slice(5))} 月</div>
            </div>`;
          })
          .join('')}
      </div>
    </div>
    <div class="pd-grid-2">
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>项目损益</strong><span class="hint">固定成本按项目创建月数估算</span></div>
        <div class="pd-table-wrap"><table class="pd-table"><thead><tr><th>项目</th><th class="r">收入</th><th class="r">模型</th><th class="r">固定</th><th class="r">毛利</th><th class="r">毛利率</th><th class="r">待回款</th></tr></thead><tbody>
          ${
            (finance.byProject || []).length
              ? finance.byProject
                  .map(
                    (item) => `<tr>
                      <td>${escapeHtml(item.name)}${item.budgetUsage >= 80 ? ' <span class="tag warn">预算预警</span>' : ''}</td>
                      <td class="r">${money(item.revenue)}</td>
                      <td class="r">${money(item.modelCost)}</td>
                      <td class="r">${money(item.fixedCost)}</td>
                      <td class="r" style="color:${item.profit >= 0 ? 'var(--green)' : 'var(--red)'}">${money(item.profit)}</td>
                      <td class="r">${item.revenue > 0 ? `${Number(item.margin).toFixed(1)}%` : '—'}</td>
                      <td class="r">${money(item.receivable)}</td>
                    </tr>`,
                  )
                  .join('')
              : '<tr><td colspan="7">还没有项目经营数据。</td></tr>'
          }
        </tbody></table></div>
      </div>
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>成本构成</strong><span class="hint">模型成本 + 月固定成本</span></div>
        ${
          (finance.byCategory || []).filter((item) => Number(item.amount) > 0).length
            ? finance.byCategory
                .filter((item) => Number(item.amount) > 0)
                .map(
                  (item) => `<div class="ledger-category-row">
                    <span>${escapeHtml(item.category)}</span>
                    <div class="ledger-category-bar"><i style="width:${Math.min(100, (Number(item.amount) / categoryTotal) * 100)}%"></i></div>
                    <strong>${money(item.amount)}</strong>
                  </div>`,
                )
                .join('')
            : '<div class="empty small">还没有成本记录。</div>'
        }
        <div class="pd-panel-head" style="margin-top:16px"><strong>员工成本排行</strong></div>
        ${
          (finance.byEmployee || []).filter((item) => item.cost > 0).length
            ? finance.byEmployee
                .filter((item) => item.cost > 0)
                .slice(0, 6)
                .map(
                  (item) => `<div class="ledger-rank-row"><span>${escapeHtml(item.name)}</span><span class="muted">${item.calls} 次 · ${Number(item.tokens || 0).toLocaleString()} tokens</span><strong>${money(item.cost)}</strong></div>`,
                )
                .join('')
            : '<div class="empty small">还没有员工调用成本。</div>'
        }
      </div>
    </div>
    <div class="pd-grid-2">
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>收支流水</strong><span class="hint">收入按日期，成本按续费日</span></div>
        <div class="pd-table-wrap" style="max-height:320px;overflow:auto"><table class="pd-table"><thead><tr><th>日期</th><th>类型</th><th>项目</th><th>名称</th><th class="r">金额</th></tr></thead><tbody>
          ${
            (finance.entries || []).length
              ? finance.entries
                  .slice(0, 24)
                  .map(
                    (item) => `<tr><td>${escapeHtml(item.date || '—')}</td><td><span class="tag ${item.kind === '收入' ? 'ok' : 'muted'}">${escapeHtml(item.kind)}</span></td><td>${escapeHtml(item.projectName)}</td><td>${escapeHtml(item.name)}${item.note ? `<div class="muted" style="font-size:10px">${escapeHtml(item.note)}</div>` : ''}</td><td class="r" style="color:${item.kind === '收入' ? 'var(--green)' : 'var(--text)'}">${item.kind === '收入' ? '+' : '-'}${money(item.amount)}</td></tr>`,
                  )
                  .join('')
              : '<tr><td colspan="5">还没有收支流水。</td></tr>'
          }
        </tbody></table></div>
      </div>
      <div class="pd-panel">
        <div class="pd-panel-head"><strong>续费与到期</strong><span class="hint">未来 60 天与已过期</span></div>
        ${
          (finance.renewals || []).length
            ? finance.renewals
                .slice(0, 8)
                .map(
                  (item) => `<div class="ledger-renew-row">
                    <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.projectName)} · ${escapeHtml(item.cycle)}付 · ${money(item.amount)}</span></div>
                    <span class="tag ${item.days < 0 ? 'danger' : item.days <= 14 ? 'warn' : 'muted'}">${item.days < 0 ? `已过期 ${Math.abs(item.days)} 天` : item.days === 0 ? '今天到期' : `${item.days} 天后`}</span>
                  </div>`,
                )
                .join('')
            : '<div class="empty small">60 天内没有需要续费的成本。</div>'
        }
      </div>
    </div>`;
}

function renderLedgerPage() {
  const f = state.ledgerFilter || { range: 'all', employee: '', project: '', model: '', source: '' };
  const payload = state.ledgerData;
  const usage = payload?.rows || [...(state.data.usage || [])].sort((a, b) => String(b.time).localeCompare(String(a.time)));
  const summary = payload?.summary || usage.reduce(
    (sum, row) => {
      sum.calls += 1;
      sum.totalTokens += Number(row.totalTokens || 0);
      sum.cost += Number(row.cost || 0);
      sum.durationMs += Number(row.durationMs || 0);
      return sum;
    },
    { calls: 0, totalTokens: 0, cost: 0, durationMs: 0 },
  );
  if (!summary.avgDurationMs) summary.avgDurationMs = summary.calls ? Math.round(summary.durationMs / summary.calls) : 0;
  const total = Number(summary.cost || 0);
  const totalTokens = Number(summary.totalTokens || 0);
  const byProject = new Map();
  for (const row of usage) {
    const name = project(row.projectId)?.name || '未归集';
    byProject.set(name, (byProject.get(name) || 0) + Number(row.cost || 0));
  }
  const top = [...byProject.entries()].sort((a, b) => b[1] - a[1])[0];
  const avg = total / Math.max(1, state.data.deliverables.length);
  const models = payload?.models || [...new Set((state.data.usage || []).map((row) => row.model).filter(Boolean))];

  return `
    <div class="page">
      <div class="section-head">
        <h2>账本 <span class="hint">经营收支 + 模型调用成本</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="export-finance">导出经营 CSV</button>
          <button class="btn ghost small" type="button" data-action="export-ledger">导出调用 CSV</button>
        </div>
      </div>
      ${renderLedgerFinance(payload?.finance)}
      <div class="section-head" style="margin-top:22px">
        <h2>模型调用明细 <span class="hint">真实调用记录，可按时间、员工、项目、模型和来源筛选</span></h2>
      </div>
      <div class="filter-bar">
        <div class="tab-switch ledger-range">
          ${[['today', '今日'], ['7d', '近 7 天'], ['30d', '近 30 天'], ['all', '全部']]
            .map(([key, label]) => `<button class="tab-btn ${f.range === key ? 'active' : ''}" type="button" data-action="ledger-range" data-value="${key}">${label}</button>`)
            .join('')}
        </div>
        <select id="ledger-employee" class="filter-select">
          <option value="">全部员工</option>
          ${state.data.employees.map((emp) => `<option value="${emp.id}" ${f.employee === emp.id ? 'selected' : ''}>${escapeHtml(emp.name)}</option>`).join('')}
        </select>
        <select id="ledger-project" class="filter-select">
          <option value="">全部项目</option>
          ${state.data.projects.map((item) => `<option value="${item.id}" ${f.project === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}
        </select>
        <select id="ledger-model" class="filter-select">
          <option value="">全部模型</option>
          ${models.map((model) => `<option value="${escapeHtml(model)}" ${f.model === model ? 'selected' : ''}>${escapeHtml(model)}</option>`).join('')}
        </select>
        <select id="ledger-source" class="filter-select">
          <option value="">全部来源</option>
          ${[['chat', '1:1 对话'], ['group', '项目群'], ['task', '任务执行'], ['meeting', '会议']].map(([value, label]) => `<option value="${value}" ${f.source === value ? 'selected' : ''}>${label}</option>`).join('')}
        </select>
        <button class="btn primary small" type="button" data-action="filter-ledger">筛选</button>
        <button class="btn ghost small" type="button" data-action="reset-ledger">重置</button>
      </div>
      <div class="ledger-summary">
        <div class="metric-card">
          <div class="metric-label">本期总成本</div>
          <div class="metric-value">${money(total)}</div>
          <div class="metric-sub">${summary.calls} 条真实调用记录</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">总 tokens</div>
          <div class="metric-value">${Number(totalTokens).toLocaleString()}</div>
          <div class="metric-sub">输入 ${Number(summary.inputTokens || 0).toLocaleString()} · 输出 ${Number(summary.outputTokens || 0).toLocaleString()}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">平均耗时</div>
          <div class="metric-value">${summary.avgDurationMs ? `${(summary.avgDurationMs / 1000).toFixed(1)}s` : '—'}</div>
          <div class="metric-sub">按每次模型调用统计</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">最贵项目</div>
          <div class="metric-value" style="font-size:18px">${escapeHtml(top?.[0] || '—')}</div>
          <div class="metric-sub">${top ? money(top[1]) : '—'}</div>
        </div>
      </div>
      <div class="budget-strip">
        ${state.data.projects
          .filter((item) => Number(item.budget || 0) > 0)
          .map((item) => {
            const spent = usage.filter((row) => row.projectId === item.id).reduce((sum, row) => sum + Number(row.cost || 0), 0);
            const ratio = (spent / Number(item.budget)) * 100;
            const over = ratio >= Number(item.budgetWarning || 80);
            return `<div class="budget-chip ${over ? 'over' : ''}"><div><strong>${escapeHtml(item.name)}</strong><span>${money(spent)} / ¥${Number(item.budget).toFixed(0)}</span></div><div class="budget-bar ${over ? 'over' : ''}"><span style="width:${Math.min(100, ratio)}%"></span></div><span class="budget-percent">${Math.round(ratio)}%${over ? ' · 预警' : ''}</span></div>`;
          })
          .join('')}
      </div>
      <div class="asset-table-wrap">
        <table class="ledger-table asset-table">
          <thead>
            <tr><th>时间</th><th>项目</th><th>员工</th><th>来源</th><th>模型</th><th>Tokens</th><th>耗时</th><th class="money">成本</th></tr>
          </thead>
          <tbody>
            ${
              usage.length
                ? usage
                    .map(
                      (row) => `
                <tr>
                  <td>${escapeHtml(formatDateTime(row.time))}</td>
                  <td>${escapeHtml(project(row.projectId)?.name || '未归集')}</td>
                  <td>${escapeHtml(employee(row.employeeId)?.name || row.employeeId || '—')}</td>
                  <td>${escapeHtml(row.source === 'group' ? '项目群' : row.source === 'task' ? '任务执行' : row.source === 'meeting' ? '会议' : '1:1')}</td>
                  <td>${escapeHtml(row.model || '—')}</td>
                  <td>${Number(row.totalTokens || 0).toLocaleString()}</td>
                  <td>${row.durationMs ? `${(row.durationMs / 1000).toFixed(1)}s` : '—'}</td>
                  <td class="money">${money(row.cost || 0)}</td>
                </tr>`,
                    )
                    .join('')
                : '<tr><td colspan="8">没有符合筛选条件的调用记录。</td></tr>'
            }
          </tbody>
        </table>
      </div>
      <div class="hint" style="margin-top:8px">当前显示 ${usage.length} 条 · 单交付成本 ${money(avg)}</div>
    </div>`;
}

/* ---------------- 机房：服务器与项目服务 ---------------- */

function serverModeLabel(mode) {
  return mode === 'ssh' ? 'SSH 远程' : '本机';
}

function formatUptime(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (days) return `${days} 天 ${hours} 小时`;
  if (hours) return `${hours} 小时 ${minutes} 分`;
  return `${minutes} 分钟`;
}

function renderServerMetrics(server) {
  const metrics = server.metrics;
  if (!metrics?.available) {
    return `<div class="server-metrics-unavailable">${escapeHtml(metrics?.reason || '指标暂不可用')}</div>`;
  }
  const disk = metrics.disk;
  return `
    <div class="server-metrics-row">
      <div class="server-metric"><span>CPU</span><strong>${metrics.cpuPercent}%</strong><div class="metric-bar"><i style="width:${Math.min(100, metrics.cpuPercent)}%"></i></div></div>
      <div class="server-metric"><span>内存</span><strong>${metrics.memPercent}%</strong><div class="metric-bar"><i style="width:${Math.min(100, metrics.memPercent)}%"></i></div><small>${formatBytes(metrics.memUsed)} / ${formatBytes(metrics.memTotal)}</small></div>
      <div class="server-metric"><span>磁盘</span><strong>${disk ? `${disk.percent.toFixed(0)}%` : '—'}</strong><div class="metric-bar"><i style="width:${disk ? Math.min(100, disk.percent) : 0}%"></i></div><small>${disk ? `${formatBytes(disk.used)} / ${formatBytes(disk.total)}` : '不可读'}</small></div>
      <div class="server-metric"><span>运行时长</span><strong>${formatUptime(metrics.uptimeSeconds)}</strong><small>${escapeHtml(metrics.hostname || '')} · ${escapeHtml(metrics.platform || '')}</small></div>
    </div>`;
}

function serviceTypeLabel(type) {
  return { web: 'Web', api: 'API', worker: 'Worker', render: '渲染', db: '数据库', other: '服务' }[type] || '服务';
}

function renderDatacenterPage() {
  const server = state.selectedServerId ? serverById(state.selectedServerId) : null;
  if (server) return renderServerDetail(server);
  const servers = state.servers || [];
  const groups = ['all', ...new Set(servers.map((item) => item.group || '默认'))];
  const groupFilter = state.datacenterGroup || 'all';
  const visible = servers.filter((item) => groupFilter === 'all' || (item.group || '默认') === groupFilter);
  const online = servers.filter((item) => item.status === 'online').length;
  const services = servers.reduce((sum, item) => sum + (item.services || []).length, 0);
  const running = servers.reduce((sum, item) => sum + Number(item.runningCount || 0), 0);
  const selected = state.batchSelected || [];
  return `
    <div class="page datacenter-page">
      <div class="section-head">
        <h2>机房 <span class="hint">服务器信息、项目服务与运行状态</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="toggle-autostart" title="随一人公司启动时拉起 autoStart 服务">${state.data.serverSettings?.autoStart !== false ? '✓ 服务随启动' : '○ 服务不随启动'}</button>
          <button class="btn ghost small" type="button" data-action="check-servers" ${state.serversLoading ? 'disabled' : ''}>${state.serversLoading ? '检查中…' : '检查状态'}</button>
          <button class="btn primary small" type="button" data-action="new-server">添加服务器</button>
        </div>
      </div>
      <div class="metric-strip">
        <div class="metric-card"><div class="metric-label">服务器</div><div class="metric-value">${servers.length}</div><div class="metric-sub">${online} 台在线</div></div>
        <div class="metric-card"><div class="metric-label">项目服务</div><div class="metric-value">${services}</div><div class="metric-sub">${running} 个运行中</div></div>
        <div class="metric-card"><div class="metric-label">离线服务器</div><div class="metric-value">${servers.filter((item) => item.status === 'offline').length}</div><div class="metric-sub">有健康历史与告警</div></div>
        <div class="metric-card"><div class="metric-label">最近检查</div><div class="metric-value" style="font-size:17px">${state.serverCheckAt ? escapeHtml(formatDateTime(state.serverCheckAt)) : '—'}</div><div class="metric-sub">每 10 秒自动刷新</div></div>
      </div>
      <div class="filter-bar">
        <div class="tab-switch">
          ${groups.map((group) => `<button class="tab-btn ${groupFilter === group ? 'active' : ''}" type="button" data-action="datacenter-group" data-value="${escapeHtml(group)}">${group === 'all' ? '全部' : escapeHtml(group)}</button>`).join('')}
        </div>
        <span class="hint">按分组筛选服务器</span>
      </div>
      ${selected.length ? `<div class="batch-bar"><span>已选 ${selected.length} 个服务</span><button class="btn primary small" type="button" data-action="batch-service" data-op="start">批量启动</button><button class="btn ghost small" type="button" data-action="batch-service" data-op="restart">批量重启</button><button class="btn ghost small danger-text" type="button" data-action="batch-service" data-op="stop">批量停止</button><button class="link-btn" type="button" data-action="batch-clear">清空</button></div>` : ''}
      <div class="server-grid">
        ${visible
          .map(
            (item) => `
          <div class="server-card" data-action="open-server" data-id="${escapeHtml(item.id)}">
            <div class="server-card-head">
              <span class="server-avatar">${escapeHtml(item.name.slice(0, 1))}</span>
              <div class="server-card-title"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.host)} · ${serverModeLabel(item.mode)} · ${escapeHtml(item.group || '默认')}</span></div>
              <span class="server-status ${item.status}"><i></i>${serverStatusLabel(item.status)}</span>
            </div>
            <div class="server-card-stats">
              <span>${item.serviceCount || 0} 个服务</span>
              <span>${item.runningCount || 0} 个运行中</span>
              <span>${item.sshUser ? `SSH ${escapeHtml(item.sshUser)}` : '本机进程'}</span>
            </div>
            ${item.tags?.length ? `<div class="tag-row">${item.tags.map((tag) => `<span class="tag muted">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
            ${item.metrics?.available ? `<div class="server-card-metrics"><span>CPU ${item.metrics.cpuPercent}%</span><span>内存 ${item.metrics.memPercent}%</span><span>磁盘 ${item.metrics.disk ? item.metrics.disk.percent.toFixed(0) : '—'}%</span></div>` : ''}
            <div class="server-service-preview">
              ${(item.services || []).slice(0, 4).map((service) => `<span class="service-mini ${service.status}"><i></i>${escapeHtml(service.name)}</span>`).join('') || '<span class="hint">还没有安装项目服务</span>'}
            </div>
            <div class="server-card-foot"><span class="hint">${escapeHtml(item.note || '')}</span><span class="link-btn">进入服务器 →</span></div>
          </div>`,
          )
          .join('') || `<div class="empty">${state.serversLoading ? '正在读取服务器状态…' : '这个分组里还没有服务器。'}</div>`}
      </div>
    </div>`;
}

function renderServiceHealth(service) {
  const history = (service.healthHistory || []).slice(-20);
  if (history.length < 2) return '<span class="hint">暂无健康历史</span>';
  return `<span class="health-bars" title="最近 ${history.length} 次检查">${history.map((item) => `<i class="${item.status}"></i>`).join('')}</span>`;
}

function renderServerDetail(server) {
  const serviceGroups = ['all', ...new Set((server.services || []).map((item) => item.group || '默认'))];
  const groupFilter = state.serviceGroupFilter || 'all';
  const visibleServices = (server.services || []).filter((item) => groupFilter === 'all' || (item.group || '默认') === groupFilter);
  return `
    <div class="page datacenter-page">
      <div class="section-head">
        <h2><button class="back-link" type="button" data-action="open-datacenter">← 机房</button> ${escapeHtml(server.name)} <span class="server-status ${server.status}"><i></i>${serverStatusLabel(server.status)}</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="scan-server" data-id="${escapeHtml(server.id)}">让秘书扫描</button>
          <button class="btn ghost small" type="button" data-action="check-servers">检查状态</button>
          ${server.mode === 'ssh' ? `<button class="btn ghost small" type="button" data-action="test-ssh" data-id="${escapeHtml(server.id)}">测试 SSH</button>` : ''}
          <button class="btn ghost small" type="button" data-action="edit-server" data-id="${escapeHtml(server.id)}">编辑服务器</button>
          <button class="btn ghost small danger-text" type="button" data-action="delete-server" data-id="${escapeHtml(server.id)}">删除</button>
          <button class="btn primary small" type="button" data-action="new-service" data-server="${escapeHtml(server.id)}">添加服务</button>
        </div>
      </div>
      <div class="server-meta-grid">
        <div class="server-meta-card"><span class="hint">地址</span><strong>${escapeHtml(server.host)}${server.mode === 'ssh' ? `:${server.sshPort}` : ''}</strong><span>${serverModeLabel(server.mode)} · ${escapeHtml(server.group || '默认')}</span></div>
        <div class="server-meta-card"><span class="hint">SSH</span><strong>${server.sshUser ? `${escapeHtml(server.sshUser)}@${escapeHtml(server.host)}` : '未配置'}</strong><span>${server.sshKeyPath ? escapeHtml(shortPath(server.sshKeyPath)) : '使用环境默认密钥'}</span></div>
        <div class="server-meta-card"><span class="hint">服务</span><strong>${server.serviceCount || 0} 个 · ${server.runningCount || 0} 个运行中</strong><span>${server.lastCheckedAt ? `检查于 ${escapeHtml(formatDateTime(server.lastCheckedAt))}` : '尚未检查'}</span></div>
        <div class="server-meta-card"><span class="hint">标签</span><strong class="server-note-text">${(server.tags || []).map((tag) => escapeHtml(tag)).join('、') || '—'}</strong><span>${escapeHtml(server.note || '')}</span></div>
      </div>
      ${renderServerMetrics(server)}
      <div class="server-metrics-row" style="margin-top:10px">
        <div class="server-metric"><span>健康历史</span>${renderServiceHealth({ healthHistory: server.healthHistory })}<small>服务器级状态变化</small></div>
        <div class="server-metric"><span>CPU 趋势</span><span class="sparkline">${(server.metricsHistory || []).slice(-24).map((item) => `<i style="height:${Math.max(4, Math.min(100, item.cpu))}%"></i>`).join('')}</span><small>最近 24 次采样</small></div>
        <div class="server-metric"><span>内存趋势</span><span class="sparkline">${(server.metricsHistory || []).slice(-24).map((item) => `<i style="height:${Math.max(4, Math.min(100, item.mem))}%"></i>`).join('')}</span><small>最近 24 次采样</small></div>
        <div class="server-metric"><span>负载</span><strong>${(server.metrics?.loadAvg || []).join(' / ') || '—'}</strong><small>1 / 5 / 15 分钟</small></div>
      </div>
      <div class="section-head" style="margin-top:22px"><h2>项目服务 <span class="hint">${(server.services || []).length} 个</span></h2>
        <div class="tab-switch">
          ${serviceGroups.map((group) => `<button class="tab-btn ${groupFilter === group ? 'active' : ''}" type="button" data-action="service-group" data-value="${escapeHtml(group)}">${group === 'all' ? '全部' : escapeHtml(group)}</button>`).join('')}
        </div>
      </div>
      ${(state.batchSelected || []).length ? `<div class="batch-bar"><span>已选 ${(state.batchSelected || []).length} 个服务</span><button class="btn primary small" type="button" data-action="batch-service" data-op="start">批量启动</button><button class="btn ghost small" type="button" data-action="batch-service" data-op="restart">批量重启</button><button class="btn ghost small danger-text" type="button" data-action="batch-service" data-op="stop">批量停止</button><button class="link-btn" type="button" data-action="batch-clear">清空</button></div>` : ''}
      <div class="service-list">
        ${visibleServices
          .map((service) => {
            const running = service.status === 'running';
            const canStart = Boolean(service.startCommand) || (service.runtime && service.runtime !== 'process');
            const canStop = running && (Boolean(service.stopCommand) || Boolean(service.pid) || server.mode === 'ssh' || (service.runtime && service.runtime !== 'process'));
            const selected = (state.batchSelected || []).includes(`${server.id}:${service.id}`);
            return `
            <div class="service-card ${selected ? 'selected' : ''}">
              <label class="service-check"><input type="checkbox" data-action="select-service" data-server="${escapeHtml(server.id)}" data-service="${escapeHtml(service.id)}" ${selected ? 'checked' : ''} /></label>
              <div class="service-main">
                <div class="service-title"><span class="service-dot ${service.status}"></span><strong>${escapeHtml(service.name)}</strong><span class="pill pill-muted">${serviceTypeLabel(service.type)}</span><span class="pill pill-muted">${escapeHtml(service.runtime || 'process')}</span>${service.autoStart ? '<span class="pill pill-ok">自启</span>' : ''}</div>
                <div class="service-meta">
                  <span>${escapeHtml(project(service.projectId)?.name || '未关联项目')}</span>
                  <span>${service.port ? `端口 ${service.port}` : '无端口'}</span>
                  <span>${serviceStatusLabel(service.status)}</span>
                  <span>分组 ${escapeHtml(service.group || '默认')}</span>
                  ${service.pid ? `<span>PID ${service.pid}</span>` : ''}
                  ${service.dependsOn?.length ? `<span>依赖 ${service.dependsOn.length} 个</span>` : ''}
                </div>
                <div class="service-health">${renderServiceHealth(service)}</div>
                ${service.note ? `<div class="service-note">${escapeHtml(service.note)}</div>` : ''}
                <details class="service-detail">
                  <summary>运行配置</summary>
                  <div class="service-detail-grid">
                    <span>运行目录：<strong>${escapeHtml(service.cwd || '一人公司目录')}</strong></span>
                    <span>启动命令：<strong>${escapeHtml(service.startCommand || '未配置')}</strong></span>
                    <span>停止命令：<strong>${escapeHtml(service.stopCommand || (service.pid ? '按 PID 停止' : '未配置'))}</strong></span>
                    <span>健康检查：<strong>${escapeHtml(service.healthUrl || '未配置')}</strong></span>
                    <span>管理台：<strong>${escapeHtml(service.manageUrl || '未配置')}</strong></span>
                    <span>依赖：<strong>${(service.dependsOn || []).map((id) => (server.services || []).find((item) => item.id === id)?.name || id).join('、') || '无'}</strong></span>
                    <span>容器：<strong>${escapeHtml(service.containerName || '—')}</strong></span>
                    <span>${service.runtime === 'k8s' ? 'K8s' : '最近操作'}：<strong>${service.runtime === 'k8s' ? `${escapeHtml(service.namespace || 'default')} / ${escapeHtml(service.workload || '—')}` : service.lastActionAt ? `${escapeHtml(service.lastAction || '')} · ${escapeHtml(formatDateTime(service.lastActionAt))}` : '—'}</strong></span>
                  </div>
                </details>
              </div>
              <div class="service-actions">
                <button class="btn ghost small" type="button" data-action="server-service-action" data-server="${escapeHtml(server.id)}" data-service="${escapeHtml(service.id)}" data-op="start" ${!canStart || running || state.serverActionBusy === service.id ? 'disabled' : ''}>启动</button>
                <button class="btn ghost small" type="button" data-action="server-service-action" data-server="${escapeHtml(server.id)}" data-service="${escapeHtml(service.id)}" data-op="restart" ${!canStart || (running && !canStop) || state.serverActionBusy === service.id ? 'disabled' : ''}>重启</button>
                <button class="btn ghost small danger-text" type="button" data-action="server-service-action" data-server="${escapeHtml(server.id)}" data-service="${escapeHtml(service.id)}" data-op="stop" ${!canStop || state.serverActionBusy === service.id ? 'disabled' : ''}>停止</button>
                ${service.manageUrl ? `<button class="btn ghost small" type="button" data-action="preview-server-console" data-server="${escapeHtml(server.id)}" data-service="${escapeHtml(service.id)}">管理台</button>` : ''}
                <button class="btn ghost small" type="button" data-action="show-service-log" data-server="${escapeHtml(server.id)}" data-id="${escapeHtml(service.id)}">日志</button>
                <button class="icon-btn" type="button" title="编辑服务" data-action="edit-service" data-server="${escapeHtml(server.id)}" data-id="${escapeHtml(service.id)}">✎</button>
                <button class="icon-btn" type="button" title="删除服务" data-action="delete-service" data-server="${escapeHtml(server.id)}" data-id="${escapeHtml(service.id)}">×</button>
              </div>
            </div>`;
          })
          .join('') || '<div class="empty">这个分组里还没有项目服务。</div>'}
      </div>
    </div>`;
}

function employeeStatusInfo(emp) {
  return (
    employeeLiveStatus(emp.id) || {
      id: emp.id,
      status: emp.status === '工作中' ? 'working' : 'idle',
      label: emp.status || '空闲',
      detail: emp.today || '可接新任务',
    }
  );
}

function renderPanelEmployees() {
  const employees = (state.data.employees || []).filter((emp) => !emp.archived);
  const statuses = employees.map((emp) => ({ emp, live: employeeStatusInfo(emp) }));
  const counts = {
    all: statuses.length,
    working: statuses.filter((row) => row.live.status === 'working').length,
    waiting: statuses.filter((row) => row.live.status === 'waiting').length,
    idle: statuses.filter((row) => row.live.status === 'idle').length,
    blocked: statuses.filter((row) => row.live.status === 'blocked').length,
  };
  const filter = state.employeeFilter || 'all';
  const visible = statuses.filter((row) => filter === 'all' || row.live.status === filter);
  const filters = [
    ['all', '全部', counts.all],
    ['working', '工作中', counts.working],
    ['waiting', '等待审批', counts.waiting],
    ['idle', '空闲', counts.idle],
    ['blocked', '阻塞', counts.blocked],
  ];
  return `
    <div class="panel-section-title"><span>员工 ${employees.length}</span><button class="link-btn" type="button" data-action="refresh-employee-status">${state.employeeStatusAt ? '刷新' : '读取中…'}</button></div>
    <div class="employee-filter-row">
      ${filters
        .filter(([key, , count]) => key === 'all' || count > 0)
        .map(([key, label, count]) => `<button class="employee-filter ${filter === key ? 'active' : ''}" type="button" data-action="employee-filter" data-filter="${key}">${label}<span>${count}</span></button>`)
        .join('')}
    </div>
    <div class="panel-employee-list">
      ${visible
        .map(
          ({ emp, live }) => `
        <button class="panel-employee ${state.chat === `employee:${emp.id}` ? 'active' : ''}" type="button" data-action="open-employee-chat" data-id="${escapeHtml(emp.id)}">
          ${avatar(emp, 'sm')}
          <span class="panel-employee-info">
            <span class="panel-employee-name">${escapeHtml(emp.name)} <i class="employee-live-dot ${live.status}"></i></span>
            <span class="panel-employee-role">${escapeHtml(emp.role)} · ${escapeHtml(live.label)}</span>
            <span class="panel-employee-detail">${escapeHtml(
              live.status === 'working'
                ? `正在执行：${live.detail || '任务'}`
                : live.status === 'waiting'
                  ? `等待：${live.detail || '审批'}`
                  : live.detail || '可接新任务',
            )}</span>
          </span>
          <span class="panel-employee-arrow">›</span>
        </button>`,
        )
        .join('') || '<div class="empty small">这个状态下没有员工。</div>'}
    </div>`;
}

function renderPanelServers() {
  const servers = state.servers || [];
  const online = servers.filter((item) => item.status === 'online').length;
  const offline = servers.filter((item) => item.status === 'offline').length;
  return `
    <div class="panel-section-title"><span>服务器 ${servers.length}</span><button class="link-btn" type="button" data-action="check-servers">${state.serversLoading ? '刷新中…' : '刷新'}</button></div>
    <div class="panel-server-summary">
      <span class="panel-live-pill online"><i></i>在线 ${online}</span>
      <span class="panel-live-pill offline"><i></i>离线 ${offline}</span>
      <span class="panel-live-time">${state.serverCheckAt ? `更新于 ${escapeHtml(formatDateTime(state.serverCheckAt))}` : '正在读取…'}</span>
    </div>
    ${
      servers.length
        ? servers
            .map(
              (server) => {
                const statusText = serverStatusLabel(server.status);
                const metrics = server.metrics?.available
                  ? `CPU ${server.metrics.cpuPercent}% · 内存 ${server.metrics.memPercent}%`
                  : server.metrics?.reason || '指标待采集';
                return `
        <div class="panel-server">
          <button class="panel-server-head" type="button" data-action="open-server" data-id="${escapeHtml(server.id)}">
            <span class="server-status ${server.status}"><i></i></span>
            <span class="panel-server-name">${escapeHtml(server.name)}<em>${escapeHtml(server.group || '默认')} · ${escapeHtml(server.host)}</em></span>
            <span class="panel-server-count">${server.runningCount || 0}/${server.serviceCount || 0}</span>
          </button>
          <div class="panel-server-live">
            <span class="panel-live-state ${server.status}">${escapeHtml(statusText)}</span>
            <span class="panel-live-metrics">${escapeHtml(metrics)}</span>
          </div>
          ${(server.services || [])
            .map((service) => {
              const canStart = Boolean(service.startCommand) || (service.runtime && service.runtime !== 'process');
              const canStop = service.status === 'running' && (Boolean(service.stopCommand) || Boolean(service.pid) || server.mode === 'ssh' || (service.runtime && service.runtime !== 'process'));
              return `
            <div class="panel-service">
              <span class="service-dot ${service.status}"></span>
              <div class="panel-service-info"><strong>${escapeHtml(service.name)}</strong><span>${escapeHtml(project(service.projectId)?.name || '未关联项目')} · ${service.port || '—'} · <b class="panel-service-state ${service.status}">${escapeHtml(serviceStatusLabel(service.status))}</b></span></div>
              <div class="panel-service-actions">
                <button type="button" title="启动" data-action="server-service-action" data-server="${escapeHtml(server.id)}" data-service="${escapeHtml(service.id)}" data-op="start" ${service.status === 'running' || !canStart ? 'disabled' : ''}>▶</button>
                <button type="button" title="重启" data-action="server-service-action" data-server="${escapeHtml(server.id)}" data-service="${escapeHtml(service.id)}" data-op="restart" ${!canStart || (service.status === 'running' && !canStop) ? 'disabled' : ''}>↻</button>
                <button type="button" title="停止" data-action="server-service-action" data-server="${escapeHtml(server.id)}" data-service="${escapeHtml(service.id)}" data-op="stop" ${!canStop ? 'disabled' : ''}>■</button>
                <button type="button" title="管理台预览" data-action="preview-server-console" data-server="${escapeHtml(server.id)}" data-service="${escapeHtml(service.id)}" ${service.manageUrl ? '' : 'disabled'}>↗</button>
              </div>
            </div>`;
            })
            .join('')}
        </div>`;
              },
            )
            .join('')
        : '<div class="empty small">还没有服务器。</div>'
    }`;
}

function reportKindLabel(kind) {
  return kind === 'weekly' ? '周报' : '日报';
}

function renderReportsPage() {
  const reports = state.reports || [];
  const total = reports.length;
  const latest = reports[0];
  return `
    <div class="page">
      <div class="section-head">
        <h2>日报周报 <span class="hint">从任务、交付、用量、决策和预算自动聚合，不用员工再写一遍</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="generate-report" data-kind="daily">生成今日日报</button>
          <button class="btn primary small" type="button" data-action="generate-report" data-kind="weekly">生成本周周报</button>
        </div>
      </div>
      <div class="metric-strip">
        <div class="metric-card">
          <div class="metric-label">已生成</div>
          <div class="metric-value">${total}</div>
          <div class="metric-sub">保留最近 200 份</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">最近一份</div>
          <div class="metric-value" style="font-size:17px">${escapeHtml(latest?.title || '—')}</div>
          <div class="metric-sub">${latest ? escapeHtml(formatDateTime(latest.createdAt)) : '还没有生成报告'}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">本期完成任务</div>
          <div class="metric-value">${latest?.summary?.tasksDone ?? 0}</div>
          <div class="metric-sub">来自最近一份报告</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">本期成本</div>
          <div class="metric-value">${money(latest?.summary?.cost || 0)}</div>
          <div class="metric-sub">真实模型调用</div>
        </div>
      </div>
      ${
        reports.length
          ? `<div class="report-grid">${reports
              .map(
                (report) => `
            <div class="report-card">
              <div class="report-card-top">
                <span class="pill ${report.kind === 'weekly' ? 'pill-ops' : 'pill-dev'}">${reportKindLabel(report.kind)}</span>
                <span class="report-period">${escapeHtml(report.periodLabel || '')}</span>
              </div>
              <h3>${escapeHtml(report.title)}</h3>
              <div class="report-stats">
                <span>完成 ${report.summary?.tasksDone ?? 0}</span>
                <span>交付 ${report.summary?.deliverables ?? 0}</span>
                <span>通过 ${report.summary?.approved ?? 0}</span>
                <span>打回 ${report.summary?.rejected ?? 0}</span>
                <span>${Number(report.summary?.tokens || 0).toLocaleString()} tokens</span>
              </div>
              <div class="report-card-actions">
                <button class="btn ghost small" type="button" data-action="preview-report" data-id="${escapeHtml(report.id)}">预览</button>
                <a class="btn ghost small" href="/api/reports/export?id=${encodeURIComponent(report.id)}" download>下载 .md</a>
              </div>
            </div>`,
              )
              .join('')}</div>`
          : `<div class="empty">还没有报告。点右上角“生成今日日报”，会从真实任务、交付物、用量、决策和预算里聚合一份。</div>`
      }
    </div>`;
}

/* ---------------- P1：会议 ---------------- */

function meetingStatusClass(status) {
  if (status === '进行中') return 'status-working';
  if (status === '已结束') return 'status-idle';
  if (status === '已中断') return 'status-blocked';
  return 'status-waiting';
}

function renderMeetingsPage() {
  const meeting = state.meetings.find((item) => item.id === state.meetingId);
  if (meeting) return renderMeetingDetail(meeting);
  const list = [...(state.meetings || [])].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return `
    <div class="page">
      <div class="section-head">
        <h2>会议 <span class="hint">多员工圆桌，CEO 主持，自动产出纪要与行动项</span></h2>
        <button class="btn primary small" type="button" data-action="new-meeting">新建会议</button>
      </div>
      ${
        list.length
          ? `<div class="meeting-list">${list
              .map((item) => {
                const proj = project(item.projectId);
                const last = item.messages?.[item.messages.length - 1];
                return `
              <div class="meeting-card" data-action="open-meeting" data-id="${escapeHtml(item.id)}">
                <div class="meeting-card-head">
                  <div>
                    <h3>${escapeHtml(item.title)}</h3>
                    <div class="meeting-meta">${escapeHtml(proj?.name || '公司级')} · ${item.rounds} 轮 · ${item.messages?.length || 0} 条发言 · ${escapeHtml(formatDateTime(item.createdAt))}</div>
                  </div>
                  <span class="status-pill"><span class="status-dot ${meetingStatusClass(item.status)}"></span>${escapeHtml(item.status)}</span>
                </div>
                <div class="meeting-agenda">${escapeHtml(item.agenda || '')}</div>
                <div class="meeting-foot">
                  <div class="avatar-stack">${(item.participants || []).map((id) => avatar(employee(id))).join('')}</div>
                  <span class="hint">${last ? `最后发言：${escapeHtml(String(last.text || '').slice(0, 50))}…` : '还没有开始'}</span>
                </div>
              </div>`;
              })
              .join('')}</div>`
          : `<div class="empty">还没有会议。新建一场圆桌，选好项目和参会员工，系统会按轮次真实发言并生成纪要。</div>`
      }
    </div>`;
}

function renderMeetingDetail(meeting) {
  const proj = project(meeting.projectId);
  const running = meeting.status === '进行中';
  return `
    <div class="page meeting-detail">
      <div class="section-head">
        <h2><button class="back-link" type="button" data-action="close-meeting">← 会议</button> ${escapeHtml(meeting.title)}</h2>
        <div class="head-actions">
          ${
            meeting.status !== '已结束'
              ? `<button class="btn primary small" type="button" data-action="run-meeting" data-id="${escapeHtml(meeting.id)}" ${running ? 'disabled' : ''}>${running ? '进行中…' : '开始会议'}</button>`
              : ''
          }
          ${
            meeting.status !== '已结束' && meeting.messages?.length
              ? `<button class="btn ghost small" type="button" data-action="end-meeting" data-id="${escapeHtml(meeting.id)}">结束并生成纪要</button>`
              : ''
          }
        </div>
      </div>
      <div class="meeting-summary">
        <div><span class="hint">项目</span><strong>${escapeHtml(proj?.name || '公司级')}</strong></div>
        <div><span class="hint">状态</span><strong><span class="status-pill"><span class="status-dot ${meetingStatusClass(meeting.status)}"></span>${escapeHtml(meeting.status)}</span></strong></div>
        <div><span class="hint">轮次</span><strong>${meeting.rounds} 轮</strong></div>
        <div><span class="hint">参会</span><strong>${(meeting.participants || []).map((id) => escapeHtml(employee(id)?.name || id)).join('、')}</strong></div>
      </div>
      <div class="meeting-agenda-box"><span class="hint">议程</span><p>${escapeHtml(meeting.agenda || '')}</p></div>
      <div class="meeting-live" id="meeting-live">
        <div class="meeting-live-head">会议实录 <span class="hint" id="meeting-live-status">${running ? '正在发言…' : meeting.status === '已结束' ? '已结束' : '等待开始'}</span></div>
        <div class="meeting-messages" id="meeting-live-body">
          ${(meeting.messages || [])
            .map(
              (message) => `
            <div class="meeting-message">
              ${avatar(employee(message.from), 'small')}
              <div class="meeting-message-body">
                <div class="meeting-message-head"><strong>${escapeHtml(message.name || employee(message.from)?.name || '员工')}</strong><span class="hint">第 ${message.round || 1} 轮 · ${escapeHtml(message.time || '')}</span></div>
                <div class="meeting-message-text">${formatMessageText(message.text || '')}</div>
              </div>
            </div>`,
            )
            .join('')}
        </div>
      </div>
      ${
        meeting.minutes
          ? `<div class="meeting-minutes">
              <div class="section-head"><h2>会议纪要</h2><a class="btn ghost small" href="/api/meetings/${encodeURIComponent(meeting.id)}/minutes" download>下载 .md</a></div>
              <pre class="preview-text">${escapeHtml(meeting.minutes)}</pre>
            </div>`
          : ''
      }
      ${
        meeting.actionItems?.length
          ? `<div class="meeting-actions">
              <div class="section-head"><h2>行动项 <span class="hint">${meeting.actionItems.length} 条</span></h2></div>
              ${meeting.actionItems
                .map(
                  (item) => `
                <div class="action-row">
                  <div><strong>${escapeHtml(item.title)}</strong><div class="hint">${escapeHtml(item.ownerName || '未指派')} · 截止 ${escapeHtml(item.due || '待定')}</div></div>
                  ${
                    item.createdTaskId
                      ? '<span class="pill pill-ok">已建任务</span>'
                      : `<button class="btn ghost small" type="button" data-action="meeting-action-task" data-id="${escapeHtml(item.id)}" data-meeting="${escapeHtml(meeting.id)}">转成任务</button>`
                  }
                </div>`,
                )
                .join('')}
            </div>`
          : ''
      }
    </div>`;
}

/* ---------------- P1：组织与绩效 ---------------- */

function renderTeamsPage() {
  const teams = state.teams || [];
  const totalMembers = new Set(teams.flatMap((team) => team.members || [])).size;
  return `
    <div class="page">
      <div class="section-head">
        <h2>团队 <span class="hint">固定编制、负责人、默认项目与共享记忆范围</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="load-teams">刷新</button>
          <button class="btn primary small" type="button" data-action="new-team">新建团队</button>
        </div>
      </div>
      <div class="metric-strip">
        <div class="metric-card"><div class="metric-label">团队</div><div class="metric-value">${teams.length}</div><div class="metric-sub">跨 ${new Set(teams.map((team) => team.dept)).size} 个部门</div></div>
        <div class="metric-card"><div class="metric-label">覆盖员工</div><div class="metric-value">${totalMembers}</div><div class="metric-sub">去重后的团队成员</div></div>
        <div class="metric-card"><div class="metric-label">进行中负载</div><div class="metric-value">${teams.reduce((sum, team) => sum + Number(team.load || 0), 0)}</div><div class="metric-sub">团队名下进行中/待验收任务</div></div>
        <div class="metric-card"><div class="metric-label">默认项目</div><div class="metric-value" style="font-size:17px">${escapeHtml(project(teams[0]?.defaultProjectId)?.name || '—')}</div><div class="metric-sub">可在团队里调整</div></div>
      </div>
      <div class="team-grid">
        ${teams
          .map((team) => {
            const lead = employee(team.lead);
            const members = (team.members || []).map(employee).filter(Boolean);
            return `
            <div class="team-card">
              <div class="team-card-head">
                <div class="team-mark">${escapeHtml(team.name.slice(0, 1))}</div>
                <div class="team-title"><strong>${escapeHtml(team.name)}</strong><span>${escapeHtml(team.dept || '未设部门')} · ${escapeHtml(team.function || '')}</span></div>
                <button class="icon-btn" type="button" title="编辑团队" data-action="edit-team" data-id="${escapeHtml(team.id)}">✎</button>
              </div>
              <div class="team-lead">负责人：<strong>${escapeHtml(lead?.name || '未指定')}</strong>${lead ? ` · ${escapeHtml(lead.role)}` : ''}</div>
              <div class="team-members">
                <div class="avatar-stack">${members.map((emp) => avatar(emp, 'sm')).join('')}</div>
                <span class="hint">${members.length} 人</span>
              </div>
              <div class="team-meta">
                <span>默认项目：${escapeHtml(project(team.defaultProjectId)?.name || '未绑定')}</span>
                <span>负载：${Number(team.load || 0)} 个任务</span>
                <span>共享记忆：${escapeHtml(team.memoryScope || '未设置')}</span>
              </div>
              ${team.note ? `<p class="team-note">${escapeHtml(team.note)}</p>` : ''}
              <div class="team-actions">
                <button class="btn ghost small" type="button" data-action="edit-team" data-id="${escapeHtml(team.id)}">编辑</button>
                <button class="btn ghost small danger-text" type="button" data-action="delete-team" data-id="${escapeHtml(team.id)}">删除</button>
              </div>
            </div>`;
          })
          .join('') || '<div class="empty">还没有团队。把员工按职能编成固定团队，负责人和默认项目就能自动带出。</div>'}
      </div>
    </div>`;
}

function auditActionLabel(action) {
  const labels = {
    'project.create': '新建项目',
    'project.update': '更新项目',
    'task.create': '新建任务',
    'task.update': '更新任务',
    'task.run': '执行任务',
    'task.cancel': '停止任务',
    'task.review': '任务验收',
    'deliverable.upload': '上传交付物',
    'deliverable.submit': '提交交付物',
    'deliverable.review': '交付物验收',
    'employee.create': '招聘员工',
    'employee.update': '更新员工',
    'employee.archive': '员工归档',
    'employee.restore': '恢复员工',
    'memory.create': '新建记忆',
    'memory.update': '更新记忆',
    'approval.request': '申请审批',
    'approval.decide': '审批决定',
    'settings.update': '更新设置',
    'server.create': '登记服务器',
    'server.update': '更新服务器',
    'server.batch': '批量服务操作',
    'server.autostart': '服务自启设置',
    'server.autostart.run': '服务自启执行',
    'service.create': '添加服务',
    'service.update': '更新服务',
    'service.action': '服务启停',
    'schedule.run': '定时任务',
    'station.sync': '工位归档',
    'station.clean': '清理工位',
    'team.create': '新建团队',
    'team.update': '更新团队',
    'team.delete': '删除团队',
    'task.handoff': '任务转交',
    'meeting.create': '新建会议',
    'schedule.create': '新建定时任务',
    'schedule.update': '更新定时任务',
    'worktree.merge': '合并隔离区',
    'worktree.discard': '丢弃隔离区',
  };
  return labels[action] || action;
}

function renderAuditPage() {
  const audit = state.audit || { records: [], total: 0, actions: [], chain: null };
  const chain = audit.chain;
  const f = state.auditFilter || {};
  return `
    <div class="page">
      <div class="section-head">
        <h2>审计日志 <span class="hint">每次写操作、审批、验收和启停都留下哈希链记录</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="verify-audit">校验哈希链</button>
          <button class="btn ghost small" type="button" data-action="export-audit">导出 CSV</button>
        </div>
      </div>
      <div class="audit-chain ${chain?.ok ? 'ok' : 'bad'}">
        <span class="audit-chain-dot"></span>
        <div>
          <strong>${chain?.ok ? '哈希链完整' : chain ? '哈希链异常' : '尚未校验'}</strong>
          <span>${chain ? (chain.ok ? `共 ${chain.total} 条记录，逐条 prevHash 与 hash 匹配` : `第 ${chain.brokenAt + 1} 条异常：${chain.reason}`) : '点“校验哈希链”检查记录是否被篡改'}</span>
        </div>
        <span class="hint">共 ${audit.total || 0} 条</span>
      </div>
      <div class="filter-bar">
        <input id="audit-q" class="filter-input" type="search" placeholder="搜索摘要 / 对象 / 操作人" value="${escapeHtml(f.q || '')}" />
        <input id="audit-actor" class="filter-input small" type="text" placeholder="操作人" value="${escapeHtml(f.actor || '')}" />
        <select id="audit-action" class="filter-select">
          <option value="">全部动作</option>
          ${(audit.actions || []).map((action) => `<option value="${escapeHtml(action)}" ${f.action === action ? 'selected' : ''}>${escapeHtml(auditActionLabel(action))}</option>`).join('')}
        </select>
        <button class="btn primary small" type="button" data-action="filter-audit">筛选</button>
        <button class="btn ghost small" type="button" data-action="reset-audit">重置</button>
      </div>
      <div class="asset-table-wrap">
        <table class="ledger-table asset-table audit-table">
          <thead><tr><th>时间</th><th>操作人</th><th>动作</th><th>对象</th><th>摘要</th><th>级别</th><th>状态</th><th>耗时</th><th>哈希</th></tr></thead>
          <tbody>
            ${
              (audit.records || []).length
                ? audit.records
                    .map(
                      (row) => `<tr>
                <td>${escapeHtml(formatDateTime(row.time))}</td>
                <td>${escapeHtml(row.actor)}${row.actorType === 'employee' ? ' <span class="pill pill-dev">AI</span>' : ''}</td>
                <td>${escapeHtml(auditActionLabel(row.action))}</td>
                <td><span class="audit-target">${escapeHtml(row.targetType || '—')}${row.targetId ? ` · ${escapeHtml(row.targetId)}` : ''}</span></td>
                <td><div class="audit-summary">${escapeHtml(row.summary)}</div>${row.detail ? `<div class="audit-detail">${escapeHtml(row.detail)}</div>` : ''}</td>
                <td>${escapeHtml(row.level || '—')}</td>
                <td><span class="audit-status ${row.status}">${escapeHtml(row.status)}</span></td>
                <td>${row.durationMs ? `${(row.durationMs / 1000).toFixed(1)}s` : '—'}</td>
                <td><code class="audit-hash" title="${escapeHtml(row.hash || '')}">${escapeHtml(String(row.hash || '').slice(0, 10))}</code></td>
              </tr>`,
                    )
                    .join('')
                : `<tr><td colspan="9">${state.auditLoading ? '正在读取…' : '还没有审计记录。'}</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderNotificationsPage() {
  const filter = state.notificationFilter || 'all';
  const all = state.notifications || [];
  const rows = filter === 'unread' ? all.filter((item) => !item.read) : all;
  return `
    <div class="page">
      <div class="section-head">
        <h2>通知中心 <span class="hint">审批、验收、任务、服务器与定时任务的统一入口</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="mark-all-notifications">全部已读</button>
          <button class="btn ghost small" type="button" data-action="refresh-notifications">刷新</button>
        </div>
      </div>
      <div class="filter-bar">
        <div class="tab-switch">
          <button class="tab-btn ${filter === 'all' ? 'active' : ''}" type="button" data-action="notification-filter" data-value="all">全部 ${all.length}</button>
          <button class="tab-btn ${filter === 'unread' ? 'active' : ''}" type="button" data-action="notification-filter" data-value="unread">未读 ${state.notificationUnread}</button>
        </div>
      </div>
      <div class="notification-list">
        ${
          rows.length
            ? rows
                .map(
                  (item) => `<div class="notification-item ${item.read ? '' : 'unread'} level-${escapeHtml(item.level)}">
            <span class="notification-dot"></span>
            <div class="notification-main">
              <div class="notification-head"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(formatDateTime(item.time))}</span></div>
              <p>${escapeHtml(item.body || '')}</p>
              <div class="notification-foot">
                <span class="pill pill-muted">${escapeHtml(item.type)}</span>
                ${item.view ? `<button class="link-btn" type="button" data-action="open-notification" data-view="${escapeHtml(item.view)}" data-target="${escapeHtml(item.targetId || '')}">查看详情 →</button>` : ''}
              </div>
            </div>
            <div class="notification-actions">
              ${item.read ? '' : `<button class="icon-btn" type="button" title="标记已读" data-action="read-notification" data-id="${escapeHtml(item.id)}">✓</button>`}
              <button class="icon-btn" type="button" title="删除" data-action="delete-notification" data-id="${escapeHtml(item.id)}">×</button>
            </div>
          </div>`,
                )
                .join('')
            : '<div class="empty">没有通知。</div>'
        }
      </div>
    </div>`;
}

function renderWorkstationsPage() {
  const rows = (state.workstations || []).filter(
    (row) => state.workstationProject === 'all' || row.projectId === state.workstationProject,
  );
  const totalFiles = rows.reduce((sum, row) => sum + Number(row.fileCount || 0), 0);
  return `
    <div class="page">
      <div class="section-head">
        <h2>员工工位 <span class="hint">工位直接放在项目工作区下的 workstations/&lt;员工&gt;，跟着项目走；任务完成后自动归档回项目工作区</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="refresh-workstations" ${state.workstationsLoading ? 'disabled' : ''}>${state.workstationsLoading ? '读取中…' : '刷新'}</button>
        </div>
      </div>
      <div class="filter-bar">
        <select id="station-project" class="filter-select">
          <option value="all">全部项目</option>
          ${state.data.projects.map((item) => `<option value="${item.id}" ${state.workstationProject === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}
        </select>
        <button class="btn ghost small" type="button" data-action="filter-workstations">筛选</button>
        <span class="hint">${rows.length} 个工位 · ${totalFiles} 个文件</span>
      </div>
      <div class="station-grid">
        ${
          rows.length
            ? rows
                .map(
                  (row) => `<div class="station-card">
            <div class="station-card-head">
              <span class="station-avatar">${escapeHtml(row.employeeName.slice(0, 1))}</span>
              <div class="station-title"><strong>${escapeHtml(row.employeeName)}</strong><span>${escapeHtml(row.employeeRole || '')} · ${escapeHtml(row.projectName)}</span></div>
              <span class="station-count">${row.fileCount} 件</span>
            </div>
            <div class="station-path">${escapeHtml(row.path)}</div>
            <div class="station-files">
              ${(row.files || []).slice(0, 8).map((file) => `<span class="station-file" title="${escapeHtml(file.path)}">${escapeHtml(file.path)}</span>`).join('') || '<span class="hint">工位还是空的</span>'}
            </div>
            <div class="station-meta">最近修改：${row.lastModifiedAt ? escapeHtml(formatDateTime(row.lastModifiedAt)) : '—'} · ${formatBytes(row.totalSize || 0)}</div>
            <div class="station-actions">
              <button class="btn ghost small" type="button" data-action="station-files" data-employee="${escapeHtml(row.employeeId)}" data-project="${escapeHtml(row.projectId)}">查看文件</button>
              <button class="btn primary small" type="button" data-action="station-sync" data-employee="${escapeHtml(row.employeeId)}" data-project="${escapeHtml(row.projectId)}">归档到项目</button>
              <button class="btn ghost small danger-text" type="button" data-action="station-clean" data-employee="${escapeHtml(row.employeeId)}" data-project="${escapeHtml(row.projectId)}">清理</button>
            </div>
          </div>`,
                )
                .join('')
            : `<div class="empty">${state.workstationsLoading ? '正在读取工位…' : '还没有工位。员工第一次在项目里执行任务时会自动创建。'}</div>`
        }
      </div>
    </div>`;
}

function renderOrgPage() {
  const tab = state.orgTab;
  return `
    <div class="page">
      <div class="section-head">
        <h2>组织与绩效 <span class="hint">团队-项目矩阵、汇报关系、人员负载与产出质量</span></h2>
        <div class="tab-switch">
          <button class="tab-btn ${tab === 'matrix' ? 'active' : ''}" type="button" data-action="org-tab" data-tab="matrix">组织架构</button>
          <button class="tab-btn ${tab === 'performance' ? 'active' : ''}" type="button" data-action="org-tab" data-tab="performance">员工绩效</button>
        </div>
      </div>
      ${tab === 'matrix' ? renderOrgMatrix() : renderPerformanceView()}
    </div>`;
}

function renderOrgMatrix() {
  const org = state.org;
  if (!org) return '<div class="empty">正在读取组织数据…</div>';
  const projectList = state.data.projects;
  return `
    <div class="metric-strip">
      <div class="metric-card"><div class="metric-label">员工</div><div class="metric-value">${org.matrix.length}</div><div class="metric-sub">${org.departments.length} 个部门</div></div>
      <div class="metric-card"><div class="metric-label">项目</div><div class="metric-value">${projectList.length}</div><div class="metric-sub">矩阵按项目编制</div></div>
      <div class="metric-card"><div class="metric-label">平均负载</div><div class="metric-value">${(org.matrix.reduce((sum, row) => sum + row.load, 0) / Math.max(1, org.matrix.length)).toFixed(1)}</div><div class="metric-sub">进行中 + 待验收任务 / 人</div></div>
      <div class="metric-card"><div class="metric-label">高负载</div><div class="metric-value">${org.matrix.filter((row) => row.load >= 2).length}</div><div class="metric-sub">同时扛 2 个以上任务</div></div>
    </div>
    <div class="org-matrix-wrap">
      <table class="org-matrix">
        <thead><tr><th>员工</th>${projectList.map((item) => `<th>${escapeHtml(item.name)}</th>`).join('')}<th>负载</th></tr></thead>
        <tbody>
          ${org.matrix
            .map(
              (row) => `<tr>
            <td><div class="org-person">${avatar(employee(row.id), 'small')}<div><strong>${escapeHtml(row.name)}</strong><span class="hint">${escapeHtml(row.role)} · ${escapeHtml(row.dept)}</span></div></div></td>
            ${row.cells
              .map(
                (cell) => `<td class="org-cell">${cell.inTeam ? `<span class="matrix-dot on" title="在项目编制内">●</span>${cell.activeTasks ? `<span class="matrix-load">${cell.activeTasks}</span>` : ''}` : '<span class="matrix-dot">·</span>'}</td>`,
              )
              .join('')}
            <td><div class="load-bar"><span style="width:${Math.min(100, row.load * 25)}%"></span></div><span class="hint">${row.load} 个任务</span></td>
          </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="dept-grid">
      ${org.departments
        .map(
          (dept) => `
        <div class="dept-card">
          <div class="dept-head"><strong>${escapeHtml(dept.name)}</strong><span class="hint">${dept.members.length} 人</span></div>
          ${dept.members
            .map(
              (member) => `<div class="dept-member">${avatar(employee(member.id), 'small')}<div><strong>${escapeHtml(member.name)}</strong><span class="hint">${escapeHtml(member.role)}${member.reportsToName ? ` · 汇报给 ${escapeHtml(member.reportsToName)}` : ' · 直接向老板汇报'}</span></div><span class="hint">${member.load} 任务</span></div>`,
            )
            .join('')}
        </div>`,
        )
        .join('')}
    </div>`;
}

function renderPerformanceView() {
  const perf = state.performance;
  if (!perf) return '<div class="empty">正在计算绩效…</div>';
  return `
    <div class="perf-toolbar">
      <div class="tab-switch">
        ${[7, 30, 90]
          .map((days) => `<button class="tab-btn ${state.performanceDays === days ? 'active' : ''}" type="button" data-action="perf-days" data-value="${days}">近 ${days} 天</button>`)
          .join('')}
      </div>
      <span class="hint">口径：完成任务 / 交付通过率 / 返工率 / 平均周期 / 按时率 / 真实成本</span>
    </div>
    <div class="metric-strip">
      <div class="metric-card"><div class="metric-label">完成任务</div><div class="metric-value">${perf.total.tasksDone}</div><div class="metric-sub">近 ${perf.days} 天</div></div>
      <div class="metric-card"><div class="metric-label">交付物</div><div class="metric-value">${perf.total.deliverables}</div><div class="metric-sub">按负责人归集</div></div>
      <div class="metric-card"><div class="metric-label">Tokens</div><div class="metric-value">${Number(perf.total.tokens).toLocaleString()}</div><div class="metric-sub">真实模型调用</div></div>
      <div class="metric-card"><div class="metric-label">成本</div><div class="metric-value">${money(perf.total.cost)}</div><div class="metric-sub">按价格设置估算</div></div>
    </div>
    <div class="asset-table-wrap">
      <table class="asset-table perf-table">
        <thead><tr><th>员工</th><th>完成任务</th><th>交付</th><th>通过 / 打回</th><th>返工率</th><th>平均周期</th><th>按时率</th><th>Tokens</th><th class="money">成本</th></tr></thead>
        <tbody>
          ${perf.rows
            .map(
              (row) => `<tr>
            <td><div class="org-person">${avatar(employee(row.employeeId), 'small')}<div><strong>${escapeHtml(row.name)}</strong><span class="hint">${escapeHtml(row.role)}</span></div></div></td>
            <td>${row.tasksDone}</td>
            <td>${row.deliverables}</td>
            <td>${row.approved} / ${row.rejected}</td>
            <td>${row.reworkRate}%</td>
            <td>${row.avgCycleHours === null ? '—' : `${row.avgCycleHours} 小时`}</td>
            <td>${row.onTimeRate === null ? '—' : `${row.onTimeRate}%`}</td>
            <td>${Number(row.tokens).toLocaleString()}</td>
            <td class="money">${money(row.cost)}</td>
          </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>`;
}

/* ---------------- P1：模板市场 ---------------- */

function templateTypeLabel(type) {
  return type === 'project' ? '项目模板' : type === 'role' ? '岗位模板' : '验收模板';
}

function renderTemplatesPage() {
  const tab = state.templateTab;
  const list = (state.templates || []).filter((item) => item.type === tab);
  return `
    <div class="page">
      <div class="section-head">
        <h2>模板市场 <span class="hint">项目、岗位、验收三类模板，可导入导出</span></h2>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="import-template">导入 JSON</button>
        </div>
      </div>
      <div class="tab-switch" style="margin-bottom:16px">
        ${[
          ['project', '项目模板'],
          ['role', '岗位模板'],
          ['acceptance', '验收模板'],
        ]
          .map(([key, label]) => `<button class="tab-btn ${tab === key ? 'active' : ''}" type="button" data-action="template-tab" data-tab="${key}">${label}</button>`)
          .join('')}
      </div>
      <div class="template-grid">
        ${list
          .map(
            (item) => `
          <div class="template-card">
            <div class="template-head">
              <span class="template-icon">${item.type === 'project' ? '▦' : item.type === 'role' ? '☺' : '✓'}</span>
              <div><h3>${escapeHtml(item.name)}</h3><span class="hint">${templateTypeLabel(item.type)}${item.custom ? ' · 自定义' : ' · 内置'}</span></div>
            </div>
            <p>${escapeHtml(item.desc || '')}</p>
            <div class="template-actions">
              ${
                item.type === 'project'
                  ? `<button class="btn primary small" type="button" data-action="apply-template" data-id="${escapeHtml(item.id)}">应用到项目</button>`
                  : item.type === 'role'
                    ? `<button class="btn primary small" type="button" data-action="use-role-template" data-id="${escapeHtml(item.id)}">用于招聘</button>`
                    : `<button class="btn ghost small" type="button" data-action="view-acceptance" data-id="${escapeHtml(item.id)}">查看标准</button>`
              }
              <a class="btn ghost small" href="/api/templates/export?id=${encodeURIComponent(item.id)}" download>导出</a>
            </div>
          </div>`,
          )
          .join('')}
      </div>
      ${!list.length ? '<div class="empty">这个分类还没有模板。</div>' : ''}
    </div>`;
}

/* ---------------- P1：自动化 ---------------- */

function scheduleActionLabel(action) {
  return (
    {
      'report-daily': '生成日报',
      'report-weekly': '生成周报',
      'meeting-standup': '创建站会',
      'snapshot-projects': '项目快照',
      'health-check': '控制面巡检',
    }[action] || action
  );
}

function scheduleWhen(schedule) {
  if (schedule.type === 'interval') return `每 ${schedule.intervalMinutes} 分钟`;
  if (schedule.type === 'weekly') return `每周${['一', '二', '三', '四', '五', '六', '日'][Number(schedule.weekday) - 1] || '一'} ${schedule.time}`;
  return `每天 ${schedule.time}`;
}

function renderAutomationPage() {
  const schedules = state.schedules || [];
  const runs = state.scheduleRuns || [];
  const enabled = schedules.filter((item) => item.enabled).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayRuns = runs.filter((run) => String(run.startedAt || '').slice(0, 10) === today);
  return `
    <div class="page">
      <div class="section-head">
        <h2>自动化 <span class="hint">早会、日报周报、巡检、快照，到点自动执行</span></h2>
        <button class="btn primary small" type="button" data-action="new-schedule">新建定时任务</button>
      </div>
      <div class="metric-strip">
        <div class="metric-card"><div class="metric-label">启用中</div><div class="metric-value">${enabled}</div><div class="metric-sub">共 ${schedules.length} 个</div></div>
        <div class="metric-card"><div class="metric-label">今日执行</div><div class="metric-value">${todayRuns.length}</div><div class="metric-sub">自动 + 手动</div></div>
        <div class="metric-card"><div class="metric-label">失败</div><div class="metric-value">${runs.filter((run) => !run.ok).length}</div><div class="metric-sub">最近 300 条记录</div></div>
        <div class="metric-card"><div class="metric-label">最近执行</div><div class="metric-value" style="font-size:17px">${escapeHtml(runs[0]?.scheduleName || '—')}</div><div class="metric-sub">${runs[0] ? escapeHtml(formatDateTime(runs[0].startedAt)) : '还没有执行记录'}</div></div>
      </div>
      <div class="schedule-list">
        ${schedules
          .map(
            (item) => `
          <div class="schedule-card ${item.enabled ? '' : 'disabled'}">
            <div class="schedule-main">
              <div class="schedule-title"><strong>${escapeHtml(item.name)}</strong><span class="pill ${item.enabled ? 'pill-ok' : 'pill-muted'}">${item.enabled ? '启用' : '暂停'}</span></div>
              <div class="schedule-meta"><span>${scheduleActionLabel(item.action)}</span><span>${scheduleWhen(item)}</span><span>下次：${item.nextRunAt ? escapeHtml(formatDateTime(item.nextRunAt)) : '—'}</span></div>
            </div>
            <div class="schedule-actions">
              <button class="btn ghost small" type="button" data-action="toggle-schedule" data-id="${escapeHtml(item.id)}">${item.enabled ? '暂停' : '启用'}</button>
              <button class="btn ghost small" type="button" data-action="run-schedule" data-id="${escapeHtml(item.id)}">立即执行</button>
              <button class="btn ghost small danger-text" type="button" data-action="delete-schedule" data-id="${escapeHtml(item.id)}">删除</button>
            </div>
          </div>`,
          )
          .join('')}
      </div>
      ${!schedules.length ? '<div class="empty">还没有定时任务。建议先建“每日早会”和“每日经营日报”。</div>' : ''}
      <div class="section-head" style="margin-top:24px"><h2>最近执行</h2></div>
      <div class="run-list">
        ${runs
          .slice(0, 20)
          .map(
            (run) => `<div class="run-row"><span class="run-dot ${run.ok ? 'ok' : 'bad'}"></span><div><strong>${escapeHtml(run.scheduleName)}</strong><span class="hint">${scheduleActionLabel(run.action)} · ${run.trigger === 'manual' ? '手动' : '自动'}</span></div><span class="hint">${escapeHtml(formatDateTime(run.startedAt))}</span><span class="run-summary">${escapeHtml(run.summary || '')}</span></div>`,
          )
          .join('')}
        ${!runs.length ? '<div class="empty small">还没有执行记录。</div>' : ''}
      </div>
    </div>`;
}

/* ---------------- 检索：全文 + 本地向量 ---------------- */

function searchTypeLabel(type) {
  return (
    {
      memory: '记忆',
      document: '文档',
      task: '任务',
      deliverable: '交付物',
      project: '项目',
      employee: '员工',
      message: '对话',
    }[type] || type
  );
}

function renderSearchPage() {
  const q = state.search.trim();
  if (!q) return renderDeliverablesPage();
  const result = state.searchResults;
  if (state.searchLoading && !result) {
    return `<div class="page"><div class="section-head"><h2>检索 “${escapeHtml(q)}”</h2></div><div class="empty">正在检索…</div></div>`;
  }
  const results = result?.results || [];
  return `
    <div class="page search-page">
      <div class="section-head"><h2>检索 “${escapeHtml(q)}” <span class="hint">${result ? `${result.total} 个结果 · 全文 BM25 + 本地向量` : ''}</span></h2></div>
      ${
        results.length
          ? `<div class="search-results">${results
              .map(
                (item) => `
            <div class="search-result" data-action="open-search-result" data-type="${escapeHtml(item.type)}" data-id="${escapeHtml(item.id)}" data-chat="${escapeHtml(item.chatKey || '')}">
              <div class="search-result-head"><span class="pill pill-muted">${searchTypeLabel(item.type)}</span><strong>${escapeHtml(item.title || '')}</strong><span class="search-score">${item.score}</span></div>
              <div class="search-snippet">${escapeHtml(item.snippet || '')}</div>
              <div class="search-source">${escapeHtml(item.subtitle || '')}${item.path ? ` · ${escapeHtml(item.path)}` : ''}</div>
            </div>`,
              )
              .join('')}</div>`
          : `<div class="empty">没有找到结果。试试更短的关键词，或直接搜员工姓名、项目名、文件名。</div>`
      }
    </div>`;
}

/* ---------------- chat dock ---------------- */

function chatMeta(key) {
  const [kind, id] = key.split(':');
  if (kind === 'project') {
    const proj = project(id);
    return {
      kind,
      id,
      title: proj?.name || '项目',
      context: `项目群 · ${proj?.name || ''}`,
      team: proj?.team || [],
    };
  }
  const emp = employee(id);
  const context = id === 'e-jiang' ? `秘书 Agent · ${emp?.name || '江叙'}` : `${emp?.role || '员工'} · ${emp?.name || ''}`;
  return { kind, id, title: emp?.name || '员工', context, team: [id] };
}

let dockOptionsSignature = '';

function populateDockSelectors() {
  const projectSelect = document.getElementById('dock-project');
  const employeeSelect = document.getElementById('dock-employee');
  if (!projectSelect || !employeeSelect) return;

  const projects = (state.data.projects || []).filter((item) => !item.archived);
  const employees = (state.data.employees || []).filter((emp) => !emp.archived);
  const signature = JSON.stringify([
    projects.map((item) => [item.id, item.name]),
    employees.map((item) => [item.id, item.name, item.role]),
  ]);
  if (signature === dockOptionsSignature) return;
  dockOptionsSignature = signature;

  const previousProject = projectSelect.value;
  const previousEmployee = employeeSelect.value;

  projectSelect.innerHTML =
    '<option value="">选择项目</option>' +
    projects.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('');

  employeeSelect.innerHTML =
    '<option value="">选择员工</option>' +
    employees
      .map((emp) => `<option value="${emp.id}">${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</option>`)
      .join('');

  projectSelect.value = previousProject;
  employeeSelect.value = previousEmployee || 'e-jiang';
}

function syncDockSelectors() {
  const projectSelect = document.getElementById('dock-project');
  const employeeSelect = document.getElementById('dock-employee');
  if (!projectSelect || !employeeSelect) return;
  const [kind, id] = state.chat.split(':');
  projectSelect.value = kind === 'project' ? id : '';
  employeeSelect.value = kind === 'employee' ? id : '';
}

function chatRenderSignature(messages) {
  const parts = (messages || []).map(
    (message) =>
      `${message.id || ''}|${message.from || ''}|${message.type || ''}|${String(message.text || '').length}|${
        (message.tools || []).length
      }|${message.interrupted ? 1 : 0}|${message.reasoning ? String(message.reasoning).length : 0}|${message.internal ? 1 : 0}`,
  );
  const questions = (state.data.userQuestions || []).map((item) => `${item.id}:${item.status}`).join(',');
  return `${parts.join(';')}|${questions}|${state.highlightMessage || ''}`;
}

function captureChatAnchor(stream) {
  if (!stream) return null;
  const box = stream.getBoundingClientRect();
  const nodes = [...stream.querySelectorAll('.msg[data-msg-id]')];
  for (const node of nodes) {
    const rect = node.getBoundingClientRect();
    if (rect.bottom > box.top + 1) {
      return { id: node.dataset.msgId || '', offset: rect.top - box.top };
    }
  }
  return null;
}

function restoreChatAnchor(stream, anchor) {
  if (!stream || !anchor || !anchor.id) return false;
  let node = null;
  try {
    node = stream.querySelector(`.msg[data-msg-id="${CSS.escape(anchor.id)}"]`);
  } catch {
    node = null;
  }
  if (!node) return false;
  const box = stream.getBoundingClientRect();
  const delta = node.getBoundingClientRect().top - box.top - anchor.offset;
  if (Math.abs(delta) > 0.5) stream.scrollTop += delta;
  return true;
}

function captureOpenDetails(root) {
  if (!root) return [];
  return [...root.querySelectorAll('details[data-detail-key][open]')]
    .map((node) => node.dataset.detailKey || '')
    .filter(Boolean);
}

function restoreOpenDetails(root, keys) {
  if (!root || !keys?.length) return;
  const wanted = new Set(keys);
  root.querySelectorAll('details[data-detail-key]').forEach((node) => {
    if (wanted.has(node.dataset.detailKey)) node.open = true;
  });
}

function renderChatStreaming(stream) {
  if (!stream) return;
  const host = stream.querySelector('#streaming-message');
  const stopSlot = stream.querySelector('#stream-stop-slot');
  if (!host) return;
  const streaming = state.streaming && state.streaming.chatKey === state.chat ? state.streaming : null;
  const emptyEl = stream.querySelector('#chat-empty');
  if (emptyEl) emptyEl.hidden = Boolean(streaming);
  if (stopSlot) {
    stopSlot.innerHTML =
      streaming && !streaming.group
        ? `<div class="stream-stop-row"><span class="typing-dot"></span><span>正在生成</span><button class="btn ghost small" type="button" data-action="stop-chat" ${state.chatStopping ? 'disabled' : ''}>${state.chatStopping ? '停止中…' : '■ 停止生成'}</button></div>`
        : '';
  }
  if (!streaming) {
    if (host.innerHTML) host.innerHTML = '';
    return;
  }
  const stick = chatNearBottom(stream);
  host.innerHTML = renderStreamingMessage(streaming);
  hydrateIcons(host);
  if (stick) stream.scrollTop = stream.scrollHeight;
}

function renderChatDock(options = {}) {
  populateDockSelectors();
  const meta = chatMeta(state.chat);
  try {
    localStorage.setItem('one-company-chat-target', state.chat);
  } catch {
    /* ignore */
  }
  renderComposerModels();
  const messages = state.data.chats[state.chat] || [];
  const stream = document.getElementById('chat-stream');
  const flow = document.getElementById('chat-flow') || stream;
  const previousChat = renderChatDock.lastChat;
  if (previousChat && previousChat !== state.chat && stream) {
    if (!state.chatScrollPositions) state.chatScrollPositions = {};
    state.chatScrollPositions[previousChat] = {
      top: stream.scrollTop,
      atBottom: chatNearBottom(stream),
    };
    persistChatScrollPositions();
  }
  const chatChanged = previousChat !== state.chat;
  renderChatDock.lastChat = state.chat;
  const savedScroll = chatChanged ? state.chatScrollPositions?.[state.chat] : null;
  const stickToBottom =
    options.forceScroll === true ||
    (chatChanged ? !savedScroll || savedScroll.atBottom : chatNearBottom(stream));
  const previousTop = stream ? stream.scrollTop : 0;
  const context = document.getElementById('dock-context');
  const textarea = document.querySelector('#composer textarea');

  if (context) context.textContent = meta.context;
  if (textarea) {
    textarea.placeholder =
      meta.kind === 'project'
        ? '对项目群说点什么，Enter 发送…'
        : `对${meta.title === '江叙' ? '秘书 Agent' : meta.title}说点什么，Enter 发送…`;
  }
  if (stream) {
    const streamingNow = state.streaming && state.streaming.chatKey === state.chat ? state.streaming : null;
    const signature = chatRenderSignature(messages);
    if (chatChanged || options.forceRender === true || stream.dataset.chatSignature !== signature) {
      const anchor = chatChanged ? null : captureChatAnchor(stream);
      const openDetails = chatChanged ? [] : captureOpenDetails(stream);
      const messagesHtml = messages.length ? messages.map(renderMessage).join('') : '';
      const emptyHtml =
        messages.length === 0 && !streamingNow
          ? '<div class="empty" id="chat-empty">还没有消息。先打个招呼，或者派一件事。</div>'
          : '';
      flow.innerHTML = `${messagesHtml}${emptyHtml}<div id="streaming-message"></div><div id="stream-stop-slot"></div>`;
      stream.dataset.chatSignature = signature;
      restoreOpenDetails(stream, openDetails);
      const applyChatScroll = () => {
        if (!stream) return;
        if (stickToBottom) {
          stream.scrollTop = stream.scrollHeight;
          updateChatJump(false);
        } else if (chatChanged && savedScroll) {
          stream.scrollTop = savedScroll.atBottom
            ? stream.scrollHeight
            : Math.min(savedScroll.top, stream.scrollHeight - stream.clientHeight);
          updateChatJump(chatNearBottom(stream) ? false : true);
        } else if (!restoreChatAnchor(stream, anchor)) {
          stream.scrollTop = previousTop;
          updateChatJump(true);
        } else {
          updateChatJump(true);
        }
        saveChatScrollPosition(state.chat);
      };
      applyChatScroll();
      // 内容替换后浏览器可能重新锚定；下一帧再对齐一次，保证老板正在看的位置不跳。
      requestAnimationFrame(applyChatScroll);
    }
    // 流式输出只更新当前这一条，不再整块重建历史消息
    renderChatStreaming(stream);
  }
  syncDockSelectors();
  renderQuestionFlow();
  renderPendingQuestion();
  maybeOpenPendingQuestion();
  hydrateIcons(document.getElementById('chat-dock') || document);
}

function pendingQuestions() {
  return (state.data.userQuestions || []).filter((item) => item.status === 'pending');
}

function renderPendingQuestion() {
  const host = document.getElementById('pending-question');
  if (!host) return;
  if (state.questionFlow) {
    host.hidden = true;
    host.innerHTML = '';
    return;
  }

  const pending = pendingQuestions();
  if (!pending.length) {
    host.hidden = true;
    host.innerHTML = '';
    return;
  }
  const latest = pending[pending.length - 1];
  const count = pending.length > 1 ? `（共 ${pending.length} 组）` : '';
  host.hidden = false;
  host.innerHTML = `<span class="pending-question-badge">待确认</span>
    <span class="pending-question-text">${escapeHtml(latest.employeeName || '秘书')}：${escapeHtml(
      latest.title || '需求确认',
    )} · ${(latest.questions || []).length} 个问题${count}</span>
    <button class="btn primary small" type="button" data-action="answer-question" data-id="${escapeHtml(latest.id)}">回答</button>`;
}

function maybeOpenPendingQuestion() {
  const pending = pendingQuestions();
  if (!pending.length) return;
  if (modalType) return;
  // 优先弹最新的一组，避免旧问题反复挡在前面
  const seen = (() => {
    try {
      return new Set(JSON.parse(sessionStorage.getItem('oc.questionSeen') || '[]'));
    } catch {
      return new Set();
    }
  })();
  const next = [...pending].reverse().find((item) => !seen.has(item.id) && !state.questionPopupSeen.has(item.id));
  if (!next) return;
  state.questionPopupSeen.add(next.id);
  seen.add(next.id);
  try {
    sessionStorage.setItem('oc.questionSeen', JSON.stringify([...seen]));
  } catch {
    /* 忽略隐私模式限制 */
  }
  // 稍等一拍，等本轮渲染稳定后再弹
  setTimeout(() => {
    if (!state.questionFlow && !modalType) openQuestionFlow(next.id);
  }, 260);
}

function openQuestionDialog(id) {
  openModal('question-answer', id);
}

function questionLetter(index) {
  return String.fromCharCode(65 + Number(index || 0));
}

function questionAnswerLabels(record, question) {
  const value = (record.answers || {})[question.id];
  const labels = Array.isArray(value) ? value : value ? [value] : [];
  return labels.filter(Boolean);
}

function renderQuestionCard(record, message = {}) {
  if (!record) {
    return `<div class="msg-bubble question-card"><div class="question-title">问题记录已失效</div></div>`;
  }
  const answered = record.status === 'answered';
  const questionList = Array.isArray(record.questions) ? record.questions : [];
  return `<div class="msg-bubble question-card ${answered ? 'answered' : ''}" data-question-id="${escapeHtml(record.id)}">
    <div class="question-head">
      <span class="question-badge">选择式提问</span>
      <strong class="question-title">${escapeHtml(record.title || '需求确认')}</strong>
      ${answered ? '<span class="tag ok">已回答</span>' : `<span class="question-progress">${questionList.length} 个问题</span>`}
    </div>
    ${record.intro ? `<div class="question-intro">${escapeHtml(record.intro)}</div>` : ''}
    ${questionList
      .map((question, index) => {
        const chosen = questionAnswerLabels(record, question);
        return `<div class="question-item">
          <div class="question-item-title"><span class="q-index">${index + 1}</span>${escapeHtml(question.title)}${
            question.required === false ? '（可选）' : ''
          }</div>
          ${
            answered
              ? `<div class="question-answer">${
                  chosen.length
                    ? chosen
                        .map((label) => {
                          const optionIndex = (question.options || []).findIndex((option) => option.label === label);
                          return `<span class="q-picked"><i>${optionIndex >= 0 ? questionLetter(optionIndex) : '✎'}</i>${escapeHtml(
                            label,
                          )}</span>`;
                        })
                        .join('')
                    : '（未答）'
                }</div>`
              : `<div class="question-chips">
                  ${(question.options || [])
                    .map(
                      (option, optionIndex) =>
                        `<span class="q-chip"><i>${questionLetter(optionIndex)}</i>${escapeHtml(option.label)}</span>`,
                    )
                    .join('')}
                  <span class="q-chip custom"><i>+</i>可自己填</span>
                </div>`
          }
        </div>`;
      })
      .join('')}
    ${
      answered
        ? ''
        : `<div class="question-actions">
            <button class="btn primary small" type="button" data-action="open-question-flow" data-id="${escapeHtml(
              record.id,
            )}">开始回答 →</button>
            <span class="hint">可以点选项，也可以直接输入自己的答案</span>
          </div>`
    }
  </div>`;
}

function renderQuestionForm(record) {
  const questionList = Array.isArray(record.questions) ? record.questions : [];
  return `<div class="question-card question-form" data-question-id="${escapeHtml(record.id)}">
    <div class="question-head">
      <span class="question-badge">待确认</span>
      <strong class="question-title">${escapeHtml(record.title || '需求确认')}</strong>
      <span class="question-progress">${questionList.length} 个问题</span>
    </div>
    ${record.intro ? `<div class="question-intro">${escapeHtml(record.intro)}</div>` : ''}
    ${questionList
      .map(
        (question, index) => `<div class="question-item">
          <div class="question-item-title"><span class="q-index">${index + 1}</span>${escapeHtml(question.title)}${
            question.required === false ? '（可选）' : ''
          }</div>
          <div class="qf-options">
            ${(question.options || [])
              .map(
                (option, optionIndex) => `<label class="qf-option">
                  <input type="${question.type === 'multi' ? 'checkbox' : 'radio'}" name="q-${escapeHtml(record.id)}-${escapeHtml(question.id)}" value="${escapeHtml(option.label)}" />
                  <span class="qf-key">${questionLetter(optionIndex)}</span>
                  <span class="qf-body"><strong>${escapeHtml(option.label)}</strong>${option.desc ? `<em>${escapeHtml(option.desc)}</em>` : ''}</span>
                </label>`,
              )
              .join('')}
          </div>
          <div class="qf-custom">
            <span class="qf-key">✎</span>
            <input type="text" name="custom-${escapeHtml(record.id)}-${escapeHtml(question.id)}" maxlength="300" placeholder="其他答案，直接输入（可选）" />
          </div>
          <label class="qf-skip"><input type="checkbox" name="skip-${escapeHtml(record.id)}-${escapeHtml(question.id)}" /> 跳过本题</label>
        </div>`,
      )
      .join('')}
    <div class="modal-note">点选项或直接输入都可以；输入的自定义答案会优先于选项。</div>
  </div>`;
}

function currentQuestionRecord() {
  const flow = state.questionFlow;
  if (!flow) return null;
  return (state.data.userQuestions || []).find((item) => item.id === flow.id) || null;
}

function openQuestionFlow(id, index = 0) {
  const record = (state.data.userQuestions || []).find((item) => item.id === id);
  if (!record || record.status !== 'pending') return;
  state.questionFlow = {
    id,
    index: Math.max(0, Math.min(index, (record.questions || []).length - 1)),
    draft: {},
    custom: {},
    skipped: {},
  };
  // 提问卡比聊天区高，先把对话坞撑开，避免被输入框盖住
  state.dockCollapsed = false;
  if (state.dockHeight < 520) {
    state.dockHeight = Math.min(520, Math.round(window.innerHeight * 0.72));
  }
  applyDockHeight();
  renderQuestionFlow();
  renderPendingQuestion();
}

function closeQuestionFlow() {
  state.questionFlow = null;
  renderQuestionFlow();
  renderPendingQuestion();
}

function questionFlowAdvance() {
  const flow = state.questionFlow;
  const record = currentQuestionRecord();
  if (!flow || !record) return;
  if (flow.index + 1 < (record.questions || []).length) {
    flow.index += 1;
    renderQuestionFlow();
  } else {
    void submitQuestionFlow();
  }
}

function captureQuestionCustom() {
  const flow = state.questionFlow;
  if (!flow) return '';
  const input = document.getElementById('qr-custom-input');
  if (!input) return '';
  const value = String(input.value || '').trim();
  const record = currentQuestionRecord();
  const question = record?.questions?.[flow.index];
  if (question) {
    flow.custom[question.id] = value;
    if (value) delete flow.skipped[question.id];
  }
  return value;
}

function skipQuestion() {
  const flow = state.questionFlow;
  const record = currentQuestionRecord();
  if (!flow || !record) return;
  const question = record.questions[flow.index];
  if (!question) return;
  flow.skipped[question.id] = true;
  delete flow.draft[question.id];
  delete flow.custom[question.id];
  const customInput = document.getElementById('qr-custom-input');
  if (customInput) customInput.value = '';
  questionFlowAdvance();
}

function chooseQuestionOption(label) {
  const flow = state.questionFlow;
  const record = currentQuestionRecord();
  if (!flow || !record) return;
  const question = record.questions[flow.index];
  if (!question) return;
  if (question.type === 'multi') {
    const picked = new Set(flow.draft[question.id] || []);
    if (picked.has(label)) picked.delete(label);
    else picked.add(label);
    flow.draft[question.id] = [...picked];
    delete flow.skipped[question.id];
    renderQuestionFlow();
    return;
  }
  flow.draft[question.id] = [label];
  delete flow.custom?.[question.id];
  delete flow.skipped[question.id];
  questionFlowAdvance();
}

async function submitQuestionFlow() {
  const flow = state.questionFlow;
  const record = currentQuestionRecord();
  if (!flow || !record) return;
  captureQuestionCustom();
  const answers = {};
  for (const question of record.questions || []) {
    const skipped = Boolean(flow.skipped?.[question.id]);
    const custom = String(flow.custom?.[question.id] || '').trim();
    const picked = flow.draft[question.id] || [];
    if (skipped) answers[question.id] = ['（跳过）'];
    else if (custom) answers[question.id] = question.type === 'multi' && picked.length ? [...picked, custom] : [custom];
    else if (picked.length) answers[question.id] = picked;
    else if (question.required !== false) {
      showToast(`请先回答：${question.title}`);
      const index = (record.questions || []).indexOf(question);
      if (index >= 0) {
        flow.index = index;
        renderQuestionFlow();
      }
      return;
    }
  }
  const result = await apiSoft('/api/questions/answer', {
    method: 'POST',
    body: JSON.stringify({ id: record.id, answers }),
  });
  if (!result.ok) {
    showToast(`提交失败：${result.error || '未知错误'}`);
    return;
  }
  state.questionFlow = null;
  applyServerState(result.state);
  render();
  if (state.chat !== `employee:${record.employeeId}`) {
    state.chat = `employee:${record.employeeId}`;
    renderChatDock();
  }
  await sendMessage(result.text || '（已提交选择）');
}

function renderQuestionFlow(force = false) {
  const host = document.getElementById('question-raised');
  if (!host) return;
  const flow = state.questionFlow;
  const record = currentQuestionRecord();
  if (!flow || !record || record.status !== 'pending') {
    host.hidden = true;
    host.innerHTML = '';
    delete host.dataset.qrSignature;
    return;
  }
  const question = record.questions?.[flow.index];
  if (!question) {
    host.hidden = true;
    host.innerHTML = '';
    delete host.dataset.qrSignature;
    return;
  }
  const picked = flow.draft[question.id] || [];
  const custom = String(flow.custom?.[question.id] || '');
  const last = flow.index + 1 >= (record.questions || []).length;
  const signature = [
    record.id,
    record.status,
    flow.index,
    question.id,
    picked.join('|'),
    flow.skipped?.[question.id] ? 'skip' : '',
  ].join(':');
  // 后台轮询会反复调用 renderChatDock；同一个问题且选项没变时不要重建输入框，
  // 否则会打断中文输入法组合，把正在输入的拼音清空。
  if (!force && host.dataset.qrSignature === signature && host.innerHTML.trim()) {
    host.hidden = false;
    return;
  }
  const active = document.activeElement;
  const activeId = active && host.contains(active) ? active.id : '';
  const selectionStart = activeId && typeof active.selectionStart === 'number' ? active.selectionStart : null;
  const selectionEnd = activeId && typeof active.selectionEnd === 'number' ? active.selectionEnd : null;
  const optionRows = (question.options || [])
    .map((option, optionIndex) => {
      const selected = picked.includes(option.label);
      return `<button type="button" class="qr-option ${selected ? 'selected' : ''}" data-action="qr-pick" data-label="${escapeHtml(
        option.label,
      )}">
        <span class="qr-key">${questionLetter(optionIndex)}</span>
        <span class="qr-body"><strong>${escapeHtml(option.label)}</strong>${
          option.desc ? `<em>${escapeHtml(option.desc)}</em>` : ''
        }</span>
        ${selected ? '<span class="qr-check">✓</span>' : ''}
      </button>`;
    })
    .join('');
  host.hidden = false;
  host.dataset.qrSignature = signature;
  const jump = document.getElementById('chat-jump');
  if (jump) jump.hidden = true;
  host.innerHTML = `
    <div class="qr-head">
      <span class="qr-progress">问题 ${flow.index + 1}/${(record.questions || []).length}</span>
      <strong class="qr-title">${escapeHtml(record.title || '需求确认')}</strong>
      <button class="qr-close" type="button" data-action="close-question-flow" aria-label="收起">×</button>
    </div>
    ${question.type === 'multi' ? '<div class="qr-detail">可多选，选完点下一题 / 提交</div>' : ''}
    <div class="qr-qtitle">${escapeHtml(question.title)}${question.required === false ? '<em>（可选）</em>' : ''}</div>
    <div class="qr-options">${optionRows}</div>
    ${
      ` <div class="qr-custom"><span class="qr-key">✎</span>
            <input id="qr-custom-input" type="text" maxlength="300" value="${escapeHtml(custom)}" placeholder="其他答案 / 补充说明，直接输入" />
          </div>`
    }
    <div class="qr-foot">
      <button class="btn ghost small" type="button" data-action="qr-skip" title="跳过这一题，答案记为「（跳过）」">跳过本题</button>
      <button class="btn primary small" type="button" data-action="qr-next">${last ? '提交' : '下一题'}</button>
    </div>`;
  const customInput = document.getElementById('qr-custom-input');
  if (customInput) {
    customInput.addEventListener('input', () => {
      if (!state.questionFlow) return;
      state.questionFlow.custom[question.id] = customInput.value;
    });
    customInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        captureQuestionCustom();
        questionFlowAdvance();
      }
    });
  }
  if (activeId) {
    const next = document.getElementById(activeId);
    if (next) {
      next.focus();
      if (selectionStart !== null && typeof next.setSelectionRange === 'function') {
        next.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  }
}

async function submitQuestion(questionId, options = {}) {
  const record = (state.data.userQuestions || []).find((item) => item.id === questionId);
  if (!record) {
    showToast('问题不存在');
    return;
  }
  // 弹窗与对话里可能同时存在同一张卡，优先读当前弹窗
  const card =
    (options.fromModal
      ? document.querySelector(`#modal-fields .question-card[data-question-id="${questionId}"]`)
      : null) || document.querySelector(`.question-card[data-question-id="${questionId}"]`);
  if (!card) {
    showToast('找不到问题卡片，请刷新后重试');
    return;
  }
  const answers = {};
  for (const question of record.questions || []) {
    const skipInput = card.querySelector(`input[name="skip-${questionId}-${question.id}"]`);
    if (skipInput?.checked) {
      answers[question.id] = ['（跳过）'];
      continue;
    }
    const inputs = [...card.querySelectorAll(`input[name="q-${questionId}-${question.id}"]`)];
    const picked = inputs.filter((input) => input.checked).map((input) => input.value);
    const customInput = card.querySelector(`input[name="custom-${questionId}-${question.id}"]`);
    const custom = String(customInput?.value || '').trim();
    const value = custom ? (question.type === 'multi' && picked.length ? [...picked, custom] : [custom]) : picked;
    if (question.required !== false && !value.length) {
      showToast(`请先回答：${question.title}`);
      return;
    }
    answers[question.id] = value;
  }
  const result = await apiSoft('/api/questions/answer', {
    method: 'POST',
    body: JSON.stringify({ id: questionId, answers }),
  });
  if (!result.ok) {
    showToast(`提交失败：${result.error || '未知错误'}`);
    return;
  }
  applyServerState(result.state);
  if (options.fromModal) closeModal();
  render();
  if (state.chat !== `employee:${record.employeeId}`) {
    state.chat = `employee:${record.employeeId}`;
    renderChatDock();
  }
  await sendMessage(result.text || '（已提交选择）');
}

function renderMessageDeliverables(message) {
  const ids = [...new Set([message.deliverableId, ...(Array.isArray(message.deliverableIds) ? message.deliverableIds : [])].filter(Boolean))];
  if (!ids.length) return '';
  return `<div class="msg-deliverables">${ids
    .map((id) => {
      const item = (state.data.deliverables || []).find((row) => row.id === id);
      const name = item?.name || message.deliverableName || '交付物';
      const status = item?.status || '待验收';
      const ext = deliverableExt(name);
      return `<div class="msg-deliverable" data-action="preview-deliverable" data-id="${escapeHtml(id)}" role="button" tabindex="0" title="点击预览交付物">
        <span class="msg-deliverable-icon ${deliverableIconClass(name)}">${escapeHtml(ext)}</span>
        <div class="msg-deliverable-meta">
          <strong>${escapeHtml(name)}</strong>
          <span>${escapeHtml(status)}${item?.version ? ` · v${item.version}` : ''}</span>
        </div>
        <span class="msg-deliverable-open">打开</span>
      </div>`;
    })
    .join('')}</div>`;
}

function renderMessage(message) {
  if (message.type === 'question') {
    const record = (state.data.userQuestions || []).find((item) => item.id === message.questionId) || message.question;
    if (record && !(state.data.userQuestions || []).some((item) => item.id === record.id)) {
      state.data.userQuestions = [...(state.data.userQuestions || []), record];
    }
    return `<div class="msg system" data-msg-id="${escapeHtml(message.id || '')}">${renderQuestionCard(record, message)}</div>`;
  }
  if (message.type === 'deliverable') {
    return `<div class="msg system" data-msg-id="${escapeHtml(message.id || '')}"><div class="msg-bubble">${formatMessageText(message.text)}</div>${renderMessageDeliverables(message)}</div>`;
  }
  if (message.from === 'system') {
    return `<div class="msg system" data-msg-id="${escapeHtml(message.id || '')}"><div class="msg-bubble">${formatMessageText(message.text)}</div></div>`;
  }
  const isMe = message.from === 'me';
  const emp = isMe ? null : employee(message.from);
  const name = isMe ? '老板' : emp?.name || '员工';
  const color = isMe ? '#e8a33d' : emp?.color || '#8b95a3';

  return `
    <div class="msg ${isMe ? 'me' : ''} ${state.highlightMessage === message.id ? 'highlight' : ''}" data-msg-id="${escapeHtml(message.id)}">
      ${isMe ? '<span class="avatar" style="--c:#e8a33d">我</span>' : avatar(emp)}
      <div class="msg-body">
        <div class="msg-head">
          <span class="msg-name" style="color:${color}">${escapeHtml(name)}</span>
          ${message.internal ? `<span class="tag muted msg-internal-tag">同事沟通</span>` : ''}
          <span class="msg-time">${escapeHtml(message.time)}</span>
        </div>
        ${renderThinkingBlock(message.reasoning, { key: message.id })}
        ${renderToolCards(message.tools || (message.tool ? [message.tool] : []), { key: message.id })}
        <div class="msg-bubble">${formatMessageText(message.text)}</div>
        ${renderMessageDeliverables(message)}
        ${message.interrupted && state.streaming?.resumeOf !== message.id ? '<div class="msg-interrupted"><span class="pill pill-muted">已停止</span><button class="link-btn" type="button" data-action="continue-chat" data-id="' + escapeHtml(message.from) + '">继续生成</button></div>' : ''}
        ${
          message.usage
            ? `<div class="msg-usage">tokens ${Number(message.usage.inputTokens || 0).toLocaleString()} → ${Number(message.usage.outputTokens || 0).toLocaleString()}</div>`
            : ''
        }
        ${
          !isMe && message.from !== 'system'
            ? `<div class="msg-actions"><button type="button" class="msg-action" data-action="task-from-message" data-id="${escapeHtml(message.id)}" data-chat-key="${escapeHtml(state.chat)}">建任务</button></div>`
            : ''
        }
      </div>
    </div>`;
}

function shortToolName(name) {
  return String(name || 'tool')
    .replace(/^mcp__company__/, '')
    .replace(/^mcp__/, '');
}

function prettyToolArgs(tool) {
  const raw = tool?.arguments ?? tool?.detail ?? '';
  if (!raw) return '';
  try {
    return JSON.stringify(typeof raw === 'string' ? JSON.parse(raw) : raw, null, 2);
  } catch {
    return String(raw);
  }
}

function summarizeToolArgs(tool) {
  const pretty = prettyToolArgs(tool).replace(/\s+/g, ' ');
  return pretty.length > 110 ? `${pretty.slice(0, 110)}…` : pretty;
}

function renderToolCards(tools, options = {}) {
  const list = Array.isArray(tools) ? tools.filter(Boolean) : [];
  if (!list.length) return '';
  const key = String(options.key || 'tool');
  const running = list.filter((tool) => !tool.result).length;
  const rows = list
    .map((tool, index) => {
      const name = shortToolName(tool.name);
      const state = tool.isError ? 'error' : tool.result ? 'ok' : 'running';
      const stateLabel = tool.isError ? '失败' : tool.result ? '完成' : '执行中';
      const args = summarizeToolArgs(tool);
      return `<details class="tool-row ${state}" data-detail-key="${escapeHtml(`${key}-row-${index}`)}">
        <summary class="tool-row-head">
          <span class="tool-state-dot"></span>
          <span class="tool-name" title="${escapeHtml(tool.name || '')}">${escapeHtml(name)}</span>
          <span class="tool-args">${escapeHtml(args)}</span>
          <span class="tool-state">${stateLabel}</span>
        </summary>
        <div class="tool-panel">
          <div class="tool-panel-label">参数</div>
          <pre class="tool-pre">${escapeHtml(prettyToolArgs(tool) || '（无）')}</pre>
          ${
            tool.result
              ? `<div class="tool-panel-label">结果</div><pre class="tool-pre tool-pre-result">${escapeHtml(
                  String(tool.result).slice(0, 6000),
                )}</pre>`
              : ''
          }
        </div>
      </details>`;
    })
    .join('');
  return `<details class="tool-group" data-detail-key="${escapeHtml(`${key}-group`)}"${running ? ' open' : ''}>
    <summary class="tool-group-head">
      <span class="tool-group-badge">TOOL</span>
      <span>工具调用 ${list.length}</span>
      ${running ? `<span class="tool-group-live">${running} 个执行中</span>` : ''}
      <span class="tool-group-toggle">${running ? '收起' : '展开'}</span>
    </summary>
    <div class="tool-group-body">${rows}</div>
  </details>`;
}

function renderThinkingBlock(reasoning, options = {}) {
  const text = String(reasoning || '').trim();
  if (!text) return '';
  const preview = text.replace(/\s+/g, ' ').slice(0, 90);
  const key = String(options.key || 'thinking');
  return `<details class="thinking-block" data-detail-key="${escapeHtml(`${key}-thinking`)}"${options.streaming ? ' open' : ''}>
    <summary class="thinking-head">
      <span class="thinking-title">思考过程</span>
      <span class="thinking-preview">${escapeHtml(preview)}${text.length > 90 ? '…' : ''}</span>
      <span class="thinking-count">${text.length} 字</span>
    </summary>
    <div class="thinking-body">${escapeHtml(text)}</div>
  </details>`;
}

function streamingActivityText(streaming) {
  const tools = Array.isArray(streaming.tools) ? streaming.tools : [];
  const running = [...tools].reverse().find((tool) => !tool.result);
  if (running) return `正在调用 ${shortToolName(running.name)}…`;
  const idleMs = Number(streaming.idleMs || 0);
  if (idleMs > 3 * 60_000) {
    const minutes = Math.max(1, Math.round(idleMs / 60_000));
    return `已 ${minutes} 分钟没有新进展，可点停止后重发，或直接插话`;
  }
  if (streaming.text) return '正在输出…';
  if (streaming.reasoning) return '正在整理思路…';
  if (streaming.statusText) return streaming.statusText;
  if (streaming.typing) return '正在思考…';
  return '正在处理…';
}

function renderStreamingMessage(streaming) {
  if (!streaming) return '';
  if (streaming.group) {
    const members = Array.isArray(streaming.members) ? streaming.members : [];
    if (members.length === 0) {
      return `
        <div class="msg system">
          <div class="msg-bubble typing-bubble"><span></span><span></span><span></span> ${escapeHtml(streaming.text || '项目群正在讨论…')}</div>
        </div>`;
    }
    return members
      .map((member) => {
        const emp = employee(member.from);
        return `
          <div class="msg">
            ${avatar(emp)}
            <div class="msg-body">
              <div class="msg-head">
                <span class="msg-name" style="color:${emp?.color || '#6b7280'}">${escapeHtml(emp?.name || '员工')}</span>
                <span class="msg-time">${member.done ? '已回复' : member.text ? '回复中…' : '正在思考…'}</span>
              </div>
              ${renderThinkingBlock(member.reasoning, { streaming: !member.done, key: `stream:${member.from}` })}
              ${renderToolCards(member.tools, { key: `stream:${member.from}` })}
              ${
                member.text
                  ? `<div class="msg-bubble">${formatMessageText(member.text)}</div>`
                  : '<div class="msg-bubble typing-bubble"><span></span><span></span><span></span></div>'
              }
            </div>
          </div>`;
      })
      .join('');
  }
  const emp = employee(streaming.from);
  const name = emp?.name || '员工';
  const color = emp?.color || '#6b7280';
  return `
    <div class="msg">
      ${avatar(emp)}
      <div class="msg-body">
        <div class="msg-head">
          <span class="msg-name" style="color:${color}">${escapeHtml(name)}</span>
          <span class="msg-activity"><span class="activity-shimmer">${escapeHtml(streamingActivityText(streaming))}</span></span>
        </div>
        ${renderThinkingBlock(streaming.reasoning, { streaming: true, key: `stream:${streaming.from || 'employee'}` })}
        ${renderToolCards(streaming.tools, { key: `stream:${streaming.from || 'employee'}` })}
        ${
          streaming.text
            ? `<div class="msg-bubble">${formatMessageText(streaming.text)}</div>`
            : '<div class="msg-bubble typing-bubble"><span></span><span></span><span></span></div>'
        }
      </div>
    </div>`;
}

async function loadAppVersion() {
  try {
    const response = await fetch('/api/health');
    const payload = await response.json();
    const version = String(payload.version || '').trim();
    const el = document.getElementById('app-version');
    if (el) el.textContent = version ? `v${version}` : '';
    if (version) document.title = `一人公司 · v${version}`;
  } catch {
    /* 版本显示失败不影响使用 */
  }
}

function bindComposer() {
  const form = document.getElementById('composer');
  if (!form) return;
  const textarea = form.querySelector('textarea');
  if (!textarea) return;
  // 中文输入法：候选词确认时的 Enter 不能当成“发送”，否则会把拼音/半截文字发出去
  let composing = false;
  textarea.addEventListener('compositionstart', () => {
    composing = true;
  });
  textarea.addEventListener('compositionend', () => {
    composing = false;
  });
  textarea.addEventListener('keydown', (event) => {
    if (event.isComposing || composing || event.keyCode === 229) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void sendMessage(textarea.value);
  });
  textarea.addEventListener('paste', (event) => {
    const files = [...(event.clipboardData?.items || [])]
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile())
      .filter(Boolean);
    if (files.length) {
      event.preventDefault();
      void addAttachmentFiles(files);
    }
  });
  const fileInput = document.getElementById('composer-file-input');
  const imageInput = document.getElementById('composer-image-input');
  fileInput?.addEventListener('change', () => {
    void addAttachmentFiles(fileInput.files);
    fileInput.value = '';
  });
  imageInput?.addEventListener('change', () => {
    void addAttachmentFiles(imageInput.files, 'image');
    imageInput.value = '';
  });
  document.addEventListener('keydown', (event) => {
    if (event.altKey && event.shiftKey && String(event.key).toLowerCase() === 'a') {
      event.preventDefault();
      void captureScreenshot();
    }
  });
  document.getElementById('composer-model')?.addEventListener('change', () => {
    saveComposerSelection();
    renderComposerModels();
  });
  document.getElementById('composer-effort')?.addEventListener('change', () => saveComposerSelection());
  renderComposerModels();
  renderComposerAttachments();
  // 点对话区空白处把焦点交回输入框，避免点了消息后键盘输入没反应
  document.getElementById('dock-body')?.addEventListener('click', (event) => {
    if (event.target.closest('button, a, input, select, textarea, label')) return;
    textarea.focus();
  });
}

/* ---------------- 对话框：附件 / 截图 / 模型 / 思考强度 ---------------- */

function composerAttachments() {
  if (!Array.isArray(state.attachments)) state.attachments = [];
  return state.attachments;
}

function renderComposerAttachments() {
  const el = document.getElementById('composer-attachments');
  if (!el) return;
  const list = composerAttachments();
  if (!list.length) {
    el.hidden = true;
    el.innerHTML = '';
    return;
  }
  el.hidden = false;
  el.innerHTML = list
    .map(
      (item, index) => `<div class="composer-attachment">
        ${
          item.kind === 'image' && item.preview
            ? `<img src="${item.preview}" alt="${escapeHtml(item.name)}" />`
            : `<span class="composer-attachment-icon">${item.kind === 'image' ? '图' : '件'}</span>`
        }
        <span class="composer-attachment-main"><strong>${escapeHtml(item.name)}</strong><em>${formatBytes(item.size || 0)}</em></span>
        <button type="button" class="composer-attachment-remove" data-action="remove-attachment" data-index="${index}" aria-label="移除">×</button>
      </div>`,
    )
    .join('');
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.onerror = () => reject(reader.error || new Error('读取文件失败'));
    reader.readAsDataURL(file);
  });
}

async function addAttachmentFiles(files, forcedKind = '') {
  const list = composerAttachments();
  for (const file of [...files].slice(0, 6)) {
    if (file.size > 12 * 1024 * 1024) {
      showToast(`${file.name} 超过 12MB，已跳过`);
      continue;
    }
    const kind = forcedKind || (file.type.startsWith('image/') ? 'image' : 'file');
    const data = await readFileAsBase64(file);
    list.push({
      name: file.name || (kind === 'image' ? 'image.png' : 'attachment'),
      kind,
      size: file.size,
      data,
      preview: kind === 'image' ? `data:${file.type || 'image/png'};base64,${data}` : '',
    });
  }
  renderComposerAttachments();
}

function addScreenshotAttachment(dataUrl) {
  const base64 = String(dataUrl || '').split(',')[1] || '';
  if (!base64) throw new Error('截图为空');
  composerAttachments().push({
    name: `截图-${new Date().toLocaleTimeString('zh-CN', { hour12: false }).replace(/:/g, '')}.png`,
    kind: 'image',
    size: Math.round((base64.length * 3) / 4),
    data: base64,
    preview: dataUrl,
  });
  renderComposerAttachments();
  showToast('截图已添加到输入框');
}

async function captureScreenshot() {
  try {
    // 桌面端优先走主进程 desktopCapturer，避免 Electron 里 getDisplayMedia 不可用
    if (window.oneCompanyDesktop?.captureScreen) {
      const dataUrl = await window.oneCompanyDesktop.captureScreen();
      addScreenshotAttachment(dataUrl);
      return;
    }
    if (!navigator.mediaDevices?.getDisplayMedia) {
      showToast('当前环境不支持截图');
      return;
    }
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    try {
      const track = stream.getVideoTracks()[0];
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      await video.play();
      await new Promise((resolve) => setTimeout(resolve, 120));
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      addScreenshotAttachment(canvas.toDataURL('image/png'));
    } finally {
      stream.getTracks().forEach((item) => item.stop());
    }
  } catch (error) {
    showToast(`截图失败：${error.message || '已取消'}`);
  }
}

function composerModelEntries() {
  const catalog = state.composerModels || state.modelCatalog;
  const groups = catalog?.groups || [];
  return groups.flatMap((group) =>
    (group.models || []).map((model) => ({
      provider: group.id,
      providerName: group.name,
      id: model.id,
      name: model.name || model.id,
      efforts: model.reasoning?.efforts || [],
      defaultEffort: model.reasoning?.defaultEffort || '',
      reasoning:
        model.reasoning === true || (model.reasoning && typeof model.reasoning === 'object') ? true : model.reasoning === false ? false : undefined,
    })),
  );
}

function composerSelectionKey() {
  return `one-company-composer-model:${state.chat}`;
}

function readComposerSelection() {
  try {
    return JSON.parse(localStorage.getItem(composerSelectionKey()) || 'null') || null;
  } catch {
    return null;
  }
}

function renderComposerModels() {
  const select = document.getElementById('composer-model');
  const effortSelect = document.getElementById('composer-effort');
  if (!select || !effortSelect) return;
  const entries = composerModelEntries();
  const saved = readComposerSelection() || {};
  const chatEmployeeId = state.chat.startsWith('employee:') ? state.chat.slice('employee:'.length) : '';
  const chatEmployee = chatEmployeeId ? employee(chatEmployeeId) : null;
  const profile = chatEmployee?.modelProfile || {};
  const employeeEntry = profile.model
    ? entries.find((item) => item.id === profile.model && (!profile.provider || item.provider === profile.provider))
    : null;
  const current =
    entries.find((item) => item.provider === saved.provider && item.id === saved.model) ||
    employeeEntry ||
    (entries.length ? entries[0] : null);
  const modelKey = JSON.stringify({
    list: entries.map((item) => [item.provider, item.id, item.name, item.reasoning, item.efforts, item.defaultEffort]),
    current: current ? [current.provider, current.id] : null,
    profile: [profile.model || '', profile.effort || ''],
  });
  if (
    renderComposerModels.lastKey === modelKey &&
    select.options.length &&
    !select.matches(':focus') &&
    !effortSelect.matches(':focus')
  ) {
    return;
  }
  renderComposerModels.lastKey = modelKey;
  if (!entries.length) {
    select.innerHTML = '<option value="">未配置模型</option>';
    effortSelect.hidden = true;
    return;
  }
  select.innerHTML = entries
    .map(
      (item) =>
        `<option value="${escapeHtml(`${item.provider}::${item.id}`)}" ${current && current.provider === item.provider && current.id === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`,
    )
    .join('');
  if (current?.reasoning === false) {
    effortSelect.hidden = true;
    effortSelect.innerHTML = '<option value="">该模型不支持思考</option>';
    return;
  }
  // 自定义网关通常没有 reasoning 元数据，给一组通用档位；不支持时后端会自动回退
  const efforts = current?.efforts?.length
    ? current.efforts
    : [
        { id: 'off', name: '快速' },
        { id: 'low', name: '低' },
        { id: 'medium', name: '标准' },
        { id: 'high', name: '深度' },
      ];
  effortSelect.hidden = false;
  const selectedEffort = saved.effort || profile.effort || current.defaultEffort || efforts[0].id;
  effortSelect.innerHTML = efforts
    .map(
      (effort) =>
        `<option value="${escapeHtml(effort.id)}" ${effort.id === selectedEffort ? 'selected' : ''}>${escapeHtml(effort.name || effort.id)}</option>`,
    )
    .join('');
}

function saveComposerSelection() {
  const select = document.getElementById('composer-model');
  const effortSelect = document.getElementById('composer-effort');
  if (!select) return {};
  const [provider, model] = String(select.value || '').split('::');
  const selection = { provider, model, effort: effortSelect && !effortSelect.hidden ? effortSelect.value : '' };
  try {
    localStorage.setItem(composerSelectionKey(), JSON.stringify(selection));
  } catch {
    /* ignore */
  }
  return selection;
}

async function loadComposerModels() {
  try {
    const payload = await api('/api/models');
    state.composerModels = payload.catalog || null;
  } catch {
    state.composerModels = state.composerModels || null;
  }
  renderComposerModels();
}


const REPLY_POOL = {
  'e-jiang': ['收到，我先拆成任务，10 分钟后给你方案。', '明白，我记到今天的任务里了。', '这件事建议你拍板，我放收件箱了。'],
  'e-lin': ['收到，我先出个提纲。', '这个方向可以，我下午给你初稿。', '我先对齐一下平台排期，再回复你。'],
  'e-guyuan': ['收到，我今晚出粗剪。', '这个镜头可以再压 2 秒，节奏会更紧。', '导出前我会先发你确认。'],
  'e-zhou': ['灰模已经完成，我先拆件。', '支撑需要再调两处，今晚能好。', '打印参数我让陈默一起看。'],
  'e-chenmo': ['收到，我先检查文件和支撑。', '这单我接，预计明天下午打完。', '质检我会拍照留档。'],
  'e-suyu': ['收到，我先查一下订单记录。', '这句话术可以，我改到 v2 里。', '涉及退款的我先问你，不直接承诺。'],
  'e-he': ['排期我登记好了。', '资料我归档到项目目录了。', '平台后台我下午再看一遍。'],
  'e-bailu': ['我先审一遍，再给你结论。', '这个岗位说明需要补一条权限边界。', '收到，我排到明天的审阅任务里。'],
  'e-zheng': ['报价我算好了，成本口径见附件。', '这笔支出需要你确认。', '我先对一下本周的账。'],
};

const PROJECT_REPLY_POOL = ['收到，我跟进一下。', '我先看一下当前进度，稍后回报。', '这个需要江叙协调，我去找他。', '明白，我更新到任务板。'];

async function updateTaskMandate(taskId, action) {
  try {
    const payload = await api('/api/tasks/mandate', {
      method: 'POST',
      body: JSON.stringify({ taskId, action }),
    });
    if (payload.state) applyServerState(payload.state);
    closeModal();
    render();
    showToast(action === 'revoke' ? '任务授权已撤销' : '任务已重新授权');
  } catch (error) {
    showToast(`授权操作失败：${error.message || error}`);
  }
}

async function sendMessage(raw, options = {}) {
  let text = String(raw || '').trim();
  const pending = [...composerAttachments()];
  if (!text && !pending.length) return;
  const key = state.chat;
  const meta = chatMeta(key);
  if (!state.data.chats[key]) state.data.chats[key] = [];

  // 先把附件落到员工工位，再随消息发送路径
  const attachments = [];
  if (pending.length) {
    for (const item of pending) {
      const result = await apiSoft('/api/chat/upload', {
        method: 'POST',
        body: JSON.stringify({ employeeId: meta.id || 'e-jiang', name: item.name, kind: item.kind, data: item.data }),
      });
      if (result.ok && result.attachment) attachments.push(result.attachment);
      else showToast(`附件「${item.name}」上传失败：${result.error || '未知错误'}`);
    }
    state.attachments = [];
    renderComposerAttachments();
    if (attachments.length && !text) text = `发来 ${attachments.length} 个附件，请查看。`;
  }

  const selection = saveComposerSelection();
  const userMessage = {
    id: `m-${Date.now()}`,
    from: 'me',
    time: nowTime(),
    type: 'text',
    text,
    attachments: attachments.map((item) => ({ name: item.name, kind: item.kind, path: item.path, mediaType: item.mediaType })),
  };
  if (!options.resume) state.data.chats[key].push(userMessage);
  const activeStream = state.streaming && state.streaming.chatKey === key ? state.streaming : null;
  renderChatDock({ forceScroll: true });
  const composer = document.querySelector('#composer textarea');
  if (composer) composer.value = '';

  if (meta.kind === 'employee') {
    // 员工正在处理这一轮时，老板再发的话不新开一条流，直接 steer 插进当前 turn。
    if (activeStream && !options.resume) {
      const steered = await apiSoft('/api/chat/steer', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: meta.id,
          text,
          attachments,
          projectId: state.filterProject && state.filterProject !== 'all' ? state.filterProject : '',
          clientMessageId: userMessage.id,
        }),
      });
      if (steered.ok) {
        state.streaming.statusText = '已插话，员工会在当前步骤结束后处理…';
        state.streaming.steeredAt = Date.now();
        renderChatDock({ forceScroll: true });
        showToast('已插话：员工当前步骤结束后就会看到', 'ok');
        return;
      }
      // 没有可插话的会话（比如刚好结束了）就走普通发送，不丢消息
    }
    state.streaming = { chatKey: key, from: meta.id, text: '', tools: [], typing: true, statusText: '正在思考…' };
    state.chatStopping = false;
    state.chatRunId = '';
    renderChatDock();
    streamChat('/api/chat/stream', { employeeId: meta.id, text, attachments, projectId: state.filterProject && state.filterProject !== 'all' ? state.filterProject : '', resume: Boolean(options.resume), clientMessageId: userMessage.id, model: selection.model || '', provider: selection.provider || '', reasoningEffort: selection.effort || '' }, (event) => handleStreamEvent(event, key))
      .catch((error) => {
        state.streaming = null;
        state.chatStopping = false;
        state.chatRunId = '';
        if (error.payload && error.payload.state) applyServerState(error.payload.state);
        render();
        showToast(`真实会话失败：${error.message}`);
      });
    return;
  }

  if (meta.kind === 'project') {
    state.streaming = {
      chatKey: key,
      from: null,
      text: '项目群正在讨论…',
      tools: [],
      typing: true,
      group: true,
      members: [],
    };
    renderChatDock();
    streamChat('/api/group-chat/stream', { projectId: meta.id, text }, (event) =>
      handleStreamEvent(event, key),
    ).catch((error) => {
      state.streaming = null;
      if (error.payload && error.payload.state) applyServerState(error.payload.state);
      render();
      showToast(`项目群对话失败：${error.message}`);
    });
  }
}

function ensureGroupMember(stream, from) {
  if (!Array.isArray(stream.members)) stream.members = [];
  let member = stream.members.find((item) => item.from === from);
  if (!member) {
    member = { from, text: '', tools: [], done: false };
    stream.members.push(member);
  }
  return member;
}

function handleStreamEvent(event, chatKey) {
  if (!event || !event.type) return;
  if (event.type === 'mux-snapshot') {
    const snapshot = event.snapshot || {};
    if (snapshot.group) {
      if (!state.streaming || state.streaming.chatKey !== chatKey) {
        state.streaming = { chatKey, group: true, members: [], text: snapshot.text || '', tools: [] };
      } else {
        state.streaming.group = true;
        state.streaming.text = snapshot.text || state.streaming.text;
      }
    } else {
      state.streaming = {
        chatKey,
        from: snapshot.from || '',
        text: snapshot.text || '',
        reasoning: snapshot.reasoning || '',
        tools: Array.isArray(snapshot.tools) ? snapshot.tools : [],
        typing: false,
      };
    }
    if (state.chat === chatKey) renderChatDock();
    return;
  }
  if (event.type === 'run') {
    state.chatRunId = event.runId || '';
    state.chatStopping = false;
  } else if (event.type === 'group-status') {
    if (!state.streaming || state.streaming.chatKey !== chatKey) {
      state.streaming = {
        chatKey,
        text: event.text || '项目群正在讨论…',
        tools: [],
        group: true,
        members: [],
      };
    } else {
      state.streaming.group = true;
      if (!state.streaming.members) state.streaming.members = [];
      state.streaming.text = event.text || state.streaming.text;
    }
    if (state.chat === chatKey) renderChatDock();
  } else if (event.type === 'member-start') {
    if (!state.streaming || state.streaming.chatKey !== chatKey) {
      state.streaming = { chatKey, group: true, members: [], text: '', tools: [] };
    }
    state.streaming.group = true;
    ensureGroupMember(state.streaming, event.from);
    if (state.chat === chatKey) renderChatDock();
  } else if (event.type === 'status') {
    if (!state.streaming || state.streaming.chatKey !== chatKey) {
      state.streaming = { chatKey, from: event.from, text: '', tools: [], typing: true };
    }
    state.streaming.from = event.from;
    state.streaming.statusText = event.text || state.streaming.statusText || '';
    state.streaming.heartbeatAt = Date.now();
    if (state.chat === chatKey) renderChatDock();
  } else if (event.type === 'heartbeat') {
    if (state.streaming && state.streaming.chatKey === chatKey) {
      state.streaming.idleMs = Number(event.idleMs || 0);
      state.streaming.heartbeatAt = Date.now();
      if (state.chat === chatKey) renderChatDock();
    }
  } else if (event.type === 'reasoning') {
    if (!state.streaming || state.streaming.chatKey !== chatKey) {
      state.streaming = { chatKey, from: event.from, text: '', tools: [], typing: true, reasoning: '' };
    }
    if (state.streaming.group) {
      const member = ensureGroupMember(state.streaming, event.from);
      member.reasoning = (member.reasoning || '') + (event.text || '');
    } else {
      state.streaming.reasoning = (state.streaming.reasoning || '') + (event.text || '');
    }
    if (state.chat === chatKey) renderChatDock();
  } else if (event.type === 'tool') {
    if (!state.streaming) state.streaming = { chatKey, from: event.from, text: '', tools: [], typing: true };
    if (state.streaming.group) {
      const member = ensureGroupMember(state.streaming, event.from);
      member.tools = member.tools || [];
      member.tools.push(event.tool);
    } else {
      state.streaming.tools = state.streaming.tools || [];
      state.streaming.tools.push(event.tool);
    }
    if (state.chat === chatKey) renderChatDock();
  } else if (event.type === 'tool-update') {
    if (state.streaming && state.streaming.chatKey === chatKey) {
      const pools = state.streaming.group
        ? (state.streaming.members || []).map((member) => member.tools || [])
        : [state.streaming.tools || []];
      for (const pool of pools) {
        const tool = pool.find((item) => item && item.callId && item.callId === event.callId);
        if (tool) {
          tool.result = event.result || tool.result || '';
          tool.isError = Boolean(event.isError);
          break;
        }
      }
      if (state.chat === chatKey) renderChatDock();
    }
  } else if (event.type === 'approval') {
    showToast(`审批已进入收件箱：${event.toolName || '操作'}`, 'warn');
    void refreshInboxState();
    loadNotifications();
  } else if (event.type === 'chunk') {
    if (!state.streaming) {
      state.streaming = { chatKey, from: event.from, text: '', tools: [], typing: false };
    }
    if (state.streaming.group) {
      const member = ensureGroupMember(state.streaming, event.from);
      member.text += event.text || '';
    } else {
      state.streaming.text += event.text || '';
      state.streaming.typing = false;
    }
    if (state.chat === chatKey) renderChatDock();
  } else if (event.type === 'member-done') {
    if (state.streaming && state.streaming.group) {
      const member = ensureGroupMember(state.streaming, event.from);
      if (!member.text && event.message) member.text = event.message.text || '';
      if (event.message && Array.isArray(event.message.tools)) member.tools = event.message.tools;
      member.done = true;
    }
    if (state.chat === chatKey) renderChatDock();
  } else if (event.type === 'done') {
    if (state.streaming && state.streaming.chatKey && state.streaming.chatKey !== chatKey) return;
    state.streaming = null;
    state.chatRunId = '';
    state.chatStopping = false;
    applyServerState(event.state);
    if (event.interrupted) {
      showToast(
        event.reason === 'timeout'
          ? '生成超时，已保留已生成的内容；可点“继续生成”接着写'
          : '已停止生成，可点“继续生成”接着写',
      );
    }
    render();
  } else if (event.type === 'error') {
    if (state.streaming && state.streaming.chatKey && state.streaming.chatKey !== chatKey) return;
    state.streaming = null;
    state.chatRunId = '';
    state.chatStopping = false;
    if (event.state) applyServerState(event.state);
    render();
    showToast(`真实会话失败：${event.error || '未知错误'}`);
  }
}

async function stopChat() {
  if (state.chatStopping) return;
  const meta = chatMeta(state.chat);
  if (!state.chatRunId && meta.kind !== 'employee') return;
  state.chatStopping = true;
  renderChatDock();
  try {
    await api('/api/chat/cancel', { method: 'POST', body: JSON.stringify({ runId: state.chatRunId, employeeId: meta.kind === 'employee' ? meta.id : '' }) });
    showToast('已发送停止指令');
  } catch (error) {
    state.chatStopping = false;
    renderChatDock();
    showToast(`停止失败：${error.message}`);
  }
}

async function resumeChat(employeeId) {
  if (employeeId) state.chat = `employee:${employeeId}`;
  const key = state.chat;
  const meta = chatMeta(key);
  const messages = state.data.chats[key] || [];
  const interrupted = [...messages].reverse().find((message) => message.from === meta.id && message.interrupted);
  if (!interrupted) {
    await sendMessage('继续上次未完成的回复', { resume: true });
    return;
  }
  // 不新增用户消息、不重新发原问题：只把同一轮的游标往后续读
  state.streaming = { chatKey: key, from: meta.id, text: '', tools: [], typing: true, resumeOf: interrupted.id };
  state.chatStopping = false;
  state.chatRunId = '';
  renderChatDock();
  try {
    await streamChat(
      '/api/chat/stream',
      {
        employeeId: meta.id,
        text: '继续上次未完成的回复',
        resume: true,
        resumeMessageId: interrupted.id,
        projectId: state.filterProject && state.filterProject !== 'all' ? state.filterProject : '',
      },
      (event) => handleStreamEvent(event, key),
    );
  } catch (error) {
    state.streaming = null;
    state.chatStopping = false;
    state.chatRunId = '';
    if (error.payload && error.payload.state) applyServerState(error.payload.state);
    render();
    showToast(`续写失败：${error.message}`);
  }
}

function continueChat(employeeId) {
  void resumeChat(employeeId);
}

const CHAT_SCROLL_STORE_KEY = 'one-company-chat-scroll-v1';

function readStoredChatScroll() {
  try {
    const raw = sessionStorage.getItem(CHAT_SCROLL_STORE_KEY);
    const value = raw ? JSON.parse(raw) : null;
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

function persistChatScrollPositions() {
  try {
    sessionStorage.setItem(CHAT_SCROLL_STORE_KEY, JSON.stringify(state.chatScrollPositions || {}));
  } catch {
    /* 隐私模式忽略 */
  }
}

function saveChatScrollPosition(key) {
  const stream = document.getElementById('chat-stream');
  if (!key || !stream) return;
  if (!state.chatScrollPositions) state.chatScrollPositions = {};
  state.chatScrollPositions[key] = {
    top: stream.scrollTop,
    atBottom: chatNearBottom(stream),
  };
  persistChatScrollPositions();
}

function chatNearBottom(stream) {
  if (!stream) return true;
  return stream.scrollHeight - stream.scrollTop - stream.clientHeight < 80;
}

function updateChatJump(show) {
  const button = document.getElementById('chat-jump');
  if (!button) return;
  button.hidden = !show;
}

let chatJumpingUntil = 0;

function scrollChat(force = true, smooth = false) {
  const stream = document.getElementById('chat-stream');
  if (!stream) return;
  if (!force && !chatNearBottom(stream)) return;
  if (smooth) {
    chatJumpingUntil = Date.now() + 900;
    stream.scrollTo({ top: stream.scrollHeight, behavior: 'smooth' });
  } else {
    chatJumpingUntil = 0;
    stream.scrollTop = stream.scrollHeight;
  }
  updateChatJump(false);
}

function showTyping() {
  const stream = document.getElementById('chat-stream');
  if (!stream) return;
  const existing = document.getElementById('typing-indicator');
  if (existing) existing.remove();
  const wrap = document.createElement('div');
  wrap.className = 'msg typing';
  wrap.id = 'typing-indicator';
  wrap.innerHTML = `
    <span class="avatar" style="--c:#d97706">江</span>
    <div class="msg-body">
      <div class="msg-head">
        <span class="msg-name" style="color:#d97706">江叙</span>
        <span class="msg-time">正在思考…</span>
      </div>
      <div class="msg-bubble typing-bubble"><span></span><span></span><span></span></div>
    </div>`;
  const stick = chatNearBottom(stream);
  stream.appendChild(wrap);
  if (stick) stream.scrollTop = stream.scrollHeight;
}

/* ---------------- dock resize ---------------- */

function applyDockHeight() {
  const dock = document.getElementById('chat-dock');
  const button = document.getElementById('dock-toggle');
  if (!dock) return;
  dock.style.height = state.dockCollapsed ? '58px' : `${state.dockHeight}px`;
  dock.classList.toggle('collapsed', state.dockCollapsed);
  if (button) button.textContent = state.dockCollapsed ? '展开' : '收起';
}

function initDockResize() {
  const handle = document.getElementById('dock-resizer');
  if (!handle) return;

  let dragging = false;
  let startY = 0;
  let startHeight = 0;

  handle.addEventListener('pointerdown', (event) => {
    dragging = true;
    startY = event.clientY;
    startHeight = state.dockHeight;
    state.dockCollapsed = false;
    applyDockHeight();
    handle.setPointerCapture(event.pointerId);
    document.body.classList.add('resizing');
    event.preventDefault();
  });

  handle.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const max = Math.max(220, Math.round(window.innerHeight * 0.7));
    const next = Math.min(max, Math.max(120, startHeight + (startY - event.clientY)));
    state.dockHeight = next;
    applyDockHeight();
  });

  const stop = (event) => {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove('resizing');
    try {
      handle.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    try {
      localStorage.setItem('one-company-dock-height', String(state.dockHeight));
    } catch {
      /* ignore */
    }
    scrollChat();
  };

  handle.addEventListener('pointerup', stop);
  handle.addEventListener('pointercancel', stop);
}

/* ---------------- right panel ---------------- */

function renderPanel() {
  const host = document.getElementById('panel');
  if (!host) return;
  if (state.panel === 'memories') state.panel = 'employees';

  document.querySelectorAll('.panel-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.panel === state.panel);
  });

  const activeTasks = (state.data.tasks || []).filter((item) => !item.archived);
  const activeDeliverables = (state.data.deliverables || []).filter((item) => !item.archived);
  const openTaskCount = activeTasks.filter((item) => item.status !== '已完成').length;
  const counts = {
    tasks: `任务 ${openTaskCount}`,
    deliverables: `交付 ${activeDeliverables.length}`,
    servers: `服务器 ${(state.servers || []).length}`,
    employees: `员工 ${(state.data.employees || []).filter((item) => !item.archived).length}`,
  };
  document.querySelectorAll('.panel-tab').forEach((tab) => {
    if (counts[tab.dataset.panel]) tab.textContent = counts[tab.dataset.panel];
  });

  if (state.panel === 'tasks') {
    const openTasks = activeTasks.filter((item) => item.status !== '已完成');
    const doneTasks = activeTasks.filter((item) => item.status === '已完成');
    const sortedOpen = [...openTasks].sort((a, b) => panelTaskRank(a) - panelTaskRank(b));
    host.innerHTML = `
      <div class="panel-section-title"><span>活跃任务</span><span>${openTasks.length}</span></div>
      ${sortedOpen.map(renderPanelTask).join('') || '<div class="empty small">没有活跃任务。</div>'}
      ${
        doneTasks.length
          ? `<button class="panel-more" type="button" data-action="toggle-panel-done">${state.panelShowDone ? '收起已完成' : `查看已完成 ${doneTasks.length}`}</button>
             ${state.panelShowDone ? doneTasks.map(renderPanelTask).join('') : ''}`
          : ''
      }`;
  } else if (state.panel === 'deliverables') {
    host.innerHTML = `
      <div class="panel-section-title"><span>交付物</span><span>${activeDeliverables.length}</span></div>
      ${activeDeliverables.map(renderPanelDeliverable).join('') || '<div class="empty small">没有待查看的交付物。</div>'}`;
  } else if (state.panel === 'servers') {
    host.innerHTML = renderPanelServers();
  } else {
    host.innerHTML = renderPanelEmployees();
  }
}

function panelTaskRank(task) {
  if (task.lastRun?.status === 'running') return 0;
  if (task.status === '进行中') return 1;
  if (task.status === '待办') return 2;
  if (task.status === '待验收') return 3;
  if (task.status === '阻塞') return 4;
  return 5;
}

function renderPanelTask(task) {
  const done = state.taskDone.has(task.id) || task.status === '已完成';
  const emp = employee(task.assignee);
  const proj = project(task.project);
  return `
    <div class="task-item ${done ? 'done' : ''}" data-action="edit-task" data-id="${task.id}" role="button" tabindex="0" title="点击查看任务详情">
      <button class="task-check ${done ? 'done' : ''}" type="button" data-action="toggle-task" data-id="${task.id}" title="切换完成">✓</button>
      <div class="task-info">
        <div class="task-title">${escapeHtml(task.title)}</div>
        <div class="task-meta"><span>${escapeHtml(emp?.name || '')}</span><span>·</span><span>${escapeHtml(proj?.name || (task.company ? '公司事务' : ''))}</span></div>
      </div>
      <span class="task-status">${escapeHtml(task.status)}</span>
      <span class="panel-item-arrow">›</span>
    </div>`;
}

function renderPanelDeliverable(item) {
  const emp = employee(item.owner);
  return `
    <div class="deliverable-item" data-action="preview-deliverable" data-id="${item.id}" role="button" tabindex="0" title="点击查看交付物">
      <span class="file-icon ${deliverableIconClass(item.name)}">${escapeHtml(deliverableExt(item.name))}</span>
      <div class="deliverable-info">
        <div class="deliverable-name">${escapeHtml(item.name)}</div>
        <div class="deliverable-meta">${escapeHtml(emp?.name || '')} · ${escapeHtml(item.status)} · ${escapeHtml(item.time)}</div>
      </div>
      <span class="panel-item-arrow">›</span>
    </div>`;
}

function renderPanelMemory(item) {
  return `
    <div class="memory-item">
      <span class="file-icon md">MD</span>
      <div class="memory-info">
        <div class="memory-name">${escapeHtml(item.name)}</div>
        <div class="memory-path">${escapeHtml(item.path)}</div>
      </div>
    </div>`;
}

/* ---------------- main render ---------------- */

function render() {
  updateNav();
  updateHeader();
  updateModelWarning();

  const view = document.getElementById('view');
  if (state.view === 'deliverables') view.innerHTML = renderDeliverablesPage();
  else if (state.view === 'previewdesk') view.innerHTML = renderPreviewDeskPage();
  else if (state.view === 'tasks') view.innerHTML = renderTasksPage();
  else if (state.view === 'memories') view.innerHTML = renderMemoriesPage();
  else if (state.view === 'documents') view.innerHTML = renderDocumentsPage();
  else if (state.view === 'skills') view.innerHTML = renderSkillsPage();
  else if (state.view === 'tools') view.innerHTML = renderToolsPage();
  else if (state.view === 'devices') view.innerHTML = renderDevicesPage();
  else if (state.view === 'experts') view.innerHTML = renderExpertsPage();
  else if (state.view === 'data') view.innerHTML = renderDataPage();
  else if (state.view === 'projectfiles') view.innerHTML = renderProjectFilesPage();
  else if (state.view === 'inbox') view.innerHTML = renderInboxPage();
  else if (state.view === 'projects') view.innerHTML = renderProjectsPage();
  else if (state.view === 'project-detail') view.innerHTML = renderProjectDetailPage();
  else if (state.view === 'employees') view.innerHTML = renderEmployeesPage();
  else if (state.view === 'ledger') view.innerHTML = renderLedgerPage();
  else if (state.view === 'reports') view.innerHTML = renderReportsPage();
  else if (state.view === 'meetings') view.innerHTML = renderMeetingsPage();
  else if (state.view === 'org') view.innerHTML = renderOrgPage();
  else if (state.view === 'teams') view.innerHTML = renderTeamsPage();
  else if (state.view === 'automation') view.innerHTML = renderAutomationPage();
  else if (state.view === 'audit') view.innerHTML = renderAuditPage();
  else if (state.view === 'notifications') view.innerHTML = renderNotificationsPage();
  else if (state.view === 'workstations') view.innerHTML = renderWorkstationsPage();
  else if (state.view === 'datacenter') view.innerHTML = renderDatacenterPage();
  else if (state.view === 'gateway') view.innerHTML = renderGatewayPage();
  else if (state.view === 'templates') view.innerHTML = renderTemplatesPage();
  else if (state.view === 'search') view.innerHTML = renderSearchPage();
  else view.innerHTML = renderDeliverablesPage();

  hydrateIcons(view);
  updateDecisionCount();
  renderChatDock();
  renderPanel();
}

/* ---------------- events ---------------- */

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function resolveDecision(id, result, selectedKey = '') {
  const decision = state.data.decisions.find((item) => item.id === id);
  if (result === 'approve' && !selectedKey) {
    showToast('请先选择一个选项');
    return;
  }
  const selected = (decision?.options || []).find((item) => item.key === selectedKey);
  state.resolved.add(id);
  showToast(
    result === 'approve'
      ? `已选择 ${selectedKey}${selected ? ` · ${selected.label}` : ''}`
      : `已退回：${decision?.title || ''}`,
  );
  render();
  api('/api/decisions/resolve', { method: 'POST', body: JSON.stringify({ id, result, selectedKey }) })
    .then((payload) => {
      applyServerState(payload.state);
      render();
    })
    .catch((error) => {
      state.resolved.delete(id);
      render();
      showToast(`决策保存失败：${error.message}`);
    });
}

async function reviewDeliverable(id, action, comment = '') {
  try {
    const payload = await api('/api/deliverables/review', {
      method: 'POST',
      body: JSON.stringify({ id, action, comment }),
    });
    applyServerState(payload.state);
    render();
    showToast(action === 'approve' ? '交付物已通过，任务已完成' : '交付物已打回，意见已回到责任员工');
  } catch (error) {
    showToast(`验收失败：${error.message}`);
  }
}

async function decideApproval(id, action, comment = '', allowSimilar = false) {
  try {
    let payload;
    try {
      // 审批结果走同一条 WebSocket 多路复用通道
      payload = await muxRequest({ type: 'approval.decide', payload: { id, action, comment, allowSimilar } });
    } catch {
      payload = await api('/api/approvals/decide', {
        method: 'POST',
        body: JSON.stringify({ id, action, comment, allowSimilar }),
      });
    }
    if (!payload.ok) throw new Error(payload.error || '审批失败');
    if (payload.state) applyServerState(payload.state);
    render();
    void loadNotifications();
    showToast(action === 'approve' ? '已批准写操作' : '已拒绝写操作');
  } catch (error) {
    showToast(`审批失败：${error.message}`);
  }
}

function openTaskSource(taskId) {
  const task = state.data.tasks.find((item) => item.id === taskId);
  if (!task || !task.source) return;
  state.chat = task.source.chatKey;
  state.highlightMessage = task.source.messageId;
  state.view = 'deliverables';
  render();
  setTimeout(() => {
    const message = document.querySelector(`[data-msg-id="${task.source.messageId}"]`);
    message?.scrollIntoView({ block: 'center' });
  }, 80);
  setTimeout(() => {
    state.highlightMessage = null;
    document.querySelectorAll('.msg.highlight').forEach((item) => item.classList.remove('highlight'));
  }, 3200);
}

/* ---------------- 机房 actions ---------------- */

function openEmployeeChat(employeeId) {
  if (!employee(employeeId)) return;
  state.chat = `employee:${employeeId}`;
  state.view = 'employees';
  state.dockCollapsed = false;
  state.dockHeight = Math.max(360, Math.round(window.innerHeight * 0.62));
  applyDockHeight();
  render();
  setTimeout(scrollChat, 100);
  showToast(`已进入 ${employee(employeeId)?.name || '员工'} 的对话`);
}

async function checkServers() {
  state.serversLoading = true;
  render();
  try {
    const payload = await api('/api/servers/check', { method: 'POST', body: JSON.stringify({}) });
    state.servers = payload.servers || [];
    state.serverCheckAt = payload.checkedAt || '';
    render();
    showToast('服务器状态已刷新');
  } catch (error) {
    state.serversLoading = false;
    render();
    showToast(`检查失败：${error.message}`);
  }
}

async function runServerServiceAction(serverId, serviceId, operation, button) {
  const service = serverById(serverId)?.services?.find((item) => item.id === serviceId);
  const label = operation === 'start' ? '启动' : operation === 'stop' ? '停止' : '重启';
  if (operation !== 'start' && !window.confirm(`确定要${label}「${service?.name || '这个服务'}」吗？`)) return;
  state.serverActionBusy = serviceId;
  if (button) button.disabled = true;
  try {
    const payload = await api('/api/servers/action', {
      method: 'POST',
      body: JSON.stringify({ serverId, serviceId, action: operation }),
    });
    await loadServers(true);
    render();
    showToast(`${service?.name || '服务'}已${label}`);
  } catch (error) {
    state.serverActionBusy = '';
    render();
    showToast(`${label}失败：${error.message}`);
  }
}

async function deleteServer(serverId) {
  const server = serverById(serverId);
  if (!window.confirm(`删除服务器「${server?.name || ''}」？只删除登记信息，不会卸载服务器上的文件。`)) return;
  try {
    const payload = await api('/api/servers/delete', { method: 'POST', body: JSON.stringify({ id: serverId }) });
    applyServerState(payload.state);
    state.selectedServerId = '';
    await loadServers(true);
    render();
    showToast('服务器登记已删除');
  } catch (error) {
    showToast(`删除失败：${error.message}`);
  }
}

async function deleteServerService(serverId, serviceId) {
  const service = serverById(serverId)?.services?.find((item) => item.id === serviceId);
  if (!window.confirm(`删除服务「${service?.name || ''}」？只删除登记信息，不会卸载服务器上的文件。`)) return;
  try {
    const payload = await api('/api/servers/service/delete', {
      method: 'POST',
      body: JSON.stringify({ serverId, serviceId }),
    });
    applyServerState(payload.state);
    await loadServers(true);
    render();
    showToast('服务登记已删除');
  } catch (error) {
    showToast(`删除失败：${error.message}`);
  }
}

function openServerConsole(serverId, serviceId) {
  const server = serverById(serverId);
  const service = server?.services?.find((item) => item.id === serviceId);
  if (!service?.manageUrl) {
    showToast('这个服务还没有配置管理台 URL');
    return;
  }
  openConsolePreview(serverId, serviceId);
}

async function openServiceLog(serverId, serviceId) {
  const server = serverById(serverId);
  const service = server?.services?.find((item) => item.id === serviceId);
  if (!server || !service) return;
  openModal('service-log', serviceId, serverId);
  const target = document.getElementById('service-log-body');
  if (!target) return;
  target.textContent = '正在读取日志…';
  try {
    const payload = await api(`/api/servers/log?serverId=${encodeURIComponent(serverId)}&serviceId=${encodeURIComponent(serviceId)}&lines=200`);
    if (!payload.log) {
      target.innerHTML = `<div class="modal-note">还没有日志。服务启动后会写入 <code>${escapeHtml(payload.path || 'data/server-logs/')}</code>。</div>`;
      return;
    }
    target.innerHTML = `<div class="preview-meta">${escapeHtml(payload.path || '')} · ${formatBytes(payload.size || 0)} · 最近 200 行</div><pre class="preview-text service-log-text">${escapeHtml(payload.log)}</pre>`;
    const pre = target.querySelector('pre');
    if (pre) pre.scrollTop = pre.scrollHeight;
  } catch (error) {
    target.textContent = `读取日志失败：${error.message}`;
  }
}



async function generateReport(kind) {
  showToast(kind === 'weekly' ? '正在生成本周周报…' : '正在生成今日日报…');
  try {
    const payload = await api('/api/reports/generate', { method: 'POST', body: JSON.stringify({ kind }) });
    applyServerState(payload.state);
    await loadP1Data();
    render();
    openModal('report-preview', payload.report.id);
    showToast('报告已生成');
  } catch (error) {
    showToast(`生成失败：${error.message}`);
  }
}

function appendMeetingLive(html) {
  const body = document.getElementById('meeting-live-body');
  if (!body) return;
  body.insertAdjacentHTML('beforeend', html);
  const live = document.getElementById('meeting-live');
  if (live) live.scrollTop = live.scrollHeight;
}

async function runMeeting(id) {
  const meeting = state.meetings.find((item) => item.id === id);
  if (!meeting) return;
  state.meetingStreaming = { id, round: 0, from: '' };
  state.meetingId = id;
  render();
  const statusEl = document.getElementById('meeting-live-status');
  if (statusEl) statusEl.textContent = '正在发言…';
  let current = null;
  try {
    await streamChat('/api/meetings/run', { id }, (event) => {
      if (event.type === 'meeting-round') {
        appendMeetingLive(`<div class="meeting-round-divider">第 ${event.round} 轮</div>`);
      } else if (event.type === 'meeting-member-start') {
        current = { from: event.from, name: event.name, text: '' };
        appendMeetingLive(`<div class="meeting-message streaming"><span class="avatar small" style="--c:${employee(event.from)?.color || '#999'}">${escapeHtml((event.name || '员')[0])}</span><div class="meeting-message-body"><div class="meeting-message-head"><strong>${escapeHtml(event.name)}</strong><span class="hint">第 ${event.round} 轮 · 发言中…</span></div><div class="meeting-message-text" data-live-text></div></div></div>`);
      } else if (event.type === 'meeting-chunk') {
        const el = document.querySelector('[data-live-text]');
        if (el) el.textContent += event.text;
        if (current) current.text += event.text;
        const live = document.getElementById('meeting-live');
        if (live) live.scrollTop = live.scrollHeight;
      } else if (event.type === 'meeting-member-done') {
        const message = event.message;
        if (current && message) {
          state.meetings = state.meetings.map((item) =>
            item.id === id ? { ...item, messages: [...(item.messages || []), message] } : item,
          );
        }
        current = null;
        render();
        setTimeout(() => {
          const live = document.getElementById('meeting-live');
          if (live) live.scrollTop = live.scrollHeight;
        }, 30);
      } else if (event.type === 'meeting-done') {
        applyServerState(event.state);
        state.meetings = event.state.meetings || state.meetings;
        state.reports = event.state.reports || state.reports;
        state.meetingStreaming = null;
        render();
        showToast('会议结束，纪要已生成');
      } else if (event.type === 'meeting-error') {
        applyServerState(event.state);
        state.meetings = event.state?.meetings || state.meetings;
        state.meetingStreaming = null;
        render();
        showToast(`会议中断：${event.error}`);
      }
    });
  } catch (error) {
    state.meetingStreaming = null;
    render();
    showToast(`会议失败：${error.message}`);
  }
}

async function endMeeting(id) {
  try {
    const payload = await api('/api/meetings/end', { method: 'POST', body: JSON.stringify({ id }) });
    applyServerState(payload.state);
    state.meetings = payload.state.meetings || state.meetings;
    render();
    showToast('纪要已生成');
  } catch (error) {
    showToast(`结束会议失败：${error.message}`);
  }
}

async function createMeetingTask(actionId, meetingId) {
  try {
    const payload = await api('/api/meetings/action', {
      method: 'POST',
      body: JSON.stringify({ meetingId, actionId }),
    });
    applyServerState(payload.state);
    state.meetings = payload.state.meetings || state.meetings;
    render();
    showToast('已转成任务，可在任务页排期');
  } catch (error) {
    showToast(`转任务失败：${error.message}`);
  }
}

async function toggleSchedule(id) {
  try {
    const payload = await api('/api/schedules/toggle', { method: 'POST', body: JSON.stringify({ id }) });
    applyServerState(payload.state);
    state.schedules = payload.state.schedules || [];
    render();
  } catch (error) {
    showToast(`操作失败：${error.message}`);
  }
}

async function runScheduleNow(id) {
  showToast('正在执行…');
  try {
    const payload = await api('/api/schedules/run', { method: 'POST', body: JSON.stringify({ id }) });
    applyServerState(payload.state);
    state.schedules = payload.state.schedules || [];
    state.scheduleRuns = payload.state.scheduleRuns || [];
    render();
    showToast(payload.run?.summary || '执行完成');
  } catch (error) {
    showToast(`执行失败：${error.message}`);
  }
}

async function deleteSchedule(id) {
  if (!window.confirm('删除这个定时任务？')) return;
  try {
    const payload = await api('/api/schedules/delete', { method: 'POST', body: JSON.stringify({ id }) });
    applyServerState(payload.state);
    state.schedules = payload.state.schedules || [];
    render();
    showToast('已删除');
  } catch (error) {
    showToast(`删除失败：${error.message}`);
  }
}

function openSearchResult(dataset) {
  const type = dataset.type;
  if (type === 'task') {
    state.view = 'tasks';
    render();
    openModal('task-edit', dataset.id);
    return;
  }
  if (type === 'deliverable') {
    previewDeliverable(dataset.id);
    return;
  }
  if (type === 'project') {
    state.view = 'projects';
    render();
    return;
  }
  if (type === 'employee') {
    state.view = 'employees';
    render();
    return;
  }
  if (type === 'memory') {
    state.view = 'memories';
    render();
    openMemoryPreview(dataset.id);
    return;
  }
  if (type === 'document') {
    state.view = 'documents';
    render();
    openModal('document-preview', dataset.id);
    return;
  }
  if (type === 'message' && dataset.chat) {
    state.chat = dataset.chat;
    state.view = 'deliverables';
    render();
    scrollChat();
  }
}

async function updateTaskArchive(taskId, archived) {
  try {
    const payload = await api('/api/tasks/archive', {
      method: 'POST',
      body: JSON.stringify({ id: taskId, archived }),
    });
    applyServerState(payload.state);
    render();
    showToast(archived ? '任务已归档' : '任务已恢复');
  } catch (error) {
    showToast(`${archived ? '归档' : '恢复'}任务失败：${error.message}`);
  }
}

async function archiveProcessedTasks() {
  const doneCount = (state.data.tasks || []).filter(
    (task) => !task.archived && ['已完成', '已取消'].includes(task.status),
  ).length;
  if (!doneCount) {
    showToast('没有已完成的任务需要归档');
    return;
  }
  if (!confirm(`归档 ${doneCount} 个已完成任务？归档后可在「已归档」里恢复。`)) return;
  try {
    const payload = await api('/api/tasks/archive-processed', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    applyServerState(payload.state);
    render();
    showToast(`已归档 ${payload.count || 0} 个任务`);
  } catch (error) {
    showToast(`批量归档失败：${error.message}`);
  }
}

async function worktreeAction(taskId, action) {
  try {
    const payload = await api('/api/tasks/worktree', {
      method: 'POST',
      body: JSON.stringify({ taskId, action }),
    });
    applyServerState(payload.state);
    render();
    showToast(action === 'merge' ? '隔离区已合并回项目工作区' : '隔离区已丢弃');
  } catch (error) {
    showToast(`隔离区操作失败：${error.message}`);
  }
}



let modalType = null;
let modalTargetId = '';

function expertBindingFields(expert = null) {
  const employeeIds = expert?.employeeIds || [];
  const projectIds = expert?.projectIds || [];
  return `
    <div class="full"><div class="modal-note">绑定员工（专家内容会进入这些员工的上下文）</div>
      <div class="checkbox-grid">${state.data.employees.filter((emp) => !emp.archived).map((emp) => `<label class="checkbox-item"><input type="checkbox" name="employeeIds" value="${emp.id}" ${employeeIds.includes(emp.id) ? 'checked' : ''} /> ${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</label>`).join('')}</div>
    </div>
    <div class="full"><div class="modal-note">绑定项目（该项目所有员工都能读到这位专家）</div>
      <div class="checkbox-grid">${state.data.projects.map((proj) => `<label class="checkbox-item"><input type="checkbox" name="projectIds" value="${proj.id}" ${projectIds.includes(proj.id) ? 'checked' : ''} /> ${escapeHtml(proj.name)}</label>`).join('')}</div>
    </div>`;
}

function renderWorkbuddyImportList() {
  const host = document.getElementById('expert-import-list');
  if (!host) return;
  const keyword = String(document.getElementById('expert-import-search')?.value || '').toLowerCase();
  const imported = new Set(state.workbuddyImported || []);
  const rows = (state.workbuddyExperts || []).filter((item) => {
    if (!keyword) return true;
    return `${item.name} ${item.profession} ${item.description} ${(item.tags || []).join(' ')}`.toLowerCase().includes(keyword);
  });
  host.innerHTML = rows.length
    ? rows.map((item) => {
        const already = imported.has(item.packageName);
        return `<label class="import-row ${already ? 'imported' : ''}">
          <input type="checkbox" name="packageNames" value="${escapeHtml(item.packageName)}" ${already ? 'disabled' : ''} />
          <span class="import-main"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.profession)} · ${escapeHtml(item.type)} · v${escapeHtml(item.packageVersion)}${already ? ' · 已导入' : ''}</span><small>${escapeHtml(item.description || '')}</small></span>
        </label>`;
      }).join('')
    : '<div class="empty small">没有匹配的 WorkBuddy 专家包。</div>';
  const count = document.getElementById('expert-import-count');
  if (count) count.textContent = `${rows.length} 个可选`;
}

async function loadWorkbuddyExpertCandidates() {
  const host = document.getElementById('expert-import-body');
  if (!host) return;
  state.workbuddyExpertsLoading = true;
  host.innerHTML = '<div class="previewdesk-loading"><span class="typing-dot"></span>正在扫描本机 WorkBuddy 专家目录…</div>';
  try {
    const payload = await api('/api/experts/workbuddy');
    state.workbuddyExperts = payload.candidates || [];
    state.workbuddyImported = payload.imported || [];
    host.innerHTML = `
      <div class="modal-note">扫描到 ${payload.total || 0} 个专家包：${(payload.scanned || []).map((path) => `<code>${escapeHtml(path)}</code>`).join('、')}</div>
      <div class="import-toolbar"><input id="expert-import-search" class="filter-input" placeholder="搜索专家名称、领域、标签" /><span id="expert-import-count" class="hint"></span></div>
      <div id="expert-import-list" class="import-list"></div>`;
    document.getElementById('expert-import-search')?.addEventListener('input', renderWorkbuddyImportList);
    renderWorkbuddyImportList();
  } catch (error) {
    host.innerHTML = `<div class="previewdesk-error">扫描失败：${escapeHtml(error.message)}</div>`;
  }
}

async function openMarket(type = 'expert', query = '') {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const fields = document.getElementById('modal-fields');
  const primary = document.getElementById('modal-primary');
  if (!modal || !title || !fields) return;
  modalType = 'market';
  modalTargetId = type;
  modal.hidden = false;
  modal.querySelector('.modal-card')?.classList.remove('settings-card');
  modal.querySelector('.modal-card')?.classList.add('im-card');
  if (primary) primary.style.display = 'none';
  title.textContent = type === 'skill' ? 'WorkBuddy 技能市场 · 热门 TOP10' : 'WorkBuddy 专家市场 · 热门 TOP10';
  fields.innerHTML = '<div class="im-loading"><span class="typing-dot"></span>正在读取 WorkBuddy 市场热度…</div>';
  try {
    const params = new URLSearchParams({ type, limit: '10' });
    if (query) params.set('q', query); else params.set('hot', '1');
    const payload = await api(`/api/market?${params.toString()}`);
    const items = payload.items || [];
    const stats = payload.stats || {};
    fields.innerHTML = `
      <div class="modal-note">${query ? `搜索「${escapeHtml(query)}」` : '按 WorkBuddy / SkillHub 市场使用量排序'}：专家 ${stats.experts || 0} 位 / 技能 ${stats.skills || 0} 个（技能为 SkillHub 全量市场，读取于 ${escapeHtml(formatDateTime(stats.readAt))}）。招聘时人事会从同类前 10 名中随机选 1 个。</div>
      <div class="market-toolbar"><input id="market-query" placeholder="搜岗位、能力或技能名，例如：视频、财务、3D" value="${escapeHtml(query)}" /><button class="btn ghost small" type="button" data-action="market-search" data-type="${escapeHtml(type)}">搜索</button></div>
      <div class="market-list">${items.map((item, index) => `
        <div class="market-row">
          <span class="market-rank">${index + 1}</span>
          <div class="market-main">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.profession || item.sourceLabel || '')} · 使用量 ${Number(item.useCount || 0).toLocaleString()}${item.installCount ? ` · 安装量 ${Number(item.installCount).toLocaleString()}` : ''}</span>
            <p>${escapeHtml(item.description || '')}</p>
          </div>
          <button class="btn ghost small" type="button" data-action="market-import" data-type="${escapeHtml(item.type)}" data-id="${escapeHtml(item.id)}">导入</button>
        </div>`).join('') || '<div class="empty small">市场缓存为空，请先在 WorkBuddy 打开一次技能/专家市场。</div>'}</div>`;
  } catch (error) {
    fields.innerHTML = `<div class="im-error">读取市场失败：${escapeHtml(error.message)}</div>`;
  }
}

function openModal(type, id = '', extra = '') {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const fields = document.getElementById('modal-fields');
  if (!modal || !title || !fields) return;
  const primary = document.getElementById('modal-primary');
  if (primary) {
    primary.style.display = '';
    primary.textContent = '保存';
  }
  modal.querySelector('.modal-card')?.classList.toggle('settings-card', type === 'settings');
  modal.querySelector('.modal-card')?.classList.toggle('im-card', type === 'im');

  modalType = type;
  modalTargetId = id;
  modal.hidden = false;
  if (type === 'market') {
    void openMarket(id || 'expert');
    return;
  }
  if (type === 'gateway-add') {
    title.textContent = '添加 WorkBuddy 账号';
    state.gatewayLogin = null;
    clearGatewayLoginTimer();
    fields.innerHTML = `
      <div class="gateway-add-copy">选择账号区域，生成授权链接后用浏览器打开并登录 WorkBuddy。登录成功后账号会自动进入公司网关，凭据只保存在本机。</div>
      <label>账号区域<select name="realm">
        <option value="cn">国内版（cn）</option>
        <option value="global">国际版（global）</option>
      </select></label>
      <div id="gateway-add-status" class="gateway-add-status"></div>`;
    return;
  }
  if (type === 'device-edit') {
    const device = (state.data.devices || []).find((item) => item.id === id);
    title.textContent = device ? `编辑设备 · ${device.name}` : '新增设备';
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(device?.id || '')}" />
      <label>设备名称<input name="name" required maxlength="80" value="${escapeHtml(device?.name || '')}" placeholder="例如：拓竹 X1C / ComfyUI 服务器" /></label>
      <label>类别<select name="category">${['3D打印机', '服务器', '工作站', '测试设备', '网络设备', '其他'].map((value) => `<option ${device?.category === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label>
      <label>型号<input name="model" maxlength="120" value="${escapeHtml(device?.model || '')}" /></label>
      <label>序列号<input name="serial" maxlength="120" value="${escapeHtml(device?.serial || '')}" /></label>
      <label>位置<input name="location" maxlength="120" value="${escapeHtml(device?.location || '')}" placeholder="例如：工作室 / 3F 机房" /></label>
      <label>状态<select name="status">${['可用', '占用', '维修', '停用'].map((value) => `<option ${device?.status === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label>
      <label>负责人<input name="owner" maxlength="80" value="${escapeHtml(device?.owner || '')}" /></label>
      <label class="full">规格参数<textarea name="specs" maxlength="2000" placeholder="喷头、尺寸、GPU、内存、端口、耗材、精度等">${escapeHtml(device?.specs || '')}</textarea></label>
      <label class="full">连接方式<textarea name="connection" maxlength="500" placeholder="USB / 局域网 IP / SSH / 远程地址；不要填密码">${escapeHtml(device?.connection || '')}</textarea></label>
      <label class="full">标签<input name="tags" maxlength="160" value="${escapeHtml((device?.tags || []).join(', '))}" placeholder="逗号分隔，例如：打印, 0.4mm, PLA" /></label>
      <label class="full">备注<textarea name="note" maxlength="2000">${escapeHtml(device?.note || '')}</textarea></label>
      <div class="modal-note">员工在任务里需要设备时，会通过 <code>list_devices</code> 找到设备，再用 <code>read_device</code> 读取完整参数。</div>`;
  } else if (type === 'tool-edit') {
    const tool = (state.data.toolCatalog || []).find((item) => item.code === id);
    title.textContent = tool ? `编辑工具 · ${tool.name}` : '新增工具';
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(tool?.id || '')}" />
      <label>工具编码<input name="code" required maxlength="40" value="${escapeHtml(tool?.code || '')}" ${tool?.builtin ? 'readonly' : ''} placeholder="例如：media.export" /></label>
      <label>显示名称<input name="name" required maxlength="40" value="${escapeHtml(tool?.name || '')}" placeholder="例如：媒体导出" /></label>
      <label>类别<input name="category" maxlength="20" value="${escapeHtml(tool?.category || '扩展')}" /></label>
      <label>风险等级<select name="risk">${['L0', 'L1', 'L2', 'L3', 'L4'].map((level) => `<option ${tool?.risk === level ? 'selected' : ''}>${level}</option>`).join('')}</select></label>
      <label>实现类型<select name="kind">${[['native', '已接入（dsh 原生）'], ['company', '公司内部（MCP）'], ['planned', '待接入']].map(([value, label]) => `<option value="${value}" ${(tool?.kind || 'planned') === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
      <label class="full">实现说明<input name="implementation" maxlength="160" value="${escapeHtml(tool?.implementation || '')}" placeholder="例如：dsh-tool-fs / mcp:company.hire_employee" /></label>
      <label class="full">描述<textarea name="description" maxlength="300">${escapeHtml(tool?.description || '')}</textarea></label>
      ${tool?.builtin ? '<div class="modal-note">内置工具编码不可修改，可以修改名称、说明和启停。</div>' : '<div class="modal-note">自定义工具默认是“待接入”，接入实现后员工才能真正使用。</div>'}`;
    return;
  }
  if (type === 'tool-assign') {
    const tool = (state.data.toolCatalog || []).find((item) => item.code === id);
    if (!tool) return;
    title.textContent = `分配工具 · ${tool.name}`;
    fields.innerHTML = `
      <input type="hidden" name="toolCode" value="${escapeHtml(tool.code)}" />
      <div class="modal-note">勾选后保存，会立刻更新这些员工的 preset；下一轮对话生效。</div>
      <div class="checkbox-grid">${state.data.employees.filter((emp) => !emp.archived).map((emp) => `<label class="checkbox-item"><input type="checkbox" name="employeeIds" value="${emp.id}" ${(emp.tools || []).includes(tool.code) ? 'checked' : ''} /> ${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</label>`).join('')}</div>`;
    return;
  }
  if (type === 'skill-edit') {
    const skill = (state.data.skillCatalog || []).find((item) => item.id === id || item.name === id);
    title.textContent = skill ? `编辑技能 · ${skill.name}` : '新增技能';
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(skill?.id || '')}" />
      <label>技能名称<input name="name" required maxlength="40" value="${escapeHtml(skill?.name || '')}" placeholder="例如：分镜" /></label>
      <label>类别<input name="category" maxlength="20" value="${escapeHtml(skill?.category || '通用')}" /></label>
      <label class="full">简介<textarea name="description" maxlength="200">${escapeHtml(skill?.description || '')}</textarea></label>
      <label class="full">执行指引<textarea name="instructions" maxlength="800" placeholder="员工在任务中如何运用这项技能">${escapeHtml(skill?.instructions || '')}</textarea></label>
      <div class="modal-note">技能会作为「岗位技能」进入员工上下文；招聘时人事专员会从目录读取并分配。</div>`;
    return;
  }
  if (type === 'skill-assign') {
    const skill = (state.data.skillCatalog || []).find((item) => item.id === id || item.name === id);
    if (!skill) return;
    title.textContent = `分配技能 · ${skill.name}`;
    fields.innerHTML = `
      <input type="hidden" name="skillName" value="${escapeHtml(skill.name)}" />
      <div class="modal-note">勾选后保存，会更新员工技能与 preset。</div>
      <div class="checkbox-grid">${state.data.employees.filter((emp) => !emp.archived).map((emp) => `<label class="checkbox-item"><input type="checkbox" name="employeeIds" value="${emp.id}" ${(emp.skills || []).includes(skill.name) ? 'checked' : ''} /> ${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</label>`).join('')}</div>`;
    return;
  }
  if (type === 'expert-edit') {
    const expert = (state.data.experts || []).find((item) => item.id === id);
    title.textContent = expert ? `编辑专家 · ${expert.name}` : '新增专家';
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(expert?.id || '')}" />
      <label>姓名<input name="name" required maxlength="40" value="${escapeHtml(expert?.name || '')}" /></label>
      <label>专业/头衔<input name="profession" maxlength="60" value="${escapeHtml(expert?.profession || expert?.title || '')}" /></label>
      <label>类型<select name="type">${['外部', '内部', '团队'].map((typeName) => `<option ${expert?.type === typeName ? 'selected' : ''}>${typeName}</option>`).join('')}</select></label>
      <label>状态<select name="status">${['可调用', '可预约', '忙碌'].map((statusName) => `<option ${expert?.status === statusName ? 'selected' : ''}>${statusName}</option>`).join('')}</select></label>
      <label>领域<input name="domain" maxlength="120" value="${escapeHtml(expert?.domain || '')}" placeholder="例如：品牌定位 / 内容策略" /></label>
      <label>报价<input name="rate" maxlength="40" value="${escapeHtml(expert?.rate || '')}" placeholder="例如：¥1,200/小时 或 内部" /></label>
      <label class="full">技能标签（逗号分隔）<input name="skills" maxlength="200" value="${escapeHtml((expert?.skills || []).join(', '))}" /></label>
      <label class="full">简介<textarea name="bio" maxlength="1000">${escapeHtml(expert?.bio || expert?.description || '')}</textarea></label>
      ${expertBindingFields(expert)}
      ${expert?.source === 'workbuddy' ? `<div class="modal-note">来源：WorkBuddy 本地专家包 ${escapeHtml(expert.packageName)} v${escapeHtml(expert.packageVersion)}。内容摘要会进入绑定员工/项目的上下文，完整内容保存在 ${escapeHtml(expert.contentPath || 'data/experts')}。</div>` : ''}`;
    return;
  }
  if (type === 'expert-assign') {
    const expert = (state.data.experts || []).find((item) => item.id === id);
    if (!expert) return;
    title.textContent = `绑定专家 · ${expert.name}`;
    fields.innerHTML = `<input type="hidden" name="expertId" value="${escapeHtml(expert.id)}" />${expertBindingFields(expert)}<div class="modal-note">保存后，绑定员工/项目会在下一轮对话里收到专家摘要。</div>`;
    return;
  }
  if (type === 'expert-import') {
    title.textContent = '从 WorkBuddy 导入专家';
    fields.innerHTML = '<div id="expert-import-body" class="expert-import-body"><div class="previewdesk-loading">正在准备扫描…</div></div>';
    const primary = document.getElementById('modal-primary');
    if (primary) primary.textContent = '导入选中';
    void loadWorkbuddyExpertCandidates();
    return;
  }
  if (type === 'hire-employee') {
    const roles = (state.templates || []).filter((item) => item.type === 'role');
    const experts = state.data.experts || [];
    title.textContent = '按岗位模板招聘';
    fields.innerHTML = `
      <div class="modal-note"><strong>招聘人：沈舟（人事行政专员）</strong><br>他会读取岗位模板、工具目录、技能目录和专家目录，自动给新员工分配工具、技能和专家，并写入岗位记忆。</div>
      <label>新员工姓名<input name="name" required maxlength="20" placeholder="例如：叶青" /></label>
      <label>岗位模板<select name="roleTemplateId">${roles.map((item) => `<option value="${item.id}">${escapeHtml(item.name)} · ${escapeHtml(item.desc || '')}</option>`).join('')}</select></label>
      <label>部门<select name="dept">${['内容部', '生产部', '支持部', '管理部', '技术部', '运营部'].map((dept) => `<option>${dept}</option>`).join('')}</select></label>
      <label class="full">补充职责<textarea name="desc" maxlength="160" placeholder="留空使用岗位模板描述"></textarea></label>
      <div class="full"><div class="modal-note">加入项目</div><div class="checkbox-grid">${state.data.projects.map((proj) => `<label class="checkbox-item"><input type="checkbox" name="projectIds" value="${proj.id}" /> ${escapeHtml(proj.name)}</label>`).join('')}</div></div>
      <label>额外工具（编码，逗号分隔）<input name="toolCodes" maxlength="200" placeholder="例如：present, todo" /></label>
      <label>额外技能（名称，逗号分隔）<input name="skillNames" maxlength="200" placeholder="例如：分镜, 审阅" /></label>
      <label class="settings-check full"><input type="checkbox" name="marketAuto" value="1" checked /> 从 WorkBuddy 市场自动选（专家/技能各取最热前 10 名，随机选 1 个）</label>
      <label>使用模型<select name="model">${employeeModelSelectOptions({}, '按岗位自动匹配（推荐）')}</select></label>
      <label>思考强度<select name="modelEffort">${employeeEffortOptions('')}</select></label>
      <div class="full"><div class="modal-note">不选模型时人事会按岗位自动匹配：研发/财务优先推理型，内容/设计优先视觉型，客服/行政优先快速型。</div></div>
      <div class="full"><div class="modal-note">指定专家（可选；不选则由人事专员按岗位技能自动匹配）</div><div class="checkbox-grid">${experts.filter((item) => item.enabled !== false).map((expert) => `<label class="checkbox-item"><input type="checkbox" name="expertIds" value="${expert.id}" /> ${escapeHtml(expert.name)} · ${escapeHtml(expert.profession || expert.title || '专家')}</label>`).join('')}</div></div>`;
    return;
  }
  if (type === 'server') {
    const server = id ? serverById(id) : null;
    title.textContent = server ? '编辑服务器' : '添加服务器';
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(server?.id || '')}" />
      <label>服务器名称<input name="name" required maxlength="60" value="${escapeHtml(server?.name || '')}" placeholder="例如：本机 · 拾光工作站" /></label>
      <label>接入方式<select name="mode"><option value="local" ${server?.mode !== 'ssh' ? 'selected' : ''}>本机</option><option value="ssh" ${server?.mode === 'ssh' ? 'selected' : ''}>SSH 远程</option></select></label>
      <label>主机 / IP<input name="host" required maxlength="120" value="${escapeHtml(server?.host || '127.0.0.1')}" placeholder="127.0.0.1 或 192.168.1.20" /></label>
      <label>SSH 端口<input name="sshPort" type="number" min="1" max="65535" value="${Number(server?.sshPort || 22)}" /></label>
      <label>SSH 用户<input name="sshUser" maxlength="60" value="${escapeHtml(server?.sshUser || '')}" placeholder="远程服务器需要" /></label>
      <label class="full">SSH 私钥
        <input name="sshKeyPath" list="ssh-key-list" maxlength="260" value="${escapeHtml(server?.sshKeyPath || '')}" placeholder="留空使用默认密钥；也可只填 ~/.ssh 下的文件名" />
        <datalist id="ssh-key-list"></datalist>
        <small class="hint">已发现 <span id="ssh-key-count">${(state.sshKeys || []).length}</span> 把可用密钥，点输入框可直接选；留空则用 ssh-agent / 默认密钥</small>
      </label>
      <label>分组<input name="group" maxlength="40" value="${escapeHtml(server?.group || '默认')}" placeholder="例如：本机 / 渲染集群" /></label>
      <label>标签（逗号分隔）<input name="tags" maxlength="120" value="${escapeHtml((server?.tags || []).join(', '))}" placeholder="GPU, 远程" /></label>
      <label class="full">说明<textarea name="note" maxlength="200">${escapeHtml(server?.note || '')}</textarea></label>
      <div class="full"><button class="btn ghost small" type="button" data-action="test-ssh" data-id="${escapeHtml(server?.id || '')}">测试 SSH 连接</button><span id="ssh-test-result" class="settings-status"></span></div>
      <div class="modal-note">本机服务器可以直接启动/停止本机进程；远程服务器通过 SSH 执行配置的启动/停止命令，需要提前配置免密钥登录。</div>`;
    void loadSshKeys().then(renderSshKeyOptions);
    return;
  } else if (type === 'server-service') {
    const serverId = extra || state.selectedServerId || '';
    const server = serverById(serverId);
    const service = (server?.services || []).find((item) => item.id === id);
    title.textContent = service ? '编辑项目服务' : '添加项目服务';
    const projectOptions = state.data.projects.map((item) => `<option value="${item.id}" ${service?.projectId === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('');
    fields.innerHTML = `
      <input type="hidden" name="serverId" value="${escapeHtml(serverId)}" />
      <input type="hidden" name="serviceId" value="${escapeHtml(service?.id || '')}" />
      <label>服务名称<input name="name" required maxlength="60" value="${escapeHtml(service?.name || '')}" placeholder="例如：ComfyUI" /></label>
      <label>关联项目<select name="projectId">${projectOptions}</select></label>
      <label>服务类型<select name="type">${[['web','Web'],['api','API'],['worker','Worker'],['render','渲染'],['db','数据库'],['other','其他']].map(([value, label]) => `<option value="${value}" ${service?.type === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
      <label>运行方式<select name="runtime">${[['process','本机/SSH 进程'],['docker','Docker 容器'],['k8s','Kubernetes 工作负载']].map(([value, label]) => `<option value="${value}" ${(service?.runtime || 'process') === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
      <label>端口<input name="port" type="number" min="0" max="65535" value="${Number(service?.port || 0)}" /></label>
      <label>分组<input name="group" maxlength="40" value="${escapeHtml(service?.group || '默认')}" placeholder="例如：Web 前端" /></label>
      <label>标签（逗号分隔）<input name="tags" maxlength="120" value="${escapeHtml((service?.tags || []).join(', '))}" placeholder="core, web" /></label>
      <label>Docker 容器名<input name="containerName" maxlength="120" value="${escapeHtml(service?.containerName || '')}" placeholder="仅 Docker 运行方式需要" /></label>
      <label>K8s 命名空间<input name="namespace" maxlength="60" value="${escapeHtml(service?.namespace || 'default')}" /></label>
      <label>K8s 工作负载<input name="workload" maxlength="120" value="${escapeHtml(service?.workload || '')}" placeholder="例如 deployment/comfyui" /></label>
      <label class="full">依赖服务（先启动它们）
        <select name="dependsOn" multiple size="4">${(server?.services || []).filter((item) => item.id !== service?.id).map((item) => `<option value="${item.id}" ${service?.dependsOn?.includes(item.id) ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select>
      </label>
      <label class="full">管理台 URL<input name="manageUrl" maxlength="300" value="${escapeHtml(service?.manageUrl || '')}" placeholder="http://127.0.0.1:8188" /></label>
      <label class="full">健康检查 URL<input name="healthUrl" maxlength="300" value="${escapeHtml(service?.healthUrl || '')}" placeholder="http://127.0.0.1:8188/system_stats" /></label>
      <label class="full">运行目录<input name="cwd" maxlength="240" value="${escapeHtml(service?.cwd || '')}" placeholder="本机留空表示一人公司目录；远程例如 /opt/ComfyUI" /></label>
      <label class="full">启动命令<input name="startCommand" maxlength="300" value="${escapeHtml(service?.startCommand || '')}" placeholder="本机：npm run dsh；远程：python main.py --listen 0.0.0.0" /></label>
      <label class="full">停止命令<input name="stopCommand" maxlength="300" value="${escapeHtml(service?.stopCommand || '')}" placeholder="可留空；本机会尝试按 PID 停止" /></label>
      <label class="full">说明<textarea name="note" maxlength="200">${escapeHtml(service?.note || '')}</textarea></label>
      <input type="hidden" name="autoStart" value="0" />
      <label class="settings-check"><input type="checkbox" name="autoStart" value="1" ${service?.autoStart ? 'checked' : ''} /> 建议随服务器启动</label>
      <div class="modal-note">服务状态通过端口 / 健康检查 URL 探测。远程服务的启动/停止走 SSH，需要服务器已配置免密钥登录。</div>`;
    return;
  } else if (type === 'service-log') {
    const server = serverById(extra);
    const service = server?.services?.find((item) => item.id === id);
    if (!server || !service) return;
    title.textContent = `服务日志 · ${service.name}`;
    fields.innerHTML = '<div id="service-log-body" class="service-log-body">正在读取日志…</div>';
    const primary = document.getElementById('modal-primary');
    if (primary) primary.style.display = 'none';
    return;
  } else if (type === 'server-console') {
    let server = null;
    let service = null;
    for (const item of state.servers || []) {
      const found = (item.services || []).find((entry) => entry.id === id);
      if (found) {
        server = item;
        service = found;
        break;
      }
    }
    if (!service) return;
    title.textContent = `管理台 · ${service.name}`;
    fields.innerHTML = `
      <div class="console-meta"><span class="server-status ${server.status}"><i></i>${serverStatusLabel(server.status)}</span><span>${escapeHtml(server.name)} · ${escapeHtml(service.manageUrl)}</span><a class="btn ghost small" href="${escapeHtml(service.manageUrl)}" target="_blank" rel="noreferrer">新窗口打开</a></div>
      <iframe class="preview-frame console-frame" src="${escapeHtml(service.manageUrl)}" title="${escapeHtml(service.name)} 管理台"></iframe>
      <div class="modal-note">如果管理台禁止被嵌入（X-Frame-Options / CSP），请点右上角“新窗口打开”。</div>`;
    const primary = document.getElementById('modal-primary');
    if (primary) primary.style.display = 'none';
    return;
  } else if (type === 'report-preview') {
    const report = state.reports.find((item) => item.id === id);
    if (!report) return;
    title.textContent = report.title;
    fields.innerHTML = `<div class="preview-meta">${escapeHtml(report.periodLabel || '')} · ${escapeHtml(formatDateTime(report.createdAt))}</div><pre class="preview-text">${escapeHtml(report.markdown || '')}</pre>`;
    const primary = document.getElementById('modal-primary');
    if (primary) {
      primary.style.display = '';
      primary.textContent = '下载 .md';
      primary.dataset.downloadReport = report.id;
    }
    return;
  } else if (type === 'meeting') {
    title.textContent = '新建圆桌会议';
    const projectOptions = state.data.projects.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('');
    fields.innerHTML = `
      <label>会议标题<input name="title" maxlength="80" placeholder="例如：P1 范围确认会" /></label>
      <label>项目<select name="projectId">${projectOptions}</select></label>
      <label>轮次<select name="rounds"><option value="1">1 轮</option><option value="2" selected>2 轮</option><option value="3">3 轮</option></select></label>
      <label class="full">议程<textarea name="agenda" maxlength="500" placeholder="这次会要解决什么问题、每个人要带什么信息">同步 P1 进展，确认下一步排期与卡点。</textarea></label>
      <div class="full"><div class="modal-note">参会员工（建议 3-5 人，默认带入项目编制）</div>
        <div class="check-grid">${state.data.employees.map((emp) => `<label class="check-item"><input type="checkbox" name="participants" value="${emp.id}" /> <span>${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</span></label>`).join('')}</div>
      </div>`;
    const projectSelect = fields.querySelector('select[name="projectId"]');
    const syncTeam = () => {
      const proj = project(projectSelect.value);
      fields.querySelectorAll('input[name="participants"]').forEach((input) => {
        input.checked = (proj?.team || []).includes(input.value);
      });
    };
    projectSelect?.addEventListener('change', syncTeam);
    syncTeam();
    return;
  } else if (type === 'template-apply') {
    const template = (state.templates || []).find((item) => item.id === id);
    if (!template) return;
    title.textContent = `应用模板 · ${template.name}`;
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(template.id)}" />
      <div class="modal-note">${escapeHtml(template.desc || '')}<br>会给项目补充任务模板，并按岗位匹配现有员工。</div>
      <label>选择项目<select name="projectId">${state.data.projects.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('')}</select></label>`;
    return;
  } else if (type === 'employee-template') {
    const template = (state.templates || []).find((item) => item.id === id);
    if (!template) return;
    const payload = template.payload || {};
    title.textContent = `招聘 · ${template.name}`;
    fields.innerHTML = `
      <label>姓名<input name="name" required maxlength="20" placeholder="例如：沈舟" /></label>
      <label>岗位<input name="role" maxlength="30" value="${escapeHtml(payload.role || template.name)}" /></label>
      <label>部门<select name="dept">${['内容部', '生产部', '支持部', '管理部'].map((dept) => `<option ${payload.dept === dept ? 'selected' : ''}>${dept}</option>`).join('')}</select></label>
      <label>职责说明<textarea name="desc" maxlength="120">${escapeHtml(template.desc || '')}</textarea></label>
      <label>工具（逗号分隔）<input name="tools" maxlength="120" value="${escapeHtml((payload.tools || ['read', 'write']).join(', '))}" /></label>
      <label>技能（逗号分隔）<input name="skills" maxlength="120" value="${escapeHtml((payload.skills || []).join(', '))}" /></label>
      <label>权限级别<select name="permissionLevel"><option value="readonly">只读</option><option value="standard" selected>标准</option><option value="manager">管理</option></select></label>
      <label>工位目录<input name="cwd" maxlength="80" placeholder="留空自动生成" /></label>`;
    return;
  } else if (type === 'acceptance-preview') {
    const template = (state.templates || []).find((item) => item.id === id);
    if (!template) return;
    title.textContent = `验收标准 · ${template.name}`;
    fields.innerHTML = `<div class="modal-note">${escapeHtml(template.desc || '')}</div><pre class="preview-text">${escapeHtml(template.payload?.acceptance || '')}</pre><div class="modal-note">可在任务详情里直接粘贴这份验收标准。</div>`;
    const primary = document.getElementById('modal-primary');
    if (primary) primary.style.display = 'none';
    return;
  } else if (type === 'template-import') {
    title.textContent = '导入模板 JSON';
    fields.innerHTML = `
      <div class="modal-note">支持单个对象或 { "templates": [...] }。字段：type（project / role / acceptance）、name、desc、payload。</div>
      <label class="full">JSON<textarea name="json" rows="10" required placeholder='{"templates":[{"type":"project","name":"我的项目模板","desc":"...","payload":{"tasks":[]}}]}'></textarea></label>`;
    return;
  } else if (type === 'schedule') {
    title.textContent = '新建定时任务';
    const projectOptions = state.data.projects.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('');
    fields.innerHTML = `
      <label>任务名称<input name="name" required maxlength="60" placeholder="例如：每日早会" /></label>
      <label>动作<select name="action">
        <option value="meeting-standup">创建项目站会草稿</option>
        <option value="report-daily">生成日报</option>
        <option value="report-weekly">生成周报</option>
        <option value="snapshot-projects">项目快照</option>
        <option value="health-check">控制面巡检</option>
      </select></label>
      <label>触发方式<select name="type"><option value="daily">每天</option><option value="weekly">每周</option><option value="interval">固定间隔</option></select></label>
      <label>时间<input name="time" type="time" value="09:00" /></label>
      <label>星期（每周）<select name="weekday">${['一', '二', '三', '四', '五', '六', '日'].map((label, index) => `<option value="${index + 1}" ${index === 0 ? 'selected' : ''}>周${label}</option>`).join('')}</select></label>
      <label>间隔分钟（固定间隔）<input name="intervalMinutes" type="number" min="5" max="1440" value="60" /></label>
      <label>关联项目<select name="projectId"><option value="">不指定</option>${projectOptions}</select></label>
      <div class="modal-note">站会只创建草稿，不会自动调用模型；日报周报和巡检会直接执行。</div>`;
    return;
  }
  if (type === 'team') {
    const team = id ? (state.teams || []).find((item) => item.id === id) : null;
    title.textContent = team ? '编辑团队' : '新建团队';
    const projectOptions = state.data.projects.map((item) => `<option value="${item.id}" ${team?.defaultProjectId === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('');
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(team?.id || '')}" />
      <label>团队名称<input name="name" required maxlength="60" value="${escapeHtml(team?.name || '')}" placeholder="例如：产品研发组" /></label>
      <label>所属部门<select name="dept">${['管理部', '内容部', '生产部', '支持部'].map((dept) => `<option ${team?.dept === dept ? 'selected' : ''}>${dept}</option>`).join('')}</select></label>
      <label>负责人<select name="lead">${state.data.employees.filter((emp) => !emp.archived).map((emp) => `<option value="${emp.id}" ${team?.lead === emp.id ? 'selected' : ''}>${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</option>`).join('')}</select></label>
      <label>默认项目<select name="defaultProjectId"><option value="">不绑定</option>${projectOptions}</select></label>
      <label class="full">职能说明<textarea name="function" maxlength="160" placeholder="这个团队负责什么、交付什么">${escapeHtml(team?.function || '')}</textarea></label>
      <label class="full">共享记忆范围<input name="memoryScope" maxlength="120" value="${escapeHtml(team?.memoryScope || '')}" placeholder="例如：内容风格、供应商口径" /></label>
      <div class="full"><div class="modal-note">团队成员</div>
        <div class="check-grid">${state.data.employees.filter((emp) => !emp.archived).map((emp) => `<label class="check-item"><input type="checkbox" name="members" value="${emp.id}" ${team?.members?.includes(emp.id) ? 'checked' : ''} /> <span>${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</span></label>`).join('')}</div>
      </div>
      <label class="full">备注<textarea name="note" maxlength="200">${escapeHtml(team?.note || '')}</textarea></label>`;
    return;
  }
  if (type === 'project') {
    title.textContent = '新建项目';
    fields.innerHTML = `
      <label>项目名称<input name="name" required maxlength="40" placeholder="例如：官网重构" /></label>
      <label>项目类型
        <select name="type">
          <option value="研发">研发</option>
          <option value="运营">运营</option>
          <option value="知识">知识</option>
        </select>
      </label>
      <label>一句话描述<input name="desc" maxlength="80" placeholder="这个项目要产出什么" /></label>
      <label>当前版本<input name="version" maxlength="40" value="v0.1.0" /></label>
      <label>用户数<input name="users" type="number" min="0" step="1" placeholder="选填" /></label>
      <label>技术栈<input name="techStack" maxlength="300" placeholder="逗号分隔，例如：Next.js，Supabase" /></label>
      <label>合同金额<input name="contractAmount" type="number" min="0" step="1" placeholder="选填" /></label>
      <label>所属团队<select name="teamId"><option value="">不绑定团队</option>${(state.teams || []).map((team) => `<option value="${team.id}">${escapeHtml(team.name)} · ${team.members.length} 人</option>`).join('')}</select></label>
      <label>截止时间<input name="due" maxlength="20" placeholder="例如：11-30" /></label>
      <label>预算（元）<input name="budget" type="number" min="0" step="1" placeholder="留空表示不设预算" /></label>
      <label>预算预警线（%）<input name="budgetWarning" type="number" min="1" max="100" value="80" /></label>
      <label>真实工作区目录<input name="workspacePath" maxlength="240" placeholder="留空则使用内部 data/workspaces/projects/<id>" /></label>
      <label class="full">关键参数<textarea name="params" maxlength="4000" placeholder="尺寸、精度、预算、产能、设备型号、账号等；会写入项目知识库，员工执行任务时自动读取"></textarea></label>
      <label class="full">流程与验收<textarea name="process" maxlength="4000" placeholder="工序、责任人、关键闸门、验收标准；会写入项目知识库"></textarea></label>
      <div class="modal-note">填写本机已有目录可绑定真实项目；目录必须存在。留空会创建内部工作区。参数和流程会生成一条项目知识，员工做任务时自动带上。</div>`;
  } else if (type === 'task') {
    title.textContent = '新建任务';
    const projectOptions = state.data.projects
      .map((item) => `<option value="${item.id}" ${state.filterProject === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`)
      .join('');
    const employeeOptions = state.data.employees.filter((emp) => !emp.archived).map((emp) => `<option value="${emp.id}">${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</option>`).join('');
    fields.innerHTML = `
      <label>任务标题<input name="title" required maxlength="60" placeholder="例如：完成首页布局" /></label>
      <label>所属项目<select name="project">${projectOptions}</select></label>
      <label>负责人<select name="assignee">${employeeOptions}</select></label>
      <label>优先级<select name="priority"><option value="低">低</option><option value="中" selected>中</option><option value="高">高</option><option value="紧急">紧急</option></select></label>
      <label>截止时间<input name="due" maxlength="20" placeholder="例如：11-20" /></label>
      <label class="full">验收标准<textarea name="acceptance" maxlength="1000" placeholder="写清楚什么算完成、需要交付什么"></textarea></label>
      <label class="full">前置任务<input name="dependencies" maxlength="200" placeholder="可选，填任务标题或 ID，多个用逗号分隔" /></label>
      <input type="hidden" name="autoRun" value="0" />
      <label class="settings-check"><input type="checkbox" name="autoRun" value="1" checked /> 纳入自动开工队列</label>
      <input type="hidden" name="isolation" value="0" />
      <label class="settings-check"><input type="checkbox" name="isolation" value="1" /> 任务级隔离区（Git worktree，验收后合并）</label>`;
  } else if (type === 'task-edit') {
    const task = state.data.tasks.find((item) => item.id === id);
    if (!task) return;
    title.textContent = '任务详情';
    const projectOptions = state.data.projects
      .map((item) => `<option value="${item.id}" ${task.project === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`)
      .join('');
    const employeeOptions = state.data.employees
      .filter((emp) => !emp.archived)
      .map((emp) => `<option value="${emp.id}" ${task.assignee === emp.id ? 'selected' : ''}>${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</option>`)
      .join('');
    const dependencyTitles = (task.dependencies || [])
      .map((depId) => state.data.tasks.find((item) => item.id === depId)?.title)
      .filter(Boolean)
      .join('，');
    const lastRun = task.lastRun || {};
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(task.id)}" />
      <div class="modal-note">
        <strong>Ticket：${escapeHtml(task.stageLabel || '未开始')}</strong> · 依据策略 v${Number(task.mandate?.policyVersion || 1)}${Number(task.mandate?.policyVersion || 1) !== Number(state.data.approvalPolicy?.version || 1) ? `（当前 v${Number(state.data.approvalPolicy?.version || 1)}，开工时复核）` : ''} · 授权 ${escapeHtml(task.mandate?.status === 'active' ? '有效' : task.mandate?.status === 'revoked' ? '已撤销' : '已撤回')}<br>
        授权人：${escapeHtml(task.mandate?.grantedBy || '老板')} · 强度：${escapeHtml(task.mandate?.strength === 'inferred' ? '推断' : '明确')} · 范围：${escapeHtml((task.mandate?.scope?.actions || []).join('、') || 'task.run')}<br>
        ${task.mandate?.revokedReason ? `撤销原因：${escapeHtml(task.mandate.revokedReason)}<br>` : ''}
        <span class="head-actions" style="margin-top:8px">
          ${task.mandate?.status === 'active' ? `<button class="btn ghost small" type="button" data-action="revoke-mandate" data-id="${escapeHtml(task.id)}">撤销授权</button>` : `<button class="btn primary small" type="button" data-action="grant-mandate" data-id="${escapeHtml(task.id)}">重新授权</button>`}
        </span>
      </div>
      <label>任务标题<input name="title" required maxlength="100" value="${escapeHtml(task.title)}" /></label>
      <label>所属项目<select name="project">${projectOptions}</select></label>
      <label>负责人<select name="assignee">${employeeOptions}</select></label>
      <label>优先级<select name="priority">${['低', '中', '高', '紧急'].map((p) => `<option ${task.priority === p ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
      <label>状态<select name="status">${['待办', '进行中', '待验收', '已完成', '阻塞'].map((s) => `<option ${task.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
      <label>截止时间<input name="due" maxlength="20" value="${escapeHtml(task.due || '')}" /></label>
      <label class="full">验收标准<textarea name="acceptance" maxlength="1000">${escapeHtml(task.acceptance || '')}</textarea></label>
      <label class="full">前置任务<input name="dependencies" maxlength="300" value="${escapeHtml(dependencyTitles)}" placeholder="任务标题或 ID，多个用逗号分隔" /></label>
      <input type="hidden" name="autoRun" value="0" />
      <label class="settings-check"><input type="checkbox" name="autoRun" value="1" ${task.autoRun !== false ? 'checked' : ''} /> 纳入自动开工队列</label>
      <input type="hidden" name="isolation" value="0" />
      <label class="settings-check"><input type="checkbox" name="isolation" value="1" ${task.isolation ? 'checked' : ''} /> 任务级隔离区（Git worktree，验收后合并）</label>
      ${
        task.worktree
          ? `<div class="worktree-note">隔离区：${escapeHtml(task.worktree.status || '')}${task.worktree.changedFiles ? ` · ${task.worktree.changedFiles} 个文件变更` : ''}${task.worktree.error ? ` · ${escapeHtml(task.worktree.error)}` : ''}
              ${task.worktree.status === '待合并' ? `<div class="worktree-actions"><button class="btn primary small" type="button" data-action="merge-worktree" data-id="${escapeHtml(task.id)}">合并回工作区</button><button class="btn ghost small" type="button" data-action="discard-worktree" data-id="${escapeHtml(task.id)}">丢弃</button></div>` : ''}
            </div>`
          : ''
      }
      ${
        (() => {
          const items = (state.data.deliverables || []).filter((item) => item.taskId === task.id);
          if (!items.length) return '<div class="modal-note">这个任务还没有交付物。执行任务或点“交付”从工位收取。</div>';
          return `<div class="task-deliverable-box">
            <div class="task-deliverable-head"><strong>任务交付物 ${items.length} 份</strong>
              <div class="task-deliverable-actions">
                ${items.some((item) => item.status === '待验收') ? `<button class="btn primary small" type="button" data-action="review-task" data-id="${escapeHtml(task.id)}" data-result="approve">全部通过</button>` : ''}
              </div>
            </div>
            ${items
              .map(
                (item) => `<div class="task-deliverable-row">
              <span class="file-icon ${deliverableIconClass(item.name)}">${escapeHtml(deliverableExt(item.name))}</span>
              <div class="task-deliverable-info"><strong>${escapeHtml(item.name)}</strong><span>v${item.version || 1} · ${escapeHtml(item.status)} · ${escapeHtml(item.note || '')}</span></div>
              <div class="task-deliverable-row-actions">
                <button class="link-btn" type="button" data-action="preview-deliverable" data-id="${escapeHtml(item.id)}">预览</button>
                ${item.status === '待验收' ? `<button class="link-btn ok-text" type="button" data-action="approve-deliverable" data-id="${escapeHtml(item.id)}">通过</button><button class="link-btn danger-text" type="button" data-action="reject-deliverable" data-id="${escapeHtml(item.id)}">打回</button>` : ''}
              </div>
            </div>`,
              )
              .join('')}
          </div>`;
        })()
      }
      ${
        task.result
          ? `<div class="modal-note">最近执行结果</div><pre class="preview-text task-result-preview">${escapeHtml(task.result)}</pre>`
          : ''
      }
      ${
        lastRun.status === 'error'
          ? `<div class="task-run-error">最近失败：${escapeHtml(lastRun.error || '')}</div>`
          : ''
      }`;
  } else if (type === 'employee') {
    title.textContent = '招聘员工';
    fields.innerHTML = `
      <label>姓名<input name="name" required maxlength="20" placeholder="例如：沈舟" /></label>
      <label>岗位<input name="role" maxlength="30" placeholder="例如：内容策划" /></label>
      <label>部门
        <select name="dept">
          <option>内容部</option>
          <option>生产部</option>
          <option>支持部</option>
          <option>管理部</option>
        </select>
      </label>
      <label>职责说明<textarea name="desc" maxlength="120" placeholder="这个员工负责什么、不负责什么"></textarea></label>
      <label>工具（逗号分隔）<input name="tools" maxlength="120" value="read, write" /></label>
      <label>技能（逗号分隔）<input name="skills" maxlength="120" placeholder="例如：招聘, 权限管理" /></label>
      <label>权限级别
        <select name="permissionLevel">
          <option value="readonly">只读</option>
          <option value="standard" selected>标准</option>
          <option value="manager">管理（可管员工/技能/工具）</option>
        </select>
      </label>
      <label class="full">工作区目录（绝对路径）<input name="workspacePath" maxlength="240" placeholder="留空自动创建 公司目录/employees/&lt;id&gt;；也可以填已有目录，员工直接绑定到这里" /></label>
      <label>使用模型<select name="model">${employeeModelSelectOptions({}, '按岗位自动匹配（推荐）')}</select></label>
      <label>思考强度<select name="modelEffort">${employeeEffortOptions('')}</select></label>
      <div class="modal-note">不选模型时按岗位自动匹配：研发/财务优先推理型，内容/设计优先视觉型，客服/行政优先快速型。模型也可以在员工档案里随时改。</div>`;
  } else if (type === 'handoff') {
    const task = state.data.tasks.find((item) => item.id === id);
    if (!task) return;
    title.textContent = '转交任务';
    const options = state.data.employees
      .filter((emp) => emp.id !== task.assignee)
      .map((emp) => `<option value="${emp.id}">${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</option>`)
      .join('');
    fields.innerHTML = `
      <input type="hidden" name="taskId" value="${escapeHtml(task.id)}" />
      <div class="modal-note">任务：<strong>${escapeHtml(task.title)}</strong>　当前负责人：${escapeHtml(employee(task.assignee)?.name || '未分配')}</div>
      <label>转交给<select name="toEmployeeId">${options}</select></label>
      <label>交接备注<textarea name="note" maxlength="120" placeholder="说明已完成到哪一步、下一步要做什么"></textarea></label>`;
  } else if (type === 'employee-archive') {
    const emp = employee(id);
    if (!emp) return;
    title.textContent = `归档员工 · ${emp.name}`;
    const openTasks = state.data.tasks.filter((task) => task.assignee === emp.id && task.status !== '已完成');
    const handoverOptions = state.data.employees
      .filter((item) => item.id !== emp.id && !item.archived)
      .map((item) => `<option value="${item.id}">${escapeHtml(item.name)} · ${escapeHtml(item.role)}</option>`)
      .join('');
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(emp.id)}" />
      <div class="modal-note">归档后该员工不再接新任务、不再出现在项目群里，但历史会话、交付物和账本记录全部保留。<br>当前有 <strong>${openTasks.length}</strong> 个未完成任务需要交接。</div>
      <label>交接给<select name="handoverTo" ${openTasks.length ? 'required' : ''}><option value="">不交接</option>${handoverOptions}</select></label>
      <label>离职 / 归档原因<textarea name="reason" maxlength="200" placeholder="例如：岗位合并，工作转交白鹭"></textarea></label>
      <div class="modal-note">${openTasks.length ? `将转交：${openTasks.map((task) => escapeHtml(task.title)).join('、')}` : '没有未完成任务，可以直接归档。'}</div>`;
    return;
  } else if (type === 'employee-edit') {
    const emp = employee(id);
    if (!emp) return;
    title.textContent = '编辑员工档案';
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(emp.id)}" />
      <label>姓名<input name="name" required maxlength="20" value="${escapeHtml(emp.name)}" /></label>
      <label>岗位<input name="role" maxlength="30" value="${escapeHtml(emp.role)}" /></label>
      <label>部门
        <select name="dept">
          ${['内容部', '生产部', '支持部', '管理部'].map((dept) => `<option ${emp.dept === dept ? 'selected' : ''}>${dept}</option>`).join('')}
        </select>
      </label>
      <label>职责说明<textarea name="desc" maxlength="120">${escapeHtml(emp.desc || '')}</textarea></label>
      <label>工具（逗号分隔）<input name="tools" maxlength="160" value="${escapeHtml((emp.tools || []).join(', '))}" /></label>
      <label>技能（逗号分隔）<input name="skills" maxlength="160" value="${escapeHtml((emp.skills || []).join(', '))}" /></label>
      <label>权限（逗号分隔）<input name="permissions" maxlength="200" value="${escapeHtml((emp.permissions || []).join(', '))}" /></label>
      <label>汇报对象
        <select name="reportsTo">
          <option value="" ${!emp.reportsTo ? 'selected' : ''}>老板（直接汇报）</option>
          ${state.data.employees.filter((item) => item.id !== emp.id).map((item) => `<option value="${item.id}" ${emp.reportsTo === item.id ? 'selected' : ''}>${escapeHtml(item.name)} · ${escapeHtml(item.role)}</option>`).join('')}
        </select>
      </label>
      <label class="full">工作区目录（绝对路径）<input name="workspacePath" maxlength="240" value="${escapeHtml(emp.workspacePath || '')}" placeholder="留空自动使用 公司目录/employees/&lt;id&gt;" /></label>
      <label>使用模型<select name="model">${employeeModelSelectOptions(emp.modelProfile || {}, '按岗位自动匹配')}</select></label>
      <label>思考强度<select name="modelEffort">${employeeEffortOptions(emp.modelProfile?.effort || '')}</select></label>
      <div class="modal-note">当前生效模型：<strong>${escapeHtml(employeeModelLabel(emp))}</strong>（${escapeHtml(modelSourceLabel(emp.effectiveModel?.source || 'employee') || '岗位模型')}）。保存后下一轮对话生效；工作区是员工直接绑定的目录，参与项目时会在项目工作区下另建 workstations/&lt;员工&gt; 工位。</div>`;
  } else if (type === 'task-from-message') {
    const message = (state.data.chats[state.chat] || []).find((item) => item.id === id);
    if (!message) return;
    title.textContent = '从对话建任务';
    const fromEmployee = employee(message.from);
    const defaultProject = state.chat.startsWith('project:')
      ? state.chat.split(':')[1]
      : state.filterProject !== 'all'
        ? state.filterProject
        : state.data.projects[0]?.id || '';
    const projectOptions = state.data.projects
      .map((item) => `<option value="${item.id}" ${item.id === defaultProject ? 'selected' : ''}>${escapeHtml(item.name)}</option>`)
      .join('');
    const employeeOptions = state.data.employees
      .map((emp) => `<option value="${emp.id}" ${emp.id === message.from ? 'selected' : ''}>${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</option>`)
      .join('');
    const excerpt = String(message.text || '').replace(/\s+/g, ' ').slice(0, 220);
    const defaultTitle = String(message.text || '来自对话的任务').replace(/[#*`>\n\r]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 48);
    fields.innerHTML = `
      <input type="hidden" name="chatKey" value="${escapeHtml(state.chat)}" />
      <input type="hidden" name="messageId" value="${escapeHtml(message.id)}" />
      <div class="modal-note">来源：${escapeHtml(fromEmployee?.name || '对话')} · ${escapeHtml(message.time || '')}<br>「${escapeHtml(excerpt)}」</div>
      <label>任务标题<input name="title" required maxlength="80" value="${escapeHtml(defaultTitle)}" /></label>
      <label>所属项目<select name="project">${projectOptions}</select></label>
      <label>负责人<select name="assignee">${employeeOptions}</select></label>
      <label>优先级<select name="priority"><option value="低">低</option><option value="中" selected>中</option><option value="高">高</option><option value="紧急">紧急</option></select></label>
      <label>截止时间<input name="due" maxlength="20" placeholder="例如：11-20" /></label>
      <label class="full">验收标准<textarea name="acceptance" maxlength="1000" placeholder="从这段对话里提炼验收标准"></textarea></label>
      <label class="full">前置任务<input name="dependencies" maxlength="200" placeholder="可选，任务标题或 ID，多个用逗号分隔" /></label>
      <input type="hidden" name="autoRun" value="0" />
      <label class="settings-check"><input type="checkbox" name="autoRun" value="1" checked /> 纳入自动开工队列</label>
      <input type="hidden" name="isolation" value="0" />
      <label class="settings-check"><input type="checkbox" name="isolation" value="1" /> 任务级隔离区（Git worktree，验收后合并）</label>`;
  } else if (type === 'collect-deliverable') {
    const task = state.data.tasks.find((item) => item.id === id);
    if (!task) return;
    title.textContent = '收取交付物';
    fields.innerHTML = `
      <input type="hidden" name="taskId" value="${escapeHtml(task.id)}" />
      <div class="modal-note">任务：<strong>${escapeHtml(task.title)}</strong>　负责人：${escapeHtml(employee(task.assignee)?.name || '未分配')}<br>从该项目工作区里选择文件，提交后挂到任务上等待验收。</div>
      <div id="deliverable-file-area" class="modal-note">正在读取员工工位文件…</div>
      <label>交付说明<textarea name="note" maxlength="160" placeholder="说明这份交付物包含什么、怎么验收"></textarea></label>`;
  } else if (type === 'reject-deliverable') {
    const item = state.data.deliverables.find((deliverable) => deliverable.id === id);
    if (!item) return;
    title.textContent = '打回交付物';
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(item.id)}" />
      <div class="modal-note">交付物：<strong>${escapeHtml(item.name)}</strong><br>打回意见会自动回到责任员工会话，任务状态回到进行中。</div>
      <label>打回原因<textarea name="comment" required maxlength="240" placeholder="具体指出哪里不达标、需要怎么改"></textarea></label>`;
  } else if (type === 'deliverable-versions') {
    title.textContent = '交付物历史版本';
    fields.innerHTML = `
      <div class="modal-note">同一任务的多版交付物已合并，默认显示最新版；历史版本可以单独预览。</div>
      <div class="deliverable-version-list">
        ${state.deliverableVersions.map((item) => `
          <div class="deliverable-version-row">
            <span class="tag ${item.status === '已通过' ? 'ok' : item.status === '已打回' ? 'danger' : 'warn'}">v${item.version || 1} · ${escapeHtml(item.status)}</span>
            <div class="deliverable-version-main">
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.time || '')}${item.archived ? ' · 已归档' : ''}</span>
            </div>
            <button class="link-btn" type="button" data-action="preview-deliverable" data-id="${escapeHtml(item.id)}">预览</button>
          </div>`).join('')}
      </div>`;
    if (primary) primary.style.display = 'none';
  } else if (type === 'deliverable-preview') {
    title.textContent = '交付物预览';
    fields.innerHTML = '<div id="preview-body" class="modal-note">正在读取交付物…</div>';
    const primary = document.getElementById('modal-primary');
    if (primary) primary.style.display = 'none';
  } else if (type === 'new-memory') {
    title.textContent = '新建记忆';
    const projectOptions = state.data.projects.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('');
    const employeeOptions = state.data.employees.map((emp) => `<option value="${emp.id}">${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</option>`).join('');
    fields.innerHTML = `
      <label>知识名称<input name="name" required maxlength="80" placeholder="例如：ComfyUI 服务器 / 3D 打印设备参数 / 项目 X 流程" /></label>
      <label>分类<select name="category"><option value="公司制度">公司制度</option><option value="服务器">服务器</option><option value="设备">设备</option><option value="服务">服务</option><option value="流程">流程</option><option value="项目参数">项目参数</option><option value="客户">客户</option><option value="其他" selected>其他</option></select></label>
      <label>归属层级<select name="scope"><option value="公司">公司</option><option value="团队">团队</option><option value="项目">项目</option><option value="员工">员工</option></select></label>
      <label>所属团队<select name="team"><option value="">不指定</option>${(state.data.teams || []).map((team) => `<option value="${team.id}">${escapeHtml(team.name)}</option>`).join('')}</select></label>
      <label>所属项目<select name="project"><option value="">不指定</option>${projectOptions}</select></label>
      <label>所属员工<select name="employee"><option value="">不指定</option>${employeeOptions}</select></label>
      <label>检索标签<input name="tags" maxlength="160" placeholder="逗号分隔，例如：ComfyUI, GPU, 11434" /></label>
      <label class="settings-check"><input type="checkbox" name="pinned" value="1" /> 置顶（重要知识每轮都注入）</label>
      <label class="full">Markdown 内容<textarea name="content" required maxlength="20000" placeholder="写清型号、地址、端口、参数、步骤、注意事项。员工执行任务时会读到全文。"></textarea></label>
      <div class="modal-note">保存后写入 data/memory/ 下的 Markdown 文件；秘书和人事也可以在对话里用 save_memory 维护。</div>`;
  } else if (type === 'memory-preview') {
    title.textContent = '记忆预览';
    fields.innerHTML = '<div id="memory-preview-body" class="modal-note">正在读取记忆…</div>';
    if (primary) primary.style.display = 'none';
  } else if (type === 'memory-edit') {
    const detail = state.memoryDetail;
    const memory = detail?.memory;
    if (!memory) return;
    title.textContent = `编辑记忆 · ${memory.name}`;
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(memory.id)}" />
      <input type="hidden" name="baseVersion" value="${Number(memory.version || 1)}" />
      <div class="modal-note">当前 v${memory.version || 1}。如果期间有其他人修改，保存时会提示冲突，不会静默覆盖。</div>
      <label>记忆名称<input name="name" required maxlength="80" value="${escapeHtml(memory.name)}" /></label>
      <label>分类<select name="category">${['公司制度', '服务器', '设备', '服务', '流程', '项目参数', '客户', '其他'].map((value) => `<option value="${value}" ${(memory.category || '其他') === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label>
      <label>检索标签<input name="tags" maxlength="160" value="${escapeHtml((memory.tags || []).join(', '))}" placeholder="逗号分隔" /></label>
      <label class="settings-check"><input type="checkbox" name="pinned" value="1" ${memory.pinned ? 'checked' : ''} /> 置顶（每轮都注入）</label>
      <label>更新说明<input name="note" maxlength="200" placeholder="这次改了什么、为什么" /></label>
      <label class="full">Markdown 内容<textarea name="content" rows="14" required maxlength="20000">${escapeHtml(memory.content || '')}</textarea></label>`;
    return;
  } else if (type === 'upload-deliverable') {
    title.textContent = '上传交付物';
    const taskOptions = state.data.tasks
      .filter((task) => task.status !== '已完成')
      .map((task) => `<option value="${task.id}">${escapeHtml(task.title)} · ${escapeHtml(employee(task.assignee)?.name || '未分配')}</option>`)
      .join('');
    const projectOptions = state.data.projects.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('');
    const employeeOptions = state.data.employees.map((emp) => `<option value="${emp.id}">${escapeHtml(emp.name)} · ${escapeHtml(emp.role)}</option>`).join('');
    fields.innerHTML = `
      <label class="full">选择文件<input type="file" name="file" required /></label>
      <label>挂到任务<select name="taskId"><option value="">不挂任务，独立归档</option>${taskOptions}</select></label>
      <label>所属项目<select name="project">${projectOptions}</select></label>
      <label>负责人<select name="owner">${employeeOptions}</select></label>
      <label class="full">交付说明<textarea name="note" maxlength="300" placeholder="说明这份文件包含什么、怎么验收"></textarea></label>
      <div class="modal-note">文件保存在 data/uploads/，最大 20MB。挂到任务后会进入待验收，并记录版本号。</div>`;
    if (primary) primary.textContent = '上传';
  } else if (type === 'document-preview') {
    const doc = (state.data.documents || []).find((item) => item.id === id);
    if (!doc) return;
    title.textContent = doc.name;
    fields.innerHTML = `
      <div class="preview-meta">${escapeHtml(doc.category)} · ${escapeHtml(doc.scope)} · ${escapeHtml(employee(doc.ownerId)?.name || '未归档')} · ${escapeHtml(formatDateTime(doc.updatedAt))} · ${formatBytes(doc.size)}</div>
      <pre class="preview-text">${escapeHtml(doc.content || doc.summary || '（空文档）')}</pre>
      <div class="modal-note">归档路径：${escapeHtml(doc.path)}　状态：${escapeHtml(doc.status)}</div>`;
    if (primary) primary.style.display = 'none';
  } else if (type === 'expert-detail') {
    const expert = (state.data.experts || []).find((item) => item.id === id);
    if (!expert) return;
    const people = expertPeople(expert);
    const projects = expertProjects(expert);
    title.textContent = `${expert.name} · ${expert.profession || expert.title || '专家'}`;
    fields.innerHTML = `
      <div class="expert-profile">
        <span class="avatar lg" style="--c:${expert.color || '#0d9488'}">${escapeHtml(expert.name.slice(0, 1))}</span>
        <div>
          <div class="expert-name">${escapeHtml(expert.name)}</div>
          <div class="expert-title">${escapeHtml(expert.profession || expert.title || '专家')} · ${escapeHtml(expert.type || '外部')}</div>
        </div>
        <span class="tag ${expertStatusClass(expert.status)}">${escapeHtml(expert.status || '可调用')}</span>
      </div>
      <div class="preview-meta" style="margin-top:10px">${expert.source === 'workbuddy' ? `WorkBuddy 本地专家包 ${escapeHtml(expert.packageName || '')} v${escapeHtml(expert.packageVersion || '')}` : '公司内置专家'} · 绑定员工 ${people.map((emp) => escapeHtml(emp.name)).join('、') || '无'} · 项目 ${projects.map((proj) => escapeHtml(proj.name)).join('、') || '无'}</div>
      <p class="expert-bio">${escapeHtml(expert.bio || expert.description || '')}</p>
      <div class="expert-skills">${(expert.skills || []).map((skill) => `<span class="tag muted">${escapeHtml(skill)}</span>`).join('')}</div>
      <div class="preview-meta" style="margin-top:12px">${expert.source === 'workbuddy' ? '本地专家包' : `评分 ${escapeHtml(String(expert.rating || 0))} · 报价 ${escapeHtml(expert.rate || '内部')}`}</div>
      ${expert.promptExcerpt ? `<div class="modal-note">专家内容摘要（进入绑定员工/项目上下文）</div><pre class="preview-text expert-content-preview">${escapeHtml(expert.promptExcerpt.slice(0, 1200))}</pre>` : ''}
      <div class="modal-note">${people.length ? `已绑定员工：${people.map((emp) => escapeHtml(emp.name)).join('、')}，下一轮对话可引用专家方法。` : '尚未绑定员工；可在“绑定”里选择员工或项目。'}</div>
      ${people[0] ? `<button class="btn primary small" type="button" data-action="chat-expert" data-id="${people[0].id}">进入 ${escapeHtml(people[0].name)} 对话</button>` : ''}`;
    if (primary) primary.style.display = 'none';
  } else if (type === 'dataset-fields') {
    const dataset = (state.data.datasets || []).find((item) => item.id === id);
    if (!dataset) return;
    title.textContent = dataset.name;
    fields.innerHTML = `
      <div class="preview-meta">${escapeHtml(dataset.type)} · ${escapeHtml(project(dataset.projectId)?.name || '公司级')} · ${Number(dataset.rows || 0).toLocaleString()} 行 · ${escapeHtml(dataset.size)} · ${escapeHtml(dataset.source)}</div>
      <p class="catalog-desc">${escapeHtml(dataset.description)}</p>
      <div class="dataset-fields">${(dataset.fields || []).map((field, index) => `<span class="dataset-field"><em>${String(index + 1).padStart(2, '0')}</em>${escapeHtml(field)}</span>`).join('')}</div>
      <div class="modal-note">最近更新：${escapeHtml(formatDateTime(dataset.updatedAt))}</div>`;
    if (primary) primary.style.display = 'none';
  } else if (type === 'skill-view') {
    const skill = (state.data.skillCatalog || []).find((item) => item.id === id || item.name === id);
    if (!skill) return;
    title.textContent = skill.name;
    fields.innerHTML = `
      <div class="preview-meta">${escapeHtml(skill.category || '通用')} · ${escapeHtml(skill.description || '')}</div>
      <pre class="preview-text skill-content">${escapeHtml(skill.content || skill.instructions || '（还没有内容）')}</pre>
      <div class="modal-note">这段 SKILL 会完整注入到员工的系统提示里，员工按步骤执行，而不只是把它当关键词。</div>`;
    if (primary) primary.style.display = 'none';
  } else if (type === 'question-answer') {
    const record = (state.data.userQuestions || []).find((item) => item.id === id);
    if (!record) return;
    title.textContent = record.title || '待确认问题';
    fields.innerHTML = `${renderQuestionForm(record)}
      <div class="modal-note">点选或输入后提交，答案会作为一条消息发回给${escapeHtml(record.employeeName || '秘书')}继续推进。</div>`;
    if (primary) {
      primary.style.display = '';
      primary.textContent = '提交回答';
    }
    return;
  } else if (type === 'settings') {
    title.textContent = '设置';
    fields.innerHTML = renderSettingsFields();
    const primary = document.getElementById('modal-primary');
    if (primary) primary.textContent = '保存设置';
  } else if (type === 'outbound') {
    const proj = project(id);
    if (!proj) return;
    title.textContent = '新建外部动作';
    fields.innerHTML = `
      <input type="hidden" name="projectId" value="${escapeHtml(proj.id)}" />
      <div class="modal-note">项目：<strong>${escapeHtml(proj.name)}</strong><br>这是 L4 外部动作，必须审批。当前版本只写入本地 outbox，不会真的发邮件或调用外部渠道。</div>
      <label>渠道
        <select name="channel">
          <option value="email">邮件</option>
          <option value="wecom">企业微信</option>
          <option value="webhook">Webhook</option>
        </select>
      </label>
      <label>收件人<input name="recipient" required maxlength="120" placeholder="邮箱、群名或 webhook 地址" /></label>
      <label>主题<input name="subject" maxlength="120" placeholder="可选" /></label>
      <label>正文<textarea name="body" required maxlength="2000" placeholder="要对外发送的内容"></textarea></label>`;
  } else if (type === 'project-revenue') {
    const proj = project(id);
    if (!proj) return;
    title.textContent = `记一笔收入 · ${proj.name}`;
    fields.innerHTML = `
      <input type="hidden" name="projectId" value="${escapeHtml(proj.id)}" />
      <label>日期<input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" /></label>
      <label>金额<input name="amount" type="number" step="0.01" required placeholder="退款填负数" /></label>
      <label>类型<select name="type">${['订阅', '买断', '广告', '外包', '赞助', '退款', '其他'].map((value) => `<option>${value}</option>`).join('')}</select></label>
      <label>渠道<input name="channel" maxlength="60" placeholder="例如：微信 / Stripe / 对公" /></label>
      <label class="full">备注<textarea name="note" maxlength="300" placeholder="这笔收入对应什么"></textarea></label>`;
  } else if (type === 'project-cost') {
    const proj = project(id);
    if (!proj) return;
    title.textContent = `添加成本 · ${proj.name}`;
    fields.innerHTML = `
      <input type="hidden" name="projectId" value="${escapeHtml(proj.id)}" />
      <label>名称<input name="name" required maxlength="80" placeholder="例如：服务器 / 域名 / AI 接口" /></label>
      <label>类别<select name="category">${['服务器', '数据库', '域名', '证书', 'AI 接口', '开发者账号', '工具订阅', '外包', '其他'].map((value) => `<option>${value}</option>`).join('')}</select></label>
      <label>金额<input name="amount" type="number" min="0" step="0.01" required /></label>
      <label>周期<select name="cycle"><option value="月">月付</option><option value="年">年付</option><option value="一次性">一次性</option></select></label>
      <label>下次续费<input name="renew" type="date" /></label>
      <label class="full">备注<textarea name="note" maxlength="300"></textarea></label>`;
  } else if (type === 'project-release') {
    const proj = project(id);
    if (!proj) return;
    title.textContent = `记录发版 · ${proj.name}`;
    fields.innerHTML = `
      <input type="hidden" name="projectId" value="${escapeHtml(proj.id)}" />
      <label>版本号<input name="version" required maxlength="40" value="${escapeHtml(proj.version || 'v0.1.0')}" /></label>
      <label>日期<input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" /></label>
      <label>环境<select name="env"><option value="开发">开发</option><option value="测试">测试</option><option value="生产">生产</option></select></label>
      <label class="full">更新说明<textarea name="note" maxlength="500" placeholder="这次改了什么"></textarea></label>
      <div class="modal-note">选择「生产」会把这个版本写回项目的当前版本。</div>`;
  } else if (type === 'project-asset') {
    const proj = project(id);
    if (!proj) return;
    title.textContent = `添加资料证书 · ${proj.name}`;
    fields.innerHTML = `
      <input type="hidden" name="projectId" value="${escapeHtml(proj.id)}" />
      <label>名称<input name="name" required maxlength="120" placeholder="例如：ICP 备案 / 客户合同 / Apple 开发者账号" /></label>
      <label>分类<select name="category">${['证书', '签名', '资质证照', '合同', '账号', '其他'].map((value) => `<option>${value}</option>`).join('')}</select></label>
      <label>编号 / 账号<input name="no" maxlength="120" placeholder="证书编号、合同号、登录邮箱（不要填密码）" /></label>
      <label>到期日<input name="expire" type="date" /></label>
      <label class="full">备注<textarea name="note" maxlength="500" placeholder="文件放在哪、续费方式等"></textarea></label>`;
  } else if (type === 'company-audit') {
    const audit = state.companyAudit || { findings: [], total: 0, bySeverity: {}, byOwner: {}, byArea: {} };
    const scope = state.companyAuditScope || 'all';
    const findings = audit.findings || [];
    const tabs = [
      ['all', '全部'],
      ['project', `项目 · 秘书 ${audit.byOwner?.秘书 || 0}`],
      ['company', `公司 · 人事 ${audit.byOwner?.人事 || 0}`],
    ];
    title.textContent = `公司体检 · ${audit.total || 0} 个缺口`;
    fields.innerHTML = `
      <div class="modal-note">项目域由秘书维护：描述、技术栈、快捷入口、成员、里程碑、项目知识、收支、资料证书、运维。公司域由人事行政维护：公司信息、工具、技能、专家、知识库、服务器、设备、员工模型、模型能力、数据备份。</div>
      <div class="tab-switch" style="margin-bottom:10px">
        ${tabs.map(([key, label]) => `<button class="tab-btn ${scope === key ? 'active' : ''}" type="button" data-action="audit-scope" data-value="${key}">${escapeHtml(label)}</button>`).join('')}
      </div>
      <div class="audit-summary">
        <span class="tag danger">高 ${Number(audit.bySeverity?.high || 0)}</span>
        <span class="tag warn">中 ${Number(audit.bySeverity?.medium || 0)}</span>
        <span class="tag muted">低 ${Number(audit.bySeverity?.low || 0)}</span>
        <span class="tag info">秘书 ${Number(audit.byOwner?.秘书 || 0)}</span>
        <span class="tag info">人事 ${Number(audit.byOwner?.人事 || 0)}</span>
      </div>
      ${
        findings.length
          ? `<div class="pd-table-wrap" style="max-height:52vh;overflow:auto"><table class="pd-table"><thead><tr><th>归属</th><th>领域</th><th>对象</th><th>缺口</th><th>建议</th><th>级别</th></tr></thead><tbody>${findings
              .map(
                (item) => `<tr>
                  <td><span class="tag ${item.owner === '秘书' ? 'info' : 'muted'}">${escapeHtml(item.owner || '人事')}</span></td>
                  <td>${escapeHtml(item.area || '公司')}</td>
                  <td>${escapeHtml(item.projectName || item.targetName || '公司')}</td>
                  <td>${escapeHtml(item.detail || '')}</td>
                  <td>${escapeHtml(item.suggestion || '')}</td>
                  <td><span class="tag ${item.severity === 'high' ? 'danger' : item.severity === 'medium' ? 'warn' : 'muted'}">${escapeHtml(item.severity || 'low')}</span></td>
                </tr>`,
              )
              .join('')}</tbody></table></div>`
          : '<div class="empty small">这个范围没有发现明显缺口，资料挺完整。</div>'
      }
      <div class="modal-note">「生成维护任务」只处理高/中级别：项目缺口派给秘书，公司域缺口派给人事；重复执行不会重复建任务。</div>`;
    if (primary) {
      primary.textContent = '生成维护任务';
      primary.style.display = '';
    }
  } else if (type === 'project-edit') {
    const proj = project(id);
    if (!proj) return;
    title.textContent = '项目设置';
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(proj.id)}" />
      <label>项目名称<input name="name" required maxlength="40" value="${escapeHtml(proj.name)}" /></label>
      <label>项目描述<textarea name="desc" maxlength="120">${escapeHtml(proj.desc || '')}</textarea></label>
      <label>当前版本<input name="version" maxlength="40" value="${escapeHtml(proj.version || 'v0.1.0')}" /></label>
      <label>用户数<input name="users" type="number" min="0" step="1" value="${Number(proj.users || 0)}" /></label>
      <label>技术栈<input name="techStack" maxlength="300" value="${escapeHtml((proj.techStack || []).join('，'))}" placeholder="逗号分隔，例如：Next.js，Supabase" /></label>
      <label>合同金额<input name="contractAmount" type="number" min="0" step="1" value="${Number(proj.contractAmount || 0)}" /></label>
      <label>所属团队<select name="teamId"><option value="">不绑定团队</option>${(state.teams || []).map((team) => `<option value="${team.id}" ${proj.teamId === team.id ? 'selected' : ''}>${escapeHtml(team.name)} · ${team.members.length} 人</option>`).join('')}</select></label>
      <label>真实工作区目录<input name="workspacePath" maxlength="240" value="${escapeHtml(proj.workspacePath || '')}" placeholder="例如 C:\\Projects\\my-project" /></label>
      <label>截止时间<input name="due" maxlength="20" value="${escapeHtml(proj.due || '')}" /></label>
      <label>预算（元）<input name="budget" type="number" min="0" step="1" value="${Number(proj.budget || 0)}" /></label>
      <label>预算预警线（%）<input name="budgetWarning" type="number" min="1" max="100" value="${Number(proj.budgetWarning || 80)}" /></label>
      <label>状态
        <select name="status">
          ${['待启动', '进行中', '已暂停', '已完成'].map((status) => `<option ${proj.status === status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
      </label>
      <div class="full pd-link-edit-grid">
        ${PROJECT_LINKS.map((link) => `<label>${link.label}<input name="link_${link.key}" maxlength="500" value="${escapeHtml(proj.links?.[link.key] || '')}" placeholder="${link.hint} https://" /></label>`).join('')}
      </div>
      <div class="modal-note">绑定真实目录后，项目群会话会使用该目录作为工作区；快捷入口会显示在项目详情和概览里。</div>`;
  } else if (type === 'project-snapshots') {
    const proj = project(id);
    if (!proj) return;
    title.textContent = `快照历史 · ${proj.name}`;
    fields.innerHTML = '<div id="snapshot-list" class="snapshot-list"><div class="modal-note">正在读取快照…</div></div>';
    const primary = document.getElementById('modal-primary');
    if (primary) primary.style.display = 'none';
  } else if (type === 'rollback-snapshot') {
    const pending = state.pendingRollback;
    const proj = pending ? project(pending.projectId) : null;
    if (!pending || !proj) return;
    title.textContent = '回滚项目工作区';
    fields.innerHTML = `
      <div class="modal-note">项目：<strong>${escapeHtml(proj.name)}</strong><br>快照：<strong>${escapeHtml(pending.label || pending.snapshotId)}</strong><br>回滚会用快照覆盖当前工作区中已被快照跟踪的文件，未跟踪文件不会被删除。请确认没有正在运行的员工任务。</div>
      <label style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" name="confirm" value="1" style="width:14px;height:14px" required /> 我确认回滚到该快照</label>`;
  } else if (type === 'reject-approval') {
    const approval = (state.data.approvals || []).find((item) => item.id === id);
    if (!approval) return;
    title.textContent = '拒绝写操作';
    fields.innerHTML = `
      <input type="hidden" name="id" value="${escapeHtml(approval.id)}" />
      <div class="modal-note">${escapeHtml(approval.employeeName || '员工')} 请求 ${escapeHtml(approval.toolName)}${approval.filePath ? `：${escapeHtml(approval.filePath)}` : ''}<br>拒绝后员工会收到原因，文件不会写入。</div>
      <label>拒绝原因<textarea name="comment" required maxlength="240" placeholder="例如：这个文件不该改，先说明影响范围"></textarea></label>`;
  }

  modal.hidden = false;
  setTimeout(() => {
    fields.querySelector('input, select, textarea')?.focus();
  }, 30);
}

async function openCollectDeliverableModal(taskId) {
  openModal('collect-deliverable', taskId);
  const task = state.data.tasks.find((item) => item.id === taskId);
  const area = document.getElementById('deliverable-file-area');
  if (!task || !area) return;
  area.textContent = '正在读取员工工位文件…';
  try {
    const payload = await api(`/api/employee-files?employeeId=${encodeURIComponent(task.assignee)}&projectId=${encodeURIComponent(task.project)}&taskId=${encodeURIComponent(task.id)}`);
    if (!payload.files || payload.files.length === 0) {
      area.innerHTML = `项目工作区 <strong>${escapeHtml(payload.cwd || '')}</strong> 里还没有文件。先让员工把交付物写进项目工作区，再来收取。`;
      return;
    }
    area.innerHTML = `
      <label>选择工位文件<select name="filePath">${payload.files
        .map((file) => `<option value="${escapeHtml(file.path)}">${escapeHtml(file.path)} · ${(file.size / 1024).toFixed(1)} KB</option>`)
        .join('')}</select></label>`;
  } catch (error) {
    area.textContent = `读取工位文件失败：${error.message}`;
  }
}

function renderOfficePreview(preview, name = '') {
  if (preview.kind === 'docx') {
    return `<div class="office-doc">${(preview.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>`;
  }
  if (preview.kind === 'xlsx') {
    return `<div class="office-sheets">${(preview.sheets || [])
      .map(
        (sheet) => `<div class="office-sheet"><div class="office-sheet-name">${escapeHtml(sheet.name)}</div><div class="asset-table-wrap"><table class="asset-table office-table"><tbody>${(sheet.rows || [])
          .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
          .join('')}</tbody></table></div></div>`,
      )
      .join('')}</div>`;
  }
  if (preview.kind === 'pptx') {
    return `<div class="office-slides">${(preview.slides || [])
      .map(
        (slide) => `<div class="office-slide"><div class="office-slide-no">第 ${slide.index} 页</div><h3>${escapeHtml(slide.title || '')}</h3>${(slide.paragraphs || []).slice(1).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>`,
      )
      .join('')}</div>`;
  }
  return `<div class="modal-note">${escapeHtml(name)} 暂不支持该 Office 格式。</div>`;
}

async function setDeliverableArchived(id, archived) {
  try {
    const payload = await api('/api/deliverables/archive', {
      method: 'POST',
      body: JSON.stringify({ id, archived }),
    });
    applyServerState(payload.state);
    render();
    showToast(archived ? '交付物已归档' : '交付物已恢复');
  } catch (error) {
    showToast(`交付物归档失败：${error.message}`);
  }
}

async function archiveProcessedDeliverables() {
  const projectId = state.filterProject === 'all' ? '' : state.filterProject;
  if (!confirm('把所有「已通过 / 已打回」的交付物归档？归档后可在「已归档」里查看和恢复。')) return;
  try {
    const payload = await api('/api/deliverables/archive-processed', {
      method: 'POST',
      body: JSON.stringify({ projectId }),
    });
    applyServerState(payload.state);
    state.deliverableFilter = 'archived';
    render();
    showToast(`已归档 ${payload.count} 个已处理交付物`);
  } catch (error) {
    showToast(`批量归档失败：${error.message}`);
  }
}

function openDeliverableVersions(taskId, name) {
  const list = (state.data.deliverables || [])
    .filter((item) => (taskId ? item.taskId === taskId : item.name === name))
    .sort((a, b) => Number(b.version || 1) - Number(a.version || 1));
  if (!list.length) return;
  state.deliverableVersions = list;
  openModal('deliverable-versions');
}

async function previewDeliverable(id) {
  await openPreviewDesk(id);
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function renderUsageRows(rows) {
  if (!rows || rows.length === 0) return '<tr><td colspan="5">还没有真实模型调用记录。</td></tr>';
  return rows
    .map((row) => {
      const employeeName = employee(row.employeeId)?.name || row.employeeId || '—';
      const time = row.time ? new Date(row.time).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
      return `<tr>
        <td>${escapeHtml(time)}</td>
        <td>${escapeHtml(employeeName)}</td>
        <td>${escapeHtml(row.source === 'group' ? '项目群' : '1:1')}</td>
        <td>${formatNumber(row.totalTokens)}</td>
        <td>${money(row.cost || 0)}</td>
      </tr>`;
    })
    .join('');
}

function providerInitial(name, id = '') {
  const value = String(name || id || 'M').replace(/^cn:/, '');
  return escapeHtml(value.slice(0, 1).toUpperCase());
}

function providerDisplayName(providerId) {
  const group = (state.modelCatalog?.groups || []).find((item) => item.id === providerId);
  if (group) return group.name;
  if (providerId === 'deepseek-account') return 'DeepSeek 账号';
  return providerId || '自定义模型 API';
}

function providerDraftFrom(provider = {}) {
  return {
    id: provider.id || '',
    name: provider.name || '',
    baseUrl: provider.baseUrl || '',
    apiKey: '',
    hasApiKey: Boolean(provider.hasApiKey),
    apiKeyMasked: provider.apiKeyMasked || '',
    models: (provider.models || []).map((model) => ({
      id: model.id,
      name: model.name || model.id,
      vision: model.vision === true,
      reasoning: model.reasoning === true,
      contextWindow: Number(model.contextWindow) || 128000,
      maxOutputTokens: Number(model.maxOutputTokens) || 8192,
    })),
    modelsText: (provider.models || []).map((model) => model.id).join('\n'),
    isNew: !provider.id,
  };
}

function readProviderModelRows(fallback = []) {
  const table = document.getElementById('provider-model-table');
  const rows = table ? [...table.querySelectorAll('.provider-model-row')] : [];
  if (table && !rows.length) return [];
  if (!rows.length) return Array.isArray(fallback) ? fallback : [];
  return rows
    .map((row) => {
      const id = row.querySelector('.pm-id')?.value.trim() || '';
      if (!id) return null;
      return {
        id,
        name: row.querySelector('.pm-name')?.value.trim() || id,
        vision: Boolean(row.querySelector('.pm-vision')?.checked),
        reasoning: Boolean(row.querySelector('.pm-reasoning')?.checked),
        contextWindow: Math.max(1, Number(row.querySelector('.pm-context')?.value) || 128000),
        maxOutputTokens: Math.max(1, Number(row.querySelector('.pm-output')?.value) || 8192),
      };
    })
    .filter(Boolean);
}

function readProviderDraftFromDom() {
  const draft = state.providerDraft || providerDraftFrom();
  const nameEl = document.getElementById('provider-name');
  const baseEl = document.getElementById('provider-base-url');
  const keyEl = document.getElementById('provider-api-key');
  if (nameEl) draft.name = nameEl.value;
  if (baseEl) draft.baseUrl = baseEl.value;
  if (keyEl && keyEl.value) draft.apiKey = keyEl.value;
  draft.models = readProviderModelRows(draft.models);
  draft.modelsText = draft.models.map((model) => model.id).join('\n');
  return draft;
}

function providerModelIds(text) {
  return String(text || '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderProviderModelRows(models = []) {
  if (!models.length) {
    return '<div class="provider-model-empty">还没有模型。点「扫描模型」从服务端拉取，或手动填一个模型 ID 后添加。</div>';
  }
  return models
    .map(
      (model, index) => `
      <div class="provider-model-row" data-index="${index}">
        <div class="pm-main">
          <input class="pm-id" value="${escapeHtml(model.id || '')}" placeholder="模型 ID" />
          <input class="pm-name" value="${escapeHtml(model.name || '')}" placeholder="显示名（可选）" />
        </div>
        <div class="pm-capabilities">
          <label class="pm-check" title="模型是否接受图片输入"><input type="checkbox" class="pm-vision" ${model.vision ? 'checked' : ''} /> 图片</label>
          <label class="pm-check" title="模型是否支持思考 / reasoning"><input type="checkbox" class="pm-reasoning" ${model.reasoning ? 'checked' : ''} /> 思考</label>
          <label class="pm-num">上下文<input type="number" class="pm-context" min="1" step="1000" value="${Number(model.contextWindow) || 128000}" /></label>
          <label class="pm-num">输出<input type="number" class="pm-output" min="1" step="1000" value="${Number(model.maxOutputTokens) || 8192}" /></label>
        </div>
        <button class="link-danger pm-remove" type="button" data-action="provider-remove-model-row" data-index="${index}">删除</button>
      </div>`,
    )
    .join('');
}

function renderProviderEditor(draft, test) {
  return `
    <div class="provider-editor provider-editor-open" id="provider-editor">
      <div class="provider-editor-head">
        <span class="provider-logo large">${providerInitial(draft.name || draft.id, draft.id)}</span>
        <div class="provider-editor-copy">
          <strong>${draft.isNew ? '添加模型服务' : `编辑「${escapeHtml(draft.name || draft.id)}」`}</strong>
          <span>兼容 OpenAI 协议的模型 API，例如 DeepSeek、通义、Moonshot、自建网关</span>
        </div>
        <button class="btn ghost small" type="button" data-action="provider-cancel">取消</button>
      </div>

      <div class="provider-field">
        <label for="provider-name">名称</label>
        <input id="provider-name" maxlength="60" value="${escapeHtml(draft.name)}" placeholder="例如 DeepSeek / 公司网关" />
        <div class="provider-field-hint">只用于界面展示，可以随意取名。</div>
      </div>

      <div class="provider-field">
        <label for="provider-base-url">API 端点</label>
        <input id="provider-base-url" maxlength="300" value="${escapeHtml(draft.baseUrl)}" placeholder="https://api.deepseek.com/v1" />
        <div class="provider-field-hint">OpenAI 兼容的基础地址，通常以 /v1 结尾。不要填 /chat/completions。</div>
      </div>

      <div class="provider-field">
        <label for="provider-api-key">API 密钥</label>
        <div class="secret-input">
          <input id="provider-api-key" type="password" maxlength="400" placeholder="${draft.hasApiKey ? `已保存 ${escapeHtml(draft.apiKeyMasked)}，留空不修改` : '粘贴 API Key'}" autocomplete="new-password" />
          <button type="button" data-action="provider-toggle-key" id="provider-toggle-key-btn">显示</button>
        </div>
        <div class="provider-field-hint">${draft.hasApiKey ? '已保存的密钥不会回显；留空表示继续使用。' : '密钥只保存在本机 data/settings.json，不会上传。'}</div>
      </div>

      <div class="provider-field">
        <label>模型与能力</label>
        <div class="provider-model-toolbar">
          <input id="provider-model-input" maxlength="160" placeholder="手动输入模型 ID，例如 deepseek-chat" />
          <button class="btn ghost small" type="button" data-action="provider-add-model-row">添加</button>
        </div>
        <div class="provider-model-table" id="provider-model-table">${renderProviderModelRows(draft.models)}</div>
        <div class="provider-field-hint">「扫描模型」会从服务端拉取全部可用模型，并按模型名推测图片 / 思考能力；扫描后可以逐项修改上下文和最大输出。保存时会写入模型补丁。</div>
      </div>

      ${test ? `<div class="provider-test-result ${test.ok ? 'ok' : 'fail'}">
        ${test.ok ? `连接成功 · 扫描到 ${test.count || 0} 个模型 · ${test.latencyMs || 0}ms` : `连接失败：${escapeHtml(test.error || '未知错误')}`}
        ${test.ok ? '<div class="provider-field-hint">已把扫描结果填入上面的表格，请确认能力后再保存。</div>' : ''}
      </div>` : ''}

      <div class="settings-actions provider-editor-actions">
        <button class="btn ghost small" type="button" data-action="provider-test">扫描模型 / 测试连接</button>
        <button class="btn primary small" type="button" data-action="provider-save">${draft.isNew ? '保存并启用' : '保存修改'}</button>
        <span id="provider-save-status" class="settings-status"></span>
      </div>
    </div>`;
}

function renderSettingsModelSection(s) {
  const catalog = state.modelCatalog;
  const providers = (s.providers || []).filter((item) => item && item.id);
  const groups = catalog?.groups || [];
  const draft = state.providerDraft;
  const test = state.providerTest;
  const configured = Boolean(s.configured);
  const allModels = groups.flatMap((group) => (group.models || []).map((model) => ({ provider: group.id, ...model })));
  const currentProvider = providers.find((item) => item.id === s.provider);
  const modelName = allModels.find((item) => item.provider === s.provider && item.id === s.model)?.name || s.model || '未配置模型';
  const maxContext = Math.max(0, ...providers.flatMap((provider) => (provider.models || []).map((model) => Number(model.contextWindow) || 0)));
  const maxOutput = Math.max(0, ...providers.flatMap((provider) => (provider.models || []).map((model) => Number(model.maxOutputTokens) || 0)));

  return `
    <div class="settings-section dsh-model-settings">
      <div class="settings-section-head">
        <h3>模型设置</h3>
        <p>员工的每一次对话、任务和会议都由这里的默认模型驱动。可以添加多个模型服务，随时切换。</p>
      </div>

      ${
        configured
          ? `<div class="model-hero-card">
              <div class="model-hero-main">
                <span class="model-hero-logo">${providerInitial(currentProvider?.name || s.provider, s.provider)}</span>
                <div class="model-hero-copy">
                  <span class="model-hero-kicker">默认模型</span>
                  <strong id="model-hero-name">${escapeHtml(modelName)}</strong>
                  <span class="model-hero-id" id="model-hero-id">${escapeHtml(s.provider || '—')} / ${escapeHtml(s.model || '—')}</span>
                </div>
                <button class="btn ghost small" type="button" data-action="toggle-model-picker">${state.modelPickerOpen ? '收起模型列表' : '切换默认模型'}</button>
              </div>
              <div class="model-hero-tags">
                <span class="provider-status ok"><i></i>已配置</span>
                ${s.hasApiKey || currentProvider?.hasApiKey ? '<span class="tag ok">密钥已保存</span>' : '<span class="tag muted">未设置密钥（网关可免密）</span>'}
                <span class="tag muted">${providers.length} 个模型服务</span>
              </div>
            </div>`
          : `<div class="model-empty-banner">
              <strong>还没有可用的模型</strong>
              <span>员工现在无法对话。点下面的「添加模型服务」填一个 OpenAI 兼容的 API，或者点左侧「配置向导」重新走一遍引导。</span>
            </div>`
      }

      <div class="model-picker-panel" id="model-picker" ${state.modelPickerOpen && allModels.length ? '' : 'hidden'}>
        <div class="model-picker-search-wrap">
          <input id="model-picker-search" class="model-picker-search" type="search" placeholder="搜索模型名称或 ID…" autocomplete="off" />
          <span class="hint">${allModels.length} 个可选模型</span>
        </div>
        <div class="model-picker-list" id="model-picker-list">
          ${
            groups
              .filter((group) => (group.models || []).length)
              .map(
                (group) => `
              <div class="model-picker-group" data-model-group>
                <div class="model-picker-group-name">${escapeHtml(group.name)} <span>${group.models.length}</span></div>
                ${group.models
                  .map(
                    (model) => `<button class="model-option ${s.provider === group.id && s.model === model.id ? 'active' : ''}" type="button" data-action="provider-pick" data-id="${escapeHtml(group.id)}" data-model="${escapeHtml(model.id)}">
                      <span class="model-option-main"><strong>${escapeHtml(model.name || model.id)}</strong><span>${escapeHtml(group.id)} / ${escapeHtml(model.id)}${model.vision ? ' · 图片' : ''}${model.reasoning ? ' · 思考' : ''}</span></span>
                      ${s.provider === group.id && s.model === model.id ? '<span class="model-option-check">✓</span>' : ''}
                    </button>`,
                  )
                  .join('')}
              </div>`,
              )
              .join('') || '<div class="empty small">还没有模型。先添加一个模型服务。</div>'
          }
        </div>
      </div>

      <div class="provider-list-head">
        <div>
          <h4>模型服务</h4>
          <span class="hint">${providers.length} 个已配置${catalog?.bridge ? ' · 控制面已连接' : ' · 控制面未连接（不影响配置）'}</span>
        </div>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="gateway-add-provider">从网关导入</button>
          <button class="btn ghost small" type="button" data-action="provider-new">＋ 添加模型服务</button>
        </div>
      </div>

      <div class="provider-manage-list">
        ${
          providers
            .map((provider) => {
              const isDefault = provider.id === s.provider;
              return `<div class="provider-manage-row ${isDefault ? 'is-default' : ''}">
                <span class="provider-logo">${providerInitial(provider.name, provider.id)}</span>
                <div class="provider-manage-main">
                  <strong>${escapeHtml(provider.name || provider.id)} ${isDefault ? '<span class="tag ok">默认</span>' : ''}</strong>
                  <span>${escapeHtml(provider.baseUrl || '未填端点')} · ${provider.models?.length || 0} 个模型</span>
                </div>
                <span class="provider-status ${provider.baseUrl && provider.models?.length ? 'ok' : ''}"><i></i>${provider.enabled === false ? '已停用' : provider.baseUrl ? '可用' : '待完善'}</span>
                <div class="provider-manage-actions">
                  ${isDefault ? '' : `<button class="btn ghost small" type="button" data-action="provider-default" data-id="${escapeHtml(provider.id)}">设为默认</button>`}
                  <button class="btn ghost small" type="button" data-action="provider-edit" data-id="${escapeHtml(provider.id)}">编辑</button>
                  <button class="link-danger" type="button" data-action="provider-delete" data-id="${escapeHtml(provider.id)}">删除</button>
                </div>
                <div class="provider-manage-models ${(state.expandedProviders || []).includes(provider.id) ? 'expanded' : ''}">
                  ${(() => {
                    const models = provider.models || [];
                    const expanded = (state.expandedProviders || []).includes(provider.id);
                    const visible = expanded ? models : models.slice(0, 4);
                    const chips = visible
                      .map(
                        (model) => `<button type="button" class="provider-model-chip ${isDefault && s.model === model.id ? 'active' : ''}" data-action="provider-pick" data-id="${escapeHtml(provider.id)}" data-model="${escapeHtml(model.id)}">${escapeHtml(model.name || model.id)}<span>${escapeHtml(model.id)}${model.vision ? ' · 图片' : ''}${model.reasoning ? ' · 思考' : ''}</span></button>`,
                      )
                      .join('');
                    const more = models.length > 4
                      ? `<button type="button" class="provider-models-toggle" data-action="toggle-provider-models" data-id="${escapeHtml(provider.id)}">${expanded ? '收起' : `展开全部 ${models.length} 个模型`}</button>`
                      : '';
                    return chips + more || '<span class="hint">还没有模型 ID</span>';
                  })()}
                </div>
              </div>`;
            })
            .join('') || '<div class="empty small">还没有模型服务。点「添加模型服务」开始配置。</div>'
        }
      </div>

      ${draft ? renderProviderEditor(draft, test) : ''}

      <div class="provider-note">
        <strong>保存后</strong>会写入 <code>data/runtime/dsh-model.patch.yml</code>，新会话直接生效；正在运行的旧会话可重启 <code>npm run dsh</code>。
      </div>

      <details class="model-advanced-block">
        <summary>高级参数（温度 / 上下文 / 计费）</summary>
        <div class="settings-grid">
          <label>Temperature<input name="temperature" type="number" min="0" max="2" step="0.1" value="${escapeHtml(s.temperature ?? 0.3)}" /></label>
          <label>Max Tokens（自动取模型最大值）<input name="maxTokens" type="number" min="1" step="1" value="${maxOutput || 32768}" readonly /></label>
          <label>Context Window（自动取模型最大值）<input name="contextWindow" type="number" min="1" step="1" value="${maxContext || 128000}" readonly /></label>
          <label>输入价格 / 1M tokens<input name="inputPricePerM" type="number" min="0" step="0.0001" value="${escapeHtml(s.inputPricePerM ?? 0)}" /></label>
          <label>输出价格 / 1M tokens<input name="outputPricePerM" type="number" min="0" step="0.0001" value="${escapeHtml(s.outputPricePerM ?? 0)}" /></label>
        </div>
        <div class="settings-actions">
          <button class="btn ghost small" type="button" data-action="provider-refresh-capabilities">重新识别全部模型能力</button>
          <button class="btn ghost small" type="button" data-action="save-model-advanced">保存高级参数</button>
          <button class="btn ghost small" type="button" data-action="restart-onboarding">重新运行配置向导</button>
          <span id="model-advanced-status" class="settings-status"></span>
        </div>
      </details>
    </div>`;
}

function routeMatchOptions(scope, selected) {
  const options = [];
  if (scope === 'employee') {
    for (const emp of state.data.employees) options.push([emp.id, `${emp.name} · ${emp.role}`]);
  } else if (scope === 'dept') {
    for (const dept of [...new Set(state.data.employees.map((emp) => emp.dept).filter(Boolean))]) options.push([dept, dept]);
  } else if (scope === 'project') {
    for (const item of state.data.projects) options.push([item.id, item.name]);
  } else if (scope === 'priority') {
    for (const item of ['低', '中', '高', '紧急']) options.push([item, item]);
  } else {
    options.push(['*', '所有未命中的调用']);
  }
  return options.map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('');
}

function renderModelRouteRow(route = {}, index = 0) {
  const scope = route.scope || 'employee';
  return `
    <div class="model-route-row" data-route-row>
      <input type="hidden" data-role="id" value="${escapeHtml(route.id || '')}" />
      <select data-role="scope" aria-label="作用域">${[
        ['employee', '员工'],
        ['dept', '部门'],
        ['project', '项目'],
        ['priority', '优先级'],
        ['default', '默认'],
      ]
        .map(([value, label]) => `<option value="${value}" ${scope === value ? 'selected' : ''}>${label}</option>`)
        .join('')}</select>
      <select data-role="match" aria-label="匹配">${routeMatchOptions(scope, route.match || '')}</select>
      <input data-role="provider" value="${escapeHtml(route.provider || '')}" placeholder="provider" list="model-provider-list" />
      <input data-role="model" value="${escapeHtml(route.model || '')}" placeholder="model id" list="model-catalog-list" />
      <input data-role="note" value="${escapeHtml(route.note || '')}" placeholder="备注（可选）" />
      <label class="settings-check"><input type="checkbox" data-role="enabled" ${route.enabled !== false ? 'checked' : ''} /> 启用</label>
      <button class="icon-btn" type="button" data-action="remove-model-route" title="删除规则">×</button>
    </div>`;
}

function renderSettingsRoutingSection(s) {
  const routes = Array.isArray(s.modelRoutes) ? s.modelRoutes : [];
  const catalog = state.modelCatalog;
  const models = (catalog?.groups || []).flatMap((group) => (group.models || []).map((model) => ({ provider: group.id, ...model })));
  return `
    <div class="settings-section">
      <div class="settings-section-head">
        <h3>模型路由</h3>
        <p>按员工、部门、项目或优先级选择不同模型；命中顺序为 员工 → 项目 → 部门 → 优先级 → 默认。规则会写进下一轮会话，已存在的会话会即时切换。</p>
      </div>
      <datalist id="model-catalog-list">${models.map((model) => `<option value="${escapeHtml(model.id)}">${escapeHtml(model.provider)} · ${escapeHtml(model.name || model.id)}</option>`).join('')}</datalist>
      <datalist id="model-provider-list">${[...new Set(models.map((model) => model.provider))].map((provider) => `<option value="${escapeHtml(provider)}"></option>`).join('')}</datalist>
      <div class="model-route-table" id="model-routes">${routes.map((route, index) => renderModelRouteRow(route, index)).join('')}</div>
      ${!routes.length ? '<div class="empty small">还没有路由规则，所有调用使用上方的默认模型。</div>' : ''}
      <div class="settings-actions">
        <button class="btn ghost small" type="button" data-action="add-model-route">+ 添加规则</button>
        <button class="btn ghost small" type="button" data-action="refresh-model-catalog">刷新模型目录</button>
        <span class="settings-status">${catalog ? `已发现 ${models.length} 个可选模型` : '未读取模型目录，可点“刷新模型目录”'}</span>
      </div>
      <div class="modal-note">模型目录来自 dsh 控制面。若控制面未配置多个 Provider，路由规则仍会记录并在真实调用时尝试切换；失败会在员工会话里提示“模型路由失败”。</div>
    </div>`;
}

function collectModelRoutes() {
  return [...document.querySelectorAll('[data-route-row]')].map((row, index) => {
    const read = (role) => row.querySelector(`[data-role="${role}"]`);
    return {
      id: read('id')?.value || `mr-${Date.now()}-${index}`,
      scope: read('scope')?.value || 'employee',
      match: read('match')?.value || '',
      provider: read('provider')?.value.trim() || '',
      model: read('model')?.value.trim() || '',
      note: read('note')?.value.trim() || '',
      enabled: Boolean(read('enabled')?.checked),
    };
  });
}

async function loadModelCatalog() {
  try {
    const payload = await api('/api/models');
    state.modelCatalog = payload.catalog || null;
  } catch {
    state.modelCatalog = null;
  }
  renderSettingsPanel();
}

function renderSettingsPolicySection(policy) {
  const mode = ['auto-review', 'strict', 'balanced', 'autopilot'].includes(policy.mode) ? policy.mode : 'auto-review';
  return `
    <div class="settings-section">
      <h3>写操作审批策略</h3>
      <label>审批模式
        <select name="approvalMode">
          <option value="auto-review" ${mode === 'auto-review' ? 'selected' : ''}>Auto review（推荐）：每次工具调用由 AI 按 DSH 策略审查，低风险直接放行，中风险需明确授权，高风险拒绝并转人工</option>
          <option value="strict" ${mode === 'strict' ? 'selected' : ''}>严格：只有只读命令自动放行，其余人工</option>
          <option value="balanced" ${mode === 'balanced' ? 'selected' : ''}>平衡（旧）：规则判断，低/中风险自动放行，高风险人工</option>
          <option value="autopilot" ${mode === 'autopilot' ? 'selected' : ''}>默认允许所有权限（推荐）：所有员工、所有工具、所有操作自动放行，不再生成审批卡</option>
        </select>
      </label>
      <input type="hidden" name="l1AutoApprove" value="0" />
      <label class="settings-check"><input type="checkbox" name="l1AutoApprove" value="1" ${policy.l1AutoApprove !== false ? 'checked' : ''} /> L1 新建文件自动放行（旧模式生效）</label>
      <input type="hidden" name="autoReview" value="0" />
      <label class="settings-check"><input type="checkbox" name="autoReview" value="1" ${policy.autoReview !== false ? 'checked' : ''} /> 启用 Auto review（内置 @deepseek-ai/dsh-experimental-auto-review）</label>
      <div class="settings-hint">当前审批策略版本：<strong>v${Number(policy.version || 1)}</strong> · 历史 ${Array.isArray(policy.history) ? policy.history.length : 0} 条。每次修改审批模式或自动放行都会生成新版本，审批记录会写下当时的版本。</div>
      <div class="settings-hint">Auto review 的风险口径与 DSH 插件一致：<strong>low</strong> = 项目内常规读写/分析/格式化/测试/构建/非破坏性 Git，直接放行；<strong>medium</strong> = 删除既有对象、生产环境读写/部署、非敏感外发、权限与系统变更，只有当前任务明确授权才放行；<strong>high</strong> = 密钥/私有数据外泄等，永远拒绝。</div>
      <div class="settings-hint">当前默认策略是「允许所有权限」：所有员工、所有工具、所有操作自动放行，不会再因为写文件、执行命令、访问工作区外路径生成审批卡。需要收紧时再切换为严格或 Auto review。</div>
      <div class="settings-hint">批准时勾选“本会话内该文件不再询问”，30 分钟内同一会话、同一文件的同类写操作会自动放行。</div>
    </div>`;
}

function renderSettingsUsageSection(usage) {
  const today = usage.today || {};
  const last7 = usage.last7 || {};
  const byEmployee = usage.byEmployee || [];
  const recent = usage.recent || [];
  return `
    <div class="settings-section">
      <h3>Token 用量</h3>
      <div class="settings-metrics">
        <div class="settings-metric"><div class="settings-metric-label">今日总 tokens</div><div class="settings-metric-value">${formatNumber(today.totalTokens)}</div></div>
        <div class="settings-metric"><div class="settings-metric-label">今日输入 / 输出</div><div class="settings-metric-value">${formatNumber(today.inputTokens)} / ${formatNumber(today.outputTokens)}</div></div>
        <div class="settings-metric"><div class="settings-metric-label">近 7 日总 tokens</div><div class="settings-metric-value">${formatNumber(last7.totalTokens)}</div></div>
        <div class="settings-metric"><div class="settings-metric-label">今日估算成本</div><div class="settings-metric-value">${money(today.cost || 0)}</div></div>
      </div>
      ${
        byEmployee.length
          ? `<table class="settings-table"><thead><tr><th>员工</th><th>调用</th><th>总 tokens</th><th>成本</th></tr></thead><tbody>${byEmployee
              .slice(0, 6)
              .map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${row.calls}</td><td>${formatNumber(row.totalTokens)}</td><td>${money(row.cost)}</td></tr>`)
              .join('')}</tbody></table>`
          : ''
      }
      <div class="settings-hint" style="margin-top:10px">最近调用</div>
      <table class="settings-table"><thead><tr><th>时间</th><th>员工</th><th>来源</th><th>Tokens</th><th>成本</th></tr></thead><tbody>${renderUsageRows(recent.slice(0, 8))}</tbody></table>
    </div>`;
}

function renderSettingsRuntimeSection(dsh, s, policy) {
  const statusText = dsh.ok ? `运行中 · ${dsh.version || 'dsh'}` : '未连接（3081 控制面未启动）';
  return `
    <div class="settings-section">
      <h3>运行状态</h3>
      <div class="settings-hint">当前控制面：<strong>${escapeHtml(statusText)}</strong>。模型配置只在启动控制面时读取；保存后请用 <code>npm run dsh</code> 重启。</div>
      <div class="settings-hint">配置补丁：<code>${escapeHtml(s.patchPath || 'data/runtime/dsh-model.patch.yml')}</code></div>
    </div>
    <div class="settings-section">
      <h3>当前审批策略</h3>
      <div class="settings-hint">模式：<strong>${escapeHtml({ 'auto-review': 'Auto review（DSH 逐次 AI 审查）', strict: '严格', balanced: '平衡（旧）', autopilot: '全自动（旧）' }[policy.mode || 'auto-review'] || policy.mode)}</strong></div>
      <div class="settings-hint">L1 新建文件：<strong>${policy.l1AutoApprove !== false ? '自动放行' : '需要审批'}</strong>（旧模式生效）</div>
      <div class="settings-hint">Auto review 放行 low/medium；high 永远拒绝。审批卡只出现在 AI 拒绝、红线拦截或审查不可用时。</div>
    </div>`;
}

function renderSettingsChannelsSection(channels) {
  const email = channels.email || {};
  const wecom = channels.wecom || {};
  const webhook = channels.webhook || {};
  return `
    <div class="settings-section">
      <h3>外部渠道</h3>
      <div class="settings-hint">这里保存渠道接口配置，供后续 L4 外发审批使用；当前批准外发仍只写入本地 outbox，不会自动真实发送。点“测试连接”会实际发起一次 TCP 连接或 HTTP 请求。</div>

      <div class="channel-block">
        <div class="channel-head">
          <div>
            <div class="channel-title">邮件 SMTP</div>
            <div class="channel-sub">用于给客户、供应商发送邮件</div>
          </div>
          <input type="hidden" name="emailEnabled" value="0" />
          <label class="settings-check"><input type="checkbox" name="emailEnabled" value="1" ${email.enabled ? 'checked' : ''} /> 启用</label>
        </div>
        <div class="settings-grid">
          <label>SMTP 主机<input name="emailHost" maxlength="120" value="${escapeHtml(email.host || '')}" placeholder="smtp.example.com" /></label>
          <label>端口<input name="emailPort" type="number" min="1" max="65535" value="${escapeHtml(email.port ?? 465)}" /></label>
          <label>加密方式<select name="emailSecure"><option value="1" ${email.secure !== false ? 'selected' : ''}>SSL / TLS（465）</option><option value="0" ${email.secure === false ? 'selected' : ''}>STARTTLS（587）</option></select></label>
          <label>账号<input name="emailUser" maxlength="120" value="${escapeHtml(email.user || '')}" placeholder="bot@example.com" autocomplete="username" /></label>
          <label>密码 / 授权码<input name="emailPassword" type="password" maxlength="240" placeholder="${email.hasPassword ? `已保存 ${escapeHtml(email.passwordMasked)}，留空不修改` : '输入密码或授权码'}" autocomplete="new-password" /></label>
          <label>发件人<input name="emailFrom" maxlength="160" value="${escapeHtml(email.from || '')}" placeholder="一人公司 <bot@example.com>" /></label>
          <label class="full">默认收件人<input name="emailDefaultTo" maxlength="240" value="${escapeHtml(email.defaultTo || '')}" placeholder="可选，多个用逗号分隔" /></label>
        </div>
        <label class="settings-check"><input type="checkbox" name="clearEmailPassword" value="1" /> 清除已保存的密码</label>
        <div class="settings-actions">
          <button class="btn ghost small" type="button" data-action="test-channel" data-channel="email">测试连接</button>
          <span id="settings-channel-result-email" class="settings-status"></span>
        </div>
      </div>

      <div class="channel-block">
        <div class="channel-head">
          <div>
            <div class="channel-title">企业微信机器人</div>
            <div class="channel-sub">用于向群聊推送通知与汇报</div>
          </div>
          <input type="hidden" name="wecomEnabled" value="0" />
          <label class="settings-check"><input type="checkbox" name="wecomEnabled" value="1" ${wecom.enabled ? 'checked' : ''} /> 启用</label>
        </div>
        <div class="settings-grid">
          <label class="full">Webhook URL<input name="wecomWebhookUrl" maxlength="400" value="${escapeHtml(wecom.webhookUrl || '')}" placeholder="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=..." /></label>
        </div>
        <div class="settings-actions">
          <button class="btn ghost small" type="button" data-action="test-channel" data-channel="wecom">测试连接</button>
          <span id="settings-channel-result-wecom" class="settings-status"></span>
        </div>
      </div>

      <div class="channel-block">
        <div class="channel-head">
          <div>
            <div class="channel-title">通用 Webhook</div>
            <div class="channel-sub">用于对接自有系统、Zapier、n8n 等</div>
          </div>
          <input type="hidden" name="webhookEnabled" value="0" />
          <label class="settings-check"><input type="checkbox" name="webhookEnabled" value="1" ${webhook.enabled ? 'checked' : ''} /> 启用</label>
        </div>
        <div class="settings-grid">
          <label class="full">Webhook URL<input name="webhookUrl" maxlength="400" value="${escapeHtml(webhook.url || '')}" placeholder="https://example.com/hooks/one-company" /></label>
          <label class="full">签名密钥<input name="webhookSecret" type="password" maxlength="240" placeholder="${webhook.hasSecret ? `已保存 ${escapeHtml(webhook.secretMasked)}，留空不修改` : '可选，作为 Bearer Token 发送'}" autocomplete="new-password" /></label>
        </div>
        <label class="settings-check"><input type="checkbox" name="clearWebhookSecret" value="1" /> 清除已保存的签名密钥</label>
        <div class="settings-actions">
          <button class="btn ghost small" type="button" data-action="test-channel" data-channel="webhook">测试连接</button>
          <span id="settings-channel-result-webhook" class="settings-status"></span>
        </div>
      </div>
    </div>`;
}

function renderSettingsBackupSection() {
  const info = state.backupInfo || {};
  const latest = info.latest || null;
  return `
    <div class="settings-section">
      <h3>数据存放位置</h3>
      <div class="settings-hint">当前数据目录：<code>${escapeHtml(info.dataDir || '读取中…')}</code></div>
      <div class="settings-hint">安装版首次启动会询问数据位置，默认新建在 D 盘「一人公司工作区」；选择后所有数据、记忆、上传、审批记录都放在该目录。</div>
      <div class="head-actions">
        <button class="btn ghost small" type="button" data-action="open-data-dir">打开数据目录</button>
        <button class="btn ghost small" type="button" data-action="refresh-backup-info">刷新</button>
      </div>
      <h3 style="margin-top:22px">备份</h3>
      <div class="settings-hint">「立即快照」会在 <code>${escapeHtml(info.backupDir || '数据目录/backups')}</code> 生成一份包含 store、settings、memory、uploads、experts 的完整快照；「导出 JSON」会下载一份可迁移到另一台机器的数据包。</div>
      <div class="head-actions">
        <button class="btn primary small" type="button" data-action="backup-now">立即快照</button>
        <button class="btn ghost small" type="button" data-action="backup-export">导出 JSON</button>
        <button class="btn ghost small" type="button" data-action="backup-restore">从 JSON 恢复</button>
        <input type="file" id="backup-restore-file" accept="application/json,.json" hidden />
      </div>
      <div class="settings-hint">最近快照：${latest ? `<strong>${escapeHtml(latest.id || latest.createdAt)}</strong> · ${escapeHtml(formatDateTime(latest.createdAt))}${latest.path ? ` · <code>${escapeHtml(latest.path)}</code>` : ''}` : '还没有快照，建议先点「立即快照」。'}</div>
      <div class="backup-list">
        ${(info.backups || [])
          .slice(0, 8)
          .map(
            (item) => `
          <div class="backup-row">
            <span class="tag muted">${item.kind === 'auto' ? '自动' : '手动'}</span>
            <div class="backup-main">
              <div class="backup-name">${escapeHtml(item.id || item.createdAt)}</div>
              <div class="backup-meta">${escapeHtml(formatDateTime(item.createdAt))} · 员工 ${Number(item.counts?.employees || 0)} · 项目 ${Number(item.counts?.projects || 0)} · 记忆 ${Number(item.counts?.memories || 0)}</div>
            </div>
            <button class="btn ghost small" type="button" data-action="restore-snapshot" data-id="${escapeHtml(item.id || '')}">恢复</button>
          </div>`,
          )
          .join('') || '<div class="empty">还没有快照。</div>'}
      </div>
      <div class="settings-hint">恢复会覆盖当前 store/settings，执行前会自动再做一份快照。</div>
    </div>`;
}

/* ---------------- IM 员工接入 ---------------- */
function allImBots() {
  const channels = state.imState?.channels || [];
  return channels.flatMap((channel) => (channel.bots || []).map((bot) => ({
    ...bot,
    channel: channel.id,
    channelName: channel.name,
    channelColor: channel.color,
  })));
}

function imBindingFor(channel, botId) {
  return (state.imState?.bindings || []).find((item) => item.channel === channel && item.botId === botId) || null;
}

function imBotsForEmployee(employeeId) {
  return (state.imState?.bindings || [])
    .filter((item) => item.employeeId === employeeId)
    .map((item) => {
      const bot = allImBots().find((entry) => entry.channel === item.channel && entry.botId === item.botId);
      const channel = (state.imState?.channels || []).find((entry) => entry.id === item.channel);
      return { ...item, bot: bot || null, channelName: channel?.name || item.channel, channelColor: channel?.color || '#64748b' };
    });
}

async function loadImState(force = false) {
  if (state.imLoading) return;
  if (!force && state.imState) return;
  state.imLoading = true;
  try {
    state.imState = await api('/api/im/state');
  } catch (error) {
    state.imState = { channels: [], employees: [], bindings: [], error: error.message };
  } finally {
    state.imLoading = false;
    if (modalType === 'im') renderImModalBody();
    else if (modalType === 'settings' && state.settingsTab === 'im') renderSettingsPanel();
  }
}

function renderSettingsImSection() {
  if (!state.imState) {
    void loadImState();
    return `<div class="settings-section"><h3>IM 员工接入</h3><div class="settings-hint">正在读取 dsh-im 插件状态…</div></div>`;
  }
  const employees = state.imState.employees || [];
  const bots = allImBots();
  const unassigned = bots.filter((bot) => !imBindingFor(bot.channel, bot.botId));
  const channels = state.imState.channels || [];
  const online = bots.filter((bot) => bot.connected).length;
  return `
    <div class="settings-section im-settings">
      <div class="im-hero">
        <div>
          <h3>IM 员工接入</h3>
          <p>把微信、飞书、企业微信、钉钉、QQ 等机器人绑定到具体员工。客户在 IM 里发消息，就是这位员工在接待、干活、交付。</p>
        </div>
        <div class="head-actions">
          <button class="btn ghost small" type="button" data-action="im-refresh">刷新</button>
          ${state.imState.panelUrl ? `<a class="btn ghost small" href="${escapeHtml(state.imState.panelUrl)}" target="_blank" rel="noopener">打开完整 IM 面板</a>` : '<button class="btn ghost small" type="button" data-action="im-open-panel">打开完整 IM 面板</button>'}
        </div>
      </div>
      <div class="im-summary">
        <span><strong>${employees.length}</strong> 位员工</span>
        <span><strong>${bots.length}</strong> 个机器人</span>
        <span><strong>${online}</strong> 个在线</span>
        <span class="${state.imState.dshOk ? 'ok' : 'warn'}">${state.imState.dshOk ? 'dsh-im 已连接' : 'AI 运行时未就绪'}</span>
      </div>
      <div class="im-employee-grid">
        ${employees.map((employee) => {
          const bound = imBotsForEmployee(employee.id);
          return `<div class="im-employee-card" data-action="im-manage" data-id="${escapeHtml(employee.id)}" role="button" tabindex="0">
            <div class="im-emp-head">
              <span class="im-avatar" style="--im-color:${escapeHtml(employee.color || '#d97706')}">${escapeHtml(String(employee.name || '?').slice(0, 1))}</span>
              <div class="im-emp-title"><strong>${escapeHtml(employee.name)}</strong><span>${escapeHtml(employee.role || '')}</span></div>
              <span class="tag ${bound.length ? 'ok' : 'muted'}">${bound.length ? `${bound.length} 个机器人` : '未接入'}</span>
            </div>
            <div class="im-emp-model">${escapeHtml(employee.model?.label || '未配置模型')}</div>
            <div class="im-emp-bots">
              ${bound.length
                ? bound.map((item) => `<span class="im-bot-chip" style="--im-color:${escapeHtml(item.channelColor)}"><i></i>${escapeHtml(item.channelName)}${item.bot ? ` · ${item.bot.connected ? '在线' : '离线'}` : ''}</span>`).join('')
                : '<span class="im-empty-line">点击配置微信 / 飞书 / 企微 / 钉钉 / QQ</span>'}
            </div>
          </div>`;
        }).join('')}
      </div>
      ${unassigned.length ? `<div class="im-unassigned">
        <h4>已创建、未分配机器人</h4>
        ${unassigned.map((bot) => `<div class="im-unassigned-row">
          <span class="im-dot ${bot.connected ? 'on' : ''}"></span>
          <div class="im-unassigned-main"><strong>${escapeHtml(bot.alias || bot.name || bot.botId)}</strong><span>${escapeHtml(bot.channelName)} · ${bot.connected ? '在线' : '离线'}</span></div>
          <select class="im-assign-select">${employees.map((employee) => `<option value="${escapeHtml(employee.id)}">${escapeHtml(employee.name)}</option>`).join('')}</select>
          <button class="btn ghost small" type="button" data-action="im-assign-bot" data-channel="${escapeHtml(bot.channel)}" data-bot="${escapeHtml(bot.botId)}">分配</button>
        </div>`).join('')}
      </div>` : ''}
      <div class="settings-hint">机器人由 dsh-im 插件托管。绑定后会自动把员工的工作区、模型和 Agent 预设写入机器人；员工在 IM 里的会话与软件内聊天分开记录。邮箱、Matrix、企业微信自建应用等高级渠道，可点右上角「打开完整 IM 面板」配置。</div>
      ${channels.some((channel) => !channel.ok) ? `<div class="settings-hint">部分渠道未就绪：${channels.filter((channel) => !channel.ok).map((channel) => `${escapeHtml(channel.name)}（${escapeHtml(channel.error || '未连接')}）`).join('；')}</div>` : ''}
    </div>`;
}

function imProvisionInfo(value) {
  const root = value && typeof value === 'object' ? value : {};
  const nested = root.provisioning && typeof root.provisioning === 'object' ? root.provisioning : root;
  const pick = (key) => nested[key] ?? root[key] ?? '';
  const error = nested.error || root.error;
  return {
    attemptId: String(pick('attemptId') || ''),
    status: String(pick('status') || ''),
    qr: String(pick('qrCodeDataUrl') || ''),
    url: String(pick('verificationUrl') || ''),
    expiresAt: Number(pick('expiresAt')) || 0,
    pollIntervalMs: Number(pick('pollIntervalMs')) || 2000,
    botId: String(pick('botId') || ''),
    verificationRequired: Boolean(pick('verificationRequired')),
    error: error && typeof error === 'object' ? String(error.message || '') : String(error || ''),
  };
}

function imQrDataUrl(text) {
  try {
    if (typeof qrcode !== 'function') return '';
    const qr = qrcode(0, 'M');
    qr.addData(String(text));
    qr.make();
    return qr.createDataURL(6, 10);
  } catch {
    return '';
  }
}

function clearImTimer() {
  if (state.imTimer) {
    clearTimeout(state.imTimer);
    state.imTimer = null;
  }
}

function renderImModalBody() {
  const fields = document.getElementById('modal-fields');
  if (!fields || modalType !== 'im') return;
  const employeeId = state.imEmployeeId;
  const employee = (state.imState?.employees || []).find((item) => item.id === employeeId)
    || (state.data.employees || []).find((item) => item.id === employeeId);
  if (!employee) {
    fields.innerHTML = '<div class="im-error">员工不存在</div>';
    return;
  }
  if (!state.imState) {
    fields.innerHTML = '<div class="im-loading"><span class="typing-dot"></span>正在读取 IM 插件状态…</div>';
    void loadImState(true);
    return;
  }
  const bound = imBotsForEmployee(employee.id);
  const bots = allImBots();
  const unassigned = bots.filter((bot) => !imBindingFor(bot.channel, bot.botId));
  const draft = state.imDraft;
  const provision = state.imProvision;
  fields.innerHTML = `
    <div class="im-modal">
      <div class="im-modal-employee">
        <span class="im-avatar" style="--im-color:${escapeHtml(employee.color || '#d97706')}">${escapeHtml(String(employee.name || '?').slice(0, 1))}</span>
        <div><strong>${escapeHtml(employee.name)}</strong><span>${escapeHtml(employee.role || '')} · ${escapeHtml(employee.model?.label || '未配置模型')}</span></div>
        <span class="tag ${employee.status === '空闲' ? 'ok' : 'muted'}">${escapeHtml(employee.status || '')}</span>
      </div>

      <div class="im-section">
        <h4>已绑定机器人</h4>
        ${bound.length ? `<div class="im-bot-list">${bound.map((item) => `<div class="im-bot-row">
          <span class="im-dot ${item.bot?.connected ? 'on' : ''}"></span>
          <div class="im-bot-main"><strong>${escapeHtml(item.bot?.alias || item.alias || item.botId)}</strong><span>${escapeHtml(item.channelName)} · ${item.bot?.connected ? '在线' : '离线'} · ${escapeHtml(item.botId)}</span></div>
          <div class="im-bot-actions">
            <button class="btn ghost small" type="button" data-action="im-bot-sync" data-channel="${escapeHtml(item.channel)}" data-bot="${escapeHtml(item.botId)}">同步身份</button>
            <button class="btn ghost small" type="button" data-action="im-bot-reconnect" data-channel="${escapeHtml(item.channel)}" data-bot="${escapeHtml(item.botId)}">重连</button>
            <button class="btn ghost small" type="button" data-action="im-bot-unbind" data-channel="${escapeHtml(item.channel)}" data-bot="${escapeHtml(item.botId)}">解绑</button>
            <button class="btn ghost small danger" type="button" data-action="im-bot-delete" data-channel="${escapeHtml(item.channel)}" data-bot="${escapeHtml(item.botId)}">删除</button>
          </div>
        </div>`).join('')}</div>` : '<div class="im-empty-line">还没有机器人，下面选一个渠道开始配置。</div>'}
      </div>

      ${provision ? renderImProvisionPanel(provision) : ''}

      <div class="im-section">
        <h4>新增机器人</h4>
        <div class="im-channel-grid">
          ${(state.imState.channels || []).map((channel) => `<button class="im-channel-card ${draft?.channel === channel.id ? 'active' : ''}" type="button" data-action="im-channel" data-channel="${escapeHtml(channel.id)}" ${channel.ok ? '' : 'disabled'} style="--im-color:${escapeHtml(channel.color)}">
            <span class="im-channel-logo">${escapeHtml(channel.name.slice(0, 1))}</span>
            <span class="im-channel-name">${escapeHtml(channel.name)}</span>
            <span class="im-channel-desc">${escapeHtml(channel.ok ? channel.desc : channel.error || '未就绪')}</span>
            <span class="im-channel-kind">${channel.kind === 'qr' ? '扫码' : 'Token'}</span>
          </button>`).join('')}
        </div>
      </div>

      ${draft?.mode === 'token' ? `<div class="im-section im-token-form">
        <h4>${escapeHtml(draft.channelName)} Token</h4>
        <div class="im-token-fields">
          ${(draft.fields || []).map((field) => `<label>${escapeHtml(field.label)}<input id="im-cred-${escapeHtml(field.key)}" type="${field.secret ? 'password' : 'text'}" placeholder="${escapeHtml(field.placeholder || '')}" autocomplete="off" /></label>`).join('')}
        </div>
        <div class="head-actions"><button class="btn primary small" type="button" data-action="im-token-submit">连接</button><button class="btn ghost small" type="button" data-action="im-cancel-draft">取消</button></div>
      </div>` : ''}

      ${unassigned.length ? `<div class="im-section">
        <h4>绑定已有机器人</h4>
        <div class="im-existing-row">
          <select id="im-existing-bot">${unassigned.map((bot) => `<option value="${escapeHtml(bot.channel + '::' + bot.botId)}">${escapeHtml(bot.channelName)} · ${escapeHtml(bot.alias || bot.name || bot.botId)}</option>`).join('')}</select>
          <button class="btn ghost small" type="button" data-action="im-bind-existing">绑定给 ${escapeHtml(employee.name)}</button>
        </div>
      </div>` : ''}
    </div>`;
}

function renderImProvisionPanel(provision) {
  const channelName = (state.imState?.channels || []).find((item) => item.id === provision.channel)?.name || provision.channel;
  const qr = provision.qr || (provision.url ? imQrDataUrl(provision.url) : '');
  const status = provision.status || 'starting';
  if (status === 'starting') {
    return `<div class="im-provision"><div class="im-loading"><span class="typing-dot"></span>正在生成${escapeHtml(channelName)}二维码…</div></div>`;
  }
  if (provision.error) {
    return `<div class="im-provision"><div class="im-error">${escapeHtml(provision.error)}</div><div class="head-actions"><button class="btn ghost small" type="button" data-action="im-cancel-draft">关闭</button></div></div>`;
  }
  if (provision.status === 'bound') {
    return `<div class="im-provision"><div class="im-success">已绑定给 ${escapeHtml(provision.employeeName || '员工')}，可以去 IM 里发消息测试了。</div><div class="head-actions"><button class="btn ghost small" type="button" data-action="im-cancel-draft">完成</button></div></div>`;
  }
  return `<div class="im-provision">
    <div class="im-provision-head"><strong>${escapeHtml(channelName)}扫码绑定</strong><span class="im-status ${status === 'scanned' ? 'ok' : ''}">${escapeHtml(imStatusLabel(status))}</span></div>
    ${qr ? `<div class="im-qr-frame"><img src="${qr}" alt="${escapeHtml(channelName)}绑定二维码" /></div>` : ''}
    <div class="im-provision-hint">${qr ? '用手机扫码并在手机上确认。' : '二维码未就绪，请使用下面的备用链接。'}${provision.expiresAt ? ` 有效期至 ${escapeHtml(formatDateTime(new Date(provision.expiresAt).toISOString()))}` : ''}</div>
    ${provision.url ? `<div class="im-provision-link"><a href="${escapeHtml(provision.url)}" target="_blank" rel="noopener">在浏览器打开授权链接</a></div>` : ''}
    ${provision.verificationRequired ? `<div class="im-verify-row"><input id="im-verify-code" inputmode="numeric" maxlength="8" placeholder="输入手机上显示的配对数字" /><button class="btn primary small" type="button" data-action="im-verify-submit">提交配对码</button></div>` : ''}
    <div class="head-actions"><button class="btn ghost small" type="button" data-action="im-provision-cancel">取消扫码</button></div>
  </div>`;
}

function imStatusLabel(status) {
  return {
    pending: '等待扫码',
    scanned: '已扫码，请在手机上确认',
    needs_verification: '需要配对码',
    qr_ready: '等待扫码',
    polling: '等待确认',
    succeeded: '已连接',
    connected: '已连接',
    confirmed: '已连接',
    expired: '二维码已过期',
    cancelled: '已取消',
    failed: '绑定失败',
    error: '绑定失败',
  }[status] || status || '处理中';
}

async function startImProvision(channelId) {
  clearImTimer();
  const channel = (state.imState?.channels || []).find((item) => item.id === channelId);
  if (!channel) return;
  if (channel.kind === 'token') {
    state.imProvision = null;
    state.imDraft = { channel: channelId, channelName: channel.name, mode: 'token', fields: channel.fields || [] };
    renderImModalBody();
    return;
  }
  const employeeId = state.imEmployeeId;
  const beforeBotIds = new Set((channel.bots || []).map((bot) => bot.botId));
  state.imDraft = { channel: channelId, channelName: channel.name, mode: 'qr', beforeBotIds: [...beforeBotIds] };
  state.imProvision = { channel: channelId, status: 'starting', qr: '', url: '', attemptId: '', error: '' };
  renderImModalBody();
  try {
    const payload = await api('/api/im/provision', { method: 'POST', body: JSON.stringify({ channel: channelId, action: 'begin' }) });
    const info = imProvisionInfo(payload.value);
    if (payload.value?.agentPresetCatalog) state.imAgentPresetCatalog = payload.value.agentPresetCatalog;
    state.imProvision = { channel: channelId, ...info };
    if (!state.imProvision.attemptId) throw new Error('插件没有返回扫码会话');
    renderImModalBody();
    scheduleImPoll();
  } catch (error) {
    state.imProvision = { channel: channelId, status: 'failed', error: error.message };
    renderImModalBody();
  }
  void employeeId;
}

function scheduleImPoll() {
  clearImTimer();
  const provision = state.imProvision;
  if (!provision?.attemptId) return;
  const delay = Math.max(800, Math.min(5000, Number(provision.pollIntervalMs) || 2000));
  state.imTimer = setTimeout(() => { void pollImProvision(); }, delay);
}

async function pollImProvision() {
  const current = state.imProvision;
  if (!current?.attemptId) return;
  try {
    const payload = await api('/api/im/provision', { method: 'POST', body: JSON.stringify({ channel: current.channel, action: 'poll', attemptId: current.attemptId }) });
    const info = imProvisionInfo(payload.value);
    state.imProvision = { ...current, ...info };
    renderImModalBody();
    if (info.verificationRequired) return;
    const done = info.botId || ['succeeded', 'connected', 'confirmed', 'ready', 'done'].includes(info.status);
    if (done) {
      await finishImProvision(info.botId);
      return;
    }
    if (['expired', 'cancelled', 'failed', 'error'].includes(info.status)) return;
    scheduleImPoll();
  } catch (error) {
    state.imProvision = { ...current, error: error.message, status: 'failed' };
    renderImModalBody();
  }
}

async function finishImProvision(botId = '') {
  const draft = state.imDraft;
  const employeeId = state.imEmployeeId;
  const employee = (state.imState?.employees || []).find((item) => item.id === employeeId);
  if (!draft) return;
  let targetBot = botId;
  if (!targetBot) {
    await loadImState(true);
    const channel = (state.imState?.channels || []).find((item) => item.id === draft.channel);
    const before = new Set(draft.beforeBotIds || []);
    targetBot = (channel?.bots || []).map((bot) => bot.botId).find((id) => !before.has(id)) || '';
  }
  if (!targetBot) {
    state.imProvision = { ...(state.imProvision || {}), channel: draft.channel, status: 'failed', error: '扫码已完成，但没有找到新机器人，请刷新后重试' };
    renderImModalBody();
    return;
  }
  try {
    await api('/api/im/bind', { method: 'POST', body: JSON.stringify({ employeeId, channel: draft.channel, botId: targetBot }) });
    await loadImState(true);
    state.imProvision = { channel: draft.channel, status: 'bound', employeeName: employee?.name || '' };
    state.imDraft = null;
    renderImModalBody();
    showToast(`已把${draft.channelName}机器人绑定给 ${employee?.name || '员工'}`, 'ok');
  } catch (error) {
    state.imProvision = { ...(state.imProvision || {}), channel: draft.channel, status: 'failed', error: error.message };
    renderImModalBody();
  }
}

async function connectImToken() {
  const draft = state.imDraft;
  if (!draft) return;
  const credentials = {};
  for (const field of draft.fields || []) {
    const input = document.getElementById(`im-cred-${field.key}`);
    credentials[field.key] = input?.value.trim() || '';
    if (!credentials[field.key]) {
      showToast(`请填写${field.label}`, 'warn');
      return;
    }
  }
  state.imProvision = { channel: draft.channel, status: 'starting', qr: '', url: '', attemptId: '', error: '' };
  renderImModalBody();
  try {
    const employeeId = state.imEmployeeId;
    const employee = (state.imState?.employees || []).find((item) => item.id === employeeId);
    const channel = (state.imState?.channels || []).find((item) => item.id === draft.channel);
    const beforeBotIds = new Set((channel?.bots || []).map((bot) => bot.botId));
    const payload = await api('/api/im/credentials', { method: 'POST', body: JSON.stringify({ channel: draft.channel, credentials }) });
    await loadImState(true);
    let targetBot = payload.bot?.botId || '';
    if (!targetBot) {
      const refreshed = (state.imState?.channels || []).find((item) => item.id === draft.channel);
      targetBot = (refreshed?.bots || []).map((bot) => bot.botId).find((id) => !beforeBotIds.has(id)) || '';
    }
    if (!targetBot) throw new Error('Token 已提交，但机器人尚未就绪，请刷新后重试');
    state.imDraft = { ...draft, beforeBotIds: [...beforeBotIds] };
    await finishImProvision(targetBot);
    void employee;
  } catch (error) {
    state.imProvision = { channel: draft.channel, status: 'failed', error: error.message };
    renderImModalBody();
  }
}

async function cancelImProvision() {
  const provision = state.imProvision;
  clearImTimer();
  if (provision?.attemptId) {
    await api('/api/im/provision', { method: 'POST', body: JSON.stringify({ channel: provision.channel, action: 'cancel', attemptId: provision.attemptId }) }).catch(() => {});
  }
  state.imProvision = null;
  state.imDraft = null;
  renderImModalBody();
}

function openImModal(employeeId) {
  state.imEmployeeId = employeeId;
  state.imProvision = null;
  state.imDraft = null;
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const fields = document.getElementById('modal-fields');
  const primary = document.getElementById('modal-primary');
  if (!modal || !title || !fields) return;
  modalType = 'im';
  modalTargetId = employeeId;
  modal.hidden = false;
  modal.querySelector('.modal-card')?.classList.remove('settings-card');
  modal.querySelector('.modal-card')?.classList.add('im-card');
  if (primary) primary.style.display = 'none';
  const employee = (state.imState?.employees || []).find((item) => item.id === employeeId);
  title.textContent = `IM 接入${employee ? ` · ${employee.name}` : ''}`;
  renderImModalBody();
  if (!state.imState) void loadImState(true);
}

function renderSettingsContextSection() {
  const employees = (state.data.employees || []).filter((item) => !item.archived);
  const projects = state.data.projects || [];
  const employeeId = state.contextEmployeeId || employees[0]?.id || '';
  const projectId = state.contextProjectId || projects[0]?.id || '';
  const data = state.contextBreakdown;
  return `
    <div class="settings-section">
      <h3>上下文体检</h3>
      <div class="settings-hint">测量一名员工在指定项目下，每轮提示词各块的字符数。记忆索引、召回、技能、公司数据哪块最贵，一眼能看见。</div>
      <div class="head-actions">
        <select class="gateway-select" id="context-employee">
          ${employees.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === employeeId ? 'selected' : ''}>${escapeHtml(item.name)} · ${escapeHtml(item.role || '')}</option>`).join('')}
        </select>
        <select class="gateway-select" id="context-project">
          <option value="">公司视角</option>
          ${projects.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === projectId ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}
        </select>
        <button class="btn primary small" type="button" data-action="context-breakdown">测量</button>
      </div>
      ${
        data
          ? `<div class="context-breakdown">
              <div class="context-total">总计 <strong>${Number(data.total || 0).toLocaleString()}</strong> 字</div>
              ${(data.sections || [])
                .map((item) => {
                  const percent = data.total ? Math.max(1, Math.round((item.chars / data.total) * 100)) : 0;
                  return `
                    <div class="context-row">
                      <span class="context-label">${escapeHtml(item.label)}</span>
                      <div class="context-bar"><span style="width:${percent}%"></span></div>
                      <span class="context-value">${Number(item.chars || 0).toLocaleString()}</span>
                    </div>`;
                })
                .join('')}
            </div>`
          : '<div class="empty">还没有测量。选员工和项目后点「测量」。</div>'
      }
    </div>`;
}

function renderSettingsLayout() {
  const payload = state.settings || {};
  const s = payload.settings || {};
  const usage = payload.usage || {};
  const dsh = payload.dsh || {};
  const policy = payload.approvalPolicy || {};
  const tab = state.settingsTab || 'model';
  const tabs = [
    { id: 'model', label: '模型设置', hint: '默认模型 / 提供商 / 密钥' },
    { id: 'routing', label: '模型路由', hint: '岗位 / 项目 / 优先级' },
    { id: 'channels', label: '外部渠道', hint: '邮件 / 企微 / Webhook' },
    { id: 'im', label: 'IM 接入', hint: '微信 / 飞书 / 企微 / QQ 机器人' },
    { id: 'policy', label: '审批策略', hint: 'L0-L4 与同类授权' },
    { id: 'backup', label: '数据备份', hint: '位置 / 快照 / 导出 / 恢复' },
    { id: 'context', label: '上下文体检', hint: '每轮提示词构成与字数' },
    { id: 'usage', label: 'Token 用量', hint: '调用与成本' },
    { id: 'runtime', label: '运行状态', hint: '控制面与补丁' },
  ];
  const content =
    tab === 'policy'
      ? renderSettingsPolicySection(policy)
      : tab === 'backup'
        ? renderSettingsBackupSection()
        : tab === 'context'
          ? renderSettingsContextSection()
        : tab === 'usage'
        ? renderSettingsUsageSection(usage)
        : tab === 'runtime'
          ? renderSettingsRuntimeSection(dsh, s, policy)
          : tab === 'channels'
            ? renderSettingsChannelsSection(payload.settings?.channels || {})
            : tab === 'im'
              ? renderSettingsImSection()
              : tab === 'routing'
                ? renderSettingsRoutingSection(s)
                : renderSettingsModelSection(s);
  return `
    <div class="settings-layout">
      <aside class="settings-nav">
        ${tabs
          .map(
            (item) => `<button type="button" class="settings-nav-item ${tab === item.id ? 'active' : ''}" data-action="settings-tab" data-tab="${item.id}">
              <span class="settings-nav-label">${item.label}</span>
              <span class="settings-nav-hint">${item.hint}</span>
            </button>`,
          )
          .join('')}
      </aside>
      <div class="settings-content">${content}</div>
    </div>`;
}

function renderSettingsFields() {
  return renderSettingsLayout();
}

function renderSettingsPanel() {
  const fields = document.getElementById('modal-fields');
  if (!fields) return;
  fields.innerHTML = renderSettingsLayout();
  const primary = document.getElementById('modal-primary');
  if (primary) {
    const tab = state.settingsTab || 'model';
    primary.style.display = ['policy', 'channels', 'routing'].includes(tab) ? '' : 'none';
    primary.textContent = tab === 'channels' ? '保存渠道设置' : tab === 'routing' ? '保存路由规则' : '保存设置';
  }
}

const ONBOARDING_TEMPLATES = [
  { id: 'deepseek', label: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', models: 'deepseek-chat\ndeepseek-reasoner' },
  { id: 'qwen', label: '通义千问', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', models: 'qwen-plus\nqwen-max' },
  { id: 'moonshot', label: 'Moonshot', baseUrl: 'https://api.moonshot.cn/v1', models: 'moonshot-v1-8k\nmoonshot-v1-32k' },
  { id: 'openai', label: 'OpenAI', baseUrl: 'https://api.openai.com/v1', models: 'gpt-4o-mini\ngpt-4o' },
  { id: 'ollama', label: '本地 Ollama', baseUrl: 'http://127.0.0.1:11434/v1', models: 'qwen2.5:7b' },
];

function onboardingDraftFromExisting() {
  const settings = state.settings?.settings || {};
  const provider = (settings.providers || [])[0] || {};
  return {
    name: provider.name || '',
    baseUrl: provider.baseUrl || '',
    apiKey: '',
    modelsText: (provider.models || []).map((model) => model.id).join('\n'),
  };
}

function readOnboardingDraft() {
  const draft = state.onboarding?.draft || onboardingDraftFromExisting();
  const read = (domId) => document.getElementById(domId)?.value;
  const name = read('ob-name');
  const baseUrl = read('ob-base-url');
  const apiKey = read('ob-api-key');
  const models = read('ob-models');
  if (name !== undefined) draft.name = name;
  if (baseUrl !== undefined) draft.baseUrl = baseUrl;
  if (apiKey !== undefined && apiKey) draft.apiKey = apiKey;
  if (models !== undefined) draft.modelsText = models;
  return draft;
}

function renderOnboarding() {
  const root = document.getElementById('onboarding-root');
  if (!root) return;
  const ob = state.onboarding;
  if (!ob || !ob.open) {
    root.hidden = true;
    root.innerHTML = '';
    return;
  }
  root.hidden = false;
  const draft = ob.draft || onboardingDraftFromExisting();
  const test = ob.test;
  const step = ob.step || 1;
  const stepDots = [1, 2, 3]
    .map((item) => `<span class="ob-dot ${step === item ? 'active' : ''} ${step > item ? 'done' : ''}"></span>`)
    .join('');

  let body = '';
  if (step === 1) {
    body = `
      <div class="ob-hero">
        <span class="ob-logo">一</span>
        <h1>先配一个模型，员工才能开始工作</h1>
        <p>一人公司里的每位员工都靠大模型驱动。安装后只需要配一次：填 API 端点、密钥、模型 ID，之后所有对话、任务、会议都能用。</p>
      </div>
      <ul class="ob-points">
        <li><strong>支持任意 OpenAI 兼容 API</strong><span>DeepSeek、通义、Moonshot、自建网关、本地 Ollama 都行</span></li>
        <li><strong>密钥只留在本机</strong><span>写入 data/settings.json，不会上传到任何服务器</span></li>
        <li><strong>随时可以改</strong><span>设置 → 模型设置里可以添加多个模型服务并切换默认</span></li>
      </ul>
      <div class="ob-actions">
        <button class="btn primary" type="button" data-action="ob-next">开始配置</button>
        <button class="btn ghost" type="button" data-action="ob-skip">稍后再说</button>
      </div>`;
  } else if (step === 2) {
    body = `
      <div class="ob-head">
        <span class="ob-logo small">配</span>
        <div>
          <h1>配置模型服务</h1>
          <p>不确定填什么？点下面任意一个预设，会自动填好端点和常用模型。</p>
        </div>
      </div>
      <div class="ob-templates">
        ${ONBOARDING_TEMPLATES.map(
          (item) => `<button type="button" class="ob-template" data-action="ob-template" data-template="${item.id}">${item.label}</button>`,
        ).join('')}
      </div>
      <div class="ob-form">
        <label>名称<input id="ob-name" maxlength="60" value="${escapeHtml(draft.name)}" placeholder="例如 DeepSeek" /></label>
        <label>API 端点<input id="ob-base-url" maxlength="300" value="${escapeHtml(draft.baseUrl)}" placeholder="https://api.deepseek.com/v1" /></label>
        <label>API 密钥<input id="ob-api-key" type="password" maxlength="400" placeholder="粘贴 API Key（本地 Ollama 可留空）" autocomplete="new-password" /></label>
        <label>模型 ID<textarea id="ob-models" rows="3" placeholder="一行一个，例如 deepseek-chat">${escapeHtml(draft.modelsText)}</textarea></label>
      </div>
      ${
        test
          ? `<div class="provider-test-result ${test.ok ? 'ok' : 'fail'}">${
              test.ok
                ? `连接成功 · ${test.count || 0} 个模型 · ${test.latencyMs || 0}ms`
                : `连接失败：${escapeHtml(test.error || '未知错误')}`
            }</div>`
          : ''
      }
      <div class="ob-actions">
        <button class="btn ghost" type="button" data-action="ob-back">上一步</button>
        <button class="btn ghost" type="button" data-action="ob-test">测试连接</button>
        <button class="btn primary" type="button" data-action="ob-save">保存并继续</button>
      </div>
      <div class="ob-hint">提示：如果端点需要代理或内网访问，请先在系统里配好网络。</div>`;
  } else {
    const settings = state.settings?.settings || {};
    const provider = (settings.providers || []).find((item) => item.id === settings.provider);
    body = `
      <div class="ob-hero success">
        <span class="ob-logo">✓</span>
        <h1>配置完成，可以开工了</h1>
        <p>默认模型已经生效。现在可以招聘员工、新建项目，或者先跟秘书聊两句试试。</p>
      </div>
      <div class="ob-summary">
        <div><span>模型服务</span><strong>${escapeHtml(provider?.name || draft.name || '已配置')}</strong></div>
        <div><span>默认模型</span><strong>${escapeHtml(settings.model || draft.modelsText.split('\n')[0] || '—')}</strong></div>
        <div><span>API 端点</span><strong class="mono">${escapeHtml(provider?.baseUrl || draft.baseUrl || '—')}</strong></div>
      </div>
      <div class="ob-actions">
        <button class="btn primary" type="button" data-action="ob-finish">进入工作台</button>
      </div>`;
  }

  root.innerHTML = `
    <div class="ob-backdrop">
      <div class="ob-card">
        <div class="ob-progress">${stepDots}</div>
        ${body}
      </div>
    </div>`;
}

function startOnboarding(options = {}) {
  const settings = state.settings?.settings || {};
  if (!options.force && settings.onboardingCompleted) return;
  state.onboarding = {
    open: true,
    step: 1,
    draft: onboardingDraftFromExisting(),
    test: null,
  };
  renderOnboarding();
}

function closeOnboarding(remember = true) {
  if (state.onboarding) state.onboarding.open = false;
  if (remember) {
    try {
      localStorage.setItem('one-company-onboarding-later', String(Date.now()));
    } catch {
      /* ignore */
    }
  }
  renderOnboarding();
}

async function onboardingTest() {
  const draft = readOnboardingDraft();
  state.onboarding.draft = draft;
  state.onboarding.test = null;
  if (!draft.baseUrl.trim()) {
    showToast('先填 API 端点');
    return;
  }
  const result = await apiSoft('/api/providers', {
    method: 'POST',
    body: JSON.stringify({ action: 'test', baseUrl: draft.baseUrl, apiKey: draft.apiKey }),
  });
  state.onboarding.test = result;
  if (result.ok && Array.isArray(result.models) && result.models.length) {
    draft.modelsText = result.models.map((item) => item.id).join('\n');
  }
  renderOnboarding();
}

async function onboardingSave() {
  const draft = readOnboardingDraft();
  state.onboarding.draft = draft;
  const models = providerModelIds(draft.modelsText);
  if (!draft.baseUrl.trim()) {
    showToast('API 端点必填');
    return;
  }
  if (!models.length) {
    showToast('至少填一个模型 ID，或先点「测试连接」');
    return;
  }
  const result = await apiSoft('/api/providers', {
    method: 'POST',
    body: JSON.stringify({
      action: 'save',
      name: draft.name || '模型服务',
      baseUrl: draft.baseUrl,
      apiKey: draft.apiKey,
      models,
      makeDefault: '1',
      enabled: true,
    }),
  });
  if (!result.ok) {
    showToast(`保存失败：${result.error || '未知错误'}`);
    return;
  }
  const settingsPayload = await apiSoft('/api/settings');
  if (settingsPayload.ok) state.settings = settingsPayload;
  const catalogPayload = await apiSoft('/api/models');
  state.modelCatalog = catalogPayload.catalog || null;
  state.onboarding.step = 3;
  renderOnboarding();
}

async function onboardingFinish() {
  try {
    localStorage.removeItem('one-company-onboarding-later');
  } catch {
    /* ignore */
  }
  await apiSoft('/api/onboarding', { method: 'POST', body: JSON.stringify({ completed: true }) });
  const settingsPayload = await apiSoft('/api/settings');
  if (settingsPayload.ok) state.settings = settingsPayload;
  state.onboarding.open = false;
  renderOnboarding();
  render();
  showToast('模型已配置，可以开始工作了');
}

function updateModelWarning() {
  const el = document.getElementById('model-warning');
  if (!el) return;
  const settings = state.settings?.settings;
  const configured = settings ? settings.configured : true;
  if (configured) {
    el.hidden = true;
    el.innerHTML = '';
    return;
  }
  el.hidden = false;
  el.innerHTML = `<span class="model-warning-icon">!</span>
    <span><strong>还没有配置模型</strong>，员工暂时无法对话。</span>
    <button class="btn primary small" type="button" data-action="restart-onboarding">立即配置</button>`;
}

async function apiSoft(path, options = {}) {
  const response = await fetch(path, {
    cache: 'no-store',
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
  });
  return response.json().catch(() => ({ ok: false, error: `HTTP ${response.status}` }));
}

async function reloadSettingsPanel(message) {
  const [payload, catalogPayload] = await Promise.all([
    api('/api/settings'),
    apiSoft('/api/models'),
  ]);
  state.settings = payload;
  state.modelCatalog = catalogPayload.catalog || null;
  state.providerDraft = null;
  state.providerTest = null;
  state.modelPickerOpen = false;
  renderSettingsPanel();
  if (message) showToast(message);
}

async function testProviderDraft() {
  const draft = readProviderDraftFromDom();
  state.providerDraft = draft;
  state.providerTest = null;
  if (!draft.baseUrl.trim()) {
    showToast('先填 API 端点');
    return;
  }
  const result = await apiSoft('/api/providers', {
    method: 'POST',
    body: JSON.stringify({ action: 'test', id: draft.id, baseUrl: draft.baseUrl, apiKey: draft.apiKey }),
  });
  state.providerTest = result;
  if (result.ok && Array.isArray(result.models) && result.models.length) {
    draft.models = result.models.map((model) => ({
      id: model.id,
      name: model.name || model.id,
      vision: model.vision === true,
      reasoning: model.reasoning === true,
      contextWindow: Number(model.contextWindow) || 128000,
      maxOutputTokens: Number(model.maxOutputTokens) || 8192,
    }));
    draft.modelsText = draft.models.map((model) => model.id).join('\n');
  }
  renderSettingsPanel();
  showToast(result.ok ? `连接成功，扫描到 ${result.count || 0} 个模型` : `连接失败：${result.error || '未知错误'}`);
}

async function saveProviderDraft() {
  const draft = readProviderDraftFromDom();
  state.providerDraft = draft;
  const models = (Array.isArray(draft.models) ? draft.models : []).filter((model) => model.id);
  if (!draft.baseUrl.trim()) {
    showToast('API 端点必填');
    return;
  }
  if (!models.length) {
    showToast('至少添加一个模型，或先点「扫描模型」');
    return;
  }
  const statusEl = document.getElementById('provider-save-status');
  if (statusEl) statusEl.textContent = '保存中…';
  const result = await apiSoft('/api/providers', {
    method: 'POST',
    body: JSON.stringify({
      action: 'save',
      id: draft.id,
      name: draft.name || '模型服务',
      baseUrl: draft.baseUrl,
      apiKey: draft.apiKey,
      models,
      makeDefault: draft.isNew && !(state.settings?.settings?.providers || []).length ? '1' : '0',
      enabled: true,
    }),
  });
  if (!result.ok) {
    if (statusEl) statusEl.textContent = '';
    showToast(`保存失败：${result.error || '未知错误'}`);
    return;
  }
  await reloadSettingsPanel(`模型服务「${result.provider?.name || draft.name || '模型服务'}」已保存，新会话生效`);
  loadModelCatalog();
}

async function setDefaultModel(providerId, modelId, label) {
  const result = await apiSoft('/api/providers', {
    method: 'POST',
    body: JSON.stringify({ action: 'default', id: providerId, model: modelId }),
  });
  if (!result.ok) {
    showToast(`切换失败：${result.error || '未知错误'}`);
    return;
  }
  await reloadSettingsPanel(label ? `默认模型已切换为 ${label}` : '默认模型已切换');
}

async function deleteProvider(providerId) {
  const provider = (state.settings?.settings?.providers || []).find((item) => item.id === providerId);
  if (!provider) return;
  if (!window.confirm(`删除模型服务「${provider.name || provider.id}」？正在使用它的会话会失效。`)) return;
  const result = await apiSoft('/api/providers', {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', id: providerId }),
  });
  if (!result.ok) {
    showToast(`删除失败：${result.error || '未知错误'}`);
    return;
  }
  await reloadSettingsPanel('模型服务已删除');
}

async function saveModelAdvanced() {
  const read = (name) => document.querySelector(`#modal-fields [name="${name}"]`)?.value || '';
  const result = await apiSoft('/api/settings', {
    method: 'POST',
    body: JSON.stringify({
      temperature: read('temperature'),
      maxTokens: read('maxTokens'),
      contextWindow: read('contextWindow'),
      inputPricePerM: read('inputPricePerM'),
      outputPricePerM: read('outputPricePerM'),
    }),
  });
  const statusEl = document.getElementById('model-advanced-status');
  if (!result.ok) {
    if (statusEl) statusEl.textContent = result.error || '保存失败';
    showToast(`保存失败：${result.error || '未知错误'}`);
    return;
  }
  state.settings = result;
  if (statusEl) statusEl.textContent = '已保存';
  showToast('高级参数已保存');
}

async function refreshBackupInfo() {
  try {
    state.backupInfo = await api('/api/backup/info');
    if (state.settingsTab === 'backup') renderSettingsPanel();
  } catch (error) {
    showToast(`读取备份信息失败：${error.message}`);
  }
}

async function createBackupSnapshot() {
  try {
    const payload = await api('/api/backup/snapshot', { method: 'POST', body: '{}' });
    await refreshBackupInfo();
    showToast(`快照已创建：${payload.path}`);
  } catch (error) {
    showToast(`快照失败：${error.message}`);
  }
}

async function restoreBackupFromFile(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const backup = JSON.parse(text);
    if (backup.schema !== 'one-company-backup' || !backup.store) {
      throw new Error('不是一人公司备份文件');
    }
    if (!confirm('恢复会用备份覆盖当前员工、项目、任务、记忆和设置。执行前会先自动做一份快照。确定继续？')) return;
    await api('/api/backup/snapshot', { method: 'POST', body: '{}' }).catch(() => null);
    const payload = await api('/api/backup/restore', {
      method: 'POST',
      body: JSON.stringify({ backup }),
    });
    if (payload.state) applyServerState(payload.state);
    state.settings = null;
    showToast('数据已从备份恢复，页面即将刷新');
    setTimeout(() => window.location.reload(), 800);
  } catch (error) {
    showToast(`恢复失败：${error.message}`);
  }
}

async function openSettings() {
  try {
    state.modelDraft = null;
    state.modelPickerOpen = false;
    state.modelAdvancedOpen = false;
    const [payload, catalogPayload, backupInfo] = await Promise.all([
      api('/api/settings'),
      api('/api/models').catch(() => ({ catalog: null })),
      api('/api/backup/info').catch(() => null),
    ]);
    state.settings = payload;
    state.modelCatalog = catalogPayload.catalog || null;
    state.backupInfo = backupInfo;
    state.settingsTab = 'model';
    openModal('settings');
  } catch (error) {
    showToast(`读取设置失败：${error.message}`);
  }
}

async function updateProjectArchive(projectId, archived) {
  try {
    const payload = await api('/api/projects/archive', {
      method: 'POST',
      body: JSON.stringify({ id: projectId, archived }),
    });
    applyServerState(payload.state);
    render();
    showToast(archived ? '项目已归档' : '项目已恢复');
  } catch (error) {
    showToast(`项目归档失败：${error.message}`);
  }
}

async function deleteProjectRecord(projectId) {
  const post = (force) =>
    api('/api/projects/delete', {
      method: 'POST',
      body: JSON.stringify({ id: projectId, deleteWorkspace: false, force }),
    });
  try {
    let payload;
    try {
      payload = await post(false);
    } catch (error) {
      const code = error.payload?.code || '';
      if (!['PROJECT_HAS_TASKS', 'PROJECT_HAS_DELIVERABLES'].includes(code)) throw error;
      if (!confirm(`${error.message}\n\n点「确定」会把这些任务和交付物一并归档，然后删除项目；工作区文件保留。`)) return;
      payload = await post(true);
    }
    applyServerState(payload.state);
    render();
    showToast('项目已删除，关联任务/交付物已归档');
  } catch (error) {
    showToast(`删除项目失败：${error.message}`);
  }
}

async function takeProjectSnapshot(projectId) {
  try {
    const payload = await api('/api/projects/snapshot', {
      method: 'POST',
      body: JSON.stringify({ projectId, label: '手动快照' }),
    });
    applyServerState(payload.state);
    render();
    showToast(`快照已创建：${payload.snapshot.id}`);
  } catch (error) {
    showToast(`快照失败：${error.message}`);
  }
}

async function openProjectSnapshots(projectId) {
  openModal('project-snapshots', projectId);
  const list = document.getElementById('snapshot-list');
  if (!list) return;
  try {
    const payload = await api(`/api/projects/snapshots?projectId=${encodeURIComponent(projectId)}`);
    if (!payload.snapshots || payload.snapshots.length === 0) {
      list.innerHTML = '<div class="modal-note">还没有快照。点项目卡片上的“快照”创建第一份。</div>';
      return;
    }
    list.innerHTML = payload.snapshots
      .map((snap) => {
        const time = new Date(snap.createdAt).toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
        return `<div class="snapshot-row">
          <div class="snapshot-main">
            <div class="snapshot-label">${escapeHtml(snap.label || '快照')}</div>
            <div class="snapshot-meta">${escapeHtml(time)} · ${escapeHtml(snap.id)} · ${snap.fileCount || 0} 个文件</div>
          </div>
          <button class="snapshot-restore" type="button" data-action="rollback-snapshot" data-id="${escapeHtml(snap.id)}" data-project="${escapeHtml(projectId)}" data-label="${escapeHtml(snap.label || '')}">回滚</button>
        </div>`;
      })
      .join('');
  } catch (error) {
    list.innerHTML = `<div class="modal-note">读取快照失败：${escapeHtml(error.message)}</div>`;
  }
}

function openRollbackModal(projectId, snapshotId, label) {
  state.pendingRollback = { projectId, snapshotId, label };
  openModal('rollback-snapshot');
}

async function testModelApi() {
  const form = document.getElementById('modal-form');
  const result = document.getElementById('settings-test-result');
  if (!form || !result) return;
  const body = Object.fromEntries(new FormData(form).entries());
  result.className = 'settings-status';
  result.textContent = '正在测试…';
  try {
    const payload = await api('/api/settings/test', { method: 'POST', body: JSON.stringify(body) });
    result.className = `settings-status ${payload.ok ? 'ok' : 'error'}`;
    result.textContent = payload.ok
      ? `连接成功 · HTTP ${payload.status} · ${payload.latencyMs}ms · ${payload.modelCount} 个模型`
      : payload.status === 401
        ? '连接失败：HTTP 401（该网关需要 API Key，请输入后重试）'
        : `连接失败：${payload.error || `HTTP ${payload.status}`}`;
  } catch (error) {
    result.className = 'settings-status error';
    result.textContent = `测试失败：${error.message}`;
  }
}

async function testChannel(channel) {
  const form = document.getElementById('modal-form');
  const result = document.getElementById(`settings-channel-result-${channel}`);
  if (!form || !result) return;
  const body = Object.fromEntries(new FormData(form).entries());
  body.channel = channel;
  result.className = 'settings-status';
  result.textContent = '正在测试…';
  try {
    const payload = await api('/api/settings/channels/test', { method: 'POST', body: JSON.stringify(body) });
    result.className = `settings-status ${payload.ok ? 'ok' : 'error'}`;
    if (payload.ok) {
      const target = payload.target ? `${payload.target} · ` : payload.status ? `HTTP ${payload.status} · ` : '';
      result.textContent = `连接成功 · ${target}${payload.latencyMs}ms${payload.detail ? ` · ${payload.detail}` : ''}`;
    } else {
      result.textContent = `连接失败：${payload.error || '未知错误'}`;
    }
  } catch (error) {
    result.className = 'settings-status error';
    result.textContent = `测试失败：${error.message}`;
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  const form = document.getElementById('modal-form');
  if (modalType === 'im') {
    clearImTimer();
    state.imProvision = null;
    state.imDraft = null;
    state.imEmployeeId = '';
  }
  if (modalType === 'gateway-add') {
    clearGatewayLoginTimer();
    state.gatewayLogin = null;
  }
  if (modal) modal.hidden = true;
  if (form) form.reset();
  modalType = null;
}

async function submitModal(event) {
  event.preventDefault();
  if (!modalType) return;
  if (modalType === 'im') return;
  const type = modalType;
  const formData = new FormData(event.target);
  const body = Object.fromEntries(formData.entries());
  if (['employee', 'employee-edit', 'hire-employee'].includes(type) && typeof body.model === 'string' && body.model.includes('::')) {
    const [provider, ...rest] = body.model.split('::');
    body.modelProvider = provider;
    body.model = rest.join('::');
  }

  if (type === 'report-preview') {
    const report = state.reports.find((item) => item.id === body.id || item.id === document.getElementById('modal-primary')?.dataset.downloadReport);
    if (report) window.location.href = `/api/reports/export?id=${encodeURIComponent(report.id)}`;
    return;
  }

  if (type === 'gateway-add') {
    const status = document.getElementById('gateway-add-status');
    try {
      if (status) status.textContent = '正在生成授权链接…';
      const payload = await api('/api/gateway/login/start', {
        method: 'POST',
        body: JSON.stringify({ realm: body.realm || 'cn' }),
      });
      state.gatewayLogin = payload;
      renderGatewayAddPanel();
      startGatewayLoginPoll();
    } catch (error) {
      if (status) status.textContent = `生成失败：${error.message}`;
    }
    return;
  }

  try {
    let payload;
    if (type === 'question-answer') {
      await submitQuestion(modalTargetId, { fromModal: true });
      return;
    }
    if (type === 'server') {
      payload = await api('/api/servers', { method: 'POST', body: JSON.stringify(body) });
      if (payload.warning) showToast(payload.warning);
    } else if (type === 'server-service') {
      body.dependsOn = [...(event.target.querySelector('select[name="dependsOn"]')?.selectedOptions || [])].map((option) => option.value);
      payload = await api('/api/servers/service', { method: 'POST', body: JSON.stringify(body) });
    } else if (type === 'meeting') {
      const participants = [...event.target.querySelectorAll('input[name="participants"]:checked')].map((input) => input.value);
      payload = await api('/api/meetings', {
        method: 'POST',
        body: JSON.stringify({ ...body, participants }),
      });
    } else if (type === 'template-apply') {
      payload = await api('/api/templates/apply', { method: 'POST', body: JSON.stringify(body) });
    } else if (type === 'template-import') {
      let parsed;
      try {
        parsed = JSON.parse(body.json);
      } catch {
        throw new Error('JSON 格式不正确');
      }
      payload = await api('/api/templates/import', { method: 'POST', body: JSON.stringify(parsed) });
    } else if (type === 'schedule') {
      payload = await api('/api/schedules', { method: 'POST', body: JSON.stringify(body) });
    } else if (type === 'employee-template') {
      payload = await api('/api/employees', { method: 'POST', body: JSON.stringify(body) });
    } else if (type === 'upload-deliverable') {
      const file = event.target.querySelector('[name="file"]')?.files?.[0];
      if (!file) throw new Error('请选择要上传的文件');
      const contentBase64 = await fileToBase64(file);
      payload = await api('/api/deliverables/upload', {
        method: 'POST',
        body: JSON.stringify({
          name: file.name,
          contentBase64,
          taskId: body.taskId || '',
          project: body.project || '',
          owner: body.owner || '',
          note: body.note || '',
        }),
      });
    } else if (type === 'team') {
      const members = [...event.target.querySelectorAll('input[name="members"]:checked')].map((input) => input.value);
      payload = await api('/api/teams', { method: 'POST', body: JSON.stringify({ ...body, members }) });
    } else if (type === 'employee-archive') {
      payload = await api('/api/employees/archive', { method: 'POST', body: JSON.stringify(body) });
    } else if (type === 'device-edit') {
      payload = await api('/api/devices', {
        method: 'POST',
        body: JSON.stringify({
          ...body,
          id: body.id || '',
          tags: String(body.tags || '')
            .split(/[,，、]/)
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });
    } else if (type === 'tool-edit') {
      payload = await api('/api/tools', { method: 'POST', body: JSON.stringify(body) });
    } else if (type === 'tool-assign') {
      payload = await api('/api/tools/assign', {
        method: 'POST',
        body: JSON.stringify({ toolCode: body.toolCode, employeeIds: formData.getAll('employeeIds') }),
      });
    } else if (type === 'skill-edit') {
      payload = await api('/api/skills', { method: 'POST', body: JSON.stringify(body) });
    } else if (type === 'skill-assign') {
      payload = await api('/api/skills/assign', {
        method: 'POST',
        body: JSON.stringify({ skillName: body.skillName, employeeIds: formData.getAll('employeeIds') }),
      });
    } else if (type === 'expert-edit') {
      payload = await api('/api/experts', {
        method: 'POST',
        body: JSON.stringify({ ...body, employeeIds: formData.getAll('employeeIds'), projectIds: formData.getAll('projectIds') }),
      });
    } else if (type === 'expert-assign') {
      payload = await api('/api/experts/assign', {
        method: 'POST',
        body: JSON.stringify({
          expertIds: [body.expertId],
          employeeIds: formData.getAll('employeeIds'),
          projectIds: formData.getAll('projectIds'),
        }),
      });
    } else if (type === 'expert-import') {
      const packageNames = formData.getAll('packageNames');
      if (!packageNames.length) throw new Error('请选择要导入的专家包');
      payload = await api('/api/experts/import', { method: 'POST', body: JSON.stringify({ packageNames }) });
    } else if (type === 'hire-employee') {
      payload = await api('/api/employees/hire', {
        method: 'POST',
        body: JSON.stringify({
          ...body,
          projectIds: formData.getAll('projectIds'),
          expertIds: formData.getAll('expertIds'),
        }),
      });
    } else if (type === 'memory-edit') {
      payload = await api('/api/memories/update', { method: 'POST', body: JSON.stringify(body) });
    } else if (type === 'project') payload = await api('/api/projects', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'task') payload = await api('/api/tasks', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'task-edit') payload = await api('/api/tasks/update', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'new-memory') payload = await api('/api/memories', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'employee') payload = await api('/api/employees', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'employee-edit') payload = await api('/api/employees/update', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'handoff') payload = await api('/api/tasks/handoff', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'task-from-message') payload = await api('/api/tasks/from-message', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'collect-deliverable') payload = await api('/api/deliverables', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'settings') {
      if (state.settingsTab === 'routing') body.modelRoutes = collectModelRoutes();
      payload = await api('/api/settings', { method: 'POST', body: JSON.stringify(body) });
    }
    else if (type === 'project-revenue' || type === 'project-cost' || type === 'project-release' || type === 'project-asset') {
      const action = type === 'project-revenue' ? 'revenue-add' : type === 'project-cost' ? 'cost-add' : type === 'project-release' ? 'release-add' : 'asset-add';
      payload = await api('/api/projects/detail', {
        method: 'POST',
        body: JSON.stringify({ ...body, projectId: body.projectId, action }),
      });
    } else if (type === 'company-audit') {
      payload = await api('/api/company/audit/repair', {
        method: 'POST',
        body: JSON.stringify({ projectId: '', scope: state.companyAuditScope || 'all' }),
      });
    } else if (type === 'project-edit') {
      const links = {};
      for (const link of PROJECT_LINKS) {
        if (body[`link_${link.key}`] !== undefined) links[link.key] = body[`link_${link.key}`];
      }
      payload = await api('/api/projects/update', {
        method: 'POST',
        body: JSON.stringify({
          ...body,
          links,
          techStack: String(body.techStack || '')
            .split(/[,，、]/)
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });
    } else if (type === 'outbound') payload = await api('/api/outbound', { method: 'POST', body: JSON.stringify(body) });
    else if (type === 'reject-approval') {
      payload = await api('/api/approvals/decide', {
        method: 'POST',
        body: JSON.stringify({ ...body, action: 'reject' }),
      });
    } else if (type === 'rollback-snapshot') {
      const pending = state.pendingRollback;
      if (!pending) return;
      payload = await api('/api/projects/rollback', {
        method: 'POST',
        body: JSON.stringify({
          projectId: pending.projectId,
          snapshotId: pending.snapshotId,
          confirm: body.confirm === '1',
        }),
      });
      state.pendingRollback = null;
    } else if (type === 'reject-deliverable') {
      payload = await api('/api/deliverables/review', {
        method: 'POST',
        body: JSON.stringify({ ...body, action: 'reject' }),
      });
    } else return;

    applyServerState(payload.state);
    closeModal();
    populateDockSelectors();
    if (type === 'reject-approval') void loadNotifications();
    if (type === 'settings') {
      state.settings = payload;
    } else if (type === 'server' || type === 'server-service') {
      state.view = 'datacenter';
      state.selectedServerId = type === 'server' ? payload.server?.id || state.selectedServerId : body.serverId || state.selectedServerId;
      state.datacenterOpen = true;
    } else if (type === 'meeting') {
      state.meetings = [payload.meeting, ...state.meetings.filter((item) => item.id !== payload.meeting.id)];
      state.meetingId = payload.meeting.id;
      state.view = 'meetings';
    } else if (type === 'schedule') {
      state.schedules = payload.state.schedules || state.schedules;
      state.view = 'automation';
    } else if (type === 'template-import') {
      state.templates = payload.templates || state.templates;
      state.view = 'templates';
    } else if (type === 'template-apply') {
      state.view = 'projects';
    } else if (type === 'employee-template') {
      state.view = 'employees';
    } else if (type === 'hire-employee') {
      state.view = 'employees';
      state.employeeFilter = 'all';
      loadEmployeeStatuses();
    } else if (type === 'tool-edit' || type === 'tool-assign') {
      state.view = 'tools';
    } else if (type === 'skill-edit' || type === 'skill-assign') {
      state.view = 'skills';
    } else if (type === 'expert-edit' || type === 'expert-assign' || type === 'expert-import') {
      state.view = 'experts';
    } else if (type === 'task' || type === 'task-edit' || type === 'handoff' || type === 'task-from-message') state.view = 'tasks';
    else if (type === 'employee' || type === 'employee-edit') state.view = 'employees';
    else if (type === 'employee-archive') {
      state.view = 'employees';
      loadEmployeeStatuses();
    } else if (type === 'team') {
      state.view = 'teams';
      loadTeams();
    } else if (type === 'memory-edit') {
      state.view = 'memories';
    } else if (type === 'collect-deliverable' || type === 'reject-deliverable' || type === 'upload-deliverable') state.view = 'deliverables';
    else if (type === 'new-memory') state.view = 'memories';
    else if (type === 'reject-approval') state.view = 'inbox';
    else if (type === 'outbound') state.view = 'inbox';
    else {
      state.view = 'projects';
      state.filterProject = 'all';
    }
    renderSidebarProjects();
    render();
    if (type === 'server' || type === 'server-service') loadServers(true);
    if (payload.warning) showToast(payload.warning);
    else if (type === 'handoff') showToast('任务已转交，双方会话里都留了记录');
    else if (type === 'task-from-message') showToast('任务已创建，来源对话已记录');
    else if (type === 'collect-deliverable') showToast('交付物已提交，等待验收');
    else if (type === 'upload-deliverable') showToast('交付物已上传，等待验收');
    else if (type === 'new-memory') showToast('记忆已写入 Markdown，下一轮对话生效');
    else if (type === 'task-edit') showToast('任务已更新');
    else if (type === 'reject-deliverable') showToast('已打回，意见已回到责任员工');
    else if (type === 'settings') { showToast(state.settingsTab === 'channels' ? '渠道配置已保存' : state.settingsTab === 'routing' ? '路由规则已保存，下一轮会话生效' : state.settingsTab === 'model' ? '模型设置已保存，新会话直接生效' : '设置已保存，npm run dsh 重启后生效'); void loadComposerModels(); }
    else if (type === 'project-edit') showToast('项目工作区已更新');
    else if (type === 'company-audit') showToast(`已生成 ${payload.created || 0} 个公司资料维护任务${payload.assignees?.length ? `（${payload.assignees.map((item) => `${item.owner} ${item.name}`).join('、')}）` : ''}`);
    else if (type === 'rollback-snapshot') showToast('项目工作区已回滚到快照');
    else if (type === 'reject-approval') showToast('已拒绝写操作，原因已发回员工');
    else if (type === 'outbound') showToast('外部动作已提交 L4 审批');
    else if (type === 'meeting') showToast('会议已创建，点“开始会议”让员工真实发言');
    else if (type === 'schedule') showToast('定时任务已创建');
    else if (type === 'template-import') showToast(`已导入 ${payload.imported?.length || 0} 个模板`);
    else if (type === 'template-apply') showToast(`已应用模板，新增 ${payload.createdTasks || 0} 个任务`);
    else if (type === 'server') showToast('服务器信息已保存');
    else if (type === 'server-service') showToast('项目服务已保存');
    else if (type === 'team') showToast('团队已保存');
    else if (type === 'employee-archive') showToast(`员工已归档，转交 ${payload.reassigned || 0} 个任务`);
    else if (type === 'tool-edit') showToast('工具目录已更新');
    else if (type === 'tool-assign') showToast(`工具分配已更新 ${payload.updated || 0} 名员工`);
    else if (type === 'skill-edit') showToast('技能目录已更新');
    else if (type === 'skill-assign') showToast(`技能分配已更新 ${payload.updated || 0} 名员工`);
    else if (type === 'expert-edit') showToast('专家档案已更新');
    else if (type === 'expert-assign') showToast('专家绑定已更新，下一轮对话生效');
    else if (type === 'expert-import') showToast(`已从 WorkBuddy 导入 ${payload.count || 0} 位专家`);
    else if (type === 'hire-employee') showToast(`沈舟已完成招聘：${payload.employee?.name || ''}，分配工具 ${payload.assignment?.tools?.length || 0} 个、技能 ${payload.assignment?.skills?.length || 0} 个、专家 ${payload.assignment?.experts?.length || 0} 位`);
    else if (type === 'memory-edit') showToast(`记忆已保存到 v${payload.memory?.version || ''}`);
    else showToast('已保存到本地');
  } catch (error) {
    if (error.payload?.code === 'MEMORY_CONFLICT') {
      showToast('保存失败：记忆已被修改，请重新打开预览后合并');
      openMemoryPreview(error.payload.memory?.id || '');
    } else {
      showToast(`创建失败：${error.message}`);
    }
  }
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const { action, id, result, project: projectId, label, tab, value } = target.dataset;

  if (action === 'open-notifications') {
    state.view = 'notifications';
    state.opsOpen = true;
    render();
    loadNotifications();
  } else if (action === 'notification-filter') {
    state.notificationFilter = target.dataset.value || 'all';
    render();
  } else if (action === 'read-notification') {
    api('/api/notifications/read', { method: 'POST', body: JSON.stringify({ id }) })
      .then((payload) => {
        applyServerState(payload.state);
        state.notificationUnread = payload.unread || 0;
        loadNotifications();
      })
      .catch((error) => showToast(`标记失败：${error.message}`));
  } else if (action === 'mark-all-notifications') {
    api('/api/notifications/read', { method: 'POST', body: JSON.stringify({ all: true }) })
      .then((payload) => {
        applyServerState(payload.state);
        state.notificationUnread = 0;
        loadNotifications();
        showToast('全部通知已读');
      })
      .catch((error) => showToast(`操作失败：${error.message}`));
  } else if (action === 'delete-notification') {
    api('/api/notifications/delete', { method: 'POST', body: JSON.stringify({ id }) })
      .then((payload) => {
        applyServerState(payload.state);
        loadNotifications();
      })
      .catch((error) => showToast(`删除失败：${error.message}`));
  } else if (action === 'refresh-notifications') {
    loadNotifications();
  } else if (action === 'open-notification') {
    const view = target.dataset.view || 'inbox';
    state.view = view;
    if (view === 'datacenter' && target.dataset.target) state.selectedServerId = target.dataset.target;
    if (view === 'meetings' && target.dataset.target) state.meetingId = target.dataset.target;
    if (view === 'memories' || view === 'deliverables') {
      const nid = state.notifications.find((item) => item.targetId === target.dataset.target)?.id;
      if (nid) api('/api/notifications/read', { method: 'POST', body: JSON.stringify({ id: nid }) }).catch(() => {});
    }
    render();
    if (view === 'audit') loadAudit();
    if (view === 'teams') loadTeams();
    if (view === 'workstations') loadWorkstations();
    if (view === 'deliverables' && target.dataset.target) previewDeliverable(target.dataset.target);
    if (view === 'memories' && target.dataset.target) openMemoryPreview(target.dataset.target);
    if (view === 'tasks' && target.dataset.target) openModal('task-edit', target.dataset.target);
    if (view === 'employees' && target.dataset.target) openEmployeeChat(target.dataset.target);
  } else if (action === 'new-team') {
    openModal('team');
  } else if (action === 'edit-team') {
    openModal('team', id);
  } else if (action === 'delete-team') {
    if (!window.confirm('确定删除这个团队吗？员工和历史记录会保留。')) return;
    api('/api/teams/delete', { method: 'POST', body: JSON.stringify({ id }) })
      .then((payload) => {
        applyServerState(payload.state);
        loadTeams();
        showToast('团队已删除');
      })
      .catch((error) => showToast(`删除失败：${error.message}`));
  } else if (action === 'load-teams') {
    loadTeams();
  } else if (action === 'filter-audit') {
    state.auditFilter = {
      q: document.getElementById('audit-q')?.value || '',
      actor: document.getElementById('audit-actor')?.value || '',
      action: document.getElementById('audit-action')?.value || '',
    };
    loadAudit();
  } else if (action === 'reset-audit') {
    state.auditFilter = { action: '', actor: '', q: '' };
    loadAudit();
  } else if (action === 'verify-audit') {
    api('/api/audit/verify')
      .then((payload) => {
        state.audit = { ...(state.audit || {}), chain: payload.chain };
        render();
        showToast(payload.chain.ok ? `哈希链完整（${payload.chain.total} 条）` : `哈希链异常：${payload.chain.reason}`);
      })
      .catch((error) => showToast(`校验失败：${error.message}`));
  } else if (action === 'export-audit') {
    window.location.href = '/api/audit/export';
  } else if (action === 'employee-archive-filter') {
    state.employeeShowArchived = target.dataset.value === 'archived';
    render();
  } else if (action === 'archive-employee') {
    openModal('employee-archive', id);
  } else if (action === 'clear-employee-context') {
    if (
      confirm(
        '清空这个员工的对话和上下文？\n\n员工会以全新上下文开始；项目、任务、交付物和知识库记忆不会删除。',
      )
    ) {
      api('/api/employees/clear-context', {
        method: 'POST',
        body: JSON.stringify({ id, clearChat: true }),
      })
        .then((payload) => {
          applyServerState(payload.state);
          render();
          showToast(`已清空上下文：会话 ${payload.clearedSessions || 0} 个，消息 ${payload.clearedChat || 0} 条`);
        })
        .catch((error) => showToast(`清空失败：${error.message}`));
    }
  } else if (action === 'restore-employee') {
    api('/api/employees/restore', { method: 'POST', body: JSON.stringify({ id }) })
      .then((payload) => {
        applyServerState(payload.state);
        render();
        loadEmployeeStatuses();
        showToast('员工已恢复在职');
      })
      .catch((error) => showToast(`恢复失败：${error.message}`));
  } else if (action === 'cancel-task') {
    api('/api/tasks/cancel', { method: 'POST', body: JSON.stringify({ id }) })
      .then(() => {
        showToast('已发送停止指令');
        refreshTaskState();
      })
      .catch((error) => showToast(`停止失败：${error.message}`));
  } else if (action === 'resume-task') {
    api('/api/tasks/resume', { method: 'POST', body: JSON.stringify({ id }) })
      .then((payload) => {
        applyServerState(payload.state);
        render();
        showToast('已从断点继续');
        pollTaskRun(id, 90);
      })
      .catch((error) => showToast(`继续失败：${error.message}`));
  } else if (action === 'review-task') {
    const comment = window.prompt('任务验收意见（全部通过可留空）', '') ?? '';
    api('/api/tasks/review', {
      method: 'POST',
      body: JSON.stringify({ taskId: id, action: target.dataset.result || 'approve', comment }),
    })
      .then((payload) => {
        applyServerState(payload.state);
        closeModal();
        render();
        showToast(`已处理 ${payload.reviewed} 份交付物`);
      })
      .catch((error) => showToast(`验收失败：${error.message}`));
  } else if (action === 'edit-memory') {
    openModal('memory-edit', id);
  } else if (action === 'rollback-memory') {
    const version = target.dataset.version;
    if (!window.confirm(`回滚到 v${version}？当前内容会保留在版本历史里。`)) return;
    api('/api/memories/rollback', { method: 'POST', body: JSON.stringify({ id, version }) })
      .then((payload) => {
        applyServerState(payload.state);
        openMemoryPreview(id);
        showToast(`已回滚到 v${version}`);
      })
      .catch((error) => showToast(`回滚失败：${error.message}`));
  } else if (action === 'memory-file-adopt') {
    api(`/api/memories/${encodeURIComponent(id)}`)
      .then((payload) => {
        const raw = String(payload.content || '').replace(/^---[\s\S]*?---\s*/, '');
        return api('/api/memories/update', {
          method: 'POST',
          body: JSON.stringify({ id, content: raw, baseVersion: payload.memory.version, note: '以磁盘文件为准' }),
        });
      })
      .then((payload) => {
        applyServerState(payload.state);
        openMemoryPreview(id);
        showToast('已用磁盘文件内容更新记忆版本');
      })
      .catch((error) => showToast(`更新失败：${error.message}`));
  } else if (action === 'ledger-range') {
    state.ledgerFilter = { ...(state.ledgerFilter || {}), range: target.dataset.value || 'all' };
    loadLedger();
  } else if (action === 'filter-ledger') {
    state.ledgerFilter = {
      range: state.ledgerFilter?.range || 'all',
      employee: document.getElementById('ledger-employee')?.value || '',
      project: document.getElementById('ledger-project')?.value || '',
      model: document.getElementById('ledger-model')?.value || '',
      source: document.getElementById('ledger-source')?.value || '',
    };
    loadLedger();
  } else if (action === 'reset-ledger') {
    state.ledgerFilter = { range: 'all', employee: '', project: '', model: '', source: '' };
    loadLedger();
  } else if (action === 'refresh-workstations') {
    loadWorkstations();
  } else if (action === 'filter-workstations') {
    state.workstationProject = document.getElementById('station-project')?.value || 'all';
    render();
  } else if (action === 'station-files') {
    const empId = target.dataset.employee;
    const projId = target.dataset.project;
    api(`/api/employee-files?employeeId=${encodeURIComponent(empId)}&projectId=${encodeURIComponent(projId)}`)
      .then((payload) => {
        const files = payload.files || [];
        window.alert(`${employee(empId)?.name || empId} @ ${project(projId)?.name || projId}\n${payload.cwd}\n\n${files.map((file) => `${file.path} (${formatBytes(file.size)})`).join('\n') || '空工位'}`);
      })
      .catch((error) => showToast(`读取失败：${error.message}`));
  } else if (action === 'station-sync') {
    api('/api/stations/sync', {
      method: 'POST',
      body: JSON.stringify({ projectId: target.dataset.project, employeeId: target.dataset.employee }),
    })
      .then((payload) => {
        applyServerState(payload.state);
        loadWorkstations();
        showToast(`已归档 ${payload.copied.length} 个文件到项目工作区`);
      })
      .catch((error) => showToast(`归档失败：${error.message}`));
  } else if (action === 'station-clean') {
    if (!window.confirm('清理后这个工位里的未归档文件会删除，确定吗？')) return;
    api('/api/stations/clean', {
      method: 'POST',
      body: JSON.stringify({ projectId: target.dataset.project, employeeId: target.dataset.employee, confirm: true }),
    })
      .then((payload) => {
        applyServerState(payload.state);
        loadWorkstations();
        showToast('工位已清理');
      })
      .catch((error) => showToast(`清理失败：${error.message}`));
  } else if (action === 'datacenter-group') {
    state.datacenterGroup = target.dataset.value || 'all';
    render();
  } else if (action === 'service-group') {
    state.serviceGroupFilter = target.dataset.value || 'all';
    render();
  } else if (action === 'select-service') {
    const key = `${target.dataset.server}:${target.dataset.service}`;
    const list = new Set(state.batchSelected || []);
    if (target.checked) list.add(key);
    else list.delete(key);
    state.batchSelected = [...list];
    render();
  } else if (action === 'batch-clear') {
    state.batchSelected = [];
    render();
  } else if (action === 'batch-service') {
    const targets = (state.batchSelected || []).map((key) => {
      const [serverId, serviceId] = key.split(':');
      return { serverId, serviceId };
    });
    if (!targets.length) return;
    const verb = target.dataset.op === 'stop' ? '停止' : target.dataset.op === 'restart' ? '重启' : '启动';
    if (target.dataset.op !== 'start' && !window.confirm(`确定批量${verb} ${targets.length} 个服务吗？`)) return;
    api('/api/servers/batch', { method: 'POST', body: JSON.stringify({ action: target.dataset.op, targets }) })
      .then((payload) => {
        applyServerState(payload.state);
        state.batchSelected = [];
        state.servers = payload.servers || state.servers;
        render();
        const failed = (payload.results || []).filter((item) => !item.ok).length;
        showToast(failed ? `批量${verb}完成，${failed} 个失败` : `批量${verb}完成`);
      })
      .catch((error) => showToast(`批量操作失败：${error.message}`));
  } else if (action === 'toggle-autostart') {
    const enabled = state.data.serverSettings?.autoStart === false;
    api('/api/servers/autostart', { method: 'POST', body: JSON.stringify({ enabled }) })
      .then((payload) => {
        state.data.serverSettings = payload.serverSettings;
        render();
        showToast(enabled ? '已开启：随一人公司启动时拉起自启服务' : '已关闭服务自启');
      })
      .catch((error) => showToast(`设置失败：${error.message}`));
  } else if (action === 'test-ssh') {
    const resultEl = document.getElementById('ssh-test-result');
    const form = document.getElementById('modal-form');
    const body = { id };
    // 新建服务器时还没保存，直接用表单里当前填的值测试
    if (!id && form) {
      const data = new FormData(form);
      body.name = String(data.get('name') || '');
      body.host = String(data.get('host') || '');
      body.sshPort = Number(data.get('sshPort') || 22);
      body.sshUser = String(data.get('sshUser') || '');
      body.sshKeyPath = String(data.get('sshKeyPath') || '');
    }
    if (resultEl) resultEl.textContent = '正在连接…';
    api('/api/servers/ssh-test', { method: 'POST', body: JSON.stringify(body) })
      .then((payload) => {
        if (Array.isArray(payload.keys)) {
          state.sshKeys = payload.keys;
          state.sshKeysLoaded = true;
          renderSshKeyOptions();
        }
        if (payload.ok) {
          const message = `连接成功 ${payload.latencyMs}ms · ${payload.hostname || ''} · 密钥 ${payload.keyPath || '默认'}`;
          if (resultEl) resultEl.textContent = message;
          showToast(`SSH 连接成功（${payload.latencyMs}ms）`);
          return;
        }
        if (resultEl) resultEl.textContent = payload.error || '连接失败';
        // 猜到了更合适的密钥就顺手填上，省得用户对着中文路径发呆
        const input = form?.querySelector('input[name="sshKeyPath"]');
        if (payload.suggestion && input && !input.value) {
          input.value = payload.suggestion.path;
          if (resultEl) resultEl.textContent = `${payload.error}（已填入 ${payload.suggestion.name}，请再点一次测试）`;
        }
        showToast(payload.error || 'SSH 连接失败');
      })
      .catch((error) => {
        if (resultEl) resultEl.textContent = error.message;
      });
  } else if (action === 'stop-chat') {
    stopChat();
  } else if (action === 'continue-chat') {
    continueChat(id);
  } else if (action === 'toggle-datacenter') {
    state.datacenterOpen = !state.datacenterOpen;
    updateNav();
  } else if (action === 'open-datacenter') {
    state.view = 'datacenter';
    state.selectedServerId = '';
    state.datacenterOpen = true;
    render();
  } else if (action === 'open-server') {
    state.view = 'datacenter';
    state.selectedServerId = id || '';
    state.datacenterOpen = true;
    render();
  } else if (action === 'open-employee-chat') {
    openEmployeeChat(id);
  } else if (action === 'toggle-panel-done') {
    state.panelShowDone = !state.panelShowDone;
    renderPanel();
  } else if (action === 'employee-filter') {
    state.employeeFilter = target.dataset.filter || 'all';
    renderPanel();
  } else if (action === 'refresh-employee-status') {
    loadEmployeeStatuses();
  } else if (action === 'check-servers') {
    checkServers();
  } else if (action === 'new-server') {
    openModal('server');
  } else if (action === 'edit-server') {
    openModal('server', id);
  } else if (action === 'new-service') {
    openModal('server-service', '', target.dataset.server || state.selectedServerId);
  } else if (action === 'edit-service') {
    openModal('server-service', id, target.dataset.server || state.selectedServerId);
  } else if (action === 'delete-service') {
    deleteServerService(target.dataset.server || state.selectedServerId, id);
  } else if (action === 'delete-server') {
    deleteServer(id);
  } else if (action === 'server-service-action') {
    runServerServiceAction(target.dataset.server, target.dataset.service, target.dataset.op, target);
  } else if (action === 'preview-server-console') {
    openServerConsole(target.dataset.server, target.dataset.service);
  } else if (action === 'show-service-log') {
    openServiceLog(target.dataset.server, id);
  } else if (action === 'toggle-assets') {
    state.assetsOpen = !state.assetsOpen;
    updateNav();
  } else if (action === 'toggle-ops') {
    state.opsOpen = !state.opsOpen;
    updateNav();
  } else if (action === 'toggle-mobile-nav') {
    document.body.classList.toggle('mobile-nav-open');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.hidden = !document.body.classList.contains('mobile-nav-open');
  } else if (action === 'toggle-mobile-chat') {
    document.body.classList.toggle('mobile-chat-open');
    if (document.body.classList.contains('mobile-chat-open')) setTimeout(scrollChat, 80);
  } else if (action === 'generate-report') {
    generateReport(target.dataset.kind || 'daily');
  } else if (action === 'preview-report') {
    openModal('report-preview', id);
  } else if (action === 'new-meeting') {
    openModal('meeting');
  } else if (action === 'open-meeting') {
    state.meetingId = id;
    render();
  } else if (action === 'close-meeting') {
    state.meetingId = '';
    render();
  } else if (action === 'run-meeting') {
    runMeeting(id);
  } else if (action === 'end-meeting') {
    endMeeting(id);
  } else if (action === 'meeting-action-task') {
    createMeetingTask(id, target.dataset.meeting || '');
  } else if (action === 'org-tab') {
    state.orgTab = tab || 'matrix';
    render();
    if (state.orgTab === 'matrix') loadOrgData();
    else loadPerformance();
  } else if (action === 'perf-days') {
    state.performanceDays = Number(value) || 30;
    loadPerformance();
  } else if (action === 'template-tab') {
    state.templateTab = tab || 'project';
    render();
  } else if (action === 'apply-template') {
    openModal('template-apply', id);
  } else if (action === 'use-role-template') {
    openModal('employee-template', id);
  } else if (action === 'view-acceptance') {
    openModal('acceptance-preview', id);
  } else if (action === 'import-template') {
    openModal('template-import');
  } else if (action === 'new-schedule') {
    openModal('schedule');
  } else if (action === 'toggle-schedule') {
    toggleSchedule(id);
  } else if (action === 'run-schedule') {
    runScheduleNow(id);
  } else if (action === 'delete-schedule') {
    deleteSchedule(id);
  } else if (action === 'open-search-result') {
    openSearchResult(target.dataset);
  } else if (action === 'merge-worktree') {
    worktreeAction(id, 'merge');
  } else if (action === 'discard-worktree') {
    worktreeAction(id, 'discard');
  } else if (action === 'open-guide') {
    window.open('/guide.html', '_blank', 'noopener');
  } else if (action === 'open-data-dir') {
    if (window.oneCompanyDesktop?.openDataDir) {
      void window.oneCompanyDesktop.openDataDir();
    } else {
      showToast(`数据目录：${state.backupInfo?.dataDir || '请查看应用设置'}`);
    }
  } else if (action === 'refresh-backup-info') {
    void refreshBackupInfo();
  } else if (action === 'context-breakdown') {
    const employeeId = document.getElementById('context-employee')?.value || '';
    const projectId = document.getElementById('context-project')?.value || '';
    state.contextEmployeeId = employeeId;
    state.contextProjectId = projectId;
    api(`/api/context/breakdown?employeeId=${encodeURIComponent(employeeId)}&projectId=${encodeURIComponent(projectId)}`)
      .then((payload) => {
        state.contextBreakdown = payload;
        renderSettingsPanel();
      })
      .catch((error) => showToast(`测量失败：${error.message}`));
  } else if (action === 'backup-now') {
    void createBackupSnapshot();
  } else if (action === 'restore-snapshot') {
    if (!confirm('恢复这个快照会覆盖当前员工、项目、任务、记忆和设置。执行前会再自动快照一次，确定继续？')) return;
    api('/api/backup/restore-snapshot', { method: 'POST', body: JSON.stringify({ id }) })
      .then((payload) => {
        applyServerState(payload.state);
        showToast('数据已从快照恢复，页面即将刷新');
        setTimeout(() => location.reload(), 900);
      })
      .catch((error) => showToast(`恢复失败：${error.message}`));
  } else if (action === 'backup-export') {
    window.open('/api/backup/export', '_blank');
  } else if (action === 'backup-restore') {
    document.getElementById('backup-restore-file')?.click();
  } else if (action === 'open-settings') {
    openSettings();
  } else if (action === 'open-dsh') {
    void (async () => {
      try {
        const payload = await api('/api/dsh/url');
        window.open(payload.url, '_blank', 'noopener');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-refresh') {
    void (async () => {
      await loadGateway(true);
      await loadGatewayModels(true);
    })();
  } else if (action === 'gateway-tab') {
    state.gatewayTab = tab || 'overview';
    render();
    if (['models', 'routing'].includes(state.gatewayTab)) void loadGatewayModels();
  } else if (action === 'gateway-start-service' || action === 'gateway-stop-service' || action === 'gateway-restart-service') {
    void (async () => {
      const map = { 'gateway-start-service': 'start', 'gateway-stop-service': 'stop', 'gateway-restart-service': 'restart' };
      showToast('正在操作内置网关…');
      try {
        const payload = await api('/api/gateway/service', { method: 'POST', body: JSON.stringify({ action: map[action] }) });
        state.gateway = payload.gateway;
        render();
        showToast(payload.gateway?.ok ? '网关已就绪' : `网关状态：${payload.gateway?.status || '异常'}`, payload.gateway?.ok ? 'ok' : 'warn');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-open-panel') {
    void (async () => {
      try {
        const payload = await api('/api/gateway/panel-url');
        window.open(payload.url, '_blank', 'noopener');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-open-add') {
    openModal('gateway-add');
  } else if (action === 'gateway-balance-all') {
    void (async () => {
      showToast('正在刷新全部账号余额…');
      try {
        const payload = await api('/api/gateway/balance-all', { method: 'POST', body: '{}' });
        state.gateway = payload.gateway;
        render();
        showToast('余额已刷新', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-checkin-all') {
    void (async () => {
      showToast('正在给全部账号签到，可能需要一两分钟…');
      try {
        const payload = await api('/api/gateway/checkin-all', { method: 'POST', body: '{}' });
        state.gateway = payload.gateway;
        render();
        showToast('全部账号签到完成', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-account') {
    void (async () => {
      const uid = target.dataset.uid || '';
      const op = target.dataset.op || 'checkin';
      if (op === 'remove' && !window.confirm('确定从公司网关移除这个账号？账号凭据会从本机删除。')) return;
      showToast(op === 'checkin' ? '正在签到…' : '正在处理…');
      try {
        const payload = await api(`/api/gateway/accounts/${encodeURIComponent(uid)}/${op}`, { method: 'POST', body: '{}' });
        state.gateway = payload.gateway;
        render();
        showToast(op === 'checkin' ? '签到完成' : '已更新账号', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-sync-models') {
    void (async () => {
      await loadGatewayModels(true);
      showToast(`模型目录已刷新：${state.gatewayModels.length} 个`, 'ok');
    })();
  } else if (action === 'gateway-save-models') {
    void (async () => {
      const models = [...document.querySelectorAll('[data-model-row]')].map((row) => ({
        id: row.dataset.modelRow,
        enabled: Boolean(row.querySelector('[data-gateway-model="enabled"]')?.checked),
        tier: row.querySelector('[data-gateway-model="tier"]')?.value || 'standard',
        free: Boolean(row.querySelector('[data-gateway-model="free"]')?.checked),
      }));
      try {
        const payload = await api('/api/gateway/models', { method: 'POST', body: JSON.stringify({ models }) });
        state.gateway = payload.gateway;
        showToast('模型策略已保存', 'ok');
        await loadGatewayModels(true);
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-save-policy') {
    void (async () => {
      const night = {
        enabled: Boolean(document.getElementById('gateway-night-enabled')?.checked),
        start: document.getElementById('gateway-night-start')?.value || '23:00',
        end: document.getElementById('gateway-night-end')?.value || '08:00',
        model: document.getElementById('gateway-night-model')?.value || '',
        effort: document.getElementById('gateway-night-effort')?.value || 'off',
        tiers: [...document.querySelectorAll('[data-gateway-night-tier]:checked')].map((input) => input.dataset.gatewayNightTier),
      };
      try {
        const payload = await api('/api/gateway/policy', { method: 'POST', body: JSON.stringify({ night }) });
        state.gateway = payload.gateway;
        render();
        showToast('夜间策略已保存', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-save-checkin') {
    void (async () => {
      const hours = String(document.getElementById('gateway-checkin-hours')?.value || '9, 21')
        .split(/[,，、\s]+/)
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item) && item >= 0 && item <= 23);
      try {
        const payload = await api('/api/gateway/policy', {
          method: 'POST',
          body: JSON.stringify({ checkin: { auto: Boolean(document.getElementById('gateway-checkin-auto')?.checked), hours } }),
        });
        state.gateway = payload.gateway;
        render();
        showToast('签到设置已保存', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-save-employee-tier') {
    void (async () => {
      const employeeId = id || '';
      const tier = document.querySelector(`[data-gateway-employee-tier="${CSS.escape(employeeId)}"]`)?.value || 'standard';
      try {
        await api('/api/employees/update', { method: 'POST', body: JSON.stringify({ id: employeeId, modelTier: tier }) });
        const payload = await api('/api/state');
        applyServerState(payload.state);
        render();
        showToast('员工档位已保存', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-pick-import') {
    document.getElementById('gateway-import-file')?.click();
  } else if (action === 'gateway-export') {
    window.open('/api/gateway/export', '_blank');
  } else if (action === 'gateway-import-remote') {
    void (async () => {
      const serverId = document.getElementById('gateway-import-server')?.value || '';
      const authDir = document.getElementById('gateway-import-authdir')?.value.trim() || '~/wb2api/auths';
      if (!serverId) {
        showToast('先选择一台服务器', 'warn');
        return;
      }
      showToast('正在通过 SSH 读取原网关账号…');
      try {
        const payload = await api('/api/gateway/import-remote', { method: 'POST', body: JSON.stringify({ serverId, authDir }) });
        state.gateway = payload.gateway;
        render();
        showToast(`已导入 ${payload.imported} 个账号${payload.failed ? `，失败 ${payload.failed} 个` : ''}`, payload.imported ? 'ok' : 'warn');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'gateway-download-script') {
    window.open('/api/gateway/export-script?type=py', '_blank');
  } else if (action === 'gateway-download-script-node') {
    window.open('/api/gateway/export-script?type=mjs', '_blank');
  } else if (action === 'gateway-copy-agent') {
    const text = '请把「下载 Python 脚本」得到的 gateway-export.py 上传到原网关机器，执行：python3 gateway-export.py --dir ~/wb2api/auths --out gateway-accounts.json，然后把 gateway-accounts.json 交给公司台「网关 → 导入导出 → 上传 JSON 导入」。导入前先停掉旧网关进程。';
    navigator.clipboard.writeText(text).then(
      () => showToast('Agent 指令已复制', 'ok'),
      () => showToast('复制失败，请手动复制', 'warn'),
    );
  } else if (action === 'gateway-open-auth-url') {
    if (state.gatewayLogin?.url) window.open(state.gatewayLogin.url, '_blank', 'noopener');
  } else if (action === 'gateway-copy-auth-url') {
    if (state.gatewayLogin?.url) {
      navigator.clipboard.writeText(state.gatewayLogin.url).then(
        () => showToast('授权链接已复制', 'ok'),
        () => showToast('复制失败，请手动选择', 'warn'),
      );
    }
  } else if (action === 'gateway-add-provider') {
    void (async () => {
      try {
        const payload = await api('/api/gateway/add-provider', { method: 'POST', body: '{}' });
        state.gateway = payload.gateway;
        if (payload.settings) state.settings = payload.settings;
        render();
        showToast(`已加入模型服务：${payload.provider?.models || 0} 个模型`, 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'im-refresh') {
    state.imState = null;
    void loadImState(true);
  } else if (action === 'im-open-panel') {
    void (async () => {
      try {
        const payload = await api('/api/im/panel-url');
        window.open(payload.url, '_blank', 'noopener');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'im-manage') {
    openImModal(id);
  } else if (action === 'im-channel') {
    void startImProvision(target.dataset.channel || '');
  } else if (action === 'im-token-submit') {
    void connectImToken();
  } else if (action === 'im-cancel-draft') {
    clearImTimer();
    state.imProvision = null;
    state.imDraft = null;
    renderImModalBody();
  } else if (action === 'im-provision-cancel') {
    void cancelImProvision();
  } else if (action === 'im-verify-submit') {
    const code = document.getElementById('im-verify-code')?.value.trim() || '';
    const provision = state.imProvision;
    if (!provision?.attemptId || !/^\d{4,8}$/.test(code)) {
      showToast('请输入手机上显示的 4-8 位配对码', 'warn');
      return;
    }
    void (async () => {
      try {
        const payload = await api('/api/im/provision', { method: 'POST', body: JSON.stringify({ channel: provision.channel, action: 'verify', attemptId: provision.attemptId, verifyCode: code }) });
        state.imProvision = { ...provision, ...imProvisionInfo(payload.value) };
        renderImModalBody();
        scheduleImPoll();
      } catch (error) {
        state.imProvision = { ...provision, error: error.message };
        renderImModalBody();
      }
    })();
  } else if (action === 'im-bind-existing') {
    const selected = document.getElementById('im-existing-bot')?.value || '';
    const [channel, botId] = selected.split('::');
    if (!channel || !botId) return;
    void (async () => {
      try {
        await api('/api/im/bind', { method: 'POST', body: JSON.stringify({ employeeId: state.imEmployeeId, channel, botId }) });
        await loadImState(true);
        renderImModalBody();
        showToast('已绑定到员工', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'im-assign-bot') {
    const row = target.closest('.im-unassigned-row');
    const employeeId = row?.querySelector('select')?.value || '';
    const channel = target.dataset.channel || '';
    const botId = target.dataset.bot || '';
    if (!employeeId || !channel || !botId) return;
    void (async () => {
      try {
        await api('/api/im/bind', { method: 'POST', body: JSON.stringify({ employeeId, channel, botId }) });
        await loadImState(true);
        showToast('已分配给员工', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'im-bot-sync') {
    const channel = target.dataset.channel || '';
    const botId = target.dataset.bot || '';
    void (async () => {
      try {
        await api('/api/im/bind', { method: 'POST', body: JSON.stringify({ employeeId: state.imEmployeeId, channel, botId }) });
        await loadImState(true);
        renderImModalBody();
        showToast('已按员工最新资料同步身份', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'im-bot-unbind' || action === 'im-bot-delete' || action === 'im-bot-reconnect') {
    const channel = target.dataset.channel || '';
    const botId = target.dataset.bot || '';
    if (action !== 'im-bot-reconnect' && !window.confirm(action === 'im-bot-delete' ? '删除机器人会同时断开它在 IM 里的连接，确定吗？' : '解绑后这个机器人不再代表该员工，确定吗？')) return;
    void (async () => {
      try {
        const path = action === 'im-bot-delete' ? '/api/im/delete' : action === 'im-bot-unbind' ? '/api/im/unbind' : '/api/im/reconnect';
        await api(path, { method: 'POST', body: JSON.stringify({ channel, botId }) });
        await loadImState(true);
        renderImModalBody();
        showToast(action === 'im-bot-reconnect' ? '已请求重连' : action === 'im-bot-delete' ? '机器人已删除' : '已解绑', 'ok');
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'open-market') {
    void openMarket(target.dataset.type || 'expert');
  } else if (action === 'market-search') {
    void openMarket(target.dataset.type || 'expert', document.getElementById('market-query')?.value.trim() || '');
  } else if (action === 'market-import') {
    const type = target.dataset.type || 'expert';
    const id = target.dataset.id || '';
    void (async () => {
      try {
        const payload = await api('/api/market/import', { method: 'POST', body: JSON.stringify({ type, id }) });
        if (payload.state) applyServerState(payload.state);
        showToast(type === 'expert' ? '专家已导入公司目录' : '技能已导入公司目录', 'ok');
        await openMarket(type);
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'settings-tab') {
    state.settingsTab = tab || 'model';
    renderSettingsPanel();
    if ((state.settingsTab === 'routing' || state.settingsTab === 'model') && !state.modelCatalog) loadModelCatalog();
    if (state.settingsTab === 'backup') void refreshBackupInfo();
    if (state.settingsTab === 'im') void loadImState(true);
  } else if (action === 'toggle-model-picker') {
    const panel = document.getElementById('model-picker');
    if (!panel) return;
    panel.hidden = !panel.hidden;
    state.modelPickerOpen = !panel.hidden;
    target.textContent = panel.hidden ? '更换模型' : '收起模型列表';
    if (!panel.hidden) document.getElementById('model-picker-search')?.focus();
  } else if (action === 'view-skill') {
    openModal('skill-view', id);
  } else if (action === 'scan-server') {
    void askSecretaryScanServer(id);
  } else if (action === 'answer-question' || action === 'open-question-flow') {
    openQuestionFlow(id);
  } else if (action === 'qr-pick') {
    chooseQuestionOption(target.dataset.label || '');
  } else if (action === 'qr-next') {
    captureQuestionCustom();
    questionFlowAdvance();
  } else if (action === 'qr-skip') {
    skipQuestion();
  } else if (action === 'close-question-flow') {
    closeQuestionFlow();
  } else if (action === 'chat-jump') {
    scrollChat(true, true);
  } else if (action === 'attach-file') {
    document.getElementById('composer-file-input')?.click();
  } else if (action === 'attach-image') {
    document.getElementById('composer-image-input')?.click();
  } else if (action === 'attach-screenshot') {
    void captureScreenshot();
  } else if (action === 'remove-attachment') {
    const index = Number(target.dataset.index);
    const list = composerAttachments();
    if (Number.isInteger(index) && index >= 0) list.splice(index, 1);
    renderComposerAttachments();
  } else if (action === 'submit-question') {
    void submitQuestion(id, { fromModal: Boolean(target.closest('#modal-fields')) });
  } else if (action === 'ob-next') {
    state.onboarding.step = 2;
    renderOnboarding();
  } else if (action === 'ob-back') {
    state.onboarding.step = 1;
    state.onboarding.test = null;
    renderOnboarding();
  } else if (action === 'ob-skip') {
    closeOnboarding(true);
    render();
  } else if (action === 'ob-template') {
    const template = ONBOARDING_TEMPLATES.find((item) => item.id === target.dataset.template);
    if (!template) return;
    const draft = readOnboardingDraft();
    draft.name = template.label;
    draft.baseUrl = template.baseUrl;
    draft.modelsText = template.models;
    state.onboarding.draft = draft;
    state.onboarding.test = null;
    renderOnboarding();
  } else if (action === 'ob-test') {
    void onboardingTest();
  } else if (action === 'ob-save') {
    void onboardingSave();
  } else if (action === 'ob-finish') {
    void onboardingFinish();
  } else if (action === 'provider-new') {
    state.providerDraft = providerDraftFrom();
    state.providerTest = null;
    renderSettingsPanel();
    setTimeout(() => document.getElementById('provider-name')?.focus(), 30);
  } else if (action === 'provider-edit') {
    const provider = (state.settings?.settings?.providers || []).find((item) => item.id === id);
    if (!provider) return;
    state.providerDraft = providerDraftFrom(provider);
    state.providerTest = null;
    renderSettingsPanel();
    setTimeout(() => document.getElementById('provider-base-url')?.focus(), 30);
  } else if (action === 'provider-cancel') {
    state.providerDraft = null;
    state.providerTest = null;
    renderSettingsPanel();
  } else if (action === 'provider-toggle-key') {
    const input = document.getElementById('provider-api-key');
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    target.textContent = show ? '隐藏' : '显示';
  } else if (action === 'provider-append-model') {
    const draft = readProviderDraftFromDom();
    const modelId = target.dataset.model || '';
    if (!modelId) return;
    if (!draft.models.some((model) => model.id === modelId)) {
      draft.models.push({
        id: modelId,
        name: modelId,
        vision: false,
        reasoning: false,
        contextWindow: 128000,
        maxOutputTokens: 8192,
      });
    }
    state.providerDraft = draft;
    renderSettingsPanel();
  } else if (action === 'provider-add-model-row') {
    const draft = readProviderDraftFromDom();
    const input = document.getElementById('provider-model-input');
    const modelId = String(input?.value || '').trim();
    if (!modelId) {
      showToast('先输入模型 ID');
      return;
    }
    if (!draft.models.some((model) => model.id === modelId)) {
      draft.models.push({
        id: modelId,
        name: modelId,
        vision: false,
        reasoning: false,
        contextWindow: 128000,
        maxOutputTokens: 8192,
      });
    }
    state.providerDraft = draft;
    renderSettingsPanel();
  } else if (action === 'provider-remove-model-row') {
    const draft = readProviderDraftFromDom();
    const index = Number(target.dataset.index);
    draft.models = draft.models.filter((_, modelIndex) => modelIndex !== index);
    state.providerDraft = draft;
    renderSettingsPanel();
  } else if (action === 'provider-refresh-capabilities') {
    void (async () => {
      const result = await apiSoft('/api/providers', { method: 'POST', body: JSON.stringify({ action: 'capabilities' }) });
      if (!result.ok) {
        showToast(`识别失败：${result.error || '未知错误'}`);
        return;
      }
      await reloadSettingsPanel();
      showToast(`已按模型网关重新识别，最大输出 ${Number(result.maxOutputTokens || 0).toLocaleString()} tokens`);
    })();
  } else if (action === 'toggle-provider-models') {
    const list = new Set(state.expandedProviders || []);
    if (list.has(id)) list.delete(id);
    else list.add(id);
    state.expandedProviders = [...list];
    renderSettingsPanel();
  } else if (action === 'provider-test') {
    void testProviderDraft();
  } else if (action === 'provider-save') {
    void saveProviderDraft();
  } else if (action === 'provider-delete') {
    void deleteProvider(id);
  } else if (action === 'provider-default') {
    const provider = (state.settings?.settings?.providers || []).find((item) => item.id === id);
    void setDefaultModel(id, provider?.models?.[0]?.id || '', provider?.name || id);
  } else if (action === 'provider-pick') {
    void setDefaultModel(id, target.dataset.model || '', target.dataset.model || '');
  } else if (action === 'save-model-advanced') {
    void saveModelAdvanced();
  } else if (action === 'restart-onboarding') {
    void startOnboarding({ force: true });
  } else if (action === 'pick-model') {
    void setDefaultModel(target.dataset.provider || '', target.dataset.model || '', target.dataset.name || target.dataset.model || '');
  } else if (action === 'expand-provider-models') {
    const list = target.parentElement?.querySelector('.provider-model-list');
    if (!list) return;
    list.hidden = !list.hidden;
    const chevron = target.querySelector('.provider-chevron');
    if (chevron) chevron.textContent = list.hidden ? '⌄' : '⌃';
  } else if (action === 'toggle-api-key') {
    const input = document.getElementById('settings-api-key');
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    target.textContent = show ? '隐藏' : '显示';
  } else if (action === 'toggle-model-advanced') {
    const panel = document.getElementById('model-advanced');
    if (!panel) return;
    panel.hidden = !panel.hidden;
    state.modelAdvancedOpen = !panel.hidden;
    const label = document.getElementById('model-advanced-label');
    if (label) label.textContent = panel.hidden ? '展开' : '收起';
  } else if (action === 'add-custom-provider') {
    const panel = document.getElementById('model-advanced');
    if (panel) panel.hidden = false;
    state.modelAdvancedOpen = true;
    const label = document.getElementById('model-advanced-label');
    if (label) label.textContent = '收起';
    const providerInput = document.getElementById('model-provider-input');
    const modelInput = document.getElementById('model-id-input');
    if (providerInput && !providerInput.value) providerInput.value = 'custom';
    if (providerInput) providerInput.focus();
    if (modelInput) modelInput.placeholder = '输入模型 ID，例如 deepseek-chat';
    document.getElementById('provider-editor')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  } else if (action === 'add-model-route') {
    const list = document.getElementById('model-routes');
    if (list) list.insertAdjacentHTML('beforeend', renderModelRouteRow({}, list.children.length));
  } else if (action === 'remove-model-route') {
    target.closest('[data-route-row]')?.remove();
  } else if (action === 'refresh-model-catalog') {
    loadModelCatalog();
  } else if (action === 'test-model-api') {
    testModelApi();
  } else if (action === 'test-channel') {
    testChannel(target.dataset.channel || '');
  } else if (action === 'preview-document') {
    openModal('document-preview', id);
  } else if (action === 'preview-memory') {
    openMemoryPreview(id);
  } else if (action === 'toggle-memory-archive') {
    if (state.memoryArchiveOpen) {
      state.memoryArchiveOpen = false;
      render();
    } else {
      api('/api/memories?includeArchived=1')
        .then((payload) => {
          state.memoryArchiveList = (payload.memories || []).filter((item) => item.status === 'archived');
          state.memoryArchiveOpen = true;
          render();
        })
        .catch((error) => showToast(`归档箱加载失败：${error.message}`));
    }
  } else if (action === 'undo-memory') {
    if (confirm('撤销到上一个版本？当前版本会保留在版本历史里。')) {
      api(`/api/memories/${encodeURIComponent(id)}/undo`, { method: 'POST' })
        .then((payload) => {
          applyServerState(payload.state);
          showToast(`已撤销到 v${payload.restoredVersion}`);
          render();
        })
        .catch((error) => showToast(`撤销失败：${error.message}`));
    }
  } else if (action === 'restore-memory') {
    api(`/api/memories/${encodeURIComponent(id)}/restore`, { method: 'POST' })
      .then((payload) => {
        applyServerState(payload.state);
        state.memoryArchiveList = (state.memoryArchiveList || []).filter((item) => item.id !== id);
        showToast('记忆已恢复');
        render();
      })
      .catch((error) => showToast(`恢复失败：${error.message}`));
  } else if (action === 'run-task') {
    runTaskNow(id);
  } else if (action === 'toggle-autonomy') {
    toggleAutonomy();
  } else if (action === 'set-concurrency') {
    setConcurrency(value);
  } else if (action === 'edit-task') {
    openModal('task-edit', id);
  } else if (action === 'expert-detail') {
    openModal('expert-detail', id);
  } else if (action === 'dataset-fields') {
    openModal('dataset-fields', id);
  } else if (action === 'chat-expert') {
    closeModal();
    state.chat = `employee:${id}`;
    state.view = 'employees';
    render();
    scrollChat();
    showToast(`已切换到 ${employee(id)?.name || '专家'} 的对话`);
  } else if (action === 'refresh-project-files') {
    state.projectFiles = null;
    state.projectFilesLoading = false;
    render();
  } else if (action === 'approve-write') {
    const allowSimilar = Boolean(document.querySelector(`[data-approval-similar="${id}"]`)?.checked);
    decideApproval(id, 'approve', '', allowSimilar);
  } else if (action === 'reject-write') {
    openModal('reject-approval', id);
  } else if (action === 'project-snapshot') {
    takeProjectSnapshot(id);
  } else if (action === 'project-archive-filter') {
    state.projectShowArchived = value === 'archived';
    render();
  } else if (action === 'audit-scope') {
    void openCompanyAudit(value);
  } else if (action === 'company-audit') {
    void openCompanyAudit();
  } else if (action === 'archive-project') {
    if (!confirm('归档后项目会从进行中列表移出，不会删除数据。确定归档？')) return;
    void updateProjectArchive(id, true);
  } else if (action === 'unarchive-project') {
    void updateProjectArchive(id, false);
  } else if (action === 'delete-project') {
    if (!confirm('删除项目记录不可恢复；工作区文件默认保留。确定删除？')) return;
    void deleteProjectRecord(id);
  } else if (action === 'project-snapshots') {
    openProjectSnapshots(id);
  } else if (action === 'project-doc-task') {
    const kind = target.dataset.kind === 'info' ? 'info' : 'plan';
    const projectId = target.dataset.id || '';
    void (async () => {
      try {
        const payload = await api('/api/projects/doc-task', { method: 'POST', body: JSON.stringify({ projectId, kind }) });
        if (payload.state) applyServerState(payload.state);
        showToast(kind === 'plan' ? '秘书已接到项目方案任务' : '秘书已接到项目信息任务', 'ok');
        render();
      } catch (error) {
        showToast(error.message, 'warn');
      }
    })();
  } else if (action === 'edit-project') {
    openModal('project-edit', id);
  } else if (action === 'open-outbound') {
    openModal('outbound', id);
  } else if (action === 'rollback-snapshot') {
    openRollbackModal(projectId, id, label);
  } else if (action === 'open-project') {
    state.projectDetailId = id;
    state.projectTab = 'overview';
    state.view = 'project-detail';
    render();
  } else if (action === 'back-projects') {
    state.view = 'projects';
    render();
  } else if (action === 'open-project-chat') {
    state.chat = `project:${id}`;
    state.filterProject = id;
    showToast('已切换到项目群；在底部对话框继续沟通');
  } else if (action === 'project-tab') {
    state.projectTab = tab || 'overview';
    renderProjectDetailRefresh();
  } else if (action === 'open-project-link') {
    const url = target.dataset.url || '';
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  } else if (action === 'copy-project-link') {
    const url = target.dataset.url || '';
    if (!url) return;
    void navigator.clipboard?.writeText(url).then(() => showToast('地址已复制')).catch(() => showToast(url));
  } else if (action === 'project-check') {
    void checkProjectHealth(id);
  } else if (action === 'project-milestone-toggle') {
    void projectDetailAction(id, 'milestone-toggle', { id });
  } else if (action === 'project-milestone-add') {
    const name = document.getElementById('project-ms-name')?.value.trim() || '';
    const date = document.getElementById('project-ms-date')?.value || '';
    if (!name) return showToast('先填里程碑名称');
    void projectDetailAction(id, 'milestone-add', { name, date });
  } else if (action === 'project-milestone-delete') {
    void projectDetailAction(id, 'milestone-delete', { id });
  } else if (action === 'project-release-delete') {
    void projectDetailAction(id, 'release-delete', { id });
  } else if (action === 'project-revenue-delete') {
    void projectDetailAction(id, 'revenue-delete', { id });
  } else if (action === 'project-cost-delete') {
    void projectDetailAction(id, 'cost-delete', { id });
  } else if (action === 'project-cost-renew') {
    void projectDetailAction(id, 'cost-renew', { id });
  } else if (action === 'project-asset-delete') {
    void projectDetailAction(id, 'asset-delete', { id });
  } else if (action === 'project-revenue-new') {
    openModal('project-revenue', id);
  } else if (action === 'project-cost-new') {
    openModal('project-cost', id);
  } else if (action === 'project-release-new') {
    openModal('project-release', id);
  } else if (action === 'project-asset-new') {
    openModal('project-asset', id);
  } else if (action === 'open-employee') {
    state.chat = `employee:${id}`;
    render();
    showToast('已切换到底部对话');
  } else if (action === 'resolve-decision') {
    const selectedKey = document.querySelector(`input[name="decision-${id}"]:checked`)?.value || '';
    resolveDecision(id, result, selectedKey);
  } else if (action === 'task-archive-filter') {
    state.taskShowArchived = value === 'archived';
    render();
  } else if (action === 'archive-task') {
    void updateTaskArchive(id, true);
  } else if (action === 'unarchive-task') {
    void updateTaskArchive(id, false);
  } else if (action === 'archive-processed-tasks') {
    void archiveProcessedTasks();
  } else if (action === 'toggle-task') {
    const wasDone = state.taskDone.has(id);
    if (wasDone) state.taskDone.delete(id);
    else state.taskDone.add(id);
    render();
    showToast(wasDone ? '任务已恢复' : '任务已完成');
    api('/api/tasks/toggle', { method: 'POST', body: JSON.stringify({ id }) })
      .then((payload) => {
        applyServerState(payload.state);
        render();
      })
      .catch((error) => {
        if (wasDone) state.taskDone.add(id);
        else state.taskDone.delete(id);
        render();
        showToast(`任务保存失败：${error.message}`);
      });
  } else if (action === 'filter-deliverables') {
    state.filterProject = id;
    render();
  } else if (action === 'filter-deliverables-status') {
    state.deliverableFilter = id || 'active';
    render();
  } else if (action === 'archive-deliverable') {
    void setDeliverableArchived(id, true);
  } else if (action === 'unarchive-deliverable') {
    void setDeliverableArchived(id, false);
  } else if (action === 'archive-processed-deliverables') {
    void archiveProcessedDeliverables();
  } else if (action === 'deliverable-versions') {
    openDeliverableVersions(target.dataset.task || '', target.dataset.name || '');
  } else if (action === 'preview-deliverable') {
    previewDeliverable(id);
  } else if (action === 'preview-open') {
    openPreviewItem(id);
  } else if (action === 'preview-reload-console') {
    const frame = document.querySelector('.previewdesk-console-frame');
    if (frame) frame.src = frame.src;
  } else if (action === 'preview-favorite') {
    togglePreviewFavorite(id);
  } else if (action === 'preview-clear-history') {
    clearPreviewHistory();
  } else if (action === 'approve-deliverable') {
    reviewDeliverable(id, 'approve');
  } else if (action === 'reject-deliverable') {
    openModal('reject-deliverable', id);
  } else if (action === 'collect-deliverable') {
    openCollectDeliverableModal(id);
  } else if (action === 'task-from-message') {
    openModal('task-from-message', id);
  } else if (action === 'open-task-source') {
    openTaskSource(id);
  } else if (action === 'new-project') {
    openModal('project');
  } else if (action === 'new-employee') {
    openModal('employee');
  } else if (action === 'hire-employee') {
    openModal('hire-employee');
  } else if (action === 'edit-employee') {
    openModal('employee-edit', id);
  } else if (action === 'handoff-task') {
    openModal('handoff', id);
  } else if (action === 'revoke-mandate') {
    if (!confirm('撤销授权后，这个任务不能开工；需要时再点“重新授权”。确定撤销？')) return;
    void updateTaskMandate(id, 'revoke');
  } else if (action === 'grant-mandate') {
    void updateTaskMandate(id, 'grant');
  } else if (action === 'new-task') {
    openModal('task');
  } else if (action === 'close-modal') {
    closeModal();
  } else if (action === 'new-deliverable') {
    openModal('upload-deliverable');
  } else if (action === 'new-memory') {
    openModal('new-memory');
  } else if (action === 'new-device') {
    openModal('device-edit');
  } else if (action === 'edit-device') {
    openModal('device-edit', id);
  } else if (action === 'delete-device') {
    if (!confirm('删除这台设备？设备资料会从公司资产里移除。')) return;
    void deleteDevice(id);
  } else if (action === 'new-tool') {
    openModal('tool-edit');
  } else if (action === 'edit-tool') {
    openModal('tool-edit', id);
  } else if (action === 'assign-tool') {
    openModal('tool-assign', id);
  } else if (action === 'new-skill') {
    openModal('skill-edit');
  } else if (action === 'edit-skill') {
    openModal('skill-edit', id);
  } else if (action === 'assign-skill') {
    openModal('skill-assign', id);
  } else if (action === 'new-expert') {
    openModal('expert-edit');
  } else if (action === 'edit-expert') {
    openModal('expert-edit', id);
  } else if (action === 'assign-expert') {
    openModal('expert-assign', id);
  } else if (action === 'import-workbuddy-experts') {
    openModal('expert-import');
  } else if (action === 'export-finance') {
    const f = state.ledgerFilter || {};
    const params = new URLSearchParams({ type: 'finance' });
    if (f.project) params.set('project', f.project);
    window.location.href = `/api/ledger/export?${params.toString()}`;
  } else if (action === 'export-ledger') {
    const f = state.ledgerFilter || {};
    const dates = ledgerRangeDates();
    const params = new URLSearchParams();
    if (dates.from) params.set('from', dates.from);
    if (dates.to) params.set('to', dates.to);
    if (f.employee) params.set('employee', f.employee);
    if (f.project) params.set('project', f.project);
    if (f.model) params.set('model', f.model);
    if (f.source) params.set('source', f.source);
    window.location.href = `/api/ledger/export?${params.toString()}`;
  }
});

document.querySelectorAll('.nav-item[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    state.view = button.dataset.view;
    if (ASSET_VIEWS.includes(state.view)) state.assetsOpen = true;
    if (OPS_VIEWS.includes(state.view)) state.opsOpen = true;
    state.search = '';
    state.filterProject = 'all';
    document.body.classList.remove('mobile-nav-open');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.hidden = true;
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    render();
    if (state.view === 'org') {
      if (state.orgTab === 'matrix') loadOrgData();
      else loadPerformance();
    }
    if (state.view === 'teams') loadTeams();
    if (state.view === 'audit') loadAudit();
    if (state.view === 'notifications') loadNotifications();
    if (state.view === 'workstations') loadWorkstations();
    if (state.view === 'ledger') loadLedger();
    if (state.view === 'gateway') {
      loadGateway();
      loadGatewayModels();
    }
  });
});

document.querySelectorAll('.mobile-nav-item[data-mobile-view]').forEach((button) => {
  button.addEventListener('click', () => {
    state.view = button.dataset.mobileView;
    state.search = '';
    state.filterProject = 'all';
    document.body.classList.remove('mobile-chat-open');
    render();
  });
});

document.querySelectorAll('.panel-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    state.panel = tab.dataset.panel;
    renderPanel();
    if (state.panel === 'servers') loadServers();
    if (state.panel === 'employees') loadEmployeeStatuses();
  });
});

document.addEventListener('input', (event) => {
  if (event.target.id !== 'model-picker-search') return;
  const query = event.target.value.trim().toLowerCase();
  document.querySelectorAll('#model-picker .model-picker-group').forEach((group) => {
    let visible = 0;
    group.querySelectorAll('.model-option').forEach((option) => {
      const text = option.textContent.toLowerCase();
      const matched = !query || text.includes(query);
      option.hidden = !matched;
      if (matched) visible += 1;
    });
    group.hidden = visible === 0;
  });
});

document.addEventListener('change', (event) => {
  const scope = event.target.closest('[data-role="scope"]');
  if (!scope) return;
  const row = scope.closest('[data-route-row]');
  const match = row?.querySelector('[data-role="match"]');
  if (match) match.innerHTML = routeMatchOptions(scope.value, '');
});

document.addEventListener('change', (event) => {
  const field = event.target.closest('[data-gateway-model]');
  if (field) {
    const model = (state.gatewayModels || []).find((item) => item.id === field.dataset.id);
    if (model) {
      const key = field.dataset.gatewayModel;
      model[key] = key === 'tier' ? field.value : field.checked;
    }
  }
  if (event.target.id === 'gateway-import-file') {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    void (async () => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const payload = await api('/api/gateway/import', { method: 'POST', body: JSON.stringify(parsed) });
        state.gateway = payload.gateway;
        render();
        showToast(`已导入 ${payload.imported} 个账号${payload.failed ? `，失败 ${payload.failed} 个` : ''}`, payload.imported ? 'ok' : 'warn');
      } catch (error) {
        showToast(`导入失败：${error.message}`, 'warn');
      }
    })();
  }
});

document.getElementById('search-input')?.addEventListener('input', (event) => {
  const value = event.target.value;
  state.search = value;
  if (value.trim()) {
    state.view = 'search';
    state.searchResults = null;
    scheduleServerSearch(value);
  } else if (state.view === 'search') {
    state.view = 'deliverables';
    state.searchResults = null;
  }
  render();
});

document.getElementById('dock-project')?.addEventListener('change', (event) => {
  const value = event.target.value;
  if (value) {
    state.chat = `project:${value}`;
  } else {
    const employeeValue = document.getElementById('dock-employee')?.value || 'e-jiang';
    state.chat = `employee:${employeeValue}`;
  }
  renderChatDock();
});

document.getElementById('dock-employee')?.addEventListener('change', (event) => {
  const value = event.target.value;
  if (value) {
    state.chat = `employee:${value}`;
  } else {
    const projectValue = document.getElementById('dock-project')?.value;
    state.chat = projectValue ? `project:${projectValue}` : 'employee:e-jiang';
  }
  renderChatDock();
});

document.getElementById('dock-toggle')?.addEventListener('click', () => {
  state.dockCollapsed = !state.dockCollapsed;
  applyDockHeight();
  if (!state.dockCollapsed) scrollChat();
});

window.addEventListener('resize', () => {
  const max = Math.max(220, Math.round(window.innerHeight * 0.7));
  if (state.dockHeight > max) {
    state.dockHeight = max;
    applyDockHeight();
  }
});

document.getElementById('modal-form')?.addEventListener('submit', submitModal);
document.addEventListener('change', (event) => {
  const input = event.target.closest('input[name^="decision-"]');
  if (!input) return;
  const group = input.closest('.options');
  if (!group) return;
  group.querySelectorAll('.option.selectable').forEach((node) => node.classList.remove('selected'));
  input.closest('.option.selectable')?.classList.add('selected');
});

let chatScrollSaveTimer = null;
document.getElementById('chat-stream')?.addEventListener('scroll', () => {
  // 平滑回到底部的动画期间不要重新弹出按钮
  if (Date.now() < chatJumpingUntil) return;
  const stream = document.getElementById('chat-stream');
  updateChatJump(!chatNearBottom(stream));
  clearTimeout(chatScrollSaveTimer);
  chatScrollSaveTimer = setTimeout(() => saveChatScrollPosition(state.chat), 180);
});
document.getElementById('modal')?.addEventListener('click', (event) => {
  if (event.target.id === 'modal') closeModal();
});

/* ---------------- init ---------------- */

async function boot() {
  state.chatScrollPositions = readStoredChatScroll();
  hydrateIcons(document);
  bindComposer();
  initDockResize();
  applyDockHeight();
  loadPreviewStores();

  try {
    const payload = await api('/api/state');
    applyServerState(payload.state);
  } catch (error) {
    console.warn('读取本地数据失败，使用页面内置种子数据', error);
  }

  try {
    const savedChat = localStorage.getItem('one-company-chat-target') || '';
    if (savedChat.startsWith('employee:') && state.data.employees.some((item) => `employee:${item.id}` === savedChat)) {
      state.chat = savedChat;
    } else if (savedChat.startsWith('project:') && state.data.projects.some((item) => `project:${item.id}` === savedChat)) {
      state.chat = savedChat;
    }
  } catch {
    /* ignore */
  }

  try {
    const settingsPayload = await api('/api/settings');
    state.settings = settingsPayload;
    if (!settingsPayload.settings?.onboardingCompleted) {
      if (settingsPayload.settings?.configured) {
        // 老用户已配置过模型：直接视为完成，不再打扰
        await apiSoft('/api/onboarding', { method: 'POST', body: JSON.stringify({ completed: true }) });
      } else {
        let dismissed = '';
        try {
          dismissed = localStorage.getItem('one-company-onboarding-later') || '';
        } catch {
          dismissed = '';
        }
        if (!dismissed) startOnboarding();
      }
    }
  } catch (error) {
    console.warn('读取模型设置失败', error);
  }

  try {
    const saved = Number(localStorage.getItem('one-company-dock-height'));
    if (Number.isFinite(saved) && saved >= 120) {
      state.dockHeight = Math.min(saved, Math.max(220, Math.round(window.innerHeight * 0.7)));
    }
  } catch {
    /* ignore */
  }

  populateDockSelectors();
  renderSidebarProjects();
  void loadAppVersion();
  render();
  void loadComposerModels();
  void restorePreviewDesk();
  // 页面一启动就挂上多路复用通道，员工提问/同事回复/审批不依赖「先发一条消息」才连上
  void connectMux().catch(() => {});

  void Promise.allSettled([
    loadP1Data(),
    loadServers(),
    loadEmployeeStatuses(),
    loadTeams(),
    loadNotifications(),
    loadLedger(),
  ]).then(() => {
    populateDockSelectors();
    renderSidebarProjects();
    render();
  });
  setInterval(() => {
    if (state.view === 'tasks') refreshTaskState();
  }, 3000);
  setInterval(() => {
    if (state.view === 'inbox') refreshInboxState();
  }, 3000);
  setInterval(() => {
    if (state.panel === 'servers') loadServers();
  }, 5000);
  setInterval(() => {
    if (state.view === 'datacenter') loadServers();
  }, 15000);
  setInterval(() => {
    if (state.panel === 'employees' || state.view === 'employees') loadEmployeeStatuses();
  }, 3000);
  setInterval(() => {
    loadNotifications();
  }, 5000);
}

document.addEventListener('input', (event) => {
  if (event.target?.id !== 'project-notes') return;
  const status = document.getElementById('project-notes-status');
  if (status) status.textContent = '正在保存…';
  clearTimeout(state.projectNotesTimer);
  state.projectNotesTimer = setTimeout(async () => {
    try {
      const result = await api('/api/projects/detail', {
        method: 'POST',
        body: JSON.stringify({ projectId: state.projectDetailId, action: 'notes-save', notes: event.target.value }),
      });
      if (result.state) applyServerState(result.state);
      if (status) status.textContent = `已保存 ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`;
    } catch (error) {
      if (status) status.textContent = `保存失败：${error.message}`;
    }
  }, 700);
});

document.addEventListener('keydown', (event) => {
  if (event.altKey && event.shiftKey && String(event.key || '').toLowerCase() === 'a') {
    event.preventDefault();
    void captureScreenshot();
  }
});

document.addEventListener('change', (event) => {
  if (event.target?.id === 'backup-restore-file') {
    const file = event.target.files?.[0];
    event.target.value = '';
    void restoreBackupFromFile(file);
  }
});

boot();


