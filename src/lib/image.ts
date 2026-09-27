export interface PreparedWindowImage {
  src: string;
  width: number;
  height: number;
}

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_UPLOAD_BYTES = 30 * 1024 * 1024;
const TARGET_DATA_URL_LENGTH = 1_500_000;

export function validateWindowFile(file: File): string | null {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return "Choose a JPG, PNG, or WEBP image.";
  }
  if (file.size === 0) return "This image is empty. Choose another photo.";
  if (file.size > MAX_UPLOAD_BYTES) {
    return "This image is over 30 MB. Choose a smaller photo.";
  }
  return null;
}

async function loadImageElement(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Resize and orient the user's photo locally; no upload or network call occurs. */
export async function prepareWindowImage(file: File): Promise<PreparedWindowImage> {
  const error = validateWindowFile(file);
  if (error) throw new Error(error);

  let source: ImageBitmap | HTMLImageElement;
  let bitmap: ImageBitmap | null = null;
  try {
    if (typeof createImageBitmap === "function") {
      // `from-image` applies camera EXIF orientation before drawing to canvas.
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      source = bitmap;
    } else {
      source = await loadImageElement(file);
    }
  } catch {
    // Some browsers cannot decode a given image through createImageBitmap.
    try {
      source = await loadImageElement(file);
    } catch {
      throw new Error("We couldn't read this image. Try another JPG, PNG, or WEBP photo.");
    }
  }

  try {
    const originalWidth = source.width;
    const originalHeight = source.height;
    if (!originalWidth || !originalHeight) {
      throw new Error("We couldn't read this image. Try another photo.");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Your browser could not prepare this image.");

    let maxEdge = 1600;
    let src = "";
    let width = 0;
    let height = 0;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const scale = Math.min(1, maxEdge / Math.max(originalWidth, originalHeight));
      width = Math.max(1, Math.round(originalWidth * scale));
      height = Math.max(1, Math.round(originalHeight * scale));
      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#f7f7f2";
      context.fillRect(0, 0, width, height);
      context.drawImage(source, 0, 0, width, height);

      src = canvas.toDataURL("image/webp", 0.8 - attempt * 0.1);
      if (!src.startsWith("data:image/webp")) {
        src = canvas.toDataURL("image/jpeg", 0.8 - attempt * 0.1);
      }
      if (src.length <= TARGET_DATA_URL_LENGTH) break;
      maxEdge = Math.round(maxEdge * 0.77);
    }
    return { src, width, height };
  } finally {
    bitmap?.close();
  }
}
