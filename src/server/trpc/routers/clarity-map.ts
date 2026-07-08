import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { storage } from "@/lib/queries";
import { generatePersonalClarityMap } from "@/lib/openai";
import { personalClarityDimensionKeys, personalClaritySignals } from "@/db/schema";

const dimensionInput = z.object({
  dimension: z.string(),
  clientReflections: z.string().optional(),
  keyThemes: z.string().optional(),
  coachInterpretation: z.string().optional(),
  possibleFocusAreas: z.string().optional(),
  currentSignal: z.enum(personalClaritySignals).default("Unclear"),
});

export const clarityMapRouter = createTRPCRouter({
  bySessionNote: adminProcedure
    .input(z.object({ sessionNoteId: z.string() }))
    .query(({ input }) => storage.getPersonalClarityMapBySessionNoteId(input.sessionNoteId)),

  // AI-generate a draft from the session note's Plaud transcript/summary.
  generate: adminProcedure
    .input(z.object({ sessionNoteId: z.string() }))
    .mutation(async ({ input }) => {
      const note = await storage.getSessionNoteById(input.sessionNoteId);
      if (!note) throw new TRPCError({ code: "NOT_FOUND", message: "Session note not found" });
      if (!note.plaudTranscriptText && !note.plaudAiSummaryText) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No Plaud transcript or AI summary on this session note. Add one first.",
        });
      }
      const client = await storage.getCoachingClientById(note.coachingClientId);

      const result = await generatePersonalClarityMap({
        clientName: client?.contact.fullName ?? "Client",
        sessionNumber: note.sessionNumber ?? null,
        sessionDate: note.sessionDate.toISOString().slice(0, 10),
        transcript: note.plaudTranscriptText ?? "",
        aiSummary: note.plaudAiSummaryText ?? "",
      });

      const ordered = personalClarityDimensionKeys.map((key, i) => {
        const found = result.dimensions.find((d) => d.dimension.toLowerCase() === key);
        return {
          dimension: key,
          clientReflections: found?.clientReflections ?? "",
          keyThemes: found?.keyThemes ?? "",
          coachInterpretation: found?.coachInterpretation ?? "",
          possibleFocusAreas: found?.possibleFocusAreas ?? "",
          currentSignal: found?.currentSignal ?? "Unclear",
          sortOrder: i,
        };
      });

      return storage.upsertPersonalClarityMap(
        input.sessionNoteId,
        note.coachingClientId,
        {
          overallSummary: result.overallSummary,
          topThemes: result.topThemes,
          suggestedNextFocus: result.suggestedNextFocus,
          status: "ai_draft",
        },
        ordered,
      );
    }),

  // Coach saves their reviewed edits.
  save: adminProcedure
    .input(
      z.object({
        sessionNoteId: z.string(),
        clientId: z.string(),
        overallSummary: z.string().optional(),
        topThemes: z.string().optional(),
        suggestedNextFocus: z.string().optional(),
        status: z.enum(["ai_draft", "coach_reviewed", "sent"]).default("coach_reviewed"),
        dimensions: z.array(dimensionInput),
      }),
    )
    .mutation(async ({ input }) => {
      return storage.upsertPersonalClarityMap(
        input.sessionNoteId,
        input.clientId,
        {
          overallSummary: input.overallSummary,
          topThemes: input.topThemes,
          suggestedNextFocus: input.suggestedNextFocus,
          status: input.status,
        },
        input.dimensions.map((d, i) => ({ ...d, sortOrder: i })),
      );
    }),
});
