import { cn } from '@/lib/utils'

export function SectionHeading({
  children,
  className,
  light = false,
}: {
  children: React.ReactNode
  className?: string
  light?: boolean
}) {
  return (
    <div className={cn('flex flex-col items-center gap-3 text-center', className)}>
      <h2
        className={cn(
          'font-heading text-2xl font-extrabold text-balance sm:text-3xl',
          light ? 'text-primary-foreground' : 'text-primary',
        )}
      >
        {children}
      </h2>
      <div className="flex items-center gap-2">
        <span className={cn('h-px w-10', light ? 'bg-primary-foreground/40' : 'bg-gold/60')} />
        <span className={cn('size-2 rotate-45', light ? 'bg-primary-foreground' : 'bg-gold')} />
        <span className={cn('h-px w-10', light ? 'bg-primary-foreground/40' : 'bg-gold/60')} />
      </div>
    </div>
  )
}
