# Анкета декларанта

Публичная форма для декларанта + закрытый экспорт ответов для Lenoy.

**Продакшен:** https://anketa.artikul-grabber.site  
**Экспорт:** https://anketa.artikul-grabber.site/admin (нужен `ADMIN_EXPORT_SECRET`)

## Локально

```bash
npm install
env -u DATABASE_URL npm run dev
```

Без `DATABASE_URL` используется встроенная PGlite и миграции из `migrations/`.

С экспортом под секретом:

```bash
export ADMIN_EXPORT_SECRET="локальный-тестовый-секрет-32сим"
env -u DATABASE_URL npm run dev
```

Откройте `/admin/login`, введите секрет, скачайте JSON/CSV.

## Vercel + Neon

Пошагово: `docs/anketa-deploy.md` в store проекта DECLARANT.

Переменные окружения на Vercel:

| Переменная | Назначение |
|------------|------------|
| `DATABASE_URL` | Postgres (Neon), с `?sslmode=require` |
| `ADMIN_EXPORT_SECRET` | Длинная случайная строка (≥16 символов), только для Lenoy |

Сборка: `npm run build` применяет SQL-миграции, если задан `DATABASE_URL`.

## Для декларанта

Отправьте только главную страницу — без логина, черновик сохраняется в браузере.

## Структура данных

Таблица `responses`: `id`, `created_at`, `respondent_label`, `answers` (JSON `q1`…`q40`: `{ chips, comment }`).
