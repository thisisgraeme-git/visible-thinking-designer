export const MOMENTS_PROMPT = `
Propose exactly three to five consequential visible-thinking moments embedded
in the existing activity where possible.

Use one to three selective Conditions per moment; do not force all five across
the plan. Every moment must include a feedback loop, workload fit and concrete
weak-or-missing evidence. Respect the tutor's learner-AI position. When
considerLearnerAi is false, every moment must use "not-relevant"; do not infer
that the tutor has prohibited AI. Keep the recommendations usable in
post-school tertiary practice and do not turn the plan into a rubric that
automatically judges capability.

Use stable short IDs beginning with "model-". Set source to "model".
`.trim();
