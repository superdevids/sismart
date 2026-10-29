import { type ReactNode } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { cn } from '~/lib/utils'

export type ChartPoint = { label: string; value: number }

/**
 * Grafik area sederhana untuk data panel.
 *
 * Warna memakai token semantik repo (`--primary`), bukan hex mentah, agar tema
 * terang/gelap ikut otomatis. Tanpa dependency `chart.tsx` shadcn agar tidak
 * menambah 16 variabel CSS baru ke `app.css`.
 */
export function AreaTrend({
  title,
  description,
  data,
  unit = '',
  height = 220,
  footer,
  action,
}: {
  title: string
  description?: string
  data: ChartPoint[]
  unit?: string
  height?: number
  footer?: ReactNode
  action?: ReactNode
}) {
  const empty = data.length === 0

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground">{title}</p>
            {description && (
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {empty ? (
          <div
            className="grid place-items-center rounded-lg border border-dashed border-border bg-background/60 text-sm text-muted-foreground"
            style={{ height }}
          >
            Belum ada data untuk ditampilkan.
          </div>
        ) : (
          <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  allowDecimals={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ stroke: 'var(--border)' }}
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    color: 'var(--foreground)',
                    fontSize: 12,
                  }}
                  labelStyle={{ color: 'var(--muted-foreground)' }}
                  formatter={(value) => [`${value}${unit ? ` ${unit}` : ''}`, title]}
                />
                <Area
                  dataKey="value"
                  type="monotone"
                  fill="url(#areaFill)"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  name={title}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {footer && <div className="text-xs leading-relaxed text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  )
}

/**
 * Bar chart horizontal untuk komposisi (mis. sebaran peran).
 * Memakai satu warna (`--primary`) dan label nominal, bukan 6 warna berbeda,
 * karena enam warna sekaligus akan melanggar prinsip "satu aksen".
 */
export function CompositionBars({
  items,
  className,
}: {
  items: { label: string; value: number; icon?: ReactNode }[]
  className?: string
}) {
  const peak = Math.max(1, ...items.map((item) => item.value))

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((item) => {
        const width = Math.round((item.value / peak) * 100)
        return (
          <div key={item.label} className="flex items-center gap-3">
            {item.icon && (
              <span
                className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-ink"
                aria-hidden="true"
              >
                {item.icon}
              </span>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium text-foreground">{item.label}</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {item.value}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
