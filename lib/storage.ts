import type {
  EvidenceMode,
  JourneyPhase,
  ProjectSource,
  VisibleThinkingMoment,
  VisibleThinkingProject,
} from "./types";
import { blankProject, projectFromFixture } from "./fixtures";

export const STORAGE_KEY = "visible-thinking-designer:projects:v0.1";

const isBrowser = () => typeof window !== "undefined";

export function listProjects(): VisibleThinkingProject[] {
  if (!isBrowser()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
      (item): item is VisibleThinkingProject =>
        item?.schemaVersion === "0.1" && typeof item?.id === "string",
      )
      .map(normaliseProject);
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
  const updated = normaliseProject({
    ...project,
    updatedAt: new Date().toISOString(),
  });
  const projects = listProjects();
  const index = projects.findIndex((item) => item.id === project.id);
  if (index >= 0) projects[index] = updated;
  else projects.unshift(updated);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return updated;
}

function normaliseProject(
  project: VisibleThinkingProject,
): VisibleThinkingProject {
  const moments = (project.moments ?? []).map((moment, index, all) =>
    normaliseMoment(moment, index, all.length, project.task),
  );
  return {
    ...project,
    clarification: {
      ...(project.clarification ?? {}),
      questions: project.clarification?.questions ?? [],
      completed: project.clarification?.completed ?? false,
    },
    moments,
    plan: {
      ...project.plan,
      implementationNotes: project.plan?.implementationNotes ?? [],
      cautions: project.plan?.cautions ?? [],
      integrityWarnings: (project.plan?.integrityWarnings ?? []).filter(
        (item) =>
          item?.source === "model" || item?.source === "structural",
      ),
    },
  };
}

function normaliseMoment(
  moment: VisibleThinkingMoment,
  index: number,
  total: number,
  task: VisibleThinkingProject["task"],
): VisibleThinkingMoment {
  const legacy = moment as Partial<VisibleThinkingMoment>;
  const journeyPhase =
    legacy.journeyPhase ??
    inferJourneyPhase(legacy.conditions ?? [], index, total);
  const evidenceModes =
    legacy.evidenceModes && legacy.evidenceModes.length > 0
      ? legacy.evidenceModes
      : inferEvidenceModes(legacy);
  const workloadFit = legacy.workloadFit ?? "";

  return {
    ...moment,
    journeyPhase,
    evidencePurposes:
      legacy.evidencePurposes && legacy.evidencePurposes.length > 0
        ? legacy.evidencePurposes
        : ["learning"],
    evidenceModes,
    supportBoundary: legacy.supportBoundary ?? {
      tutorMay:
        legacy.tutorMove ||
        "The tutor may ask a concise question without supplying the decision.",
      learnerResponsibility:
        legacy.learnerAction ||
        "The learner remains responsible for the consequential action and judgement.",
    },
    feedbackUptake:
      legacy.feedbackUptake ||
      legacy.feedbackLoop ||
      "Review what the learner changes, confirms or applies next.",
    retention: legacy.retention ?? {
      level: "observe-and-use",
      note: "Use the evidence in the moment; review whether any record is needed.",
    },
    workload: legacy.workload ?? {
      estimatedTime: inferLegacyTime(workloadFit),
      frequency: "At the selected point in the task",
      recordingBurden: "No additional record unless the tutor requires one",
      activityRelationship: /replace/i.test(workloadFit)
        ? "replaces"
        : /add|extra|additional/i.test(workloadFit)
          ? "adds"
          : "embedded",
    },
    aiPosition: task.considerLearnerAi
      ? legacy.aiPosition ?? task.defaultAiPosition
      : "not-relevant",
  };
}

function inferJourneyPhase(
  conditions: VisibleThinkingMoment["conditions"],
  index: number,
  total: number,
): JourneyPhase {
  if (conditions.includes("apply")) return "changed-context";
  if (index === 0) return "before-task";
  if (index === total - 1) return "after-feedback";
  return "during-task";
}

function inferEvidenceModes(
  moment: Partial<VisibleThinkingMoment>,
): EvidenceMode[] {
  const text = `${moment.learnerAction ?? ""} ${moment.tutorMove ?? ""} ${
    moment.visibleEvidence ?? ""
  }`;
  if (/\bperform|demonstrat|equipment|product|physical\b/i.test(text)) {
    return ["practical-performance", "tutor-observation"];
  }
  if (/\bconversation|client|role-play|spoken|discuss\b/i.test(text)) {
    return ["professional-conversation"];
  }
  if (/\bexplain|question|justify|name the reason\b/i.test(text)) {
    return ["live-explanation"];
  }
  return ["produced-artefact"];
}

function inferLegacyTime(workloadFit: string): string {
  const time = workloadFit.match(
    /\b(?:about\s+)?\d+(?:\s*[–-]\s*\d+)?\s*(?:seconds?|minutes?|hours?)\b/i,
  );
  if (time) return time[0];
  if (/integrated|embedded|replaces/i.test(workloadFit)) {
    return "Embedded; effectively no additional time";
  }
  return "Approximate time not yet specified";
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
