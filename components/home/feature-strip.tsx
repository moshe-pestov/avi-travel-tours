import { HeartHandshake, UserRound, Award, Users, ShieldCheck } from 'lucide-react'
import type { Dictionary } from '@/lib/dictionaries'

export function FeatureStrip({ dict }: { dict: Dictionary }) {
  const f = dict.featureStrip
  const features = [
    { icon: UserRound, title: f.personalService, sub: f.inEveryStep },
    { icon: HeartHandshake, title: f.customization, sub: f.forEveryTraveler },
    { icon: Users, title: f.israeliGuides, sub: f.hebrewSpeaking },
    { icon: ShieldCheck, title: f.experienceReliability, sub: f.andResults },
  ]

  return (
    <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 lg:px-8">
      <div className="grid grid-cols-2 items-center gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        <FeatureItem {...features[0]} />
        <FeatureItem {...features[1]} />

        {/* Center highlight */}
        <div className="order-first col-span-2 flex flex-col items-center gap-1 text-center sm:order-none sm:col-span-1">
          <Award className="size-8 text-gold" />
          <p className="font-heading text-lg font-extrabold text-primary">{f.years}</p>
          <p className="text-sm font-medium text-muted-foreground">{f.inRomania}</p>
          <div className="flex gap-0.5 text-gold" aria-hidden>
            {'★★★★★'.split('').map((s, i) => (
              <span key={i} className="text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>

        <FeatureItem {...features[2]} />
        <FeatureItem {...features[3]} />
      </div>
    </section>
  )
}

function FeatureItem({
  icon: Icon,
  title,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  sub: string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Icon className="size-7 text-gold" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}
