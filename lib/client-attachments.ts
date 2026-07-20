const sessionAttachments = new Map<string, File>();

export function setSessionAttachment(projectId: string, file: File) {
  sessionAttachments.set(projectId, file);
}

export function getSessionAttachment(projectId: string): File | undefined {
  return sessionAttachments.get(projectId);
}

export function removeSessionAttachment(projectId: string) {
  sessionAttachments.delete(projectId);
}
