"use client";

import { useState } from "react";
import { useQueryStates } from "nuqs";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Check, UserPlus } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { applicationSearchParams } from "@/lib/admin-params";
import { coachingTypeOptions } from "@/db/schema";
import { AdminPagination } from "@/components/admin/ui";
import { TableShell, AdminEmpty, RowDetailDialog } from "@/components/admin/data-states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColor: Record<string, string> = {
  new: "bg-brand-blue/10 text-brand-navy",
  reviewed: "bg-amber-100 text-amber-700",
  converted: "bg-emerald-100 text-emerald-700",
  archived: "bg-brand-ink/10 text-brand-ink/60",
};

type Application = {
  id: string;
  fullName: string | null;
  email: string;
  formType: string;
  status: string;
  createdAt: string | Date;
  company?: string | null;
  role?: string | null;
  message?: string | null;
};

export function ApplicationsTable() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [params, setParams] = useQueryStates(applicationSearchParams);
  const [selected, setSelected] = useState<Application | null>(null);

  const { data, isFetching } = useSuspenseQuery(
    trpc.applications.list.queryOptions({
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
      formType: params.formType || undefined,
    }),
  );

  const invalidate = () => qc.invalidateQueries({ queryKey: trpc.applications.list.queryKey() });

  return (
    <TableShell>
      {/* background-refetch indicator */}
      <div className="h-0.5 w-full overflow-hidden bg-transparent">
        {isFetching && <div className="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-brand-blue" />}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">Name</TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">Email</TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">Type</TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">Status</TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">Date</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((a) => (
            <TableRow
              key={a.id}
              onClick={() => setSelected(a as Application)}
              className="group cursor-pointer transition-colors hover:bg-brand-blue/[0.04]"
            >
              <TableCell className="font-medium text-brand-ink">{a.fullName ?? "—"}</TableCell>
              <TableCell className="text-brand-ink/70">{a.email}</TableCell>
              <TableCell className="capitalize text-brand-ink/70">{a.formType.replace(/_/g, " ")}</TableCell>
              <TableCell>
                <Badge className={`${statusColor[a.status]} border-0 capitalize`}>{a.status}</Badge>
              </TableCell>
              <TableCell className="text-brand-ink/55">{new Date(a.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Eye className="size-4 text-brand-ink/25 transition-colors group-hover:text-brand-blue" />
              </TableCell>
            </TableRow>
          ))}
          {data.items.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6}>
                <AdminEmpty title="No applications found" hint="New submissions from the website land here." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AdminPagination page={data.page} total={data.total} limit={data.limit} totalPages={data.totalPages} onPage={(p) => setParams({ page: p })} />

      {selected && (
        <ApplicationDialog
          application={selected}
          onClose={() => setSelected(null)}
          onChanged={invalidate}
        />
      )}
    </TableShell>
  );
}

function ApplicationDialog({
  application,
  onClose,
  onChanged,
}: {
  application: Application;
  onClose: () => void;
  onChanged: () => void;
}) {
  const trpc = useTRPC();
  const [type, setType] = useState<(typeof coachingTypeOptions)[number]>(coachingTypeOptions[0]);

  const setStatus = useMutation(
    trpc.applications.setStatus.mutationOptions({
      onSuccess: () => { toast.success("Status updated"); onChanged(); onClose(); },
      onError: (e) => toast.error(e.message),
    }),
  );
  const convert = useMutation(
    trpc.applications.convertToClient.mutationOptions({
      onSuccess: () => { toast.success("Converted to client"); onChanged(); onClose(); },
      onError: (e) => toast.error(e.message),
    }),
  );

  const a = application;
  const converted = a.status === "converted";

  return (
    <RowDetailDialog
      open
      onOpenChange={(v) => !v && onClose()}
      title={a.fullName ?? a.email}
      subtitle={a.formType.replace(/_/g, " ")}
      fields={[
        { label: "Email", value: a.email },
        ...(a.company ? [{ label: "Company", value: a.company }] : []),
        ...(a.role ? [{ label: "Role", value: a.role }] : []),
        { label: "Status", value: <span className="capitalize">{a.status}</span> },
        { label: "Received", value: new Date(a.createdAt).toLocaleString() },
        ...(a.message ? [{ label: "Message", value: <span className="whitespace-pre-wrap">{a.message}</span> }] : []),
      ]}
    >
      <div className="mt-1 flex flex-col gap-3 rounded-2xl border border-brand-ink/[0.07] bg-muted/30 p-4">
        {a.status !== "reviewed" && !converted && (
          <Button
            variant="outline"
            disabled={setStatus.isPending}
            onClick={() => setStatus.mutate({ id: a.id, status: "reviewed" })}
          >
            <Check className="size-4" /> Mark reviewed
          </Button>
        )}
        {!converted && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={type} onValueChange={(v) => setType(v as (typeof coachingTypeOptions)[number])}>
              <SelectTrigger className="sm:flex-1"><SelectValue /></SelectTrigger>
              <SelectContent>{coachingTypeOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Button disabled={convert.isPending} onClick={() => convert.mutate({ id: a.id, coachingType: type })}>
              <UserPlus className="size-4" /> {convert.isPending ? "Converting…" : "Convert to client"}
            </Button>
          </div>
        )}
        {converted && <p className="text-sm text-brand-ink/55">Already converted to a coaching client.</p>}
      </div>
    </RowDetailDialog>
  );
}
