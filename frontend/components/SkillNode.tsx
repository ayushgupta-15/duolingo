"use client";

import { SkillNode as SkillNodeType } from "@/lib/api";

const UNIT_COLOR_FALLBACK = "#58CC02";

export default function SkillNode({
  skill,
  unitColor,
  isCurrent,
  offset,
  delayIndex = 0,
  onClick,
}: {
  skill: SkillNodeType;
  unitColor: string;
  isCurrent: boolean;
  offset: number;
  delayIndex?: number;
  onClick: () => void;
}) {
  const locked = skill.status === "locked";
  const completed = skill.status === "completed";

  const bg = locked ? "#E5E5E5" : completed ? "var(--duo-yellow)" : unitColor || UNIT_COLOR_FALLBACK;
  const border = locked ? "#CFCFCF" : completed ? "var(--duo-yellow-dark)" : shade(unitColor);

  return (
    <div
      className="duo-node-in relative flex flex-col items-center"
      style={{ transform: `translateX(${offset}px)`, animationDelay: `${Math.min(delayIndex, 10) * 60}ms` }}
    >
      {isCurrent && (
        <div className="absolute -top-9 bg-white border-2 border-[var(--duo-border)] text-[var(--duo-blue)] font-extrabold text-xs uppercase px-3 py-1 rounded-xl shadow-sm animate-bounce">
          Start
          <div className="absolute left-1/2 -bottom-[7px] -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-[var(--duo-border)] rotate-45" />
        </div>
      )}
      <button
        onClick={onClick}
        disabled={locked}
        className={`duo-btn w-20 h-20 flex items-center justify-center text-3xl disabled:cursor-not-allowed ${
          completed ? "duo-glow-ring" : ""
        }`}
        style={{ background: bg, borderColor: border, borderRadius: "9999px" }}
        title={skill.title}
      >
        {locked ? "🔒" : completed ? "👑" : skill.icon}
      </button>
      <div className="flex gap-1 mt-2">
        {Array.from({ length: skill.total_levels }).map((_, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: i < skill.crowns ? "var(--duo-yellow)" : "#E5E5E5" }}
          />
        ))}
      </div>
      <div className="text-xs font-bold text-[var(--duo-gray-dark)] mt-1 text-center w-24">
        {skill.title}
      </div>
    </div>
  );
}

function shade(hex: string): string {
  if (!hex) return "#45a302";
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - 35);
  const g = Math.max(0, ((num >> 8) & 0xff) - 35);
  const b = Math.max(0, (num & 0xff) - 35);
  return `rgb(${r}, ${g}, ${b})`;
}
