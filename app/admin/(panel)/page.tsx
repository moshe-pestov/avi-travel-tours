import Link from 'next/link'
import {
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
  ChevronLeft,
} from 'lucide-react'
import { DbNotice } from '@/components/admin/db-notice'
import { getSpecialities, getTestimonials, getAllPosts } from '@/lib/db'

export default async function AdminOverviewPage() {
  const [specialities, testimonials, posts] = await Promise.all([
    getSpecialities(),
    getTestimonials(),
    getAllPosts(),
  ])

  const cards = [
    {
      href: '/admin/texts',
      label: 'טקסטים באתר',
      desc: 'כותרות, באנר מבצע, פרטי קשר',
      icon: Type,
      count: null as number | null,
    },
    {
      href: '/admin/tours',
      label: 'טיולים',
      desc: 'הכרטיסים בדף הבית ועמודי הטיולים',
      icon: Mountain,
      count: specialities.length,
    },
    {
      href: '/admin/testimonials',
      label: 'חוות דעת',
      desc: 'המלצות המטיילים בסליידר',
      icon: MessageSquareQuote,
      count: testimonials.length,
    },
    {
      href: '/admin/content/daily-tours',
      label: 'טיולים יומיים',
      desc: 'פוסטים וגלריות של טיולי יום',
      icon: Sun,
      count: posts.filter((p) => p.category === 'טיולים יומיים').length,
    },
    {
      href: '/admin/content/multiday-tours',
      label: 'טיולים למספר ימים',
      desc: 'פוסטים וגלריות של טיולים ארוכים',
      icon: CalendarDays,
      count: posts.filter((p) => p.category === 'טיולים למספר ימים').length,
    },
    {
      href: '/admin/content/romania-vacations',
      label: 'חופשות ברומניה',
      desc: 'חבילות חופשה מלאות ברומניה',
      icon: Plane,
      count: posts.filter((p) => p.category === 'חופשות ברומניה').length,
    },
    {
      href: '/admin/content/services',
      label: 'השירותים שלנו',
      desc: 'השירותים שאנחנו מציעים ללקוחות',
      icon: HeartHandshake,
      count: posts.filter((p) => p.category === 'השירותים שלנו').length,
    },
    {
      href: '/admin/content/deals',
      label: 'מבצעים',
      desc: 'פוסטים וגלריות של מבצעים והצעות',
      icon: Tag,
      count: posts.filter((p) => p.category === 'מבצעים').length,
    },
    {
      href: '/admin/content/sites-attractions',
      label: 'אתרים ואטרקציות',
      desc: 'טירות, אתרים ואטרקציות ברומניה',
      icon: Landmark,
      count: posts.filter((p) => p.category === 'אתרים ואטרקציות').length,
    },
    {
      href: '/admin/content/blog',
      label: 'בלוג',
      desc: 'כתבות, טיפים ומדריכים לטיול',
      icon: Newspaper,
      count: posts.filter((p) => p.category === 'בלוג').length,
    },
  ]

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-primary">מערכת ניהול תוכן</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        בחרו קטגוריה מהתפריט כדי לערוך את התוכן. השינויים נשמרים במסד הנתונים ומתעדכנים באתר.
      </p>

      <DbNotice />

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, label, desc, icon: Icon, count }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-base font-bold text-foreground">{label}</h2>
                {count !== null && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {count}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
            <ChevronLeft className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}
