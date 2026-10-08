"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api, Exercise, LessonResponse, UserState } from "@/lib/api";
import MultipleChoiceExercise from "@/components/exercises/MultipleChoiceExercise";
import WordBankExercise from "@/components/exercises/WordBankExercise";
import MatchPairsExercise from "@/components/exercises/MatchPairsExercise";
import FillBlankExercise from "@/components/exercises/FillBlankExercise";
import TypeAnswerExercise from "@/components/exercises/TypeAnswerExercise";
import FeedbackBar from "@/components/FeedbackBar";
import OutOfHeartsModal from "@/components/modals/OutOfHeartsModal";
import LessonCompleteModal from "@/components/modals/LessonCompleteModal";
import FloatingToast from "@/components/FloatingToast";

type Feedback = { correct: boolean; correctAnswer: any };
type Toast = { id: number; text: string; color: string };

export default function LessonPageClient({ skillId }: { skillId: number }) {
  const router = useRouter();

  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [user, setUser] = useState<UserState | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<any>(null);
  const [answerReady, setAnswerReady] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [heartsLost, setHeartsLost] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const [complete, setComplete] = useState<{ xp: number; streak: number } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [heartShake, setHeartShake] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  function pushToast(text: string, color: string) {
    const id = toastId.current++;
    setToasts((t) => [...t, { id, text, color }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1000);
  }

  useEffect(() => {
    Promise.all([api.getLesson(skillId), api.getMe()]).then(([l, u]) => {
      setLesson(l);
      setUser(u);
      setHearts(u.hearts);
      if (u.hearts <= 0) setShowOutOfHearts(true);
    });
  }, [skillId]);

  if (!lesson || !user) {
    return <div className="flex items-center justify-center h-screen text-[var(--duo-gray)] font-bold">Loading lesson...</div>;
  }

  const exercise: Exercise = lesson.exercises[index];
  const progressPct = Math.round((index / lesson.exercises.length) * 100);

  function resetAnswerState() {
    setAnswer(null);
    setAnswerReady(false);
    setFeedback(null);
  }

  async function handleCheck() {
    const result = await api.checkAnswer(exercise.id, answer);
    setFeedback({ correct: result.correct, correctAnswer: result.correct_answer });
    if (result.correct) {
      setCorrectCount((c) => c + 1);
      pushToast(`+${exercise.xp_value} XP`, "var(--duo-green)");
    } else {
      setHeartsLost((h) => h + 1);
      setHearts((h) => Math.max(0, h - 1));
      setShaking(true);
      setTimeout(() => setShaking(false), 350);
      setHeartShake(true);
      setTimeout(() => setHeartShake(false), 350);
      pushToast("-1 ❤️", "var(--duo-red)");
    }
  }

  async function handleContinue() {
    if (hearts <= 0) {
      setShowOutOfHearts(true);
      return;
    }
    if (index + 1 < lesson!.exercises.length) {
      setIndex((i) => i + 1);
      resetAnswerState();
    } else {
      const res = await api.completeLesson(skillId, correctCount, lesson!.exercises.length, heartsLost);
      setComplete({ xp: res.xp_earned, streak: res.user.current_streak });
    }
  }

  function handleRefill() {
    api.refillHearts().then((u) => {
      setUser(u);
      setHearts(u.hearts);
      setShowOutOfHearts(false);
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex items-center gap-4 px-4 py-4 max-w-2xl w-full mx-auto">
        <button onClick={() => router.push("/")} className="text-2xl text-[var(--duo-gray)] font-bold">
          ✕
        </button>
        <div className="flex-1 h-4 bg-[var(--duo-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--duo-green)] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className={`relative flex items-center gap-1 font-extrabold text-[var(--duo-red)] ${heartShake ? "duo-shake" : ""}`}>
          ❤️ {hearts}
          {toasts.map((t) => (
            <FloatingToast key={t.id} id={t.id} text={t.text} color={t.color} />
          ))}
        </div>
      </div>

      <div key={index} className={`duo-pop flex-1 max-w-2xl w-full mx-auto px-4 py-6 ${shaking ? "duo-shake" : ""}`}>
        {renderExercise(exercise, !!feedback, feedback?.correctAnswer, (a, ready) => {
          setAnswer(a);
          setAnswerReady(ready);
        })}
      </div>

      {!feedback && (
        <div className="sticky bottom-0 border-t-2 border-[var(--duo-border)] bg-white">
          <div className="max-w-2xl mx-auto px-4 py-5 flex justify-end">
            <button
              onClick={handleCheck}
              disabled={!answerReady}
              className="duo-btn duo-btn-green px-10 py-3"
            >
              Check
            </button>
          </div>
        </div>
      )}

      {feedback && !showOutOfHearts && (
        <FeedbackBar correct={feedback.correct} correctAnswer={feedback.correctAnswer} onContinue={handleContinue} />
      )}

      {showOutOfHearts && (
        <OutOfHeartsModal
          minutesToNext={user.minutes_to_next_heart}
          onRefill={handleRefill}
          onQuit={() => router.push("/")}
        />
      )}

      {complete && (
        <LessonCompleteModal
          xpEarned={complete.xp}
          correctCount={correctCount}
          totalCount={lesson.exercises.length}
          newStreak={complete.streak}
          onContinue={() => router.push("/")}
        />
      )}
    </div>
  );
}

function renderExercise(
  exercise: Exercise,
  disabled: boolean,
  feedbackCorrectAnswer: any,
  onAnswerChange: (answer: any, ready: boolean) => void
) {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <MultipleChoiceExercise
          data={exercise.data}
          disabled={disabled}
          feedbackCorrectAnswer={disabled ? feedbackCorrectAnswer : null}
          onAnswerChange={onAnswerChange}
        />
      );
    case "word_bank":
      return <WordBankExercise data={exercise.data} disabled={disabled} onAnswerChange={onAnswerChange} />;
    case "match_pairs":
      return <MatchPairsExercise data={exercise.data} disabled={disabled} onAnswerChange={onAnswerChange} />;
    case "fill_blank":
      return (
        <FillBlankExercise
          data={exercise.data}
          disabled={disabled}
          feedbackCorrectAnswer={disabled ? feedbackCorrectAnswer : null}
          onAnswerChange={onAnswerChange}
        />
      );
    case "type_answer":
      return <TypeAnswerExercise data={exercise.data} disabled={disabled} onAnswerChange={onAnswerChange} />;
    default:
      return <div>Unsupported exercise type</div>;
  }
}
