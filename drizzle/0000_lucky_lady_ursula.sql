CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_email" text,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"status" text DEFAULT 'success' NOT NULL,
	"error_message" text,
	"ip_address" text,
	"duration_ms" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coaching_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"organization" text,
	"location" text,
	"program" text NOT NULL,
	"navigating" text NOT NULL,
	"outcomes" text NOT NULL,
	"why_now" text NOT NULL,
	"funding" text NOT NULL,
	"anything_else" text,
	"accepted_terms" boolean DEFAULT false NOT NULL,
	"consent_recording_ai" boolean DEFAULT false NOT NULL,
	"accepted_terms_at" timestamp,
	"consent_recording_ai_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coaching_clients" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text NOT NULL,
	"coaching_type" text NOT NULL,
	"status" text DEFAULT 'Prospect' NOT NULL,
	"start_date" timestamp,
	"next_session_date" timestamp,
	"primary_goals" text,
	"background_summary" text,
	"source_application_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"role_title" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contacts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"to" text NOT NULL,
	"subject" text NOT NULL,
	"trigger" text NOT NULL,
	"preview" text,
	"success" boolean DEFAULT true NOT NULL,
	"error" text,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"html_body" text,
	"text_body" text
);
--> statement-breakpoint
CREATE TABLE "email_templates_360" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_templates_360_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "feedback_cycles" (
	"id" text PRIMARY KEY NOT NULL,
	"coaching_client_id" text NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"closed_at" timestamp,
	"onboarding_status" text DEFAULT 'not_sent' NOT NULL,
	"participant_token" text,
	"participant_token_expires_at" timestamp,
	"participant_sent_at" timestamp,
	"participant_agreed_at" timestamp,
	"onboarding_email_subject" text,
	"onboarding_email_body" text,
	"nomination_token" text,
	"nomination_token_expires_at" timestamp,
	"nomination_email_sent_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "feedback_respondents" (
	"id" text PRIMARY KEY NOT NULL,
	"cycle_id" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"relationship" text NOT NULL,
	"token" text NOT NULL,
	"token_expires_at" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"is_self" boolean DEFAULT false NOT NULL,
	"invited_at" timestamp,
	"consented_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feedback_respondents_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "feedback_responses" (
	"id" text PRIMARY KEY NOT NULL,
	"respondent_id" text NOT NULL,
	"ratings" jsonb NOT NULL,
	"open_text" jsonb NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feedback_responses_respondent_id_unique" UNIQUE("respondent_id")
);
--> statement-breakpoint
CREATE TABLE "feedback_summaries" (
	"id" text PRIMARY KEY NOT NULL,
	"cycle_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"top_strengths" text,
	"development_areas" text,
	"self_vs_others_gap" text,
	"leadership_pattern" text,
	"top_priorities" text,
	"ninety_day_focus" text,
	"approved_at" timestamp,
	"approved_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feedback_summaries_cycle_id_unique" UNIQUE("cycle_id")
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"ghl_submission_id" text NOT NULL,
	"form_type" text DEFAULT 'other' NOT NULL,
	"full_name" text,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"role" text,
	"message" text,
	"raw_payload" jsonb NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"converted_client_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "form_submissions_ghl_submission_id_unique" UNIQUE("ghl_submission_id")
);
--> statement-breakpoint
CREATE TABLE "insights" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"featured_image_url" text,
	"featured_image_alt" text,
	"body" text NOT NULL,
	"author" text DEFAULT 'Vajira Weerasekera' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"category" text,
	"read_time" text,
	"published_at" timestamp,
	"seo_title" text,
	"seo_description" text,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "insights_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "participant_nominations" (
	"id" text PRIMARY KEY NOT NULL,
	"cycle_id" text NOT NULL,
	"nominee_name" text NOT NULL,
	"nominee_email" text NOT NULL,
	"nominee_role" text DEFAULT '' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_clarity_map_dimensions" (
	"id" text PRIMARY KEY NOT NULL,
	"map_id" text NOT NULL,
	"dimension" text NOT NULL,
	"client_reflections" text,
	"key_themes" text,
	"coach_interpretation" text,
	"possible_focus_areas" text,
	"current_signal" text DEFAULT 'Unclear' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_clarity_maps" (
	"id" text PRIMARY KEY NOT NULL,
	"session_note_id" text NOT NULL,
	"client_id" text NOT NULL,
	"overall_summary" text,
	"top_themes" text,
	"suggested_next_focus" text,
	"status" text DEFAULT 'ai_draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"coaching_client_id" text NOT NULL,
	"session_date" timestamp NOT NULL,
	"session_title" text NOT NULL,
	"session_number" integer,
	"note_source" text DEFAULT 'Live Notes' NOT NULL,
	"session_format" text DEFAULT 'Zoom' NOT NULL,
	"duration_minutes" integer,
	"what_changed_since_last_session" text,
	"key_themes_discussed" text,
	"insights_and_breakthroughs" text,
	"decisions_made" text,
	"commitments_before_next_session" text,
	"next_session_focus" text,
	"coach_observations" text,
	"private_notes" text,
	"plaud_transcript_text" text,
	"plaud_ai_summary_text" text,
	"attachment_name" text,
	"attachment_url" text,
	"is_draft" text DEFAULT 'false' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploaded_images" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"storage_path" text NOT NULL,
	"public_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;