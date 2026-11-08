import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Logo } from '@/components/logo'
import { LoginForm } from '@/components/admin/login-form'
import { isAuthenticated } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'כניסה לניהול | אבי טיולים',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/admin')

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo />
          <h1 className="font-heading text-xl font-bold text-primary">כניסה למערכת הניהול</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
