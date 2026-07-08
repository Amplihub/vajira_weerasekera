import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

// Admin allowlist — only these Google accounts may sign in to /admin.
// Replaces the old Replit `ADMIN_EMAILS` env gate.
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // Block sign-in for non-allowlisted emails at the source.
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          if (!isAdminEmail(newUser.email)) {
            throw new Error("This email is not authorized for admin access.");
          }
          return { data: newUser };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
