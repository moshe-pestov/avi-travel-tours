import { Heart, Users, UsersRound, Footprints, CalendarRange } from 'lucide-react'
import { SiteLinkButton } from '@/components/site-button'
import type { Dictionary } from '@/lib/dictionaries'

export function MultiDaySection({ dict }: { dict: Dictionary }) {
  const audiences = [
    { icon: Heart, label: dict.multiday.couples },
    { icon: Users, label: dict.multiday.families },
    { icon: UsersRound, label: dict.multiday.groups },
    { icon: Footprints, label: dict.multiday.veterans },
  ]

  return (
    <section id="multiday" className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
      <div className="grid overflow-hidden rounded-2xl border border-border bg-primary text-primary-foreground lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 p-8 lg:p-12">
          <h2 className="font-heading text-2xl font-extrabold leading-tight text-balance sm:text-3xl">
            {dict.multiday.heading}
          </h2>
          <div className="flex flex-wrap gap-6">
            {audiences.map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1.5 text-center">
                <a.icon className="size-7 text-accent" />
                <span className="text-sm font-medium">{a.label}</span>
              </div>
            ))}
          </div>
          <SiteLinkButton href="/contact" size="lg" variant="white" className="w-fit">
            <CalendarRange className="size-5" />
            {dict.multiday.plan}
          </SiteLinkButton>
        </div>
        <div className="relative min-h-[240px]">
          <img
            src="/images/multiday.png"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
