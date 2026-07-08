import { z } from "zod";
import { pgTable, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { createId } from "@paralleldrive/cuid2";

// Auth tables (user/session/account/verification) live in ./auth-schema.ts — managed by BetterAuth.

// ── Public form validation schemas ─────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.enum(["Executive Coaching", "Speaking Enquiry", "Emerging Leaders Program", "General"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;

export const speakingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  organization: z.string().min(1, "Organization is required"),
  eventDate: z.string().min(1, "Event date is required"),
  audienceSize: z.string().min(1, "Audience size is required"),
  budgetRange: z.string().min(1, "Budget range is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
export type SpeakingFormData = z.infer<typeof speakingFormSchema>;

export const programOptions = [
  "High Stakes Roadmap Session",
  "Leadership Clarity Accelerator",
  "Executive Leadership Partnership",
  "Emerging Leaders Program",
  "Complimentary 30 Min Call",
] as const;

export const bookingInquirySchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  role: z.string().min(1, "Current role / title is required"),
  organization: z.string().optional(),
  timezone: z.string().optional(),
  discussion: z.string().min(10, "Please describe what you'd like to discuss (at least 10 characters)"),
  successDefinition: z.string().min(10, "Please define what success looks like (at least 10 characters)"),
  referralSource: z.string().optional(),
});
export type BookingInquiryData = z.infer<typeof bookingInquirySchema>;

export const programParamMap: Record<string, (typeof programOptions)[number]> = {
  roadmap: "High Stakes Roadmap Session",
  partnership: "Leadership Clarity Accelerator",
  journey: "Executive Leadership Partnership",
  emerging: "Emerging Leaders Program",
};

export const coachingApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  role: z.string().min(1, "Current role is required"),
  organization: z.string().optional(),
  location: z.string().optional(),
  program: z.enum(programOptions, { error: "Please select a program" }),
  navigating: z.string().min(10, "Please share what you're navigating"),
  outcomes: z.string().min(10, "Please share your desired outcomes"),
  whyNow: z.string().min(10, "Please share why you're seeking coaching now"),
  funding: z.enum(["Self-funded", "Organization-sponsored", "Unsure"]),
  anythingElse: z.string().optional(),
  acceptedTerms: z.literal(true, {
    error: "Please agree to the Terms & Conditions and Privacy Policy to continue.",
  }),
  consentRecordingAi: z.literal(true, {
    error: "Please provide recording and AI consent to continue.",
  }),
});
export type CoachingApplicationData = z.infer<typeof coachingApplicationSchema>;

// ── Tables ──────────────────────────────────────────────────────────────────

export const coachingApplications = pgTable("coaching_applications", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  organization: text("organization"),
  location: text("location"),
  program: text("program").notNull(),
  navigating: text("navigating").notNull(),
  outcomes: text("outcomes").notNull(),
  whyNow: text("why_now").notNull(),
  funding: text("funding").notNull(),
  anythingElse: text("anything_else"),
  acceptedTerms: boolean("accepted_terms").notNull().default(false),
  consentRecordingAi: boolean("consent_recording_ai").notNull().default(false),
  acceptedTermsAt: timestamp("accepted_terms_at"),
  consentRecordingAiAt: timestamp("consent_recording_ai_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const insertCoachingApplicationSchema = createInsertSchema(coachingApplications).omit({ id: true, createdAt: true });
export type InsertCoachingApplication = z.infer<typeof insertCoachingApplicationSchema>;
export type CoachingApplication = typeof coachingApplications.$inferSelect;

// Universal landing zone for GoHighLevel form submissions (contact, speaking,
// coaching application, booking). Stores the raw GHL payload so nothing is lost
// regardless of GHL field naming; parsed common fields power the admin inbox.
export const formSubmissionTypes = ["contact", "speaking", "coaching_application", "booking", "other"] as const;
export const formSubmissionStatuses = ["new", "reviewed", "converted", "archived"] as const;

export const formSubmissions = pgTable("form_submissions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  ghlSubmissionId: text("ghl_submission_id").notNull().unique(),
  formType: text("form_type").notNull().default("other"),
  fullName: text("full_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  role: text("role"),
  message: text("message"),
  rawPayload: jsonb("raw_payload").notNull(),
  status: text("status").notNull().default("new"),
  convertedClientId: text("converted_client_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = typeof formSubmissions.$inferInsert;

// Admin action audit trail (lightweight; logs admin mutations).
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  actorEmail: text("actor_email"),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  status: text("status").notNull().default("success"),
  errorMessage: text("error_message"),
  ipAddress: text("ip_address"),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

export const insightStatusOptions = ["draft", "published"] as const;

export const insights = pgTable("insights", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  featuredImageUrl: text("featured_image_url"),
  featuredImageAlt: text("featured_image_alt"),
  body: text("body").notNull(),
  author: text("author").notNull().default("Vajira Weerasekera"),
  status: text("status").notNull().default("draft"),
  category: text("category"),
  readTime: text("read_time"),
  publishedAt: timestamp("published_at"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const insertInsightSchema = createInsertSchema(insights).omit({ id: true, likes: true, createdAt: true, updatedAt: true });
export const insightFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  featuredImageUrl: z.string().optional().nullable(),
  featuredImageAlt: z.string().optional().nullable(),
  body: z.string().min(1, "Body content is required"),
  author: z.string().default("Vajira Weerasekera"),
  status: z.enum(insightStatusOptions).default("draft"),
  category: z.string().optional().nullable(),
  readTime: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});
export type InsightFormData = z.infer<typeof insightFormSchema>;
export type InsertInsight = z.infer<typeof insertInsightSchema>;
export type Insight = typeof insights.$inferSelect;

export const contacts = pgTable("contacts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company"),
  roleTitle: text("role_title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export const coachingTypeOptions = ["One-Off Session", "4-Month Program", "10-Month Program"] as const;
export const clientStatusOptions = ["Active", "Paused", "Completed", "Prospect"] as const;

export const coachingClients = pgTable("coaching_clients", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  contactId: text("contact_id").notNull(),
  coachingType: text("coaching_type").notNull(),
  status: text("status").notNull().default("Prospect"),
  startDate: timestamp("start_date"),
  nextSessionDate: timestamp("next_session_date"),
  primaryGoals: text("primary_goals"),
  backgroundSummary: text("background_summary"),
  sourceApplicationId: text("source_application_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const insertCoachingClientSchema = createInsertSchema(coachingClients).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCoachingClient = z.infer<typeof insertCoachingClientSchema>;
export type CoachingClient = typeof coachingClients.$inferSelect;

export const coachingClientFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  roleTitle: z.string().optional(),
  coachingType: z.enum(coachingTypeOptions, { error: "Please select a coaching type" }),
  status: z.enum(clientStatusOptions).default("Prospect"),
  startDate: z.string().optional(),
  nextSessionDate: z.string().optional(),
  primaryGoals: z.string().optional(),
  backgroundSummary: z.string().optional(),
  sourceApplicationId: z.string().optional(),
});
export type CoachingClientFormData = z.infer<typeof coachingClientFormSchema>;

export const noteSourceOptions = ["Live Notes", "Plaud Transcript", "Plaud AI Summary", "Mixed"] as const;
export const sessionFormatOptions = ["Zoom", "In Person", "Phone", "Other"] as const;

export const sessionNotes = pgTable("session_notes", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  coachingClientId: text("coaching_client_id").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  sessionTitle: text("session_title").notNull(),
  sessionNumber: integer("session_number"),
  noteSource: text("note_source").notNull().default("Live Notes"),
  sessionFormat: text("session_format").notNull().default("Zoom"),
  durationMinutes: integer("duration_minutes"),
  whatChangedSinceLastSession: text("what_changed_since_last_session"),
  keyThemesDiscussed: text("key_themes_discussed"),
  insightsAndBreakthroughs: text("insights_and_breakthroughs"),
  decisionsMade: text("decisions_made"),
  commitmentsBeforeNextSession: text("commitments_before_next_session"),
  nextSessionFocus: text("next_session_focus"),
  coachObservations: text("coach_observations"),
  privateNotes: text("private_notes"),
  plaudTranscriptText: text("plaud_transcript_text"),
  plaudAiSummaryText: text("plaud_ai_summary_text"),
  attachmentName: text("attachment_name"),
  attachmentUrl: text("attachment_url"),
  isDraft: text("is_draft").notNull().default("false"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const insertSessionNoteSchema = createInsertSchema(sessionNotes).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSessionNote = z.infer<typeof insertSessionNoteSchema>;
export type SessionNote = typeof sessionNotes.$inferSelect;

// Replaces local-disk + base64 storage: files now live in Supabase Storage; we keep a metadata row + public URL.
export const uploadedImages = pgTable("uploaded_images", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  storagePath: text("storage_path").notNull(),
  publicUrl: text("public_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type UploadedImage = typeof uploadedImages.$inferSelect;
export type InsertUploadedImage = typeof uploadedImages.$inferInsert;

export const emailLogs = pgTable("email_logs", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  trigger: text("trigger").notNull(),
  preview: text("preview"),
  success: boolean("success").notNull().default(true),
  error: text("error"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  htmlBody: text("html_body"),
  textBody: text("text_body"),
});
export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

// ── Personal Clarity Map ─────────────────────────────────────────────────────

export const personalClaritySignals = ["Stable", "Emerging", "Under Pressure", "Avoided", "Unclear"] as const;
export const personalClarityDimensionKeys = ["physical", "emotional", "financial", "spiritual", "relationship"] as const;
export const personalClarityStatuses = ["ai_draft", "coach_reviewed", "sent"] as const;

export const personalClarityMaps = pgTable("personal_clarity_maps", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  sessionNoteId: text("session_note_id").notNull(),
  clientId: text("client_id").notNull(),
  overallSummary: text("overall_summary"),
  topThemes: text("top_themes"),
  suggestedNextFocus: text("suggested_next_focus"),
  status: text("status").notNull().default("ai_draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const personalClarityMapDimensions = pgTable("personal_clarity_map_dimensions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  mapId: text("map_id").notNull(),
  dimension: text("dimension").notNull(),
  clientReflections: text("client_reflections"),
  keyThemes: text("key_themes"),
  coachInterpretation: text("coach_interpretation"),
  possibleFocusAreas: text("possible_focus_areas"),
  currentSignal: text("current_signal").notNull().default("Unclear"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type PersonalClarityMap = typeof personalClarityMaps.$inferSelect;
export type PersonalClarityMapDimension = typeof personalClarityMapDimensions.$inferSelect;
export type InsertPersonalClarityMap = typeof personalClarityMaps.$inferInsert;
export type InsertPersonalClarityMapDimension = typeof personalClarityMapDimensions.$inferInsert;

export const sessionNoteFormSchema = z.object({
  sessionDate: z.string().min(1, "Session date is required"),
  sessionTitle: z.string().min(1, "Session title is required"),
  noteSource: z.enum(noteSourceOptions).default("Live Notes"),
  sessionFormat: z.enum(sessionFormatOptions).default("Zoom"),
  durationMinutes: z.number().optional(),
  whatChangedSinceLastSession: z.string().optional(),
  keyThemesDiscussed: z.string().optional(),
  insightsAndBreakthroughs: z.string().optional(),
  decisionsMade: z.string().optional(),
  commitmentsBeforeNextSession: z.string().optional(),
  nextSessionFocus: z.string().optional(),
  coachObservations: z.string().optional(),
  privateNotes: z.string().optional(),
  plaudTranscriptText: z.string().optional(),
  plaudAiSummaryText: z.string().optional(),
  attachmentName: z.string().optional(),
  attachmentUrl: z.string().optional(),
  isDraft: z.string().optional(),
});
export const sessionNoteDraftSchema = sessionNoteFormSchema.extend({
  sessionDate: z.string().optional(),
  sessionTitle: z.string().optional(),
});
export type SessionNoteFormData = z.infer<typeof sessionNoteFormSchema>;

// ── 360 Feedback ─────────────────────────────────────────────────────────────

export const cycleStatusOptions = ["draft", "active", "closed"] as const;
export const respondentRelationshipOptions = ["Manager", "Peer", "Direct Report", "Other", "Self"] as const;
export const respondentStatusOptions = ["pending", "consented", "completed", "declined"] as const;
export const summaryStatusOptions = ["draft", "approved"] as const;

export const QUESTIONNAIRE_DIMENSIONS = {
  Clarity: ["q1", "q2", "q3"],
  Energy: ["q4", "q5", "q6"],
  Trust: ["q7", "q8", "q9"],
  Results: ["q10", "q11", "q12"],
} as const;

export const QUESTIONNAIRE_QUESTIONS = [
  "This leader creates clarity in ambiguous situations.",
  "This leader communicates expectations clearly.",
  "This leader makes decisions in a timely and effective way.",
  "This leader brings steady, constructive energy to the team.",
  "This leader remains composed under pressure.",
  "This leader positively influences the tone and momentum of others.",
  "This leader listens to understand, not just to respond.",
  "This leader creates an environment where people feel safe to speak honestly.",
  "This leader treats people with respect, especially during disagreement or pressure.",
  "This leader holds themselves and others accountable for outcomes.",
  "This leader follows through on commitments.",
  "This leader balances performance expectations with sustainable team leadership.",
] as const;

export const QUESTIONNAIRE_QUESTIONS_SELF = [
  "I create clarity in ambiguous situations.",
  "I communicate expectations clearly.",
  "I make decisions in a timely and effective way.",
  "I bring steady, constructive energy to the team.",
  "I remain composed under pressure.",
  "I positively influence the tone and momentum of others.",
  "I listen to understand, not just to respond.",
  "I create an environment where people feel safe to speak honestly.",
  "I treat people with respect, especially during disagreement or pressure.",
  "I hold myself and others accountable for outcomes.",
  "I follow through on commitments.",
  "I balance performance expectations with sustainable team leadership.",
] as const;

export const OPEN_TEXT_QUESTIONS = [
  "What should this leader continue doing because it has a positive impact?",
  "What should this leader do differently to become more effective?",
  "Where does this leader create the greatest positive impact?",
  "If this leader improved one thing, what would make the biggest difference?",
] as const;

export const OPEN_TEXT_QUESTIONS_SELF = [
  "What am I doing that has a positive impact and should continue?",
  "What could I do differently to become more effective?",
  "Where do I create the greatest positive impact?",
  "If I improved one thing, what would make the biggest difference?",
] as const;

export const RATING_LABELS: Record<number, string> = {
  1: "Rarely demonstrates",
  2: "Inconsistently demonstrates",
  3: "Usually demonstrates",
  4: "Consistently demonstrates",
  5: "Strongly demonstrates",
};

export const RESPONDENT_THRESHOLD = 3;

export const feedbackCycles = pgTable("feedback_cycles", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  coachingClientId: text("coaching_client_id").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
  onboardingStatus: text("onboarding_status").notNull().default("not_sent"),
  participantToken: text("participant_token"),
  participantTokenExpiresAt: timestamp("participant_token_expires_at"),
  participantSentAt: timestamp("participant_sent_at"),
  participantAgreedAt: timestamp("participant_agreed_at"),
  onboardingEmailSubject: text("onboarding_email_subject"),
  onboardingEmailBody: text("onboarding_email_body"),
  nominationToken: text("nomination_token"),
  nominationTokenExpiresAt: timestamp("nomination_token_expires_at"),
  nominationEmailSentAt: timestamp("nomination_email_sent_at"),
});

export const emailTemplates360 = pgTable("email_templates_360", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  type: text("type").notNull().unique(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type EmailTemplate360 = typeof emailTemplates360.$inferSelect;
export type InsertEmailTemplate360 = typeof emailTemplates360.$inferInsert;

export const feedbackRespondents = pgTable("feedback_respondents", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  cycleId: text("cycle_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  relationship: text("relationship").notNull(),
  token: text("token").notNull().unique(),
  tokenExpiresAt: timestamp("token_expires_at").notNull(),
  status: text("status").notNull().default("pending"),
  isSelf: boolean("is_self").notNull().default(false),
  invitedAt: timestamp("invited_at"),
  consentedAt: timestamp("consented_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedbackResponses = pgTable("feedback_responses", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  respondentId: text("respondent_id").notNull().unique(),
  ratings: jsonb("ratings").notNull(),
  openText: jsonb("open_text").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const feedbackSummaries = pgTable("feedback_summaries", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  cycleId: text("cycle_id").notNull().unique(),
  status: text("status").notNull().default("draft"),
  topStrengths: text("top_strengths"),
  developmentAreas: text("development_areas"),
  selfVsOthersGap: text("self_vs_others_gap"),
  leadershipPattern: text("leadership_pattern"),
  topPriorities: text("top_priorities"),
  ninetyDayFocus: text("ninety_day_focus"),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type FeedbackCycle = typeof feedbackCycles.$inferSelect;
export type InsertFeedbackCycle = typeof feedbackCycles.$inferInsert;
export type FeedbackRespondent = typeof feedbackRespondents.$inferSelect;
export type InsertFeedbackRespondent = typeof feedbackRespondents.$inferInsert;
export type FeedbackResponse = typeof feedbackResponses.$inferSelect;
export type InsertFeedbackResponse = typeof feedbackResponses.$inferInsert;
export type FeedbackSummary = typeof feedbackSummaries.$inferSelect;
export type InsertFeedbackSummary = typeof feedbackSummaries.$inferInsert;

export const participantNominations = pgTable("participant_nominations", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  cycleId: text("cycle_id").notNull(),
  nomineeName: text("nominee_name").notNull(),
  nomineeEmail: text("nominee_email").notNull(),
  nomineeRole: text("nominee_role").notNull().default(""),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});
export const insertParticipantNominationSchema = createInsertSchema(participantNominations).omit({ id: true, submittedAt: true });
export type ParticipantNomination = typeof participantNominations.$inferSelect;
export type InsertParticipantNomination = typeof participantNominations.$inferInsert;
