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
  const guruPercent = percent(stats.teachers, stats.students + stats.teachers)

  return (
    <Page title="Panel guru" hideTitle description={undefined}>
      <div className="flex flex-col gap-4">
        <HeroPanel
          role="guru"
          fullName={profile.fullName}
          loginCode={profile.loginCode}
          summary={`Lembaga ini memiliki ${stats.students} siswa dan ${stats.teachers} guru. Pekerjaan mengajar akan muncul di halaman ini setelah modul akademik diaktifkan.`}
        />

        <MetricGrid>
          <Metric
            icon={<GraduationCap className="size-5" />}
            value={String(stats.students)}
            label="Siswa"
            hint="Seluruh siswa yang terdaftar di lembaga"
            tone="primary"
          />
          <Metric
            icon={<Users className="size-5" />}
            value={String(stats.teachers)}
            label="Rekan guru"
            hint="Guru yang dapat Anda koordinasikan"
            tone="info"
          />
          <Metric
            icon={<TrendingUp className="size-5" />}
            value={`${guruPercent}%`}
            label="Rasio guru"
            hint="Perbandingan guru terhadap total pengguna akademik"
            tone="success"
            progress={guruPercent}
          />
        </MetricGrid>

        <div className="grid gap-3 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TaskList
              title="Tugas mengajar"
              description="Pekerjaan harian Anda. Label menunjukkan apakah modulnya sudah dapat dipakai."
              items={TUGAS}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Card className="shadow-none">
              <CardHeader>
                <p className="text-base font-semibold text-foreground">Prinsip input data</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Dua aturan yang menjaga nilai tetap dapat dipertanggungjawabkan.
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <InfoCard title="Pratinjau sebelum simpan" tone="info">
                  Input massal dari Excel selalu ditampilkan dulu. Baris bermasalah ditandai sebelum
                  data masuk.
                </InfoCard>
                <InfoCard title="Setiap perubahan tercatat" tone="success">
                  Perubahan nilai menyimpan jejak siapa mengubah, kapan, dan nilai sebelumnya.
                </InfoCard>
              </CardContent>
            </Card>

            <InfoCard title="Tentang halaman ini" tone="info">
              Panel guru dibuat ringkas: hanya informasi yang Anda butuhkan sebelum mulai mengajar.
              Daftar kelas ajar, jadwal, dan antrean penilaian akan muncul di sini.
            </InfoCard>
          </div>
        </div>
      </div>
    </Page>
  )
}

GuruPanel.layout = [AppLayout]
