"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, PathResponse, SkillNode as SkillNodeType } from "@/lib/api";
import { useUser } from "@/lib/UserContext";
import SkillNode from "@/components/SkillNode";

const OFFSET_PATTERN = [0, 70, 100, 70, 0, -70, -100, -70];

export default function HomePage() {
  const router = useRouter();
  const { user, refresh } = useUser();
  const [path, setPath] = useState<PathResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
    api.getPath().then((p) => {
      setPath(p);
      setLoading(false);
    });
  }, []);

  if (loading || !path) {
    return <div className="flex items-center justify-center h-full py-24 text-[var(--duo-gray)] font-bold">Loading your path...</div>;
  }

  const allSkills: SkillNodeType[] = path.units.flatMap((u) => u.skills);
  const currentSkillId = findCurrentSkill(allSkills);

  let globalIndex = 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-black text-[var(--duo-gray-dark)]">{path.course_title}</h1>
        {user && (
          <p className="text-sm text-[var(--duo-gray)] font-bold mt-1">
            Daily goal: {user.daily_xp_progress}/{user.daily_goal_xp} XP
          </p>
        )}
      </div>

      {path.units.map((unit) => (
        <div key={unit.id} className="mb-10">
          <div
            className="rounded-2xl px-5 py-4 mb-8 text-white shadow-sm flex items-center justify-between"
            style={{ background: unit.color }}
          >
            <div>
              <div className="font-black text-lg">{unit.title}</div>
              <div className="text-sm opacity-90 font-semibold">{unit.description}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-10">
            {unit.skills.map((skill) => {
              const offset = OFFSET_PATTERN[globalIndex % OFFSET_PATTERN.length];
              const delayIndex = globalIndex;
              globalIndex += 1;
              return (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  unitColor={unit.color}
                  offset={offset}
                  delayIndex={delayIndex}
                  isCurrent={skill.id === currentSkillId}
                  onClick={() => {
                    if (skill.status !== "locked") router.push(`/lesson/${skill.id}`);
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function findCurrentSkill(skills: SkillNodeType[]): number | null {
  const inProgress = skills.find((s) => s.status === "in_progress");
  if (inProgress) return inProgress.id;
  const nextAvailable = skills.find((s) => s.status === "available");
  return nextAvailable ? nextAvailable.id : null;
}
