import { Calendar, ChevronLeft } from 'lucide-react'
import { SiteLinkButton } from '@/components/site-button'
import type { Dictionary } from '@/lib/dictionaries'

export function HeroSection({
  title,
  subtitle,
  dict,
}: {
  title: string
  subtitle: string
  dict: Dictionary
}) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-7xl items-stretch gap-0 lg:grid-cols-2">
        {/* Image side */}
        <div className="relative min-h-[280px] lg:min-h-[520px]">
          <img
            src="/images/hero-romania.png"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        </div>

        {/* Text side */}
        <div className="flex flex-col items-center justify-center gap-6 px-6 py-12 text-center lg:px-12 lg:py-20">
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-primary text-balance sm:text-5xl">
            {title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-gold/60" />
            <span className="size-2 rotate-45 bg-gold" />
            <span className="h-px w-8 bg-gold/60" />
          </div>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <SiteLinkButton href="/contact" size="lg">
              <Calendar className="size-5" />
              {dict.hero.plan}
            </SiteLinkButton>
            <SiteLinkButton href="/categories/daily-tours" size="lg" variant="outline">
              {dict.hero.allTours}
              <ChevronLeft className="size-4" />
            </SiteLinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
