"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, LeaderboardEntry, UserState } from "@/lib/api";
import { MedalIcon, StarIcon, TrophyIcon } from "@/components/icons";

export default function RightRail({ user }: { user: UserState | null }) {
  const [leaders, setLeaders] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    api.getLeaderboard().then((entries) => setLeaders(entries.slice(0, 3)));
  }, []);

  if (!user) return null;

  const goalPct = Math.min(100, Math.round((user.daily_xp_progress / user.daily_goal_xp) * 100));

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:shrink-0 gap-4 px-4 py-8">
      <div className="duo-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎯</span>
          <h3 className="font-black text-sm uppercase tracking-wide text-[var(--duo-gray-dark)]">Daily Quest</h3>
        </div>
        <div className="flex items-center gap-3">
          <StarIcon size={30} className="text-[var(--duo-yellow)]" />
          <div className="flex-1">
            <div className="text-sm font-bold mb-1">
              Earn {user.daily_goal_xp} XP
            </div>
            <div className="h-3 bg-[var(--duo-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--duo-yellow)] rounded-full transition-all duration-500"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <div className="text-xs font-bold text-[var(--duo-gray)] mt-1">
              {user.daily_xp_progress} / {user.daily_goal_xp} XP
            </div>
          </div>
        </div>
      </div>

      <div className="duo-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrophyIcon size={20} className="text-[var(--duo-yellow)]" />
            <h3 className="font-black text-sm uppercase tracking-wide text-[var(--duo-gray-dark)]">Leaderboard</h3>
          </div>
        </div>
        {!leaders ? (
          <div className="text-xs text-[var(--duo-gray)] font-bold">Loading...</div>
        ) : (
          <div className="flex flex-col gap-3 mb-4">
            {leaders.map((e) => (
              <div key={e.username} className="flex items-center gap-3">
                <span className="w-5 flex justify-center">
                  {e.rank <= 3 ? (
                    <MedalIcon rank={e.rank} size={18} />
                  ) : (
                    <span className="text-sm font-black text-[var(--duo-gray)]">{e.rank}</span>
                  )}
                </span>
                <span className="text-2xl">{e.avatar_emoji}</span>
                <span className={`flex-1 text-sm font-bold ${e.is_me ? "text-[var(--duo-blue)]" : ""}`}>
                  {e.display_name}
                </span>
                <span className="text-xs font-extrabold text-[var(--duo-gray)]">{e.xp_total} XP</span>
              </div>
            ))}
          </div>
        )}
        <Link
          href="/leaderboard"
          className="duo-btn duo-btn-blue w-full py-2 text-center text-sm block"
        >
          View Leaderboard
        </Link>
      </div>
    </aside>
  );
}
