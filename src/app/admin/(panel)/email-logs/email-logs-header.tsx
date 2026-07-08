"use client";

import { useQueryStates } from "nuqs";
import { emailLogSearchParams } from "@/lib/admin-params";
import { AdminPageHeader, AdminSearch } from "@/components/admin/ui";
import { ClearFiltersButton } from "@/components/admin/clear-filters-button";

export function EmailLogsHeader() {
  const [params, setParams] = useQueryStates(emailLogSearchParams);
  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="Email Log" description="Audit trail of every email sent via Resend." />
      <div className="flex flex-wrap items-center gap-3">
        <AdminSearch value={params.search} onChange={(v) => setParams({ search: v, page: 1 })} placeholder="Search recipient or subject…" />
        <ClearFiltersButton active={!!params.search} onClear={() => setParams({ search: "", page: 1 })} />
      </div>
    </div>
  );
}
