import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, rateLimitedPublicProcedure as publicProcedure } from "../trpc";
import { storage } from "@/lib/queries";
import { generateToken, tokenExpiry, isExpired } from "@/lib/tokens";
import { getAppBaseUrl } from "@/lib/app-url";
import { sendTrackedEmail, isEmailConfigured } from "@/lib/email";
import { buildLinkEmail, DEFAULT_NOMINATION_TEMPLATE, invitation360Html } from "@/lib/email-templates";

// All procedures here are PUBLIC but gated by an unguessable single-purpose token.
// Tokens are validated for existence + expiry + state on every call; tokens are
// never returned to clients.

const ratingValue = z.number().int().min(1).max(5).nullable();
const QKEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12"] as const;

export const feedbackPublicRouter = createTRPCRouter({
  // ── Participant onboarding ──
  onboardingValidate: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    const cycle = await storage.getFeedbackCycleByParticipantToken(input.token);
    if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "invalid" });
    if (cycle.onboardingStatus === "agreed") return { status: "already_agreed" as const };
    if (isExpired(cycle.participantTokenExpiresAt)) throw new TRPCError({ code: "BAD_REQUEST", message: "expired" });
    const full = await storage.getFeedbackCycleById(cycle.id);
    return {
      status: "pending" as const,
      participantName: full?.clientName ?? "Participant",
      emailBody: cycle.onboardingEmailBody ?? "",
    };
  }),

  onboardingAgree: publicProcedure.input(z.object({ token: z.string() })).mutation(async ({ input }) => {
    const cycle = await storage.getFeedbackCycleByParticipantToken(input.token);
    if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "invalid" });
    const nominationUrlFor = (tok: string) => `${getAppBaseUrl()}/360-nominate/${tok}`;
    if (cycle.onboardingStatus === "agreed") {
      return {
        alreadyAgreed: true,
        emailSent: false,
        emailConfigured: isEmailConfigured(),
        nominationUrl: cycle.nominationToken ? nominationUrlFor(cycle.nominationToken) : null,
      };
    }
    if (isExpired(cycle.participantTokenExpiresAt)) throw new TRPCError({ code: "BAD_REQUEST", message: "expired" });

    const nominationToken = generateToken();
    // Atomic guarded write: only the FIRST agree (status != agreed) wins. A
    // concurrent second click / reload gets `undefined` here and skips the
    // re-mint + re-email entirely, returning the token already on record.
    const won = await storage.markFeedbackCycleAgreed(cycle.id, {
      onboardingStatus: "agreed",
      participantAgreedAt: new Date(),
      status: cycle.status === "draft" ? "active" : cycle.status,
      nominationToken,
      nominationTokenExpiresAt: tokenExpiry(60),
      nominationEmailSentAt: new Date(),
    });
    if (!won) {
      const existing = await storage.getFeedbackCycleByParticipantToken(input.token);
      return {
        alreadyAgreed: true,
        emailSent: false,
        emailConfigured: isEmailConfigured(),
        nominationUrl: existing?.nominationToken ? nominationUrlFor(existing.nominationToken) : null,
      };
    }

    // Auto-send the nomination follow-up to the participant so they can pick
    // who gives feedback. If Resend isn't configured we still return the link
    // so the participant can continue immediately on-screen.
    const nominationUrl = nominationUrlFor(nominationToken);
    const full = await storage.getFeedbackCycleById(cycle.id);
    let emailSent = false;
    if (full?.clientEmail) {
      const template =
        (await storage.getEmailTemplate360("nomination_invitation_360")) ??
        (await storage.upsertEmailTemplate360(
          "nomination_invitation_360",
          DEFAULT_NOMINATION_TEMPLATE.subject,
          DEFAULT_NOMINATION_TEMPLATE.body,
        ));
      const email = buildLinkEmail({
        subjectTemplate: template.subject,
        bodyTemplate: template.body,
        vars: { clientName: full.clientName, participantName: full.clientName },
        linkKey: "nominationLink",
        link: nominationUrl,
        ctaLabel: "Nominate respondents",
      });
      emailSent = await sendTrackedEmail({
        to: full.clientEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        trigger: "360-nomination-invitation",
      });
    }

    // Auto-create the participant's self-assessment respondent + send its survey
    // email. So confirming onboarding kicks off BOTH expected emails: the
    // nomination request (above) and the self-assessment (here).
    let selfEmailSent = false;
    if (full?.clientEmail) {
      const existing = await storage.getFeedbackRespondentsByCycleId(cycle.id);
      if (!existing.some((r) => r.isSelf)) {
        const selfToken = generateToken();
        const selfResp = await storage.createFeedbackRespondent({
          cycleId: cycle.id,
          fullName: full.clientName,
          email: full.clientEmail,
          relationship: "Self",
          token: selfToken,
          tokenExpiresAt: tokenExpiry(21),
          status: "pending",
          isSelf: true,
        });
        selfEmailSent = await sendTrackedEmail({
          to: full.clientEmail,
          subject: `Your 360 Leadership Self-Assessment — ${full.title}`,
          html: invitation360Html(full.clientName, full.clientName, `${getAppBaseUrl()}/360/${selfToken}`, true),
          trigger: "360-self-invitation",
        });
        await storage.updateFeedbackRespondent(selfResp.id, { invitedAt: new Date() });
      }
    }

    return { alreadyAgreed: false, emailSent, selfEmailSent, emailConfigured: isEmailConfigured(), nominationUrl };
  }),

  // ── Nomination ──
  nominateValidate: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    const cycle = await storage.getFeedbackCycleByNominationToken(input.token);
    if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "invalid" });
    if (isExpired(cycle.nominationTokenExpiresAt)) throw new TRPCError({ code: "BAD_REQUEST", message: "expired" });
    const full = await storage.getFeedbackCycleById(cycle.id);
    return { clientName: full?.clientName ?? "Participant" };
  }),

  nominateSubmit: publicProcedure
    .input(
      z.object({
        token: z.string(),
        nominees: z
          .array(
            z.object({
              nomineeName: z.string().min(1),
              nomineeEmail: z.string().email(),
              nomineeRole: z.string().default(""),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const cycle = await storage.getFeedbackCycleByNominationToken(input.token);
      if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "invalid" });
      if (isExpired(cycle.nominationTokenExpiresAt)) throw new TRPCError({ code: "BAD_REQUEST", message: "expired" });

      for (const n of input.nominees) {
        await storage.createParticipantNomination({
          cycleId: cycle.id,
          nomineeName: n.nomineeName.trim(),
          nomineeEmail: n.nomineeEmail.trim().toLowerCase(),
          nomineeRole: n.nomineeRole.trim(),
        });
      }
      return { count: input.nominees.length };
    }),

  // ── Survey (respondent + self) ──
  validate: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    const respondent = await storage.getFeedbackRespondentByToken(input.token);
    if (!respondent) throw new TRPCError({ code: "NOT_FOUND", message: "invalid" });
    if (isExpired(respondent.tokenExpiresAt)) throw new TRPCError({ code: "BAD_REQUEST", message: "expired" });
    const cycle = await storage.getFeedbackCycleById(respondent.cycleId);
    if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "invalid" });
    if (cycle.status === "closed") throw new TRPCError({ code: "BAD_REQUEST", message: "closed" });
    if (respondent.status === "completed") throw new TRPCError({ code: "CONFLICT", message: "completed" });
    if (respondent.status === "declined") throw new TRPCError({ code: "BAD_REQUEST", message: "declined" });
    return {
      cycleTitle: cycle.title,
      clientName: cycle.clientName,
      respondentName: respondent.fullName,
      isSelf: respondent.isSelf,
      status: respondent.status,
    };
  }),

  consent: publicProcedure.input(z.object({ token: z.string() })).mutation(async ({ input }) => {
    const respondent = await storage.getFeedbackRespondentByToken(input.token);
    if (!respondent) throw new TRPCError({ code: "NOT_FOUND", message: "invalid" });
    if (isExpired(respondent.tokenExpiresAt)) throw new TRPCError({ code: "BAD_REQUEST", message: "expired" });
    if (respondent.status === "completed") throw new TRPCError({ code: "CONFLICT", message: "completed" });
    const cycle = await storage.getFeedbackCycleById(respondent.cycleId);
    if (!cycle || cycle.status === "closed") throw new TRPCError({ code: "BAD_REQUEST", message: "closed" });
    await storage.updateFeedbackRespondent(respondent.id, { status: "consented", consentedAt: new Date() });
    return { ok: true };
  }),

  submit: publicProcedure
    .input(
      z.object({
        token: z.string(),
        ratings: z.record(z.enum(QKEYS), ratingValue),
        openText: z.record(z.enum(["q1", "q2", "q3", "q4"]), z.string()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const respondent = await storage.getFeedbackRespondentByToken(input.token);
      if (!respondent) throw new TRPCError({ code: "NOT_FOUND", message: "invalid" });
      if (isExpired(respondent.tokenExpiresAt)) throw new TRPCError({ code: "BAD_REQUEST", message: "expired" });
      if (respondent.status === "completed") throw new TRPCError({ code: "CONFLICT", message: "completed" });
      const cycle = await storage.getFeedbackCycleById(respondent.cycleId);
      if (!cycle || cycle.status === "closed") throw new TRPCError({ code: "BAD_REQUEST", message: "closed" });

      const cleanRatings: Record<string, number | null> = {};
      for (const k of QKEYS) cleanRatings[k] = input.ratings[k] ?? null;
      const cleanOpenText: Record<string, string> = {};
      for (let i = 1; i <= 4; i++) cleanOpenText[`q${i}`] = (input.openText?.[`q${i}` as "q1"] ?? "").trim();

      await storage.createFeedbackResponse({
        respondentId: respondent.id,
        ratings: cleanRatings,
        openText: cleanOpenText,
      });
      await storage.updateFeedbackRespondent(respondent.id, { status: "completed", completedAt: new Date() });
      return { ok: true };
    }),
});
