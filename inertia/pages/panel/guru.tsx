import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { usePage } from '@inertiajs/react'
import {
  BookMarked,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { InfoCard, TaskList, percent } from '~/components/panel_stats'
import { StatCard } from '~/components/dashboard/stat_card'

type Props = {
  profile: { fullName: string | null; loginCode: string | null; role: string }
  stats: { students: number; teachers: number; active: number }
}

const TUGAS = [
  {
    icon: ClipboardList,
    label: 'Input nilai',
    note: 'Input manual dan tempel dari Excel',
    status: 'belum' as const,
  },
  {
    icon: FileCheck2,
    label: 'Absensi kelas',
    note: 'Kehadiran per pertemuan',
    status: 'belum' as const,
  },
  {
    icon: BookMarked,
    label: 'Materi & tugas',
    note: 'Bahan ajar dan penugasan siswa',
    status: 'belum' as const,
  },
]

export default function GuruPanel() {
  const { profile, stats } = usePage<Props>().props
  const brand = usePage().props.brand
  const guruPercent = percent(stats.teachers, stats.students + stats.teachers)
  const ratio = stats.teachers > 0 ? Math.round(stats.students / stats.teachers) : 0

  return (
    <Page title="Panel guru" hideTitle description={undefined}>
      <div className="flex flex-col gap-5">
        <div className="@container/main flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{brand?.name ?? 'Sekolah'} · Guru</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground @[480px]:text-3xl">
            Selamat mengajar, {profile.fullName?.split(' ')[0] ?? 'Bapak/Ibu'}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Lembaga ini memiliki {stats.students} siswa dan {stats.teachers} guru. Pekerjaan
            mengajar akan muncul di sini setelah modul akademik diaktifkan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <StatCard
            label="Siswa"
            value={stats.students}
            icon={GraduationCap}
            footnote="Seluruh siswa terdaftar"
            accent="primary"
            highlight
          />
          <StatCard
            label="Rekan guru"
            value={stats.teachers}
            icon={Users}
            footnote="Guru yang dapat Anda koordinasikan"
            accent="info"
          />
          <StatCard
            label="Porsi guru"
            value={`${guruPercent}%`}
            icon={TrendingUp}
            footnote="Terhadap total pengguna akademik"
            accent="success"
          />
          <StatCard
            label="Rasio kelas"
            value={ratio > 0 ? ratio : '—'}
            unit={ratio > 0 ? 'siswa/guru' : undefined}
            icon={Users}
            footnote={ratio > 0 ? 'Beban rata-rata per guru' : 'Belum ada guru terdaftar'}
            accent="warning"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-3">
          <div className="@4xl/main:col-span-2">
            <TaskList
              title="Tugas mengajar"
              description="Pekerjaan harian Anda. Label menunjukkan apakah modulnya sudah dapat dipakai."
              items={TUGAS}
            />
          </div>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Prinsip input data</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <InfoCard title="Pratinjau sebelum simpan" tone="info">
                Input massal dari Excel selalu ditampilkan dulu. Baris bermasalah ditandai sebelum
                data masuk.
              </InfoCard>
              <InfoCard title="Setiap perubahan tercatat" tone="success">
                Perubahan nilai menyimpan jejak siapa mengubah, kapan, dan nilai sebelumnya.
              </InfoCard>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Daftar kelas ajar, jadwal, dan antrean penilaian akan muncul setelah modul akademik
                aktif.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}

GuruPanel.layout = [AppLayout]
