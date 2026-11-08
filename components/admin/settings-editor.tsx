'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { saveSettingsAction, type SaveState } from '@/app/admin/actions'
import { LangTabs } from './lang-tabs'
import { dir } from '@/lib/i18n'

const initialState: SaveState = { status: 'idle', message: '' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      <Save className="size-4" />
      {pending ? 'שומר…' : 'שמירת הטקסטים'}
    </button>
  )
}

export function SettingsEditor({ settings }: { settings: Record<string, string> }) {
  const [state, formAction] = useActionState(saveSettingsAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <LangTabs>
        {(locale) => {
          const isHe = locale === 'he'
          const suffix = isHe ? '' : '_ru'
          const d = dir(locale)
          return (
            <>
              <TextField
                name={`banner_text${suffix}`}
                label="טקסט הבאנר (מבצע מיוחד)"
                defaultValue={settings[`banner_text${suffix}`] || ''}
                dir={d}
                hint='הבאנר הכתום בעמוד הבית — לדוגמה: "לינה בקרפטים + רכב שכור + מסלול אישי"'
              />
              <TextField
                name={`banner_badge${suffix}`}
                label="תגית הבאנר"
                defaultValue={settings[`banner_badge${suffix}`] || ''}
                dir={d}
              />
              <TextField
                name={`hero_title${suffix}`}
                label="כותרת ראשית (Hero)"
                defaultValue={settings[`hero_title${suffix}`] || ''}
                dir={d}
              />
              <TextAreaField
                name={`hero_subtitle${suffix}`}
                label="כותרת משנה (Hero)"
                defaultValue={settings[`hero_subtitle${suffix}`] || ''}
                dir={d}
              />
              <TextField
                name={`specialities_heading${suffix}`}
                label="כותרת אזור הטיולים המומלצים"
                defaultValue={settings[`specialities_heading${suffix}`] || ''}
                dir={d}
                hint='הכותרת מעל כרטיסי הטיולים בדף הבית — לדוגמה: "הטיולים המומלצים ביותר"'
              />
            </>
          )
        }}
      </LangTabs>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="phone" label="טלפון" defaultValue={settings.phone || ''} />
        <TextField
          name="whatsapp"
          label="וואטסאפ (ספרות בלבד, כולל קידומת)"
          defaultValue={settings.whatsapp || ''}
        />
      </div>

      <StatusMessage state={state} />
      <div>
        <SubmitButton />
      </div>
    </form>
  )
}

function TextField({
  name,
  label,
  defaultValue,
  hint,
  dir,
}: {
  name: string
  label: string
  defaultValue: string
  hint?: string
  dir?: 'ltr' | 'rtl'
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        dir={dir}
        defaultValue={defaultValue}
        className="h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function TextAreaField({
  name,
  label,
  defaultValue,
  dir,
}: {
  name: string
  label: string
  defaultValue: string
  dir?: 'ltr' | 'rtl'
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={2}
        dir={dir}
        defaultValue={defaultValue}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
      />
    </div>
  )
}

function StatusMessage({ state }: { state: SaveState }) {
  if (state.status === 'idle') return null
  return (
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
  )
}
