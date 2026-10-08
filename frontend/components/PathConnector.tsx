"use client";

/** Draws a dotted trail through each node's center, using the exact same
 * offsets and row height the nodes are positioned with, so the line always
 * lines up with the circles regardless of how many skills a unit has. */
export default function PathConnector({
  offsets,
  rowHeight,
  centerX,
  circleRadius,
  color,
}: {
  offsets: number[];
  rowHeight: number;
  centerX: number;
  circleRadius: number;
  color: string;
}) {
  if (offsets.length < 2) return null;

  const points = offsets.map((off, i) => ({
    x: centerX + off,
    y: i * rowHeight + circleRadius,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="2 18"
        opacity={0.4}
      />
    </svg>
  );
}
