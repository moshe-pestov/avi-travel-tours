'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronRight, ChevronLeft, Quote, Star } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { pick, type Locale } from '@/lib/i18n'
import type { Dictionary } from '@/lib/dictionaries'
import type { Testimonial } from '@/lib/mock-data'

export function TestimonialsSection({
  testimonials,
  locale,
  dict,
}: {
  testimonials: Testimonial[]
  locale: Locale
  dict: Dictionary
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const count = testimonials.length

  // Scroll the card at the given index into view (engine-agnostic, works in RTL).
  function goTo(index: number) {
    const next = (index + count) % count
    setActive(next)
    const track = trackRef.current
    const card = track?.children[next] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  // Keep the active dot in sync when the user scrolls/swipes manually.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        // Use viewport rects so the math is correct in both LTR and RTL.
        const trackRect = track.getBoundingClientRect()
        const trackCenter = trackRect.left + trackRect.width / 2
        let nearest = 0
        let min = Infinity
        Array.from(track.children).forEach((el, i) => {
          const r = (el as HTMLElement).getBoundingClientRect()
          const c = r.left + r.width / 2
          const d = Math.abs(c - trackCenter)
          if (d < min) {
            min = d
            nearest = i
          }
        })
        setActive(nearest)
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  if (count === 0) return null

  return (
    <section className="bg-secondary/60 py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading className="mb-10">{dict.testimonials.heading}</SectionHeading>

        <div className="relative">
          {/* Slider track */}
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="w-full shrink-0 snap-center sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <TestimonialCard
                  quote={pick(locale, t.quote, t.quote_ru)}
                  name={pick(locale, t.name, t.name_ru)}
                  place={pick(locale, t.place, t.place_ru)}
                  rating={t.rating}
                />
              </div>
            ))}
          </div>

          {/* Arrows */}
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label={dict.testimonials.prev}
                onClick={() => goTo(active - 1)}
                className="absolute -right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-primary shadow-md transition-colors hover:bg-secondary lg:-right-5"
              >
                <ChevronRight className="size-5" />
              </button>
              <button
                type="button"
                aria-label={dict.testimonials.next}
                onClick={() => goTo(active + 1)}
                className="absolute -left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-primary shadow-md transition-colors hover:bg-secondary lg:-left-5"
              >
                <ChevronLeft className="size-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {count > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`${dict.testimonials.review} ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? 'w-6 bg-primary' : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TestimonialCard({
  quote,
  name,
  place,
  rating,
}: {
  quote: string
  name: string
  place: string
  rating: number
}) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <Quote className="size-8 text-gold/70" />
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground">{quote}</blockquote>
      <div className="flex gap-0.5 text-gold">
        {Array.from({ length: Math.max(0, Math.min(5, rating)) }).map((_, i) => (
          <Star key={i} className="size-4 fill-current" />
        ))}
      </div>
      <figcaption className="text-sm font-bold text-primary">
        {name} <span className="font-normal text-muted-foreground">— {place}</span>
      </figcaption>
    </figure>
  )
}
