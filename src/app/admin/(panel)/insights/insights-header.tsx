"use client";

import Link from "next/link";
import { useQueryStates } from "nuqs";
import { Plus } from "lucide-react";
import { insightSearchParams } from "@/lib/admin-params";
import { insightStatusOptions } from "@/db/schema";
import { AdminPageHeader, AdminSearch } from "@/components/admin/ui";
import { ClearFiltersButton } from "@/components/admin/clear-filters-button";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InsightsHeader() {
  const [params, setParams] = useQueryStates(insightSearchParams);
  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader
        title="Insights"
        description="Articles — rich-text editor, image uploads, publish control."
        action={
          <Link href="/admin/insights/new" className={buttonVariants()}>
            <Plus className="size-4" /> New post
          </Link>
        }
      />
      <div className="flex flex-wrap gap-3">
        <AdminSearch value={params.search} onChange={(v) => setParams({ search: v, page: 1 })} placeholder="Search title…" />
        <Select value={params.status ?? "all"} onValueChange={(v) => setParams({ status: v === "all" ? null : (v as (typeof insightStatusOptions)[number]), page: 1 })}>
          <SelectTrigger className="w-40 bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {insightStatusOptions.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <ClearFiltersButton
          active={!!params.search || !!params.status}
          onClear={() => setParams({ search: "", status: null, page: 1 })}
        />
      </div>
    </div>
  );
}
