"use client";

import { useState } from "react";
import Link from "next/link";
import { useSuspenseQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Send, Bell, Trash2, Sparkles, Check, Square } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { respondentRelationshipOptions } from "@/db/schema";
import { summaryDraftSchema, SUMMARY_FIELDS } from "@/lib/ai-schemas";
import { AdminCard } from "@/components/admin/ui";
import { AdminError, AdminEmpty, SectionBoundary } from "@/components/admin/data-states";
import { ShareLinkRow } from "@/components/admin/share-link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CycleDetailView({ cycleId }: { cycleId: string }) {
  return (
    <>
      <Link href="/admin/cycles" className="mb-4 inline-flex items-center gap-2 text-sm text-brand-ink/60 hover:text-brand-ink">
        <ArrowLeft className="size-4" /> Back to cycles
      </Link>

      <div className="flex flex-col gap-8">
        <SectionBoundary fallback={<CycleMainSkeleton />} errorTitle="Couldn't load this cycle">
          <CycleMain cycleId={cycleId} />
        </SectionBoundary>

        <SectionBoundary fallback={<SectionSkeleton rows={2} />} errorTitle="Couldn't load nominations">
          <Nominations cycleId={cycleId} />
        </SectionBoundary>

        <SectionBoundary fallback={<ResultsSkeleton />} errorTitle="Couldn't load results">
          <ResultsSummary cycleId={cycleId} />
        </SectionBoundary>
      </div>
    </>
  );
}

// ── Header + onboarding + respondents (cycles.byId) ──────────────────────────
function CycleMain({ cycleId }: { cycleId: string }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: c } = useSuspenseQuery(trpc.cycles.byId.queryOptions({ id: cycleId }));
  const template = useQuery(trpc.cycles.getOnboardingTemplate.queryOptions());
  const invalidate = () => qc.invalidateQueries({ queryKey: trpc.cycles.byId.queryKey({ id: cycleId }) });

  const update = useMutation(trpc.cycles.update.mutationOptions({ onSuccess: () => { toast.success("Updated"); invalidate(); }, onError: (e) => toast.error(e.message) }));
  const sendOnboarding = useMutation(trpc.cycles.sendOnboarding.mutationOptions({
    onSuccess: (r) => {
      if (!r.emailConfigured) toast.warning("No email service (Resend) configured — copy the onboarding link below to share manually.");
      else if (!r.emailSent) toast.error("Onboarding email failed — copy the link below to share manually.");
      else toast.success("Onboarding emailed to participant");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  }));

  if (!c) return <AdminError compact title="Cycle not found" hint="This cycle may have been deleted." />;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold text-brand-ink">{c.title}</h1>
          <p className="text-sm text-brand-ink/60">{c.clientName} · {c.clientEmail}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-0 bg-brand-blue/10 capitalize text-brand-navy">{c.status}</Badge>
          {c.status === "draft" && <Button size="sm" onClick={() => update.mutate({ id: cycleId, status: "active" })}>Activate</Button>}
          {c.status === "active" && <Button size="sm" variant="outline" onClick={() => update.mutate({ id: cycleId, status: "closed" })}>Close cycle</Button>}
        </div>
      </div>

      {/* Onboarding */}
      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold text-brand-ink">Participant onboarding</h2>
        <AdminCard className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-brand-ink/70">Status: <span className="font-medium capitalize">{c.onboardingStatus.replace(/_/g, " ")}</span></p>
            <Button
              size="sm"
              disabled={sendOnboarding.isPending || c.onboardingStatus === "agreed" || !template.data}
              onClick={() => template.data && sendOnboarding.mutate({ id: cycleId, subject: template.data.subject, body: template.data.body, ccAdmin: true })}
            >
              <Send className="size-4" /> Send onboarding
            </Button>
          </div>
          {c.onboardingUrl && <ShareLinkRow label="Onboarding link" url={c.onboardingUrl} status="share with participant" />}
          {c.nominationUrl && <ShareLinkRow label="Nomination link" url={c.nominationUrl} />}
        </AdminCard>
      </section>

      {/* Respondents */}
      <Respondents cycleId={cycleId} respondents={c.respondents} onboardingStatus={c.onboardingStatus} />
    </div>
  );
}

function CycleMainSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 animate-pulse rounded-xl bg-brand-ink/10" />
          <div className="h-4 w-48 animate-pulse rounded-full bg-brand-ink/[0.07]" />
        </div>
        <div className="h-6 w-16 animate-pulse rounded-full bg-brand-ink/10" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-5 w-44 animate-pulse rounded-lg bg-brand-ink/10" />
        <div className="h-28 animate-pulse rounded-3xl bg-brand-ink/[0.06]" />
      </div>
      <SectionSkeleton rows={3} />
    </div>
  );
}

type Resp = { id: string; fullName: string; email: string; relationship: string; status: string; isSelf: boolean; surveyUrl: string };

function Respondents({ cycleId, respondents, onboardingStatus }: { cycleId: string; respondents: Resp[]; onboardingStatus: string }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: trpc.cycles.byId.queryKey({ id: cycleId }) });

  const invite = useMutation(trpc.cycles.inviteRespondent.mutationOptions({
    onSuccess: (r) => {
      if (!r.emailConfigured) toast.warning("No email service (Resend) configured — copy the survey link below to share manually.");
      else if (!r.emailSent) toast.error("Email failed to send — the survey link is still available to copy.");
      else toast.success("Invite emailed");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  }));
  const remind = useMutation(trpc.cycles.remindRespondent.mutationOptions({
    onSuccess: (r) => {
      if (!r.emailConfigured) toast.warning("No email service (Resend) configured — reminder not sent.");
      else if (!r.emailSent) toast.error("Reminder failed to send.");
      else toast.success("Reminder emailed");
    },
    onError: (e) => toast.error(e.message),
  }));
  const del = useMutation(trpc.cycles.deleteRespondent.mutationOptions({ onSuccess: () => { toast.success("Removed"); invalidate(); }, onError: (e) => toast.error(e.message) }));

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-brand-ink">Respondents</h2>
        <AddRespondentDialog cycleId={cycleId} onDone={invalidate} />
      </div>
      <div className="flex flex-col gap-2">
        {respondents.map((r) => (
          <AdminCard key={r.id} className="flex flex-col gap-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="font-medium text-brand-ink">{r.fullName} {r.isSelf && <Badge className="ml-1 border-0 bg-brand-navy/10 text-brand-navy">Self</Badge>}</span>
                <span className="text-sm text-brand-ink/60">{r.email} · {r.relationship}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="border-0 bg-brand-ink/5 capitalize text-brand-ink/60">{r.status}</Badge>
                <Button variant="outline" size="sm" disabled={invite.isPending || onboardingStatus === "sent"} onClick={() => invite.mutate({ id: r.id })}><Send className="size-3.5" /> Invite</Button>
                <Button variant="outline" size="sm" disabled={remind.isPending || r.status === "completed"} onClick={() => remind.mutate({ id: r.id })}><Bell className="size-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => del.mutate({ id: r.id })}><Trash2 className="size-4 text-red-500" /></Button>
              </div>
            </div>
            <ShareLinkRow label="Survey link" url={r.surveyUrl} meta={r.surveyUrl} />
          </AdminCard>
        ))}
        {respondents.length === 0 && (
          <AdminCard><AdminEmpty icon={Send} title="No respondents yet" hint="Add respondents, then share their survey links." /></AdminCard>
        )}
      </div>
    </section>
  );
}

function AddRespondentDialog({ cycleId, onDone }: { cycleId: string; onDone: () => void }) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<{ fullName: string; email: string; relationship: (typeof respondentRelationshipOptions)[number]; isSelf: boolean }>({ fullName: "", email: "", relationship: respondentRelationshipOptions[0], isSelf: false });
  const add = useMutation(trpc.cycles.addRespondent.mutationOptions({ onSuccess: () => { toast.success("Added"); setOpen(false); setF({ fullName: "", email: "", relationship: respondentRelationshipOptions[0], isSelf: false }); onDone(); }, onError: (e) => toast.error(e.message) }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center gap-1.5 rounded-xl gradient-brand px-4 text-sm font-medium text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop"><Plus className="size-4" /> Add respondent</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-heading text-xl">Add respondent</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="flex flex-col gap-1.5"><Label className="text-xs uppercase text-brand-ink/60">Name</Label><Input value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} /></div>
          <div className="flex flex-col gap-1.5"><Label className="text-xs uppercase text-brand-ink/60">Email</Label><Input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs uppercase text-brand-ink/60">Relationship</Label>
            <Select value={f.relationship} onValueChange={(v) => setF({ ...f, relationship: (v ?? respondentRelationshipOptions[0]) as (typeof respondentRelationshipOptions)[number], isSelf: v === "Self" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{respondentRelationshipOptions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={add.isPending} onClick={() => { if (!f.fullName || !f.email) return toast.error("Name and email required"); add.mutate({ cycleId, fullName: f.fullName, email: f.email, relationship: f.relationship, isSelf: f.isSelf }); }}>
            {add.isPending ? "Adding…" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Nominations (cycles.listNominations) ─────────────────────────────────────
function Nominations({ cycleId }: { cycleId: string }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: noms } = useSuspenseQuery(trpc.cycles.listNominations.queryOptions({ id: cycleId }));
  const promote = useMutation(trpc.cycles.promoteNomination.mutationOptions({
    onSuccess: () => {
      toast.success("Promoted to respondent");
      qc.invalidateQueries({ queryKey: trpc.cycles.byId.queryKey({ id: cycleId }) });
      qc.invalidateQueries({ queryKey: trpc.cycles.listNominations.queryKey() });
    },
    onError: (e) => toast.error(e.message),
  }));

  if (noms.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-lg font-semibold text-brand-ink">Nominations</h2>
      <div className="flex flex-col gap-2">
        {noms.map((n) => (
          <AdminCard key={n.id} className="flex items-center justify-between p-4">
            <div className="flex flex-col"><span className="font-medium text-brand-ink">{n.nomineeName}</span><span className="text-sm text-brand-ink/60">{n.nomineeEmail} · {n.nomineeRole || "—"}</span></div>
            <Button size="sm" variant="outline" disabled={promote.isPending} onClick={() => promote.mutate({ cycleId, nominationId: n.id, relationship: "Peer" })}>Promote</Button>
          </AdminCard>
        ))}
      </div>
    </section>
  );
}

// ── Results & AI summary (cycles.results + getSummary, live-streamed) ─────────
function ResultsSummary({ cycleId }: { cycleId: string }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: results } = useSuspenseQuery(trpc.cycles.results.queryOptions({ id: cycleId }));
  const { data: s } = useSuspenseQuery(trpc.cycles.getSummary.queryOptions({ id: cycleId }));

  // Live object stream — fields fill in token-by-token as the model writes.
  const { object, submit, isLoading, stop } = useObject({
    api: `/api/admin/cycles/${cycleId}/summary-stream`,
    schema: summaryDraftSchema,
    onError: (e) => toast.error(e.message || "Couldn't generate the summary."),
    onFinish: ({ error }) => {
      if (error) return;
      toast.success("AI summary drafted — review it below.");
      qc.invalidateQueries({ queryKey: trpc.cycles.getSummary.queryKey() });
    },
  });

  const approve = useMutation(trpc.cycles.approveSummary.mutationOptions({ onSuccess: () => { toast.success("Approved"); qc.invalidateQueries({ queryKey: trpc.cycles.getSummary.queryKey() }); }, onError: (e) => toast.error(e.message) }));

  const dims = results?.dimensions;
  const approved = s?.status === "approved";
  const [confirmRegen, setConfirmRegen] = useState(false);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-brand-ink">Results &amp; AI summary</h2>
        <div className="flex gap-2">
          {isLoading ? (
            <Button size="sm" variant="outline" onClick={() => stop()}><Square className="size-3.5" /> Stop</Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                if (approved) setConfirmRegen(true);
                else submit({});
              }}
            >
              <Sparkles className="size-4" /> {s ? "Regenerate" : "Generate summary"}
            </Button>
          )}
          {s && !approved && !isLoading && <Button size="sm" variant="outline" disabled={approve.isPending} onClick={() => approve.mutate({ id: cycleId })}><Check className="size-4" /> Approve</Button>}
        </div>
      </div>

      {dims && (
        <AdminCard className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
          {Object.entries(dims).map(([dim, d]) => (
            <div key={dim} className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-brand-ink/50">{dim}</span>
              <span className="font-heading text-2xl font-semibold text-brand-ink">{d.othersAvg ?? "—"}</span>
              <span className="text-xs text-brand-ink/50">self {d.selfAvg ?? "—"} · gap {d.gap ?? "—"}</span>
            </div>
          ))}
        </AdminCard>
      )}

      {isLoading ? (
        <AdminCard className="flex flex-col gap-4 p-6">
          <span className="flex w-fit items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue">
            <Sparkles className="size-3.5 animate-pulse" /> Drafting with AI…
          </span>
          {SUMMARY_FIELDS.map((f) => (
            <SummaryField key={f.key} label={f.label} value={object?.[f.key]} streaming />
          ))}
        </AdminCard>
      ) : s ? (
        <AdminCard className="flex flex-col gap-4 p-6">
          {approved
            ? <Badge className="w-fit border-0 bg-emerald-100 text-emerald-700">Approved</Badge>
            : <Badge className="w-fit border-0 bg-amber-100 text-amber-700">Draft — review &amp; approve</Badge>}
          {SUMMARY_FIELDS.map((f) => <SummaryField key={f.key} label={f.label} value={s[f.key]} />)}
        </AdminCard>
      ) : (
        <AdminCard><AdminEmpty icon={Sparkles} title="No summary yet" hint="Generate an AI summary once enough responses are in." /></AdminCard>
      )}

      <ConfirmDialog
        open={confirmRegen}
        onOpenChange={setConfirmRegen}
        title="Regenerate approved summary?"
        description="This regenerates the summary and resets it to a draft for re-approval. The current approved version will be overwritten."
        confirmLabel="Regenerate"
        onConfirm={() => submit({})}
      />
    </section>
  );
}

function SummaryField({ label, value, streaming }: { label: string; value?: string | null; streaming?: boolean }) {
  if (!value && !streaming) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-navy">{label}</span>
      {value ? (
        <p className="whitespace-pre-line text-sm leading-6 text-brand-ink/80">
          {value}
          {streaming && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-brand-blue align-text-bottom" />}
        </p>
      ) : (
        // field not yet streamed in — shimmer placeholder
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-full animate-pulse rounded-full bg-brand-ink/[0.06]" />
          <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-brand-ink/[0.06]" />
        </div>
      )}
    </div>
  );
}

// ── Skeletons ────────────────────────────────────────────────────────────────
function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="h-5 w-40 animate-pulse rounded-lg bg-brand-ink/10" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-3xl bg-brand-ink/[0.06]" />
        ))}
      </div>
    </section>
  );
}

function ResultsSkeleton() {
  return (
    <section className="flex flex-col gap-3">
      <div className="h-5 w-52 animate-pulse rounded-lg bg-brand-ink/10" />
      <div className="grid grid-cols-2 gap-4 rounded-3xl border border-brand-ink/[0.07] bg-white p-5 shadow-card sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-14 animate-pulse rounded-full bg-brand-ink/[0.07]" />
            <div className="h-7 w-10 animate-pulse rounded-lg bg-brand-ink/10" />
            <div className="h-3 w-20 animate-pulse rounded-full bg-brand-ink/[0.07]" />
          </div>
        ))}
      </div>
    </section>
  );
}
