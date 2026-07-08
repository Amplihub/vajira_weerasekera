import { db } from "@/db";
import {
  coachingApplications,
  type InsertCoachingApplication,
  type CoachingApplication,
  formSubmissions,
  type FormSubmission,
  type InsertFormSubmission,
  auditLogs,
  type InsertAuditLog,
  insights,
  type InsertInsight,
  type Insight,
  contacts,
  type InsertContact,
  type Contact,
  coachingClients,
  type InsertCoachingClient,
  type CoachingClient,
  sessionNotes,
  type InsertSessionNote,
  type SessionNote,
  uploadedImages,
  type InsertUploadedImage,
  type UploadedImage,
  emailLogs,
  type EmailLog,
  type InsertEmailLog,
  feedbackCycles,
  type FeedbackCycle,
  type InsertFeedbackCycle,
  feedbackRespondents,
  type FeedbackRespondent,
  type InsertFeedbackRespondent,
  feedbackResponses,
  type FeedbackResponse,
  type InsertFeedbackResponse,
  feedbackSummaries,
  type FeedbackSummary,
  type InsertFeedbackSummary,
  emailTemplates360,
  type EmailTemplate360,
  participantNominations,
  type ParticipantNomination,
  type InsertParticipantNomination,
  personalClarityMaps,
  type PersonalClarityMap,
  type InsertPersonalClarityMap,
  personalClarityMapDimensions,
  type PersonalClarityMapDimension,
  type InsertPersonalClarityMapDimension,
} from "@/db/schema";
import { desc, asc, eq, ne, ilike, or, and, count, max, sql, inArray } from "drizzle-orm";

export class DatabaseStorage {
  async saveCoachingApplication(data: InsertCoachingApplication): Promise<CoachingApplication> {
    const [result] = await db.insert(coachingApplications).values(data).returning();
    return result;
  }

  async getCoachingApplications(): Promise<CoachingApplication[]> {
    return db.select().from(coachingApplications).orderBy(desc(coachingApplications.createdAt));
  }

  async getCoachingApplicationById(id: string): Promise<CoachingApplication | undefined> {
    const [result] = await db.select().from(coachingApplications).where(eq(coachingApplications.id, id));
    return result;
  }

  async deleteCoachingApplication(id: string): Promise<boolean> {
    const result = await db.delete(coachingApplications).where(eq(coachingApplications.id, id)).returning();
    return result.length > 0;
  }

  /** Idempotent landing for a GHL form submission — keyed by GHL submission id, safe on retries. */
  async upsertFormSubmission(data: InsertFormSubmission): Promise<FormSubmission> {
    const [result] = await db
      .insert(formSubmissions)
      .values(data)
      .onConflictDoNothing({ target: formSubmissions.ghlSubmissionId })
      .returning();
    if (result) return result;
    const [existing] = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.ghlSubmissionId, data.ghlSubmissionId));
    return existing;
  }

  async getFormSubmissions(filters?: { status?: string; formType?: string }): Promise<FormSubmission[]> {
    const conditions: ReturnType<typeof eq>[] = [];
    if (filters?.status) conditions.push(eq(formSubmissions.status, filters.status));
    if (filters?.formType) conditions.push(eq(formSubmissions.formType, filters.formType));
    return db
      .select()
      .from(formSubmissions)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(formSubmissions.createdAt));
  }

  async getFormSubmissionById(id: string): Promise<FormSubmission | undefined> {
    const [result] = await db.select().from(formSubmissions).where(eq(formSubmissions.id, id));
    return result;
  }

  async updateFormSubmissionStatus(
    id: string,
    status: string,
    convertedClientId?: string,
  ): Promise<FormSubmission | undefined> {
    const [result] = await db
      .update(formSubmissions)
      .set({ status, ...(convertedClientId !== undefined ? { convertedClientId } : {}) })
      .where(eq(formSubmissions.id, id))
      .returning();
    return result;
  }

  // ── Audit ──
  async logAudit(data: InsertAuditLog): Promise<void> {
    await db.insert(auditLogs).values(data);
  }

  // ── Paginated admin lists ──
  async getFormSubmissionsPaged(opts: {
    limit: number;
    offset: number;
    status?: string;
    formType?: string;
    search?: string;
  }): Promise<{ items: FormSubmission[]; total: number }> {
    const conditions = [];
    if (opts.status) conditions.push(eq(formSubmissions.status, opts.status));
    if (opts.formType) conditions.push(eq(formSubmissions.formType, opts.formType));
    if (opts.search) {
      const term = `%${opts.search}%`;
      conditions.push(or(ilike(formSubmissions.fullName, term), ilike(formSubmissions.email, term))!);
    }
    const where = conditions.length ? and(...conditions) : undefined;
    const [items, [{ value: total }]] = await Promise.all([
      db.select().from(formSubmissions).where(where).orderBy(desc(formSubmissions.createdAt)).limit(opts.limit).offset(opts.offset),
      db.select({ value: count() }).from(formSubmissions).where(where),
    ]);
    return { items, total: Number(total) };
  }

  async getAllInsightsPaged(opts: {
    limit: number;
    offset: number;
    status?: string;
    search?: string;
  }): Promise<{ items: Insight[]; total: number }> {
    const conditions = [];
    if (opts.status) conditions.push(eq(insights.status, opts.status));
    if (opts.search) conditions.push(ilike(insights.title, `%${opts.search}%`));
    const where = conditions.length ? and(...conditions) : undefined;
    const [items, [{ value: total }]] = await Promise.all([
      db.select().from(insights).where(where).orderBy(desc(insights.updatedAt)).limit(opts.limit).offset(opts.offset),
      db.select({ value: count() }).from(insights).where(where),
    ]);
    return { items, total: Number(total) };
  }

  async getEmailLogsPaged(opts: {
    limit: number;
    offset: number;
    search?: string;
  }): Promise<{ items: EmailLog[]; total: number }> {
    const where = opts.search
      ? or(ilike(emailLogs.to, `%${opts.search}%`), ilike(emailLogs.subject, `%${opts.search}%`))
      : undefined;
    const [items, [{ value: total }]] = await Promise.all([
      db.select().from(emailLogs).where(where).orderBy(desc(emailLogs.sentAt)).limit(opts.limit).offset(opts.offset),
      db.select({ value: count() }).from(emailLogs).where(where),
    ]);
    return { items, total: Number(total) };
  }

  async getCoachingClientsPaged(opts: {
    limit: number;
    offset: number;
    search?: string;
    status?: string;
    coachingType?: string;
  }): Promise<{ items: (CoachingClient & { contact: Contact; sessionCount: number; lastSessionDate: Date | null })[]; total: number }> {
    const conditions = [];
    if (opts.status) conditions.push(eq(coachingClients.status, opts.status));
    if (opts.coachingType) conditions.push(eq(coachingClients.coachingType, opts.coachingType));
    if (opts.search) {
      const term = `%${opts.search}%`;
      conditions.push(or(ilike(contacts.fullName, term), ilike(contacts.email, term), ilike(contacts.company, term))!);
    }
    const where = conditions.length ? and(...conditions) : undefined;

    const rows = await db
      .select({
        client: coachingClients,
        contact: contacts,
        sessionCount: count(sessionNotes.id),
        lastSessionDate: max(sessionNotes.sessionDate),
      })
      .from(coachingClients)
      .innerJoin(contacts, eq(coachingClients.contactId, contacts.id))
      .leftJoin(sessionNotes, eq(sessionNotes.coachingClientId, coachingClients.id))
      .where(where)
      .groupBy(coachingClients.id, contacts.id)
      .orderBy(desc(coachingClients.updatedAt))
      .limit(opts.limit)
      .offset(opts.offset);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(coachingClients)
      .innerJoin(contacts, eq(coachingClients.contactId, contacts.id))
      .where(where);

    return {
      items: rows.map((r) => ({
        ...r.client,
        contact: r.contact,
        sessionCount: Number(r.sessionCount),
        lastSessionDate: r.lastSessionDate ? new Date(r.lastSessionDate) : null,
      })),
      total: Number(total),
    };
  }

  async getPublishedInsights(): Promise<Insight[]> {
    return db.select().from(insights).where(eq(insights.status, "published")).orderBy(desc(insights.publishedAt));
  }

  async getPublishedInsightBySlug(slug: string): Promise<Insight | undefined> {
    const [result] = await db.select().from(insights).where(eq(insights.slug, slug));
    if (result && result.status !== "published") return undefined;
    return result;
  }

  async getAllInsights(): Promise<Insight[]> {
    return db.select().from(insights).orderBy(desc(insights.updatedAt));
  }

  async getInsightById(id: string): Promise<Insight | undefined> {
    const [result] = await db.select().from(insights).where(eq(insights.id, id));
    return result;
  }

  async createInsight(data: InsertInsight): Promise<Insight> {
    const [result] = await db.insert(insights).values(data).returning();
    return result;
  }

  async updateInsight(id: string, data: Partial<InsertInsight>): Promise<Insight | undefined> {
    const [result] = await db
      .update(insights)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(insights.id, id))
      .returning();
    return result;
  }

  async deleteInsight(id: string): Promise<boolean> {
    const result = await db.delete(insights).where(eq(insights.id, id)).returning();
    return result.length > 0;
  }

  async likeInsight(slug: string): Promise<Insight | undefined> {
    const [result] = await db
      .update(insights)
      .set({ likes: sql`${insights.likes} + 1` })
      .where(eq(insights.slug, slug))
      .returning();
    return result;
  }

  async findOrCreateContact(email: string, data: Partial<InsertContact>): Promise<Contact> {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await this.getContactByEmail(normalizedEmail);
    if (existing) {
      const [updated] = await db
        .update(contacts)
        .set({
          fullName: data.fullName || existing.fullName,
          phone: data.phone ?? existing.phone,
          company: data.company ?? existing.company,
          roleTitle: data.roleTitle ?? existing.roleTitle,
          updatedAt: new Date(),
        })
        .where(eq(contacts.id, existing.id))
        .returning();
      return updated;
    }
    const [result] = await db
      .insert(contacts)
      .values({
        fullName: data.fullName || "",
        email: normalizedEmail,
        phone: data.phone || null,
        company: data.company || null,
        roleTitle: data.roleTitle || null,
      })
      .returning();
    return result;
  }

  async getContactByEmail(email: string): Promise<Contact | undefined> {
    const [result] = await db.select().from(contacts).where(eq(contacts.email, email.toLowerCase().trim()));
    return result;
  }

  async createCoachingClient(data: InsertCoachingClient): Promise<CoachingClient> {
    const [result] = await db.insert(coachingClients).values(data).returning();
    return result;
  }

  async getCoachingClients(filters?: {
    search?: string;
    status?: string;
    coachingType?: string;
  }): Promise<(CoachingClient & { contact: Contact; sessionCount: number; lastSessionDate: Date | null })[]> {
    const conditions: ReturnType<typeof eq>[] = [];

    if (filters?.status) conditions.push(eq(coachingClients.status, filters.status));
    if (filters?.coachingType) conditions.push(eq(coachingClients.coachingType, filters.coachingType));
    if (filters?.search) {
      const term = `%${filters.search}%`;
      conditions.push(
        or(ilike(contacts.fullName, term), ilike(contacts.email, term), ilike(contacts.company, term))!,
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        client: coachingClients,
        contact: contacts,
        sessionCount: count(sessionNotes.id),
        lastSessionDate: max(sessionNotes.sessionDate),
      })
      .from(coachingClients)
      .innerJoin(contacts, eq(coachingClients.contactId, contacts.id))
      .leftJoin(sessionNotes, eq(sessionNotes.coachingClientId, coachingClients.id))
      .where(whereClause)
      .groupBy(coachingClients.id, contacts.id)
      .orderBy(desc(coachingClients.updatedAt));

    return rows.map((r) => ({
      ...r.client,
      contact: r.contact,
      sessionCount: Number(r.sessionCount),
      lastSessionDate: r.lastSessionDate ? new Date(r.lastSessionDate) : null,
    }));
  }

  async getCoachingClientById(id: string): Promise<(CoachingClient & { contact: Contact }) | undefined> {
    const [row] = await db
      .select({ client: coachingClients, contact: contacts })
      .from(coachingClients)
      .innerJoin(contacts, eq(coachingClients.contactId, contacts.id))
      .where(eq(coachingClients.id, id));
    if (!row) return undefined;
    return { ...row.client, contact: row.contact };
  }

  async getCoachingClientByEmail(email: string): Promise<(CoachingClient & { contact: Contact }) | undefined> {
    const contact = await this.getContactByEmail(email);
    if (!contact) return undefined;
    const [row] = await db
      .select({ client: coachingClients, contact: contacts })
      .from(coachingClients)
      .innerJoin(contacts, eq(coachingClients.contactId, contacts.id))
      .where(eq(coachingClients.contactId, contact.id));
    if (!row) return undefined;
    return { ...row.client, contact: row.contact };
  }

  async updateCoachingClient(id: string, data: Partial<InsertCoachingClient>): Promise<CoachingClient | undefined> {
    const [result] = await db
      .update(coachingClients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(coachingClients.id, id))
      .returning();
    return result;
  }

  async createSessionNote(data: InsertSessionNote): Promise<SessionNote> {
    const [result] = await db.insert(sessionNotes).values(data).returning();
    return result;
  }

  async getSessionNotesByClientId(clientId: string): Promise<SessionNote[]> {
    return db
      .select()
      .from(sessionNotes)
      .where(eq(sessionNotes.coachingClientId, clientId))
      .orderBy(desc(sessionNotes.sessionDate));
  }

  async getSessionNoteById(id: string): Promise<SessionNote | undefined> {
    const [result] = await db.select().from(sessionNotes).where(eq(sessionNotes.id, id));
    return result;
  }

  async updateSessionNote(id: string, data: Partial<InsertSessionNote>): Promise<SessionNote | undefined> {
    const [result] = await db
      .update(sessionNotes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sessionNotes.id, id))
      .returning();
    return result;
  }

  async deleteSessionNote(id: string): Promise<boolean> {
    const result = await db.delete(sessionNotes).where(eq(sessionNotes.id, id)).returning();
    return result.length > 0;
  }

  async getNextSessionNumber(clientId: string): Promise<number> {
    const [result] = await db
      .select({ maxNum: sql<number>`COALESCE(MAX(${sessionNotes.sessionNumber}), 0)` })
      .from(sessionNotes)
      .where(eq(sessionNotes.coachingClientId, clientId));
    return (result?.maxNum ?? 0) + 1;
  }

  async createUploadedImage(data: InsertUploadedImage): Promise<UploadedImage> {
    const [result] = await db.insert(uploadedImages).values(data).returning();
    return result;
  }

  async getUploadedImageById(id: string): Promise<UploadedImage | undefined> {
    const [result] = await db.select().from(uploadedImages).where(eq(uploadedImages.id, id));
    return result;
  }

  async logEmail(data: InsertEmailLog): Promise<EmailLog> {
    const [result] = await db.insert(emailLogs).values(data).returning();
    return result;
  }

  async getEmailLog(id: string): Promise<EmailLog | undefined> {
    const [result] = await db.select().from(emailLogs).where(eq(emailLogs.id, id));
    return result;
  }

  async getEmailLogs(): Promise<EmailLog[]> {
    return db.select().from(emailLogs).orderBy(desc(emailLogs.sentAt));
  }

  async deleteEmailLog(id: string): Promise<boolean> {
    const result = await db.delete(emailLogs).where(eq(emailLogs.id, id)).returning();
    return result.length > 0;
  }

  async deleteEmailLogs(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db.delete(emailLogs).where(inArray(emailLogs.id, ids)).returning();
    return result.length;
  }

  async createFeedbackCycle(data: InsertFeedbackCycle): Promise<FeedbackCycle> {
    const [result] = await db.insert(feedbackCycles).values(data).returning();
    return result;
  }

  async getFeedbackCycles(): Promise<
    (FeedbackCycle & { clientName: string; respondentCount: number; completedCount: number })[]
  > {
    const rows = await db
      .select({
        cycle: feedbackCycles,
        clientName: contacts.fullName,
        respondentCount: count(feedbackRespondents.id),
      })
      .from(feedbackCycles)
      .innerJoin(coachingClients, eq(feedbackCycles.coachingClientId, coachingClients.id))
      .innerJoin(contacts, eq(coachingClients.contactId, contacts.id))
      .leftJoin(feedbackRespondents, eq(feedbackRespondents.cycleId, feedbackCycles.id))
      .groupBy(feedbackCycles.id, contacts.fullName)
      .orderBy(desc(feedbackCycles.createdAt));

    const cycleIds = rows.map((r) => r.cycle.id);
    let completedMap: Record<string, number> = {};
    if (cycleIds.length > 0) {
      const completedRows = await db
        .select({ cycleId: feedbackRespondents.cycleId, cnt: count(feedbackRespondents.id) })
        .from(feedbackRespondents)
        .where(and(inArray(feedbackRespondents.cycleId, cycleIds), eq(feedbackRespondents.status, "completed")))
        .groupBy(feedbackRespondents.cycleId);
      completedMap = Object.fromEntries(completedRows.map((r) => [r.cycleId, Number(r.cnt)]));
    }

    return rows.map((r) => ({
      ...r.cycle,
      clientName: r.clientName,
      respondentCount: Number(r.respondentCount),
      completedCount: completedMap[r.cycle.id] ?? 0,
    }));
  }

  async getFeedbackCycleById(
    id: string,
  ): Promise<(FeedbackCycle & { clientName: string; clientEmail: string }) | undefined> {
    const [row] = await db
      .select({ cycle: feedbackCycles, clientName: contacts.fullName, clientEmail: contacts.email })
      .from(feedbackCycles)
      .innerJoin(coachingClients, eq(feedbackCycles.coachingClientId, coachingClients.id))
      .innerJoin(contacts, eq(coachingClients.contactId, contacts.id))
      .where(eq(feedbackCycles.id, id));
    if (!row) return undefined;
    return { ...row.cycle, clientName: row.clientName, clientEmail: row.clientEmail };
  }

  async updateFeedbackCycle(id: string, data: Partial<InsertFeedbackCycle>): Promise<FeedbackCycle | undefined> {
    const [result] = await db
      .update(feedbackCycles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(feedbackCycles.id, id))
      .returning();
    return result;
  }

  /**
   * Atomically mark a cycle agreed — only if it is not already agreed. Returns
   * the updated row when THIS call won the race, or undefined if it was already
   * agreed (so the caller knows not to re-mint tokens or re-send emails).
   */
  async markFeedbackCycleAgreed(id: string, data: Partial<InsertFeedbackCycle>): Promise<FeedbackCycle | undefined> {
    const [result] = await db
      .update(feedbackCycles)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(feedbackCycles.id, id), ne(feedbackCycles.onboardingStatus, "agreed")))
      .returning();
    return result;
  }

  async deleteFeedbackCycle(id: string): Promise<boolean> {
    const respondents = await this.getFeedbackRespondentsByCycleId(id);
    const respondentIds = respondents.map((r) => r.id);
    if (respondentIds.length > 0) {
      await db.delete(feedbackResponses).where(inArray(feedbackResponses.respondentId, respondentIds));
    }
    await db.delete(feedbackRespondents).where(eq(feedbackRespondents.cycleId, id));
    await db.delete(feedbackSummaries).where(eq(feedbackSummaries.cycleId, id));
    const result = await db.delete(feedbackCycles).where(eq(feedbackCycles.id, id)).returning();
    return result.length > 0;
  }

  async createFeedbackRespondent(data: InsertFeedbackRespondent): Promise<FeedbackRespondent> {
    const [result] = await db.insert(feedbackRespondents).values(data).returning();
    return result;
  }

  async getFeedbackRespondentsByCycleId(cycleId: string): Promise<FeedbackRespondent[]> {
    return db
      .select()
      .from(feedbackRespondents)
      .where(eq(feedbackRespondents.cycleId, cycleId))
      .orderBy(feedbackRespondents.createdAt);
  }

  async getFeedbackRespondentByToken(token: string): Promise<FeedbackRespondent | undefined> {
    const [result] = await db.select().from(feedbackRespondents).where(eq(feedbackRespondents.token, token));
    return result;
  }

  async getFeedbackRespondentById(id: string): Promise<FeedbackRespondent | undefined> {
    const [result] = await db.select().from(feedbackRespondents).where(eq(feedbackRespondents.id, id));
    return result;
  }

  async updateFeedbackRespondent(
    id: string,
    data: Partial<InsertFeedbackRespondent>,
  ): Promise<FeedbackRespondent | undefined> {
    const [result] = await db
      .update(feedbackRespondents)
      .set(data)
      .where(eq(feedbackRespondents.id, id))
      .returning();
    return result;
  }

  async deleteFeedbackRespondent(id: string): Promise<boolean> {
    const result = await db.delete(feedbackRespondents).where(eq(feedbackRespondents.id, id)).returning();
    return result.length > 0;
  }

  async createFeedbackResponse(data: InsertFeedbackResponse): Promise<FeedbackResponse> {
    const [result] = await db.insert(feedbackResponses).values(data).returning();
    return result;
  }

  async getFeedbackResponseByRespondentId(respondentId: string): Promise<FeedbackResponse | undefined> {
    const [result] = await db
      .select()
      .from(feedbackResponses)
      .where(eq(feedbackResponses.respondentId, respondentId));
    return result;
  }

  async getFeedbackResponsesByCycleId(
    cycleId: string,
  ): Promise<(FeedbackResponse & { respondent: FeedbackRespondent })[]> {
    const respondents = await this.getFeedbackRespondentsByCycleId(cycleId);
    const completedRespondentIds = respondents.filter((r) => r.status === "completed").map((r) => r.id);
    if (completedRespondentIds.length === 0) return [];
    const responses = await db
      .select()
      .from(feedbackResponses)
      .where(inArray(feedbackResponses.respondentId, completedRespondentIds));
    const respondentMap = Object.fromEntries(respondents.map((r) => [r.id, r]));
    return responses.map((resp) => ({ ...resp, respondent: respondentMap[resp.respondentId] }));
  }

  async getFeedbackSummaryByCycleId(cycleId: string): Promise<FeedbackSummary | undefined> {
    const [result] = await db.select().from(feedbackSummaries).where(eq(feedbackSummaries.cycleId, cycleId));
    return result;
  }

  async upsertFeedbackSummary(cycleId: string, data: Partial<InsertFeedbackSummary>): Promise<FeedbackSummary> {
    const existing = await this.getFeedbackSummaryByCycleId(cycleId);
    if (existing) {
      const [result] = await db
        .update(feedbackSummaries)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(feedbackSummaries.cycleId, cycleId))
        .returning();
      return result;
    }
    const [result] = await db
      .insert(feedbackSummaries)
      .values({ cycleId, ...data })
      .returning();
    return result;
  }

  async approveFeedbackSummary(cycleId: string, approvedBy: string): Promise<FeedbackSummary | undefined> {
    const [result] = await db
      .update(feedbackSummaries)
      .set({ status: "approved", approvedAt: new Date(), approvedBy, updatedAt: new Date() })
      .where(eq(feedbackSummaries.cycleId, cycleId))
      .returning();
    return result;
  }

  async getEmailTemplate360(type: string): Promise<EmailTemplate360 | undefined> {
    const [result] = await db.select().from(emailTemplates360).where(eq(emailTemplates360.type, type));
    return result;
  }

  async upsertEmailTemplate360(type: string, subject: string, body: string): Promise<EmailTemplate360> {
    const existing = await this.getEmailTemplate360(type);
    if (existing) {
      const [result] = await db
        .update(emailTemplates360)
        .set({ subject, body, updatedAt: new Date() })
        .where(eq(emailTemplates360.type, type))
        .returning();
      return result;
    }
    const [result] = await db.insert(emailTemplates360).values({ type, subject, body }).returning();
    return result;
  }

  async getFeedbackCycleByParticipantToken(token: string): Promise<FeedbackCycle | undefined> {
    const [result] = await db.select().from(feedbackCycles).where(eq(feedbackCycles.participantToken, token));
    return result;
  }

  async getFeedbackCycleByNominationToken(token: string): Promise<FeedbackCycle | undefined> {
    const [result] = await db.select().from(feedbackCycles).where(eq(feedbackCycles.nominationToken, token));
    return result;
  }

  async createParticipantNomination(data: InsertParticipantNomination): Promise<ParticipantNomination> {
    const [result] = await db.insert(participantNominations).values(data).returning();
    return result;
  }

  async getParticipantNominationsByCycleId(cycleId: string): Promise<ParticipantNomination[]> {
    return db
      .select()
      .from(participantNominations)
      .where(eq(participantNominations.cycleId, cycleId))
      .orderBy(participantNominations.submittedAt);
  }

  async deleteParticipantNomination(id: string, cycleId: string): Promise<boolean> {
    const result = await db
      .delete(participantNominations)
      .where(and(eq(participantNominations.id, id), eq(participantNominations.cycleId, cycleId)))
      .returning();
    return result.length > 0;
  }

  async getPersonalClarityMapBySessionNoteId(
    sessionNoteId: string,
  ): Promise<(PersonalClarityMap & { dimensions: PersonalClarityMapDimension[] }) | undefined> {
    const [map] = await db.select().from(personalClarityMaps).where(eq(personalClarityMaps.sessionNoteId, sessionNoteId));
    if (!map) return undefined;
    const dims = await db
      .select()
      .from(personalClarityMapDimensions)
      .where(eq(personalClarityMapDimensions.mapId, map.id))
      .orderBy(asc(personalClarityMapDimensions.sortOrder));
    return { ...map, dimensions: dims };
  }

  async upsertPersonalClarityMap(
    sessionNoteId: string,
    clientId: string,
    mapData: Partial<InsertPersonalClarityMap>,
    dimensions: Omit<InsertPersonalClarityMapDimension, "mapId" | "id" | "createdAt" | "updatedAt">[],
  ): Promise<PersonalClarityMap & { dimensions: PersonalClarityMapDimension[] }> {
    const [existing] = await db
      .select()
      .from(personalClarityMaps)
      .where(eq(personalClarityMaps.sessionNoteId, sessionNoteId));
    let map: PersonalClarityMap;
    if (existing) {
      const [updated] = await db
        .update(personalClarityMaps)
        .set({ ...mapData, updatedAt: new Date() })
        .where(eq(personalClarityMaps.id, existing.id))
        .returning();
      map = updated;
      await db.delete(personalClarityMapDimensions).where(eq(personalClarityMapDimensions.mapId, map.id));
    } else {
      const [created] = await db
        .insert(personalClarityMaps)
        .values({ sessionNoteId, clientId, ...mapData })
        .returning();
      map = created;
    }
    const dims =
      dimensions.length > 0
        ? await db
            .insert(personalClarityMapDimensions)
            .values(dimensions.map((d) => ({ ...d, mapId: map.id })))
            .returning()
        : [];
    return { ...map, dimensions: dims };
  }
}

export const storage = new DatabaseStorage();
