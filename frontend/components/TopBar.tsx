"use client";

import { useState } from "react";
import { useUser } from "@/lib/UserContext";
import { useCountUp } from "@/lib/useCountUp";
import CourseSelector from "@/components/CourseSelector";

export default function TopBar({ courseFlag = "🇪🇸" }: { courseFlag?: string }) {
  const { user } = useUser();
  const xp = useCountUp(user?.xp_total ?? 0);
  const gems = useCountUp(user?.gems ?? 0);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-b-2 border-[var(--duo-border)] bg-white sticky top-0 z-20">
      <button
        onClick={() => setPickerOpen(true)}
        className="flex items-center gap-1 text-2xl select-none hover:bg-[var(--duo-bg-soft)] rounded-xl px-2 py-1"
        title="Choose a course"
      >
        {courseFlag}
        <span className="text-xs text-[var(--duo-gray)]">▾</span>
      </button>
      {pickerOpen && <CourseSelector onClose={() => setPickerOpen(false)} />}
      <div className="flex items-center gap-4 sm:gap-6">
        <Stat icon="🔥" iconClassName="duo-flame-pulse" value={user?.current_streak ?? 0} color="text-orange-500" />
        <Stat icon="💎" value={gems} color="text-blue-400" />
        <Stat icon="❤️" value={user ? `${user.hearts}/${user.max_hearts}` : "–"} color="text-red-500" />
        <Stat icon="⭐" value={xp} color="text-yellow-500" />
      </div>
    </div>
  );
}

function Stat({
  icon,
  iconClassName,
  value,
  color,
}: {
  icon: string;
  iconClassName?: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-1 font-extrabold text-sm sm:text-base ${color}`}>
      <span className={`text-lg sm:text-xl ${iconClassName ?? ""}`}>{icon}</span>
      <span className="text-[var(--duo-gray-dark)] duo-count-up">{value}</span>
    </div>
  );
}
