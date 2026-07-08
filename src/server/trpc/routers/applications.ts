import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { paginationInput, pageToOffset, paginated } from "../pagination";
import { storage } from "@/lib/queries";
import { formSubmissionStatuses, formSubmissionTypes, coachingTypeOptions } from "@/db/schema";

// The admin "Applications" inbox = GoHighLevel form submissions landing in form_submissions.
export const applicationsRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      paginationInput.extend({
        status: z.enum(formSubmissionStatuses).optional(),
        formType: z.enum(formSubmissionTypes).optional(),
      }),
    )
    .query(async ({ input }) => {
      const { items, total } = await storage.getFormSubmissionsPaged({
        limit: input.limit,
        offset: pageToOffset(input.page, input.limit),
        status: input.status,
        formType: input.formType,
        search: input.search,
      });
      return paginated(items, total, input.page, input.limit);
    }),

  byId: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const sub = await storage.getFormSubmissionById(input.id);
    if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
    return sub;
  }),

  setStatus: adminProcedure
    .input(z.object({ id: z.string(), status: z.enum(formSubmissionStatuses) }))
    .mutation(async ({ input }) => {
      const result = await storage.updateFormSubmissionStatus(input.id, input.status);
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      return result;
    }),

  // "Convert to client": promote a submission into a contact + coaching client.
  convertToClient: adminProcedure
    .input(z.object({ id: z.string(), coachingType: z.enum(coachingTypeOptions) }))
    .mutation(async ({ input }) => {
      const sub = await storage.getFormSubmissionById(input.id);
      if (!sub) throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
      if (sub.status === "converted") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already converted" });
      }

      const contact = await storage.findOrCreateContact(sub.email, {
        fullName: sub.fullName ?? sub.email,
        phone: sub.phone,
        company: sub.company,
        roleTitle: sub.role,
      });

      const client = await storage.createCoachingClient({
        contactId: contact.id,
        coachingType: input.coachingType,
        status: "Prospect",
      });

      await storage.updateFormSubmissionStatus(input.id, "converted", client.id);
      return { client, contact };
    }),
});
