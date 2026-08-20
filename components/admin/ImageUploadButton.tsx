'use client'

import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useUploadThing, getUploadedFileUrl } from '@/lib/uploadthing'

interface Props {
    label?: string
    className?: string
    multiple?: boolean
    onUploaded: (urls: string[]) => void
}

// Self-contained image upload control — doesn't rely on UploadThing's Tailwind plugin for styling,
// so the click target and file input are always visible and reliable.
export default function ImageUploadButton({ label, className, multiple, onUploaded }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)

    const { startUpload } = useUploadThing('imageUploader', {
        onClientUploadComplete: (res) => {
            setUploading(false)
            const urls = (res || []).map(getUploadedFileUrl).filter(Boolean)
            if (urls.length) onUploaded(urls)
            else alert('Upload completed but no image URL was returned. Please try again.')
        },
        onUploadError: (err) => {
            setUploading(false)
            alert(`Upload failed: ${err.message}`)
        },
    })

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        e.target.value = ''
        if (!files.length) return
        setUploading(true)
        await startUpload(files)
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                className="hidden"
                onChange={handleChange}
            />
            <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className={
                    className ||
                    'flex items-center gap-2 bg-blush-500 hover:bg-blush-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60'
                }
            >
                {uploading && <Loader2 size={14} className="animate-spin" />}
                {uploading ? 'Uploading...' : (label || 'Choose Image')}
            </button>
        </>
    )
}
