import {
  prepareImageForUpload,
  type ImageQuarterTurns,
} from "./image-preparation";

interface SessionAttachment {
  original: File;
  prepared?: File;
  quarterTurns: ImageQuarterTurns;
}

const sessionAttachments = new Map<string, SessionAttachment>();

export function setSessionAttachment(projectId: string, file: File) {
  sessionAttachments.set(projectId, {
    original: file,
    quarterTurns: 0,
  });
}

export function getSessionAttachment(projectId: string): File | undefined {
  return sessionAttachments.get(projectId)?.original;
}

export function getSessionAttachmentRotation(
  projectId: string,
): ImageQuarterTurns {
  return sessionAttachments.get(projectId)?.quarterTurns ?? 0;
}

export async function getPreparedSessionAttachment(
  projectId: string,
): Promise<File | undefined> {
  const attachment = sessionAttachments.get(projectId);
  if (!attachment) return undefined;
  if (attachment.prepared) return attachment.prepared;
  attachment.prepared = await prepareImageForUpload(
    attachment.original,
    attachment.quarterTurns,
  );
  return attachment.prepared;
}

export async function setSessionAttachmentRotation(
  projectId: string,
  quarterTurns: ImageQuarterTurns,
): Promise<File | undefined> {
  const attachment = sessionAttachments.get(projectId);
  if (!attachment) return undefined;
  attachment.quarterTurns = quarterTurns;
  attachment.prepared = undefined;
  return getPreparedSessionAttachment(projectId);
}

export function removeSessionAttachment(projectId: string) {
  sessionAttachments.delete(projectId);
}
