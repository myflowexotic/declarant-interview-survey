"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DRAFT_STORAGE_KEY,
  SECTIONS,
  type AnswerValue,
  type SurveyDraft,
} from "@/lib/survey-data";
import { QuestionBlock } from "./QuestionBlock";

const emptyAnswer = (): AnswerValue => ({ chips: [], comment: "" });

function loadDraft(): SurveyDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SurveyDraft;
  } catch {
    return null;
  }
}

export function SurveyWizard() {
  const router = useRouter();
  const totalSteps = SECTIONS.length;
  const [stepIndex, setStepIndex] = useState(0);
  const [respondentLabel, setRespondentLabel] = useState("");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  const section = SECTIONS[stepIndex];

  const persistDraft = useCallback(
    (next: { stepIndex?: number; answers?: Record<string, AnswerValue>; respondentLabel?: string }) => {
      const draft: SurveyDraft = {
        respondentLabel: next.respondentLabel ?? respondentLabel,
        answers: next.answers ?? answers,
        stepIndex: next.stepIndex ?? stepIndex,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    },
    [answers, respondentLabel, stepIndex],
  );

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setRespondentLabel(draft.respondentLabel ?? "");
      setAnswers(draft.answers ?? {});
      setStepIndex(Math.min(draft.stepIndex ?? 0, totalSteps - 1));
      setDraftRestored(true);
    }
  }, [totalSteps]);

  useEffect(() => {
    if (Object.keys(answers).length > 0 || respondentLabel || stepIndex > 0) {
      persistDraft({});
    }
  }, [answers, respondentLabel, stepIndex, persistDraft]);

  const setAnswer = (id: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const progressLabel = useMemo(() => `Шаг ${stepIndex + 1} из ${totalSteps}`, [stepIndex, totalSteps]);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          respondent_label: respondentLabel.trim() || null,
          answers,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        const msg = body.error ?? "Не удалось отправить";
        throw new Error(
          res.status === 503
            ? "Сервер анкеты ещё не настроен (база данных). Сообщите отправившему ссылку."
            : msg,
        );
      }
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      router.push("/thank-you");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка отправки");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Анкета для декларанта</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Помогите нам понять, как вы обычно работаете с ЭТТН и декларацией. Нажимайте подходящие варианты и
          допишите своё, где нужно.
        </p>
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          <strong>Регистрация и вход не нужны.</strong> Сразу заполняйте анкету. Страница «/admin» — только для
          сотрудника, который выгружает ответы (не для декларанта).
        </p>
        {draftRestored && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Восстановлен сохранённый черновик с этого устройства. Можно продолжить.
          </p>
        )}
      </header>

      {stepIndex === 0 && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4">
          <label className="text-sm text-zinc-700">Как к вам обращаться? (необязательно)</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Имя или инициалы"
            value={respondentLabel}
            onChange={(e) => setRespondentLabel(e.target.value)}
          />
        </div>
      )}

      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-sky-700">{progressLabel}</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full bg-sky-600 transition-all"
            style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-zinc-900">{section.title}</h2>
      {section.intro && <p className="mb-4 text-sm text-zinc-600">{section.intro}</p>}

      <div className="space-y-4">
        {section.questions.map((q) => (
          <QuestionBlock key={q.id} question={q} value={answers[q.id] ?? emptyAnswer()} onChange={(v) => setAnswer(q.id, v)} />
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={stepIndex === 0 || submitting}
          onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-800 disabled:opacity-40"
        >
          Назад
        </button>
        {stepIndex < totalSteps - 1 ? (
          <button
            type="button"
            disabled={submitting}
            onClick={() => setStepIndex((s) => s + 1)}
            className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Далее
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submit()}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "Отправляем…" : "Отправить"}
          </button>
        )}
      </div>

      <p className="mt-6 text-xs text-zinc-500">
        Черновик автоматически сохраняется в браузере. Можно закрыть страницу и вернуться позже.
      </p>
    </div>
  );
}
