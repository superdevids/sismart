import MarketingLayout from '~/layouts/marketing'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Megaphone,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function Home() {
  return (
    <div className="animate-fade">
      <Hero />
      <Modules />
      <ForWho />
      <HowIt />
      <FinalCta />
      <Footer />
    </div>
  )
}

function useBrand() {
  const brand = usePage().props.brand
  return {
    name: brand?.name ?? 'SMKN 1 Indonesia',
    tagline: brand?.tagline ?? 'Sistem informasi sekolah',
    institutionType: brand?.institutionType ?? 'Sekolah',
  }
}

function Hero() {
  const brand = useBrand()
  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 xl:grid-cols-[1.05fr_1fr] xl:px-8 xl:py-24">
      <div className="animate-rise">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
          {brand.tagline}
        </p>
        <h1 className="mt-4 text-[clamp(32px,4.6vw,56px)] font-extrabold leading-[1.05] tracking-tight text-foreground">
          Seluruh urusan {brand.institutionType.toLowerCase()},{' '}
          <span className="xl:block">dalam satu tempat.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Sismart menyatukan data siswa, nilai, absensi, dan pembayaran SPP untuk sekolah SD hingga
          SMK. Guru, tata usaha, orang tua, dan siswa bekerja dari satu sumber yang sama.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="h-11 rounded-xl px-5 text-sm font-semibold">
            <Link route="session.create">
              Masuk
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 rounded-xl px-5 text-sm font-semibold"
          >
            <a href="#peran">Lihat per peran</a>
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Akses hanya dengan ID Pengguna dan password dari administrator sekolah.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="relative rounded-2xl border border-border bg-card p-1.5 shadow-2xl shadow-foreground/10 animate-rise"
      >
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <div className="flex items-center gap-1.5 border-b border-border/60 pb-3">
            <span className="size-2 rounded-full bg-destructive/70" />
            <span className="size-2 rounded-full bg-warning/70" />
            <span className="size-2 rounded-full bg-success/70" />
            <span className="ml-2 text-xs font-medium text-muted-foreground">Sismart · Dasbor</span>
          </div>

          <div className="mt-3 flex flex-col gap-1">
            {[
              ['Nilai rata-rata kelas', '78,4'],
              ['Kehadiran bulan ini', '96%'],
              ['Tagihan SPP terbayar', '182 / 210'],
              ['Agenda pekan ini', '5 kegiatan'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-muted/60"
              >
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <p className="mt-2 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
            Contoh tampilan dasbor
          </p>
        </div>
      </div>
    </section>
  )
}

const MODULES = [
  {
    icon: GraduationCap,
    title: 'Data siswa & kelas',
    body: 'Biodata, NIS, kelas, dan status siswa terkelola rapi — siap untuk laporan kapan pun.',
  },
  {
    icon: BookOpenCheck,
    title: 'Nilai & rapor',
    body: 'Input nilai manual atau tempel dari Excel, lalu susun rapor per semester.',
  },
  {
    icon: ClipboardList,
    title: 'Absensi',
    body: 'Catat kehadiran per pertemuan; rekap izin, sakit, dan alpa otomatis.',
  },
  {
    icon: Wallet,
    title: 'Keuangan & SPP',
    body: 'Buat tagihan massal, catat pembayaran tunai maupun online, dan lihat tunggakan.',
  },
  {
    icon: CalendarDays,
    title: 'Jadwal pelajaran',
    body: 'Susun jadwal per kelas dan mata pelajaran; guru dan siswa melihatnya langsung.',
  },
  {
    icon: Megaphone,
    title: 'Pengumuman & portal',
    body: 'Sampaikan berita dan informasi sekolah lewat portal publik yang dapat dikelola.',
  },
]

function Modules() {
  return (
    <section id="modul" className="border-y border-border bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 xl:px-8 xl:py-20">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-foreground xl:text-3xl">
            Yang bisa dikerjakan di Sismart
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Modul-modul inti untuk operasional sekolah sehari-hari.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-4 xl:grid-cols-3">
          {MODULES.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="group rounded-2xl border border-border bg-card p-5 text-card-foreground transition-transform hover:-translate-y-0.5"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const ROLES = [
  {
    icon: Users,
    name: 'Guru',
    line: 'Input nilai dan absensi, unggah materi, susun jadwal mengajar.',
  },
  {
    icon: Wallet,
    name: 'Tata usaha',
    line: 'Kelola SPP, pembayaran, data siswa, inventaris, dan surat.',
  },
  {
    icon: ShieldCheck,
    name: 'Kepala sekolah',
    line: 'Pantau ringkasan kehadiran, keuangan, dan agenda lewat satu dasbor.',
  },
  {
    icon: CreditCard,
    name: 'Orang tua',
    line: 'Lihat nilai, kehadiran, dan tagihan anak; bayar SPP secara online.',
  },
]

function ForWho() {
  return (
    <section id="peran" className="mx-auto w-full max-w-7xl px-4 py-16 xl:px-8 xl:py-20">
      <header className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground xl:text-3xl">
          Satu sistem, banyak peran
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Setiap pengguna melihat dan mengerjakan bagiannya sendiri — sesuai peran.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {ROLES.map(({ icon: Icon, name, line }) => (
          <article
            key={name}
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
              <Icon size={15} strokeWidth={1.8} className="text-primary" />
              {name}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{line}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

const STEPS = [
  {
    n: '01',
    t: 'Terima ID Pengguna',
    d: 'Administrator sekolah memberi setiap pengguna ID Pengguna dan password awal.',
  },
  {
    n: '02',
    t: 'Masuk ke Sismart',
    d: 'Buka halaman masuk, masukkan ID Pengguna dan password, lalu Anda diarahkan ke dasbor.',
  },
  {
    n: '03',
    t: 'Kerjakan bagian Anda',
    d: 'Guru mengajar dan menilai; tata usaha mengelola; orang tua memantau.',
  },
]

function HowIt() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 xl:px-8 xl:py-20">
        <h2 className="text-2xl font-bold tracking-tight text-foreground xl:text-3xl">
          Sesederhana tiga langkah
        </h2>

        <ol className="mt-10 grid grid-cols-1 gap-4 xl:grid-cols-3">
          {STEPS.map(({ n, t, d }) => (
            <li key={n} className="rounded-2xl border border-border bg-card p-5">
              <span className="text-xs font-semibold tabular-nums text-primary">{n}</span>
              <h3 className="mt-2.5 text-base font-semibold tracking-tight text-foreground">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 xl:px-8 xl:py-24">
      <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center xl:px-12">
        <h2 className="text-2xl font-bold tracking-tight text-foreground xl:text-3xl">
          Sudah punya ID Pengguna?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Masuk sekarang dan mulai dari dasbor Anda.
        </p>
        <Button asChild size="lg" className="mt-6 h-11 rounded-xl px-5 text-sm font-semibold">
          <Link route="session.create">
            Masuk
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </section>
  )
}

function Footer() {
  const brand = useBrand()
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 xl:flex-row xl:items-center xl:justify-between xl:px-8">
        <div className="flex flex-col">
          <strong className="text-base font-semibold text-foreground">{brand.name}</strong>
          <span className="mt-0.5 text-sm text-muted-foreground">{brand.tagline}</span>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Sismart membantu satu lembaga sekolah mengelola akademik dan keuangan dalam satu tempat.
        </p>
      </div>
    </footer>
  )
}

Home.layout = [MarketingLayout]
