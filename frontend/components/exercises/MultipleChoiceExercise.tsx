"use client";

import { useEffect, useState } from "react";

export default function MultipleChoiceExercise({
  data,
  disabled,
  feedbackCorrectAnswer,
  onAnswerChange,
}: {
  data: { question: string; options: string[] };
  disabled: boolean;
  feedbackCorrectAnswer: string | null;
  onAnswerChange: (answer: any, ready: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => setSelected(null), [data]);

  function pick(i: number) {
    if (disabled) return;
    setSelected(i);
    onAnswerChange(i, true);
  }

  return (
    <div>
      <p className="text-xl font-extrabold mb-6">{data.question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.options.map((opt, i) => {
          const isSelected = selected === i;
          const isAnswer = feedbackCorrectAnswer !== null && opt === feedbackCorrectAnswer;
          return (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => pick(i)}
              className={`duo-btn duo-btn-outline text-left px-4 py-4 font-bold ${
                isSelected ? "!border-[var(--duo-blue)] !bg-blue-50 !text-[var(--duo-blue)]" : ""
              } ${isAnswer ? "!border-[var(--duo-green)] !bg-green-50 !text-[var(--duo-green)]" : ""}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
