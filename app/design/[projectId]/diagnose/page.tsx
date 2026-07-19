import { DiagnoseScreen } from "@/components/diagnose-screen";

export default async function DiagnosePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <DiagnoseScreen projectId={projectId} />;
}
