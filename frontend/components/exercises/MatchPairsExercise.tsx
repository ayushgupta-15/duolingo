"use client";

import { useEffect, useMemo, useState } from "react";

interface Pair {
  left: string;
  right: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchPairsExercise({
  data,
  disabled,
  onAnswerChange,
}: {
  data: { pairs: Pair[] };
  disabled: boolean;
  onAnswerChange: (answer: any, ready: boolean) => void;
}) {
  const leftItems = useMemo(() => shuffle(data.pairs.map((p) => p.left)), [data]);
  const rightItems = useMemo(() => shuffle(data.pairs.map((p) => p.right)), [data]);

  const [matched, setMatched] = useState<Pair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  useEffect(() => {
    setMatched([]);
    setSelectedLeft(null);
  }, [data]);

  function pickLeft(left: string) {
    if (disabled || matched.some((m) => m.left === left)) return;
    setSelectedLeft(left);
  }

  function pickRight(right: string) {
    if (disabled || !selectedLeft || matched.some((m) => m.right === right)) return;
    const isCorrect = data.pairs.some((p) => p.left === selectedLeft && p.right === right);
    if (isCorrect) {
      const next = [...matched, { left: selectedLeft, right }];
      setMatched(next);
      setSelectedLeft(null);
      onAnswerChange(next, next.length === data.pairs.length);
    } else {
      setWrongFlash(right);
      setTimeout(() => setWrongFlash(null), 300);
      setSelectedLeft(null);
    }
  }

  return (
    <div>
      <p className="text-xl font-extrabold mb-6">Match the pairs</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {leftItems.map((item) => {
            const isMatched = matched.some((m) => m.left === item);
            return (
              <button
                key={item}
                disabled={disabled || isMatched}
                onClick={() => pickLeft(item)}
                className={`duo-btn duo-btn-outline px-3 py-3 font-bold ${
                  selectedLeft === item ? "!border-[var(--duo-blue)] !text-[var(--duo-blue)]" : ""
                } ${isMatched ? "!opacity-30" : ""}`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rightItems.map((item) => {
            const isMatched = matched.some((m) => m.right === item);
            return (
              <button
                key={item}
                disabled={disabled || isMatched}
                onClick={() => pickRight(item)}
                className={`duo-btn duo-btn-outline px-3 py-3 font-bold ${
                  wrongFlash === item ? "duo-shake !border-[var(--duo-red)] !text-[var(--duo-red)]" : ""
                } ${isMatched ? "!opacity-30" : ""}`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
