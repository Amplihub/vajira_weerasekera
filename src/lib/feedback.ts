import { OPEN_TEXT_QUESTIONS, QUESTIONNAIRE_DIMENSIONS, RESPONDENT_THRESHOLD, type FeedbackRespondent, type FeedbackResponse } from "@/db/schema";

type ResponseWithRespondent = FeedbackResponse & { respondent: FeedbackRespondent };

export interface RelationshipStat {
  avg: number | null;
  count: number;
  suppressed: boolean;
}

export interface DimensionStat {
  othersAvg: number | null;
  selfAvg: number | null;
  gap: number | null;
  byRelationship: Record<string, RelationshipStat>;
  questions: Record<string, { overall: number | null; self: number | null }>;
}

export interface AggregatedResults {
  totalRespondents: number;
  completedCount: number;
  selfCompleted: boolean;
  dimensions: Record<string, DimensionStat>;
  openTextAnswers: { question: string; answers: string[] }[];
}

function avgOf(vals: (number | null)[]): number | null {
  const nums = vals.filter((v): v is number => typeof v === "number");
  return nums.length > 0 ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10 : null;
}

function getRatings(response: ResponseWithRespondent, keys: readonly string[]): (number | null)[] {
  const ratings = response.ratings as Record<string, number | null>;
  return keys.map((k) => ratings[k] ?? null);
}

/**
 * Aggregate 360 responses into per-dimension self vs others averages, gaps,
 * per-relationship breakdowns (suppressed below RESPONDENT_THRESHOLD for anonymity),
 * and grouped open-text answers. Ported 1:1 from the Replit MVP.
 */
export function computeAggregatedResults(
  respondents: FeedbackRespondent[],
  responses: ResponseWithRespondent[],
): AggregatedResults {
  const selfResponse = responses.find((r) => r.respondent.isSelf);
  const othersResponses = responses.filter((r) => !r.respondent.isSelf);

  const dimensions: Record<string, DimensionStat> = {};
  for (const [dim, keys] of Object.entries(QUESTIONNAIRE_DIMENSIONS)) {
    const othersVals = othersResponses.flatMap((r) => getRatings(r, keys));
    const othersAvg = avgOf(othersVals);
    const selfVals = selfResponse ? getRatings(selfResponse, keys) : [];
    const selfAvg = avgOf(selfVals);

    const byRelationship: Record<string, RelationshipStat> = {};
    for (const rel of ["Manager", "Peer", "Direct Report", "Other"]) {
      const group = othersResponses.filter((r) => r.respondent.relationship === rel);
      const suppressed = group.length < RESPONDENT_THRESHOLD;
      const vals = group.flatMap((r) => getRatings(r, keys));
      byRelationship[rel] = { avg: suppressed ? null : avgOf(vals), count: group.length, suppressed };
    }

    const questionAverages: Record<string, { overall: number | null; self: number | null }> = {};
    for (const key of keys) {
      const oVals = othersResponses.map((r) => (r.ratings as Record<string, number | null>)[key] ?? null);
      const sVal = selfResponse ? ((selfResponse.ratings as Record<string, number | null>)[key] ?? null) : null;
      questionAverages[key] = { overall: avgOf(oVals), self: sVal };
    }

    dimensions[dim] = {
      othersAvg,
      selfAvg,
      gap: othersAvg !== null && selfAvg !== null ? Math.round((selfAvg - othersAvg) * 10) / 10 : null,
      byRelationship,
      questions: questionAverages,
    };
  }

  const openTextAnswers = OPEN_TEXT_QUESTIONS.map((q, i) => ({
    question: q,
    answers: othersResponses
      .map((r) => ((r.openText as Record<string, string>)[`q${i + 1}`] || "").trim())
      .filter(Boolean),
  }));

  return {
    totalRespondents: respondents.filter((r) => !r.isSelf).length,
    completedCount: othersResponses.length,
    selfCompleted: !!selfResponse,
    dimensions,
    openTextAnswers,
  };
}
