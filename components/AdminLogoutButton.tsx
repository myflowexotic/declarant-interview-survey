"use client";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="text-sm text-zinc-500 underline"
      onClick={() => {
        void fetch("/api/admin/logout", { method: "POST" }).then(() => {
          window.location.href = "/admin/login";
        });
      }}
    >
      Выйти
    </button>
  );
}
