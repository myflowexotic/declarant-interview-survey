import { verifyAdminRequest } from "./admin-session";

/** Экспорт: cookie после ввода ADMIN_EXPORT_SECRET (Vercel) или локально без секрета в dev. */
export async function requireExportAccess(request: Request): Promise<Response | null> {
  if (verifyAdminRequest(request)) {
    return null;
  }

  const hasSecret = Boolean(process.env.ADMIN_EXPORT_SECRET?.trim());
  if (hasSecret) {
    return Response.json({ error: "Нужен вход в /admin" }, { status: 401 });
  }

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return Response.json({ error: "ADMIN_EXPORT_SECRET не настроен" }, { status: 503 });
}
