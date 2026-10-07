"use client";

import { useEffect, useState } from "react";

export default function TypeAnswerExercise({
  data,
  disabled,
  onAnswerChange,
}: {
  data: { prompt: string };
  disabled: boolean;
  onAnswerChange: (answer: any, ready: boolean) => void;
}) {
  const [value, setValue] = useState("");

  useEffect(() => setValue(""), [data]);

  return (
    <div>
      <p className="text-xl font-extrabold mb-6">{data.prompt}</p>
      <input
        autoFocus
        disabled={disabled}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onAnswerChange(e.target.value, e.target.value.trim().length > 0);
        }}
        placeholder="Type your answer"
        className="w-full border-2 border-[var(--duo-border)] focus:border-[var(--duo-blue)] outline-none rounded-2xl px-4 py-4 text-lg font-bold"
      />
    </div>
  );
}
