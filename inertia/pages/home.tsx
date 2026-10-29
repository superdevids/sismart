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

/**
 * Landing page Sismart — halaman publik di `/`.
 *
 * Nama sekolah (brand) berasal dari pengaturan yang dapat diubah admin, bukan
 * teks mati. Produk tetap bernama "Sismart"; yang dinamis adalah identitas
 * sekolah yang memakainya.
 */
export default function Home() {
  return (
    <div className="landing">
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
    <section className="hero">
      <div className="hero__inner">
        <p className="hero__kicker">{brand.tagline}</p>
        <h1 className="hero__title">
          Seluruh urusan {brand.institutionType.toLowerCase()},
          <br />
          dalam satu tempat.
        </h1>
        <p className="hero__sub">
          Sismart menyatukan data siswa, nilai, absensi, dan pembayaran SPP untuk sekolah SD hingga
          SMK. Guru, tata usaha, orang tua, dan siswa bekerja dari satu sumber yang sama.
        </p>
        <div className="hero__actions">
          <Link route="session.create" className="btn btn--primary">
            Masuk dengan kode
            <ArrowRight size={16} />
          </Link>
          <a href="#peran" className="btn btn--secondary">
            Lihat per peran
          </a>
        </div>
        <p className="hero__note">Akses hanya dengan kode unik dari administrator sekolah.</p>
      </div>

      <div className="hero__panel" aria-hidden="true">
        <div className="hero__panel-bar">
          <span className="hero__dot" />
          <span className="hero__dot" />
          <span className="hero__dot" />
          <span className="hero__panel-title">Sismart · Dasbor</span>
        </div>
        <div className="hero__rows">
          {[
            ['Nilai rata-rata kelas', '78,4'],
            ['Kehadiran bulan ini', '96%'],
            ['Tagihan SPP terbayar', '182 / 210'],
            ['Agenda pekan ini', '5 kegiatan'],
          ].map(([label, value]) => (
            <div className="hero__row" key={label}>
              <span className="hero__row-label">{label}</span>
              <span className="hero__row-value mono">{value}</span>
            </div>
          ))}
        </div>
        <p className="hero__panel-foot">Contoh tampilan dasbor</p>
      </div>
    </section>
  )
}

function Modules() {
  const items = [
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

  return (
    <section className="section-band" id="modul">
      <div className="section-band__inner">
        <header className="section-band__head">
          <h2>Yang bisa dikerjakan di Sismart</h2>
          <p>Modul-modul inti untuk operasional sekolah sehari-hari.</p>
        </header>
        <div className="modules">
          {items.map(({ icon: Icon, title, body }) => (
            <article className="module" key={title}>
              <span className="module__icon">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <h3 className="module__title">{title}</h3>
              <p className="module__body">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ForWho() {
  const roles = [
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

  return (
    <section className="roles" id="peran">
      <div className="roles__inner">
        <header className="roles__head">
          <h2>Satu sistem, banyak peran</h2>
          <p>Setiap pengguna melihat dan mengerjakan bagiannya sendiri — sesuai peran.</p>
        </header>
        <div className="roles__grid">
          {roles.map(({ icon: Icon, name, line }) => (
            <article className="role" key={name}>
              <span className="role__badge">
                <Icon size={18} strokeWidth={1.8} />
                {name}
              </span>
              <p className="role__line">{line}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowIt() {
  const steps = [
    {
      n: '01',
      t: 'Terima kode unik',
      d: 'Administrator sekolah memberi setiap pengguna satu kode masuk.',
    },
    {
      n: '02',
      t: 'Masuk ke Sismart',
      d: 'Buka halaman masuk, masukkan kode, dan anda langsung diarahkan ke dasbor.',
    },
    {
      n: '03',
      t: 'Kerjakan bagian anda',
      d: 'Guru mengajar dan menilai; tata usaha mengelola; orang tua memantau.',
    },
  ]
  return (
    <section className="how">
      <div className="how__inner">
        <header className="how__head">
          <h2>Sesederhana tiga langkah</h2>
        </header>
        <ol className="how__steps">
          {steps.map(({ n, t, d }) => (
            <li className="how__step" key={n}>
              <span className="how__num mono">{n}</span>
              <h3 className="how__title">{t}</h3>
              <p className="how__body">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="final">
      <div className="final__inner">
        <h2 className="final__title">Sudah punya kode masuk?</h2>
        <p className="final__sub">Masuk sekarang dan mulai dari dasbor anda.</p>
        <Link route="session.create" className="btn btn--primary">
          Masuk dengan kode
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  const brand = useBrand()
  return (
    <footer className="site-foot">
      <div className="site-foot__inner">
        <div className="site-foot__brand">
          <strong>{brand.name}</strong>
          <span>{brand.tagline}</span>
        </div>
        <p className="site-foot__note">
          Sismart membantu satu lembaga sekolah mengelola akademik dan keuangan dalam satu tempat.
        </p>
      </div>
    </footer>
  )
}

Home.layout = [MarketingLayout]
