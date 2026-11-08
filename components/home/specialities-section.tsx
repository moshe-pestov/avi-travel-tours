import { Compass, ArrowLeft } from 'lucide-react'
import { SiteLinkButton } from '@/components/site-button'
import { SectionHeading } from '@/components/section-heading'
import { LocaleLink } from '@/components/locale-link'
import { pick, type Locale } from '@/lib/i18n'
import type { Dictionary } from '@/lib/dictionaries'
import type { Speciality } from '@/lib/mock-data'

export function SpecialitiesSection({
  specialities,
  locale,
  dict,
  heading,
}: {
  specialities: Speciality[]
  locale: Locale
  dict: Dictionary
  heading?: string
}) {
  if (specialities.length === 0) return null

  return (
    <section id="specialities" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionHeading className="mb-10">{heading || dict.specialities.heading}</SectionHeading>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {specialities.map((s) => {
          const title = pick(locale, s.title, s.title_ru)
          const description = pick(locale, s.description, s.description_ru)
          return (
            <article
              key={s.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <LocaleLink href={`/tours/${s.id}`} className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.image_url || '/placeholder.svg'}
                  alt={title}
                  className="size-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </LocaleLink>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-heading text-lg font-bold leading-snug text-foreground text-balance">
                  <LocaleLink href={`/tours/${s.id}`} className="transition-colors hover:text-primary">
                    {title}
                  </LocaleLink>
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{description}</p>
                <SiteLinkButton href={`/tours/${s.id}`} variant="outline" className="mt-auto w-fit">
                  {dict.specialities.details}
                </SiteLinkButton>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <LocaleLink
          href="/categories/daily-tours"
          className="group flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-3.5 text-center transition-colors hover:border-primary/40 hover:bg-primary/10"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Compass className="size-5" />
          </span>
          <span className="text-sm font-semibold text-foreground text-pretty sm:text-base">
            {dict.specialities.footnote}
          </span>
          <ArrowLeft className="size-5 shrink-0 text-primary transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        </LocaleLink>
      </div>
    </section>
  )
}
