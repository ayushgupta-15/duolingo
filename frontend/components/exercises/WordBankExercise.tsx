"use client";

import { useEffect, useState } from "react";

export default function WordBankExercise({
  data,
  disabled,
  onAnswerChange,
}: {
  data: { sentence: string; tokens: string[] };
  disabled: boolean;
  onAnswerChange: (answer: any, ready: boolean) => void;
}) {
  const [bank, setBank] = useState<string[]>(data.tokens);
  const [chosen, setChosen] = useState<string[]>([]);

  useEffect(() => {
    setBank(data.tokens);
    setChosen([]);
  }, [data]);

  function choose(i: number) {
    if (disabled) return;
    const token = bank[i];
    setChosen((c) => {
      const next = [...c, token];
      onAnswerChange(next, next.length > 0);
      return next;
    });
    setBank((b) => b.filter((_, idx) => idx !== i));
  }

  function unchoose(i: number) {
    if (disabled) return;
    const token = chosen[i];
    setChosen((c) => {
      const next = c.filter((_, idx) => idx !== i);
      onAnswerChange(next, next.length > 0);
      return next;
    });
    setBank((b) => [...b, token]);
  }

  return (
    <div>
      <p className="text-xl font-extrabold mb-6">Translate: "{data.sentence}"</p>

      <div className="min-h-16 border-b-2 border-[var(--duo-border)] flex flex-wrap gap-2 pb-4 mb-8">
        {chosen.map((token, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => unchoose(i)}
            className="duo-btn duo-btn-outline px-4 py-2 font-bold"
          >
            {token}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {bank.map((token, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => choose(i)}
            className="duo-btn duo-btn-outline px-4 py-2 font-bold"
          >
            {token}
          </button>
        ))}
      </div>
    </div>
  );
}
