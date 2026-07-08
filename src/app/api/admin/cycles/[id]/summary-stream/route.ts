import { getAdminSession } from "@/lib/guard";
import { storage } from "@/lib/queries";
import { computeAggregatedResults } from "@/lib/feedback";
import { streamSummaryDraft } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

// Live-streams the 360 AI summary (object stream) for the cycle detail page.
// Admin-gated; persists the completed draft on finish so the approve flow works.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const cycle = await storage.getFeedbackCycleById(id);
  if (!cycle) return new Response("Cycle not found", { status: 404 });

  // Regeneration is allowed even after approval; the completed stream persists a
  // fresh "draft" so the coach can re-review and re-approve.
  const responses = await storage.getFeedbackResponsesByCycleId(id);
  const othersCompleted = responses.filter((r) => r.respondent.status === "completed" && !r.respondent.isSelf);
  if (othersCompleted.length === 0) return new Response("No completed responses to summarise.", { status: 400 });

  const respondents = await storage.getFeedbackRespondentsByCycleId(id);
  const aggregated = computeAggregatedResults(respondents, responses);
  const dimensions: Record<string, { othersAvg: number | null; selfAvg: number | null; gap: number | null }> = {};
  for (const [dim, d] of Object.entries(aggregated.dimensions)) {
    dimensions[dim] = { othersAvg: d.othersAvg, selfAvg: d.selfAvg, gap: d.gap };
  }

  try {
    const result = streamSummaryDraft(
      {
        cycleTitle: cycle.title,
        clientName: cycle.clientName,
        totalRespondents: aggregated.totalRespondents,
        completedOthers: aggregated.completedCount,
        selfCompleted: aggregated.selfCompleted,
        dimensions,
        openTextAnswers: aggregated.openTextAnswers,
      },
      async (object) => {
        if (object) await storage.upsertFeedbackSummary(id, { ...object, status: "draft" });
      },
    );
    return result.toTextStreamResponse();
  } catch (e) {
    // Thrown synchronously when OPENAI_API_KEY is missing.
    return new Response((e as Error).message, { status: 500 });
  }
}
