import { MessageCircle } from 'lucide-react'
import type { Dictionary } from '@/lib/dictionaries'

export function CtaSection({ whatsapp, dict }: { whatsapp: string; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden">
      <img
        src="/images/cta-couple.png"
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center lg:px-8">
        <h2 className="font-heading text-3xl font-extrabold text-primary-foreground text-balance sm:text-4xl">
          {dict.cta.heading}
        </h2>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-4 text-lg font-bold text-primary shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle className="size-6" />
          {dict.cta.whatsapp}
        </a>
      </div>
    </section>
  )
}
