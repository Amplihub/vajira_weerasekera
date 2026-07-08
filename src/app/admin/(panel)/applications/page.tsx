import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { connection } from "next/server";
import type { SearchParams } from "nuqs/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { loadApplicationSearchParams } from "@/lib/admin-params";
import { AdminTableSkeleton, AdminError } from "@/components/admin/data-states";
import { ApplicationsHeader } from "./applications-header";
import { ApplicationsTable } from "./applications-table";

export const metadata = { title: "Applications" };

async function Content({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const qc = getQueryClient();
  const p = await loadApplicationSearchParams(searchParams);
  void qc.prefetchQuery(
    trpc.applications.list.queryOptions({
      page: p.page,
      limit: p.limit,
      search: p.search || undefined,
      status: p.status || undefined,
      formType: p.formType || undefined,
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<AdminError title="Applications unavailable" />}>
        <ApplicationsTable />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}

export default function ApplicationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="flex flex-col gap-5">
      <ApplicationsHeader />
      <Suspense fallback={<AdminTableSkeleton cols={5} />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
