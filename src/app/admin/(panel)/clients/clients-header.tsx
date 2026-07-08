"use client";

import { useState } from "react";
import { useQueryStates } from "nuqs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { clientSearchParams } from "@/lib/admin-params";
import { clientStatusOptions, coachingTypeOptions } from "@/db/schema";
import { AdminPageHeader, AdminSearch } from "@/components/admin/ui";
import { ClearFiltersButton } from "@/components/admin/clear-filters-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ClientsHeader() {
  const [params, setParams] = useQueryStates(clientSearchParams);
  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="Coaching CRM" description="Client records, sessions, and history." action={<CreateClientDialog />} />
      <div className="flex flex-wrap gap-3">
        <AdminSearch value={params.search} onChange={(v) => setParams({ search: v, page: 1 })} placeholder="Search name, email, company…" />
        <Select value={params.status ?? "all"} onValueChange={(v) => setParams({ status: v === "all" ? null : (v as (typeof clientStatusOptions)[number]), page: 1 })}>
          <SelectTrigger className="w-40 bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {clientStatusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={params.coachingType ?? "all"} onValueChange={(v) => setParams({ coachingType: v === "all" ? null : (v as (typeof coachingTypeOptions)[number]), page: 1 })}>
          <SelectTrigger className="w-48 bg-white"><SelectValue placeholder="Coaching type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {coachingTypeOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <ClearFiltersButton
          active={!!params.search || !!params.status || !!params.coachingType}
          onClear={() => setParams({ search: "", status: null, coachingType: null, page: 1 })}
        />
      </div>
    </div>
  );
}

function CreateClientDialog() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ fullName: "", email: "", phone: "", company: "", roleTitle: "", coachingType: coachingTypeOptions[0], status: "Prospect" as (typeof clientStatusOptions)[number] });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const create = useMutation(
    trpc.coaching.createClient.mutationOptions({
      onSuccess: () => {
        toast.success("Client created");
        setOpen(false);
        qc.invalidateQueries({ queryKey: trpc.coaching.listClients.queryKey() });
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl gradient-brand px-4 text-sm font-medium text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
        <Plus className="size-4" /> New client
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-heading text-xl">New coaching client</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <Field label="Full name"><Input value={f.fullName} onChange={(e) => set("fullName", e.target.value)} /></Field>
          <Field label="Email"><Input value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Phone"><Input value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Company"><Input value={f.company} onChange={(e) => set("company", e.target.value)} /></Field>
          <Field label="Role"><Input value={f.roleTitle} onChange={(e) => set("roleTitle", e.target.value)} /></Field>
          <Field label="Coaching type">
            <Select value={f.coachingType} onValueChange={(v) => set("coachingType", v ?? coachingTypeOptions[0])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{coachingTypeOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <DialogFooter>
          <Button
            disabled={create.isPending}
            onClick={() => {
              if (!f.fullName || !f.email) return toast.error("Name and email required");
              create.mutate(f);
            }}
          >
            {create.isPending ? "Creating…" : "Create"}
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
