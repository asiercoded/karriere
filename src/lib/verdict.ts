import { categoryLabel, type CareerMatch, type QuizAnswers } from "./career-data";

/**
 * Honest, anti-hype verdict generated instantly on the client from verified career data.
 */
export function generateLocalVerdict(answers: QuizAnswers, topRecs: CareerMatch[]): string {
  if (!topRecs || topRecs.length === 0) return "";
  const top = topRecs[0].career;
  const second = topRecs[1]?.career;

  const reason = top.verdict || `aligns directly with your interest in ${categoryLabel(top.category)}.`;
  const tradeOff = top.whatNobodyTellsYou?.[0]
    ? `The critical trade-off to watch out for: ${top.whatNobodyTellsYou[0]}`
    : `Keep in mind the study duration of ${top.metrics.duration} and a competition rating of ${top.metrics.competition}/5.`;

  let secondMention = "";
  if (second && second.category !== top.category) {
    secondMention = ` If you want an alternative path with a different risk profile, consider exploring ${second.name} (${categoryLabel(second.category)}).`;
  }

  return `Based on your preferences, ${top.name} stands out as your strongest match because ${reason.toLowerCase().startsWith("based") ? reason : reason} ${tradeOff}${secondMention}`;
}
