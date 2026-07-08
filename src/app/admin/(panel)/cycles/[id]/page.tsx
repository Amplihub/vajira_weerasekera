import { connection } from "next/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { CycleDetailView } from "./cycle-detail";

export const metadata = { title: "360 Cycle" };

export default async function CycleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const qc = getQueryClient();
  void qc.prefetchQuery(trpc.cycles.byId.queryOptions({ id }));
  void qc.prefetchQuery(trpc.cycles.getOnboardingTemplate.queryOptions());
  void qc.prefetchQuery(trpc.cycles.listNominations.queryOptions({ id }));
  void qc.prefetchQuery(trpc.cycles.results.queryOptions({ id }));
  void qc.prefetchQuery(trpc.cycles.getSummary.queryOptions({ id }));
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <CycleDetailView cycleId={id} />
    </HydrationBoundary>
  );
}
