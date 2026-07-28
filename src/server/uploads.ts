import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { nanoid } from "nanoid"

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
])

export async function savePredictionScreenshot(
  file: File
): Promise<{ url: string; publicId: string } | { error: string }> {
  if (!ALLOWED.has(file.type)) {
    return { error: "Upload a JPG, PNG, WEBP, or GIF screenshot" }
  }
  if (file.size > MAX_BYTES) {
    return { error: "Screenshot must be under 5MB" }
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg"

  const publicId = `slip_${nanoid(12)}`
  const filename = `${publicId}.${ext}`
  const dir = path.join(process.cwd(), "public", "uploads", "predictions")
  await mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, filename), buffer)

  return {
    url: `/uploads/predictions/${filename}`,
    publicId,
  }
}
