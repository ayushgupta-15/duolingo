"use client";

export default function FloatingToast({
  id,
  text,
  color,
}: {
  id: number;
  text: string;
  color: string;
}) {
  return (
    <span
      key={id}
      className="duo-float-up absolute left-1/2 -translate-x-1/2 font-black text-lg whitespace-nowrap"
      style={{ color }}
    >
      {text}
    </span>
  );
}
