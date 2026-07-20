export const MOMENTS_PROMPT = `
Design one coherent, proportionate evidence pattern containing exactly three to
five consequential visible-thinking moments. Embed moments in the existing
activity where possible; do not create extra learner artefacts merely to fill
the structure. Explain briefly why the moments work together across the task
journey.

Use plain, direct language while preserving the conceptual and disciplinary
depth appropriate to the task. Keep every generated field to one short sentence
unless a little more explanation is needed for implementation.

For each moment:
- Use one to three selective Conditions; do not force all five.
- Identify one to three relevant evidence purposes and modes. Do not require
  every purpose or mode in the plan.
- Use an ordered journeyPhase that matches the displayed chronology.
- Separate the tutor's permissible prompt or cue from the judgement, action or
  explanation that must remain the learner's responsibility.
- Distinguish feedback from feedback uptake: state what the learner
  subsequently changes, confirms or applies.
- Prefer observe-and-use retention. Use a brief note or formal record only
  where the task, stakes or regulation justify it.
- Give approximate workload: use a small time range, "embedded in existing
  activity" or effectively no additional time where appropriate; state
  frequency, recording burden, and whether the moment is embedded, replaces
  existing activity or adds activity. Do not imply false precision.
- Include concrete weak-or-missing evidence and one concise,
  task-specific exampleInContext without turning it into a compulsory script.

Preserve the task-level learner-AI position while choosing the appropriate
aiPosition for each moment. Different moments may legitimately use different
conditions. When considerLearnerAi is false, every moment must use
"not-relevant"; do not infer that the tutor has prohibited AI. An AI-producible
moment may remain when it legitimately supports learning, diagnosis or
feedback. Where judgement or verification matters, pair it proportionately
with tutor observation, adaptive live explanation, practical performance,
professional conversation or changed-context application.

Generate exactly one changedCondition linked to an Apply moment. Change one
meaningful and realistic condition, state what remains constant, and explain
why the variation helps reveal the intended capability. Do not introduce
multiple new demands or change the intended capability.

Use stakes, the tutor's readiness estimate and selected capability or task
demand lenses to produce materially different tutor moves and evidence. For
safety-critical work, include directly observed performance or task-result
evidence; self-report, written explanation and AI-produced evidence may
supplement but never stand alone. Apply cultural and relational intelligence
only where grounded in the task and context.

Before returning, review the proposed pattern for fragmentation, unnecessary
capture, tutor support that removes the learner judgement, capability or task
demand drift, overloaded changed conditions, and judgement or verification
that lacks complementary grounded evidence. Return only concise professional
review suggestions in integrityWarnings, with source "model". These are points
for tutor review, not failures, verified findings or assurance decisions.
Return an empty array when no suggestion is warranted.

Keep recommendations usable in post-school tertiary practice. Never score
evidence strength or automatically judge capability. Use stable short IDs
beginning with "model-". Set each moment source to "model".
`.trim();
