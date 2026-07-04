let careers = [];
let activeCategory = 'all';
let searchQuery = '';
let activeDetailTab = 'overview';

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
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 14"></polyline></svg>'
};
const LOGOMARK = '<svg class="logomark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="4" x2="12" y2="20"></line><line x1="5.07" y1="8" x2="18.93" y2="16"></line><line x1="18.93" y1="8" x2="5.07" y2="16"></line></svg>';

// Duration = years of formal training to first practice. Stress/competition are
// 1-5 scale, derived from each career's overview, salary spread, and testimonies.
const CARD_METRICS = {
  mbbs: { duration: '5.5 yrs', stress: 5, competition: 5 },
  bds: { duration: '5 yrs', stress: 3, competition: 5 },
  cs_engineering: { duration: '4 yrs', stress: 3, competition: 4 },
  ca: { duration: '5-7 yrs', stress: 5, competition: 5 },
  law: { duration: '5 yrs', stress: 4, competition: 4 },
  design: { duration: '4 yrs', stress: 3, competition: 5 },
  mba: { duration: '2 yrs', stress: 4, competition: 4 },
  pharmacy: { duration: '4 yrs', stress: 2, competition: 2 },
  paramedical_physiotherapy: { duration: '5 yrs', stress: 3, competition: 2 },
  paramedical_nursing: { duration: '4 yrs', stress: 4, competition: 2 },
  radiology_tech: { duration: '3-4 yrs', stress: 2, competition: 2 },
  bca_mca: { duration: '3+2 yrs', stress: 3, competition: 4 },
  bba: { duration: '3 yrs', stress: 2, competition: 3 },
  bcom: { duration: '3 yrs', stress: 2, competition: 3 },
  zoology: { duration: '3 yrs', stress: 2, competition: 3 },
  botany: { duration: '3 yrs', stress: 2, competition: 3 },
};

const DETAIL_METRICS = {
  mbbs: {
    salary_potential: 4, study_difficulty: 5, work_life_balance: 1, job_availability: 5, abroad_prospects: 4,
    ideal_personality: 'Emotionally resilient, high stress tolerance, genuinely curious about biology',
    internship: '1 yr compulsory rotating internship (within MBBS)',
    progression: ['Intern', 'Junior Resident (MD/MS)', 'Senior Resident', 'Consultant / Specialist'],
    misconception: 'Once you finish MBBS, you\'re financially set.', regret: 'I underestimated how long it takes to actually start earning well.',
    praise: 'Helping even one patient makes the difficult days feel worthwhile.'
  },
  bds: {
    salary_potential: 3, study_difficulty: 4, work_life_balance: 3, job_availability: 2, abroad_prospects: 2,
    ideal_personality: 'Detail-oriented, hands-on, comfortable running a small business',
    internship: '1 yr compulsory internship',
    progression: ['Intern', 'Associate Dentist', 'MDS Specialist / Clinic Owner', 'Established Private Practice'],
    misconception: 'A dental degree pays like a medical degree.', regret: 'I only chose BDS because I missed the MBBS cutoff.',
    praise: 'Precise, hands-on work with visible, immediate results for patients.'
  },
  cs_engineering: {
    salary_potential: 5, study_difficulty: 3, work_life_balance: 3, job_availability: 3, abroad_prospects: 5,
    ideal_personality: 'Self-learner who enjoys problem-solving and constant change',
    internship: 'Typically one summer internship before final year',
    progression: ['SDE 1 / Junior Developer', 'SDE 2 / Mid-level Engineer', 'Senior Engineer / Tech Lead', 'Staff Engineer / EM'],
    misconception: 'Every CS graduate gets a high-paying tech job.', regret: 'I assumed college alone would prepare me — I had to self-learn everything that mattered.',
    praise: 'Skills compound fast, and the ceiling on pay and impact is genuinely high.'
  },
  ca: {
    salary_potential: 5, study_difficulty: 5, work_life_balance: 1, job_availability: 5, abroad_prospects: 2,
    ideal_personality: 'Disciplined, persistent, comfortable with delayed gratification and repeated failure',
    duration: '5-7 yrs',
    progression: ['Articleship Trainee', 'Fresher CA (Big 4 / mid-size)', 'Manager (5 yrs)', 'CFO track / Partner / Own Practice'],
    misconception: "You'll be a lakhpati the moment you pass.", regret: 'I thought it would take 3 years. It took me 6.5, and two failed attempts along the way.',
    praise: "It's one of the most recession-proof, respected qualifications in Indian finance."
  },
  law: {
    salary_potential: 5, study_difficulty: 4, work_life_balance: 2, job_availability: 3, abroad_prospects: 2,
    ideal_personality: 'Strong communicator who enjoys reading, arguing, and slow-building a reputation',
    internship: 'Mandatory internships every vacation — they matter more than your syllabus for where you end up',
    progression: ['Junior Associate / Litigation Trainee', 'Mid-level (Corporate Associate or Litigator)', 'Senior Associate / Specialist Litigator', 'Partner / Senior Advocate / Judiciary'],
    misconception: 'Every lawyer argues dramatic courtroom cases like on TV.', regret: "I didn't realize litigation pays almost nothing for the first 5-10 years, and I didn't have the runway to wait it out.",
    praise: 'Deeply intellectually engaging work that rewards sharp thinking and persistence.'
  },
  design: {
    salary_potential: 4, study_difficulty: 3, work_life_balance: 3, job_availability: 3, abroad_prospects: 4,
    ideal_personality: "Creatively driven self-starter who's comfortable with constant critique",
    internship: 'Helps with portfolio-building, but matters less than the portfolio itself',
    progression: ['Junior Designer', 'Product / UX Designer', 'Senior Designer / Design Lead', 'Design Director / Independent Label'],
    misconception: 'Design is easy, low-stress work where creativity alone gets you through.', regret: 'I thought design was mostly creative work — turns out it\'s 80% client feedback and revisions.',
    praise: 'Genuinely creative, varied work — no two days or projects look the same.'
  },
  mba: {
    salary_potential: 5, study_difficulty: 3, work_life_balance: 2, job_availability: 3, abroad_prospects: 4,
    ideal_personality: 'Strategic networker with clear career goals going in',
    internship: 'Mandatory summer internship between year 1 and 2',
    progression: ['Associate / Management Trainee', 'Manager (3-5 yrs)', 'Senior Manager / Practice Lead', 'Director / CXO track'],
    misconception: 'MBA automatically leads to leadership roles, regardless of where you did it.', regret: "I went for an MBA right after graduation without work experience. Later I realized I would have understood more, earned more, and chosen better roles if I had worked first.",
    praise: 'It genuinely opens doors and accelerates people who already have direction.'
  },
  pharmacy: {
    salary_potential: 3, study_difficulty: 3, work_life_balance: 4, job_availability: 3, abroad_prospects: 3,
    ideal_personality: 'Detail-oriented, regulation-comfortable, interested in chemistry',
    internship: 'Internships at pharmacies or pharma companies during the degree',
    progression: ['Pharmacist / QA-QC Trainee', 'Store Manager / Industry Executive', 'Regulatory Affairs / QA Manager', 'Chain Owner / Senior Industry Role'],
    misconception: 'Pharmacists just hand out medicines at a counter.', regret: 'I defaulted into retail instead of exploring the better-paying industry roles.',
    praise: "Strong, stable demand thanks to India's massive pharma manufacturing base."
  },
  paramedical_physiotherapy: {
    salary_potential: 3, study_difficulty: 3, work_life_balance: 3, job_availability: 3, abroad_prospects: 4,
    ideal_personality: 'Patient, hands-on, genuinely interested in human movement and recovery',
    internship: '1 yr compulsory internship (within the 5-year BPT)',
    progression: ['Intern', 'Junior Physiotherapist', 'Senior Physiotherapist / Practice Building', 'Established Private Practice / Sports Physio'],
    misconception: 'Physiotherapy is a quick, easy medical-adjacent degree.', regret: 'I underestimated how physically demanding the day-to-day work actually is.',
    praise: 'You see steady, tangible progress in patients — deeply satisfying work.'
  },
  paramedical_nursing: {
    salary_potential: 3, study_difficulty: 3, work_life_balance: 2, job_availability: 4, abroad_prospects: 5,
    ideal_personality: 'Empathetic, resilient, comfortable with shift work',
    internship: 'Extensive clinical postings throughout the degree',
    progression: ['Staff Nurse (India or abroad)', 'Senior / Charge Nurse', 'Nurse Specialist / Ward Manager', 'Nurse Practitioner / Matron (esp. abroad)'],
    misconception: 'There\'s little room for career growth in nursing.', regret: "I didn't plan for licensing exams abroad early enough — it delayed my income by years.",
    praise: 'One of the most globally portable healthcare careers there is.'
  },
  radiology_tech: {
    salary_potential: 3, study_difficulty: 2, work_life_balance: 3, job_availability: 4, abroad_prospects: 3,
    ideal_personality: 'Technically minded, precise, comfortable with equipment and shift schedules',
    internship: 'Hospital-based practical training throughout the degree',
    progression: ['Trainee Technologist', 'Radiology Technologist', 'Specialized Technologist (MRI/CT/Sonography)', 'Imaging Center Manager'],
    misconception: 'Radiology technologists read and diagnose scans.', regret: "I didn't realize I'd be treated as a machine operator, not a medical professional. The degree is called 'Radiology' but you're a technician to everyone around you.",
    praise: 'High demand and comparatively good pay for a paramedical path, without an extremely long education.'
  },
  bca_mca: {
    salary_potential: 4, study_difficulty: 3, work_life_balance: 3, job_availability: 3, abroad_prospects: 3,
    ideal_personality: 'Self-learner who treats BCA as a stepping stone and builds coding skills independently',
    internship: 'Varies by college — top programs have industry internships; many tier-3 colleges have none at all',
    progression: ['Junior Developer', 'Software Engineer', 'Senior Engineer / Tech Lead', 'Engineering Manager / Architect'],
    misconception: 'BCA has less math than B.Tech, which makes it a more practical, coding-focused alternative to engineering.',
    regret: 'I thought I could make BCA alone work, spent years stuck in low-growth roles that B.Tech graduates weren\'t even considered for, and lost time I can\'t get back.',
    praise: 'The MCA completely reset my career trajectory — the same companies that wouldn\'t look at my BCA resume started calling me for interviews.'
  },
  bba: {
    salary_potential: 3, study_difficulty: 2, work_life_balance: 3, job_availability: 2, abroad_prospects: 2,
    ideal_personality: 'Networker who enjoys business concepts, comfortable with sales/operations as entry point, and sees BBA as MBA preparation',
    internship: 'Critical for employability — graduates with multiple internships land significantly better roles than those without any',
    progression: ['Management Trainee / Sales Associate', 'Assistant Manager / Team Lead', 'Manager / Department Head', 'Senior Manager / Director (with MBA)'],
    misconception: 'BBA is a "management degree" while B.Com is "just accounting" — so BBA is the better, more prestigious choice for a corporate career.',
    regret: 'I paid premium fees at a private college for a degree that didn\'t open any doors my B.Com classmates didn\'t already have — I should have saved the money and gone for professional certifications instead.',
    praise: 'A BBA from a good program with solid internships set me up for an MBA far better than any other undergraduate degree could have.'
  },
  bcom: {
    salary_potential: 3, study_difficulty: 2, work_life_balance: 3, job_availability: 3, abroad_prospects: 2,
    ideal_personality: 'Detail-oriented and patient with numbers, comfortable with process-driven work, sees the degree as a foundation for further certification',
    internship: 'Varies by college — top programs have structured internships; most tier-3 colleges offer none, making self-sourced internships critical',
    progression: ['Accounts Assistant / Audit Trainee', 'Accountant / Financial Analyst', 'Senior Accountant / Team Lead', 'Manager / CA-CFA-qualified Specialist'],
    misconception: 'B.Com is only useful if you plan to become a CA — otherwise it\'s a dead-end degree with no real career value.',
    regret: 'I assumed the degree alone would lead to a corporate career, but without certifications or skills I\'ve been stuck in the same clerical role for years while watching CA-qualified peers advance.',
    praise: 'A B.Com combined with the right certification gives you a career foundation as strong as any professional degree — at a fraction of the cost and time.'
  },
  zoology: {
    salary_potential: 2, study_difficulty: 3, work_life_balance: 4, job_availability: 2, abroad_prospects: 3,
    ideal_personality: 'Genuinely curious about biology, comfortable with hands-on lab work, willing to commit to additional qualifications after the degree',
    internship: 'Not typically structured into the curriculum — self-sourced internships at research institutes, wildlife organizations, or labs are essential for building a competitive M.Sc. application',
    progression: ['Lab Technician / Field Assistant', 'M.Sc. Graduate / Junior Research Fellow', 'PhD Scholar / Research Associate', 'Professor / Senior Scientist'],
    misconception: 'B.Sc. Zoology is a backup degree — you can coast through it easily while you figure out what to do with your life.',
    regret: 'I chose Zoology as a default after NEET without any real plan, drifted through three years, and graduated with no applications, no direction, and no job prospects.',
    praise: 'B.Sc. Zoology with a clear plan for what comes next is one of the most genuinely interesting undergraduate degrees you can choose — the subject is endlessly fascinating if you actually care about it.'
  },
  botany: {
    salary_potential: 2, study_difficulty: 3, work_life_balance: 4, job_availability: 2, abroad_prospects: 3,
    ideal_personality: 'Genuinely curious about plants and ecosystems, comfortable with fieldwork and outdoor conditions, patient with a slow-building career',
    internship: 'Not typically structured — self-sourced internships at agricultural research stations, botanical gardens, herbal pharma companies, or environmental consulting firms are essential',
    progression: ['Lab Technician / Nursery Assistant', 'M.Sc. Graduate / Agricultural Officer', 'PhD Scholar / Research Scientist', 'Professor / Forestry Officer / Senior Researcher'],
    misconception: 'Botany is just "studying plants" — a narrow, outdated science with limited career scope in the modern economy.',
    regret: 'I chose Botany because of the promise of government jobs, but the competition was far higher than I expected and I ended up stuck with no backup plan.',
    praise: 'A B.Sc. in Botany combined with a targeted M.Sc. in plant biotechnology, forestry, or agriculture opens doors to careers that genuinely matter — feeding a growing population and protecting ecosystems.'
  },
};
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
  setTheme(saved || 'light');
}


function renderStars(value) {
  if (!value) return '<span class="snapshot-stars">—</span>';
  let s = '';
  for (let i = 1; i <= 5; i++) s += i <= value ? '★' : '☆';
  return `<span class="snapshot-stars">${s}</span>`;
}

function renderQFMeter(value, colorClass) {
  let segs = '';
  for (let i = 1; i <= 5; i++) segs += `<span class="qf-seg ${colorClass} ${i <= value ? 'filled' : ''}"></span>`;
  return `<span class="qf-bar">${segs}</span>`;
}

function renderMeter(value, type) {
  const label = type === 'stress' ? 'Stress' : 'Competition';
  let segs = '';
  for (let i = 1; i <= 5; i++) segs += `<span class="meter-seg ${i <= value ? 'filled' : ''}"></span>`;
  return `<span class="metric-meter metric-${type}"><span class="metric-meter-label">${label}</span><span class="meter-bar">${segs}</span></span>`;
}


async function loadCareers() {
  if (careers.length) return;
  try {
    const res = await fetch('careers.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    careers = await res.json();
  } catch (err) {
    document.getElementById('view').innerHTML = `
      <div class="wrap" style="text-align:center;padding-top:80px;">
        <h2>Couldn't load career data</h2>
        <p style="color:var(--ink-soft);margin-top:12px;">${err.message}. Please check your connection and refresh.</p>
        <button onclick="location.reload()" style="margin-top:20px;padding:10px 24px;background:var(--amber);color:#fff;border:none;border-radius:8px;cursor:pointer;">Try again</button>
      </div>`;
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

const BASE = '/karriere';

function navigate(path) {
  window.location.hash = path;
}

function getFilteredCareers() {
  let list = activeCategory === 'all' ? careers : careers.filter(c => c.category === activeCategory);
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.tagline?.toLowerCase().includes(q) ||
      c.overview?.toLowerCase().includes(q) ||
      (c.what_nobody_tells_you || []).some(p => p?.toLowerCase().includes(q)) ||
      c.salary?.entry?.toLowerCase().includes(q) ||
      (ALIASES[c.id] || []).some(a => a.toLowerCase().includes(q))
    );
  }
  return list;
}


function renderListView() {
  const cats = [...new Set(careers.map(c => c.category))];
  const filtered = getFilteredCareers();
  const totalVoices = careers.reduce((sum, c) => sum + (c.real_experiences ? c.real_experiences.length : 0), 0);

  const filterButtons = `<button class="filter-btn ${activeCategory === 'all' ? 'active' : ''}" data-cat="all" aria-pressed="${activeCategory === 'all'}">All</button>` +
    cats.map(cat => `<button class="filter-btn ${activeCategory === cat ? 'active' : ''}" data-cat="${cat}" aria-pressed="${activeCategory === cat}">${CATEGORY_LABELS[cat] || cat}</button>`).join('');

  const listHtml = filtered.length ? filtered.map(c => {
    const m = CARD_METRICS[c.id] || {};
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
  }).join('') : `<div class="no-results">No careers match "${searchQuery}". Try a different search or clear the filter.</div>`;

  return `
    <div class="wrap">
            <div class="masthead" style="display:flex;align-items:center;justify-content:space-between;">
        <button class="wordmark">${LOGOMARK}<span>Karriere</span></button>
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">${getThemeIcon()}</button>
          <div class="masthead-meta">Vol. 1 — India Edition</div>
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
          <p>Verified salaries, honest timelines, and anonymous accounts from people who lived each path — including the regrets, the burnout, and the work-life trade-offs nobody puts on a brochure.</p>
          <div class="trust-row">
            <span class="trust-item"><span class="trust-check">✓</span>${careers.length} careers covered</span>
            <span class="trust-item"><span class="trust-check">✓</span>${totalVoices} verified testimonies</span>
            <span class="trust-item"><span class="trust-check">✓</span>Updated regularly</span>
            <span class="trust-item"><span class="trust-check">✓</span>Sourced from Reddit, surveys &amp; professionals</span>
          </div>
          <div class="hero-actions">
            <div class="hero-search-row">
              <div class="hero-search-field">
                <svg class="hero-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="hero-search" id="hero-search" placeholder="Search a career — try 'law', 'design', or 'stress-free'" value="${searchQuery}"aria-label="Search careers">
              </div>
            </div>
            <div class="hero-hint">Or browse by stream — <button data-nav-scroll="list-section">jump to the full list ↓</button></div>
          </div>
        </div>
      </div>
      <div class="filter-row" id="list-section">${filterButtons}</div>
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

  const cm = CARD_METRICS[career.id] || {};
  const dm = DETAIL_METRICS[career.id] || {};

  // ── Tab definitions ──
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'realities', label: "What It's Like" },
    { id: 'fit', label: 'Is This for You' },
    { id: 'pay', label: 'Pay & Progression' },
    { id: 'experiences', label: 'Student Experiences' }
  ];

  const tabBar = `
    <div class="detail-tab-bar">
      ${tabs.map(t => `
        <button class="detail-tab ${activeDetailTab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>
      `).join('')}
    </div>`;

  // ── Tab content renderers ──
  const tabContent = renderTabContent(career, cm, dm);

  // ── Verdict card ──
  const verdictHtml = renderVerdictCard(career);

  // ── Related careers ──
  const relatedHtml = (career.related_careers || []).map(rid => {
    const rc = careers.find(c => c.id === rid);
    return rc ? `<button class="related-pill" data-nav="${rc.id}">${rc.name}</button>` : '';
  }).join('');

  return `
    <div class="wrap detail-wrap">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <button class="back-link" data-nav="">← Back to all careers</button>
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">${getThemeIcon()}</button>
      </div>
      <button class="masthead-small">${LOGOMARK}<span>Karriere</span></button>

      <div class="career-header">
        <div class="career-tag">${CATEGORY_ICONS[career.category] || ''} ${CATEGORY_LABELS[career.category] || career.category}</div>
        <h1 class="career-title">${career.name}</h1>
        <p class="career-tagline">${career.tagline}</p>
      </div>

      ${tabBar}

      <div class="detail-tab-content">
        ${tabContent}
      </div>

       <div class="verdict-divider">
        <span class="verdict-divider-label">Your decision</span>
      </div>
      ${verdictHtml}

      <div class="section" style="margin-top:40px;">
        <div class="section-label">Related paths</div>
        <div class="related-row">${relatedHtml || 'None yet'}</div>
      </div>

      <div class="section">
        <button class="compare-cta compare-from-detail" data-nav="compare=${career.id},">Compare with another career</button>
      </div>
      ${career.related_careers && career.related_careers.length ? `
      <div class="section">
        <div class="section-label">Students often compare</div>
        <div class="related-row">${career.related_careers.map(rid => {
          const rc = careers.find(c => c.id === rid);
          return rc ? `<button class="related-pill" data-nav="compare=${career.id},${rc.id}">${rc.name}</button>` : '';
        }).join('')}</div>
      </div>` : ''}
    </div>`;
}
function renderTabContent(career, cm, dm) {
  switch (activeDetailTab) {
    case 'overview': return renderOverviewTab(career, cm, dm);
    case 'realities': return renderRealitiesTab(career, cm, dm);
    case 'fit': return renderFitTab(career, cm, dm);
    case 'pay': return renderPayTab(career, cm, dm);
    case 'experiences': return renderExperiencesTab(career, cm, dm);
    default: return renderOverviewTab(career, cm, dm);
  }
}

function renderOverviewTab(career, cm, dm) {
  return `
    <div class="section-body" style="margin-bottom:24px;">${career.overview}</div>

    <div class="quickfacts-grid">
      <div class="quickfacts-item"><div class="quickfacts-label">Years to qualify</div><div class="quickfacts-value">${cm.duration || '—'}</div></div>
      <div class="quickfacts-item"><div class="quickfacts-label">Entry salary</div><div class="quickfacts-value">${career.salary?.entry || '—'}</div></div>
      <div class="quickfacts-item"><div class="quickfacts-label">Mid-career salary</div><div class="quickfacts-value">${career.salary?.mid || '—'}</div></div>
      <div class="quickfacts-item"><div class="quickfacts-label">Competition</div>${renderQFMeter(cm.competition, 'competition')}</div>
      <div class="quickfacts-item"><div class="quickfacts-label">Stress</div>${renderQFMeter(cm.stress, 'stress')}</div>
      <div class="quickfacts-item"><div class="quickfacts-label">Work-life balance</div>${renderQFMeter(dm.work_life_balance, 'worklife')}</div>
      <div class="quickfacts-item"><div class="quickfacts-label">Job availability</div>${renderQFMeter(dm.job_availability, 'neutral')}</div>
      <div class="quickfacts-item"><div class="quickfacts-label">Abroad prospects</div>${renderQFMeter(dm.abroad_prospects, 'neutral')}</div>
      <div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Ideal personality</div><div class="quickfacts-value quickfacts-text">${dm.ideal_personality || '—'}</div></div>
      ${career.career_outlook ? `
      <div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Career outlook (India)</div><div class="quickfacts-value quickfacts-text">${career.career_outlook.india}</div></div>
      <div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Career outlook (Abroad)</div><div class="quickfacts-value quickfacts-text">${career.career_outlook.abroad}</div></div>
      ` : `
      <div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Career outlook (India)</div><div class="quickfacts-value quickfacts-text">${career.scope?.india || '—'}</div></div>
      <div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Career outlook (Abroad)</div><div class="quickfacts-value quickfacts-text">${career.scope?.abroad || '—'}</div></div>
      `}
    </div>`;
}

function renderRealitiesTab(career, cm, dm) {
  return `
    <div class="section-label">What nobody tells you</div>
    <ul class="pain-list">${career.what_nobody_tells_you.map(p => `<li>${p}</li>`).join('')}</ul>

    <div style="margin-top:32px;">
      <div class="section-label">Reality snapshot</div>
            <div class="snapshot-card">
      <div style="font-size:11px;color:var(--ink-soft);margin-bottom:8px;padding:0 0 8px;border-bottom:1px solid var(--rule);">Scale: 1 = low, 5 = high</div>

        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.salary}</span><span class="snapshot-name">Salary potential</span>${renderStars(dm.salary_potential)}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.stress}</span><span class="snapshot-name">Stress</span>${renderStars(cm.stress)}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.worklife}</span><span class="snapshot-name">Work-life balance</span>${renderStars(dm.work_life_balance)}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.study}</span><span class="snapshot-name">Study difficulty</span>${renderStars(dm.study_difficulty)}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.competition}</span><span class="snapshot-name">Competition</span>${renderStars(cm.competition)}</div>
        <div class="snapshot-row"><span class="snapshot-icon">${SNAPSHOT_ICONS.abroad}</span><span class="snapshot-name">Abroad opportunities</span>${renderStars(dm.abroad_prospects)}</div>
        <div class="snapshot-duration">Average training time: <strong>${cm.duration || '—'}</strong></div>
        <div class="snapshot-quotes">
          <div class="snapshot-quote"><span class="snapshot-quote-label">Biggest misconception</span><span class="snapshot-quote-text">"${dm.misconception || ''}"</span></div>
          <div class="snapshot-quote"><span class="snapshot-quote-label">Most common regret</span><span class="snapshot-quote-text">"${dm.regret || ''}"</span></div>
          <div class="snapshot-quote"><span class="snapshot-quote-label">Most common praise</span><span class="snapshot-quote-text">"${dm.praise || ''}"</span></div>
        </div>
      </div>
    </div>

    <div style="margin-top:32px;">
      <div class="section-label">Why people choose this</div>
      <ul class="love-list">${(career.why_people_love_it || []).map(p => `<li>${p}</li>`).join('')}</ul>
    </div>`;
}

function renderFitTab(career, cm, dm) {
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
    </div>`;
}

function renderPayTab(career, cm, dm) {
  const timelineStages = [
    { label: 'Class 12', sub: 'Entrance exam / cutoff' },
    { label: 'College', sub: cm.duration || '' }
  ];
  if (dm.internship) timelineStages.push({ label: 'Internship', sub: dm.internship });
  timelineStages.push({ label: 'Entry role', sub: career.salary?.entry || '—' });
  timelineStages.push({ label: 'Senior / Established', sub: career.salary?.senior || '—' });

  return `
    <div class="section-label">Salary progression</div>
    <div class="salary-track">
      <div class="salary-row">
        <div class="salary-stage">Entry</div>
        <div class="salary-bar-shell"><div class="salary-bar-fill" data-target="40"><span class="salary-value">${career.salary?.entry || '—'}</span></div></div>
      </div>
      <div class="salary-row">
        <div class="salary-stage">Mid</div>
        <div class="salary-bar-shell"><div class="salary-bar-fill" data-target="68"><span class="salary-value">${career.salary?.mid || '—'}</span></div></div>
      </div>
      <div class="salary-row">
        <div class="salary-stage">Senior</div>
        <div class="salary-bar-shell"><div class="salary-bar-fill" data-target="95"><span class="salary-value">${career.salary?.senior || '—'}</span></div></div>
      </div>
    </div>

    <div style="margin-top:32px;">
      <div class="section-label">Timeline</div>
      <div class="timeline-track">
        ${timelineStages.map((t, i) => `
          <div class="timeline-stage">
            <div class="timeline-dot"></div>
            <div class="timeline-label">${t.label}</div>
            <div class="timeline-sub">${t.sub}</div>
          </div>
          ${i < timelineStages.length - 1 ? '<div class="timeline-line"></div>' : ''}
        `).join('')}
      </div>
    </div>

    <div style="margin-top:32px;">
      <div class="section-label">Typical career progression</div>
      <div class="progression-track">
        ${(dm.progression || []).map((stage, i) => `
          <span class="progression-stage">${stage}</span>
          ${i < dm.progression.length - 1 ? '<span class="progression-arrow">→</span>' : ''}
        `).join('')}
      </div>
    </div>`;
}

function renderExperiencesTab(career, cm, dm) {
  const exps = career.real_experiences || [];
  if (!exps.length) return '<p style="color:var(--ink-faint);">No experiences yet.</p>';

  return exps.map((q, i) => `
    <div class="quote-block" ${i === 0 ? '' : ''}>
      <div class="quote-text">"${q.quote}"</div>
      <a class="quote-source" href="${q.url}" target="_blank" rel="noopener noreferrer">${q.source}${q.url ? ' ↗' : ''}</a>
    </div>
  `).join('');
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
        <ul class="pain-list">${avoid}</ul>
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
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:12px;">Hi, I'm James.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:12px;">I'm currently a student studying in India. While choosing my own career, I found that most guidance online focused on placements, salaries, or promotional content. Honest discussions about the realities of different careers were surprisingly difficult to find.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:12px;">I built Karriere to create the resource I wish I'd had before making my own decision.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);margin-bottom:12px;">The project is still growing, and every career page is continuously refined as I learn more, interview students and professionals, and receive feedback from readers.</p>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);">If Karriere helps even one student avoid choosing the wrong career, it has done its job.</p>
      </div>

      <div class="section">
        <div class="section-label">Help improve Karriere</div>
        <p style="font-size:16px;line-height:1.75;color:var(--ink);">If you notice outdated information, an error, or would like to share your own experience with a career, I'd love to hear from you. Every suggestion helps make Karriere more accurate for the next student.</p>
      </div>
    </div>
  `;
}



function attachListeners() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { activeCategory = btn.dataset.cat; render(false); });
  });
  document.querySelectorAll('.career-entry').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.id));
  });
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.nav));
  });
  document.querySelectorAll('.wordmark, .masthead-small').forEach(el => {
    el.addEventListener('click', () => navigate(''));
  });
  document.querySelectorAll('.salary-bar-fill').forEach(el => {
    requestAnimationFrame(() => setTimeout(() => { el.style.width = el.dataset.target + '%'; }, 80));
  });
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
  // Compare search filtering
  const compareSearchA = document.getElementById('compareSearchA');
  if (compareSearchA) {
    compareSearchA.addEventListener('input', () => {
      const q = compareSearchA.value.trim().toLowerCase();
      document.querySelectorAll('.compare-option').forEach(opt => {
        if (opt.disabled) return;
        const name = opt.querySelector('.compare-option-name')?.textContent.toLowerCase() || '';
        const tagline = opt.querySelector('.compare-option-tagline')?.textContent.toLowerCase() || '';
        const id = opt.dataset.compareId || '';
        const aliases = ALIASES[id] || [];
        const match = name.includes(q) || tagline.includes(q) || aliases.some(a => a.includes(q));
        opt.style.display = match ? '' : 'none';
      });
    });
  }

  const compareSearchB = document.getElementById('compareSearchB');
  if (compareSearchB) {
    compareSearchB.addEventListener('input', () => {
      const q = compareSearchB.value.trim().toLowerCase();
      document.querySelectorAll('.compare-option').forEach(opt => {
        if (opt.disabled) return;
        const name = opt.querySelector('.compare-option-name')?.textContent.toLowerCase() || '';
        const tagline = opt.querySelector('.compare-option-tagline')?.textContent.toLowerCase() || '';
        const id = opt.dataset.compareId || '';
        const aliases = ALIASES[id] || [];
        const match = name.includes(q) || tagline.includes(q) || aliases.some(a => a.includes(q));
        opt.style.display = match ? '' : 'none';
      });
    });
  }
  // Compare option click
  document.querySelectorAll('.compare-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedId = opt.dataset.compareId;
      const slotA = document.getElementById('compareA')?.value;
      const slotB = document.getElementById('compareB')?.value;

      if (slotA && slotB) return; // both filled
      if (!slotA) {
        navigate(`compare=${selectedId},`);
      } else {
        navigate(`compare=${slotA},${selectedId}`);
      }
    });
  });




  const searchInput = document.getElementById('hero-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        searchQuery = searchInput.value;
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
  document.querySelectorAll('[data-nav-scroll]').forEach(scrollBtn => {
    scrollBtn.addEventListener('click', () => {
      document.getElementById(scrollBtn.dataset.navScroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
    // Tab click listeners
  document.querySelectorAll('.detail-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeDetailTab = tab.dataset.tab;
      const id = window.location.hash.replace('#', '');
      if (id && !id.startsWith('compare=') && id !== 'about') {
        const view = document.getElementById('view');
        view.innerHTML = renderDetailView(id);
        attachListeners();
        document.querySelectorAll('.salary-bar-fill').forEach(el => {
          requestAnimationFrame(() => setTimeout(() => { el.style.width = el.dataset.target + '%'; }, 80));
        });
      }
    });
  });
}

let savedScrollY = 0;
async function render(animate = true) {
  await loadCareers();
  const view = document.getElementById('view');
  const hash = window.location.hash.replace('#', '');
  const isCompare = hash.startsWith('compare=');
  const id = isCompare ? '' : hash;


  if (animate) {
    view.classList.add('leaving');
    await new Promise(r => setTimeout(r, 150));
  }
  // Save scroll position before navigating to detail
  if (!id && window.prevScrollY) {
    // Restoring from detail back to list
  }
  if (isCompare) {
    const ids = hash.replace('compare=', '').split(',');
    if (ids.length === 2 && ids[0] && ids[1]) {
      view.innerHTML = renderCompareView(ids[0], ids[1]);
    } else if (ids.length >= 1 && ids[0]) {
      view.innerHTML = renderComparePicker(ids[0]);
    } else {
      view.innerHTML = renderComparePicker(null);
    }
  } else {
    if (id === 'about') {
  view.innerHTML = renderAboutView();
} else {
  view.innerHTML = id ? renderDetailView(id) : renderListView();
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
  if (searchInput && document.activeElement !== searchInput && searchQuery) {
    // preserve focus/caret only when re-rendering from typing; no-op on hash nav
  }
  const career = careers.find(c => c.id === id);
  updateMetaTags(career?.name, career?.tagline);
}
function renderComparePicker(preselectedId) {
  const selected = preselectedId && careers.find(c => c.id === preselectedId);
  let slotAFilled = !!selected;

  const list = careers.map(c => {
    const isSelected = c.id === preselectedId;
    return `
    <button class="compare-option ${isSelected ? 'compare-option-selected' : ''}" data-compare-id="${c.id}" ${isSelected ? 'disabled' : ''}>
      <span class="compare-option-cat">${CATEGORY_LABELS[c.category] || c.category}</span>
      <span class="compare-option-name">${c.name}</span>
      <span class="compare-option-tagline">${c.tagline}</span>
    </button>
  `}).join('');

  const slotA = selected ? `<span class="compare-slot-filled">${selected.name} <button class="compare-slot-remove" data-nav="compare=,">✕</button></span>` : '<span class="compare-slot-empty">—</span>';
  const slotB = '<span class="compare-slot-empty" id="slotB">—</span>';

  return `
    <div class="wrap compare-picker-wrap">
      <button class="back-link" data-nav="">← Back</button>
      <h1 class="compare-picker-title">Compare Careers</h1>
      
      <div class="compare-two">
        <div class="compare-col">
          <div class="compare-col-label">Career 1</div>
          <div class="compare-slot">${slotA}</div>
          <input type="text" class="compare-search" id="compareSearchA" placeholder="Search..." autofocus>
          ${selected ? `<input type="hidden" id="compareA" value="${selected.id}">` : ''}
        </div>
        <div class="compare-vs">vs</div>
        <div class="compare-col">
          <div class="compare-col-label">Career 2</div>
          <div class="compare-slot">${slotB}</div>
          <input type="text" class="compare-search" id="compareSearchB" placeholder="Search...">
          <input type="hidden" id="compareB" value="">
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

  const cmA = CARD_METRICS[a.id] || {};
  const cmB = CARD_METRICS[b.id] || {};
  const dmA = DETAIL_METRICS[a.id] || {};
  const dmB = DETAIL_METRICS[b.id] || {};

  function row(label, valA, valB) {
    return `<div class="comp-row"><div class="comp-label">${label}</div><div class="comp-val comp-a">${valA || '—'}</div><div class="comp-val comp-b">${valB || '—'}</div></div>`;
  }

  function section(title, itemsA, itemsB) {
    const max = Math.max(itemsA ? itemsA.length : 0, itemsB ? itemsB.length : 0);
    let rows = '';
    for (let i = 0; i < max; i++) {
      rows += row('', itemsA?.[i] || '', itemsB?.[i] || '');
    }
    return `
      <div class="comp-section">
        <div class="section-label">${title}</div>
        <div class="comp-table">
          <div class="comp-header"><div class="comp-label"></div><div class="comp-val comp-a">${a.name}</div><div class="comp-val comp-b">${b.name}</div></div>
          ${rows}
        </div>
      </div>`;
  }

  // Decision guide
  const chooseA = (a.choose_if || []).map(c => `<li>${c}</li>`).join('');
  const chooseB = (b.choose_if || []).map(c => `<li>${c}</li>`).join('');
  const avoidA = (a.avoid_if || []).map(c => `<li>${c}</li>`).join('');
  const avoidB = (b.avoid_if || []).map(c => `<li>${c}</li>`).join('');

  return `
    <div class="wrap compare-results-wrap">
      <button class="back-link" data-nav="compare=,">← Back to compare</button>

      <div class="comp-header-banner">
        <h1>${a.name} vs ${b.name}</h1>
      </div>

      <div class="comp-section">
        <div class="section-label">At a Glance</div>
        <div class="comp-table">
          <div class="comp-header"><div class="comp-label"></div><div class="comp-val comp-a">${a.name}</div><div class="comp-val comp-b">${b.name}</div></div>
          ${row('Duration', cmA.duration, cmB.duration)}
          ${row('Entry salary', a.salary?.entry, b.salary?.entry)}
          ${row('Stress level', cmA.stress + '/5', cmB.stress + '/5')}
          ${row('Competition', cmA.competition + '/5', cmB.competition + '/5')}
        </div>
      </div>

      <div class="comp-section">
        <div class="section-label">Reality Snapshot</div>
        <div class="comp-table">
          <div class="comp-header"><div class="comp-label"></div><div class="comp-val comp-a">${a.name}</div><div class="comp-val comp-b">${b.name}</div></div>
          ${row('Salary potential', dmA.salary_potential + '/5', dmB.salary_potential + '/5')}
          ${row('Study difficulty', dmA.study_difficulty + '/5', dmB.study_difficulty + '/5')}
          ${row('Work-life balance', dmA.work_life_balance + '/5', dmB.work_life_balance + '/5')}
          ${row('Job availability', dmA.job_availability + '/5', dmB.job_availability + '/5')}
          ${row('Abroad prospects', dmA.abroad_prospects + '/5', dmB.abroad_prospects + '/5')}
        </div>
      </div>

      ${section('Salary Progression', [a.salary?.entry, a.salary?.mid, a.salary?.senior], [b.salary?.entry, b.salary?.mid, b.salary?.senior])}

      ${section('What Nobody Tells You', a.what_nobody_tells_you?.slice(0, 3), b.what_nobody_tells_you?.slice(0, 3))}

      ${section('Who Thrives Here', a.who_thrives, b.who_thrives)}

      ${section('Who Might Struggle', a.who_regrets_it?.slice(0, 3), b.who_regrets_it?.slice(0, 3))}

      <div class="comp-section comp-decision">
        <div class="section-label">Decision Guide</div>
        <div class="comp-decision-grid">
          <div class="comp-decision-card">
            <div class="comp-decision-name">Choose ${a.name} if...</div>
            <ul class="love-list">${chooseA}</ul>
            <div class="comp-decision-avoid" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--rule);">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--dustred);margin-bottom:8px;">Avoid if...</div>
              <ul class="love-list" style="list-style:none;">${avoidA}</ul>
            </div>
          </div>
          <div class="comp-decision-card">
            <div class="comp-decision-name">Choose ${b.name} if...</div>
            <ul class="love-list">${chooseB}</ul>
            <div class="comp-decision-avoid" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--rule);">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--dustred);margin-bottom:8px;">Avoid if...</div>
              <ul class="love-list" style="list-style:none;">${avoidB}</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

initTheme();
window.addEventListener('hashchange', () => render(true));
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
