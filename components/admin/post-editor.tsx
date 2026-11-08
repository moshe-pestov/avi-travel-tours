'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Save, Upload, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { savePostAction, deletePostAction, type SaveState } from '@/app/admin/actions'
import { GalleryUploader } from './gallery-uploader'
import { LangTabs } from './lang-tabs'
import { dir } from '@/lib/i18n'
import type { Post } from '@/lib/mock-data'

const initialState: SaveState = { status: 'idle', message: '' }

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      <Save className="size-4" />
      {pending ? 'שומר…' : 'שמירה'}
    </button>
  )
}

export function PostEditor({ post, lockCategory = false }: { post: Post; lockCategory?: boolean }) {
  const [state, formAction] = useActionState(savePostAction, initialState)
  const [preview, setPreview] = useState<string>(post.image_url || '/placeholder.svg')

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={post.id} />

        <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
          {/* Cover image */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">תמונת שער</span>
            <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview || '/placeholder.svg'} alt={post.title} className="size-full object-cover" />
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
              <Upload className="size-4" />
              החלפת תמונה
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

          {/* Fields */}
          <div className="flex flex-col gap-3">
            {lockCategory ? (
              <input type="hidden" name="category" value={post.category} />
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">קטגוריה</label>
                <input
                  name="category"
                  type="text"
                  list="post-categories"
                  defaultValue={post.category}
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </div>
            )}

            <LangTabs>
              {(locale) => {
                const isHe = locale === 'he'
                const suffix = isHe ? '' : '_ru'
                return (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">כותרת</label>
                      <input
                        name={`title${suffix}`}
                        type="text"
                        dir={dir(locale)}
                        defaultValue={isHe ? post.title : (post.title_ru ?? '')}
                        className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">תקציר (מוצג בכרטיס)</label>
                      <textarea
                        name={`excerpt${suffix}`}
                        rows={2}
                        dir={dir(locale)}
                        defaultValue={isHe ? post.excerpt : (post.excerpt_ru ?? '')}
                        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">תוכן הפוסט</label>
                      <textarea
                        name={`body${suffix}`}
                        rows={6}
                        dir={dir(locale)}
                        defaultValue={isHe ? post.body : (post.body_ru ?? '')}
                        placeholder="תוכן מפורט. ניתן לפצל לפסקאות עם שורה ריקה."
                        className="rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                      />
                      <p className="text-xs text-muted-foreground">
                        מפרידים בין פסקאות בשורה ריקה. אם שדה ברוסית ריק — יוצג הטקסט בעברית.
                      </p>
                    </div>
                  </>
                )
              }}
            </LangTabs>
          </div>
        </div>

        {/* Gallery */}
        <GalleryUploader initial={post.gallery} />

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

        <div className="flex items-center justify-between border-t border-border pt-3">
          <SaveButton />
        </div>
      </form>

      {/* Delete is a separate form (cannot nest forms) */}
      <div className="mt-3 flex justify-end">
        <DeleteButton id={post.id} />
      </div>
    </div>
  )
}

function DeleteButton({ id }: { id: number }) {
  return (
    <form action={deletePostAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-destructive/30 px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        <Trash2 className="size-4" />
        מחיקת פוסט
      </button>
    </form>
  )
}
