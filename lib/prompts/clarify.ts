export const CLARIFY_PROMPT = `
Write taskSummary as a plain, task-specific summary of approximately 40–60
words. Preserve the capability and cognitive demand, but do not copy the source
text or use inflated academic language. Then ask zero to three questions only
where an answer could materially change the design.

Do not repeat information already supplied. Do not request personal or
identifying information. Questions must be concise, distinct and answerable by
the tutor. Return an empty questions array when the task is already sufficiently
specified.

When the input resembles a template, reference material, several activities or
an incomplete task, prioritise this exact question: “Which specific learner task
do you want to redesign?” Do not try to redesign the whole pasted source.

When the tutor selects “Help me identify this”, is unsure about stakes or
readiness, or leaves a consequential lens absent, use a question to suggest a
small number of plausible capability dimensions or underpinning demands. Make
the suggestion task-specific and optional. Prioritise safety-critical or
regulated constraints. Explore cultural and relational considerations only
where the supplied task and context give them practical relevance.

Use one short sentence for each question and whyItMatters unless a second
sentence is essential.
`.trim();
