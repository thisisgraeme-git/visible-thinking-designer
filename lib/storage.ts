import type { ProjectSource, VisibleThinkingProject } from "./types";
import { blankProject, projectFromFixture } from "./fixtures";

export const STORAGE_KEY = "visible-thinking-designer:projects:v0.1";

const isBrowser = () => typeof window !== "undefined";

export function listProjects(): VisibleThinkingProject[] {
  if (!isBrowser()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is VisibleThinkingProject =>
        item?.schemaVersion === "0.1" && typeof item?.id === "string",
    );
  } catch {
    return [];
  }
}

export function loadProject(id: string): VisibleThinkingProject | undefined {
  return listProjects().find((project) => project.id === id);
}

export function saveProject(
  project: VisibleThinkingProject,
): VisibleThinkingProject {
  const updated = { ...project, updatedAt: new Date().toISOString() };
  const projects = listProjects();
  const index = projects.findIndex((item) => item.id === project.id);
  if (index >= 0) projects[index] = updated;
  else projects.unshift(updated);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return updated;
}

export function createProject(source: ProjectSource): VisibleThinkingProject {
  const project =
    source === "blank" ? blankProject() : projectFromFixture(source);
  return saveProject(project);
}

export function duplicateProject(
  project: VisibleThinkingProject,
): VisibleThinkingProject {
  const now = new Date().toISOString();
  return saveProject({
    ...structuredClone(project),
    id: crypto.randomUUID(),
    status: "draft",
    createdAt: now,
    updatedAt: now,
    task: {
      ...project.task,
      title: `${project.task.title} — copy`,
    },
  });
}
