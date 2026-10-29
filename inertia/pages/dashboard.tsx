import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { type ReactNode } from 'react'
import { ArrowRight, ShieldCheck, UserCheck, Users } from 'lucide-react'
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

/**
 * Dasbor Sismart. Semua angka di halaman ini dibaca dari tabel `users`
 * sungguhan. Modul akademik (nilai, absensi, SPP) belum ada di basis data,
 * jadi tidak ditampilkan sebagai angka palsu.
 */
export default function Dashboard() {
  const { stats, roleBreakdown, recentUsers } = usePage<Props>().props
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'

  const inactive = stats.total - stats.active
  const filledRoles = roleBreakdown.filter((r) => r.total > 0)

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={<Users className="size-4" />}
          value={String(stats.total)}
          title="Total akun"
          hint="Seluruh pengguna terdaftar"
        />
        <StatCard
          icon={<UserCheck className="size-4" />}
          value={String(stats.active)}
          title="Akun aktif"
          hint={`${inactive} akun nonaktif`}
        />
        <StatCard
          icon={<ShieldCheck className="size-4" />}
          value={String(filledRoles.length)}
          title="Peran terpakai"
          hint={`dari ${roleBreakdown.length} peran tersedia`}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Akun terbaru</CardTitle>
            <CardDescription>Lima akun yang paling akhir ditambahkan.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {recentUsers.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                Belum ada akun. Jalankan seeder untuk membuat data awal.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Nama</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead className="pr-5">Peran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="pl-5 font-medium">{u.fullName ?? '—'}</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                          {u.loginCode ?? '—'}
                        </code>
                      </TableCell>
                      <TableCell className="pr-5">
                        <Badge variant={u.isActive ? 'muted' : 'destructive'}>
                          {ROLE_LABELS[u.role] ?? u.role}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sebaran peran</CardTitle>
            <CardDescription>Jumlah akun untuk setiap peran.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {roleBreakdown.map((r) => {
              const pct = stats.total > 0 ? Math.round((r.total / stats.total) * 100) : 0
              return (
                <div key={r.role} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-foreground">
                      {ROLE_LABELS[r.role] ?? r.role}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{r.total}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${pct}%` }}
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
    <Card size="sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
          {value}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

Dashboard.layout = [AppLayout]
