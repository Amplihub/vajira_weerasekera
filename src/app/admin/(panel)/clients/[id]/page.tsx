import { connection } from "next/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { ClientDetailView } from "./client-detail";

export const metadata = { title: "Client" };

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const qc = getQueryClient();
  void qc.prefetchQuery(trpc.coaching.clientById.queryOptions({ id }));
  void qc.prefetchQuery(trpc.coaching.listSessions.queryOptions({ clientId: id }));
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ClientDetailView clientId={id} />
    </HydrationBoundary>
  );
}
