import { z } from "zod";

// Pure zod schema for the 360 summary — shared by the server (generate/stream)
// and the client (experimental_useObject for live streaming). No server-only
// imports so it is safe to import into client components.
export const summaryDraftSchema = z.object({
  topStrengths: z.string(),
  developmentAreas: z.string(),
  selfVsOthersGap: z.string(),
  leadershipPattern: z.string(),
  topPriorities: z.string(),
  ninetyDayFocus: z.string(),
});
export type SummaryDraftResult = z.infer<typeof summaryDraftSchema>;

// Field order + labels for rendering the summary consistently everywhere.
export const SUMMARY_FIELDS = [
  { key: "topStrengths", label: "Top strengths" },
  { key: "developmentAreas", label: "Development areas" },
  { key: "selfVsOthersGap", label: "Self vs others gap" },
  { key: "leadershipPattern", label: "Leadership pattern" },
  { key: "topPriorities", label: "Top priorities" },
  { key: "ninetyDayFocus", label: "90-day focus" },
] as const;
