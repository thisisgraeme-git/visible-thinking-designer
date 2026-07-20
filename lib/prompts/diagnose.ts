export const DIAGNOSE_PROMPT = `
Diagnose what the current task already reveals and what consequential thinking
remains invisible. Protect existing strengths.

Be specific to the discipline and context. Calibrate scaffolding to readiness.
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
`.trim();
