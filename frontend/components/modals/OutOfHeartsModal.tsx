"use client";

export default function OutOfHeartsModal({
  minutesToNext,
  onRefill,
  onQuit,
}: {
  minutesToNext: number | null;
  onRefill: () => void;
  onQuit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="duo-pop duo-card max-w-sm w-full p-6 text-center">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-2xl font-black mb-2">Out of hearts!</h2>
        <p className="text-[var(--duo-gray)] font-bold mb-6">
          {minutesToNext != null
            ? `Next heart in ${minutesToNext} min, or refill now with gems.`
            : "Refill now with gems to keep practicing."}
        </p>
        <button onClick={onRefill} className="duo-btn duo-btn-blue w-full py-3 mb-3">
          💎 Refill hearts (mock, free)
        </button>
        <button onClick={onQuit} className="duo-btn duo-btn-outline w-full py-3">
          Practice later
        </button>
      </div>
    </div>
  );
}
