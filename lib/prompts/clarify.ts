export const CLARIFY_PROMPT = `
Reflect back a concise understanding of the task, then ask zero to three
questions only where an answer could materially change the design.

Do not repeat information already supplied. Do not request personal or
identifying information. Questions must be concise, distinct and answerable by
the tutor. Return an empty questions array when the task is already sufficiently
specified.
`.trim();
