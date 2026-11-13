import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Спасибо!</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Ваши ответы сохранены. Они помогут настроить программу под вашу обычную логику работы.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-800"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
