let careers = [];
let activeCategory = 'all';
let searchQuery = '';
let activeDetailTab = 'overview';
let activeCompareSlot = 'a';
let isFirstRender = true;

const CATEGORY_LABELS = {
  medical: 'Medical',
  paramedical: 'Paramedical',
  life_sciences: 'Life Sciences',
  engineering: 'Engineering',
  commerce: 'Commerce',
  law: 'Law',
  design: 'Design',
  management: 'Management'
};

const CATEGORY_ICONS = {
  medical: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
  engineering: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"></path></svg>',
  commerce: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
  law: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M8 3h8M4 7h6M14 7h6"></path><path d="M2 7l3 7a3.5 3.5 0 0 0 7 0L9 7"></path><path d="M15 7l3 7a3.5 3.5 0 0 0 7 0L22 7"></path></svg>',
  design: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-1-.5-2-2-2h-3a2 2 0 0 1-2-2c0-.8.3-1.3 1-2a2 2 0 0 0-1-3.7A9.9 9.9 0 0 0 12 2z"></path><circle cx="7.5" cy="10.5" r="1"></circle><circle cx="7" cy="15" r="1"></circle><circle cx="11" cy="17.5" r="1"></circle></svg>',
  management: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
  paramedical: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M8 12h8"></path></svg>',
  life_sciences: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2-9 4 18 4-18 2 9h4"></path></svg>',

};
const SNAPSHOT_ICONS = {
  salary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3"></ellipse><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"></path><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path></svg>',
  stress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 12 7 12 9 6 13 18 16 12 22 12"></polyline></svg>',
  worklife: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"></line><line x1="4" y1="7" x2="20" y2="7"></line><circle cx="5.5" cy="12" r="3.5"></circle><circle cx="18.5" cy="12" r="3.5"></circle></svg>',
  study: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5c2-1.3 5-2 8-1v14c-3-1-6-.3-8 1V5z"></path><path d="M22 5c-2-1.3-5-2-8-1v14c3-1 6-.3 8 1V5z"></path></svg>',
  competition: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"></path><path d="M7 5H4a1 1 0 0 0-1 1c0 2.5 1.8 4.5 4 4.8"></path><path d="M17 5h3a1 1 0 0 1 1 1c0 2.5-1.8 4.5-4 4.8"></path><path d="M12 14v3"></path><path d="M9 21h6"></path><path d="M9.5 17h5l.5 4h-6l.5-4z"></path></svg>',
  abroad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><line x1="3" y1="12" x2="21" y2="12"></line><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"></path></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 14"></polyline></svg>',
  job: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>'
};
const TAB_ICONS = {
  overview: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l3 3v15H6z"></path><path d="M15 3v3h3"></path><line x1="9" y1="11" x2="15" y2="11"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
  realities: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  fit: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="8.5 12.5 11 15 16 9"></polyline></svg>',
  pay: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3"></ellipse><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"></path><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path></svg>',
  experiences: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
  faq: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>'
};

const COMPARE_ICONS = {
  glance: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
  snapshot: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
  salary: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"></path><path d="M3 7l3-3h12"></path><circle cx="17" cy="12" r="1"></circle></svg>',
  warning: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  thrives: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="8 12 11 15 16 9"></polyline></svg>',
  struggle: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>',
  target: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1"></circle></svg>'
};

const WINNER_BADGE = '<svg class="comp-winner-icon" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

const METRIC_DIRECTION = {
  stress: 'lower', competition: 'lower', salary_potential: 'higher', study_difficulty: 'lower',
  work_life_balance: 'higher', job_availability: 'higher', abroad_prospects: 'higher',
  duration: 'lower'
};

function getMid(range) {
  if (!range || (!range.min && !range.max)) return 0;
  if (!range.min) return range.max;
  if (!range.max) return range.min;
  return (range.min + range.max) / 2;
}

function calculateSalaryPercentage(salaryParsed) {
  if (!salaryParsed) return { entry: 20, mid: 40, senior: 100 };
  const e = getMid(salaryParsed.entry);
  const m = getMid(salaryParsed.mid);
  const s = getMid(salaryParsed.senior);
  const max = Math.max(e, m, s, 1); 
  return {
    entry: e ? Math.max(20, (e / max) * 100) : 20,
    mid: m ? Math.max(40, (m / max) * 100) : 40,
    senior: s ? Math.max(60, (s / max) * 100) : 100
  };
}

function pickWinner(valA, valB, direction) {
  if (valA == null || valB == null || valA === valB) return null;
  if (direction === 'higher') return valA > valB ? 'a' : 'b';
  return valA < valB ? 'a' : 'b';
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function splitBullets(text) {
  if (!text) return [];
  const sentences = text.split(/(?<=[a-zA-Z\)])\.\s+(?=[A-Z])/).map(s => s.trim()).filter(Boolean);
  return sentences.map(s => s.endsWith('.') ? s : s + '.');
}

function bulletCell(text) {
  if (!text) return '—';
  const parts = splitBullets(text);
  if (parts.length <= 1) return text || '—';
  return `<ul class="comp-bullets">${parts.map(p => `<li>${p}</li>`).join('')}</ul>`;
}

function salaryCell(str) {
  if (!str) return '—';
  const [amountRaw, restRaw] = str.split('(');
  const note = restRaw ? restRaw.replace(')', '').trim() : '';
    return `
    <span class="comp-salary-amount">${amountRaw.trim()}</span>
    ${note ? `<span class="comp-salary-note">${note}</span>` : ''}
  `;
}

function starCell(value, metricKey = '') {
  if (!value) return '—';
  let colorClass = '';
  if (metricKey) {
    const dir = METRIC_DIRECTION[metricKey];
    if (dir === 'lower') {
      colorClass = value >= 4 ? 'stars-negative' : (value <= 2 ? 'stars-positive' : '');
    } else if (dir === 'higher') {
      colorClass = value >= 4 ? 'stars-positive' : (value <= 2 ? 'stars-negative' : '');
    }
  }
  return renderStars(value, colorClass);
}

const LOGOMARK = '<svg class="logomark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="4" x2="12" y2="20"></line><line x1="5.07" y1="8" x2="18.93" y2="16"></line><line x1="18.93" y1="8" x2="5.07" y2="16"></line></svg>';

const ALIASES = {
  mbbs: ['doctor', 'medicine', 'medical'],
  bds: ['dentist', 'dental', 'dentistry'],
  pharmacy: ['pharmacist', 'bpharm', 'pharma'],
  paramedical_nursing: ['nurse', 'nursing'],
  paramedical_physiotherapy: ['physio', 'physiotherapist', 'bpt', 'physical therapy'],
  radiology_tech: ['xray', 'x-ray', 'imaging', 'radiographer'],
  zoology: ['animal biology', 'wildlife'],
  botany: ['plant biology', 'plant science'],
  cs_engineering: ['cs', 'cse', 'computer science', 'software engineering', 'btech cs'],
  bca_mca: ['bca', 'mca', 'computer applications'],
  ca: ['chartered accountant', 'accounting'],
  bcom: ['commerce', 'bachelor of commerce'],
  bba: ['business administration', 'management'],
  law: ['lawyer', 'legal', 'llb'],
  design: ['ui ux', 'graphic design', 'nid', 'nift', 'fashion'],
  mba: ['master of business administration', 'management']
};

const DETAIL_TABS = ['overview', 'realities', 'fit', 'pay', 'experiences', 'faq'];

function getThemeIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark
    ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
    : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}


function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('karriere-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.innerHTML = getThemeIcon();
}

function initTheme() {
  const saved = localStorage.getItem('karriere-theme');
  setTheme(saved || 'dark');
}


function renderStars(value, colorClass = '') {
  if (!value) return `<span class="metric-thin-bar"><span class="metric-thin-track"></span></span>`;
  const pct = (value / 5) * 100;
  let label = '';
  if (value >= 4) label = ' <span class="metric-a11y-label">(High)</span>';
  else if (value <= 2) label = ' <span class="metric-a11y-label">(Low)</span>';
  else label = ' <span class="metric-a11y-label">(Avg)</span>';

  return `
    <span class="metric-thin-bar">
      <span class="metric-thin-label">${value}/5${label}</span>
      <span class="metric-thin-track"><span class="metric-thin-fill ${colorClass}" style="width: ${pct}%;"></span></span>
    </span>`;
}

function truncateText(str, maxLen) {
  if (!str || str.length <= maxLen) return str;
  let cut = str.lastIndexOf(' ', maxLen);
  if (cut < 50) cut = maxLen;
  // Strip any trailing incomplete HTML entity (e.g. &amp or &#39)
  let result = str.slice(0, cut).replace(/&[^;]{0,6}$/, '');
  return result + '\u2026';
}

function getSalaryContext(entryParsed) {
  if (!entryParsed || (!entryParsed.min && !entryParsed.max)) return null;
  const annual = getMid(entryParsed);
  if (!annual) return null;
  const monthly = annual / 12;
  if (monthly < 50000) return 'Enough for basics in a Tier-2 city. Will be tight in metros without family support.';
  if (monthly < 150000) return 'A comfortable independent living in most Indian cities.';
  return 'Well above average. Financially comfortable from day one.';
}

function renderQFMeter(value, colorClass) {
  if (!value) return `<span class="metric-thin-bar"><span class="metric-thin-track"></span></span>`;
  const pct = (value / 5) * 100;
  return `
    <span class="metric-thin-bar">
      <span class="metric-thin-label">${value}/5</span>
      <span class="metric-thin-track"><span class="metric-thin-fill ${colorClass}" style="width: ${pct}%;"></span></span>
    </span>`;
}

function renderMeter(value, type) {
  const label = type === 'stress' ? 'Stress' : 'Competition';
  let segs = '';
  for (let i = 1; i <= 5; i++) segs += `<span class="meter-seg ${i <= value ? 'filled' : ''}"></span>`;
  return `<span class="metric-meter metric-${type}"><span class="metric-meter-label">${label}</span><span class="meter-bar">${segs}</span></span>`;
}

function animateSalaryBars() {
  const bars = document.querySelectorAll('.salary-bar-fill');
  bars.forEach(el => { el.style.width = '0%'; });
  if (bars[0]) bars[0].offsetHeight; // Forces one sync layout reflow
  bars.forEach(el => { el.style.width = `${el.dataset.target}%`; });
}


async function loadCareers() {
  if (careers.length) return true;
  try {
    const res = await fetch('careers.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const rawData = await res.json();
    
    // Deep Sanitize: Recursively escapes HTML in all strings to prevent XSS
    const sanitize = (obj) => {
      if (typeof obj === 'string') return escapeHtml(obj);
      if (Array.isArray(obj)) return obj.map(sanitize);
      if (obj !== null && typeof obj === 'object') {
        // Freeze individual objects recursively
        return Object.freeze(Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitize(v)])));
      }
      return obj;
    };
    
    // Apply sanitization and freeze the main array
    careers = Object.freeze(sanitize(rawData.careers));
    
    return true;
    
  } catch (err) {
    document.getElementById('view').innerHTML = `
      <div class="wrap" style="text-align:center;padding-top:80px;">
        <h2>Couldn't load career data</h2>
        <p style="color:var(--ink-soft);margin-top:12px;">${err.message}. Please check your connection and refresh.</p>
        <button onclick="location.reload()" style="margin-top:20px;padding:10px 24px;background:var(--amber);color:#fff;border:none;border-radius:8px;cursor:pointer;">Try again</button>
      </div>`;
    return false;
  }
}

function formatEntrySalary(entry) {
  if (!entry) return null;
  // Take the first clause before any parenthetical detail, then pull the first
  // concrete figure and its unit. This is a hard floor number, not a guess —
  // it only works cleanly because each career's entry salary now states its
  // starting figure with the unit attached to it directly.
  const firstSegment = entry.split('(')[0].trim();
  const numMatch = firstSegment.match(/₹[\d,.]+/);
  if (!numMatch) return null;
  const unitMatch = firstSegment.match(/\/month|LPA|lakh|crore/i);
  const unitText = unitMatch ? (unitMatch[0].startsWith('/') ? unitMatch[0] : ' ' + unitMatch[0]) : '';
  return `From ${numMatch[0]}${unitText}`;
}

// Automatically detect if hosted on GitHub Pages (subdirectory) vs Custom Domain
const BASE = window.location.hostname.includes('github.io') ? '/karriere' : '';

function updateSearchUrl() {
  const params = new URLSearchParams();
  if (activeCategory !== 'all') params.set('filter', activeCategory);
  if (searchQuery.trim()) params.set('q', searchQuery.trim());
  const qs = params.toString();
  const newUrl = qs ? `${BASE}/?${qs}` : `${BASE}/`;
  history.replaceState(null, '', newUrl);
}

function navigate(path) {
  if (path.startsWith('compare=')) {
    const [a, b] = path.replace('compare=', '').split(',');
    const qs = [a && `id1=${a}`, b && `id2=${b}`].filter(Boolean).join('&');
    history.pushState(null, '', qs ? `${BASE}/compare?${qs}` : `${BASE}/compare`);
  } else if (path) {
    history.pushState(null, '', `${BASE}/${path}`);
  } else {
    history.pushState(null, '', `${BASE}/`);
  }
  render(true);
}

function getFilteredCareers() {
  let list = activeCategory === 'all' ? careers : careers.filter(c => c.category === activeCategory);
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    const scoredList = [];
    
    for (const c of list) {
      let score = 0;
      
      const n = c.name?.toLowerCase() || '';
      if (n === q) score += 100;
      else if (n.startsWith(q)) score += 50;
      else if (n.includes(q)) score += 30;
      
      if ((c.tags || []).some(t => t?.toLowerCase().includes(q))) score += 20;
      if ((ALIASES[c.id] || []).some(a => a.toLowerCase().includes(q))) score += 20;
      if (c.tagline?.toLowerCase().includes(q)) score += 10;
      
      const bodyHit = 
        c.overview?.toLowerCase().includes(q) ||
        (c.what_nobody_tells_you || []).some(p => p?.toLowerCase().includes(q)) ||
        (c.why_people_love_it || []).some(p => p?.toLowerCase().includes(q)) ||
        (c.who_thrives || []).some(p => p?.toLowerCase().includes(q)) ||
        (c.who_regrets_it || []).some(p => p?.toLowerCase().includes(q)) ||
        (c.choose_if || []).some(p => p?.toLowerCase().includes(q)) ||
        (c.avoid_if || []).some(p => p?.toLowerCase().includes(q)) ||
        (c.career_paths || []).some(p => p.name?.toLowerCase().includes(q) || p.explanation?.toLowerCase().includes(q)) ||
        (c.faq || []).some(f => f.question?.toLowerCase().includes(q) || f.answer?.toLowerCase().includes(q));
        
      if (bodyHit) score += 1;
      
      if (score > 0) scoredList.push({ c, score });
    }
    
    list = scoredList.sort((a, b) => b.score - a.score).map(i => i.c);
  }
  return list;
}


function renderListView() {
  const cats = [...new Set(careers.map(c => c.category))];
  const filtered = getFilteredCareers();


  const filterButtons = `<button class="filter-btn ${activeCategory === 'all' ? 'active' : ''}" data-cat="all" aria-pressed="${activeCategory === 'all'}">All</button>` +
    cats.map(cat => `<button class="filter-btn ${activeCategory === cat ? 'active' : ''}" data-cat="${cat}" aria-pressed="${activeCategory === cat}">${CATEGORY_LABELS[cat] || cat}</button>`).join('');

  const listHtml = filtered.length ? filtered.map(c => {
    const m = c.metrics || {};
    return `
    <button class="career-entry" data-id="${c.id}">
      <div class="entry-tag"><span class="entry-icon">${CATEGORY_ICONS[c.category] || '•'}</span>${CATEGORY_LABELS[c.category] || c.category}</div>
      <div class="entry-main">
        <div class="entry-name">${c.name}</div>
        <div class="entry-tagline">${c.tagline}</div>
        <div class="entry-metrics">
          ${c.salary && c.salary.entry ? `<span class="metric-chip metric-salary">${formatEntrySalary(c.salary.entry)}</span>` : ''}
          ${m.duration ? `<span class="metric-chip metric-duration">${SNAPSHOT_ICONS.clock} ${m.duration}</span>` : ''}
          ${m.stress ? renderMeter(m.stress, 'stress') : ''}
          ${m.competition ? renderMeter(m.competition, 'competition') : ''}
        </div>
      </div>
      <div class="entry-arrow">→</div>
    </button>
  `;
  }).join('') : `
    <div class="no-results">
      <p style="font-size:16px;font-weight:600;margin-bottom:8px;">No careers match "${escapeHtml(searchQuery)}"</p>
      <p style="font-size:14px;color:var(--ink-soft);margin-bottom:16px;">Try searching by keywords like "doctor", "lawyer", "high salary", or "stress-free".</p>
      <button class="filter-btn active" onclick="searchQuery=''; render(false);" style="padding:8px 16px;">Clear search filter</button>
    </div>`;

  return `
    <div class="wrap">
            <div class="masthead" style="display:flex;align-items:center;justify-content:space-between;">
        <button class="wordmark">${LOGOMARK}<span>Karriere</span></button>
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">${getThemeIcon()}</button>
          
        </div>
      </div>
      <div class="dateline">
        <span>${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <span>The unfiltered career file</span>
      </div>
      <div class="hero">
        <div class="hero-main">
          <div class="hero-eyebrow">Before you choose</div>
          <h1>What career counsellors won't tell a 17-year-old.</h1>
          <p>Forget the college placement brochures. We break down the actual entry barriers, the real money you make on day one, and the hidden struggles nobody warns you about until you are already three years into a degree.</p>
          <div class="trust-row">
            <span class="trust-item"><span class="trust-check">✓</span>${careers.length} careers covered</span>
            <span class="trust-item"><span class="trust-check">✓</span>No fake placement stats</span>
            <span class="trust-item"><span class="trust-check">✓</span>Real Entry Barriers</span>
            <span class="trust-item"><span class="trust-check">✓</span>Sourced from real professionals (and Reddit)</span>
          </div>
          <div class="hero-actions">
            <div class="hero-search-row">
              <div class="hero-search-field">
                <svg class="hero-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="hero-search" id="hero-search" placeholder="Search by degree (B.Tech), job (Lawyer), or vibe (stress-free)" value="${escapeHtml(searchQuery)}" aria-label="Search careers">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="filter-row" id="list-section">${filterButtons}</div>
      <div class="trust-notice">Not a coaching institute &middot; Zero ads &middot; No sponsored results &middot; <button class="trust-notice-link" data-nav="about">Our story &rarr;</button></div>
      <button class="compare-cta" data-nav="compare=,">Compare Careers</button>

      <div class="results-count">Showing ${filtered.length} of ${careers.length} careers</div>
      <div class="career-list">${listHtml}</div>
      <footer>
        <span>Karriere — built for students who deserve the truth.</span>
        <span><button class="footer-about" data-nav="about" style="background:none;border:none;padding:0;font:inherit;color:var(--violet);cursor:pointer;text-decoration:underline;text-underline-offset:2px;">About</button> · ${careers.length} careers profiled</span>
      </footer>
    </div>
  `;
}

function renderDetailView(id) {
  const career = careers.find(c => c.id === id);
  if (!career) return `<div class="wrap detail-wrap"><button class="back-link" data-nav="">← Back</button><div class="not-found">Career not found.</div></div>`;

  const m = career.metrics || {};

  // ── Tab definitions ──
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'realities', label: "What It's Like" },
    { id: 'fit', label: 'Is This for You' },
    { id: 'pay', label: 'Paths & Pay' },
    { id: 'experiences', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' }
  ];

   const tabBar = `
    <div class="detail-tab-bar" role="tablist">
      ${tabs.map(t => `
        <button class="detail-tab ${activeDetailTab === t.id ? 'active' : ''}" id="tab-${t.id}" data-tab="${t.id}" role="tab" aria-selected="${activeDetailTab === t.id}" aria-controls="panel-${t.id}">
          <span class="detail-tab-icon">${TAB_ICONS[t.id]}</span>
          <span class="detail-tab-label">${t.label}</span>
        </button>
      `).join('')}
    </div>`;

  // ── Related careers ──
  const relatedHtml = (career.related_careers || []).map(rid => {
    const rc = careers.find(c => c.id === rid);
    return rc ? `<button class="related-pill" data-nav="${rc.id}">${rc.name}</button>` : '';
  }).join('');

  // ── Hero quote: surface first real experience above the tabs ──
  const firstExp = (career.real_experiences || [])[0];
  const heroQuoteHtml = firstExp ? `<div class="hero-quote-block">
    <div class="hero-quote-label">From someone who lived it</div>
    <blockquote class="hero-quote-text">&ldquo;${truncateText(firstExp.quote, 220)}&rdquo;</blockquote>
    <a class="quote-source" href="${firstExp.url}" target="_blank" rel="noopener noreferrer">${firstExp.source}${firstExp.url ? ' &uarr;' : ''}</a>
  </div>` : '';

  return `
    <div class="wrap detail-wrap">
      <div class="detail-topbar">
        <button class="back-link" data-nav="">← Back to all careers</button>
        <div class="detail-topbar-actions">
          <button class="compare-btn-inline" data-nav="compare=${career.id}," title="Compare with another career">⇄ <span class="compare-label">Compare</span></button>
          <button class="share-btn share-page" data-share-id="${career.id}" data-share-name="${career.name}" aria-label="Share this career">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
            <span>Share</span>
          </button>
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">${getThemeIcon()}</button>
        </div>
      </div>
      <button class="masthead-small">${LOGOMARK}<span>Karriere</span></button>

      <div class="career-header">
        <div class="career-tag">${CATEGORY_ICONS[career.category] || ''} ${CATEGORY_LABELS[career.category] || career.category}</div>
        <h1 class="career-title">${career.name}</h1>
        <p class="career-tagline">${career.tagline}</p>
      </div>

      ${heroQuoteHtml}

      ${tabBar}

      <div class="detail-tab-content">
        <div class="tab-panel" id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" data-tab="overview" ${activeDetailTab === 'overview' ? '' : 'hidden'}>${renderOverviewTab(career, m)}</div>
        <div class="tab-panel" id="panel-realities" role="tabpanel" aria-labelledby="tab-realities" data-tab="realities" ${activeDetailTab === 'realities' ? '' : 'hidden'}>${renderRealitiesTab(career, m)}</div>
        <div class="tab-panel" id="panel-fit" role="tabpanel" aria-labelledby="tab-fit" data-tab="fit" ${activeDetailTab === 'fit' ? '' : 'hidden'}>${renderFitTab(career, m)}</div>
        <div class="tab-panel" id="panel-pay" role="tabpanel" aria-labelledby="tab-pay" data-tab="pay" ${activeDetailTab === 'pay' ? '' : 'hidden'}>${renderPayTab(career, m)}</div>
        <div class="tab-panel" id="panel-experiences" role="tabpanel" aria-labelledby="tab-experiences" data-tab="experiences" ${activeDetailTab === 'experiences' ? '' : 'hidden'}>${renderExperiencesTab(career, m)}</div>
        <div class="tab-panel" id="panel-faq" role="tabpanel" aria-labelledby="tab-faq" data-tab="faq" ${activeDetailTab === 'faq' ? '' : 'hidden'}>${renderFaqTab(career, m)}</div>
      </div>



      <div class="section related-section">
        <div class="section-label">Explore similar degrees</div>
        <div class="related-row">${relatedHtml || 'None yet'}</div>
      </div>
    </div>`;
}
function renderOverviewTab(career, m) {
  return `
    <div class="section-body overview-copy">${career.overview}</div>

    <div class="quickfacts-grid">
      <div class="quickfacts-item"><div class="quickfacts-label">Duration</div><div class="quickfacts-value">${m.duration || '—'}</div></div>
      <div class="quickfacts-item"><div class="quickfacts-label">Entry salary</div><div class="quickfacts-value">${career.salary?.entry || '—'}</div></div>
      <div class="quickfacts-item"><div class="quickfacts-label">Mid-career salary</div><div class="quickfacts-value">${career.salary?.mid || '—'}</div></div>
      <div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Ideal personality</div><div class="quickfacts-value quickfacts-text">${m.ideal_personality || '—'}</div></div>
      ${m.internship ? `<div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Internship</div><div class="quickfacts-value quickfacts-text">${m.internship}</div></div>` : ''}
      ${career.career_outlook ? `
      <div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Career outlook (India)</div><div class="quickfacts-value quickfacts-text">${career.career_outlook.india}</div></div>
      <div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Career outlook (Abroad)</div><div class="quickfacts-value quickfacts-text">${career.career_outlook.abroad}</div></div>
      ` : ''}
    </div>`;
}

function renderRealitiesTab(career, m) {
  return `
    <div class="section-label">What nobody tells you</div>
    <ul class="pain-list">${career.what_nobody_tells_you.map(p => `<li>${p}</li>`).join('')}</ul>

    <div class="section sub-section">
      <div class="section-label">Reality snapshot</div>
      <div class="snapshot-card">
      <div class="snapshot-scale">Scale: 1 = low, 5 = high</div>

        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.salary}</span><span class="snapshot-name">Salary potential</span>${renderStars(m.salary_potential, 'stars-positive')}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.stress}</span><span class="snapshot-name">Stress</span>${renderStars(m.stress, 'stars-negative')}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.worklife}</span><span class="snapshot-name">Work-life balance</span>${renderStars(m.work_life_balance, 'stars-positive')}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.study}</span><span class="snapshot-name">Study difficulty</span>${renderStars(m.study_difficulty, 'stars-negative')}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.competition}</span><span class="snapshot-name">Competition <span class="metric-sub">(entrance)</span></span>${renderStars(m.competition, 'stars-negative')}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.job}</span><span class="snapshot-name">Job availability</span>${renderStars(m.job_availability, 'stars-positive')}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.abroad}</span><span class="snapshot-name">Abroad opportunities</span>${renderStars(m.abroad_prospects, 'stars-positive')}</div>
      </div>
      <div class="snapshot-quotes">
        <div class="snapshot-quote"><span class="snapshot-quote-label">Biggest misconception</span><span class="snapshot-quote-text">"${m.misconception || ''}"</span></div>
        <div class="snapshot-quote"><span class="snapshot-quote-label">Most common regret</span><span class="snapshot-quote-text">"${m.regret || ''}"</span></div>
        <div class="snapshot-quote"><span class="snapshot-quote-label">Most common praise</span><span class="snapshot-quote-text">"${m.praise || ''}"</span></div>
      </div>
    </div>

    <div class="section sub-section">
      <div class="section-label">Why people choose this</div>
      <ul class="love-list">${(career.why_people_love_it || []).map(p => `<li>${p}</li>`).join('')}</ul>
    </div>`;
}

function renderFitTab(career, m) {
  return `
    <div class="fit-grid">
      <div class="fit-card">
        <div class="fit-label">Who thrives here</div>
        <ul>${(career.who_thrives || []).map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
      <div class="fit-card struggle">
        <div class="fit-label">Who might struggle or regret this</div>
        <ul>${(career.who_regrets_it || []).map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
    </div>

    <div class="verdict-divider">
      <span class="verdict-divider-label">Your decision</span>
    </div>
    ${renderVerdictCard(career)}`;
}

const PATH_LIKELIHOOD_LABELS = {
  most_graduates: 'Most graduates',
  common: 'Common',
  some: 'Some',
  few: 'Few'
};

function renderCareerPaths(career) {
  const paths = career.career_paths || [];
  if (!paths.length) return '';

  const cards = paths.map(p => {
    const likelihoodLabel = PATH_LIKELIHOOD_LABELS[p.likelihood] || p.likelihood || '';
    const pathwayChips = (p.pathway || []).map((step, i) => `
      <span class="path-chip">${step}</span>
      ${i < p.pathway.length - 1 ? '<span class="path-arrow">→</span>' : ''}
    `).join('');

    return `
      <div class="path-card" id="path-${p.id}">
        <button class="path-card-head" aria-expanded="false">
          <div class="path-card-title-row">
            <span class="path-card-name">${p.name}</span>
            ${likelihoodLabel ? `<span class="path-likelihood path-likelihood-${p.likelihood}">${likelihoodLabel}</span>` : ''}
            <span class="path-card-expand" aria-hidden="true"></span>
          </div>
          <div class="path-card-pathway">${pathwayChips}</div>
          <div class="path-card-meta">
            <span class="path-meta-item">${SNAPSHOT_ICONS.clock} ${p.time || '—'}</span>
            <span class="path-meta-item path-meta-salary">${p.salary || '—'}</span>
          </div>
        </button>
        <div class="path-card-body" hidden>
          ${p.explanation ? `<p class="path-explanation">${p.explanation}</p>` : ''}
          ${p.difficulty ? `<p class="path-difficulty"><span class="path-difficulty-label">Difficulty:</span> ${p.difficulty}</p>` : ''}
          ${p.watch_out ? `<p class="path-watchout"><span class="path-watchout-label">⚠ Watch out:</span> ${p.watch_out}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="section">
      <div class="section-label">Where graduates end up</div>
      <p class="paths-intro">Most ${career.name} graduates don't become specialists overnight. Here are the realistic destinations, roughly in order of how common they are.</p>
      <div class="paths-grid">${cards}</div>
      <p class="paths-footnote">Likelihood is our editorial estimate from graduates' accounts, not precise statistics.</p>
    </div>
  `;
}

function renderPayTab(career, m) {
  const pathsHtml = renderCareerPaths(career);
  const paths = career.career_paths || [];
  const degreeYears = career.duration_parsed || 0;

  // One-line journey summary: from Class 12, through the degree, to an established role.
  // Estimate = degree years + span of realistic (non-'few') path durations. Paths are
  // alternatives, not sequential, so we take the earliest start and latest end.
  const realisticTimes = paths
    .filter(p => p.likelihood !== 'few')
    .map(p => p.time_parsed || { min: 0, max: 0 });
  const estMin = degreeYears + (realisticTimes.length ? Math.min(...realisticTimes.map(r => r.min)) : 0);
  const estMax = degreeYears + (realisticTimes.length ? Math.max(...realisticTimes.map(r => r.max)) : 0);
  const journeySummary = estMax > estMin
    ? `From Class 12 to an established role: ~${Math.round(estMin)}–${Math.round(estMax)} yrs.`
    : `From Class 12 to an established role: ~${Math.round(estMin)} yrs.`;

  const pct = calculateSalaryPercentage(career.salary_parsed);

  // Helper to split the number from the parenthetical note
  function splitBarData(str) {
    if (!str) return { amount: '—', note: '' };
    const [amt, ...rest] = str.split('(');
    return { 
      amount: amt.trim(), 
      note: rest.length ? '(' + rest.join('(').trim() : '' 
    };
  }

  const eData = splitBarData(career.salary?.entry);
  const mData = splitBarData(career.salary?.mid);
  const sData = splitBarData(career.salary?.senior);
  const salaryCtx = getSalaryContext(career.salary_parsed?.entry);

return `
    ${pathsHtml}

    <div class="section sub-section">
      <div class="section-label">Salary progression</div>
      <p class="section-subline">Degree-level earnings across your career. ${journeySummary}</p>
      <div class="salary-track">
        <div class="salary-row">
          <div class="salary-stage">Entry</div>
          <div class="salary-bar-group">
            <div class="salary-bar-shell"><div class="salary-bar-fill" data-target="${pct.entry}"><span class="salary-value">${eData.amount}</span></div></div>
            ${eData.note ? `<div class="salary-bar-note">${eData.note}</div>` : ''}
          </div>
        </div>
        <div class="salary-row">
          <div class="salary-stage">Mid</div>
          <div class="salary-bar-group">
            <div class="salary-bar-shell"><div class="salary-bar-fill" data-target="${pct.mid}"><span class="salary-value">${mData.amount}</span></div></div>
            ${mData.note ? `<div class="salary-bar-note">${mData.note}</div>` : ''}
          </div>
        </div>
        <div class="salary-row">
          <div class="salary-stage">Senior</div>
          <div class="salary-bar-group">
            <div class="salary-bar-shell"><div class="salary-bar-fill" data-target="${pct.senior}"><span class="salary-value">${sData.amount}</span></div></div>
            ${sData.note ? `<div class="salary-bar-note">${sData.note}</div>` : ''}
          </div>
        </div>
      </div>
      ${salaryCtx ? `<p class="salary-context-note">&rarr; ${salaryCtx}</p>` : ''}
    </div>`;
}

function renderExperiencesTab(career, m) {
  const exps = career.real_experiences || [];
  
  let progressionHtml = '';
  if (m && m.progression && m.progression.length) {
    progressionHtml = `
      <div class="section-label">Typical progression</div>
      <div class="progression-ladder">
        ${m.progression.map((step, i) => `
          <div class="progression-step">
            <span class="progression-dot"></span>
            <span class="progression-text">${step}</span>
          </div>
        `).join('')}
      </div>
      <div class="progression-divider"></div>
    `;
  }

  const expsHtml = exps.length ? exps.map((q, i) => `
    <div class="quote-block">
      <div class="quote-text">"${q.quote}"</div>
      <a class="quote-source" href="${q.url}" target="_blank" rel="noopener noreferrer">${q.source}${q.url ? ' ↗' : ''}</a>
    </div>
  `).join('') : '<p style="color:var(--ink-faint);">No experiences yet.</p>';

  return progressionHtml + expsHtml;
}

function renderFaqTab(career) {
  const faqs = career.faq || [];
  if (!faqs.length) return '<p style="color:var(--ink-faint);">No FAQs yet.</p>';

  return `
    <div class="section-label">Frequently asked questions</div>
    <p class="section-subline">The questions students actually ask — answered honestly.</p>
    <div class="faq-list">
      ${faqs.map(f => `
        <details class="faq-item">
          <summary class="faq-question">
            <span class="faq-question-text">${f.question}</span>
            <span class="faq-question-chevron">▾</span>
          </summary>
          <div class="faq-answer">
            <p class="faq-answer-text">${f.answer}</p>
          </div>
        </details>
      `).join('')}
    </div>`;
}

function renderVerdictCard(career) {
  const choose = (career.choose_if || []).map(c => `<li>${c}</li>`).join('');
  const avoid = (career.avoid_if || []).map(c => `<li>${c}</li>`).join('');
  const commit = (career.before_you_commit || []).map(c => `<li>${c}</li>`).join('');

  if (!choose && !avoid && !commit) return '';

  return `
    <div class="verdict-card">
      <div class="verdict-label">Should you choose this?</div>
      ${choose ? `
      <div class="verdict-section">
        <div class="verdict-choose-title">Choose ${career.name} if…</div>
        <ul class="love-list">${choose}</ul>
      </div>` : ''}
      ${avoid ? `
      <div class="verdict-section">
        <div class="verdict-avoid-title">Avoid if…</div>
        <div class="verdict-avoid-block">
          <ul class="pain-list">${avoid}</ul>
        </div>
      </div>` : ''}
      ${commit ? `
      <div class="verdict-section">
        <div class="verdict-commit-title">Before you commit</div>
        <ul class="love-list">${commit}</ul>
      </div>` : ''}
    </div>`;
}


function renderAboutView() {
  return `
    <div class="wrap detail-wrap">
      <button class="back-link" data-nav="">← Back to careers</button>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <button class="masthead-small">${LOGOMARK}<span>Karriere</span></button>
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">${getThemeIcon()}</button>
      </div>

      <div class="career-header">
        <h1 class="career-title">About Karriere</h1>
        <p class="career-tagline">Choosing a career shouldn't feel like gambling.</p>
      </div>

      <div class="section">
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:24px;">Every year, millions of Indian students choose a career based on coaching institutes, relatives, social media, or random YouTube videos.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:24px;">Most career websites don't help much. They usually tell you:</p>
        <ul class="pain-list" style="margin-bottom:24px;">
          <li>"High salary."</li>
          <li>"Excellent scope."</li>
          <li>"Bright future."</li>
        </ul>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:24px;">But they rarely answer the questions students actually have:</p>
        <ul class="pain-list" style="margin-bottom:24px;">
          <li>What is the work really like?</li>
          <li>Who regrets choosing this career?</li>
          <li>What does a typical career path look like?</li>
          <li>Is this career actually a good fit for me?</li>
        </ul>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);">Karriere exists to answer those questions honestly.</p>
      </div>

      <div class="section">
        <div class="section-label">Our philosophy</div>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:16px;">We believe a career should be chosen based on fit, not hype.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:16px;">That's why every career on Karriere includes:</p>
        <ul class="love-list">
          <li>An honest overview</li>
          <li>What nobody tells you</li>
          <li>Who thrives</li>
          <li>Who struggles</li>
          <li>Real experiences from students and professionals</li>
          <li>Things to do before committing</li>
        </ul>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-top:16px;">The goal isn't to convince you to choose a career. The goal is to help you avoid choosing the wrong one.</p>
      </div>

      <div class="section">
        <div class="section-label">How the content is created</div>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:16px;">Every career page is built using information from multiple sources, including:</p>
        <ul class="love-list">
          <li>Official university and government resources</li>
          <li>Industry reports</li>
          <li>Practicing professionals</li>
          <li>Student experiences</li>
          <li>Public discussions (such as Reddit, Quora, and LinkedIn)</li>
        </ul>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-top:16px;">Where possible, we also speak directly with students and professionals to understand what the career is actually like beyond brochures and advertisements.</p>
      </div>

      <div class="section">
        <div class="section-label">A note about salaries</div>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:8px;">Salary figures are estimates. They vary depending on:</p>
        <ul class="pain-list">
          <li>City</li>
          <li>Skills</li>
          <li>College</li>
          <li>Experience</li>
          <li>Employer</li>
          <li>Economic conditions</li>
        </ul>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-top:8px;">They should be viewed as realistic ranges, not guarantees.</p>
      </div>

      <div class="section">
        <div class="section-label">This isn't career counselling</div>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);">Karriere is an independent educational resource. It does not replace professional career counselling, academic advisors, or conversations with people already working in the field. Think of it as one input into your decision — not the only one.</p>
      </div>

      <div class="section">
        <div class="section-label">Founder's Note</div>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:12px;">Hi, I'm Asier.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:12px;">I'm currently a student studying in India. While choosing my own career, I found that most guidance online focused on placements, salaries, or promotional content. Honest discussions about the realities of different careers were surprisingly difficult to find.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:12px;">I built Karriere to create the resource I wish I'd had before making my own decision.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:12px;">The project is still growing, and every career page is continuously refined as I learn more, interview students and professionals, and receive feedback from readers.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);">If Karriere helps even one student avoid choosing the wrong career, it has done its job.</p>
      </div>

      <div class="section">
        <div class="section-label">Get in touch</div>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:24px;">If you notice outdated information, find an error, want to share your own experience with a career, or would like to collaborate — I'd love to hear from you.</p>
        <form class="contact-form" action="https://formspree.io/f/mwvdgwgz" method="POST">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="form-name">Name</label>
              <input type="text" id="form-name" name="name" class="form-input" placeholder="Your name (optional)">
            </div>
            <div class="form-group">
              <label class="form-label" for="form-email">Email</label>
              <input type="email" id="form-email" name="email" class="form-input" placeholder="email@example.com (optional, if you want a reply)">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="form-subject">Subject</label>
            <select id="form-subject" name="subject" class="form-input form-select">
              <option value="">Select a topic…</option>
              <option value="Suggest a career">Suggest a career</option>
              <option value="Report an error">Report an error</option>
              <option value="Share my experience">Share my experience</option>
              <option value="Partnership / Collaboration">Partnership / Collaboration</option>
              <option value="General feedback">General feedback</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="form-career">Related career (optional)</label>
            <input type="text" id="form-career" name="career" class="form-input" placeholder="e.g. MBBS, CS Engineering, MBA, etc.">
          </div>
          <div class="form-group">
            <label class="form-label" for="form-message">Message <span class="form-required">*</span></label>
            <textarea id="form-message" name="message" class="form-input form-textarea" rows="5" placeholder="Share your thoughts, experience, or correction..." required></textarea>
          </div>
          <button type="submit" class="form-submit">Send message</button>
        </form>
      </div>
    </div>
  `;
}

function attachListeners() {
  // 1. Trigger Salary Animation if on the pay tab
  if (activeDetailTab === 'pay') animateSalaryBars();

  // 2. Compare search filtering
  function filterCompareOptions(inputEl) {
    const q = inputEl.value.trim().toLowerCase();
    document.querySelectorAll('.compare-option').forEach(opt => {
      if (opt.disabled) return;
      const name = opt.querySelector('.compare-option-name')?.textContent.toLowerCase() || '';
      const tagline = opt.querySelector('.compare-option-tagline')?.textContent.toLowerCase() || '';
      const id = opt.dataset.compareId || '';
      const aliases = ALIASES[id] || [];
      const match = name.includes(q) || tagline.includes(q) || aliases.some(a => a.includes(q));
      opt.style.display = match ? '' : 'none';
    });
  }

  const compareSearchA = document.getElementById('compareSearchA');
  if (compareSearchA) {
    compareSearchA.addEventListener('focus', () => { activeCompareSlot = 'a'; });
    compareSearchA.addEventListener('input', () => filterCompareOptions(compareSearchA));
  }

  const compareSearchB = document.getElementById('compareSearchB');
  if (compareSearchB) {
    compareSearchB.addEventListener('focus', () => { activeCompareSlot = 'b'; });
    compareSearchB.addEventListener('input', () => filterCompareOptions(compareSearchB));
  }

  // 4. Hero Search Bar
  const searchInput = document.getElementById('hero-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        searchQuery = searchInput.value;
        updateSearchUrl();
        const cursorPos = searchInput.selectionStart;
        await render(false);
        const newInput = document.getElementById('hero-search');
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(cursorPos, cursorPos);
        }
      }, 250);
    });
  }
}
  function fallbackCopy(url) {
    navigator.clipboard.writeText(url).then(() => {
      let toast = document.getElementById('share-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'share-toast';
        toast.className = 'share-toast';
        toast.textContent = 'Link copied!';
        document.body.appendChild(toast);
      }
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }).catch(() => {});
  }

// --- GLOBAL EVENT DELEGATION (Handles Clicks & Keydown) ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const tabList = e.target.closest('[role="tablist"]');
    if (!tabList) return;
    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    const index = tabs.indexOf(e.target);
    if (index > -1) {
      let nextIndex = 0;
      if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
      e.preventDefault();
    }
  }
});


document.addEventListener('click', async (e) => {
  const target = e.target.closest('button, .career-entry, [data-nav], [data-nav-scroll], .share-page, .compare-option');
  if (!target) return;

    if (target.dataset.nav !== undefined) {
    navigate(target.dataset.nav);
    return;
  }
  if (target.classList.contains('career-entry')) {
    navigate(target.dataset.id);
    return;
  }
  if (target.classList.contains('filter-btn')) {
    activeCategory = target.dataset.cat;
    updateSearchUrl();
    render(false);
    return;
  }

  if (target.classList.contains('path-card-head')) {
    const card = target.closest('.path-card');
    const body = card?.querySelector('.path-card-body');
    const isExpanded = target.getAttribute('aria-expanded') === 'true';
    target.setAttribute('aria-expanded', String(!isExpanded));
    if (body) body.hidden = isExpanded;
    return;
  }

  if (target.classList.contains('detail-tab')) {
    document.querySelectorAll('.detail-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    target.classList.add('active');
    target.setAttribute('aria-selected', 'true');
    
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    const panel = document.querySelector(`.tab-panel[data-tab="${target.dataset.tab}"]`);
    if (panel) panel.hidden = false;
    
    activeDetailTab = target.dataset.tab;
    if (activeDetailTab === 'pay') animateSalaryBars();
    
    const base = window.location.pathname.replace(/\/+$/, '');
    history.replaceState(null, '', `${base}?tab=${activeDetailTab}`);
    return;
  }
  if (target.dataset.navScroll) {
    document.getElementById(target.dataset.navScroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (target.closest('#themeToggle')) {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
    return;
  }
  if (target.classList.contains('wordmark') || target.classList.contains('masthead-small')) {
    navigate('');
    return;
  }

if (target.classList.contains('compare-option')) {
    if (target.disabled) return;
    const selectedId = target.dataset.compareId;
    const slotA = document.getElementById('compareA')?.value || '';
    const slotB = document.getElementById('compareB')?.value || '';

    if (slotA && slotB) return; 
    if (selectedId === slotA || selectedId === slotB) return;

    let nextA = slotA;
    let nextB = slotB;
    if (activeCompareSlot === 'b') {
      if (!nextB) nextB = selectedId;
      else if (!nextA) nextA = selectedId;
    } else {
      if (!nextA) nextA = selectedId;
      else if (!nextB) nextB = selectedId;
    }
    navigate(`compare=${nextA},${nextB}`);
    return;
  }

  if (target.classList.contains('share-page')) {
    const name = target.dataset.shareName;
    const url = window.location.href;
    const title = name ? `Karriere – ${name}` : 'Karriere — The unfiltered career file';
    const text = name
      ? `Check out ${name} on Karriere — honest career insights.`
      : 'Honest career guidance for Indian students. Real salaries, real timelines, real regrets.';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if (err.name !== 'AbortError') fallbackCopy(url);
      }
    } else {
      fallbackCopy(url);
    }
    return;
  }
});


// --- GLOBAL FORM SUBMIT HANDLER ---
document.addEventListener('submit', async (e) => {
  if (e.target.classList.contains('contact-form')) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.innerHTML = '<div style="padding: 40px 0; text-align: center; color: var(--sage); font-weight: 700; font-size: 16px;">Thanks for your feedback! It has been received.</div>';
      } else {
        throw new Error('Network response failed');
      }
    } catch (err) {
      btn.textContent = 'Error. Try Again.';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; }, 3000);
    }
  }
});

// --- INITIALIZATION ---
initTheme();
window.addEventListener('popstate', () => render(true));

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const path = window.location.pathname.replace(/^\/+/, '');
  if (!path) return;
  if (path.startsWith('compare')) {
    navigate('compare=,');
  } else {
    navigate('');
  }
});

render(true);

function updateMetaTags(careerName, careerTagline) {
  const title = careerName
    ? `${careerName} — Karriere`
    : 'Karriere — The unfiltered career file';
  const desc = careerTagline || 'Honest career guidance for Indian students. Real salaries, real timelines, real regrets.';
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
}

async function render(animate = true) {
  const loaded = await loadCareers();
  if (!loaded) return;
  const view = document.getElementById('view');
// Remove the BASE folder if it exists, strip slashes, and ignore index.html
  let path = window.location.pathname.replace(BASE, '').replace(/^\/+|\/+$/g, '').split('?')[0];
  if (path === 'index.html') {
    path = '';
  }
  const urlParams = new URLSearchParams(window.location.search);
  
  if (!window.initialLoadDone) {
    if (urlParams.has('q')) searchQuery = urlParams.get('q');
    if (urlParams.has('filter')) activeCategory = urlParams.get('filter');
    window.initialLoadDone = true;
  }

  const isCompare = path.startsWith('compare');
  const id = isCompare ? '' : path;
// Restore tab from URL
if (!isCompare && id) {
  const tabParam = urlParams.get('tab');
  activeDetailTab = tabParam && DETAIL_TABS.includes(tabParam) ? tabParam : 'overview';
}


  if (animate) {
    view.classList.add('leaving');
    await new Promise(r => setTimeout(r, 150));
  }

  if (isCompare) {
    try {
      const id1 = urlParams.get('id1');
      const id2 = urlParams.get('id2');
      if (id1 && id2) {
        view.innerHTML = renderCompareView(id1, id2);
      } else if (id1 || id2) {
        view.innerHTML = renderComparePicker(id1 || null, id2 || null);
      } else {
        view.innerHTML = renderComparePicker(null, null);
      }
      
      if (id1 && id2) {
        window.prevScrollY = window.scrollY;
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (window.prevScrollY !== undefined) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: window.prevScrollY, behavior: 'instant' });
          window.prevScrollY = undefined;
        });
      }
    } catch (err) {
      console.error("Compare render failed:", err);
      view.innerHTML = `<div class="wrap"><button class="back-link" data-nav="">← Back</button><div class="not-found">Error loading compare view.</div></div>`;
    }
  } else {
    try {
      if (id === 'about') {
        view.innerHTML = renderAboutView();
      } else {
        view.innerHTML = id ? renderDetailView(id) : renderListView();
      }
    } catch (err) {
      console.error("Render failed:", err);
      view.innerHTML = `
        <div class="wrap" style="text-align:center;padding-top:80px;">
          <h2>Something went wrong</h2>
          <p style="color:var(--ink-soft);margin-top:12px;">We couldn't render this page properly.</p>
          <button onclick="location.reload()" style="margin-top:24px;padding:12px 24px;background:var(--violet);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">Refresh Page</button>
        </div>`;
    }
  }

  view.classList.remove('leaving');

  if (animate) {
    if (id) {
      window.prevScrollY = window.scrollY;
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (window.prevScrollY !== undefined) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: window.prevScrollY, behavior: 'instant' });
        window.prevScrollY = undefined;
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  attachListeners();
  const searchInput = document.getElementById('hero-search');
  const career = careers.find(c => c.id === id);
  updateMetaTags(career?.name, career?.tagline);

  // Focus + announce on real route changes only (not on in-place filter/search re-renders)
  if (animate && !isFirstRender) {
    const heading = view.querySelector('h1');
    let label = heading ? heading.textContent.trim() : 'Karriere';
    if (!isCompare && !id) label = 'Karriere — all careers';
    if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    const announcer = document.getElementById('route-announcer');
    if (announcer) announcer.textContent = `Now viewing: ${label}`;
  }
  isFirstRender = false;
}

function renderComparePicker(preselectedA, preselectedB) {
  const selectedA = preselectedA && careers.find(c => c.id === preselectedA);
  const selectedB = preselectedB && careers.find(c => c.id === preselectedB);

  const list = careers.map(c => {
    const isSelected = c.id === preselectedA || c.id === preselectedB;
    return `
    <button class="compare-option ${isSelected ? 'compare-option-selected' : ''}" data-compare-id="${c.id}" ${isSelected ? 'disabled' : ''}>
      <span class="compare-option-cat">${CATEGORY_LABELS[c.category] || c.category}</span>
      <span class="compare-option-name">${c.name}</span>
      <span class="compare-option-tagline">${c.tagline}</span>
    </button>
  `}).join('');

  const SEARCH_ICON = `<svg class="compare-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;

  function compareField(selected, clearNav, searchId, placeholder) {
    if (selected) {
      return `
        <div class="compare-field compare-field--filled">
          <span class="compare-field-name">${selected.name}</span>
          <button class="compare-field-clear" data-nav="${clearNav}" aria-label="Remove ${selected.name}">✕</button>
        </div>`;
    }
    return `
      <div class="compare-field compare-field--empty">
        ${SEARCH_ICON}
        <input type="text" class="compare-search" id="${searchId}" placeholder="${placeholder}" autocomplete="off">
      </div>`;
  }

  const fieldA = compareField(selectedA, `compare=,${selectedB?.id || ''}`, 'compareSearchA', 'Search Career 1…');
  const fieldB = compareField(selectedB, `compare=${selectedA?.id || ''},`, 'compareSearchB', 'Search Career 2…');

  return `
    <div class="wrap compare-picker-wrap">
      <button class="back-link" data-nav="">← Back</button>
      <h1 class="compare-picker-title">Compare Careers</h1>
      
      ${!preselectedA && !preselectedB ? '<p style="font-size:15px;color:var(--ink-soft);margin-bottom:28px;line-height:1.6;">Pick one career in each column — click any card in the list to add it.</p>' : ''}
      
      <div class="compare-two">
        <div class="compare-col">
          <div class="compare-col-label">Career 1</div>
          ${fieldA}
          <input type="hidden" id="compareA" value="${selectedA?.id || ''}">
        </div>
        <div class="compare-vs">vs</div>
        <div class="compare-col">
          <div class="compare-col-label">Career 2</div>
          ${fieldB}
          <input type="hidden" id="compareB" value="${selectedB?.id || ''}">
        </div>
      </div>
      
      <div class="compare-options" id="compareOptions">${list}</div>
    </div>
  `;
}


function renderCompareView(id1, id2) {
  const a = careers.find(c => c.id === id1);
  const b = careers.find(c => c.id === id2);
  if (!a || !b) return `<div class="wrap"><button class="back-link" data-nav="">← Back</button><div class="not-found">One or both careers not found.</div></div>`;

  const mA = a.metrics || {};
  const mB = b.metrics || {};


   function sectionHeading(title, iconKey) {
    return `<div class="section-label comp-heading">${COMPARE_ICONS[iconKey] || ''}<span>${title}</span></div>`;
  }

  function row(label, valA, valB, winner) {
    const badgeA = winner === 'a' ? WINNER_BADGE : '';
    const badgeB = winner === 'b' ? WINNER_BADGE : '';
    return `<div class="comp-row">
      <div class="comp-label">${label}</div>
      <div class="comp-val comp-a ${winner === 'a' ? 'comp-winner' : ''}">${badgeA}${valA ?? '—'}</div>
      <div class="comp-val comp-b ${winner === 'b' ? 'comp-winner' : ''}">${badgeB}${valB ?? '—'}</div>
    </div>`;
  }

  function tableWrap(title, iconKey, rowsHtml) {
    return `
      <div class="comp-section">
        ${sectionHeading(title, iconKey)}
        <div class="comp-table">
          <div class="comp-header"><div class="comp-label"></div><div class="comp-val comp-a">${a.name}</div><div class="comp-val comp-b">${b.name}</div></div>
          ${rowsHtml}
        </div>
      </div>`;
  }

function narrativeSection(title, iconKey, itemsA, itemsB, nameA, nameB) {
  const colHtml = (name, items) => `
    <div class="comp-narrative-col">
      <div class="comp-narrative-name">${name}</div>
      <ul class="comp-narrative-list">
        ${(items && items.length) ? items.map(i => `<li>${i}</li>`).join('') : '<li class="comp-narrative-empty">No data available</li>'}
      </ul>
    </div>`;

  return `
    <div class="comp-section">
      ${sectionHeading(title, iconKey)}
      <div class="comp-narrative">
        ${colHtml(nameA, itemsA)}
        ${colHtml(nameB, itemsB)}
      </div>
    </div>`;
}

  // ── At a Glance ──
  const glanceRows =
    row('Duration', mA.duration, mB.duration, pickWinner(a.duration_parsed, b.duration_parsed, 'lower')) +
    row('Entry salary', salaryCell(a.salary?.entry), salaryCell(b.salary?.entry), pickWinner(getMid(a.salary_parsed?.entry), getMid(b.salary_parsed?.entry), 'higher')) +
    row('Stress (lower is better)', starCell(mA.stress, 'stress'), starCell(mB.stress, 'stress'), pickWinner(mA.stress, mB.stress, 'lower')) +
    row('Competition (entrance)', starCell(mA.competition, 'competition'), starCell(mB.competition, 'competition'), pickWinner(mA.competition, mB.competition, 'lower'));
  const glanceHtml = tableWrap('At a Glance', 'glance', glanceRows);

  // ── Reality Snapshot ──
  const snapshotMetrics = [
    ['salary_potential', 'Salary potential'], ['study_difficulty', 'Study difficulty'],
    ['work_life_balance', 'Work-life balance'], ['job_availability', 'Job availability'],
    ['abroad_prospects', 'Abroad prospects']
  ];
  const snapshotRows = snapshotMetrics.map(([key, label]) =>
    row(label, starCell(mA[key], key), starCell(mB[key], key), pickWinner(mA[key], mB[key], METRIC_DIRECTION[key]))
  ).join('');
  const snapshotHtml = tableWrap('Reality Snapshot', 'snapshot', snapshotRows);

  // ── Salary Progression ──
  const salaryStages = [['entry', 'Entry'], ['mid', 'Mid'], ['senior', 'Senior']];
  const salaryRows = salaryStages.map(([key, label]) =>
    row(label, salaryCell(a.salary?.[key]), salaryCell(b.salary?.[key]), pickWinner(getMid(a.salary_parsed?.[key]), getMid(b.salary_parsed?.[key]), 'higher'))
  ).join('');
  const salaryHtml = tableWrap('Salary Progression', 'salary', salaryRows);

// replace the three listSection(...) calls with:
const nobodyHtml = narrativeSection('What Nobody Tells You', 'warning', a.what_nobody_tells_you?.slice(0, 3), b.what_nobody_tells_you?.slice(0, 3), a.name, b.name);
const thrivesHtml = narrativeSection('Who Thrives Here', 'thrives', a.who_thrives, b.who_thrives, a.name, b.name);
const struggleHtml = narrativeSection('Who Might Struggle', 'struggle', a.who_regrets_it?.slice(0, 3), b.who_regrets_it?.slice(0, 3), a.name, b.name);

  const chooseA = (a.choose_if || []).map(c => `<li>${c}</li>`).join('');
  const chooseB = (b.choose_if || []).map(c => `<li>${c}</li>`).join('');
  const avoidA = (a.avoid_if || []).map(c => `<li>${c}</li>`).join('');
  const avoidB = (b.avoid_if || []).map(c => `<li>${c}</li>`).join('');

  return `
    <div class="wrap compare-results-wrap">
      <button class="back-link" data-nav="compare=,">← Back to compare</button>
      <div class="comp-header-banner"><h1>${a.name} vs ${b.name}</h1></div>

      ${glanceHtml}
      ${snapshotHtml}
      ${salaryHtml}
      ${nobodyHtml}
      ${thrivesHtml}
      ${struggleHtml}

      <div class="comp-section comp-decision">
        ${sectionHeading('Decision Guide', 'target')}
        <div class="comp-decision-grid">
          <div class="comp-decision-card">
            <div class="comp-decision-name">Choose ${a.name} if…</div>
            <ul class="love-list">${chooseA}</ul>
            <div class="comp-decision-avoid">
              <div class="comp-decision-avoid-label">Avoid if…</div>
              <ul class="pain-list">${avoidA}</ul>
            </div>
          </div>
          <div class="comp-decision-card">
            <div class="comp-decision-name">Choose ${b.name} if…</div>
            <ul class="love-list">${chooseB}</ul>
            <div class="comp-decision-avoid">
              <div class="comp-decision-avoid-label">Avoid if…</div>
              <ul class="pain-list">${avoidB}</ul>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-actions">
        <button class="share-btn share-page" data-share-name="${a.name} vs ${b.name}" data-share-compare="1" aria-label="Share this comparison">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          <span>Share</span>
        </button>
      </div>
    </div>
  `;
}

// Backward compatibility: redirect old #hash URLs to clean paths
(function handleOldHash() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#')) {
    const cleanHash = hash.replace('#', '');
    if (cleanHash.startsWith('compare=')) {
      const ids = cleanHash.replace('compare=', '').split(',');
      if (ids.length === 2 && ids[0] && ids[1]) {
        history.replaceState(null, '', `${BASE}/compare?id1=${ids[0]}&id2=${ids[1]}`);
      } else {
        history.replaceState(null, '', `${BASE}/compare`);
      }
    } else if (cleanHash) {
      const tabMatch = cleanHash.match(/^([^?]+)\?tab=([^&]+)/);
      if (tabMatch) {
        history.replaceState(null, '', `${BASE}/${tabMatch[1]}?tab=${tabMatch[2]}`);
      } else {
        history.replaceState(null, '', `${BASE}/${cleanHash.split('?')[0]}`);
      }
    } else {
      history.replaceState(null, '', `${BASE}/`);
    }
  }
})();