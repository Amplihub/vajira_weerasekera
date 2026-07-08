import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { connection } from "next/server";
import type { SearchParams } from "nuqs/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { loadEmailLogSearchParams } from "@/lib/admin-params";
import { AdminTableSkeleton, AdminError } from "@/components/admin/data-states";
import { EmailLogsHeader } from "./email-logs-header";
import { EmailLogsTable } from "./email-logs-table";

export const metadata = { title: "Email Log" };

async function Content({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const qc = getQueryClient();
  const p = await loadEmailLogSearchParams(searchParams);
  void qc.prefetchQuery(
    trpc.emailLogs.list.queryOptions({ page: p.page, limit: p.limit, search: p.search || undefined }),
  );
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<AdminError title="Email log unavailable" />}>
        <EmailLogsTable />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}

export default function EmailLogsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="flex flex-col gap-5">
      <EmailLogsHeader />
      <Suspense fallback={<AdminTableSkeleton cols={5} />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
