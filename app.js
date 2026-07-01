let careers = [];
let activeCategory = 'all';
let searchQuery = '';

const CATEGORY_LABELS = {
  medical: 'Medical', engineering: 'Engineering', commerce: 'Commerce',
  law: 'Law', design: 'Design', management: 'Management', paramedical: 'Paramedical'
};

const CATEGORY_ICONS = {
  medical: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
  engineering: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"></path></svg>',
  commerce: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
  law: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M8 3h8M4 7h6M14 7h6"></path><path d="M2 7l3 7a3.5 3.5 0 0 0 7 0L9 7"></path><path d="M15 7l3 7a3.5 3.5 0 0 0 7 0L22 7"></path></svg>',
  design: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-1-.5-2-2-2h-3a2 2 0 0 1-2-2c0-.8.3-1.3 1-2a2 2 0 0 0-1-3.7A9.9 9.9 0 0 0 12 2z"></path><circle cx="7.5" cy="10.5" r="1"></circle><circle cx="7" cy="15" r="1"></circle><circle cx="11" cy="17.5" r="1"></circle></svg>',
  management: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
  paramedical: '<svg class="cat-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M8 12h8"></path></svg>'
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
  bds: { duration: '5 yrs', stress: 3, competition: 3 },
  cs_engineering: { duration: '4 yrs', stress: 3, competition: 4 },
  ca: { duration: '~5 yrs', stress: 5, competition: 5 },
  law: { duration: '5 yrs', stress: 4, competition: 4 },
  design: { duration: '4 yrs', stress: 3, competition: 5 },
  mba: { duration: '2 yrs', stress: 4, competition: 4 },
  pharmacy: { duration: '4 yrs', stress: 2, competition: 2 },
  paramedical_physiotherapy: { duration: '5 yrs', stress: 3, competition: 2 },
  paramedical_nursing: { duration: '4 yrs', stress: 4, competition: 2 },
  radiology_tech: { duration: '3-4 yrs', stress: 2, competition: 2 }
};

const DETAIL_METRICS = {
  mbbs: { salary_potential: 4, study_difficulty: 5, work_life_balance: 1, job_availability: 5, abroad_prospects: 4,
    ideal_personality: 'Emotionally resilient, high stress tolerance, genuinely curious about biology',
    internship: '1 yr compulsory rotating internship (within MBBS)',
    progression: ['Intern', 'Junior Resident (MD/MS)', 'Senior Resident', 'Consultant / Specialist'],
    misconception: 'Once you finish MBBS, you\'re financially set.', regret: 'I underestimated how long it takes to actually start earning well.',
    praise: 'Helping even one patient makes the difficult days feel worthwhile.' },
  bds: { salary_potential: 3, study_difficulty: 4, work_life_balance: 3, job_availability: 2, abroad_prospects: 2,
    ideal_personality: 'Detail-oriented, hands-on, comfortable running a small business',
    internship: '1 yr compulsory internship',
    progression: ['Intern', 'Associate Dentist', 'MDS Specialist / Clinic Owner', 'Established Private Practice'],
    misconception: 'A dental degree pays like a medical degree.', regret: 'I only chose BDS because I missed the MBBS cutoff.',
    praise: 'Precise, hands-on work with visible, immediate results for patients.' },
  cs_engineering: { salary_potential: 5, study_difficulty: 3, work_life_balance: 3, job_availability: 3, abroad_prospects: 5,
    ideal_personality: 'Self-learner who enjoys problem-solving and constant change',
    internship: 'Typically one summer internship before final year',
    progression: ['SDE 1 / Junior Developer', 'SDE 2 / Mid-level Engineer', 'Senior Engineer / Tech Lead', 'Staff Engineer / EM'],
    misconception: 'Every CS graduate gets a high-paying tech job.', regret: 'I assumed college alone would prepare me — I had to self-learn everything that mattered.',
    praise: 'Skills compound fast, and the ceiling on pay and impact is genuinely high.' },
  ca: { salary_potential: 5, study_difficulty: 5, work_life_balance: 1, job_availability: 5, abroad_prospects: 2,
    ideal_personality: 'Disciplined, persistent, comfortable with delayed gratification',
    internship: '3 yr mandatory articleship (during exams)',
    progression: ['Articleship Trainee', 'Fresher CA (Big 4 / mid-size)', 'Manager (5 yrs)', 'CFO track / Partner / Own Practice'],
    misconception: "CA is a fallback for commerce students who can't do anything else.", regret: 'I thought it would take 3 years — it took me almost 6.',
    praise: "It's one of the most recession-proof, respected qualifications in Indian finance." },
  law: { salary_potential: 5, study_difficulty: 4, work_life_balance: 2, job_availability: 3, abroad_prospects: 2,
    ideal_personality: 'Strong communicator who enjoys reading, arguing, and slow-building a reputation',
    internship: 'Mandatory internships every vacation through the degree',
    progression: ['Junior under a Senior Advocate', 'Mid-level Litigator / Associate', 'Senior Associate / Partner track', 'Senior Advocate / Partner / Judiciary'],
    misconception: 'Law is glamorous courtroom drama from day one.', regret: "I didn't realize litigation pays almost nothing for the first 5-10 years.",
    praise: 'Deeply intellectually engaging work that rewards sharp thinking and persistence.' },
  design: { salary_potential: 4, study_difficulty: 3, work_life_balance: 3, job_availability: 3, abroad_prospects: 4,
    ideal_personality: "Creatively driven self-starter who's comfortable with constant critique",
    internship: 'Internships common in final year for portfolio building',
    progression: ['Junior Designer', 'Product / UX Designer', 'Senior Designer / Design Lead', 'Design Director / Independent Label'],
    misconception: "Design school is easy and mostly about being 'artistic'.", regret: 'Nobody told me how much of the job is business and client management, not just creativity.',
    praise: 'Genuinely creative, varied work — no two days or projects look the same.' },
  mba: { salary_potential: 5, study_difficulty: 3, work_life_balance: 2, job_availability: 3, abroad_prospects: 4,
    ideal_personality: 'Strategic networker with clear career goals going in',
    internship: 'Mandatory summer internship between year 1 and 2',
    progression: ['Associate / Management Trainee', 'Manager (3-5 yrs)', 'Senior Manager / Practice Lead', 'Director / CXO track'],
    misconception: 'An MBA alone guarantees a huge salary jump.', regret: 'I did it right after undergrad with no clear goal — it never fixed that.',
    praise: 'It genuinely opens doors and accelerates people who already have direction.' },
  pharmacy: { salary_potential: 3, study_difficulty: 3, work_life_balance: 4, job_availability: 3, abroad_prospects: 3,
    ideal_personality: 'Detail-oriented, regulation-comfortable, interested in chemistry',
    internship: 'Internships at pharmacies or pharma companies during the degree',
    progression: ['Pharmacist / QA-QC Trainee', 'Store Manager / Industry Executive', 'Regulatory Affairs / QA Manager', 'Chain Owner / Senior Industry Role'],
    misconception: 'Pharmacists just hand out medicines at a counter.', regret: 'I defaulted into retail instead of exploring the better-paying industry roles.',
    praise: "Strong, stable demand thanks to India's massive pharma manufacturing base." },
  paramedical_physiotherapy: { salary_potential: 3, study_difficulty: 3, work_life_balance: 3, job_availability: 3, abroad_prospects: 4,
    ideal_personality: 'Patient, hands-on, genuinely interested in human movement and recovery',
    internship: '1 yr compulsory internship (within the 5-year BPT)',
    progression: ['Intern', 'Junior Physiotherapist', 'Senior Physiotherapist / Practice Building', 'Established Private Practice / Sports Physio'],
    misconception: 'Physiotherapy is a quick, easy medical-adjacent degree.', regret: 'I underestimated how physically demanding the day-to-day work actually is.',
    praise: 'You see steady, tangible progress in patients — deeply satisfying work.' },
  paramedical_nursing: { salary_potential: 3, study_difficulty: 3, work_life_balance: 2, job_availability: 4, abroad_prospects: 5,
    ideal_personality: 'Empathetic, resilient, comfortable with shift work',
    internship: 'Extensive clinical postings throughout the degree',
    progression: ['Staff Nurse (India or abroad)', 'Senior / Charge Nurse', 'Nurse Specialist / Ward Manager', 'Nurse Practitioner / Matron (esp. abroad)'],
    misconception: 'Nursing pays poorly no matter what.', regret: "I didn't plan for licensing exams abroad early enough — it delayed my income by years.",
    praise: 'One of the most globally portable healthcare careers there is.' },
  radiology_tech: { salary_potential: 3, study_difficulty: 2, work_life_balance: 3, job_availability: 4, abroad_prospects: 3,
    ideal_personality: 'Technically minded, precise, comfortable with equipment and shift schedules',
    internship: 'Hospital-based practical training throughout the degree',
    progression: ['Trainee Technologist', 'Radiology Technologist', 'Specialized Technologist (MRI/CT/Sonography)', 'Imaging Center Manager'],
    misconception: 'Radiology technologists read and diagnose scans.', regret: "I didn't realize interpreting scans is the radiologist's job, not mine.",
    praise: 'High demand and comparatively good pay for a paramedical path, without an extremely long education.' }
};

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
  const res = await fetch('careers.json');
  careers = await res.json();
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

function navigate(hash) { window.location.hash = hash; }

function getFilteredCareers() {
  let list = activeCategory === 'all' ? careers : careers.filter(c => c.category === activeCategory);
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q));
  }
  return list;
}

function renderListView() {
  const cats = [...new Set(careers.map(c => c.category))];
  const filtered = getFilteredCareers();
  const totalVoices = careers.reduce((sum, c) => sum + (c.real_experiences ? c.real_experiences.length : 0), 0);
  const spotlight = careers.length ? careers.reduce((a, b) =>
    ((b.real_experiences ? b.real_experiences.length : 0) > (a.real_experiences ? a.real_experiences.length : 0) ? b : a)
  ) : null;

  const filterButtons = `<button class="filter-btn ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">All</button>` +
    cats.map(cat => `<button class="filter-btn ${activeCategory === cat ? 'active' : ''}" data-cat="${cat}">${CATEGORY_LABELS[cat] || cat}</button>`).join('');

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
      <div class="masthead">
        <button class="wordmark">${LOGOMARK}<span>Karriere</span></button>
        <div class="masthead-meta">Vol. 1 — India Edition</div>
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
                <input type="text" class="hero-search" id="hero-search" placeholder="Search a career — try 'law', 'design', or 'stress-free'" value="${searchQuery}">
              </div>
              <button class="hero-cta" data-nav-scroll="list-section">Explore all</button>
            </div>
            <div class="hero-hint">Or browse by stream — <button data-nav-scroll="list-section">jump to the full list ↓</button></div>
          </div>
        </div>
        ${spotlight ? `
        <button class="hero-spotlight" data-nav="${spotlight.id}">
          <div class="hero-spotlight-eyebrow">Most discussed career</div>
          <div class="hero-spotlight-body">
            <div class="hero-spotlight-tag">${CATEGORY_ICONS[spotlight.category] || ''} ${CATEGORY_LABELS[spotlight.category] || spotlight.category}</div>
            <div class="hero-spotlight-name">${spotlight.name}</div>
            <div class="hero-spotlight-tagline">${spotlight.tagline}</div>
            <div class="hero-spotlight-link">Read the full profile <span>→</span></div>
          </div>
        </button>` : ''}
      </div>
      <div class="filter-row" id="list-section">${filterButtons}</div>
      <div class="results-count">Showing ${filtered.length} of ${careers.length} careers</div>
      <div class="career-list">${listHtml}</div>
      <footer>
        <span>Karriere — built for students who deserve the truth.</span>
        <span>${careers.length} careers profiled</span>
      </footer>
    </div>
  `;
}

function renderDetailView(id) {
  const career = careers.find(c => c.id === id);
  if (!career) return `<div class="wrap detail-wrap"><button class="back-link" data-nav="">← Back</button><div class="not-found">Career not found.</div></div>`;
const cm = CARD_METRICS[career.id] || {};
  const dm = DETAIL_METRICS[career.id] || {};
  const timelineStages = [
    { label: 'Class 12', sub: 'Entrance exam / cutoff' },
    { label: 'College', sub: cm.duration || '' }
  ];
  if (dm.internship) timelineStages.push({ label: 'Internship', sub: dm.internship });
  timelineStages.push({ label: 'Entry role', sub: career.salary.entry });
  timelineStages.push({ label: 'Senior / Established', sub: career.salary.senior });

  const relatedHtml = (career.related_careers || []).map(rid => {
    const rc = careers.find(c => c.id === rid);
    return rc ? `<button class="related-pill" data-nav="${rc.id}">${rc.name}</button>` : '';
  }).join('');

  const chooseSection = career.why_people_love_it ? `
    <div class="section">
      <div class="section-label">Why people choose this</div>
      <ul class="love-list">${career.why_people_love_it.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>
  ` : '';

  return `
    <div class="wrap detail-wrap">
      <button class="back-link" data-nav="">← Back to all careers</button>
      <button class="masthead-small">${LOGOMARK}<span>Karriere</span></button>

      <div class="career-header">
        <div class="career-tag">${CATEGORY_ICONS[career.category] || ''} ${CATEGORY_LABELS[career.category] || career.category}</div>
        <h1 class="career-title">${career.name}</h1>
        <p class="career-tagline">${career.tagline}</p>
      </div>

      <div class="section">
        <div class="section-body">${career.overview}
<div class="glance-zone"><div class="glance-eyebrow">At a glance</div> 
<div class="section quickfacts-section">
        <div class="section-label">Quick facts</div>
        <div class="quickfacts-grid">
          <div class="quickfacts-item"><div class="quickfacts-label">Years to qualify</div><div class="quickfacts-value">${cm.duration || '—'}</div></div>
          <div class="quickfacts-item"><div class="quickfacts-label">Entry salary</div><div class="quickfacts-value">${career.salary.entry}</div></div>
          <div class="quickfacts-item"><div class="quickfacts-label">Mid-career salary</div><div class="quickfacts-value">${career.salary.mid}</div></div>
          <div class="quickfacts-item"><div class="quickfacts-label">Competition</div>${renderQFMeter(cm.competition, 'competition')}</div>
          <div class="quickfacts-item"><div class="quickfacts-label">Stress</div>${renderQFMeter(cm.stress, 'stress')}</div>
          <div class="quickfacts-item"><div class="quickfacts-label">Work-life balance</div>${renderQFMeter(dm.work_life_balance, 'worklife')}</div>
          <div class="quickfacts-item"><div class="quickfacts-label">Job availability</div>${renderQFMeter(dm.job_availability, 'neutral')}</div>
          <div class="quickfacts-item"><div class="quickfacts-label">Abroad prospects</div>${renderQFMeter(dm.abroad_prospects, 'neutral')}</div>
          <div class="quickfacts-item quickfacts-wide"><div class="quickfacts-label">Ideal personality</div><div class="quickfacts-value quickfacts-text">${dm.ideal_personality || '—'}</div></div>
        </div>
      </div>

      <div class="section snapshot-section">
        <div class="section-label">Reality snapshot</div>
        <div class="snapshot-card">
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

      <div class="section">
        <div class="section-label">Salary progression</div>
        <div class="salary-track">
          <div class="salary-row">
            <div class="salary-stage">Entry</div>
            <div class="salary-bar-shell"><div class="salary-bar-fill" data-target="40"><span class="salary-value">${career.salary.entry}</span></div></div>
          </div>
          <div class="salary-row">
            <div class="salary-stage">Mid</div>
            <div class="salary-bar-shell"><div class="salary-bar-fill" data-target="68"><span class="salary-value">${career.salary.mid}</span></div></div>
          </div>
          <div class="salary-row">
            <div class="salary-stage">Senior</div>
            <div class="salary-bar-shell"><div class="salary-bar-fill" data-target="95"><span class="salary-value">${career.salary.senior}</span></div></div>
          </div>
        </div>
      </div>

      <div class="section timeline-section">
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

      <div class="section progression-section">
        <div class="section-label">Typical career progression</div>
        <div class="progression-track">
          ${(dm.progression || []).map((stage, i) => `
            <span class="progression-stage">${stage}</span>
            ${i < dm.progression.length - 1 ? '<span class="progression-arrow">→</span>' : ''}
          `).join('')}
        </div>
      </div>
</div>
      </div>

        <div class="section-label">What nobody tells you</div>
        <ul class="pain-list">${career.what_nobody_tells_you.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>

      <div class="section">
        <div class="section-label">Who thrives here</div>
        <div class="fit-grid">
          <div class="fit-card">
            <div class="fit-label">Thrives here</div>
            <ul>${career.who_thrives.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
          <div class="fit-card struggle">
            <div class="fit-label">Who might struggle</div>
            <ul>${career.who_regrets_it.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-label">A day in the life</div>
        <div class="dayinlife-grid">
          <div class="dayinlife-card">
            <div class="dayinlife-role">As a student</div>
            <div class="dayinlife-text">${career.day_in_the_life.student}</div>
          </div>
          <div class="dayinlife-card">
            <div class="dayinlife-role">As a professional</div>
            <div class="dayinlife-text">${career.day_in_the_life.professional}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-label">Scope</div>
        <div class="scope-grid">
          <div class="scope-card">
            <div class="section-label">In India</div>
            <div class="scope-text">${career.scope.india}</div>
          </div>
          <div class="scope-card">
            <div class="section-label">Abroad</div>
            <div class="scope-text">${career.scope.abroad}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-label">Testimonies</div>
        ${career.real_experiences.map(q => `
          <div class="quote-block">
            <div class="quote-text">"${q.quote}"</div>
            <a class="quote-source" href="${q.url}" target="_blank" rel="noopener noreferrer">${q.source}${q.url ? ' ↗' : ''}</a>
          </div>
        `).join('')}
      </div>

      ${relatedHtml ? `
      <div class="section">
        <div class="section-label">Related paths</div>
        <div class="related-row">${relatedHtml}</div>
      </div>` : ''}
    </div>
  `;
}

function attachListeners() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { activeCategory = btn.dataset.cat; render(false); });
  });
  document.querySelectorAll('.career-entry').forEach(btn => {
    btn.addEventListener('click', () => navigate('#' + btn.dataset.id));
  });
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.nav ? '#' + btn.dataset.nav : ''));
  });
  document.querySelectorAll('.wordmark, .masthead-small').forEach(el => {
    el.addEventListener('click', () => navigate(''));
  });
  document.querySelectorAll('.salary-bar-fill').forEach(el => {
    requestAnimationFrame(() => setTimeout(() => { el.style.width = el.dataset.target + '%'; }, 80));
  });
  const searchInput = document.getElementById('hero-search');
  if (searchInput) {
    searchInput.addEventListener('input', async () => {
      searchQuery = searchInput.value;
      const cursorPos = searchInput.selectionStart;
      await render(false);
      const newInput = document.getElementById('hero-search');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(cursorPos, cursorPos);
      }
    });
  }
  document.querySelectorAll('[data-nav-scroll]').forEach(scrollBtn => {
    scrollBtn.addEventListener('click', () => {
      document.getElementById(scrollBtn.dataset.navScroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

async function render(animate = true) {
  await loadCareers();
  const view = document.getElementById('view');
  const id = window.location.hash.replace('#', '');
  if (animate) {
    view.classList.add('leaving');
    await new Promise(r => setTimeout(r, 150));
  }
  view.innerHTML = id ? renderDetailView(id) : renderListView();
  view.classList.remove('leaving');
  if (animate) window.scrollTo({ top: 0, behavior: 'instant' });
  attachListeners();
  const searchInput = document.getElementById('hero-search');
  if (searchInput && document.activeElement !== searchInput && searchQuery) {
    // preserve focus/caret only when re-rendering from typing; no-op on hash nav
  }
}

window.addEventListener('hashchange', () => render(true));
render(true);
