import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { isAdminEmail } from "@/lib/auth";
import { storage } from "@/lib/queries";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Require a valid session.
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Require a session AND that the email is on the admin allowlist.
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  if (!isAdminEmail(ctx.user.email)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Audit admin mutations (skip queries). Logs actor, action, outcome, duration.
const auditAdmin = t.middleware(async ({ ctx, path, type, next }) => {
  if (type !== "mutation") return next();
  const startedAt = Date.now();
  const [entity, action] = path.split(".");
  try {
    const result = await next();
    void storage
      .logAudit({
        actorEmail: ctx.user?.email ?? null,
        action: action ?? path,
        entity: entity ?? "unknown",
        status: "success",
        ipAddress: ctx.request.ipAddress,
        durationMs: Date.now() - startedAt,
      })
      .catch((e) => console.error("[audit] write failed:", e));
    return result;
  } catch (error) {
    const err = error as TRPCError;
    void storage
      .logAudit({
        actorEmail: ctx.user?.email ?? null,
        action: action ?? path,
        entity: entity ?? "unknown",
        status: "failed",
        errorMessage: err.message,
        ipAddress: ctx.request.ipAddress,
        durationMs: Date.now() - startedAt,
      })
      .catch((e) => console.error("[audit] write failed:", e));
    throw error;
  }
});

// Lightweight per-instance rate limit for public token endpoints (brute-force blunting).
const HITS = new Map<string, { count: number; resetAt: number }>();
function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const e = HITS.get(key);
  if (!e || now > e.resetAt) {
    HITS.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  e.count += 1;
  return e.count > max;
}
const withPublicRateLimit = t.middleware(({ ctx, path, next }) => {
  const key = `${ctx.request.ipAddress ?? "unknown"}:${path}`;
  if (rateLimit(key, 30, 60_000)) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests. Try again shortly." });
  }
  return next();
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

/** No auth — public site endpoints. */
export const publicProcedure = t.procedure;
/** Public but rate-limited — token-based 360 survey endpoints. */
export const rateLimitedPublicProcedure = t.procedure.use(withPublicRateLimit);
/** Any authenticated user. */
export const protectedProcedure = t.procedure.use(isAuthed);
/** Admin allowlist only + audited — the coaching backend. */
export const adminProcedure = t.procedure.use(isAdmin).use(auditAdmin);
