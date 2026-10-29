import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
  XCircle,
} from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { ROLE_META, percent, roleLabel, toInitials } from '~/components/panel_stats'
import { StatCard } from '~/components/dashboard/stat_card'
import { GrowthChart } from '~/components/dashboard/growth_chart'
import { cn } from '~/lib/utils'

type Props = {
  profile: { fullName: string | null; loginCode: string | null; role: string }
  stats: { total: number; active: number }
  roleBreakdown: { role: string; total: number }[]
  trend: { label: string; value: number }[]
  recentUsers: {
    id: number
    fullName: string | null
    loginCode: string | null
    role: string
    isActive: boolean
    createdAt: string | null
  }[]
}

const DATE_FORMAT = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export default function AdminPanel() {
  const { profile, stats, roleBreakdown, recentUsers, trend } = usePage<Props>().props
  const brand = usePage().props.brand

  const inactive = stats.total - stats.active
  const activePercent = percent(stats.active, stats.total)
  const peak = Math.max(1, ...roleBreakdown.map((row) => row.total))
  const topRole = [...roleBreakdown].sort((a, b) => b.total - a.total)[0]

  return (
    <Page
      title="Panel admin"
      hideTitle
      description={undefined}
      actions={
        <Button asChild size="sm">
          <Link route="users.index">
            Kelola pengguna
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Sapaan + ringkasan */}
        <div className="@container/main">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              {brand?.name ?? 'Sekolah'} · Administrator
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground @[480px]:text-3xl">
              Halo, {profile.fullName?.split(' ')[0] ?? 'Admin'}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Anda mengelola {stats.total} akun. {activePercent}% aktif dan bisa masuk hari ini.
            </p>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <StatCard
            label="Total akun"
            value={stats.total}
            icon={Users}
            footnote={`Tersebar di ${roleBreakdown.length} peran`}
            accent="primary"
            highlight
          />
          <StatCard
            label="Akun aktif"
            value={stats.active}
            icon={UserCheck}
            trend={{ value: `${activePercent}%`, direction: 'up' }}
            footnote="Dapat masuk ke sistem"
            accent="success"
          />
          <StatCard
            label="Akun nonaktif"
            value={inactive}
            icon={UserX}
            trend={
              inactive > 0
                ? { value: 'Perlu ditinjau', direction: 'down' }
                : { value: 'Bersih', direction: 'flat' }
            }
            footnote={inactive > 0 ? 'Periksa akun yang ditangguhkan' : 'Tidak ada akun tertahan'}
            accent={inactive > 0 ? 'warning' : 'success'}
          />
          <StatCard
            label="Peran terbanyak"
            value={roleLabel(topRole?.role)}
            icon={ShieldCheck}
            footnote={`${topRole?.total ?? 0} akun pada peran ini`}
            accent="info"
          />
        </div>

        {/* Grafik + komposisi */}
        <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-3">
          <div className="@4xl/main:col-span-2">
            <GrowthChart
              title="Akun baru per bulan"
              description="Enam bulan terakhir, dihitung dari tanggal pembuatan akun."
              data={trend}
              seriesLabel="Akun baru"
              footnote="Bulan tanpa akun baru tetap tampil sebagai nol."
            />
          </div>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Komposisi peran</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5">
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
                        className="h-full rounded-full bg-primary transition-[width] duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Akun terbaru */}
        <Card className="gap-0 overflow-hidden py-0 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <p className="text-base font-semibold text-foreground">Akun terbaru</p>
              <p className="text-sm text-muted-foreground">
                Lima akun yang paling akhir ditambahkan.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link route="users.index">
                Lihat semua
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {recentUsers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
              <span className="grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium text-foreground">Belum ada akun</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Jalankan seeder untuk membuat akun contoh.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Akun</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5">Dibuat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-2.5">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary-ink">
                            {toInitials(user.fullName, user.loginCode)}
                          </span>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium text-foreground">
                              {user.fullName ?? '—'}
                            </span>
                            <span className="truncate font-mono text-xs text-muted-foreground">
                              {user.loginCode ?? '—'}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="muted">{roleLabel(user.role)}</Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                            user.isActive
                              ? 'bg-success-soft text-success'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {user.isActive ? (
                            <CheckCircle2 className="size-3" aria-hidden="true" />
                          ) : (
                            <XCircle className="size-3" aria-hidden="true" />
                          )}
                          {user.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </TableCell>
                      <TableCell className="pr-5 text-sm tabular-nums text-muted-foreground">
                        {user.createdAt ? DATE_FORMAT.format(new Date(user.createdAt)) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </Page>
  )
}

AdminPanel.layout = [AppLayout]
