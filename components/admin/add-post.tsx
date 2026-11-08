'use client'

import { useActionState, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { createPostAction, type SaveState } from '@/app/admin/actions'
import { GalleryUploader } from './gallery-uploader'

const initialState: SaveState = { status: 'idle', message: '' }

function AddButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
    >
      <Plus className="size-4" />
      {pending ? 'מוסיף…' : 'הוספת פוסט'}
    </button>
  )
}

export function AddPost({ category }: { category?: string }) {
  const [state, formAction] = useActionState(createPostAction, initialState)
  const [preview, setPreview] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      key={formKey}
      ref={formRef}
      action={async (fd) => {
        await formAction(fd)
        formRef.current?.reset()
        setPreview(null)
        // Remount so the gallery uploader clears its in-memory files/previews.
        setFormKey((k) => k + 1)
      }}
      className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-card p-5"
    >
      <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">תמונת שער</span>
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview || '/placeholder.svg'} alt="תצוגה מקדימה" className="size-full object-cover" />
            ) : (
              <span className="text-xs text-muted-foreground">אין תמונה</span>
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <Upload className="size-4" />
            העלאת תמונה
            <input
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setPreview(URL.createObjectURL(file))
              }}
            />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          {category ? (
            <>
              <input type="hidden" name="category" value={category} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">כותרת</label>
                <input
                  name="title"
                  type="text"
                  placeholder="לדוגמה: סתיו קסום בטרנסילבניה"
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </>
          ) : (
            <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">כותרת</label>
                <input
                  name="title"
                  type="text"
                  placeholder="לדוגמה: סתיו קסום בטרנסילבניה"
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">קטגוריה</label>
                <input
                  name="category"
                  type="text"
                  list="post-categories"
                  defaultValue="טיולים יומיים"
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">תקציר (מוצג בכרטיס)</label>
            <textarea
              name="excerpt"
              rows={2}
              placeholder="תיאור קצר של הפוסט…"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">תוכן הפוסט</label>
            <textarea
              name="body"
              rows={6}
              placeholder="תוכן מפורט. ניתן לפצל לפסקאות עם שורה ריקה."
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>
      </div>

      <GalleryUploader />

      {state.status !== 'idle' && (
        <p
          className={
            state.status === 'success'
              ? 'flex items-center gap-2 text-sm font-medium text-primary'
              : 'flex items-center gap-2 text-sm font-medium text-destructive'
          }
          role="status"
        >
          {state.status === 'success' ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          {state.message}
        </p>
      )}

      <div>
        <AddButton />
      </div>
    </form>
  )
}
