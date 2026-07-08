import { generateObject, streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { personalClaritySignals } from "@/db/schema";
import { summaryDraftSchema, type SummaryDraftResult } from "@/lib/ai-schemas";

// gpt-4.1 — stronger + cheaper than 4o for structured synthesis (360 summary,
// clarity map), supports structured outputs. Swap back to "gpt-4o" if needed.
const MODEL = "gpt-4.1";

function assertKey() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set.");
}

// ── 360 summary ──────────────────────────────────────────────────────────────

export { summaryDraftSchema };
export type { SummaryDraftResult };

export interface SummaryDraftPayload {
  cycleTitle: string;
  clientName: string;
  totalRespondents: number;
  completedOthers: number;
  selfCompleted: boolean;
  dimensions: Record<string, { othersAvg: number | null; selfAvg: number | null; gap: number | null }>;
  openTextAnswers: { question: string; answers: string[] }[];
}

const SUMMARY_SYSTEM = `You are a senior leadership development advisor writing an in-depth 360 feedback analysis for an executive coach. Your output is a working document the coach studies before sessions — so it must be thorough, specific, and rich in detail, not a brief overview.

Depth & format requirements (important):
- Write substantial, detailed content for EVERY section — multiple paragraphs where the data allows.
- Where you list strengths, development areas, priorities, or focus items, use clear bullet points (one per line, each starting with "• "), and expand each bullet with a sentence or two of explanation, evidence, and why it matters.
- Reference specific patterns, themes, and tensions drawn from the dimension scores and the open-text feedback. Quote short anonymised phrases from the open text where they illustrate a point (never attribute them to anyone).
- Be concrete and behavioural: describe what the leader actually does, the impact on others, and what "better" would look like.

Integrity guidelines:
- Base everything on the data provided; do not invent facts or scores.
- Use balanced, professional, constructive language. Avoid clinical/diagnostic terms.
- Do not name, identify, or attribute quotes to individual respondents.
- Distinguish clearly between strengths and development needs.
- Discuss the self-vs-others gap in depth wherever the numbers reveal a meaningful difference (blind spots, under-rating, over-confidence).
- Make priorities and the 90-day focus realistic, sequenced, and actionable (what to do, how to practise it, how to measure progress).

Per-section guidance:
- topStrengths: the leader's strongest, best-evidenced capabilities, with supporting signals.
- developmentAreas: the most important growth areas, each with evidence and the cost of not addressing it.
- selfVsOthersGap: a detailed read of alignment and blind spots between self-rating and others' ratings, dimension by dimension where notable.
- leadershipPattern: the underlying behavioural pattern / leadership style the data paints — strengths, triggers under pressure, and how it shows up across dimensions.
- topPriorities: 3–5 prioritised focus areas as bullets, each explained and justified.
- ninetyDayFocus: a concrete 90-day development plan — specific practices, experiments, and checkpoints.`;

function summaryPrompt(payload: SummaryDraftPayload): string {
  const dimLines = Object.entries(payload.dimensions)
    .map(([dim, d]) => {
      const parts = [`${dim}: others avg ${d.othersAvg ?? "n/a"}`];
      if (d.selfAvg !== null) parts.push(`self avg ${d.selfAvg}`);
      if (d.gap !== null) parts.push(`gap (self minus others) ${d.gap}`);
      return parts.join(", ");
    })
    .join("\n");

  const openTextLines = payload.openTextAnswers
    .filter((q) => q.answers.length > 0)
    .map(
      (q) => `Question: ${q.question}\nResponses:\n${q.answers.map((a, i) => `  ${i + 1}. ${a}`).join("\n")}`,
    )
    .join("\n\n");

  return `Generate a 360 leadership summary for the following coaching engagement.

Cycle: ${payload.cycleTitle}
Participant: ${payload.clientName}
Respondents invited (excluding self): ${payload.totalRespondents}
Respondents completed (excluding self): ${payload.completedOthers}
Self-assessment completed: ${payload.selfCompleted ? "Yes" : "No"}

Dimension averages (scale 1–5):
${dimLines}

Open text feedback:
${openTextLines || "No open text responses available."}

Write a thorough, detailed analysis. Use bullet points (each line starting with "• ") for strengths, development areas, priorities, and the 90-day plan, and expand each point with explanation and evidence.`;
}

/** Generate a full 360 summary. Returns a typed, zod-validated object. */
export async function generateSummaryDraft(payload: SummaryDraftPayload): Promise<SummaryDraftResult> {
  assertKey();
  const { object } = await generateObject({
    model: openai(MODEL),
    schema: summaryDraftSchema,
    system: SUMMARY_SYSTEM,
    prompt: summaryPrompt(payload),
    temperature: 0.4,
    maxOutputTokens: 6000,
  });
  return object;
}

/**
 * Streaming variant — pipe into a Response for live "Generate summary" UX.
 * `onFinish` fires once with the complete object so the caller can persist it.
 */
export function streamSummaryDraft(
  payload: SummaryDraftPayload,
  onFinish?: (object: SummaryDraftResult | undefined) => void | Promise<void>,
) {
  assertKey();
  return streamObject({
    model: openai(MODEL),
    schema: summaryDraftSchema,
    system: SUMMARY_SYSTEM,
    prompt: summaryPrompt(payload),
    temperature: 0.4,
    maxOutputTokens: 6000,
    onFinish: onFinish ? ({ object }) => onFinish(object) : undefined,
  });
}

// ── Personal Clarity Map ─────────────────────────────────────────────────────

export const clarityMapSchema = z.object({
  overallSummary: z.string(),
  topThemes: z.string(),
  suggestedNextFocus: z.string(),
  dimensions: z.array(
    z.object({
      dimension: z.string(),
      clientReflections: z.string(),
      keyThemes: z.string(),
      coachInterpretation: z.string(),
      possibleFocusAreas: z.string(),
      currentSignal: z.enum(personalClaritySignals),
    }),
  ),
});
export type ClarityMapResult = z.infer<typeof clarityMapSchema>;
export type ClarityMapDimensionResult = ClarityMapResult["dimensions"][number];

const CLARITY_SYSTEM = `You are an experienced executive coach assistant generating a rich, detailed Personal Clarity Map from a coaching session transcript or summary. The coach uses this as a deep working document, so each section should be substantial and genuinely useful — not a one-line note.

Depth & format requirements (important):
- overallSummary: several sentences synthesising the whole session — the client's current state, the throughline across dimensions, energy, and what stood out.
- topThemes: the dominant cross-cutting themes as bullet points (one per line, each starting with "• "), each with a short explanation.
- suggestedNextFocus: a detailed, practical recommendation for where coaching should go next, with specific angles, questions, or experiments.
- For each dimension:
  - clientReflections: capture the client's own words and close paraphrases in depth; quote short phrases they used.
  - keyThemes: bullet points (one per line, "• "), each a concrete theme with a few words of context.
  - coachInterpretation: a thoughtful, multi-sentence read of what may be happening beneath the surface — patterns, tensions, drivers.
  - possibleFocusAreas: 2–4 practical, specific coaching areas or powerful questions to explore, as bullets.

Tone & integrity:
- Use calm, professional, non-clinical language. Hedge interpretations: "appears to", "may indicate", "could be worth exploring".
- Do NOT make medical, psychological, or clinical diagnoses.
- Stay grounded in the source material — do not fabricate facts, events, or quotes. You MAY offer coaching hypotheses and exploratory questions clearly framed as possibilities.
- currentSignal must be exactly one of: Stable, Emerging, Under Pressure, Avoided, Unclear.
- Your output is an AI draft for coach review — not a final conclusion.
- Always return exactly five dimensions in order: physical, emotional, financial, spiritual, relationship. If a dimension is genuinely not touched on at all, keep its reflections brief, set currentSignal to "Unclear", but still suggest one gentle exploratory question in possibleFocusAreas.`;

export async function generatePersonalClarityMap(options: {
  clientName: string;
  sessionNumber: number | null;
  sessionDate: string;
  transcript: string;
  aiSummary: string;
}): Promise<ClarityMapResult> {
  assertKey();

  const transcriptContent = [
    options.transcript ? `Plaud Transcript:\n${options.transcript}` : "",
    options.aiSummary ? `Plaud AI Summary:\n${options.aiSummary}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const prompt = `Generate a Personal Clarity Map for this coaching session.

Client: ${options.clientName}
Session: ${options.sessionNumber ? `#${options.sessionNumber}` : "Unknown"}
Date: ${options.sessionDate}

${transcriptContent}

Return five dimensions in this exact order: physical, emotional, financial, spiritual, relationship. Write detailed, substantive content for each section as instructed — bullet points for themes and focus areas, multi-sentence interpretations.`;

  const { object } = await generateObject({
    model: openai(MODEL),
    schema: clarityMapSchema,
    system: CLARITY_SYSTEM,
    prompt,
    temperature: 0.5,
    maxOutputTokens: 6000,
  });
  return object;
}
