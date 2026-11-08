'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { submitContact, type ContactState } from '@/app/contact/actions'
import type { Locale } from '@/lib/i18n'

const initialState: ContactState = { status: 'idle', message: '' }

type FormLabels = {
  name: string
  namePlaceholder: string
  phone: string
  phonePlaceholder: string
  email: string
  message: string
  messagePlaceholder: string
  submit: string
  submitting: string
}

function SubmitButton({ labels }: { labels: FormLabels }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      <Send className="size-5" />
      {pending ? labels.submitting : labels.submit}
    </button>
  )
}

export function ContactForm({ locale, labels }: { locale: Locale; labels: FormLabels }) {
  const [state, formAction] = useActionState(submitContact, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Locale travels with the submission so the server reply matches the site language. */}
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={labels.name} name="name" type="text" required placeholder={labels.namePlaceholder} />
        <Field label={labels.phone} name="phone" type="tel" placeholder={labels.phonePlaceholder} />
      </div>
      <Field label={labels.email} name="email" type="email" placeholder="you@example.com" />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={labels.messagePlaceholder}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40"
        />
      </div>

      {state.status !== 'idle' && (
        <p
          className={
            state.status === 'success'
              ? 'flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-primary'
              : 'flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive'
          }
          role="status"
        >
          {state.status === 'success' ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : (
            <AlertCircle className="size-5 shrink-0" />
          )}
          {state.message}
        </p>
      )}

      <div className="pt-1">
        <SubmitButton labels={labels} />
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  type,
  required,
  placeholder,
}: {
  label: string
  name: string
  type: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40"
      />
    </div>
  )
}
