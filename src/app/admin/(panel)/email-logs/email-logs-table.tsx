"use client";

import { useState } from "react";
import { useQueryStates } from "nuqs";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Trash2, AlertTriangle } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { emailLogSearchParams } from "@/lib/admin-params";
import { AdminPagination } from "@/components/admin/ui";
import { TableShell, AdminEmpty, RowDetailDialog } from "@/components/admin/data-states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type EmailRow = {
  id: string;
  to: string;
  subject: string;
  trigger: string;
  success: boolean;
  sentAt: string | Date;
  preview?: string | null;
  error?: string | null;
};

export function EmailLogsTable() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [params, setParams] = useQueryStates(emailLogSearchParams);
  const [selected, setSelected] = useState<EmailRow | null>(null);

  const { data, isFetching } = useSuspenseQuery(
    trpc.emailLogs.list.queryOptions({ page: params.page, limit: params.limit, search: params.search || undefined }),
  );

  const del = useMutation(
    trpc.emailLogs.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted");
        setSelected(null);
        qc.invalidateQueries({ queryKey: trpc.emailLogs.list.queryKey() });
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <TableShell>
      <div className="h-0.5 w-full overflow-hidden">
        {isFetching && <div className="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-brand-blue" />}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {["To", "Subject", "Trigger", "Status", "Sent"].map((h) => (
              <TableHead key={h} className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">{h}</TableHead>
            ))}
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((e) => (
            <TableRow
              key={e.id}
              onClick={() => setSelected(e as EmailRow)}
              className="group cursor-pointer transition-colors hover:bg-brand-blue/[0.04]"
            >
              <TableCell className="font-medium text-brand-ink">{e.to}</TableCell>
              <TableCell className="text-brand-ink/70">{e.subject}</TableCell>
              <TableCell className="text-brand-ink/55">{e.trigger}</TableCell>
              <TableCell>
                <Badge className={`border-0 ${e.success ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{e.success ? "Sent" : "Failed"}</Badge>
              </TableCell>
              <TableCell className="text-brand-ink/55">{new Date(e.sentAt).toLocaleString()}</TableCell>
              <TableCell><Eye className="size-4 text-brand-ink/25 transition-colors group-hover:text-brand-blue" /></TableCell>
            </TableRow>
          ))}
          {data.items.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6}>
                <AdminEmpty title="No emails logged" hint="Sent emails (and failures) appear here." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AdminPagination page={data.page} total={data.total} limit={data.limit} totalPages={data.totalPages} onPage={(p) => setParams({ page: p })} />

      {selected && (
        <RowDetailDialog
          open
          onOpenChange={(v) => !v && setSelected(null)}
          title={selected.subject}
          subtitle={`To ${selected.to}`}
          fields={[
            { label: "Trigger", value: selected.trigger },
            { label: "Status", value: selected.success ? "Sent" : "Failed" },
            { label: "Sent", value: new Date(selected.sentAt).toLocaleString() },
            ...(selected.preview ? [{ label: "Preview", value: <span className="whitespace-pre-wrap">{selected.preview}</span> }] : []),
          ]}
        >
          {!selected.success && (
            <div className="mt-1 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">Why it failed</span>
                <span className="text-rose-600">{selected.error || "No error detail was recorded."}</span>
              </div>
            </div>
          )}
          <div className="mt-1 rounded-2xl border border-brand-ink/[0.07] bg-muted/30 p-4">
            <Button variant="destructive" className="w-full" disabled={del.isPending} onClick={() => del.mutate({ id: selected.id })}>
              <Trash2 className="size-4" /> {del.isPending ? "Deleting…" : "Delete log"}
            </Button>
          </div>
        </RowDetailDialog>
      )}
    </TableShell>
  );
}
