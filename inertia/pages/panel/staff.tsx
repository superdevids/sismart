import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { usePage } from '@inertiajs/react'
import {
  CalendarClock,
  GraduationCap,
  Receipt,
  ShieldCheck,
  UserCheck,
  UserRound,
  UserX,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { InfoCard, TaskList, percent } from '~/components/panel_stats'
import { StatCard } from '~/components/dashboard/stat_card'

type Props = {
  profile: { fullName: string | null; loginCode: string | null; role: string }
  stats: { students: number; active: number; inactive: number }
}

const ANTREAN = [
  {
    icon: Receipt,
    label: 'Tagihan SPP',
    note: 'Membuat dan meninjau tagihan per siswa',
    status: 'belum' as const,
  },
  {
    icon: UserRound,
    label: 'Pembayaran tunai',
    note: 'Pencatatan setoran di kantor tata usaha',
    status: 'belum' as const,
  },
  {
    icon: GraduationCap,
    label: 'Data siswa',
    note: 'Biodata, NIS, kelas, dan status siswa',
    status: 'belum' as const,
  },
  {
    icon: CalendarClock,
    label: 'Agenda operasional',
    note: 'Surat, inventaris, dan kegiatan sekolah',
    status: 'belum' as const,
  },
]

export default function StaffPanel() {
  const { profile, stats } = usePage<Props>().props
  const brand = usePage().props.brand
  const total = stats.active + stats.inactive
  const activePercent = percent(stats.active, total)
  const dormantPercent = percent(stats.inactive, total)

  return (
    <Page title="Panel tata usaha" hideTitle description={undefined}>
      <div className="flex flex-col gap-5">
        <div className="@container/main flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{brand?.name ?? 'Sekolah'} · Tata usaha</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground @[480px]:text-3xl">
            Selamat bertugas, {profile.fullName?.split(' ')[0] ?? 'Bapak/Ibu'}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Anda menangani administrasi {stats.students} siswa.{' '}
            {stats.inactive > 0
              ? `${stats.inactive} akun nonaktif perlu ditinjau.`
              : 'Seluruh akun saat ini aktif.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <StatCard
            label="Siswa"
            value={stats.students}
            icon={GraduationCap}
            footnote="Basis data siswa terdaftar"
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
            value={stats.inactive}
            icon={UserX}
            trend={
              stats.inactive > 0
                ? { value: `${dormantPercent}%`, direction: 'down' }
                : { value: 'Bersih', direction: 'flat' }
            }
            footnote={stats.inactive > 0 ? 'Perlu ditinjau ulang' : 'Tidak ada akun tertahan'}
            accent={stats.inactive > 0 ? 'warning' : 'success'}
          />
          <StatCard
            label="Pekerjaan menunggu"
            value={ANTREAN.length}
            unit="modul"
            icon={CalendarClock}
            footnote="Akan aktif bertahap"
            accent="info"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-3">
          <div className="@4xl/main:col-span-2">
            <TaskList
              title="Antrean administrasi"
              description="Pekerjaan tata usaha yang akan tersedia pada halaman ini."
              items={ANTREAN}
            />
          </div>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Kontak cepat</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <InfoCard title="Akun siswa & orang tua" tone="info">
                Reset ID Pengguna dan password dilakukan oleh administrator sekolah, bukan tata
                usaha.
              </InfoCard>
              <InfoCard title="Pembayaran tunai" tone="warning">
                Selalu dicatat lewat modul keuangan agar tercatat atomik dan tidak dobel.
              </InfoCard>
              <InfoCard title="Data sensitif" tone="success">
                <span className="inline-flex items-start gap-1.5">
                  <ShieldCheck className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                  Data keuangan siswa hanya untuk keperluan administrasi sekolah.
                </span>
              </InfoCard>
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}

StaffPanel.layout = [AppLayout]
