import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { LocaleLink } from '@/components/locale-link'

type Variant = 'primary' | 'outline' | 'white' | 'orange'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-gold text-primary bg-background hover:bg-cream',
  white: 'bg-background text-primary hover:bg-cream',
  orange: 'bg-accent text-accent-foreground hover:bg-accent/90',
}

const sizes: Record<Size, string> = {
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
}

type BaseProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function SiteButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: BaseProps & ComponentProps<'button'>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}

export function SiteLinkButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  ...props
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <LocaleLink href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </LocaleLink>
  )
}
