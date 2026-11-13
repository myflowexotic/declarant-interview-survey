import Link from "next/link";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center bg-zinc-100 px-4 py-12">
      <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Только для администратора</h1>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Вы декларант и заполняете анкету? <strong>Закройте эту страницу</strong> и откройте главную без слова admin в
          адресе — там нет регистрации и пароля.
        </p>
        <p className="mt-3 text-sm text-zinc-600">Секрет для выгрузки ответов (Lenoy): из Vercel, переменная ADMIN_EXPORT_SECRET.</p>
        <AdminLoginForm />
        <Link href="/" className="mt-6 inline-block text-sm text-zinc-600 underline">
          К анкете
        </Link>
      </div>
    </main>
  );
}
