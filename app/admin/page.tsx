import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-session";

export default async function AdminPage() {
  const secret = getAdminSecret();
  if (secret) {
    const h = await headers();
    const cookie = h.get("cookie") ?? "";
    const ok = verifyAdminRequest(new Request("http://internal", { headers: { cookie } }));
    if (!ok) {
      redirect("/admin/login");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg bg-zinc-100 px-4 py-12">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Экспорт ответов</h1>
        <p className="mt-2 text-sm text-zinc-600">Скачайте все отправленные анкеты в JSON или CSV. Ссылку на эту страницу не давайте декларанту.</p>
        <ul className="mt-6 space-y-3">
          <li>
            <a
              href="/api/admin/export?format=json"
              className="block rounded-lg bg-sky-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-sky-700"
            >
              Скачать JSON
            </a>
          </li>
          <li>
            <a
              href="/api/admin/export?format=csv"
              className="block rounded-lg border border-sky-600 px-4 py-3 text-center text-sm font-medium text-sky-700 hover:bg-sky-50"
            >
              Скачать CSV
            </a>
          </li>
        </ul>
        <div className="mt-4">
          <AdminLogoutButton />
        </div>
        <Link href="/" className="mt-6 inline-block text-sm text-zinc-600 underline">
          К анкете
        </Link>
      </div>
    </main>
  );
}
