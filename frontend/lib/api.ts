const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

export interface UserState {
  id: number;
  username: string;
  display_name: string;
  avatar_emoji: string;
  xp_total: number;
  gems: number;
  daily_goal_xp: number;
  daily_xp_progress: number;
  hearts: number;
  max_hearts: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  minutes_to_next_heart: number | null;
}

export interface SkillNode {
  id: number;
  title: string;
  icon: string;
  order_index: number;
  total_levels: number;
  crowns: number;
  status: "locked" | "available" | "in_progress" | "completed";
}

export interface UnitNode {
  id: number;
  title: string;
  description: string;
  color: string;
  order_index: number;
  skills: SkillNode[];
}

export interface PathResponse {
  course_title: string;
  units: UnitNode[];
}

export interface Exercise {
  id: number;
  type: "multiple_choice" | "word_bank" | "match_pairs" | "fill_blank" | "type_answer";
  prompt: string;
  data: any;
  xp_value: number;
}

export interface LessonResponse {
  skill_id: number;
  skill_title: string;
  level: number;
  exercises: Exercise[];
}

export interface AnswerCheckResponse {
  correct: boolean;
  correct_answer: any;
}

export interface LessonCompleteResponse {
  xp_earned: number;
  user: UserState;
  skill: SkillNode;
  leveled_up: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  display_name: string;
  avatar_emoji: string;
  xp_total: number;
  is_me: boolean;
}

export const api = {
  getMe: () => request<UserState>("/api/user/me"),
  refillHearts: () => request<UserState>("/api/user/hearts/refill", { method: "POST" }),
  getPath: () => request<PathResponse>("/api/path"),
  getLesson: (skillId: number) => request<LessonResponse>(`/api/skills/${skillId}/lesson`),
  checkAnswer: (exerciseId: number, answer: any) =>
    request<AnswerCheckResponse>(`/api/exercises/${exerciseId}/check`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    }),
  completeLesson: (skillId: number, correctCount: number, totalCount: number, heartsLost: number) =>
    request<LessonCompleteResponse>("/api/lessons/complete", {
      method: "POST",
      body: JSON.stringify({
        skill_id: skillId,
        correct_count: correctCount,
        total_count: totalCount,
        hearts_lost: heartsLost,
      }),
    }),
  getLeaderboard: () => request<LeaderboardEntry[]>("/api/leaderboard"),
};
