"use client";

export default function FeedbackBar({
  correct,
  correctAnswer,
  onContinue,
}: {
  correct: boolean;
  correctAnswer: any;
  onContinue: () => void;
}) {
  const bg = correct ? "bg-green-100 dark:bg-green-500/10" : "bg-red-100 dark:bg-red-500/10";
  const text = correct ? "text-[var(--duo-green-dark)]" : "text-[var(--duo-red-dark)]";
  const btn = correct ? "duo-btn-green" : "duo-btn-red";
  const borderColor = correct ? "border-green-300 dark:border-green-800" : "border-red-300 dark:border-red-800";

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${bg} border-t-2 ${borderColor} duo-slide-up z-30`}>
      <div className="max-w-2xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
        <div className={`flex items-center gap-3 font-black text-lg ${text}`}>
          <span className="text-3xl duo-pop-bounce inline-block">{correct ? "✅" : "❌"}</span>
          <div>
            <div>{correct ? "Nicely done!" : "Correct solution:"}</div>
            {!correct && typeof correctAnswer !== "object" && (
              <div className="text-base font-bold">{String(correctAnswer)}</div>
            )}
          </div>
        </div>
        <button onClick={onContinue} className={`duo-btn ${btn} px-8 py-3`}>
          Continue
        </button>
      </div>
    </div>
  );
}
