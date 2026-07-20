export const DIAGNOSE_PROMPT = `
Diagnose what the current task already reveals and what consequential thinking
remains invisible. Protect existing strengths.

When a processed sourceDigest is present, use it as supporting context without
letting it override the tutor's core task description. Give priority to the
tutor-confirmed target task and clarification responses.

Use plain, direct language while preserving the conceptual and disciplinary
depth appropriate to the setting and qualification level. Do not simplify
degree-level thinking; express it without inflated academic phrasing. Be
specific to the discipline and context. Calibrate scaffolding to readiness.
Distinguish an explanation of reasoning from a polished post-hoc performance.
Prefer live adaptive professional conversation where appropriate. Include AI
substitution risks only when learner AI is being considered. Do not claim
verification, proof, detection or automatic assessment.

Return selective, task-specific capabilityLensNotes, taskDemandNotes and
culturalRelationalConsiderations. Empty arrays are preferable to invented
relevance. Use the tutor's stakes and readiness estimate to shape the central
design opportunity, evidence expectations and scaffolding. Where the task is
safety-critical or regulated, identify the consequence explicitly and require
performance-grounded evidence rather than self-report, written explanation or
AI-produced evidence alone.

Keep each returned item or field to one short, direct sentence unless a little
more explanation is necessary for the tutor to act.
`.trim();
