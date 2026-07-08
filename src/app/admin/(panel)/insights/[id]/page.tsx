import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { connection } from "next/server";
import { getQueryClient, trpc, dehydrate, HydrationBoundary } from "@/lib/trpc/server";
import { AdminError } from "@/components/admin/data-states";
import { EditInsightClient } from "./edit-client";

export const metadata = { title: "Edit post" };

function EditorSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 animate-pulse rounded-xl bg-brand-ink/10" />
      <div className="h-10 w-72 animate-pulse rounded-full bg-brand-ink/10" />
      <div className="h-64 animate-pulse rounded-3xl bg-brand-ink/[0.06]" />
    </div>
  );
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const qc = getQueryClient();
  void qc.prefetchQuery(trpc.insights.byId.queryOptions({ id }));
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<AdminError title="Editor unavailable" />}>
        <EditInsightClient id={id} />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}

export default function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
