import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()
export const { useUploadThing } = generateReactHelpers<OurFileRouter>()

// UploadThing renames the file URL field across versions (ufsUrl/url/appUrl) — fall back through all of them.
export function getUploadedFileUrl(file: any): string {
  return file?.ufsUrl || file?.url || file?.appUrl || ''
}
