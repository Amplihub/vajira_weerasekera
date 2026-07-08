import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { paginationInput, pageToOffset, paginated } from "../pagination";
import { storage } from "@/lib/queries";
import { insightFormSchema, insightStatusOptions } from "@/db/schema";
import { createSignedUpload } from "@/lib/storage-bucket";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

export const insightsRouter = createTRPCRouter({
  // ── Public ──
  listPublished: publicProcedure.query(() => storage.getPublishedInsights()),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const insight = await storage.getPublishedInsightBySlug(input.slug);
    if (!insight) throw new TRPCError({ code: "NOT_FOUND", message: "Insight not found" });
    return insight;
  }),

  like: publicProcedure.input(z.object({ slug: z.string() })).mutation(async ({ input }) => {
    const result = await storage.likeInsight(input.slug);
    if (!result) throw new TRPCError({ code: "NOT_FOUND" });
    return result;
  }),

  // ── Admin ──
  listAll: adminProcedure
    .input(paginationInput.extend({ status: z.enum(insightStatusOptions).optional() }))
    .query(async ({ input }) => {
      const { items, total } = await storage.getAllInsightsPaged({
        limit: input.limit,
        offset: pageToOffset(input.page, input.limit),
        status: input.status,
        search: input.search,
      });
      return paginated(items, total, input.page, input.limit);
    }),

  byId: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const insight = await storage.getInsightById(input.id);
    if (!insight) throw new TRPCError({ code: "NOT_FOUND" });
    return insight;
  }),

  create: adminProcedure.input(insightFormSchema).mutation(async ({ input }) => {
    const { publishedAt: _ignored, ...rest } = input;
    return storage.createInsight({
      ...rest,
      publishedAt: input.status === "published" ? new Date() : null,
    });
  }),

  update: adminProcedure
    .input(z.object({ id: z.string(), data: insightFormSchema.partial() }))
    .mutation(async ({ input }) => {
      const { publishedAt: _ignored, ...rest } = input.data;
      const result = await storage.updateInsight(input.id, {
        ...rest,
        ...(input.data.status === "published" ? { publishedAt: new Date() } : {}),
      });
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      return result;
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const ok = await storage.deleteInsight(input.id);
    if (!ok) throw new TRPCError({ code: "NOT_FOUND" });
    return { ok };
  }),

  // ── Image upload (client-direct, S3-presigned style) ──
  // Step 1: server mints a single-use signed upload URL. Browser uploads bytes
  // straight to Supabase Storage — they never touch our server.
  createImageUploadUrl: adminProcedure
    .input(z.object({ filename: z.string().min(1), contentType: z.string(), size: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      if (!ALLOWED_IMAGE_TYPES.includes(input.contentType)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unsupported image type." });
      }
      if (input.size > MAX_IMAGE_BYTES) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Image exceeds 8 MB limit." });
      }
      return createSignedUpload({ filename: input.filename });
    }),

  // Step 2: after the browser upload succeeds, record metadata + return the public URL.
  confirmImageUpload: adminProcedure
    .input(z.object({ path: z.string(), filename: z.string(), contentType: z.string(), publicUrl: z.string().url() }))
    .mutation(async ({ input }) => {
      const row = await storage.createUploadedImage({
        filename: input.filename,
        mimeType: input.contentType,
        storagePath: input.path,
        publicUrl: input.publicUrl,
      });
      return { id: row.id, url: row.publicUrl };
    }),
});
