import careersJson from "./careers.json";
import reviewsOverrides from "./reviews-overrides.json";
import type { CareerPath, CareerProfile, SourceRef } from "./career-data";

/* ─────────────────────────────────────────────────────────────
   The heavy module: careers.json + reviews-overrides.json are
   statically imported HERE and only here. Everything else loads
   this file lazily via `loadCareerData()` (see career-loader.ts),
   so the ~488 KB dataset ships as its own async chunk instead of
   riding inside every route's bundle — the difference between
   usable and abandoned on a cheap Android + Jio connection.
   ───────────────────────────────────────────────────────────── */

/* ── Raw JSON shapes (snake_case, as authored) ── */

interface RawSalaryRange {
  min?: number;
  max?: number;
}

interface RawCareer {
  id: string;
  name: string;
  category: string;
  tagline: string;
  verdict: string;
  last_verified: string;
  sources: SourceRef[];
  overview: string;
  tags: string[];
  why_people_love_it: string[];
  what_nobody_tells_you: string[];
  salary: { entry: string; mid: string; senior: string };
  salary_parsed: { entry: RawSalaryRange; mid: RawSalaryRange; senior: RawSalaryRange };
  career_outlook: { india: string; abroad: string };
  who_thrives: string[];
  who_regrets_it: string[];
  before_you_commit: string[];
  choose_if: string[];
  avoid_if: string[];
  real_experiences: { source: string; quote: string; url?: string }[];
  related_careers: string[];
  career_paths: {
    id: string;
    name: string;
    pathway: string[];
    time: string;
    salary: string;
    likelihood: string;
    gate_type: string;
    explanation: string;
    difficulty: string;
    watch_out: string;
    time_parsed: { min: number; max: number };
  }[];
  metrics: {
    duration: string;
    stress: number;
    competition: number;
    salary_potential: number;
    study_difficulty: number;
    work_life_balance: number;
    job_availability: number;
    abroad_prospects: number;
    ideal_personality: string;
    internship: string;
    progression: string[];
    misconception: string;
    regret: string;
    praise: string;
  };
  faq: { question: string; answer: string }[];
  duration_parsed: number;
}

function normalize(c: RawCareer): CareerProfile {
  return {
    id: c.id,
    name: c.name,
    category: c.category,
    tagline: c.tagline,
    verdict: c.verdict,
    lastVerified: c.last_verified,
    sources: c.sources,
    overview: c.overview,
    tags: c.tags,
    whyPeopleLoveIt: c.why_people_love_it,
    whatNobodyTellsYou: c.what_nobody_tells_you,
    salary: c.salary,
    salaryParsed: c.salary_parsed,
    careerOutlook: c.career_outlook,
    whoThrives: c.who_thrives,
    whoRegretsIt: c.who_regrets_it,
    beforeYouCommit: c.before_you_commit,
    chooseIf: c.choose_if,
    avoidIf: c.avoid_if,
    realExperiences: c.real_experiences,
    relatedCareers: c.related_careers,
    careerPaths: c.career_paths.map((p) => ({
      id: p.id,
      name: p.name,
      pathway: p.pathway,
      time: p.time,
      salary: p.salary,
      likelihood: p.likelihood as CareerPath["likelihood"],
      gateType: p.gate_type,
      explanation: p.explanation,
      difficulty: p.difficulty,
      watchOut: p.watch_out,
      timeParsed: p.time_parsed,
    })),
    metrics: {
      duration: c.metrics.duration,
      stress: c.metrics.stress,
      competition: c.metrics.competition,
      salaryPotential: c.metrics.salary_potential,
      studyDifficulty: c.metrics.study_difficulty,
      workLifeBalance: c.metrics.work_life_balance,
      jobAvailability: c.metrics.job_availability,
      abroadProspects: c.metrics.abroad_prospects,
      idealPersonality: c.metrics.ideal_personality,
      internship: c.metrics.internship,
      progression: c.metrics.progression,
      misconception: c.metrics.misconception,
      regret: c.metrics.regret,
      praise: c.metrics.praise,
    },
    faq: c.faq,
    durationParsed: c.duration_parsed,
  };
}

const rawCareers = (careersJson as unknown as { careers: RawCareer[] }).careers;

// Real-account reviews for careers that live in reviews-overrides.json (the
// careers.json entries for these stay as-is; the override replaces them).
const reviewOverrides = reviewsOverrides as unknown as Record<
  string,
  RawCareer["real_experiences"]
>;
for (const career of rawCareers) {
  const override = reviewOverrides[career.id];
  if (override) career.real_experiences = override;
}

/* ─────────────────────────────────────────────────────────────
   Browse order — the curated sequence users actually see.
   careers.json is authored by category; this array is what the
   default /careers view shows. Block order: the anchor paths
   students search first (JEE, NEET, CA, UPSC), then allied
   fields, then the open-ended pure-science/humanities routes.
   ───────────────────────────────────────────────────────────── */

const BROWSE_ORDER = [
  // Engineering
  "cs_engineering",
  "bca_mca",
  "core_engineering",
  // Medical
  "mbbs",
  "bds",
  "pharmacy",
  "bams",
  "bhms",
  // Commerce
  "ca",
  "bcom",
  "bba",
  "economics",
  // Civil services & govt
  "upsc",
  // Law
  "law",
  // Management
  "mba",
  "hotel_management",
  // Paramedical
  "paramedical_nursing",
  "paramedical_physiotherapy",
  "radiology_tech",
  // Design
  "design",
  "architecture",
  // Life sciences
  "biotechnology",
  "food_technology",
  "agriculture",
  "zoology",
  "botany",
  // Humanities
  "psychology",
  "journalism",
  "bed_teaching",
  "ba_humanities",
];

const careerById = new Map(rawCareers.map((c) => [c.id, c]));
// Curated order first; any career not yet listed falls through in JSON order
// so a newly added career never silently disappears from the index.
const orderedCareers = [
  ...BROWSE_ORDER.map((id) => careerById.get(id)).filter((c): c is RawCareer => Boolean(c)),
  ...rawCareers.filter((c) => !BROWSE_ORDER.includes(c.id)),
];

export const careerProfiles: CareerProfile[] = orderedCareers.map(normalize);
