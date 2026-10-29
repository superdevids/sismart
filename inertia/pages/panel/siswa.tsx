import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { usePage } from '@inertiajs/react'
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  KeyRound,
  MessageSquare,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { HeroPanel, InfoCard, QuickLink, TaskList } from '~/components/panel_stats'

type Props = {
  profile: { fullName: string | null; loginCode: string | null; role: string }
}

const MENU = [
  {
    icon: BookOpen,
    label: 'Nilai rapor',
    note: 'Nilai harian dan rapor semester akan tampil di sini',
    status: 'belum' as const,
  },
  {
    icon: CalendarDays,
    label: 'Jadwal pelajaran',
    note: 'Jadwal mingguan per kelas',
    status: 'belum' as const,
  },
  {
    icon: ClipboardCheck,
    label: 'Absensi',
    note: 'Rekap kehadiran Anda setiap bulan',
    status: 'belum' as const,
  },
  {
    icon: Wallet,
    label: 'Tagihan sekolah',
    note: 'Status pembayaran SPP dan tagihan lain',
    status: 'belum' as const,
  },
]

export default function SiswaPanel() {
  const { profile } = usePage<Props>().props

  return (
    <Page title="Panel siswa" hideTitle description={undefined}>
      <div className="flex flex-col gap-4">
        <HeroPanel
          role="siswa"
          fullName={profile.fullName}
          loginCode={profile.loginCode}
          summary="Halaman ini akan menjadi tempat Anda melihat nilai, jadwal, kehadiran, dan tagihan sekolah dalam satu tempat."
        />

        <div className="grid gap-3 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TaskList
              title="Akan tersedia untuk Anda"
              description="Empat hal ini sedang disiapkan sekolah. Anda tidak perlu melakukan apa pun untuk mengaktifkannya."
              items={MENU}
              footer="Jika ada nilai atau kehadiran yang menurut Anda keliru, hubungi wali kelas. Siswa tidak dapat mengubah data sendiri."
            />
          </div>

          <div className="flex flex-col gap-3">
            <Card className="shadow-none">
              <CardHeader>
                <p className="text-base font-semibold text-foreground">Identitas Anda</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Dipakai saat masuk ke sistem bersama password.
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2">
                  <span className="text-sm text-muted-foreground">Nama</span>
                  <span className="truncate text-sm font-medium text-foreground">
                    {profile.fullName ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <KeyRound className="size-3.5" aria-hidden="true" />
                    ID Pengguna
                  </span>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {profile.loginCode ?? '—'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <p className="text-base font-semibold text-foreground">Butuh bantuan?</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <QuickLink
                  icon={MessageSquare}
                  label="Lupa password"
                  note="Minta admin sekolah mengatur ulang"
                  tone="warning"
                />
                <InfoCard title="Jaga kerahasiaan ID dan password" tone="info">
                  Jangan bagikan ID Pengguna atau password kepada siapa pun, termasuk yang mengaku
                  dari pihak sekolah.
                </InfoCard>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  )
}

SiswaPanel.layout = [AppLayout]
