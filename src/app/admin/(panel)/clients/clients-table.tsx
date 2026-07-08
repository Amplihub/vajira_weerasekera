"use client";

import { useState } from "react";
import { useQueryStates } from "nuqs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { clientSearchParams } from "@/lib/admin-params";
import { AdminPagination } from "@/components/admin/ui";
import { TableShell, AdminEmpty, RowDetailDialog } from "@/components/admin/data-states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type ClientRow = {
  id: string;
  status: string;
  coachingType: string;
  sessionCount: number;
  contact: { fullName: string | null; email: string; company: string | null; roleTitle: string | null; phone: string | null };
};

export function ClientsTable() {
  const trpc = useTRPC();
  const [params, setParams] = useQueryStates(clientSearchParams);
  const [selected, setSelected] = useState<ClientRow | null>(null);

  const { data, isFetching } = useSuspenseQuery(
    trpc.coaching.listClients.queryOptions({
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
      coachingType: params.coachingType || undefined,
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
            {["Name", "Company", "Type", "Status", "Sessions"].map((h) => (
              <TableHead key={h} className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">{h}</TableHead>
            ))}
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((c) => (
            <TableRow
              key={c.id}
              onClick={() => setSelected(c as ClientRow)}
              className="group cursor-pointer transition-colors hover:bg-brand-blue/[0.04]"
            >
              <TableCell className="font-medium text-brand-ink">{c.contact.fullName || c.contact.email}</TableCell>
              <TableCell className="text-brand-ink/70">{c.contact.company ?? "—"}</TableCell>
              <TableCell className="text-brand-ink/70">{c.coachingType}</TableCell>
              <TableCell><Badge className="border-0 bg-brand-blue/10 text-brand-navy">{c.status}</Badge></TableCell>
              <TableCell className="text-brand-ink/55">{c.sessionCount}</TableCell>
              <TableCell><Eye className="size-4 text-brand-ink/25 transition-colors group-hover:text-brand-blue" /></TableCell>
            </TableRow>
          ))}
          {data.items.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6}>
                <AdminEmpty title="No clients yet" hint="Convert an application or add a client to get started." />
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
          title={selected.contact.fullName || selected.contact.email}
          subtitle={selected.coachingType}
          viewHref={`/admin/clients/${selected.id}`}
          viewLabel="Open client"
          fields={[
            { label: "Email", value: selected.contact.email },
            ...(selected.contact.company ? [{ label: "Company", value: selected.contact.company }] : []),
            ...(selected.contact.roleTitle ? [{ label: "Role", value: selected.contact.roleTitle }] : []),
            ...(selected.contact.phone ? [{ label: "Phone", value: selected.contact.phone }] : []),
            { label: "Status", value: selected.status },
            { label: "Sessions", value: String(selected.sessionCount) },
          ]}
        />
      )}
    </TableShell>
  );
}
