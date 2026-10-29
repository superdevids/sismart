import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { type ReactNode } from 'react'
import { ArrowRight, UserCheck, Users, UserX } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
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

type Props = {
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

const ROLE_LABELS: Record<string, string> = {
  siswa: 'Siswa',
  orang_tua: 'Orang tua',
  guru: 'Guru',
  staff: 'Staff',
  kepsek: 'Kepala sekolah',
  admin: 'Admin',
}

const DATE_FORMAT = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const percent = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0)

function formatDate(value: string | null) {
  return value ? DATE_FORMAT.format(new Date(value)) : '—'
}

function initials(name: string | null, code: string | null) {
  const [first, second] = (name ?? code ?? '').trim().split(/\s+/)
  return `${first?.[0] ?? ''}${second?.[0] ?? ''}`.toUpperCase() || '—'
}

export default function Dashboard() {
  const { stats, roleBreakdown, recentUsers } = usePage<Props>().props
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'

  const inactive = stats.total - stats.active
  const activePercent = percent(stats.active, stats.total)
  const inactivePercent = percent(inactive, stats.total)

  return (
    <Page
      title="Dasbor"
      description={`Ringkasan akun ${brandName}. Angka dibaca langsung dari basis data.`}
      actions={
        <Button asChild size="sm" className="h-9">
          <Link route="users.index">
            Kelola pengguna
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="col-span-full grid gap-4 xl:grid-cols-3">
          <StatCard
            icon={<Users className="size-4" />}
            value={String(stats.total)}
            title="Total akun"
            hint={`${roleBreakdown.length} peran tersedia`}
          />
          <StatCard
            icon={<UserCheck className="size-4" />}
            value={String(stats.active)}
            title="Akun aktif"
            hint={`${activePercent}% dari total akun`}
          />
          <StatCard
            icon={<UserX className="size-4" />}
            value={String(inactive)}
            title="Akun nonaktif"
            hint={`${inactivePercent}% dari total akun`}
          />
        </div>

        <Card className="col-span-full shadow-none xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Aktivasi akun</CardTitle>
            <CardDescription>Perbandingan akun aktif dan nonaktif.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Donut value={activePercent} />
              <div className="flex flex-col">
                <span className="text-2xl font-semibold tabular-nums text-foreground">
                  {activePercent}%
                </span>
                <span className="text-sm text-muted-foreground">akun aktif</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <LegendRow label="Aktif" value={stats.active} tone="bg-primary" />
              <LegendRow label="Nonaktif" value={inactive} tone="bg-muted-foreground/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full shadow-none xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Sebaran peran</CardTitle>
            <CardDescription>Jumlah akun untuk setiap peran yang tersedia.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 xl:grid-cols-2">
            {roleBreakdown.map((row) => (
              <div key={row.role} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {ROLE_LABELS[row.role] ?? row.role}
                  </span>
                  <span className="text-sm tabular-nums text-muted-foreground">{row.total}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${percent(row.total, stats.total)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-full gap-0 py-0 shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
            <div className="min-w-0">
              <p className="text-lg font-semibold text-foreground">Akun terbaru</p>
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
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              Belum ada akun. Jalankan seeder untuk membuat data awal.
            </p>
          ) : (
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
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {initials(user.fullName, user.loginCode)}
                        </span>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium text-foreground">
                            {user.fullName ?? '—'}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {user.loginCode ?? '—'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'success' : 'muted'}>
                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </Page>
  )
}

function StatCard({
  icon,
  value,
  title,
  hint,
}: {
  icon: ReactNode
  value: string
  title: string
  hint: string
}) {
  return (
    <Card size="sm" className="shadow-none">
      <CardHeader className="flex flex-row items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="text-2xl font-semibold tabular-nums text-foreground">{value}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <span className="text-base font-semibold text-foreground">{title}</span>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

function LegendRow({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={`size-2 rounded-full ${tone}`} />
        {label}
      </span>
      <span className="text-sm font-medium tabular-nums text-foreground">{value}</span>
    </div>
  )
}

function Donut({ value }: { value: number }) {
  const radius = 15.9155
  const circumference = 2 * Math.PI * radius
  const filled = (value / 100) * circumference

  return (
    <svg
      viewBox="0 0 36 36"
      className="size-16 shrink-0 -rotate-90"
      role="img"
      aria-label={`${value}% akun aktif`}
    >
      <circle cx="18" cy="18" r={radius} fill="none" strokeWidth="3.5" className="stroke-muted" />
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        className="stroke-primary"
        strokeDasharray={`${filled} ${circumference}`}
      />
    </svg>
  )
}

Dashboard.layout = [AppLayout]
