import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "declarant_survey_admin";

function expectedToken(secret: string): string {
  return createHash("sha256").update(`v1:${secret}`).digest("hex");
}

export function getAdminSecret(): string | null {
  const secret = process.env.ADMIN_EXPORT_SECRET?.trim();
  return secret && secret.length >= 16 ? secret : null;
}

export function issueAdminCookieValue(secret: string): string {
  return expectedToken(secret);
}

export function verifyAdminRequest(request: Request): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  const header = request.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : "";
  if (!value) return false;

  const expected = expectedToken(secret);
  try {
    const a = Buffer.from(value, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function adminCookieHeader(secret: string): string {
  const value = issueAdminCookieValue(secret);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`;
}
