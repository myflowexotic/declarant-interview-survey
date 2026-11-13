import { adminCookieHeader, getAdminSecret } from "@/lib/admin-session";
import { timingSafeEqual } from "node:crypto";

export async function POST(request: Request) {
  const secret = getAdminSecret();
  if (!secret) {
    return Response.json({ error: "ADMIN_EXPORT_SECRET не настроен на сервере" }, { status: 503 });
  }

  let body: { secret?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Неверный формат" }, { status: 400 });
  }

  const attempt = typeof body.secret === "string" ? body.secret : "";
  const a = Buffer.from(attempt);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ error: "Неверный секрет" }, { status: 401 });
  }

  return Response.json(
    { ok: true },
    {
      headers: {
        "set-cookie": adminCookieHeader(secret),
      },
    },
  );
}
