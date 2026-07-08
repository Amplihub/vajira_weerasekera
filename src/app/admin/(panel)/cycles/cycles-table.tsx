"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { TableShell, AdminEmpty, RowDetailDialog } from "@/components/admin/data-states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  draft: "bg-brand-ink/10 text-brand-ink/60",
  active: "bg-brand-blue/10 text-brand-navy",
  closed: "bg-emerald-100 text-emerald-700",
};

type Cycle = {
  id: string;
  title: string;
  clientName: string;
  status: string;
  completedCount: number;
  respondentCount: number;
};

export function CyclesTable() {
  const trpc = useTRPC();
  const { data, isFetching } = useSuspenseQuery(trpc.cycles.list.queryOptions());
  const [selected, setSelected] = useState<Cycle | null>(null);

  return (
    <TableShell>
      <div className="h-0.5 w-full overflow-hidden">
        {isFetching && <div className="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-brand-blue" />}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {["Title", "Client", "Status", "Responses"].map((h) => (
              <TableHead key={h} className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">{h}</TableHead>
            ))}
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cy) => (
            <TableRow
              key={cy.id}
              onClick={() => setSelected(cy as Cycle)}
              className="group cursor-pointer transition-colors hover:bg-brand-blue/[0.04]"
            >
              <TableCell className="font-medium text-brand-ink">{cy.title}</TableCell>
              <TableCell className="text-brand-ink/70">{cy.clientName}</TableCell>
              <TableCell><Badge className={`border-0 capitalize ${statusColor[cy.status]}`}>{cy.status}</Badge></TableCell>
              <TableCell className="text-brand-ink/55">{cy.completedCount}/{cy.respondentCount}</TableCell>
              <TableCell><Eye className="size-4 text-brand-ink/25 transition-colors group-hover:text-brand-blue" /></TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5}>
                <AdminEmpty title="No cycles yet" hint="Create a 360 cycle for a coaching client to begin." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selected && (
        <RowDetailDialog
          open
          onOpenChange={(v) => !v && setSelected(null)}
          title={selected.title}
          subtitle={selected.clientName}
          viewHref={`/admin/cycles/${selected.id}`}
          viewLabel="Open cycle"
          fields={[
            { label: "Client", value: selected.clientName },
            { label: "Status", value: <span className="capitalize">{selected.status}</span> },
            { label: "Responses", value: `${selected.completedCount} of ${selected.respondentCount} completed` },
          ]}
        />
      )}
    </TableShell>
  );
}
