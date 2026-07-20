import { isImageFile } from "./file-intake";

export type ImageQuarterTurns = 0 | 1 | 2 | 3;

export const PREPARED_IMAGE_MAX_DIMENSION = 2048;
export const PREPARED_IMAGE_JPEG_QUALITY = 0.86;
export const PREPARED_IMAGE_MAX_BYTES = 850 * 1024;

const ENCODING_ATTEMPTS = [
  {
    maxDimension: PREPARED_IMAGE_MAX_DIMENSION,
    quality: PREPARED_IMAGE_JPEG_QUALITY,
  },
  { maxDimension: 1600, quality: 0.78 },
  { maxDimension: 1280, quality: 0.72 },
  { maxDimension: 1024, quality: 0.68 },
] as const;

export function rotateQuarterTurns(
  current: ImageQuarterTurns,
  direction: "left" | "right",
): ImageQuarterTurns {
  return ((current + (direction === "right" ? 1 : 3)) %
    4) as ImageQuarterTurns;
}

export function preparedImageDimensions(
  width: number,
  height: number,
  quarterTurns: ImageQuarterTurns,
  maxDimension = PREPARED_IMAGE_MAX_DIMENSION,
) {
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const scaledWidth = Math.max(1, Math.round(width * scale));
  const scaledHeight = Math.max(1, Math.round(height * scale));
  return quarterTurns % 2 === 0
    ? { width: scaledWidth, height: scaledHeight }
    : { width: scaledHeight, height: scaledWidth };
}

export async function prepareImageForUpload(
  original: File,
  quarterTurns: ImageQuarterTurns,
): Promise<File> {
  if (!isImageFile(original.name)) return original;

  const bitmap = await createImageBitmap(original, {
    imageOrientation: "from-image",
  });
  try {
    for (const attempt of ENCODING_ATTEMPTS) {
      const canvas = renderPreparedCanvas(
        bitmap,
        quarterTurns,
        attempt.maxDimension,
      );
      const blob = await canvasToBlob(canvas, "image/jpeg", attempt.quality);
      if (blob.size <= PREPARED_IMAGE_MAX_BYTES) {
        return new File([blob], preparedFilename(original.name), {
          type: "image/jpeg",
          lastModified: original.lastModified,
        });
      }
    }
    throw new Error("The prepared image exceeds the hosted request limit");
  } finally {
    bitmap.close();
  }
}

function renderPreparedCanvas(
  bitmap: ImageBitmap,
  quarterTurns: ImageQuarterTurns,
  maxDimension: number,
): HTMLCanvasElement {
  const dimensions = preparedImageDimensions(
    bitmap.width,
    bitmap.height,
    quarterTurns,
    maxDimension,
  );
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image canvas unavailable");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const sourceScale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height),
  );
  const drawWidth = Math.max(1, Math.round(bitmap.width * sourceScale));
  const drawHeight = Math.max(1, Math.round(bitmap.height * sourceScale));

  if (quarterTurns === 1) {
    context.translate(canvas.width, 0);
    context.rotate(Math.PI / 2);
  } else if (quarterTurns === 2) {
    context.translate(canvas.width, canvas.height);
    context.rotate(Math.PI);
  } else if (quarterTurns === 3) {
    context.translate(0, canvas.height);
    context.rotate(-Math.PI / 2);
  }
  context.drawImage(bitmap, 0, 0, drawWidth, drawHeight);
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("The image could not be prepared")),
      type,
      quality,
    );
  });
}

function preparedFilename(filename: string): string {
  if (/\.jpe?g$/i.test(filename)) return filename;
  return `${filename.replace(/\.[^.]+$/, "")}.jpg`;
}
