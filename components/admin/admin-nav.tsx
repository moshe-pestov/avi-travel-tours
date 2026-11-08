'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Type,
  Mountain,
  MessageSquareQuote,
  Sun,
  CalendarDays,
  Plane,
  HeartHandshake,
  Tag,
  Landmark,
  Newspaper,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin', label: 'סקירה כללית', icon: LayoutDashboard },
  { href: '/admin/texts', label: 'טקסטים באתר', icon: Type },
  { href: '/admin/tours', label: 'טיולים (דף הבית)', icon: Mountain },
  { href: '/admin/testimonials', label: 'חוות דעת', icon: MessageSquareQuote },
  { href: '/admin/content/daily-tours', label: 'טיולים יומיים', icon: Sun },
  { href: '/admin/content/multiday-tours', label: 'טיולים למספר ימים', icon: CalendarDays },
  { href: '/admin/content/romania-vacations', label: 'חופשות ברומניה', icon: Plane },
  { href: '/admin/content/services', label: 'השירותים שלנו', icon: HeartHandshake },
  { href: '/admin/content/deals', label: 'מבצעים', icon: Tag },
  { href: '/admin/content/sites-attractions', label: 'אתרים ואטרקציות', icon: Landmark },
  { href: '/admin/content/blog', label: 'בלוג', icon: Newspaper },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="תפריט ניהול" className="flex gap-1 lg:flex-col">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary',
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="whitespace-nowrap">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
