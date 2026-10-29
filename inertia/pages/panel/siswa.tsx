import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { usePage } from '@inertiajs/react'
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  KeyRound,
  MessageSquare,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { EasyTile, InfoCard, TaskList } from '~/components/panel_stats'

type Props = {
  profile: { fullName: string | null; loginCode: string | null; role: string }
}

const MENU = [
  {
    icon: BookOpen,
    label: 'Nilai rapor',
    note: 'Nilai harian dan rapor semester',
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
    note: 'Rekap kehadiran setiap bulan',
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
  const brand = usePage().props.brand

  return (
    <Page title="Panel siswa" hideTitle description={undefined}>
      <div className="flex flex-col gap-5">
        <div className="@container/main flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{brand?.name ?? 'Sekolah'} · Siswa</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground @[480px]:text-3xl">
            Semangat belajar, {profile.fullName?.split(' ')[0] ?? 'Siswa'}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Semua yang kamu butuhkan soal sekolah akan ada di satu tempat ini. Tidak perlu melakukan
            apa pun untuk mengaktifkannya.
          </p>
        </div>

        {/* Tiga hal yang paling sering dicari siswa */}
        <div className="grid grid-cols-1 gap-3 @xl/main:grid-cols-3">
          <EasyTile
            icon={BookOpen}
            title="Lihat nilai"
            hint="Nilai harian & rapor"
            tone="primary"
          />
          <EasyTile
            icon={CalendarDays}
            title="Lihat jadwal"
            hint="Jadwal mingguan kelas"
            tone="info"
          />
          <EasyTile
            icon={ClipboardCheck}
            title="Cek kehadiran"
            hint="Hadir, izin, sakit, alpa"
            tone="success"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-3">
          <div className="@4xl/main:col-span-2">
            <TaskList
              title="Akan tersedia untukmu"
              description="Empat menu ini sedang disiapkan sekolah dan akan muncul otomatis."
              items={MENU}
              footer="Jika ada nilai atau kehadiran yang menurutmu keliru, hubungi wali kelas. Siswa tidak dapat mengubah data sendiri."
            />
          </div>

          <div className="flex flex-col gap-3">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">
                  <KeyRound className="size-4 text-primary" aria-hidden="true" />
                  Identitas kamu
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2">
                  <span className="text-sm text-muted-foreground">Nama</span>
                  <span className="truncate text-sm font-medium text-foreground">
                    {profile.fullName ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2">
                  <span className="text-sm text-muted-foreground">ID Pengguna</span>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {profile.loginCode ?? '—'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Dipakai saat masuk ke sistem, bersama password.
                </p>
              </CardContent>
            </Card>

            <InfoCard title="Butuh bantuan?" tone="warning">
              <span className="inline-flex items-start gap-1.5">
                <MessageSquare className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                Lupa password? Minta admin sekolah mengatur ulang. Jangan bagikan ID atau password
                kepada siapa pun.
              </span>
            </InfoCard>

            <InfoCard title="Privasi" tone="info">
              <span className="inline-flex items-start gap-1.5">
                <Sparkles className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                Nilaimu hanya bisa dilihat oleh kamu, orang tua, dan gurumu.
              </span>
            </InfoCard>
          </div>
        </div>
      </div>
    </Page>
  )
}

SiswaPanel.layout = [AppLayout]
