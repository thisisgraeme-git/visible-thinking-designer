import { MomentsScreen } from "@/components/moments-screen";

export default async function MomentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <MomentsScreen projectId={projectId} />;
}
