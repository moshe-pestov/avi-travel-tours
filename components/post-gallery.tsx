'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react'

/**
 * Customer-facing image gallery for a post (trip / proposal).
 * - Large main image with prev/next arrows and a counter.
 * - Thumbnail strip for quick jumping.
 * - Click the main image to open a full-screen lightbox (arrow keys + Esc).
 *
 * RTL-aware: the "next" control points left and "previous" points right,
 * matching the reading direction of the Hebrew site.
 */
export function PostGallery({
  images,
  title,
  heading = 'גלריית תמונות',
}: {
  images: string[]
  title: string
  heading?: string
}) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const count = images.length

  const go = useCallback(
    (dir: number) => {
      setIndex((prev) => (prev + dir + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      // In RTL, ArrowRight visually moves to the previous image and ArrowLeft to the next.
      else if (e.key === 'ArrowRight') go(-1)
      else if (e.key === 'ArrowLeft') go(1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, go])

  if (count === 0) return null

  return (
    <section aria-label={heading} className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <Images className="size-5 text-primary" />
        <h2 className="font-heading text-xl font-bold text-foreground">{heading}</h2>
        <span className="text-sm text-muted-foreground">({count})</span>
      </div>

      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="block aspect-[16/10] w-full cursor-zoom-in"
          aria-label="הגדלת התמונה"
        >
          <img
            src={images[index] || '/placeholder.svg'}
            alt={`${title} — תמונה ${index + 1}`}
            className="size-full object-cover"
          />
        </button>

        {count > 1 && (
          <>
            {/* Previous (points right in RTL) */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="התמונה הקודמת"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-md ring-1 ring-border transition-colors hover:bg-card"
            >
              <ChevronRight className="size-6" />
            </button>
            {/* Next (points left in RTL) */}
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="התמונה הבאה"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-md ring-1 ring-border transition-colors hover:bg-card"
            >
              <ChevronLeft className="size-6" />
            </button>

            {/* Counter */}
            <div
              dir="ltr"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/75 px-3 py-1 text-sm font-medium text-background"
            >
              {index + 1} / {count}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`מעבר לתמונה ${i + 1}`}
              aria-current={i === index}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === index ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={src || '/placeholder.svg'}
                alt={`תמונה ממוזערת ${i + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="תצוגת תמונה מוגדלת"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="סגירה"
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-6" />
          </button>

          <img
            src={images[index] || '/placeholder.svg'}
            alt={`${title} — תמונה ${index + 1}`}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                aria-label="התמונה הקודמת"
                className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="size-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                aria-label="התמונה הבאה"
                className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="size-7" />
              </button>

              <div
                dir="ltr"
                className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white"
              >
                {index + 1} / {count}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  )
}
