'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle, LogIn } from 'lucide-react'
import { loginAction, type LoginState } from '@/app/admin/actions'

const initialState: LoginState = { error: '' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      <LogIn className="size-5" />
      {pending ? 'מתחבר…' : 'התחברות'}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="user" className="text-sm font-medium text-foreground">
          שם משתמש
        </label>
        <input
          id="user"
          name="user"
          type="text"
          required
          autoComplete="username"
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          סיסמה
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
        />
      </div>

      {state.error && (
        <p
          className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          role="alert"
        >
          <AlertCircle className="size-5 shrink-0" />
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
