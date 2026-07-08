"use client";

import { useState } from "react";
import Link from "next/link";
import { useSuspenseQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { sessionFormatOptions, noteSourceOptions } from "@/db/schema";
import type { PersonalClarityMap, PersonalClarityMapDimension } from "@/db/schema";
import { AdminCard } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { DatePicker } from "@/components/ui/date-picker";

const NARRATIVE_FIELDS = [
  { key: "whatChangedSinceLastSession", label: "What changed since last session" },
  { key: "keyThemesDiscussed", label: "Key themes discussed" },
  { key: "insightsAndBreakthroughs", label: "Insights & breakthroughs" },
  { key: "decisionsMade", label: "Decisions made" },
  { key: "commitmentsBeforeNextSession", label: "Commitments before next session" },
  { key: "nextSessionFocus", label: "Next session focus" },
  { key: "coachObservations", label: "Coach observations" },
  { key: "privateNotes", label: "Private notes" },
] as const;

type FormState = {
  sessionTitle: string;
  sessionDate: string;
  sessionFormat: (typeof sessionFormatOptions)[number];
  noteSource: (typeof noteSourceOptions)[number];
  durationMinutes: string;
  whatChangedSinceLastSession: string;
  keyThemesDiscussed: string;
  insightsAndBreakthroughs: string;
  decisionsMade: string;
  commitmentsBeforeNextSession: string;
  nextSessionFocus: string;
  coachObservations: string;
  privateNotes: string;
  plaudAiSummaryText: string;
  plaudTranscriptText: string;
};

export function SessionDetailPage({ clientId, sessionId }: { clientId: string; sessionId: string }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: s } = useSuspenseQuery(trpc.coaching.sessionById.queryOptions({ id: sessionId }));

  const [f, setF] = useState<FormState>({
    sessionTitle: s.sessionTitle,
    sessionDate: new Date(s.sessionDate).toISOString().slice(0, 10),
    sessionFormat: (s.sessionFormat as FormState["sessionFormat"]) ?? sessionFormatOptions[0],
    noteSource: (s.noteSource as FormState["noteSource"]) ?? noteSourceOptions[0],
    durationMinutes: s.durationMinutes != null ? String(s.durationMinutes) : "",
    whatChangedSinceLastSession: s.whatChangedSinceLastSession ?? "",
    keyThemesDiscussed: s.keyThemesDiscussed ?? "",
    insightsAndBreakthroughs: s.insightsAndBreakthroughs ?? "",
    decisionsMade: s.decisionsMade ?? "",
    commitmentsBeforeNextSession: s.commitmentsBeforeNextSession ?? "",
    nextSessionFocus: s.nextSessionFocus ?? "",
    coachObservations: s.coachObservations ?? "",
    privateNotes: s.privateNotes ?? "",
    plaudAiSummaryText: s.plaudAiSummaryText ?? "",
    plaudTranscriptText: s.plaudTranscriptText ?? "",
  });
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = useMutation(
    trpc.coaching.updateSession.mutationOptions({
      onSuccess: () => {
        toast.success("Session saved");
        qc.invalidateQueries({ queryKey: trpc.coaching.sessionById.queryKey({ id: sessionId }) });
        qc.invalidateQueries({ queryKey: trpc.coaching.listSessions.queryKey({ clientId }) });
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  const onSave = () => {
    if (!f.sessionTitle.trim()) return toast.error("Title required");
    const duration = f.durationMinutes.trim() ? Number(f.durationMinutes) : undefined;
    if (duration !== undefined && Number.isNaN(duration)) return toast.error("Duration must be a number");
    save.mutate({
      id: sessionId,
      data: {
        sessionTitle: f.sessionTitle,
        sessionDate: f.sessionDate,
        sessionFormat: f.sessionFormat,
        noteSource: f.noteSource,
        durationMinutes: duration,
        whatChangedSinceLastSession: f.whatChangedSinceLastSession,
        keyThemesDiscussed: f.keyThemesDiscussed,
        insightsAndBreakthroughs: f.insightsAndBreakthroughs,
        decisionsMade: f.decisionsMade,
        commitmentsBeforeNextSession: f.commitmentsBeforeNextSession,
        nextSessionFocus: f.nextSessionFocus,
        coachObservations: f.coachObservations,
        privateNotes: f.privateNotes,
        plaudAiSummaryText: f.plaudAiSummaryText,
        plaudTranscriptText: f.plaudTranscriptText,
      },
    });
  };

  return (
    <>
      <Link href={`/admin/clients/${clientId}`} className="mb-4 inline-flex items-center gap-2 text-sm text-brand-ink/60 hover:text-brand-ink">
        <ArrowLeft className="size-4" /> Back to client
      </Link>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-brand-ink">
          {s.sessionNumber ? `Session #${s.sessionNumber}` : "Session"}
        </h1>
        <Button onClick={onSave} disabled={save.isPending}>
          <Save className="size-4" /> {save.isPending ? "Saving…" : "Save"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(320px,420px)]">
        {/* Left: editable session */}
        <div className="flex flex-col gap-5">
          <AdminCard className="flex flex-col gap-4 p-5">
            <Field label="Title"><Input value={f.sessionTitle} onChange={(e) => set("sessionTitle", e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date"><DatePicker value={f.sessionDate} onChange={(v) => set("sessionDate", v)} /></Field>
              <Field label="Duration (min)"><Input type="number" value={f.durationMinutes} onChange={(e) => set("durationMinutes", e.target.value)} /></Field>
              <Field label="Format">
                <Select value={f.sessionFormat} options={sessionFormatOptions} onChange={(v) => set("sessionFormat", v as FormState["sessionFormat"])} />
              </Field>
              <Field label="Note source">
                <Select value={f.noteSource} options={noteSourceOptions} onChange={(v) => set("noteSource", v as FormState["noteSource"])} />
              </Field>
            </div>
          </AdminCard>

          {NARRATIVE_FIELDS.map((nf) => (
            <div key={nf.key} className="flex flex-col gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-brand-navy">{nf.label}</Label>
              <RichTextEditor value={f[nf.key]} onChange={(v) => set(nf.key, v)} placeholder={`${nf.label}…`} />
            </div>
          ))}

          <Field label="Plaud AI summary (for clarity map)">
            <Textarea rows={4} value={f.plaudAiSummaryText} onChange={(e) => set("plaudAiSummaryText", e.target.value)} placeholder="Paste the Plaud AI summary…" />
          </Field>
          <Field label="Plaud transcript (for clarity map)">
            <Textarea rows={6} value={f.plaudTranscriptText} onChange={(e) => set("plaudTranscriptText", e.target.value)} placeholder="Paste the raw Plaud transcript…" />
          </Field>
        </div>

        {/* Right: clarity map */}
        <ClarityMapPanel
          sessionId={sessionId}
          hasSource={!!(s.plaudTranscriptText || s.plaudAiSummaryText)}
        />
      </div>
    </>
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

function Select({ value, options, onChange }: { value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── Clarity map ───────────────────────────────────────────────────────────────
const SIGNAL_STYLES: Record<string, string> = {
  Stable: "bg-emerald-100 text-emerald-700",
  Emerging: "bg-blue-100 text-blue-700",
  "Under Pressure": "bg-amber-100 text-amber-700",
  Avoided: "bg-rose-100 text-rose-700",
  Unclear: "bg-brand-ink/10 text-brand-ink/60",
};

function ClarityMapPanel({ sessionId, hasSource }: { sessionId: string; hasSource: boolean }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: map, isLoading } = useQuery(trpc.clarityMap.bySessionNote.queryOptions({ sessionNoteId: sessionId }));

  const gen = useMutation(
    trpc.clarityMap.generate.mutationOptions({
      onMutate: () => ({ toastId: toast.loading("Generating clarity map with AI… this can take ~20s.") }),
      onSuccess: (_d, _v, ctx) => {
        toast.success("Clarity map generated.", { id: ctx?.toastId });
        qc.invalidateQueries({ queryKey: trpc.clarityMap.bySessionNote.queryKey({ sessionNoteId: sessionId }) });
      },
      onError: (e, _v, ctx) => toast.error(e.message, { id: ctx?.toastId }),
    }),
  );

  return (
    <AdminCard className="flex h-fit flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-brand-ink">Personal Clarity Map</h2>
        <Button
          variant="outline"
          size="sm"
          disabled={gen.isPending || !hasSource}
          title={hasSource ? "" : "Add a Plaud transcript or AI summary, then save, to generate"}
          onClick={() => gen.mutate({ sessionNoteId: sessionId })}
        >
          <Sparkles className="size-4" /> {gen.isPending ? "Generating…" : map ? "Regenerate" : "Generate"}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-brand-ink/50">Loading…</p>
      ) : !map ? (
        <p className="text-sm text-brand-ink/50">
          {hasSource
            ? "Not generated yet — click Generate."
            : "Add a Plaud transcript or AI summary to this session (and save) to generate a clarity map."}
        </p>
      ) : (
        <ClarityMapView map={map} />
      )}
    </AdminCard>
  );
}

function ClarityMapView({ map }: { map: PersonalClarityMap & { dimensions: PersonalClarityMapDimension[] } }) {
  return (
    <div className="flex flex-col gap-4">
      <Badge className="w-fit border-0 bg-brand-blue/10 capitalize text-brand-navy">{map.status.replace("_", " ")}</Badge>
      {map.overallSummary && <Block label="Overall summary" value={map.overallSummary} />}
      {map.topThemes && <Block label="Top themes" value={map.topThemes} />}
      {map.suggestedNextFocus && <Block label="Suggested next focus" value={map.suggestedNextFocus} />}

      <div className="flex flex-col gap-3">
        {map.dimensions.map((d) => (
          <div key={d.id} className="rounded-2xl border border-brand-ink/[0.08] bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-heading text-sm font-semibold capitalize text-brand-ink">{d.dimension}</span>
              <Badge className={`border-0 ${SIGNAL_STYLES[d.currentSignal] ?? SIGNAL_STYLES.Unclear}`}>{d.currentSignal}</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {d.clientReflections?.trim() && <Block label="Client reflections" value={d.clientReflections} />}
              {d.keyThemes?.trim() && <Block label="Key themes" value={d.keyThemes} />}
              {d.coachInterpretation?.trim() && <Block label="Coach interpretation" value={d.coachInterpretation} />}
              {d.possibleFocusAreas?.trim() && <Block label="Possible focus areas" value={d.possibleFocusAreas} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-navy">{label}</span>
      <p className="whitespace-pre-line text-sm leading-6 text-brand-ink/80">{value}</p>
    </div>
  );
}
