import { Suspense } from "react";
import { TaskScreen } from "@/components/task-screen";

export default function NewDesignPage() {
  return (
    <Suspense fallback={<div className="page-loading">Opening workbench…</div>}>
      <TaskScreen />
    </Suspense>
  );
}
