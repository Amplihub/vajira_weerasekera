import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { storage } from "@/lib/queries";
import { generateToken, tokenExpiry } from "@/lib/tokens";
import { getAppBaseUrl } from "@/lib/app-url";
import { sendTrackedEmail, isEmailConfigured } from "@/lib/email";
import { computeAggregatedResults } from "@/lib/feedback";
import { generateSummaryDraft } from "@/lib/openai";
import {
  invitation360Html,
  reminder360Html,
  buildLinkEmail,
  DEFAULT_ONBOARDING_TEMPLATE,
  DEFAULT_NOMINATION_TEMPLATE,
} from "@/lib/email-templates";
import { ADMIN_EMAILS } from "@/lib/auth";
import { respondentRelationshipOptions, cycleStatusOptions } from "@/db/schema";

const summaryFields = z.object({
  topStrengths: z.string().optional(),
  developmentAreas: z.string().optional(),
  selfVsOthersGap: z.string().optional(),
  leadershipPattern: z.string().optional(),
  topPriorities: z.string().optional(),
  ninetyDayFocus: z.string().optional(),
});

export const cyclesRouter = createTRPCRouter({
  list: adminProcedure.query(() => storage.getFeedbackCycles()),

  byId: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const cycle = await storage.getFeedbackCycleById(input.id);
    if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "Cycle not found" });
    const respondents = await storage.getFeedbackRespondentsByCycleId(input.id);
    const base = getAppBaseUrl();
    // Admin-only: expose the share links so Vajira can copy + send them manually
    // (raw token replaced by the full URL). Each link is the respondent's survey page.
    return {
      ...cycle,
      onboardingUrl: cycle.participantToken ? `${base}/360-onboarding/${cycle.participantToken}` : null,
      nominationUrl: cycle.nominationToken ? `${base}/360-nominate/${cycle.nominationToken}` : null,
      respondents: respondents.map(({ token, ...r }) => ({ ...r, surveyUrl: `${base}/360/${token}` })),
    };
  }),

  create: adminProcedure
    .input(z.object({ coachingClientId: z.string(), title: z.string().min(1) }))
    .mutation(({ input }) =>
      storage.createFeedbackCycle({ coachingClientId: input.coachingClientId, title: input.title.trim(), status: "draft" }),
    ),

  update: adminProcedure
    .input(z.object({ id: z.string(), title: z.string().optional(), status: z.enum(cycleStatusOptions).optional() }))
    .mutation(async ({ input }) => {
      const data: Record<string, unknown> = {};
      if (input.title !== undefined) data.title = input.title.trim();
      if (input.status !== undefined) {
        if (input.status === "active") {
          const respondents = await storage.getFeedbackRespondentsByCycleId(input.id);
          if (respondents.length === 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "No respondents yet. Send the participant their onboarding link — when they confirm, the cycle activates and their self-assessment is created automatically. Or add a respondent manually first.",
            });
          }
        }
        data.status = input.status;
        if (input.status === "closed") data.closedAt = new Date();
      }
      const updated = await storage.updateFeedbackCycle(input.id, data);
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const ok = await storage.deleteFeedbackCycle(input.id);
    if (!ok) throw new TRPCError({ code: "NOT_FOUND" });
    return { ok };
  }),

  // ── Respondents ──
  addRespondent: adminProcedure
    .input(
      z.object({
        cycleId: z.string(),
        fullName: z.string().min(1),
        email: z.string().email(),
        relationship: z.enum(respondentRelationshipOptions),
        isSelf: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const r = await storage.createFeedbackRespondent({
        cycleId: input.cycleId,
        fullName: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        relationship: input.relationship,
        token: generateToken(),
        tokenExpiresAt: tokenExpiry(21),
        status: "pending",
        isSelf: Boolean(input.isSelf),
      });
      const { token: _t, ...safe } = r;
      return safe;
    }),

  updateRespondent: adminProcedure
    .input(
      z.object({
        id: z.string(),
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        relationship: z.enum(respondentRelationshipOptions).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      const data: Record<string, unknown> = { ...rest };
      if (rest.email) data.email = rest.email.trim().toLowerCase();
      const updated = await storage.updateFeedbackRespondent(id, data);
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      const { token: _t, ...safe } = updated;
      return safe;
    }),

  deleteRespondent: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const ok = await storage.deleteFeedbackRespondent(input.id);
    if (!ok) throw new TRPCError({ code: "NOT_FOUND" });
    return { ok };
  }),

  inviteRespondent: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const resp = await storage.getFeedbackRespondentById(input.id);
    if (!resp) throw new TRPCError({ code: "NOT_FOUND", message: "Respondent not found" });
    const cycle = await storage.getFeedbackCycleById(resp.cycleId);
    if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "Cycle not found" });
    if (cycle.onboardingStatus === "sent") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Participant has not yet agreed. Invitations cannot be sent until onboarding completes." });
    }

    const link = `${getAppBaseUrl()}/360/${resp.token}`;
    const subject = resp.isSelf
      ? `Your 360 Leadership Self-Assessment — ${cycle.title}`
      : `${cycle.clientName} has requested your confidential feedback`;
    const sent = await sendTrackedEmail({
      to: resp.email,
      subject,
      html: invitation360Html(cycle.clientName, resp.fullName, link, resp.isSelf),
      trigger: "360-invitation",
    });
    await storage.updateFeedbackRespondent(input.id, { invitedAt: new Date() });
    return { emailSent: sent, emailConfigured: isEmailConfigured(), link };
  }),

  remindRespondent: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const resp = await storage.getFeedbackRespondentById(input.id);
    if (!resp) throw new TRPCError({ code: "NOT_FOUND", message: "Respondent not found" });
    if (resp.status === "completed") {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Respondent already completed." });
    }
    const cycle = await storage.getFeedbackCycleById(resp.cycleId);
    if (!cycle) throw new TRPCError({ code: "NOT_FOUND" });
    if (cycle.status === "closed") throw new TRPCError({ code: "BAD_REQUEST", message: "Cycle is closed." });

    const link = `${getAppBaseUrl()}/360/${resp.token}`;
    const subject = resp.isSelf
      ? `Reminder: Your 360 Leadership Self-Assessment — ${cycle.title}`
      : `Reminder: ${cycle.clientName} is awaiting your feedback`;
    const sent = await sendTrackedEmail({
      to: resp.email,
      subject,
      html: reminder360Html(cycle.clientName, resp.fullName, link, resp.isSelf),
      trigger: "360-reminder",
    });
    return { emailSent: sent, emailConfigured: isEmailConfigured(), link };
  }),

  // ── Results & summary ──
  results: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const respondents = await storage.getFeedbackRespondentsByCycleId(input.id);
    const responses = await storage.getFeedbackResponsesByCycleId(input.id);
    return computeAggregatedResults(respondents, responses);
  }),

  getSummary: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => storage.getFeedbackSummaryByCycleId(input.id).then((s) => s ?? null)),

  saveSummary: adminProcedure
    .input(z.object({ id: z.string(), data: summaryFields }))
    .mutation(async ({ input }) => {
      const existing = await storage.getFeedbackSummaryByCycleId(input.id);
      if (existing?.status === "approved") {
        throw new TRPCError({ code: "CONFLICT", message: "Approved summary cannot be modified." });
      }
      return storage.upsertFeedbackSummary(input.id, input.data);
    }),

  approveSummary: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const summary = await storage.approveFeedbackSummary(input.id, ctx.user.email);
    if (!summary) throw new TRPCError({ code: "NOT_FOUND", message: "Summary not found" });
    return summary;
  }),

  generateSummary: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const cycle = await storage.getFeedbackCycleById(input.id);
    if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "Cycle not found" });
    // Regeneration is allowed even after approval — it resets the summary to a
    // draft so the coach can re-review and re-approve.

    const responses = await storage.getFeedbackResponsesByCycleId(input.id);
    const othersCompleted = responses.filter((r) => r.respondent.status === "completed" && !r.respondent.isSelf);
    if (othersCompleted.length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No completed responses to summarise." });
    }

    const respondents = await storage.getFeedbackRespondentsByCycleId(input.id);
    const aggregated = computeAggregatedResults(respondents, responses);
    const dimensions: Record<string, { othersAvg: number | null; selfAvg: number | null; gap: number | null }> = {};
    for (const [dim, d] of Object.entries(aggregated.dimensions)) {
      dimensions[dim] = { othersAvg: d.othersAvg, selfAvg: d.selfAvg, gap: d.gap };
    }

    const draft = await generateSummaryDraft({
      cycleTitle: cycle.title,
      clientName: cycle.clientName,
      totalRespondents: aggregated.totalRespondents,
      completedOthers: aggregated.completedCount,
      selfCompleted: aggregated.selfCompleted,
      dimensions,
      openTextAnswers: aggregated.openTextAnswers,
    });

    return storage.upsertFeedbackSummary(input.id, { ...draft, status: "draft" });
  }),

  // ── Onboarding ──
  getOnboardingTemplate: adminProcedure.query(async () => {
    return (
      (await storage.getEmailTemplate360("participant_onboarding_360")) ??
      (await storage.upsertEmailTemplate360(
        "participant_onboarding_360",
        DEFAULT_ONBOARDING_TEMPLATE.subject,
        DEFAULT_ONBOARDING_TEMPLATE.body,
      ))
    );
  }),

  saveOnboardingTemplate: adminProcedure
    .input(z.object({ subject: z.string().min(1), body: z.string().min(1) }))
    .mutation(({ input }) =>
      storage.upsertEmailTemplate360("participant_onboarding_360", input.subject.trim(), input.body.trim()),
    ),

  sendOnboarding: adminProcedure
    .input(z.object({ id: z.string(), subject: z.string().min(1), body: z.string().min(1), ccAdmin: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      const cycle = await storage.getFeedbackCycleById(input.id);
      if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "Cycle not found" });
      if (cycle.onboardingStatus === "agreed") {
        throw new TRPCError({ code: "CONFLICT", message: "Participant already agreed." });
      }

      const token = generateToken();
      const link = `${getAppBaseUrl()}/360-onboarding/${token}`;
      const email = buildLinkEmail({
        subjectTemplate: input.subject,
        bodyTemplate: input.body,
        vars: { participantName: cycle.clientName, clientName: cycle.clientName },
        linkKey: "agreementLink",
        link,
        ctaLabel: "Confirm my agreement",
      });

      const sent = await sendTrackedEmail({
        to: cycle.clientEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        trigger: "360-participant-onboarding",
        ...(input.ccAdmin && ADMIN_EMAILS[0] ? { bcc: ADMIN_EMAILS[0] } : {}),
      });

      await storage.updateFeedbackCycle(input.id, {
        onboardingStatus: "sent",
        participantToken: token,
        participantTokenExpiresAt: tokenExpiry(30),
        participantSentAt: new Date(),
        onboardingEmailSubject: email.subject,
        onboardingEmailBody: email.text,
      });

      return { emailSent: sent, emailConfigured: isEmailConfigured(), agreementLink: link };
    }),

  // ── Nominations ──
  getNominationTemplate: adminProcedure.query(async () => {
    return (
      (await storage.getEmailTemplate360("nomination_invitation_360")) ??
      (await storage.upsertEmailTemplate360(
        "nomination_invitation_360",
        DEFAULT_NOMINATION_TEMPLATE.subject,
        DEFAULT_NOMINATION_TEMPLATE.body,
      ))
    );
  }),

  listNominations: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => storage.getParticipantNominationsByCycleId(input.id)),

  deleteNomination: adminProcedure
    .input(z.object({ cycleId: z.string(), nominationId: z.string() }))
    .mutation(async ({ input }) => {
      const ok = await storage.deleteParticipantNomination(input.nominationId, input.cycleId);
      if (!ok) throw new TRPCError({ code: "NOT_FOUND" });
      return { ok };
    }),

  // Promote a nomination into a respondent.
  promoteNomination: adminProcedure
    .input(z.object({ cycleId: z.string(), nominationId: z.string(), relationship: z.enum(respondentRelationshipOptions) }))
    .mutation(async ({ input }) => {
      const nominations = await storage.getParticipantNominationsByCycleId(input.cycleId);
      const nom = nominations.find((n) => n.id === input.nominationId);
      if (!nom) throw new TRPCError({ code: "NOT_FOUND", message: "Nomination not found" });
      const respondent = await storage.createFeedbackRespondent({
        cycleId: input.cycleId,
        fullName: nom.nomineeName,
        email: nom.nomineeEmail.toLowerCase(),
        relationship: input.relationship,
        token: generateToken(),
        tokenExpiresAt: tokenExpiry(21),
        status: "pending",
        isSelf: false,
      });
      await storage.deleteParticipantNomination(input.nominationId, input.cycleId);
      const { token: _t, ...safe } = respondent;
      return safe;
    }),
});
