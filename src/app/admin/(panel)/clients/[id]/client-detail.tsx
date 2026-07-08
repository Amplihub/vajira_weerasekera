"use client";

import { useState } from "react";
import Link from "next/link";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Sparkles, Eye } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { sessionFormatOptions, noteSourceOptions } from "@/db/schema";
import type { SessionNote } from "@/db/schema";
import { AdminCard } from "@/components/admin/ui";
import { AdminError, AdminEmpty, SectionBoundary } from "@/components/admin/data-states";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ClientDetailView({ clientId }: { clientId: string }) {
  return (
    <>
      <Link href="/admin/clients" className="mb-4 inline-flex items-center gap-2 text-sm text-brand-ink/60 hover:text-brand-ink">
        <ArrowLeft className="size-4" /> Back to clients
      </Link>

      <SectionBoundary fallback={<HeaderSkeleton />} errorTitle="Couldn't load this client">
        <ClientHeader clientId={clientId} />
      </SectionBoundary>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <SectionBoundary fallback={<InfoSkeleton />} errorTitle="Couldn't load details">
          <InfoCard clientId={clientId} />
        </SectionBoundary>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-brand-ink">Session notes</h2>
            <AddSessionDialog clientId={clientId} />
          </div>
          <SectionBoundary fallback={<SessionsSkeleton />} errorTitle="Couldn't load sessions">
            <SessionsList clientId={clientId} />
          </SectionBoundary>
        </div>
      </div>
    </>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────
function ClientHeader({ clientId }: { clientId: string }) {
  const trpc = useTRPC();
  const { data: c } = useSuspenseQuery(trpc.coaching.clientById.queryOptions({ id: clientId }));
  if (!c) return <AdminError compact title="Client not found" hint="This client may have been removed." />;
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold text-brand-ink">{c.contact.fullName || c.contact.email}</h1>
        <p className="text-sm text-brand-ink/60">{c.coachingType}</p>
      </div>
      <Badge className="border-0 bg-brand-blue/10 text-brand-navy">{c.status}</Badge>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-56 animate-pulse rounded-xl bg-brand-ink/10" />
        <div className="h-4 w-32 animate-pulse rounded-full bg-brand-ink/[0.07]" />
      </div>
      <div className="h-6 w-16 animate-pulse rounded-full bg-brand-ink/10" />
    </div>
  );
}

// ── Info card ───────────────────────────────────────────────────────────────
function InfoCard({ clientId }: { clientId: string }) {
  const trpc = useTRPC();
  const { data: c } = useSuspenseQuery(trpc.coaching.clientById.queryOptions({ id: clientId }));
  if (!c) return null;
  return (
    <AdminCard className="h-fit p-5">
      <h2 className="mb-3 font-heading text-lg font-semibold text-brand-ink">Details</h2>
      <dl className="flex flex-col gap-3 text-sm">
        <Info label="Email" value={c.contact.email} />
        <Info label="Phone" value={c.contact.phone ?? "—"} />
        <Info label="Company" value={c.contact.company ?? "—"} />
        <Info label="Role" value={c.contact.roleTitle ?? "—"} />
        <Info label="Primary goals" value={c.primaryGoals ?? "—"} />
      </dl>
    </AdminCard>
  );
}

function InfoSkeleton() {
  return (
    <AdminCard className="h-fit p-5">
      <div className="mb-4 h-5 w-20 animate-pulse rounded-lg bg-brand-ink/10" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-3 w-16 animate-pulse rounded-full bg-brand-ink/[0.07]" />
            <div className="h-4 w-36 animate-pulse rounded-full bg-brand-ink/10" />
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs uppercase tracking-wide text-brand-ink/40">{label}</dt>
      <dd className="text-brand-ink">{value}</dd>
    </div>
  );
}

// ── Sessions ────────────────────────────────────────────────────────────────
function SessionsList({ clientId }: { clientId: string }) {
  const trpc = useTRPC();
  const { data: sessions } = useSuspenseQuery(trpc.coaching.listSessions.queryOptions({ clientId }));
  if (sessions.length === 0) {
    return (
      <AdminCard>
        <AdminEmpty icon={Sparkles} title="No sessions yet" hint="Add a session note to start the coaching record." />
      </AdminCard>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {sessions.map((s) => <SessionRow key={s.id} clientId={clientId} session={s} />)}
    </div>
  );
}

function SessionsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <AdminCard key={i} className="flex items-center justify-between p-5">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-48 animate-pulse rounded-full bg-brand-ink/10" />
            <div className="h-3 w-24 animate-pulse rounded-full bg-brand-ink/[0.07]" />
          </div>
          <div className="h-8 w-28 animate-pulse rounded-xl bg-brand-ink/10" />
        </AdminCard>
      ))}
    </div>
  );
}

function SessionRow({ clientId, session }: { clientId: string; session: SessionNote }) {
  return (
    <AdminCard className="flex items-center justify-between p-5">
      <div className="flex flex-col">
        <span className="font-medium text-brand-ink">
          {session.sessionNumber ? `#${session.sessionNumber} · ` : ""}{session.sessionTitle}
        </span>
        <span className="text-sm text-brand-ink/60">
          {new Date(session.sessionDate).toLocaleDateString()} · {session.sessionFormat} · {session.noteSource}
        </span>
      </div>
      <Link
        href={`/admin/clients/${clientId}/sessions/${session.id}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-brand-ink/15 px-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-ink/[0.04]"
      >
        <Eye className="size-4" /> Open
      </Link>
    </AdminCard>
  );
}

function AddSessionDialog({ clientId }: { clientId: string }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    sessionDate: new Date().toISOString().slice(0, 10),
    sessionTitle: "",
    keyThemesDiscussed: "",
    plaudTranscriptText: "",
  });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const create = useMutation(
    trpc.coaching.createSession.mutationOptions({
      onSuccess: () => {
        toast.success("Session added");
        setOpen(false);
        setF({ sessionDate: new Date().toISOString().slice(0, 10), sessionTitle: "", keyThemesDiscussed: "", plaudTranscriptText: "" });
        qc.invalidateQueries({ queryKey: trpc.coaching.listSessions.queryKey() });
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center gap-1.5 rounded-xl gradient-brand px-4 text-sm font-medium text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
        <Plus className="size-4" /> Add session
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-heading text-xl">Add session note</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <Field label="Date"><DatePicker value={f.sessionDate} onChange={(v) => set("sessionDate", v)} /></Field>
          <Field label="Title"><Input value={f.sessionTitle} onChange={(e) => set("sessionTitle", e.target.value)} /></Field>
          <Field label="Key themes"><Textarea rows={3} value={f.keyThemesDiscussed} onChange={(e) => set("keyThemesDiscussed", e.target.value)} /></Field>
          <Field label="Plaud transcript (optional)"><Textarea rows={4} value={f.plaudTranscriptText} onChange={(e) => set("plaudTranscriptText", e.target.value)} /></Field>
        </div>
        <DialogFooter>
          <Button
            disabled={create.isPending}
            onClick={() => {
              if (!f.sessionTitle) return toast.error("Title required");
              create.mutate({ clientId, data: { ...f, noteSource: noteSourceOptions[0], sessionFormat: sessionFormatOptions[0] } });
            }}
          >
            {create.isPending ? "Saving…" : "Add session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-brand-ink/60">{label}</Label>
      {children}
    </div>
  );
}
