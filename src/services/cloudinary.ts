export interface UploadOptions {
  folder?: string
  publicId?: string
  tags?: string[]
}

export interface UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
}

export async function uploadImage(
  file: File | Buffer | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const publicId =
    options.publicId ??
    `wakamalia/${options.folder ?? "uploads"}/${Date.now()}`

  console.info("[cloudinary] upload stub", { publicId, tags: options.tags })

  return {
    url: `https://res.cloudinary.com/demo/image/upload/${publicId}.jpg`,
    publicId,
    width: 1200,
    height: 800,
    format: "jpg",
  }
}

export async function deleteImage(publicId: string): Promise<{ success: boolean }> {
  console.info("[cloudinary] delete stub", publicId)
  return { success: true }
}

export function getOptimizedUrl(
  publicId: string,
  transforms = "c_fill,w_800,h_450"
): string {
  return `https://res.cloudinary.com/demo/image/upload/${transforms}/${publicId}.jpg`
}
