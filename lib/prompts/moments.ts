export const MOMENTS_PROMPT = `
Propose exactly three to five consequential visible-thinking moments embedded
in the existing activity where possible.

Use one to three selective Conditions per moment; do not force all five across
the plan. Every moment must include a feedback loop, workload fit and concrete
weak-or-missing evidence. Every moment must also include one concise,
task-specific exampleInContext that demonstrates the proposed interaction
without becoming a script the tutor must follow. Respect the tutor's learner-AI position. When
considerLearnerAi is false, every moment must use "not-relevant"; do not infer
that the tutor has prohibited AI. Keep the recommendations usable in
post-school tertiary practice and do not turn the plan into a rubric that
automatically judges capability.

Use stakes, the tutor's readiness estimate and selected capability or task
demand lenses to produce materially different tutor moves and evidence. For
safety-critical work, include directly observed performance or task-result
evidence; self-report, written explanation and AI-produced evidence may
supplement but never stand alone. Apply cultural and relational intelligence
only where grounded in the task and context.

Use stable short IDs beginning with "model-". Set source to "model".
`.trim();
