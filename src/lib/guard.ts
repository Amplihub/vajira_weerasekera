import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, isAdminEmail } from "@/lib/auth";

// Full server-side admin authorization. Use at the top of every admin page and
// inside every /api/admin route handler. Verifies a valid session AND that the
// signed-in email is on the allowlist.
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isAdminEmail(session.user.email)) {
    redirect("/admin/login");
  }
  return session;
}

// API-route variant: returns the session or null (caller returns 401/403).
export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isAdminEmail(session.user.email)) return null;
  return session;
}
