import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { connection } from "next/server";
import type { SearchParams } from "nuqs/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { loadInsightSearchParams } from "@/lib/admin-params";
import { AdminTableSkeleton, AdminError } from "@/components/admin/data-states";
import { InsightsHeader } from "./insights-header";
import { InsightsTable } from "./insights-table";

export const metadata = { title: "Insights" };

async function Content({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const qc = getQueryClient();
  const p = await loadInsightSearchParams(searchParams);
  void qc.prefetchQuery(
    trpc.insights.listAll.queryOptions({
      page: p.page,
      limit: p.limit,
      search: p.search || undefined,
      status: p.status || undefined,
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<AdminError title="Insights unavailable" />}>
        <InsightsTable />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}

export default function InsightsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="flex flex-col gap-5">
      <InsightsHeader />
      <Suspense fallback={<AdminTableSkeleton cols={3} />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
