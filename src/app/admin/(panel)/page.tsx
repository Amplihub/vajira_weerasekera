import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { connection } from "next/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { AdminError } from "@/components/admin/data-states";
import { DashboardStats, DashboardStatsSkeleton } from "./dashboard-stats";

export const metadata = { title: "Dashboard" };

async function Stats() {
  await connection();
  const qc = getQueryClient();
  void qc.prefetchQuery(trpc.applications.list.queryOptions({ page: 1, limit: 1, status: "new" }));
  void qc.prefetchQuery(trpc.coaching.listClients.queryOptions({ page: 1, limit: 1 }));
  void qc.prefetchQuery(trpc.insights.listAll.queryOptions({ page: 1, limit: 1 }));
  void qc.prefetchQuery(trpc.cycles.list.queryOptions());
  void qc.prefetchQuery(trpc.emailLogs.list.queryOptions({ page: 1, limit: 1 }));
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<AdminError title="Dashboard unavailable" />}>
        <DashboardStats />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}

export default function AdminDashboard() {
  return (
    <>
      {/* Hero (static — outside Suspense) */}
      <div className="relative mb-8 overflow-hidden rounded-[2rem] gradient-brand p-8 text-white shadow-pop sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-24 size-48 rounded-full bg-brand-blue/30 blur-2xl" />
        <div className="relative flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Coaching backend</p>
          <h1 className="font-heading text-3xl font-semibold tracking-[-0.5px] sm:text-4xl">Welcome back, Vajira</h1>
          <p className="max-w-md text-sm leading-6 text-white/75">
            Everything across applications, clients, insights and 360 cycles — at a glance.
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <Stats />
      </Suspense>
    </>
  );
}
