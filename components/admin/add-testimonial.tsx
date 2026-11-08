'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus, CheckCircle2, AlertCircle } from 'lucide-react'
import { createTestimonialAction, type SaveState } from '@/app/admin/actions'

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
      {pending ? 'מוסיף…' : 'הוספת חוות דעת'}
    </button>
  )
}

export function AddTestimonial() {
  const [state, formAction] = useActionState(createTestimonialAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state])

  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-5">
      <form ref={formRef} action={formAction} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">חוות הדעת</label>
          <textarea
            name="quote"
            rows={3}
            placeholder="מה הלקוח אמר…"
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">שם</label>
            <input
              name="name"
              type="text"
              placeholder="שם הלקוח"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">עיר</label>
            <input
              name="place"
              type="text"
              placeholder="עיר מגורים"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">דירוג (כוכבים)</label>
            <select
              name="rating"
              defaultValue="5"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

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
    </div>
  )
}
