import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { usePage } from '@inertiajs/react'
import { type ReactNode } from 'react'
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  LayoutGrid,
  Users,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

/**
 * Dasbor awal Sismart. Angka di bawah adalah contoh tampilan (belum membaca
 * database) supaya tata letak dapat dinilai; ganti dengan data nyata pada
 * modul terkait.
 */
export default function Dashboard() {
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'

  return (
    <Page
      title="Dasbor"
      description={`Ringkasan operasional ${brandName} hari ini.`}
      actions={<Badge variant="muted">Contoh data</Badge>}
    >
      {/* Kartu statistik */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users className="size-4" />}
          value="1.248"
          title="Siswa aktif"
          change="+12"
          hint="dibanding bulan lalu"
        />
        <StatCard
          icon={<GraduationCap className="size-4" />}
          value="78,4"
          title="Rata-rata nilai"
          change="+1,2"
          hint="dibanding semester lalu"
        />
        <StatCard
          icon={<CalendarDays className="size-4" />}
          value="96%"
          title="Kehadiran bulan ini"
          change="+2%"
          hint="dibanding bulan lalu"
        />
        <StatCard
          icon={<Wallet className="size-4" />}
          value="182/210"
          title="SPP terbayar"
          change="86,7%"
          hint="dari total tagihan"
        />
      </div>

      {/* Tabel + panel samping */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pembayaran SPP terbaru</CardTitle>
            <CardDescription>Lima transaksi terakhir yang tercatat.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                  <TableHead className="pr-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ['Ayu Lestari', 'XII RPL 1', 'Oktober 2026', 'Rp350.000', 'Lunas'],
                  ['Bagas Pratama', 'XI TKJ 2', 'Oktober 2026', 'Rp350.000', 'Lunas'],
                  ['Citra Dewi', 'X DKV 1', 'Oktober 2026', 'Rp300.000', 'Menunggu'],
                  ['Dimas Saputra', 'XII RPL 1', 'September 2026', 'Rp350.000', 'Lunas'],
                  ['Eka Nuraini', 'XI AKL 1', 'September 2026', 'Rp300.000', 'Tertunda'],
                ].map(([name, grade, period, amount, status]) => (
                  <TableRow key={`${name}-${period}`}>
                    <TableCell className="pl-5 font-medium">{name}</TableCell>
                    <TableCell className="text-muted-foreground">{grade}</TableCell>
                    <TableCell className="text-muted-foreground">{period}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{amount}</TableCell>
                    <TableCell className="pr-5">
                      <StatusBadge status={status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda pekan ini</CardTitle>
            <CardDescription>Kegiatan yang perlu perhatian.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              ['Penilaian tengah semester', 'Sen–Kam · semua kelas'],
              ['Rapat wali murid kelas XII', 'Jumat · 09.00'],
              ['Batas pembayaran SPP', 'Sabtu · 23.59'],
            ].map(([title, meta]) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  <BookOpenCheck className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium leading-snug text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <LayoutGrid className="size-3.5" />
        Modul berikutnya menyusul sesuai rencana implementasi di{' '}
        <code className="rounded bg-muted px-1 py-0.5 font-mono">docs/IPD.md</code>
      </p>
    </Page>
  )
}

function StatCard({
  icon,
  value,
  title,
  change,
  hint,
}: {
  icon: ReactNode
  value: string
  title: string
  change: string
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
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <p className="flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-0.5 font-medium text-success">
            <ArrowUpRight className="size-3" />
            {change}
          </span>
          <span className="text-muted-foreground">{hint}</span>
        </p>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Lunas') return <Badge variant="success">Lunas</Badge>
  if (status === 'Menunggu') return <Badge variant="warning">Menunggu</Badge>
  return <Badge variant="destructive">Tertunda</Badge>
}

Dashboard.layout = [AppLayout]
