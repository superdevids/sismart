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
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import {
  HeroPanel,
  InfoCard,
  Metric,
  MetricGrid,
  TaskList,
  percent,
} from '~/components/panel_stats'

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
  const total = stats.active + stats.inactive
  const activePercent = percent(stats.active, total)

  return (
    <Page title="Panel tata usaha" hideTitle description={undefined}>
      <div className="flex flex-col gap-4">
        <HeroPanel
          role="staff"
          fullName={profile.fullName}
          loginCode={profile.loginCode}
          summary={`Anda menangani administrasi ${stats.students} siswa. ${stats.inactive > 0 ? `${stats.inactive} akun nonaktif perlu ditinjau.` : 'Seluruh akun saat ini aktif.'}`}
        />

        <MetricGrid>
          <Metric
            icon={<GraduationCap className="size-5" />}
            value={String(stats.students)}
            label="Siswa"
            hint="Basis data siswa terdaftar"
            tone="primary"
          />
          <Metric
            icon={<UserCheck className="size-5" />}
            value={String(stats.active)}
            label="Akun aktif"
            hint={`${activePercent}% dari seluruh akun dapat masuk`}
            tone="success"
            progress={activePercent}
          />
          <Metric
            icon={<UserX className="size-5" />}
            value={String(stats.inactive)}
            label="Akun nonaktif"
            hint={stats.inactive > 0 ? 'Perlu ditinjau ulang' : 'Tidak ada akun tertahan'}
            tone={stats.inactive > 0 ? 'danger' : 'success'}
          />
        </MetricGrid>

        <div className="grid gap-3 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TaskList
              title="Antrean administrasi"
              description="Pekerjaan tata usaha yang akan tersedia pada halaman ini."
              items={ANTREAN}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Card className="shadow-none">
              <CardHeader>
                <p className="text-base font-semibold text-foreground">Kontak cepat</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Siapa dihubungi untuk kendala tertentu.
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <InfoCard title="Akun siswa & orang tua" tone="info">
                  Reset ID Pengguna dan password dilakukan oleh administrator sekolah, bukan tata
                  usaha.
                </InfoCard>
                <InfoCard title="Pembayaran tunai" tone="warning">
                  Selalu dicatat lewat modul keuangan agar tercatat atomik dan tidak dobel.
                </InfoCard>
              </CardContent>
            </Card>

            <InfoCard title="Data sensitif" tone="success">
              <span className="inline-flex items-start gap-1.5">
                <ShieldCheck className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                Data keuangan siswa hanya untuk keperluan administrasi sekolah.
              </span>
            </InfoCard>
          </div>
        </div>
      </div>
    </Page>
  )
}

StaffPanel.layout = [AppLayout]
