import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { usePage } from '@inertiajs/react'
import { CalendarCheck, GraduationCap, TrendingUp, UserCheck, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import {
  HeroPanel,
  InfoCard,
  Metric,
  MetricGrid,
  ROLE_META,
  percent,
  roleLabel,
} from '~/components/panel_stats'
import { cn } from '~/lib/utils'

type Props = {
  profile: { fullName: string | null; loginCode: string | null; role: string }
  stats: { total: number; active: number; students: number; teachers: number }
  roleBreakdown: { role: string; total: number }[]
}

const AGENDA = [
  { icon: CalendarCheck, label: 'Rapat dewan guru', period: 'Mingguan', tone: 'info' as const },
  {
    icon: UserCheck,
    label: 'Rekap kehadiran bulanan',
    period: 'Akhir bulan',
    tone: 'success' as const,
  },
  { icon: Wallet, label: 'Laporan keuangan SPP', period: 'Bulanan', tone: 'warning' as const },
]

const AGENDA_TONE: Record<string, string> = {
  info: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
}

export default function KepsekPanel() {
  const { profile, stats, roleBreakdown } = usePage<Props>().props
  const activePercent = percent(stats.active, stats.total)
  const peak = Math.max(1, ...roleBreakdown.map((row) => row.total))

  return (
    <Page title="Panel kepala sekolah" hideTitle description={undefined} actions={undefined}>
      <div className="flex flex-col gap-4">
        <HeroPanel
          role="kepsek"
          fullName={profile.fullName}
          loginCode={profile.loginCode}
          summary={`Ringkasan lembaga hari ini: ${stats.students} siswa dan ${stats.teachers} guru terdaftar. Akses Anda bersifat pemantauan, bukan input operasional.`}
        />

        <MetricGrid>
          <Metric
            icon={<GraduationCap className="size-5" />}
            value={String(stats.students)}
            label="Siswa terdaftar"
            hint="Akun dengan peran siswa"
            tone="primary"
          />
          <Metric
            icon={<Users className="size-5" />}
            value={String(stats.teachers)}
            label="Guru"
            hint="Tenaga pengajar aktif di lembaga"
            tone="info"
          />
          <Metric
            icon={<TrendingUp className="size-5" />}
            value={`${activePercent}%`}
            label="Akun aktif"
            hint={`${stats.active} dari ${stats.total} akun dapat masuk`}
            tone="success"
            progress={activePercent}
          />
        </MetricGrid>

        <div className="grid gap-3 xl:grid-cols-3">
          <Card className="shadow-none xl:col-span-2">
            <CardHeader>
              <p className="text-base font-semibold text-foreground">Komposisi peran</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Sebaran seluruh akun menurut peran. Batang terpanjang adalah peran terbanyak.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {roleBreakdown.map((row) => {
                const meta = ROLE_META[row.role as keyof typeof ROLE_META]
                const Icon = meta?.icon
                const width = Math.round((row.total / peak) * 100)

                return (
                  <div key={row.role} className="flex items-center gap-3">
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-lg',
                        meta
                          ? `${meta.bar} text-primary-foreground`
                          : 'bg-muted text-muted-foreground'
                      )}
                      aria-hidden="true"
                    >
                      {Icon ? <Icon className="size-4" /> : null}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          {roleLabel(row.role)}
                        </span>
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {row.total}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full rounded-full transition-[width] duration-500',
                            meta?.bar ?? 'bg-muted-foreground'
                          )}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <p className="text-base font-semibold text-foreground">Agenda pemantauan</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Kegiatan rutin yang perlu ditinjau.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {AGENDA.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-lg border border-border bg-background/60 px-3 py-2.5"
                  >
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-lg',
                        AGENDA_TONE[item.tone]
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.period}</span>
                    </div>
                  </div>
                )
              })}
              <div className="pt-1">
                <InfoCard title="Angka belum tersedia" tone="info">
                  Kehadiran dan keuangan belum tampil karena modul terkait belum aktif.
                </InfoCard>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}

KepsekPanel.layout = [AppLayout]
