"use client";

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-[var(--duo-border)] ${className ?? ""}`} />;
}

export function PathSkeleton() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <SkeletonBlock className="h-8 w-40" />
      </div>
      <SkeletonBlock className="h-20 w-full mb-8" />
      <div className="flex flex-col items-center gap-10">
        <SkeletonBlock className="h-20 w-20 rounded-full" />
        <SkeletonBlock className="h-20 w-20 rounded-full" />
        <SkeletonBlock className="h-20 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--duo-bg)] px-4 py-6 max-w-2xl mx-auto w-full">
      <SkeletonBlock className="h-4 w-full mb-10" />
      <SkeletonBlock className="h-7 w-3/4 mb-8" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-5 mb-6">
        <SkeletonBlock className="h-20 w-20 rounded-full" />
        <SkeletonBlock className="h-8 w-40" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
