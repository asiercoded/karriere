import { action } from "./_generated/server";
import { v } from "convex/values";
import { vly } from "../lib/vly-integrations";
import { categoryLabel, formatLakhs, getMid } from "../lib/career-data";
import { careerProfiles } from "../lib/career-profiles";

/**
 * AI verdict for the quiz results page.
 *
 * The rule-based matcher already picks the top careers; this action turns that
 * into one short, honest paragraph written in the student's language. The model
 * only ever sees facts from the careers file (looked up server-side, so a user
 * can't inject career text), and it's told never to invent numbers.
 *
 * Returns null (instead of throwing) when the AI gateway is unavailable — the
 * frontend treats null as "skip the AI block", never as an error.
 */

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  interests: {
    medical: "Medicine & Healthcare",
    paramedical: "Paramedical & Allied Health",
    life_sciences: "Life Sciences (Zoology, Botany…)",
    humanities: "Humanities & Social Sciences",
    civil_services: "Civil Services & Government",
    engineering: "Engineering & Technology",
    commerce: "Commerce & Finance",
    law: "Law & Justice",
    design: "Design & Creative",
    management: "Business & Management",
  },
  workStyle: {
    people: "work with people — helping, teaching, caring",
    hands_on: "work with my hands — practical, physical work",
    ideas: "work with ideas & data — analyzing, thinking",
    building: "build & create — making things",
  },
  pace: {
    soon: "earn as soon as possible",
    moderate: "a normal 3–4 year degree is fine",
    long: "willing to invest years for a bigger payoff",
  },
  stability: {
    stable: "a stable, secure path",
    compete: "competition doesn't scare me",
    high_reward: "highest reward, whatever it takes",
  },
  values: {
    income: "high income",
    helping: "helping others",
    creativity: "creative freedom",
    security: "job security",
    service: "serving the public",
    respect: "social respect",
  },
};

function summarize(careerId: string): string {
  const c = careerProfiles.find((p) => p.id === careerId);
  if (!c) return "";
  const entry = formatLakhs(getMid(c.salaryParsed.entry));
  const senior = formatLakhs(getMid(c.salaryParsed.senior));
  const m = c.metrics;
  return [
    `Career: ${c.name}`,
    `Field: ${categoryLabel(c.category)}`,
    `One-line: ${c.tagline}`,
    `Bottom line: ${c.verdict}`,
    `Study length: ${m.duration}`,
    `Entry pay: ${entry}/yr · Senior pay: ${senior}/yr`,
    `Stress ${m.stress}/5 · Work-life balance ${m.workLifeBalance}/5 · Competition ${m.competition}/5`,
    `Why people love it: ${c.whyPeopleLoveIt[0] ?? ""}`,
    `What nobody tells you: ${c.whatNobodyTellsYou[0] ?? ""}`,
  ].join("\n");
}

export const verdict = action({
  args: {
    answers: v.object({
      interests: v.string(),
      workStyle: v.string(),
      pace: v.string(),
      stability: v.string(),
      values: v.string(),
    }),
    topIds: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    if (!process.env.VLY_INTEGRATION_KEY) return null;

    const top = args.topIds.slice(0, 3);
    const summaries = top.map(summarize).filter(Boolean);
    if (summaries.length === 0) return null;

    const read = (key: keyof typeof args.answers) =>
      ANSWER_LABELS[key]?.[args.answers[key]] ?? args.answers[key];

    const system = [
      "You are the match explainer for Karriere, an honest career-guidance site for 17-year-old Indian students choosing a path after Class 12.",
      "The site's voice: direct, warm, zero hype, zero fear-mongering.",
      "You are given a student's quiz answers and real data for their top matched careers.",
      "Write ONE short plain-language paragraph (max 140 words) that:",
      "- Opens by naming the top career and ONE concrete reason it fits THIS student, tied to their actual answers (not generic praise).",
      "- Names the biggest trade-off honestly — time, money, competition, or stress — using only the data provided.",
      "- Ends with one brief 'worth checking' nod to the second career ONLY if it is a genuinely different option; otherwise skip it.",
      "Rules:",
      "- Use ONLY facts from the data provided. Never invent salaries, durations, exams, or numbers.",
      "- No bullet points, headings, or markdown. One flowing paragraph.",
      "- Address the student directly as 'you'.",
      "- No 'perfect match' language. Careers are decisions, not guarantees.",
    ].join(" ");

    const user = [
      `The student's answers:`,
      `- Drawn to: ${read("interests")}`,
      `- Likes to: ${read("workStyle")}`,
      `- Pace: ${read("pace")}`,
      `- Risk: ${read("stability")}`,
      `- Values most: ${read("values")}`,
      ``,
      `Their top matched careers, with real data:`,
      summaries.join("\n\n"),
    ].join("\n");

    try {
      const result = await vly.ai.completion({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.55,
        maxTokens: 320,
      });

      if (!result.success || !result.data) return null;

      const text = result.data.choices?.[0]?.message?.content ?? "";
      const cleaned = text
        // strip markdown-ish artifacts the model sometimes leaks
        .replace(/^["'\s]+|["'\s]+$/g, "")
        .replace(/[*_#`]+/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!cleaned) return null;

      return { text: cleaned };
    } catch {
      return null;
    }
  },
});
