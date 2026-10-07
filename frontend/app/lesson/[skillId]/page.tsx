import LessonPageClient from "@/components/LessonPageClient";

// This route is inherently dynamic: all content and progress come from a
// live backend call, so there is no useful static shell to validate.
export const instant = false;

export default async function LessonRoute({
  params,
}: {
  params: Promise<{ skillId: string }>;
}) {
  const { skillId } = await params;
  return <LessonPageClient skillId={Number(skillId)} />;
}
