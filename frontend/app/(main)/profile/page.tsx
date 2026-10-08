"use client";

import { useUser } from "@/lib/UserContext";
import { CrownIcon, FlameIcon, HeartIcon, StarIcon, TrophyIcon } from "@/components/icons";
import { ProfileSkeleton } from "@/components/Skeleton";

export default function ProfilePage() {
  const { user, loading } = useUser();

  if (loading || !user) {
    return <ProfileSkeleton />;
  }

  const achievements = [
    { icon: <FlameIcon size={32} className="text-orange-500" />, label: "7-Day Streak", earned: user.longest_streak >= 7 },
    { icon: "💯", label: "Century Club (100 XP)", earned: user.xp_total >= 100 },
    { icon: <CrownIcon size={32} className="text-[var(--duo-yellow)]" />, label: "First Crown", earned: true },
    { icon: "🎯", label: "Daily Goal Hit", earned: user.daily_xp_progress >= user.daily_goal_xp },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="duo-card p-6 flex items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-[var(--duo-bg-soft)] flex items-center justify-center text-5xl border-2 border-[var(--duo-border)]">
          {user.avatar_emoji}
        </div>
        <div>
          <h1 className="text-2xl font-black">{user.display_name}</h1>
          <p className="text-[var(--duo-gray)] font-bold text-sm">@{user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<StarIcon size={26} />} label="Total XP" value={user.xp_total} color="text-yellow-500" />
        <StatCard icon={<FlameIcon size={26} />} label="Current Streak" value={user.current_streak} color="text-orange-500" />
        <StatCard icon={<TrophyIcon size={26} />} label="Longest Streak" value={user.longest_streak} color="text-orange-500" />
        <StatCard icon={<HeartIcon size={26} />} label="Hearts" value={`${user.hearts}/${user.max_hearts}`} color="text-red-500" />
      </div>

      <h2 className="font-black text-lg mb-3">Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {achievements.map((a) => (
          <div
            key={a.label}
            className={`duo-card p-4 flex flex-col items-center text-center gap-2 ${a.earned ? "" : "opacity-40 grayscale"}`}
          >
            <span className="text-4xl flex items-center justify-center h-9">{a.icon}</span>
            <span className="text-xs font-bold">{a.label}</span>
          </div>
        ))}
      </div>

      <h2 className="font-black text-lg mt-6 mb-3">Settings</h2>
      <div className="duo-card p-5 text-[var(--duo-gray)] font-bold text-sm">
        Account settings, notifications, and subscription management — Coming Soon.
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="duo-card p-4 flex flex-col items-center text-center gap-1">
      <span className={color}>{icon}</span>
      <span className="font-black text-lg">{value}</span>
      <span className="text-xs text-[var(--duo-gray)] font-bold">{label}</span>
    </div>
  );
}
