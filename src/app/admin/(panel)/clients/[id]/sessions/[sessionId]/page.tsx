import { connection } from "next/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { SessionDetailPage } from "./session-detail";

export const metadata = { title: "Session" };

export default async function Page({ params }: { params: Promise<{ id: string; sessionId: string }> }) {
  await connection();
  const { id, sessionId } = await params;
  const qc = getQueryClient();
  void qc.prefetchQuery(trpc.coaching.sessionById.queryOptions({ id: sessionId }));
  void qc.prefetchQuery(trpc.clarityMap.bySessionNote.queryOptions({ sessionNoteId: sessionId }));
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <SessionDetailPage clientId={id} sessionId={sessionId} />
    </HydrationBoundary>
  );
}
