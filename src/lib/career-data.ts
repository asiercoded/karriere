/* ─────────────────────────────────────────────────────────────
   Types, helpers, quiz + scoring logic.

   NOTE: careers.json is deliberately NOT imported here. The heavy
   dataset lives in career-profiles.ts and is loaded lazily via
   `loadCareerData()` (career-loader.ts) so the 488 KB file never
   rides inside the entry bundle — see #4 of the perf pass.
   ───────────────────────────────────────────────────────────── */

export interface SalaryRange {
  min?: number;
  max?: number;
}

export interface CareerPath {
  id: string;
  name: string;
  pathway: string[];
  time: string;
  salary: string;
  likelihood: "most_graduates" | "common" | "some" | "few";
  gateType: string;
  explanation: string;
  difficulty: string;
  watchOut: string;
  timeParsed: { min: number; max: number };
}

export interface RealExperience {
  source: string;
  quote: string;
  url?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CareerMetrics {
  duration: string;
  stress: number;
  competition: number;
  salaryPotential: number;
  studyDifficulty: number;
  workLifeBalance: number;
  jobAvailability: number;
  abroadProspects: number;
  idealPersonality: string;
  internship: string;
  progression: string[];
  misconception: string;
  regret: string;
  praise: string;
}

export interface SourceRef {
  label: string;
  url?: string;
}

export interface CareerProfile {
  id: string;
  name: string;
  category: string;
  tagline: string;
  verdict: string;
  lastVerified: string;
  sources: SourceRef[];
  overview: string;
  tags: string[];
  whyPeopleLoveIt: string[];
  whatNobodyTellsYou: string[];
  salary: { entry: string; mid: string; senior: string };
  salaryParsed: { entry: SalaryRange; mid: SalaryRange; senior: SalaryRange };
  careerOutlook: { india: string; abroad: string };
  whoThrives: string[];
  whoRegretsIt: string[];
  beforeYouCommit: string[];
  chooseIf: string[];
  avoidIf: string[];
  realExperiences: RealExperience[];
  relatedCareers: string[];
  careerPaths: CareerPath[];
  metrics: CareerMetrics;
  faq: FaqItem[];
  durationParsed: number;
}

/* ─────────────────────────────────────────────────────────────
   Categories
   ───────────────────────────────────────────────────────────── */

export const categories = [
  { id: "engineering", label: "Engineering" },
  { id: "medical", label: "Medical" },
  { id: "commerce", label: "Commerce" },
  { id: "civil_services", label: "Civil Services & Govt" },
  { id: "law", label: "Law" },
  { id: "management", label: "Management" },
  { id: "paramedical", label: "Paramedical" },
  { id: "design", label: "Design" },
  { id: "life_sciences", label: "Life Sciences" },
  { id: "humanities", label: "Humanities" },
];

export function categoryLabel(id: string): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function careersInCategory(careers: CareerProfile[], id: string): CareerProfile[] {
  return careers.filter((c) => c.category === id);
}

/* ─────────────────────────────────────────────────────────────
   Entry gates & streams — how you actually get in, and who's
   eligible. Authored per career (the JSON's per-path `gate_type`
   describes the path's character, not degree entry), so the
   explorer can answer "does this need NEET?" / "can I do this
   from Commerce?" — the questions parents actually ask.
   ───────────────────────────────────────────────────────────── */

export type StreamId = "pcm" | "pcb" | "commerce" | "humanities" | "any";

export const STREAM_META: { id: StreamId; label: string }[] = [
  { id: "pcm", label: "Science (PCM)" },
  { id: "pcb", label: "Science (PCB)" },
  { id: "commerce", label: "Commerce" },
  { id: "humanities", label: "Humanities" },
  { id: "any", label: "Any stream" },
];

export const ENTRY_GATE_LABELS: Record<string, string> = {
  "neet-ug": "NEET-UG",
  "jee-main": "JEE Main",
  clat: "CLAT",
  cuet: "CUET",
  nid: "NID / NIFT",
  nata: "NATA + JEE",
  upsc: "UPSC CSE",
  cat: "CAT / GMAT",
  "ca-foundation": "CA Foundation",
  icar: "ICAR AIEEA",
  nchmct: "NCHMCT JEE",
  "state-cet": "State CET",
  merit: "Merit / direct",
  none: "Direct admission",
};

/** `streams` is the realistic entry eligibility; "any" means open to every stream. */
const ENTRY_META: Record<string, { gate: string; streams: StreamId[] }> = {
  // Engineering
  cs_engineering: { gate: "jee-main", streams: ["pcm"] },
  bca_mca: { gate: "merit", streams: ["any"] },
  core_engineering: { gate: "jee-main", streams: ["pcm"] },
  // Medical
  mbbs: { gate: "neet-ug", streams: ["pcb"] },
  bds: { gate: "neet-ug", streams: ["pcb"] },
  pharmacy: { gate: "state-cet", streams: ["pcb"] },
  bams: { gate: "neet-ug", streams: ["pcb"] },
  bhms: { gate: "neet-ug", streams: ["pcb"] },
  // Commerce
  ca: { gate: "ca-foundation", streams: ["any"] },
  bcom: { gate: "merit", streams: ["commerce"] },
  bba: { gate: "merit", streams: ["any"] },
  economics: { gate: "merit", streams: ["any"] },
  // Civil services & govt
  upsc: { gate: "upsc", streams: ["any"] },
  // Law
  law: { gate: "clat", streams: ["any"] },
  // Management
  mba: { gate: "cat", streams: ["any"] },
  hotel_management: { gate: "nchmct", streams: ["any"] },
  // Paramedical
  paramedical_nursing: { gate: "state-cet", streams: ["pcb"] },
  paramedical_physiotherapy: { gate: "neet-ug", streams: ["pcb"] },
  radiology_tech: { gate: "merit", streams: ["pcb"] },
  // Design
  design: { gate: "nid", streams: ["any"] },
  architecture: { gate: "nata", streams: ["pcm"] },
  // Life sciences
  biotechnology: { gate: "jee-main", streams: ["pcm", "pcb"] },
  food_technology: { gate: "state-cet", streams: ["pcm", "pcb"] },
  agriculture: { gate: "icar", streams: ["pcm", "pcb"] },
  zoology: { gate: "cuet", streams: ["pcb"] },
  botany: { gate: "cuet", streams: ["pcb"] },
  // Humanities
  psychology: { gate: "merit", streams: ["any"] },
  journalism: { gate: "merit", streams: ["any"] },
  bed_teaching: { gate: "merit", streams: ["any"] },
  ba_humanities: { gate: "merit", streams: ["any"] },
};

const FALLBACK_ENTRY = { gate: "merit", streams: ["any"] as StreamId[] };

export function entryMeta(career: CareerProfile | string): {
  gate: string;
  gateLabel: string;
  isExam: boolean;
  streams: StreamId[];
} {
  const id = typeof career === "string" ? career : career.id;
  const meta = ENTRY_META[id] ?? FALLBACK_ENTRY;
  return {
    gate: meta.gate,
    gateLabel: ENTRY_GATE_LABELS[meta.gate] ?? meta.gate,
    isExam: !["merit", "none"].includes(meta.gate),
    streams: meta.streams,
  };
}

export function careerMatchesStream(career: CareerProfile, stream: StreamId | "all"): boolean {
  if (stream === "all") return true;
  const meta = ENTRY_META[career.id] ?? FALLBACK_ENTRY;
  return meta.streams.includes("any") || meta.streams.includes(stream);
}

/* ─────────────────────────────────────────────────────────────
   Salary helpers (annual figures in ₹, as stored)
   ───────────────────────────────────────────────────────────── */

export function getMid(range?: SalaryRange): number {
  if (!range || (!range.min && !range.max)) return 0;
  if (!range.min) return range.max ?? 0;
  if (!range.max) return range.min;
  return (range.min + range.max) / 2;
}

export function formatLakhs(annual: number): string {
  if (!annual) return "—";
  if (annual >= 10000000) return `₹${(annual / 10000000).toFixed(1)} Cr`;
  if (annual >= 100000) return `₹${(annual / 100000).toFixed(annual % 100000 === 0 ? 0 : 1)} L`;
  return `₹${(annual / 12000).toFixed(1)}k/mo`;
}

export function formatSalaryRange(range?: SalaryRange): string {
  if (!range || (!range.min && !range.max)) return "—";
  if (range.min && range.max) return `${formatLakhs(range.min)}–${formatLakhs(range.max)}`;
  return formatLakhs(range.min ?? range.max ?? 0);
}

/** Entry/mid/senior bar widths as percentages of the career's own senior figure. */
export function calculateSalaryPercentage(parsed: CareerProfile["salaryParsed"]): {
  entry: number;
  mid: number;
  senior: number;
} {
  const e = getMid(parsed.entry);
  const m = getMid(parsed.mid);
  const s = getMid(parsed.senior);
  const max = Math.max(e, m, s, 1);
  return {
    entry: e ? Math.max(18, (e / max) * 100) : 18,
    mid: m ? Math.max(38, (m / max) * 100) : 38,
    senior: s ? (s / max) * 100 : 100,
  };
}

/** Turns an entry salary into what it means for a 20-something's life. */
export function getSalaryContext(entryParsed?: SalaryRange): string | null {
  if (!entryParsed || (!entryParsed.min && !entryParsed.max)) return null;
  const annual = getMid(entryParsed);
  if (!annual) return null;
  const monthly = annual / 12;
  if (monthly < 30000) return "Enough for basics in a Tier-2 city. Tight in metros without family support.";
  if (monthly < 70000) return "Comfortable independent living in most Indian cities.";
  if (monthly < 150000) return "Solid early income — above what most freshers see.";
  return "Well above average from day one. Financially comfortable immediately.";
}

/** Class 12 → established role, in years, from degree length + realistic path spans. */
export function journeySummary(career: CareerProfile): string | null {
  const realistic = career.careerPaths.filter((p) => p.likelihood !== "few");
  if (!realistic.length) return null;
  const mins = realistic.map((p) => p.timeParsed.min);
  const maxs = realistic.map((p) => p.timeParsed.max);
  const estMin = career.durationParsed + Math.min(...mins);
  const estMax = career.durationParsed + Math.max(...maxs);
  return estMax > estMin
    ? `From Class 12 to an established role: ~${Math.round(estMin)}–${Math.round(estMax)} yrs`
    : `From Class 12 to an established role: ~${Math.round(estMin)} yrs`;
}

/* ─────────────────────────────────────────────────────────────
   Metrics metadata
   ───────────────────────────────────────────────────────────── */

export type MetricNumberKey =
  | "stress"
  | "competition"
  | "salaryPotential"
  | "studyDifficulty"
  | "workLifeBalance"
  | "jobAvailability"
  | "abroadProspects";

export const metricMeta: {
  key: MetricNumberKey;
  label: string;
  goodWhen: "high" | "low";
}[] = [
  { key: "salaryPotential", label: "Salary potential", goodWhen: "high" },
  { key: "stress", label: "Stress", goodWhen: "low" },
  { key: "workLifeBalance", label: "Work-life balance", goodWhen: "high" },
  { key: "studyDifficulty", label: "Study difficulty", goodWhen: "low" },
  { key: "competition", label: "Competition (entrance)", goodWhen: "low" },
  { key: "jobAvailability", label: "Job availability", goodWhen: "high" },
  { key: "abroadProspects", label: "Abroad opportunities", goodWhen: "high" },
];

export const pathLikelihoodLabels: Record<string, string> = {
  most_graduates: "Most graduates",
  common: "Common",
  some: "Some",
  few: "Few",
};

/* ─────────────────────────────────────────────────────────────
   Search — degrees, jobs, and vibes
   ───────────────────────────────────────────────────────────── */

function searchableText(career: CareerProfile): string {
  return [
    career.name,
    career.tagline,
    career.overview,
    categoryLabel(career.category),
    ...career.tags,
    ...career.whoThrives,
    ...career.whoRegretsIt,
    ...career.careerPaths.map((p) => `${p.name} ${p.explanation} ${p.salary}`),
  ]
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
}

const METRIC_KEYWORDS: Record<string, MetricNumberKey> = {
  stress: "stress",
  "work-life": "workLifeBalance",
  "work life": "workLifeBalance",
  salary: "salaryPotential",
  pay: "salaryPotential",
  money: "salaryPotential",
  abroad: "abroadProspects",
  overseas: "abroadProspects",
  competition: "competition",
  difficulty: "studyDifficulty",
  "job availability": "jobAvailability",
  demand: "jobAvailability",
};

export function searchCareers(careers: CareerProfile[], query: string): CareerProfile[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...careers];

  const tokens = q.split(/\s+/).map((t) => t.replace(/[^a-z0-9]+/g, " ").trim()).filter(Boolean);

  const scored = careers.map((career) => {
    const text = searchableText(career);
    let score = 0;
    for (const token of tokens) {
      if (token && text.includes(token)) score += 2;
    }
    // Vibe keywords → metric alignment (e.g. "stress-free" → low stress)
    const keyword = Object.keys(METRIC_KEYWORDS).find((k) => q.includes(k));
    if (keyword) {
      const key = METRIC_KEYWORDS[keyword];
      const value = career.metrics[key];
      if (key === "stress" || key === "studyDifficulty" || key === "competition") {
        if (value <= 2) score += 3;
        else if (value === 3) score += 1;
      } else {
        if (value >= 4) score += 3;
        else if (value === 3) score += 1;
      }
    }
    return { career, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.career);
}

/* ─────────────────────────────────────────────────────────────
   Quiz
   ───────────────────────────────────────────────────────────── */

export interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: { label: string; value: string }[];
}

export interface QuizAnswers {
  interests: string;
  workStyle: "people" | "hands_on" | "ideas" | "building";
  pace: "soon" | "moderate" | "long";
  stability: "stable" | "compete" | "high_reward";
  values: "income" | "helping" | "creativity" | "security" | "service" | "respect";
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "interests",
    question: "What draws you in?",
    subtitle: "Pick the broad field you're genuinely curious about — not the one others expect.",
    options: [
      { label: "Medicine & Healthcare", value: "medical" },
      { label: "Paramedical & Allied Health", value: "paramedical" },
      { label: "Life Sciences (Zoology, Botany…)", value: "life_sciences" },
      { label: "Humanities & Social Sciences", value: "humanities" },
      { label: "Civil Services & Government", value: "civil_services" },
      { label: "Engineering & Technology", value: "engineering" },
      { label: "Commerce & Finance", value: "commerce" },
      { label: "Law & Justice", value: "law" },
      { label: "Design & Creative", value: "design" },
      { label: "Business & Management", value: "management" },
    ],
  },
  {
    id: "workStyle",
    question: "How do you like to work?",
    subtitle: "The kind of work that gives you energy — not what sounds impressive.",
    options: [
      { label: "With people — helping, teaching, caring", value: "people" },
      { label: "With my hands — practical, physical work", value: "hands_on" },
      { label: "With ideas & data — analyzing, thinking", value: "ideas" },
      { label: "Building & creating — making things", value: "building" },
    ],
  },
  {
    id: "pace",
    question: "How soon do you want to earn?",
    subtitle: "Every path trades time for money. Be honest about what you can wait for.",
    options: [
      { label: "As soon as possible", value: "soon" },
      { label: "A normal 3–4 year degree is fine", value: "moderate" },
      { label: "I'll invest years for a bigger payoff", value: "long" },
    ],
  },
  {
    id: "stability",
    question: "How do you feel about risk and competition?",
    subtitle: "There's no wrong answer — this decides which trade-offs actually suit you.",
    options: [
      { label: "I want a stable, secure path", value: "stable" },
      { label: "Competition doesn't scare me", value: "compete" },
      { label: "Highest reward, whatever it takes", value: "high_reward" },
    ],
  },
  {
    id: "values",
    question: "What matters most in the end?",
    subtitle: "Your values shape whether a career feels right five years in.",
    options: [
      { label: "High income", value: "income" },
      { label: "Helping others", value: "helping" },
      { label: "Creative freedom", value: "creativity" },
      { label: "Job security", value: "security" },
      { label: "Serving the public", value: "service" },
      { label: "Social respect", value: "respect" },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   Scoring — one explicit axis per question, coarse points,
   and a readable reason for every signal that landed.
   The field pick (Q1) anchors the result; everything else
   refines the order within and near that field.
   ───────────────────────────────────────────────────────────── */

const CATEGORY_SIMILARITY: Record<string, string[]> = {
  medical: ["paramedical", "life_sciences"],
  paramedical: ["medical", "life_sciences"],
  life_sciences: ["paramedical", "medical", "humanities"],
  humanities: ["life_sciences", "civil_services", "law"],
  civil_services: ["humanities", "law", "management"],
  engineering: ["design", "management"],
  commerce: ["management", "law"],
  law: ["commerce", "civil_services", "humanities"],
  design: ["engineering", "humanities"],
  management: ["commerce", "engineering"],
};

/** Stem-based keyword counter: "communicat" matches "communication". */
function stemCount(text: string, stems: string[]): number {
  return stems.reduce((n, s) => n + (new RegExp(`\\b${s}`, "i").test(text) ? 1 : 0), 0);
}

const WORK_STYLE_STEMS: Record<string, string[]> = {
  // No bare "people" — every who-thrives list opens with "People who…", so
  // it would score for all careers and make the people axis meaningless.
  people: ["patient", "help", "communicat", "interact", "social", "counsel", "teach", "empath", "listen", "kind", "team", "client"],
  hands_on: ["hands", "practical", "clinic", "lab", "manual", "dexterity", "physical", "site", "field", "rehabilitat"],
  ideas: ["data", "number", "analyt", "logic", "code", "comput", "research", "math", "detail", "precision", "financial", "statistic", "analysis"],
  // "start" is excluded: "Students who start young" is not a maker signal.
  building: ["build", "creat", "design", "make", "own", "invent", "construct", "architect", "write", "art"],
};

export interface CareerMatch {
  career: CareerProfile;
  score: number;
  reasons: string[];
}

export function getRecommendations(careers: CareerProfile[], answers: QuizAnswers): CareerMatch[] {
  const matches = careers.map((career) => {
    const thrives = [...career.whoThrives, career.metrics.idealPersonality].join(" ");
    const points: { label: string; text: string; p: number }[] = [];

    // 1. Field — the anchor. A direct pick outweighs every other signal, so a
    // Civil Services student can't be outranked by MBBS just because both are
    // "long + stable + service" on the other axes.
    if (answers.interests === career.category) {
      points.push({
        label: "interests",
        text: `You picked ${categoryLabel(answers.interests)} — ${career.name} sits squarely in that field.`,
        p: 6,
      });
    } else if (CATEGORY_SIMILARITY[answers.interests]?.includes(career.category)) {
      points.push({
        label: "interests",
        text: `You picked ${categoryLabel(answers.interests)} — ${career.name} is a close allied path.`,
        p: 2,
      });
    }

    // 2. Work style — one axis, coarse score from who-thrives prose.
    const styleScore = Math.min(3, stemCount(thrives, WORK_STYLE_STEMS[answers.workStyle]));
    if (styleScore > 0) {
      const styleText: Record<QuizAnswers["workStyle"], string> = {
        people: "You chose people-focused work — this career centers on people.",
        hands_on: "You chose hands-on work — the day-to-day is practical and active.",
        ideas: "You chose ideas & data — this path runs on analysis and precision.",
        building: "You chose building & creating — this path is about making things.",
      };
      points.push({ label: "workStyle", text: styleText[answers.workStyle], p: styleScore });
    }

    // 3. Pace — real numbers: study length vs entry pay vs senior ceiling.
    const duration = career.durationParsed;
    const entry = getMid(career.salaryParsed.entry);
    const senior = getMid(career.salaryParsed.senior);
    if (answers.pace === "soon") {
      const entryScore = entry >= 600000 ? 3 : entry >= 300000 ? 2 : entry >= 150000 ? 1 : 0;
      const p = Math.max(0, entryScore - (duration > 5 ? 1 : 0));
      if (p > 0) points.push({ label: "pace", text: `You want to earn soon — entry pay here is ${formatLakhs(entry)} after ~${duration} yrs of study.`, p });
    } else if (answers.pace === "moderate") {
      const p = duration >= 3 && duration < 4.5 ? 2 : duration >= 2 && duration < 5.5 ? 1 : 0;
      if (p > 0) points.push({ label: "pace", text: `You want a standard-length degree — this is ~${duration} yrs of study.`, p });
    } else {
      const p = Math.min(4, (duration >= 5.5 ? 3 : duration >= 4.5 ? 2 : 1) + (senior >= 1500000 ? 1 : 0));
      points.push({ label: "pace", text: `You're open to the long game — ~${duration} yrs of study, with a ${formatLakhs(senior)} senior ceiling.`, p });
    }

    // 4. Risk & competition — straight from the metrics.
    const { competition, jobAvailability, salaryPotential, stress } = career.metrics;
    if (answers.stability === "stable") {
      const p = Math.max(0, jobAvailability - 3) + Math.max(0, 3 - competition) + (stress <= 2 ? 1 : 0);
      if (p > 0) points.push({ label: "stability", text: `You want stability — job availability here is ${jobAvailability}/5, entrance competition ${competition}/5.`, p });
    } else if (answers.stability === "compete") {
      const p = Math.min(3, Math.max(0, salaryPotential - 2) + Math.max(0, jobAvailability - 2));
      if (p > 0) points.push({ label: "stability", text: `You're fine with competition — it's ${competition}/5 here, with ${jobAvailability}/5 job availability after.`, p });
    } else {
      const p = Math.min(4, Math.max(0, salaryPotential - 2) + (senior >= 1500000 ? 1 : 0));
      if (p > 0) points.push({ label: "stability", text: `You want maximum reward — salary potential ${salaryPotential}/5, senior ceiling ${formatLakhs(senior)}.`, p });
    }

    // 5. Values — one pick, from metrics + what the field is really about.
    switch (answers.values) {
      case "income": {
        const p = Math.max(0, salaryPotential - 2) + (senior >= 1000000 ? 1 : 0);
        if (p > 0) points.push({ label: "values", text: `You value income — ${formatLakhs(entry)} at entry, ${formatLakhs(senior)} senior.`, p });
        break;
      }
      case "helping": {
        const p = stemCount(thrives, ["help", "patient", "impact", "compassion", "empath", "kind"]) + (career.category === "medical" || career.category === "paramedical" ? 1 : 0);
        if (p > 0) points.push({ label: "values", text: "You value helping others — this is a people-first career.", p });
        break;
      }
      case "creativity": {
        const p = stemCount(thrives, ["creativ", "design", "imagination", "aesthetic", "visual", "art"]) + (career.category === "design" ? 1.5 : 0);
        if (p > 0) points.push({ label: "values", text: "You value creative freedom — the work here is design-led.", p });
        break;
      }
      case "security": {
        const p = Math.max(0, jobAvailability - 2) + (competition <= 3 ? 1 : 0);
        if (p > 0) points.push({ label: "values", text: `You value security — job availability here is ${jobAvailability}/5.`, p });
        break;
      }
      case "service": {
        const p = stemCount(thrives, ["public", "serve", "nation", "society", "govern", "admin", "civil"]) + (career.category === "civil_services" ? 2 : career.category === "law" || career.category === "medical" ? 1 : 0);
        if (p > 0) points.push({ label: "values", text: "You value public service — this path serves the public directly.", p });
        break;
      }
      case "respect": {
        const p = stemCount(thrives, ["respect", "prestige", "trust", "profession", "reputation"]) + (career.category === "medical" || career.category === "law" || career.category === "civil_services" ? 1 : 0) + (career.id === "ca" ? 1 : 0);
        if (p > 0) points.push({ label: "values", text: "You value social respect — this is a high-trust profession.", p });
        break;
      }
    }

    const total = points.reduce((sum, pt) => sum + pt.p, 0);
    const reasons = points
      .slice()
      .sort((a, b) => b.p - a.p)
      .slice(0, 3)
      .map((pt) => pt.text);
    return { career, score: total, reasons };
  });

  return matches.sort((a, b) => b.score - a.score).slice(0, 6);
}

/* ─────────────────────────────────────────────────────────────
   Compare helpers
   ───────────────────────────────────────────────────────────── */

export function pickWinner(
  valA: number | null | undefined,
  valB: number | null | undefined,
  direction: "higher" | "lower",
): "a" | "b" | null {
  if (valA == null || valB == null || valA === valB) return null;
  if (direction === "higher") return valA > valB ? "a" : "b";
  return valA < valB ? "a" : "b";
}

export function verdictNarrative(a: CareerProfile, b: CareerProfile): string[] {
  const sentences: string[] = [];
  const entryA = getMid(a.salaryParsed.entry);
  const entryB = getMid(b.salaryParsed.entry);
  const seniorA = getMid(a.salaryParsed.senior);
  const seniorB = getMid(b.salaryParsed.senior);

  if (entryA && entryB && Math.abs(entryA - entryB) / Math.max(entryA, entryB) > 0.15) {
    const higher = entryA > entryB ? a : b;
    const lower = entryA > entryB ? b : a;
    sentences.push(`${higher.name} pays more at the start (${formatLakhs(Math.max(entryA, entryB))} vs ${formatLakhs(Math.min(entryA, entryB))}) — important if you need early financial independence.`);
  }
  if (seniorA && seniorB) {
    if (seniorA > seniorB * 1.3) sentences.push(`${a.name} has the higher ceiling over 10+ years (${formatLakhs(seniorA)} vs ${formatLakhs(seniorB)}), but that money comes later and is harder to reach.`);
    else if (seniorB > seniorA * 1.3) sentences.push(`${b.name} has the higher ceiling over 10+ years (${formatLakhs(seniorB)} vs ${formatLakhs(seniorA)}), but that money comes later and is harder to reach.`);
  }
  const balA = a.metrics.workLifeBalance - a.metrics.stress;
  const balB = b.metrics.workLifeBalance - b.metrics.stress;
  if (Math.abs(balA - balB) >= 2) {
    const easier = balA > balB ? a : b;
    const harder = balA > balB ? b : a;
    sentences.push(`${easier.name} is the calmer day-to-day: better work-life balance and less stress (${easier.metrics.workLifeBalance}/5 vs ${harder.metrics.workLifeBalance}/5 balance, ${easier.metrics.stress}/5 vs ${harder.metrics.stress}/5 stress).`);
  }
  if (a.durationParsed && b.durationParsed && a.durationParsed !== b.durationParsed) {
    const shorter = a.durationParsed < b.durationParsed ? a : b;
    const longer = a.durationParsed < b.durationParsed ? b : a;
    sentences.push(`${shorter.name} gets you earning sooner (~${shorter.durationParsed} yrs of study vs ~${longer.durationParsed}), which matters more than most 17-year-olds expect.`);
  }
  if (!sentences.length) {
    sentences.push(`Both are defensible — ${a.name} and ${b.name} score similarly on the metrics that matter. Pick based on which day-to-day reality you'd rather live, then verify with the reviews below.`);
  }
  sentences.push("The table shows which path wins each metric — not which is 'better'. Better depends on your tolerance for delay, stress, and money.");
  return sentences;
}
