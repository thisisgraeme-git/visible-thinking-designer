import type { SourceAttachment } from "./types";

export const FILE_UPLOAD_MAX_BYTES = 8 * 1024 * 1024;
export const FILE_UPLOAD_MAX_LABEL = "8 MB";
export const DOCUMENT_UPLOAD_MAX_BYTES = 900 * 1024;
export const DOCUMENT_UPLOAD_MAX_LABEL = "900 KB";
export const FILE_ACCEPT =
  ".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png";

const FILE_TYPES = {
  pdf: { label: "PDF", mimeType: "application/pdf" },
  doc: { label: "DOC", mimeType: "application/msword" },
  docx: {
    label: "DOCX",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  jpg: { label: "JPG", mimeType: "image/jpeg" },
  jpeg: { label: "JPEG", mimeType: "image/jpeg" },
  png: { label: "PNG", mimeType: "image/png" },
} as const;

export type SupportedFileExtension = keyof typeof FILE_TYPES;

export interface FileValidationError {
  code:
    | "unsupported_file"
    | "file_too_large"
    | "empty_file"
    | "corrupt_file";
  message: string;
}

export function getSupportedFileExtension(
  filename: string,
): SupportedFileExtension | undefined {
  const extension = filename.split(".").at(-1)?.toLowerCase();
  return extension && extension in FILE_TYPES
    ? (extension as SupportedFileExtension)
    : undefined;
}

export function validateFileMetadata(file: {
  name: string;
  size: number;
}): FileValidationError | null {
  if (!getSupportedFileExtension(file.name)) {
    return {
      code: "unsupported_file",
      message:
        "Choose one PDF, DOC, DOCX, JPG, JPEG or PNG file. Your entered task details are unchanged.",
    };
  }
  if (file.size === 0) {
    return {
      code: "empty_file",
      message:
        "This file is empty. Replace it with a readable copy; your entered task details are unchanged.",
    };
  }
  const extension = getSupportedFileExtension(file.name);
  const isImage = ["jpg", "jpeg", "png"].includes(extension ?? "");
  const maximum = isImage
    ? FILE_UPLOAD_MAX_BYTES
    : DOCUMENT_UPLOAD_MAX_BYTES;
  const maximumLabel = isImage
    ? FILE_UPLOAD_MAX_LABEL
    : DOCUMENT_UPLOAD_MAX_LABEL;
  if (file.size > maximum) {
    return {
      code: "file_too_large",
      message: `This file is larger than ${maximumLabel}. Choose a smaller copy; your entered task details are unchanged.`,
    };
  }
  return null;
}

export function attachmentMetadata(file: {
  name: string;
  size: number;
  type?: string;
}): SourceAttachment {
  const extension = getSupportedFileExtension(file.name);
  if (!extension) throw new Error("Unsupported file");
  const config = FILE_TYPES[extension];
  return {
    filename: file.name,
    fileType: config.label,
    mimeType: config.mimeType,
    size: file.size,
    processed: false,
  };
}

export function validateFileBytes(
  filename: string,
  bytes: Uint8Array,
): FileValidationError | null {
  const metadataError = validateFileMetadata({
    name: filename,
    size: bytes.byteLength,
  });
  if (metadataError) return metadataError;

  const extension = getSupportedFileExtension(filename)!;
  const matches =
    extension === "pdf"
      ? startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]) &&
        includesAscii(bytes.slice(-2048), "%%EOF")
      : extension === "doc"
        ? startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
        : extension === "docx"
          ? startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) &&
            includesAscii(bytes, "[Content_Types].xml") &&
            includesAscii(bytes, "word/")
          : extension === "png"
            ? startsWith(bytes, [
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
              ]) && includesAscii(bytes.slice(-64), "IEND")
            : startsWith(bytes, [0xff, 0xd8, 0xff]) &&
              bytes.at(-2) === 0xff &&
              bytes.at(-1) === 0xd9;

  return matches
    ? null
    : {
        code: "corrupt_file",
        message:
          "This file appears corrupt or does not match its filename. Replace it with a readable copy; your entered task details are unchanged.",
      };
}

export function fileMimeType(filename: string): string {
  const extension = getSupportedFileExtension(filename);
  if (!extension) return "application/octet-stream";
  return FILE_TYPES[extension].mimeType;
}

export function isImageFile(filename: string): boolean {
  return ["jpg", "jpeg", "png"].includes(
    getSupportedFileExtension(filename) ?? "",
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((value, index) => bytes[index] === value);
}

function includesAscii(bytes: Uint8Array, search: string): boolean {
  const needle = new TextEncoder().encode(search);
  outer: for (let index = 0; index <= bytes.length - needle.length; index++) {
    for (let offset = 0; offset < needle.length; offset++) {
      if (bytes[index + offset] !== needle[offset]) continue outer;
    }
    return true;
  }
  return false;
}
