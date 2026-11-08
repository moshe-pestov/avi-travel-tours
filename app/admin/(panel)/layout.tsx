import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LogOut, ExternalLink } from 'lucide-react'
import { Logo } from '@/components/logo'
import { AdminNav } from '@/components/admin/admin-nav'
import { isAuthenticated } from '@/lib/auth'
import { logoutAction } from '@/app/admin/actions'

export const metadata: Metadata = {
  title: 'ניהול תוכן | אבי טיולים',
  robots: { index: false, follow: false },
}

export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!(await isAuthenticated())) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ExternalLink className="size-4" />
              צפייה באתר
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <LogOut className="size-4" />
                יציאה
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* Sidebar menu */}
        <aside className="lg:w-56 lg:shrink-0">
          <div className="sticky top-[73px] overflow-x-auto rounded-xl border border-border bg-card p-2 lg:overflow-visible">
            <AdminNav />
          </div>
        </aside>

        {/* Page content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
