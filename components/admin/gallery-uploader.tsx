'use client'

import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

const MAX_GALLERY = 15

/**
 * Manages a post gallery in the admin:
 * - `existing` holds URLs already saved in the DB that the user chooses to keep.
 * - Newly picked files are accumulated in a DataTransfer and mirrored into a
 *   hidden `gallery_files` input so they submit with the parent <form>.
 * - A hidden `existing_gallery` input carries the kept URLs as JSON.
 * Enforces a hard cap of 15 total images.
 */
export function GalleryUploader({ initial = [] }: { initial?: string[] }) {
  const [existing, setExisting] = useState<string[]>(initial)
  const [previews, setPreviews] = useState<string[]>([])
  const dtRef = useRef<DataTransfer | null>(null)
  const submitInputRef = useRef<HTMLInputElement>(null)

  const total = existing.length + previews.length

  function getDT() {
    if (!dtRef.current) dtRef.current = new DataTransfer()
    return dtRef.current
  }

  function syncSubmitInput() {
    if (submitInputRef.current) submitInputRef.current.files = getDT().files
  }

  function rebuildPreviews() {
    setPreviews(Array.from(getDT().files).map((f) => URL.createObjectURL(f)))
  }

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    const dt = getDT()
    for (const f of picked) {
      if (existing.length + dt.files.length >= MAX_GALLERY) break
      if (!f.type.startsWith('image/')) continue
      dt.items.add(f)
    }
    syncSubmitInput()
    rebuildPreviews()
    // Reset the picker so the same file can be selected again after removal.
    e.target.value = ''
  }

  function removeExisting(index: number) {
    setExisting((prev) => prev.filter((_, i) => i !== index))
  }

  function removeNew(index: number) {
    const files = Array.from(getDT().files)
    const next = new DataTransfer()
    files.forEach((f, i) => {
      if (i !== index) next.items.add(f)
    })
    dtRef.current = next
    syncSubmitInput()
    rebuildPreviews()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">גלריית תמונות (עד 15)</label>
        <span className="text-xs text-muted-foreground">{total} / {MAX_GALLERY}</span>
      </div>

      {/* Hidden inputs that carry the data to the server action */}
      <input type="hidden" name="existing_gallery" value={JSON.stringify(existing)} />
      <input ref={submitInputRef} type="file" name="gallery_files" multiple accept="image/*" className="hidden" />

      {(existing.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {existing.map((src, i) => (
            <div key={`ex-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src || '/placeholder.svg'} alt={`תמונה ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(i)}
                aria-label="הסרת תמונה"
                className="absolute left-1 top-1 grid size-6 place-items-center rounded-full bg-foreground/70 text-background transition-colors hover:bg-destructive"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {previews.map((src, i) => (
            <div key={`new-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-primary/40 ring-1 ring-primary/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src || '/placeholder.svg'} alt={`תמונה חדשה ${i + 1}`} className="size-full object-cover" />
              <span className="absolute bottom-1 right-1 rounded bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                חדש
              </span>
              <button
                type="button"
                onClick={() => removeNew(i)}
                aria-label="הסרת תמונה"
                className="absolute left-1 top-1 grid size-6 place-items-center rounded-full bg-foreground/70 text-background transition-colors hover:bg-destructive"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {total < MAX_GALLERY ? (
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
          <ImagePlus className="size-4" />
          הוספת תמונות לגלריה
          <input type="file" accept="image/*" multiple className="hidden" onChange={handlePick} />
        </label>
      ) : (
        <p className="rounded-lg border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
          הגעת למקסימום של 15 תמונות. יש להסיר תמונה כדי להוסיף אחרת.
        </p>
      )}
    </div>
  )
}
