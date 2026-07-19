import { PlanScreen } from "@/components/plan-screen";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <PlanScreen projectId={projectId} />;
}
