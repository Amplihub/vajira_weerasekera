import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { connection } from "next/server";
import type { SearchParams } from "nuqs/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { loadClientSearchParams } from "@/lib/admin-params";
import { AdminTableSkeleton, AdminError } from "@/components/admin/data-states";
import { ClientsHeader } from "./clients-header";
import { ClientsTable } from "./clients-table";

export const metadata = { title: "Coaching CRM" };

async function Content({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const qc = getQueryClient();
  const p = await loadClientSearchParams(searchParams);
  void qc.prefetchQuery(
    trpc.coaching.listClients.queryOptions({
      page: p.page,
      limit: p.limit,
      search: p.search || undefined,
      status: p.status || undefined,
      coachingType: p.coachingType || undefined,
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<AdminError title="Clients unavailable" />}>
        <ClientsTable />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}

export default function ClientsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="flex flex-col gap-5">
      <ClientsHeader />
      <Suspense fallback={<AdminTableSkeleton cols={5} />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
