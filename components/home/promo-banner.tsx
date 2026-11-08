export function PromoBanner({ text, badge }: { text: string; badge: string }) {
  const badgeWords = badge.split(' ').filter(Boolean)
  // Scale the font so the longest word always fits inside the ~70px text disc,
  // regardless of language (Hebrew stays large, longer Russian words shrink).
  const longestWord = badgeWords.reduce((max, w) => Math.max(max, w.length), 0)
  const badgeFontSize = Math.max(9, Math.min(18, Math.round(72 / (longestWord * 0.62))))

  return (
    <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 pb-16 lg:px-8">
      <div className="relative flex min-h-48 items-center overflow-hidden rounded-2xl bg-orange text-orange-foreground shadow-lg ring-1 ring-black/5">
        {/* Car photo blended into the far (left) side */}
        <img
          src="/images/car-banner.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-3/5 object-cover"
        />
        {/* Gradient fade: solid orange on the right, image revealed on the left */}
        <div className="absolute inset-0 bg-gradient-to-l from-orange via-orange/85 to-transparent" />
        {/* Subtle warm overlay to keep text legible over the photo */}
        <div className="absolute inset-0 bg-orange/25 mix-blend-multiply" />

        {/* Starburst "special offer" seal */}
        <div className="relative z-10 m-4 hidden shrink-0 sm:m-5 sm:block">
          <div className="grid size-28 place-items-center drop-shadow-md">
            {/* Rotating outer star for a dynamic, eye-catching badge */}
            <div
              className="col-start-1 row-start-1 size-28 animate-[spin_18s_linear_infinite] bg-cream"
              style={{
                clipPath:
                  'polygon(100% 50%, 85.1% 64.5%, 85.35% 85.35%, 64.5% 85.1%, 50% 100%, 35.5% 85.1%, 14.65% 85.35%, 14.9% 64.5%, 0% 50%, 14.9% 35.5%, 14.65% 14.65%, 35.5% 14.9%, 50% 0%, 64.5% 14.9%, 85.35% 14.65%, 85.1% 35.5%)',
              }}
            />
            {/* Static text disc on top so the words stay upright and readable */}
            <div className="relative z-10 col-start-1 row-start-1 flex size-[78px] flex-col items-center justify-center gap-0.5 rounded-full px-1 text-center leading-none text-orange">
              {badgeWords.map((word, i) => (
                <span
                  key={i}
                  className="font-heading font-black tracking-tight"
                  style={{ fontSize: `${badgeFontSize}px` }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 flex-1 px-6 py-8 text-center font-heading text-xl font-extrabold leading-snug text-balance drop-shadow-sm sm:pr-4 sm:text-right sm:text-2xl lg:text-3xl">
          {text}
        </p>
      </div>
    </section>
  )
}
