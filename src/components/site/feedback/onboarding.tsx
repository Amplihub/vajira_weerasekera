"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Compass, Clock, ShieldX, CheckCircle2, ShieldCheck, ArrowRight, Users } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { TokenShell, TokenCard, TokenState, TokenHeader, TokenIcon } from "@/components/site/token-shell";
import { Button } from "@/components/ui/button";

type AgreeResult = { emailSent: boolean; selfEmailSent?: boolean; emailConfigured: boolean; nominationUrl: string | null };

export function FeedbackOnboarding({ token }: { token: string }) {
  const trpc = useTRPC();
  const validate = useQuery(trpc.feedback.onboardingValidate.queryOptions({ token }));
  const agree = useMutation(trpc.feedback.onboardingAgree.mutationOptions());
  const [agreed, setAgreed] = useState(false);
  const [result, setResult] = useState<AgreeResult | null>(null);

  if (validate.isLoading)
    return (
      <TokenShell center>
        <TokenState icon={Compass} title="Loading…">
          Fetching your invitation.
        </TokenState>
      </TokenShell>
    );

  if (validate.isError) {
    const expired = validate.error.message === "expired";
    return (
      <TokenShell center>
        <TokenState
          icon={expired ? Clock : ShieldX}
          tone={expired ? "warning" : "error"}
          title={expired ? "This link has expired" : "This link is not valid"}
        >
          Please contact Vajira Weerasekera for a new link.
        </TokenState>
      </TokenShell>
    );
  }

  const data = validate.data!;

  if (agreed || data.status === "already_agreed") {
    const url = result?.nominationUrl;
    return (
      <TokenShell center>
        <TokenCard className="flex flex-col items-center gap-5 text-center">
          <TokenIcon icon={CheckCircle2} tone="success" />
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-[-0.4px] text-brand-ink">You&apos;re confirmed.</h1>
            <p className="max-w-md text-sm leading-7 text-brand-ink/70">
              Thank you. {result?.selfEmailSent ? "We've emailed you your own self-assessment to complete, and the " : "The "}
              next step is nominating the colleagues you&apos;d like feedback from — a balanced mix of
              managers, peers, and direct reports.
            </p>
          </div>
          {url && (
            <Button nativeButton={false} render={<Link href={url} />}>
              <Users className="size-4" /> Nominate your respondents <ArrowRight className="size-4" />
            </Button>
          )}
          {result && (
            <p className="text-xs text-brand-ink/50">
              {result.emailSent
                ? "We've also emailed you this nomination link for later."
                : !result.emailConfigured
                  ? "Use the button above to continue now."
                  : null}
            </p>
          )}
        </TokenCard>
      </TokenShell>
    );
  }

  return (
    <TokenShell center>
      <TokenCard className="flex flex-col gap-6">
        <TokenHeader icon={Compass} eyebrow="360 Leadership Insight" title={`Welcome, ${data.participantName}`} />
        {data.emailBody ? (
          <div className="whitespace-pre-wrap text-sm leading-7 text-brand-ink/70">{data.emailBody}</div>
        ) : (
          <p className="text-sm leading-7 text-brand-ink/70">
            This is a confidential leadership development process. By confirming, you agree to take part and to
            thoughtfully nominate a balanced group of respondents.
          </p>
        )}
        <div className="flex items-start gap-2.5 rounded-2xl bg-brand-blue/[0.06] p-3.5 text-xs leading-6 text-brand-ink/65">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-blue" />
          Your individual responses stay confidential. Only aggregated themes are shared.
        </div>
        <Button
          className="w-fit"
          disabled={agree.isPending}
          onClick={() => agree.mutate({ token }, { onSuccess: (d) => { setResult(d as AgreeResult); setAgreed(true); } })}
        >
          <CheckCircle2 className="size-4" />
          {agree.isPending ? "Confirming…" : "Confirm my participation"}
        </Button>
      </TokenCard>
    </TokenShell>
  );
}
