import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { usePage } from '@inertiajs/react'
import { CalendarCheck, GraduationCap, TrendingUp, UserCheck, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { InfoCard, ROLE_META, percent, roleLabel } from '~/components/panel_stats'
import { StatCard } from '~/components/dashboard/stat_card'
import { GrowthChart } from '~/components/dashboard/growth_chart'
import { cn } from '~/lib/utils'

type Props = {
  profile: { fullName: string | null; loginCode: string | null; role: string }
  stats: { total: number; active: number; students: number; teachers: number }
  roleBreakdown: { role: string; total: number }[]
  trend: { label: string; value: number }[]
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
  const { profile, stats, roleBreakdown, trend } = usePage<Props>().props
  const brand = usePage().props.brand
  const activePercent = percent(stats.active, stats.total)
  const peak = Math.max(1, ...roleBreakdown.map((row) => row.total))
  const studentShare = percent(stats.students, stats.total)

  return (
    <Page title="Panel kepala sekolah" hideTitle description={undefined}>
      <div className="flex flex-col gap-5">
        <div className="@container/main flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">
            {brand?.name ?? 'Sekolah'} · Kepala sekolah
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground @[480px]:text-3xl">
            Ringkasan lembaga
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Selamat datang, {profile.fullName?.split(' ')[0] ?? 'Bapak/Ibu'}. Akses Anda bersifat
            pemantauan, bukan input operasional.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <StatCard
            label="Siswa terdaftar"
            value={stats.students}
            icon={GraduationCap}
            footnote={`${studentShare}% dari seluruh akun`}
            accent="primary"
            highlight
          />
          <StatCard
            label="Guru"
            value={stats.teachers}
            icon={Users}
            footnote="Tenaga pengajar aktif"
            accent="info"
          />
          <StatCard
            label="Akun aktif"
            value={`${activePercent}%`}
            icon={TrendingUp}
            trend={{ value: `${stats.active} dari ${stats.total}`, direction: 'up' }}
            footnote="Dapat masuk ke sistem hari ini"
            accent="success"
          />
          <StatCard
            label="Rasio siswa per guru"
            value={stats.teachers > 0 ? Math.round(stats.students / stats.teachers) : '—'}
            unit={stats.teachers > 0 ? 'siswa' : undefined}
            icon={UserCheck}
            footnote={
              stats.teachers > 0 ? 'Semakin kecil semakin baik' : 'Belum ada guru terdaftar'
            }
            accent="warning"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-3">
          <div className="@4xl/main:col-span-2">
            <GrowthChart
              title="Pertumbuhan akun"
              description="Enam bulan terakhir, dihitung dari tanggal pembuatan akun."
              data={trend}
              seriesLabel="Akun baru"
              footnote="Bulan tanpa akun baru tetap tampil sebagai nol."
            />
          </div>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Agenda pemantauan</CardTitle>
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
              <InfoCard title="Angka belum tersedia" tone="info">
                Kehadiran dan keuangan belum tampil karena modul terkait belum aktif.
              </InfoCard>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Komposisi peran</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-x-6 gap-y-3.5 @lg/main:grid-cols-2">
            {roleBreakdown.map((row) => {
              const meta = ROLE_META[row.role as keyof typeof ROLE_META]
              const Icon = meta?.icon
              const width = Math.round((row.total / peak) * 100)
              return (
                <div key={row.role} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
                      {Icon ? (
                        <Icon
                          className="size-3.5 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="truncate">{roleLabel(row.role)}</span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {row.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-info transition-[width] duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}

KepsekPanel.layout = [AppLayout]
