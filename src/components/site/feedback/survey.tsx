"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, ClipboardList, Clock, ShieldX, CheckCircle2, MessageSquareText, type LucideIcon } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { TokenShell, TokenCard, TokenState, TokenHeader } from "@/components/site/token-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  QUESTIONNAIRE_QUESTIONS,
  QUESTIONNAIRE_QUESTIONS_SELF,
  QUESTIONNAIRE_DIMENSIONS,
  OPEN_TEXT_QUESTIONS,
  OPEN_TEXT_QUESTIONS_SELF,
  RATING_LABELS,
} from "@/db/schema";

const QKEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12"] as const;

function Message({
  title,
  body,
  icon = ClipboardList,
  tone = "brand",
}: {
  title: string;
  body: string;
  icon?: LucideIcon;
  tone?: "brand" | "success" | "warning" | "error";
}) {
  return (
    <TokenShell center>
      <TokenState icon={icon} tone={tone} title={title}>
        {body}
      </TokenState>
    </TokenShell>
  );
}

export function FeedbackSurvey({ token }: { token: string }) {
  const trpc = useTRPC();
  const validate = useQuery(trpc.feedback.validate.queryOptions({ token }));
  const consent = useMutation(trpc.feedback.consent.mutationOptions());
  const submit = useMutation(trpc.feedback.submit.mutationOptions());

  const [started, setStarted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [openText, setOpenText] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (validate.isLoading) return <Message title="Loading…" body="Checking your invitation." />;
  if (validate.isError) {
    const msg = validate.error.message;
    const map: Record<string, [string, string, LucideIcon, "brand" | "success" | "warning" | "error"]> = {
      invalid: ["This link is not valid", "The link may be incorrect or has been removed.", ShieldX, "error"],
      expired: ["This link has expired", "Please contact Vajira Weerasekera for a new link.", Clock, "warning"],
      closed: ["This feedback cycle is closed", "Thank you for your interest.", Clock, "warning"],
      completed: ["You've already completed this", "Your feedback has been recorded. Thank you.", CheckCircle2, "success"],
      declined: ["This invitation was declined", "No further action is needed.", ShieldX, "error"],
    };
    const [t, b, icon, tone] = map[msg] ?? ["Something went wrong", "Please try again later.", ShieldX, "error" as const];
    return <Message title={t} body={b} icon={icon} tone={tone} />;
  }

  const v = validate.data!;
  const questions = v.isSelf ? QUESTIONNAIRE_QUESTIONS_SELF : QUESTIONNAIRE_QUESTIONS;
  const openQuestions = v.isSelf ? OPEN_TEXT_QUESTIONS_SELF : OPEN_TEXT_QUESTIONS;

  const openKeys = openQuestions.map((_, i) => `q${i + 1}`);
  const ratedCount = QKEYS.filter((k) => typeof ratings[k] === "number").length;
  const filledTextCount = openKeys.filter((k) => (openText[k] ?? "").trim().length > 0).length;
  const allRated = ratedCount === QKEYS.length;
  const allTextFilled = filledTextCount === openKeys.length;
  const allComplete = allRated && allTextFilled;
  const totalSteps = QKEYS.length + openKeys.length;
  const doneSteps = ratedCount + filledTextCount;

  if (done) {
    return <Message title="Thank you." tone="success" icon={CheckCircle2} body="Your feedback has been submitted. It will be reviewed in aggregate to support leadership development." />;
  }

  // Intro / consent
  if (!started) {
    return (
      <TokenShell center>
        <TokenCard className="flex flex-col gap-6">
          <TokenHeader icon={ClipboardList} eyebrow="360 Leadership Insight" title={v.cycleTitle} />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-brand-ink/70">
              {v.isSelf
                ? "This is your self-assessment as part of your 360 Leadership Feedback process."
                : `${v.clientName} has asked for your input as part of a confidential leadership development process.`}
            </p>
          </div>
          <p className="text-sm leading-6 text-brand-ink/70">
            12 rating questions and 4 short written responses, about 10 minutes. Your responses are confidential and
            reviewed in aggregate.
          </p>
          <Button
            className="w-fit"
            disabled={consent.isPending}
            onClick={() => consent.mutate({ token }, { onSuccess: () => setStarted(true), onError: () => setStarted(true) })}
          >
            {consent.isPending ? "Starting…" : v.isSelf ? "Begin self-assessment" : "Begin feedback"}
          </Button>
        </TokenCard>
      </TokenShell>
    );
  }

  // Survey
  return (
    <TokenShell>
      <div className="flex flex-col gap-6">
        {Object.entries(QUESTIONNAIRE_DIMENSIONS).map(([dim, keys]) => (
          <TokenCard key={dim} className="flex flex-col gap-6">
            <h2 className="font-heading text-xl font-semibold text-brand-navy">{dim}</h2>
            {keys.map((k) => {
              const idx = QKEYS.indexOf(k as (typeof QKEYS)[number]);
              return (
                <div key={k} className="flex flex-col gap-3">
                  <p className="text-sm text-brand-ink">{questions[idx]}</p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRatings((r) => ({ ...r, [k]: n }))}
                        className={cn(
                          "flex flex-1 flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors",
                          ratings[k] === n
                            ? "border-brand-navy bg-brand-navy text-white"
                            : "border-brand-ink/15 bg-white text-brand-ink/70 hover:border-brand-navy/40",
                        )}
                      >
                        <span className="text-base font-semibold">{n}</span>
                        <span className="text-[11px] leading-tight">{RATING_LABELS[n]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </TokenCard>
        ))}

        <TokenCard className="flex flex-col gap-6">
          <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-brand-navy">
            <MessageSquareText className="size-5 text-brand-blue" /> In your own words
          </h2>
          {openQuestions.map((q, i) => {
            const key = `q${i + 1}`;
            const empty = (openText[key] ?? "").trim().length === 0;
            return (
              <div key={i} className="flex flex-col gap-2">
                <label className="text-sm text-brand-ink">
                  {q} <span className="text-brand-blue">*</span>
                </label>
                <Textarea
                  value={openText[key] ?? ""}
                  onChange={(e) => setOpenText((o) => ({ ...o, [key]: e.target.value }))}
                  rows={3}
                  aria-required
                  className={cn(empty && "border-brand-ink/15", !empty && "border-brand-navy/40")}
                />
              </div>
            );
          })}
        </TokenCard>

        <div className="sticky bottom-4 flex flex-col gap-3 rounded-3xl border border-brand-ink/[0.07] bg-white/80 p-4 shadow-pop backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-sm font-medium text-brand-ink/70">
              {doneSteps} / {totalSteps} complete
              <span className="ml-2 font-normal text-brand-ink/45">
                {ratedCount}/{QKEYS.length} rated · {filledTextCount}/{openKeys.length} written
              </span>
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-ink/10">
              <div
                className="h-full rounded-full bg-brand-blue transition-all"
                style={{ width: `${(doneSteps / totalSteps) * 100}%` }}
              />
            </div>
            {!allComplete && (
              <p className="text-xs text-brand-ink/50">
                {!allRated ? "Answer all rating questions" : "Answer all written questions"} to submit.
              </p>
            )}
          </div>
          <Button
            disabled={!allComplete || submit.isPending}
            onClick={() =>
              submit.mutate(
                { token, ratings, openText },
                { onSuccess: () => setDone(true) },
              )
            }
          >
            <Check className="size-4" /> {submit.isPending ? "Submitting…" : "Submit feedback"}
          </Button>
        </div>
      </div>
    </TokenShell>
  );
}
