import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { usePage } from '@inertiajs/react'
import {
  BookOpen,
  ClipboardCheck,
  HeartHandshake,
  Info,
  Link2,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { EasyTile, InfoCard, QuickLink, TaskList } from '~/components/panel_stats'

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
  const brand = usePage().props.brand

  return (
    <Page title="Panel orang tua" hideTitle description={undefined}>
      <div className="flex flex-col gap-5">
        <div className="@container/main flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{brand?.name ?? 'Sekolah'} · Orang tua</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground @[480px]:text-3xl">
            Terima kasih telah mendampingi
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pantau perkembangan belajar dan kewajiban administrasi{' '}
            {profile.fullName ? 'anak Anda' : 'anak Anda'} dalam satu tampilan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 @xl/main:grid-cols-3">
          <EasyTile
            icon={BookOpen}
            title="Nilai anak"
            hint="Harian & rapor semester"
            tone="primary"
          />
          <EasyTile
            icon={ClipboardCheck}
            title="Kehadiran"
            hint="Hadir, izin, sakit, alpa"
            tone="info"
          />
          <EasyTile
            icon={Wallet}
            title="Tagihan SPP"
            hint="Status & riwayat bayar"
            tone="success"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-3">
          <div className="@4xl/main:col-span-2">
            <TaskList
              title="Ringkasan anak"
              description="Tiga informasi utama yang akan tersedia setelah modul akademik dan keuangan diaktifkan."
              items={PANTAUAN}
              footer="Satu akun orang tua dapat ditautkan ke lebih dari satu anak, sehingga ringkasan tiap anak tampil terpisah."
            />
          </div>

          <div className="flex flex-col gap-3">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">
                  <HeartHandshake className="size-4 text-success" aria-hidden="true" />
                  Langkah berikutnya
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <QuickLink
                  icon={Link2}
                  label="Tautkan akun ke data anak"
                  note="Dilakukan oleh tata usaha sekolah"
                  tone="primary"
                />
                <QuickLink
                  icon={Info}
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
                <ShieldCheck className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                Nilai dan kehadiran hanya dapat dilihat oleh Anda, anak, dan guru yang bersangkutan.
              </span>
            </InfoCard>
          </div>
        </div>
      </div>
    </Page>
  )
}

OrangTuaPanel.layout = [AppLayout]
