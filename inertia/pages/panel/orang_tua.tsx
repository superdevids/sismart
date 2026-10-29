import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { usePage } from '@inertiajs/react'
import { BookOpen, ClipboardCheck, Info, Link2, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { HeroPanel, InfoCard, QuickLink, TaskList } from '~/components/panel_stats'

type Props = {
  profile: { fullName: string | null; loginCode: string | null; role: string }
}

const PANTAUAN = [
  {
    icon: BookOpen,
    label: 'Nilai anak',
    note: 'Nilai harian dan rapor semester',
    status: 'belum' as const,
  },
  {
    icon: ClipboardCheck,
    label: 'Kehadiran',
    note: 'Rekap hadir, izin, sakit, dan alpa',
    status: 'belum' as const,
  },
  {
    icon: Wallet,
    label: 'Tagihan SPP',
    note: 'Status tagihan dan riwayat pembayaran',
    status: 'belum' as const,
  },
]

export default function OrangTuaPanel() {
  const { profile } = usePage<Props>().props

  return (
    <Page title="Panel orang tua" hideTitle description={undefined}>
      <div className="flex flex-col gap-4">
        <HeroPanel
          role="orang_tua"
          fullName={profile.fullName}
          loginCode={profile.loginCode}
          summary="Di halaman ini Anda dapat memantau perkembangan belajar dan kewajiban administrasi anak dalam satu tampilan."
        />

        <div className="grid gap-3 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TaskList
              title="Ringkasan anak"
              description="Tiga informasi utama yang akan tersedia setelah modul akademik dan keuangan diaktifkan."
              items={PANTAUAN}
              footer="Satu akun orang tua dapat ditautkan ke lebih dari satu anak, sehingga ringkasan tiap anak tampil terpisah."
            />
          </div>

          <div className="flex flex-col gap-3">
            <Card className="shadow-none">
              <CardHeader>
                <p className="text-base font-semibold text-foreground">Langkah berikutnya</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Yang perlu Anda lakukan agar ringkasan muncul.
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <QuickLink
                  icon={Link2}
                  label="Tautkan akun ke data anak"
                  note="Dilakukan oleh tata usaha sekolah"
                  tone="primary"
                />
                <QuickLink
                  icon={Users}
                  label="Perbarui nomor kontak"
                  note="Melalui tata usaha, bukan lewat pesan"
                  tone="default"
                />
              </CardContent>
            </Card>

            <InfoCard title="Soal password" tone="warning">
              Jika lupa password, minta admin sekolah mengatur ulang. Demi keamanan, password tidak
              dikirim melalui pesan atau telepon.
            </InfoCard>

            <InfoCard title="Privasi data anak" tone="info">
              <span className="inline-flex items-start gap-1.5">
                <Info className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                Data nilai dan kehadiran hanya dapat dilihat oleh Anda, anak, dan guru yang
                bersangkutan.
              </span>
            </InfoCard>
          </div>
        </div>
      </div>
    </Page>
  )
}

OrangTuaPanel.layout = [AppLayout]
