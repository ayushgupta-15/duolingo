"use client";

const COURSES = [
  { flag: "🇪🇸", name: "Spanish", active: true },
  { flag: "🇫🇷", name: "French", active: false },
  { flag: "🇩🇪", name: "German", active: false },
  { flag: "🇯🇵", name: "Japanese", active: false },
  { flag: "🇮🇹", name: "Italian", active: false },
  { flag: "🇰🇷", name: "Korean", active: false },
  { flag: "🇨🇳", name: "Chinese", active: false },
  { flag: "🇧🇷", name: "Portuguese", active: false },
];

export default function CourseSelector({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="duo-pop-bounce duo-card max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black">Choose a course</h2>
          <button onClick={onClose} className="text-2xl text-[var(--duo-gray)] font-bold leading-none">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COURSES.map((c) => (
            <button
              key={c.name}
              disabled={!c.active}
              onClick={onClose}
              className={`duo-btn flex flex-col items-center gap-2 py-4 ${
                c.active ? "duo-btn-outline !border-[var(--duo-green)]" : "duo-btn-outline opacity-50"
              }`}
              title={c.active ? c.name : `${c.name} — Coming Soon`}
            >
              <span className="text-3xl">{c.flag}</span>
              <span className="text-xs font-bold">{c.name}</span>
              {c.active ? (
                <span className="text-[10px] font-black text-[var(--duo-green)] uppercase">Active</span>
              ) : (
                <span className="text-[10px] font-black text-[var(--duo-gray)] uppercase">Soon</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
