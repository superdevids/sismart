import { type ReactNode } from 'react'
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { cn } from '~/lib/utils'

/**
 * Kartu metrik ala dashboard-01 / TailAdmin:
 * label kecil di atas, angka besar, badge tren, footer penjelas, ikon di sudut.
 */
export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  footnote,
  accent = 'primary',
  highlight = false,
}: {
  label: string
  value: string | number
  unit?: string
  icon?: LucideIcon
  trend?: { value: string; direction: 'up' | 'down' | 'flat' }
  footnote?: string
  accent?: 'primary' | 'info' | 'success' | 'warning' | 'accent'
  highlight?: boolean
}) {
  const accents: Record<string, string> = {
    primary: 'text-primary',
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
    accent: 'text-warning',
  }

  return (
    <Card
      className={cn(
        '@container/card gap-4 py-5',
        highlight
          ? 'bg-gradient-to-t from-primary/8 to-card shadow-xs'
          : 'bg-gradient-to-t from-muted/60 to-card shadow-xs'
      )}
    >
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          {Icon ? <Icon className={cn('size-3.5', accents[accent])} aria-hidden="true" /> : null}
          {label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
          {unit ? (
            <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
          ) : null}
        </CardTitle>
        {trend ? (
          <CardAction>
            <span
              className={cn(
                'inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                trend.direction === 'up' && 'border-success/30 bg-success-soft text-success',
                trend.direction === 'down' &&
                  'border-destructive/30 bg-destructive-soft text-destructive-ink',
                trend.direction === 'flat' && 'border-border bg-muted text-muted-foreground'
              )}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="size-3" aria-hidden="true" />
              ) : trend.direction === 'down' ? (
                <TrendingDown className="size-3" aria-hidden="true" />
              ) : null}
              {trend.value}
            </span>
          </CardAction>
        ) : null}
      </CardHeader>
      {footnote ? (
        <CardFooter className="text-xs leading-relaxed text-muted-foreground">
          {footnote}
        </CardFooter>
      ) : null}
    </Card>
  )
}

/** Panel bagian dengan judul di luar kartu, untuk menyusun halaman berlapis. */
export function Section({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
