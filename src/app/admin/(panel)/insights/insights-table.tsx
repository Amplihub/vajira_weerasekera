"use client";

import { useState } from "react";
import { useQueryStates } from "nuqs";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { insightSearchParams } from "@/lib/admin-params";
import { AdminPagination } from "@/components/admin/ui";
import { TableShell, AdminEmpty, RowDetailDialog } from "@/components/admin/data-states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Post = {
  id: string;
  title: string;
  status: string;
  updatedAt: string | Date;
  excerpt?: string | null;
  category?: string | null;
};

export function InsightsTable() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [params, setParams] = useQueryStates(insightSearchParams);
  const [selected, setSelected] = useState<Post | null>(null);

  const { data, isFetching } = useSuspenseQuery(
    trpc.insights.listAll.queryOptions({
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
    }),
  );

  const del = useMutation(
    trpc.insights.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted");
        setSelected(null);
        qc.invalidateQueries({ queryKey: trpc.insights.listAll.queryKey() });
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
            {["Title", "Status", "Updated"].map((h) => (
              <TableHead key={h} className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">{h}</TableHead>
            ))}
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((p) => (
            <TableRow
              key={p.id}
              onClick={() => setSelected(p as Post)}
              className="group cursor-pointer transition-colors hover:bg-brand-blue/[0.04]"
            >
              <TableCell className="font-medium text-brand-ink">{p.title}</TableCell>
              <TableCell>
                <Badge className={`border-0 capitalize ${p.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-brand-ink/10 text-brand-ink/60"}`}>{p.status}</Badge>
              </TableCell>
              <TableCell className="text-brand-ink/55">{new Date(p.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell><Eye className="size-4 text-brand-ink/25 transition-colors group-hover:text-brand-blue" /></TableCell>
            </TableRow>
          ))}
          {data.items.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4}>
                <AdminEmpty title="No posts yet" hint="Write your first insight to publish it on the site." />
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
          title={selected.title}
          subtitle={selected.category ?? undefined}
          viewHref={`/admin/insights/${selected.id}`}
          viewLabel="Edit post"
          fields={[
            { label: "Status", value: <span className="capitalize">{selected.status}</span> },
            { label: "Updated", value: new Date(selected.updatedAt).toLocaleString() },
            ...(selected.excerpt ? [{ label: "Excerpt", value: selected.excerpt }] : []),
          ]}
        >
          <div className="mt-1 rounded-2xl border border-brand-ink/[0.07] bg-muted/30 p-4">
            <Button variant="destructive" className="w-full" disabled={del.isPending} onClick={() => del.mutate({ id: selected.id })}>
              <Trash2 className="size-4" /> {del.isPending ? "Deleting…" : "Delete post"}
            </Button>
          </div>
        </RowDetailDialog>
      )}
    </TableShell>
  );
}
