'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Save, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  saveTestimonialAction,
  deleteTestimonialAction,
  type SaveState,
} from '@/app/admin/actions'
import type { Testimonial } from '@/lib/mock-data'
import { LangTabs } from './lang-tabs'
import { dir } from '@/lib/i18n'

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

export function TestimonialEditor({ testimonial }: { testimonial: Testimonial }) {
  const [state, formAction] = useActionState(saveTestimonialAction, initialState)

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={testimonial.id} />

        <div className="flex flex-col gap-1.5 sm:max-w-[180px]">
          <label className="text-sm font-medium text-foreground">דירוג (כוכבים)</label>
          <select
            name="rating"
            defaultValue={String(testimonial.rating)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <LangTabs>
          {(locale) => {
            const isHe = locale === 'he'
            const suffix = isHe ? '' : '_ru'
            return (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">חוות הדעת</label>
                  <textarea
                    name={`quote${suffix}`}
                    rows={3}
                    dir={dir(locale)}
                    defaultValue={isHe ? testimonial.quote : (testimonial.quote_ru ?? '')}
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">שם</label>
                    <input
                      name={`name${suffix}`}
                      type="text"
                      dir={dir(locale)}
                      defaultValue={isHe ? testimonial.name : (testimonial.name_ru ?? '')}
                      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">עיר</label>
                    <input
                      name={`place${suffix}`}
                      type="text"
                      dir={dir(locale)}
                      defaultValue={isHe ? testimonial.place : (testimonial.place_ru ?? '')}
                      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                </div>
              </>
            )
          }}
        </LangTabs>

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

        <div className="flex items-center gap-2">
          <SaveButton />
        </div>
      </form>

      {/* Delete is a separate form (cannot nest forms) */}
      <div className="mt-3 flex justify-end border-t border-border pt-3">
        <DeleteButton id={testimonial.id} />
      </div>
    </div>
  )
}

function DeleteButton({ id }: { id: number }) {
  return (
    <form action={deleteTestimonialAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-destructive/30 px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        <Trash2 className="size-4" />
        מחיקה
      </button>
    </form>
  )
}
