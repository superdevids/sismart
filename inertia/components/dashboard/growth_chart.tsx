import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/chart'

export type TrendPoint = { label: string; value: number }

const buildConfig = (label: string): ChartConfig => ({
  value: { label, color: 'var(--primary)' },
})

/**
 * Grafik area pertumbuhan. Memakai `chart.tsx` resmi shadcn sehingga
 * tooltip maupun warna ikut token semantik repo.
 */
export function GrowthChart({
  title,
  description,
  data,
  seriesLabel = 'Akun baru',
  footnote,
  height = 260,
}: {
  title: string
  description?: string
  data: TrendPoint[]
  seriesLabel?: string
  footnote?: string
  height?: number
}) {
  const total = data.reduce((sum, point) => sum + point.value, 0)
  const config = buildConfig(seriesLabel)

  return (
    <Card className="@container/card shadow-xs">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-4">
        {data.length === 0 ? (
          <div
            className="grid place-items-center rounded-lg border border-dashed border-border text-sm text-muted-foreground"
            style={{ height }}
          >
            Belum ada data untuk ditampilkan.
          </div>
        ) : (
          <ChartContainer config={config} className="aspect-auto w-full" style={{ height }}>
            <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
                allowDecimals={false}
                domain={[0, 'auto']}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="value"
                type="monotone"
                fill="url(#growthFill)"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      {footnote ? (
        <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            Total {total} {seriesLabel.toLowerCase()}
            <TrendingUp className="size-3.5 text-primary" aria-hidden="true" />
          </div>
          <div>{footnote}</div>
        </CardFooter>
      ) : null}
    </Card>
  )
}
