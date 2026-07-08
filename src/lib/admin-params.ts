import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import {
  clientStatusOptions,
  coachingTypeOptions,
  insightStatusOptions,
  formSubmissionStatuses,
  formSubmissionTypes,
} from "@/db/schema";

// nuqs URL-state definitions for the admin list pages. Mirrors the reference
// `params.ts` pattern: search + page + limit + per-resource filters, all with
// clearOnDefault so the URL stays clean. Client pages consume these via
// `useQueryStates(...)`; server pages prefetch via the matching `load*` loader.

const page = parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true });
const limit = parseAsInteger.withDefault(20).withOptions({ clearOnDefault: true });
const search = parseAsString.withDefault("").withOptions({ clearOnDefault: true });

export const clientSearchParams = {
  search,
  page,
  limit,
  status: parseAsStringEnum([...clientStatusOptions]).withOptions({ clearOnDefault: true }),
  coachingType: parseAsStringEnum([...coachingTypeOptions]).withOptions({ clearOnDefault: true }),
};
export const loadClientSearchParams = createLoader(clientSearchParams);

export const applicationSearchParams = {
  search,
  page,
  limit,
  status: parseAsStringEnum([...formSubmissionStatuses]).withOptions({ clearOnDefault: true }),
  formType: parseAsStringEnum([...formSubmissionTypes]).withOptions({ clearOnDefault: true }),
};
export const loadApplicationSearchParams = createLoader(applicationSearchParams);

export const insightSearchParams = {
  search,
  page,
  limit,
  status: parseAsStringEnum([...insightStatusOptions]).withOptions({ clearOnDefault: true }),
};
export const loadInsightSearchParams = createLoader(insightSearchParams);

export const emailLogSearchParams = { search, page, limit };
export const loadEmailLogSearchParams = createLoader(emailLogSearchParams);
