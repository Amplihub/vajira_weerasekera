import { randomBytes } from "crypto";

/** Cryptographically-random, URL-safe token for 360 onboarding / nomination / survey links. */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/** Default expiry for 360 links: now + given days (default 30). */
export function tokenExpiry(days = 30): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function isExpired(expiresAt: Date | null | undefined): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}
