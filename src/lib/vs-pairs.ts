/* ─────────────────────────────────────────────────────────────
   SEO hub pairs — the "MBBS vs BDS" style pages that capture the
   exact Google searches parents make. Each pair maps to two real
   career ids; the page renders live data from the careers file.
   FAQ answers are authored from the site's own figures (salary
   ranges, duration, metrics) so the hubs never contradict the
   career pages they link to.
   ───────────────────────────────────────────────────────────── */

export interface VsPair {
  slug: string;
  a: string; // career id
  b: string; // career id
  nameA: string;
  nameB: string;
  /** Short SEO title — used for the H1 and document title. */
  title: string;
  /** Why students and parents actually search this comparison. */
  intro: string;
  faq: { question: string; answer: string }[];
}

export const VS_PAIRS: VsPair[] = [
  {
    slug: "mbbs-vs-bds",
    a: "mbbs",
    b: "bds",
    nameA: "MBBS",
    nameB: "BDS",
    title: "MBBS vs BDS — which is the better career?",
    intro:
      "Every PCB student with a NEET score faces this fork: the MBBS dream, or the dentistry route that shares the same entrance exam. The honest difference is not prestige — it's the first 10 years.",
    faq: [
      {
        question: "MBBS vs BDS — which pays more?",
        answer:
          "MBBS pays more from day one: entry salaries around ₹4.8–9.6 lakh/year versus ₹1.8–3.6 lakh for BDS, and MBBS reaches a high senior ceiling far more reliably. BDS has a similar theoretical ceiling (₹24L+ at senior level), but it comes only with your own clinic and years of building a practice — not from the degree alone.",
      },
      {
        question: "Is BDS a good backup if I don't get MBBS?",
        answer:
          "No — treat it as a real choice, not a consolation prize. BDS has weak entry pay (₹1.8–3.6L/year) and job availability of just 2/5; without a genuine interest in dentistry and a plan for a clinic, the early years are financially rough. If the goal is medicine specifically, options like pharmacy, physiotherapy, or a reattempt deserve equal weight.",
      },
      {
        question: "Which is less stressful — MBBS or BDS?",
        answer:
          "BDS, clearly: stress is 3/5 and work-life balance 3/5 versus MBBS's 5/5 stress and 1/5 work-life balance. Both share brutal entrance competition (5/5), but an MBBS residency is a uniquely punishing stretch of the early career.",
      },
    ],
  },
  {
    slug: "btech-vs-bca",
    a: "cs_engineering",
    b: "bca_mca",
    nameA: "B.Tech",
    nameB: "BCA",
    title: "B.Tech vs BCA — which is better for a software career?",
    intro:
      "The most common engineering doubt in Indian households: spend four years (and a JEE attempt) on B.Tech, or take the lighter BCA route into the same software industry? The answer depends on whether you have a JEE score to spend.",
    faq: [
      {
        question: "B.Tech (CS) vs BCA — which is better for software jobs?",
        answer:
          "For the same destination — a software job — B.Tech CS has the edge: entry pay of ₹3.5–12L/year versus ₹2.5–4.5L for BCA graduates, with a higher senior ceiling (₹35–80L). But BCA's real path is BCA + MCA, which is five years total to B.Tech's four — a longer road that lands at a similar place if you build real skills on top.",
      },
      {
        question: "Can I do BCA after 12th from any stream?",
        answer:
          "Yes — BCA entry is merit-based and open to students from any stream, with no entrance exam. That's the core trade-off: you skip the JEE pressure, but you must compensate with self-built skills (projects, DSA, internships) because the degree alone carries less weight than a B.Tech tag.",
      },
      {
        question: "Which has less entrance-exam pressure?",
        answer:
          "BCA — there is no national entrance exam for it. B.Tech requires JEE Main (or a state CET) with competition scored 4/5. If JEE prep has already failed twice and you want the software industry, BCA + MCA is the pragmatic lane, not the failure lane.",
      },
    ],
  },
  {
    slug: "ba-vs-bcom",
    a: "ba_humanities",
    b: "bcom",
    nameA: "BA",
    nameB: "B.Com",
    title: "BA vs B.Com — which degree has better career options?",
    intro:
      "The classic arts-vs-commerce question from 12th grade. Neither degree is a finish line — both are bases for the careers you stack on top. The real question is which base fits the route you're actually considering.",
    faq: [
      {
        question: "BA vs B.Com — which has better career options?",
        answer:
          "They open different doors, not more or fewer. B.Com is the base for the finance stack — CA, CFA, ACCA, MBA-finance — with slightly better entry job availability (3/5 vs 2/5). BA (humanities) is the base for UPSC/state PSC (where humanities students hold an optional-subject advantage), teaching via MA + B.Ed, and content/analytics roles. Pick by destination, not by degree reputation.",
      },
      {
        question: "Which is better for UPSC?",
        answer:
          "BA humanities is the classic choice — the optional subject (history, Pol Sci, sociology) overlaps with what you already studied, and the GS syllabus rewards humanities habits. But any graduation qualifies for UPSC, so B.Com with a familiar optional works too. The exam, not the degree, decides.",
      },
      {
        question: "Which pays more at entry?",
        answer:
          "They're nearly identical: BA entry pay is around ₹2.5–4L/year and B.Com around ₹2–4L/year — both among the lower entry bands on the site. The degree is not the earning decision for either; the professional exam (CA/CFA/UPSC) or skill stack you add on top is.",
      },
    ],
  },
  {
    slug: "core-vs-cs-engineering",
    a: "core_engineering",
    b: "cs_engineering",
    nameA: "Core engineering",
    nameB: "CS engineering",
    title: "Core engineering vs Computer Science — which has better jobs?",
    intro:
      "The seat-allocation dilemma: a good rank lands you core (mechanical, civil, electrical) at a better college, or CS at a lesser one. The honest answer has flipped in the last decade — and the data explains exactly how.",
    faq: [
      {
        question: "Core engineering vs CS — which has better job prospects?",
        answer:
          "CS, by the numbers: job availability 3/5 vs 2/5, entry pay ₹3.5–12L/year vs ₹2.5–5L, and a senior ceiling of ₹35–80L vs ₹15–30L. Core engineering is not dead — it's just that the default 'graduate and get placed' route no longer works; it needs a plan (GATE + PSU, M.Tech, or a manufacturing niche).",
      },
      {
        question: "Is core engineering a dead career in India?",
        answer:
          "No, but the default route is weak. Core branches still feed GATE/PSU jobs, M.Tech specialisations, and manufacturing — all real, all slower than CS's campus-placement conveyor belt. The verdict on the site: a real route only with a plan, while the unplanned 'core degree, any job' path is genuinely tough (entry ₹2.5–5L, job availability 2/5).",
      },
      {
        question: "I got a core branch at a better college — should I switch to CS at a worse one?",
        answer:
          "The data says CS at a worse college usually beats core at a better one for software careers — the CS degree directly feeds the industry with better entry pay and job availability. If you're set on software, take the CS seat and compensate for the college brand with projects and internships; if you're drawn to core disciplines themselves, plan GATE/PSU from year one.",
      },
    ],
  },
];

export function getVsPair(slug: string): VsPair | undefined {
  return VS_PAIRS.find((p) => p.slug === slug);
}

export function otherPairs(slug: string): VsPair[] {
  return VS_PAIRS.filter((p) => p.slug !== slug);
}
