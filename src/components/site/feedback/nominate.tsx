"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Users, ShieldX, CheckCircle2 } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { TokenShell, TokenCard, TokenState, TokenHeader } from "@/components/site/token-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ROLES = ["Manager", "Peer", "Direct Report", "Other"] as const;
type Nominee = { nomineeName: string; nomineeEmail: string; nomineeRole: string };
const blank = (): Nominee => ({ nomineeName: "", nomineeEmail: "", nomineeRole: "Peer" });

export function FeedbackNominate({ token }: { token: string }) {
  const trpc = useTRPC();
  const validate = useQuery(trpc.feedback.nominateValidate.queryOptions({ token }));
  const submit = useMutation(trpc.feedback.nominateSubmit.mutationOptions());
  const [rows, setRows] = useState<Nominee[]>([blank(), blank(), blank()]);
  const [done, setDone] = useState(false);

  if (validate.isLoading)
    return (
      <TokenShell center>
        <TokenState icon={Users} title="Loading…">Fetching your nomination form.</TokenState>
      </TokenShell>
    );

  if (validate.isError)
    return (
      <TokenShell center>
        <TokenState icon={ShieldX} tone="error" title="This link is not valid">
          Please contact Vajira Weerasekera for a new link.
        </TokenState>
      </TokenShell>
    );

  if (done)
    return (
      <TokenShell center>
        <TokenState icon={CheckCircle2} tone="success" title="Nominations submitted.">
          Thank you. Vajira will review them and reach out with next steps.
        </TokenState>
      </TokenShell>
    );

  const valid = rows.filter((r) => r.nomineeName.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.nomineeEmail));
  const update = (i: number, patch: Partial<Nominee>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  return (
    <TokenShell>
      <TokenCard className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <TokenHeader icon={Users} eyebrow="360 Leadership Insight" title="Nominate your respondents" />
          <p className="text-sm leading-6 text-brand-ink/70">
            Choose a balanced group — managers, peers, and direct reports who have worked closely with you and will
            give honest, constructive input.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((row, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-2xl border border-brand-ink/10 p-4 sm:flex-row sm:items-center">
              <Input placeholder="Full name" value={row.nomineeName} onChange={(e) => update(i, { nomineeName: e.target.value })} className="sm:flex-1" />
              <Input placeholder="Email" type="email" value={row.nomineeEmail} onChange={(e) => update(i, { nomineeEmail: e.target.value })} className="sm:flex-1" />
              <Select value={row.nomineeRole} onValueChange={(v) => update(i, { nomineeRole: v ?? "Peer" })}>
                <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
                <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
              {rows.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => setRows((r) => r.filter((_, j) => j !== i))} aria-label="Remove">
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setRows((r) => [...r, blank()])}>
            <Plus className="size-4" /> Add another
          </Button>
          <Button
            disabled={valid.length === 0 || submit.isPending}
            onClick={() => submit.mutate({ token, nominees: valid }, { onSuccess: () => setDone(true) })}
          >
            {submit.isPending ? "Submitting…" : `Submit ${valid.length || ""} nominee${valid.length === 1 ? "" : "s"}`}
          </Button>
        </div>
      </TokenCard>
    </TokenShell>
  );
}
