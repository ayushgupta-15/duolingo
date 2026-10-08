"use client";

import { useCountUp } from "@/lib/useCountUp";
import Confetti from "@/components/Confetti";

export default function LessonCompleteModal({
  xpEarned,
  correctCount,
  totalCount,
  newStreak,
  onContinue,
}: {
  xpEarned: number;
  correctCount: number;
  totalCount: number;
  newStreak: number;
  onContinue: () => void;
}) {
  const perfect = correctCount === totalCount;
  const displayedXp = useCountUp(xpEarned, 800);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative">
        {perfect && <Confetti pieces={48} />}
        <div className="duo-pop-bounce duo-card max-w-sm w-full p-6 text-center">
          <div className="text-6xl mb-4 duo-idle-bounce">{perfect ? "🎉" : "🏁"}</div>
          <h2 className="text-2xl font-black mb-1">{perfect ? "Perfect Lesson!" : "Lesson Complete!"}</h2>
          <p className="text-[var(--duo-gray)] font-bold mb-6">
            {correctCount}/{totalCount} correct
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl py-4">
              <div className="text-2xl font-black text-yellow-600 duo-count-up">+{displayedXp} XP</div>
              <div className="text-xs font-bold text-[var(--duo-gray)]">Total earned</div>
            </div>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl py-4">
              <div className="text-2xl font-black text-orange-500">
                <span className="duo-flame-pulse inline-block">🔥</span> {newStreak}
              </div>
              <div className="text-xs font-bold text-[var(--duo-gray)]">Day streak</div>
            </div>
          </div>

          <button onClick={onContinue} className="duo-btn duo-btn-green w-full py-3">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
