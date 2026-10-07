"use client";

import { useEffect, useState } from "react";
import { api, LeaderboardEntry } from "@/lib/api";

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    api.getLeaderboard().then(setEntries);
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black">🏆 Leaderboard</h1>
        <p className="text-[var(--duo-gray)] font-bold text-sm mt-1">This week's top learners</p>
      </div>

      {!entries ? (
        <p className="text-center text-[var(--duo-gray)] font-bold">Loading...</p>
      ) : (
        <div className="duo-card divide-y-2 divide-[var(--duo-border)]">
          {entries.map((e) => (
            <div
              key={e.username}
              className={`flex items-center gap-4 px-5 py-4 ${e.is_me ? "bg-blue-50" : ""}`}
            >
              <span className="w-8 text-center font-black text-lg">{MEDALS[e.rank] ?? e.rank}</span>
              <span className="text-3xl">{e.avatar_emoji}</span>
              <span className={`flex-1 font-bold ${e.is_me ? "text-[var(--duo-blue)]" : ""}`}>
                {e.display_name} {e.is_me && <span className="text-xs">(you)</span>}
              </span>
              <span className="font-extrabold text-[var(--duo-gray-dark)]">{e.xp_total} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
