"use client";

import { useEffect, useState } from "react";

export default function FillBlankExercise({
  data,
  disabled,
  feedbackCorrectAnswer,
  onAnswerChange,
}: {
  data: { sentence: string; options: string[] };
  disabled: boolean;
  feedbackCorrectAnswer: string | null;
  onAnswerChange: (answer: any, ready: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => setSelected(null), [data]);

  function pick(opt: string) {
    if (disabled) return;
    setSelected(opt);
    onAnswerChange(opt, true);
  }

  const parts = data.sentence.split("___");

  return (
    <div>
      <p className="text-xl font-extrabold mb-6">
        {parts[0]}
        <span className="inline-block min-w-20 border-b-2 border-[var(--duo-blue)] text-[var(--duo-blue)] text-center mx-1">
          {selected ?? " "}
        </span>
        {parts[1]}
      </p>
      <div className="flex flex-wrap gap-3">
        {data.options.map((opt) => {
          const isSelected = selected === opt;
          const isAnswer = feedbackCorrectAnswer !== null && opt === feedbackCorrectAnswer;
          return (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => pick(opt)}
              className={`duo-btn duo-btn-outline px-5 py-3 font-bold ${
                isSelected ? "!border-[var(--duo-blue)] !bg-blue-50 dark:!bg-blue-500/10 !text-[var(--duo-blue)]" : ""
              } ${isAnswer ? "!border-[var(--duo-green)] !bg-green-50 dark:!bg-green-500/10 !text-[var(--duo-green)]" : ""}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
