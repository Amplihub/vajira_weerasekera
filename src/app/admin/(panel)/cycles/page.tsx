import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { connection } from "next/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { AdminTableSkeleton, AdminError } from "@/components/admin/data-states";
import { CyclesHeader } from "./cycles-header";
import { CyclesTable } from "./cycles-table";

export const metadata = { title: "360 Cycles" };

async function Content() {
  await connection();
  const qc = getQueryClient();
  void qc.prefetchQuery(trpc.cycles.list.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<AdminError title="Cycles unavailable" />}>
        <CyclesTable />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}

export default function CyclesPage() {
  return (
    <div className="flex flex-col gap-5">
      <CyclesHeader />
      <Suspense fallback={<AdminTableSkeleton cols={4} />}>
        <Content />
      </Suspense>
    </div>
  );
}
