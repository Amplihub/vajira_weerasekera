"use client";

import { useQueryStates } from "nuqs";
import { applicationSearchParams } from "@/lib/admin-params";
import { formSubmissionStatuses, formSubmissionTypes } from "@/db/schema";
import { AdminPageHeader, AdminSearch } from "@/components/admin/ui";
import { ClearFiltersButton } from "@/components/admin/clear-filters-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ApplicationsHeader() {
  const [params, setParams] = useQueryStates(applicationSearchParams);
  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="Applications" description="Incoming form submissions from the website." />
      <div className="flex flex-wrap items-center gap-3">
        <AdminSearch value={params.search} onChange={(v) => setParams({ search: v, page: 1 })} placeholder="Search name or email…" />
        <Select
          value={params.status ?? "all"}
          onValueChange={(v) => setParams({ status: v === "all" ? null : (v as (typeof formSubmissionStatuses)[number]), page: 1 })}
        >
          <SelectTrigger className="w-40 bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {formSubmissionStatuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select
          value={params.formType ?? "all"}
          onValueChange={(v) => setParams({ formType: v === "all" ? null : (v as (typeof formSubmissionTypes)[number]), page: 1 })}
        >
          <SelectTrigger className="w-44 bg-white"><SelectValue placeholder="Form type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {formSubmissionTypes.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <ClearFiltersButton
          active={!!params.search || !!params.status || !!params.formType}
          onClear={() => setParams({ search: "", status: null, formType: null, page: 1 })}
        />
      </div>
    </div>
  );
}
