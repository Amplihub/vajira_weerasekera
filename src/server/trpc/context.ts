import { auth } from "@/lib/auth";
import { db } from "@/db";

// Per-request tRPC context. Resolves the BetterAuth session + request metadata.
// Single-tenant: no tenant resolution (unlike the reference monorepo).
export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await auth.api.getSession({ headers: opts.headers });

  const forwardedFor = opts.headers.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? opts.headers.get("x-real-ip") ?? null;

  return {
    db,
    session,
    user: session?.user ?? null,
    request: {
      ipAddress,
      userAgent: opts.headers.get("user-agent"),
    },
  };
}

// Context for RSC / direct server calls (headers passed from next/headers).
export async function createServerContext(headers: Headers) {
  return createTRPCContext({ headers });
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
