"use client";

import {
  TIME_PRECISE_PLACEHOLDER,
  TIME_RANGE_CHIPS,
  type AnswerValue,
  type Question,
} from "@/lib/survey-data";

type Props = {
  question: Question;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
};

export function QuestionBlock({ question, value, onChange }: Props) {
  const chips = question.useTimeRanges ? TIME_RANGE_CHIPS : (question.chips ?? []);

  const toggleChip = (chip: string) => {
    if (question.multiSelect) {
      const next = value.chips.includes(chip)
        ? value.chips.filter((c) => c !== chip)
        : [...value.chips, chip];
      onChange({ ...value, chips: next });
    } else {
      onChange({ ...value, chips: value.chips[0] === chip ? [] : [chip] });
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">Вопрос {question.number}</p>
      <p className="mt-1 text-base leading-relaxed text-zinc-900">{question.text}</p>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => {
            const selected = value.chips.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggleChip(chip)}
                className={
                  selected
                    ? "rounded-full border border-sky-600 bg-sky-600 px-3 py-1.5 text-sm text-white"
                    : "rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-800 hover:border-sky-400"
                }
              >
                {chip}
              </button>
            );
          })}
        </div>
      )}

      <label className="mt-4 block text-sm text-zinc-600">Свой ответ / комментарий (необязательно)</label>
      <textarea
        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        rows={question.number === 10 || question.number === 15 || question.number === 40 ? 4 : 3}
        placeholder={
          question.useTimeRanges ? TIME_PRECISE_PLACEHOLDER : "Свои слова, примеры, пошаговый рецепт…"
        }
        value={value.comment}
        onChange={(e) => onChange({ ...value, comment: e.target.value })}
      />
    </div>
  );
}
