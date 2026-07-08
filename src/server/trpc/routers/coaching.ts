import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { paginationInput, pageToOffset, paginated } from "../pagination";
import { storage } from "@/lib/queries";
import {
  coachingClientFormSchema,
  sessionNoteFormSchema,
  clientStatusOptions,
  coachingTypeOptions,
} from "@/db/schema";

function toDate(v?: string | null): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export const coachingRouter = createTRPCRouter({
  listClients: adminProcedure
    .input(
      paginationInput.extend({
        status: z.enum(clientStatusOptions).optional(),
        coachingType: z.enum(coachingTypeOptions).optional(),
      }),
    )
    .query(async ({ input }) => {
      const { items, total } = await storage.getCoachingClientsPaged({
        limit: input.limit,
        offset: pageToOffset(input.page, input.limit),
        search: input.search,
        status: input.status,
        coachingType: input.coachingType,
      });
      return paginated(items, total, input.page, input.limit);
    }),

  clientById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const client = await storage.getCoachingClientById(input.id);
    if (!client) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
    return client;
  }),

  createClient: adminProcedure.input(coachingClientFormSchema).mutation(async ({ input }) => {
    const contact = await storage.findOrCreateContact(input.email, {
      fullName: input.fullName,
      phone: input.phone,
      company: input.company,
      roleTitle: input.roleTitle,
    });
    return storage.createCoachingClient({
      contactId: contact.id,
      coachingType: input.coachingType,
      status: input.status,
      startDate: toDate(input.startDate),
      nextSessionDate: toDate(input.nextSessionDate),
      primaryGoals: input.primaryGoals ?? null,
      backgroundSummary: input.backgroundSummary ?? null,
      sourceApplicationId: input.sourceApplicationId ?? null,
    });
  }),

  updateClient: adminProcedure
    .input(z.object({ id: z.string(), data: coachingClientFormSchema.partial() }))
    .mutation(async ({ input }) => {
      const { startDate, nextSessionDate, fullName, email, phone, company, roleTitle, ...rest } = input.data;
      const result = await storage.updateCoachingClient(input.id, {
        ...rest,
        ...(startDate !== undefined ? { startDate: toDate(startDate) } : {}),
        ...(nextSessionDate !== undefined ? { nextSessionDate: toDate(nextSessionDate) } : {}),
      });
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      return result;
    }),

  // ── Session notes ──
  listSessions: adminProcedure
    .input(z.object({ clientId: z.string() }))
    .query(({ input }) => storage.getSessionNotesByClientId(input.clientId)),

  sessionById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const note = await storage.getSessionNoteById(input.id);
    if (!note) throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
    return note;
  }),

  nextSessionNumber: adminProcedure
    .input(z.object({ clientId: z.string() }))
    .query(({ input }) => storage.getNextSessionNumber(input.clientId)),

  createSession: adminProcedure
    .input(z.object({ clientId: z.string(), data: sessionNoteFormSchema }))
    .mutation(async ({ input }) => {
      const { data } = input;
      const sessionDate = toDate(data.sessionDate);
      if (!sessionDate) throw new TRPCError({ code: "BAD_REQUEST", message: "Valid session date required" });
      const number = await storage.getNextSessionNumber(input.clientId);
      const { durationMinutes, ...rest } = data;
      return storage.createSessionNote({
        ...rest,
        coachingClientId: input.clientId,
        sessionDate,
        sessionNumber: number,
        durationMinutes: durationMinutes ?? null,
      });
    }),

  updateSession: adminProcedure
    .input(z.object({ id: z.string(), data: sessionNoteFormSchema.partial() }))
    .mutation(async ({ input }) => {
      const { sessionDate, ...rest } = input.data;
      const result = await storage.updateSessionNote(input.id, {
        ...rest,
        ...(sessionDate !== undefined ? { sessionDate: toDate(sessionDate) ?? undefined } : {}),
      });
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      return result;
    }),

  deleteSession: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const ok = await storage.deleteSessionNote(input.id);
    if (!ok) throw new TRPCError({ code: "NOT_FOUND" });
    return { ok };
  }),
});
