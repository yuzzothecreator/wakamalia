import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { nanoid } from "nanoid"

const MAX_BYTES = 5 * 1024 * 1024

const SIGNATURES: { mime: string; ext: string; bytes: number[] }[] = [
  { mime: "image/jpeg", ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/webp", ext: "webp", bytes: [0x52, 0x49, 0x46, 0x46] },
  { mime: "image/gif", ext: "gif", bytes: [0x47, 0x49, 0x46, 0x38] },
]

function detectImage(buffer: Buffer) {
  for (const sig of SIGNATURES) {
    if (sig.bytes.every((b, i) => buffer[i] === b)) {
      if (sig.ext === "webp") {
        // RIFF....WEBP
        const isWebp =
          buffer.length >= 12 &&
          buffer[8] === 0x57 &&
          buffer[9] === 0x45 &&
          buffer[10] === 0x42 &&
          buffer[11] === 0x50
        if (!isWebp) continue
      }
      return sig
    }
  }
  return null
}

export async function savePredictionScreenshot(
  file: File
): Promise<{ url: string; publicId: string } | { error: string }> {
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return { error: "Screenshot must be under 5MB" }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const detected = detectImage(buffer)
  if (!detected) {
    return { error: "Upload a valid JPG, PNG, WEBP, or GIF screenshot" }
  }

  // Client-declared type must match magic bytes when provided
  if (file.type && file.type !== detected.mime && file.type !== "image/jpg") {
    if (!(file.type === "image/jpg" && detected.mime === "image/jpeg")) {
      return { error: "File type does not match image contents" }
    }
  }

  const publicId = `slip_${nanoid(12)}`
  const filename = `${publicId}.${detected.ext}`
  const dir = path.join(process.cwd(), "public", "uploads", "predictions")
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, filename), buffer)

  return {
    url: `/uploads/predictions/${filename}`,
    publicId,
  }
}
