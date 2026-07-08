"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { InsightEditor } from "@/components/admin/insight-editor";
import { AdminError } from "@/components/admin/data-states";

export function EditInsightClient({ id }: { id: string }) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.insights.byId.queryOptions({ id }));
  if (!data) return <AdminError title="Post not found" hint="This insight may have been deleted." />;
  return <InsightEditor initial={data} />;
}
