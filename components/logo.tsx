import { Trees } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LocaleLink } from '@/components/locale-link'

export function Logo({
  className,
  variant = 'default',
  name = 'אבי טיולים',
  tagline = 'ותיירות ברומניה',
}: {
  className?: string
  variant?: 'default' | 'light'
  name?: string
  tagline?: string
}) {
  const isLight = variant === 'light'
  return (
    <LocaleLink href="/" className={cn('flex items-center gap-2', className)}>
      <div className="flex flex-col items-start leading-tight text-start">
        <span
          className={cn(
            'whitespace-nowrap font-heading text-xl font-extrabold',
            isLight ? 'text-primary-foreground' : 'text-primary',
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            'whitespace-nowrap text-[11px] font-medium',
            isLight ? 'text-primary-foreground/80' : 'text-gold',
          )}
        >
          {tagline}
        </span>
      </div>
      <Trees className={cn('size-9 shrink-0', isLight ? 'text-primary-foreground' : 'text-primary')} />
    </LocaleLink>
  )
}
