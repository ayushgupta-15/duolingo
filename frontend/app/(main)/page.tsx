"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, PathResponse, SkillNode as SkillNodeType } from "@/lib/api";
import { useUser } from "@/lib/UserContext";
import SkillNode from "@/components/SkillNode";
import RightRail from "@/components/RightRail";
import PathConnector from "@/components/PathConnector";
import { TrophyIcon } from "@/components/icons";

// A tight 3-node zigzag so the path visibly snakes left-right-left even
// within a short unit, instead of a slow sine wave that only bends over
// many nodes.
const OFFSET_PATTERN = [0, 85, -85];
const ROW_HEIGHT = 150;
const CONTAINER_WIDTH = 300;
const CENTER_X = CONTAINER_WIDTH / 2;
const CIRCLE_RADIUS = 40;

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
    <div className="flex justify-center max-w-5xl mx-auto">
      <div className="max-w-xl w-full px-4 py-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-black text-[var(--duo-gray-dark)]">{path.course_title}</h1>
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
              <GuidebookButton />
            </div>

            <div
              className="relative mx-auto"
              style={{ width: CONTAINER_WIDTH, height: unit.skills.length * ROW_HEIGHT }}
            >
              <PathConnector
                offsets={unit.skills.map((_, i) => OFFSET_PATTERN[(globalIndex + i) % OFFSET_PATTERN.length])}
                rowHeight={ROW_HEIGHT}
                centerX={CENTER_X}
                circleRadius={CIRCLE_RADIUS}
                color={unit.color}
              />
              {unit.skills.map((skill, i) => {
                const offset = OFFSET_PATTERN[globalIndex % OFFSET_PATTERN.length];
                const delayIndex = globalIndex;
                globalIndex += 1;
                return (
                  <div
                    key={skill.id}
                    className="absolute left-1/2"
                    style={{ top: i * ROW_HEIGHT, transform: "translateX(-50%)", zIndex: 1 }}
                  >
                    <SkillNode
                      skill={skill}
                      unitColor={unit.color}
                      offset={offset}
                      delayIndex={delayIndex}
                      isCurrent={skill.id === currentSkillId}
                      onClick={() => {
                        if (skill.status !== "locked") router.push(`/lesson/${skill.id}`);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <FinishNode />
      </div>
      <RightRail user={user} />
    </div>
  );
}

function FinishNode() {
  return (
    <div className="flex flex-col items-center gap-2 pb-4">
      <div className="w-20 h-20 rounded-full bg-[var(--duo-bg-soft)] border-2 border-dashed border-[var(--duo-gray)] flex items-center justify-center opacity-60">
        <TrophyIcon size={32} className="text-[var(--duo-gray)]" />
      </div>
      <div className="text-xs font-bold text-[var(--duo-gray)] text-center">More units coming soon</div>
    </div>
  );
}

function GuidebookButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setShowTooltip((v) => !v)}
        onBlur={() => setShowTooltip(false)}
        className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl shrink-0"
        title="Guidebook"
      >
        📖
      </button>
      {showTooltip && (
        <div className="duo-pop absolute right-0 top-12 bg-white text-[var(--duo-gray-dark)] text-xs font-bold px-3 py-2 rounded-xl shadow-lg border-2 border-[var(--duo-border)] whitespace-nowrap z-10">
          Unit guidebook — Coming Soon
        </div>
      )}
    </div>
  );
}

function findCurrentSkill(skills: SkillNodeType[]): number | null {
  const inProgress = skills.find((s) => s.status === "in_progress");
  if (inProgress) return inProgress.id;
  const nextAvailable = skills.find((s) => s.status === "available");
  return nextAvailable ? nextAvailable.id : null;
}
