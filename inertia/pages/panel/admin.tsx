import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { ArrowRight, CheckCircle2, UserCheck, Users, UserX, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  HeroPanel,
  Metric,
  MetricGrid,
  ROLE_META,
  percent,
  roleLabel,
  toInitials,
} from '~/components/panel_stats'
import { cn } from '~/lib/utils'

type Props = {
  profile: { fullName: string | null; loginCode: string | null; role: string }
  stats: { total: number; active: number }
  roleBreakdown: { role: string; total: number }[]
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
  const { profile, stats, roleBreakdown, recentUsers } = usePage<Props>().props
  const brand = usePage().props.brand

  const inactive = stats.total - stats.active
  const activePercent = percent(stats.active, stats.total)
  const peak = Math.max(1, ...roleBreakdown.map((row) => row.total))

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
      <div className="flex flex-col gap-4">
        <HeroPanel
          role="admin"
          fullName={profile.fullName}
          loginCode={profile.loginCode}
          summary={`Anda mengelola ${stats.total} akun di ${brand?.name ?? 'sekolah ini'}. ${activePercent}% akun aktif dan siap digunakan.`}
        />

        <MetricGrid>
          <Metric
            icon={<Users className="size-5" />}
            value={String(stats.total)}
            label="Total akun"
            hint={`Tersebar di ${roleBreakdown.length} peran`}
            tone="primary"
          />
          <Metric
            icon={<UserCheck className="size-5" />}
            value={String(stats.active)}
            label="Akun aktif"
            hint={`${activePercent}% dari seluruh akun`}
            tone="success"
            progress={activePercent}
          />
          <Metric
            icon={<UserX className="size-5" />}
            value={String(inactive)}
            label="Akun nonaktif"
            hint={inactive > 0 ? 'Perlu ditinjau' : 'Semua akun aktif'}
            tone={inactive > 0 ? 'danger' : 'success'}
          />
        </MetricGrid>

        <div className="grid gap-3 xl:grid-cols-3">
          <Card className="shadow-none xl:col-span-1">
            <CardHeader>
              <p className="text-base font-semibold text-foreground">Kesehatan akun</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Berapa banyak akun yang bisa masuk hari ini.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Donut value={activePercent} />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold leading-none tabular-nums text-foreground">
                    {activePercent}%
                  </span>
                  <span className="mt-1 text-sm text-muted-foreground">akun aktif</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 rounded-lg bg-muted px-3 py-2.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                    Aktif
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">{stats.active}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="size-2 rounded-full bg-muted-foreground/50"
                      aria-hidden="true"
                    />
                    Nonaktif
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">{inactive}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none xl:col-span-2">
            <CardHeader>
              <p className="text-base font-semibold text-foreground">Sebaran peran</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Jumlah akun pada setiap peran. Panjang batang dibandingkan dengan peran terbanyak.
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
        </div>

        <Card className="gap-0 py-0 shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
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
            <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
              <span className="grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium text-foreground">Belum ada akun</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Jalankan seeder untuk membuat akun contoh, lalu akun terbaru akan muncul di sini.
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
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-ink">
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

function Donut({ value }: { value: number }) {
  const radius = 15.9155
  const circumference = 2 * Math.PI * radius
  const filled = (value / 100) * circumference

  return (
    <svg
      viewBox="0 0 36 36"
      className="size-20 shrink-0 -rotate-90"
      role="img"
      aria-label={`${value}% akun aktif`}
    >
      <circle cx="18" cy="18" r={radius} fill="none" strokeWidth="4" className="stroke-muted" />
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        className="stroke-primary transition-[stroke-dasharray] duration-500"
        strokeDasharray={`${filled} ${circumference}`}
      />
    </svg>
  )
}

AdminPanel.layout = [AppLayout]
