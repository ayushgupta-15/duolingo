"use client";

import { useMemo } from "react";

const COLORS = ["#58CC02", "#1CB0F6", "#FFC800", "#FF4B4B", "#CE82FF"];

export default function Confetti({ pieces = 36 }: { pieces?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.4,
        duration: 1.1 + Math.random() * 0.8,
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
        round: Math.random() > 0.5,
      })),
    [pieces]
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-visible z-10">
      {items.map((p) => (
        <span
          key={p.id}
          className="duo-confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
