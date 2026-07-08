import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { paginationInput, pageToOffset, paginated } from "../pagination";
import { storage } from "@/lib/queries";

export const emailLogsRouter = createTRPCRouter({
  list: adminProcedure.input(paginationInput).query(async ({ input }) => {
    const { items, total } = await storage.getEmailLogsPaged({
      limit: input.limit,
      offset: pageToOffset(input.page, input.limit),
      search: input.search,
    });
    return paginated(items, total, input.page, input.limit);
  }),

  byId: adminProcedure.input(z.object({ id: z.string() })).query(({ input }) => storage.getEmailLog(input.id)),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const ok = await storage.deleteEmailLog(input.id);
    return { ok };
  }),

  deleteMany: adminProcedure.input(z.object({ ids: z.array(z.string()) })).mutation(async ({ input }) => {
    const count = await storage.deleteEmailLogs(input.ids);
    return { count };
  }),
});
