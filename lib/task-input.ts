export const TASK_DESCRIPTION_MAX = 4000;

export function getTaskDescriptionLimitMessage(
  description: string,
): string | undefined {
  const excess = description.length - TASK_DESCRIPTION_MAX;
  if (excess <= 0) return undefined;
  return `This task description is ${excess.toLocaleString("en-NZ")} character${
    excess === 1 ? "" : "s"
  } over the ${TASK_DESCRIPTION_MAX.toLocaleString(
    "en-NZ",
  )}-character limit. Shorten it before continuing; none of your text has been removed.`;
}
