"use client";

/** Hand-drawn, original icon set (not copied from any icon library or
 * product) so stats render identically across platforms instead of relying
 * on OS-dependent emoji glyphs. All use currentColor so Tailwind text-color
 * utilities control the fill. */

type IconProps = { size?: number; className?: string };

export function HeartIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7.5-4.6-10.2-9.3C.3 8.7 1.6 5 5.2 4.2c2-.5 4 .3 5.1 2 .2.3.6.3.8 0 1.1-1.7 3.1-2.5 5.1-2 3.6.8 4.9 4.5 3.4 7.5C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function FlameIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.5 2c.6 2.7-.3 4.2-1.6 5.7C9.4 9.4 8 11.2 8 13.8A4.2 4.2 0 0012 18a4.2 4.2 0 004-4.2c0-1-.3-1.8-.7-2.5.9.6 2.2 2 2.2 4.2 0 3.6-2.9 6.5-6.5 6.5S4.5 19.1 4.5 15.5c0-4.3 2.6-6.6 4.8-8.7C11 5.2 12.3 3.9 12.5 2z" />
    </svg>
  );
}

export function GemIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" opacity="0.85" />
      <path d="M6 3h12l2 4H4l2-4z" />
    </svg>
  );
}

export function StarIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.3l7.1-.7L12 2z" />
    </svg>
  );
}

export function CrownIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 8l4 3 5-6 5 6 4-3-1.5 10h-15L3 8z" />
      <rect x="4" y="19" width="16" height="2" rx="1" />
    </svg>
  );
}

export function LockIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1zm2 0h8V8a4 4 0 00-8 0v2z" />
    </svg>
  );
}

export function TrophyIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 3h12v4a6 6 0 01-5 5.92V15h2a1 1 0 011 1v2h1a1 1 0 011 1v1H6v-1a1 1 0 011-1h1v-2a1 1 0 011-1h2v-2.08A6 6 0 016 7V3z" />
      <path d="M4 4h2v4a4 4 0 01-2-3.5V4zM18 4h2v.5A4 4 0 0118 8V4z" />
    </svg>
  );
}

export function MedalIcon({ size = 22, className, rank }: IconProps & { rank: number }) {
  const color = rank === 1 ? "#FFC800" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : "#AFAFAF";
  return (
    <div
      className={`rounded-full flex items-center justify-center font-black text-white ${className ?? ""}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.5 }}
    >
      {rank}
    </div>
  );
}
