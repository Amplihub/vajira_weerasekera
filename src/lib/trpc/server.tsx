import "server-only";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { makeQueryClient } from "./query-client";
import { appRouter, createServerContext, createCallerFactory } from "@/server/trpc/root";

export const getQueryClient = cache(makeQueryClient);

const createContext = cache(async () => {
  const heads = await headers();
  return createServerContext(heads);
});

// Server-side proxy for prefetching queries in RSC.
export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});

// Direct server-side caller (e.g. in generateMetadata or server actions).
const callerFactory = createCallerFactory(appRouter);
export const createCaller = cache(async () => callerFactory(await createContext()));

export { dehydrate, HydrationBoundary };
