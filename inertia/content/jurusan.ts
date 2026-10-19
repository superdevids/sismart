/**
 * Konten halaman JURUSAN / program keahlian (`/jurusan`).
 *
 * Catatan: ganti data asli sekolah.
 */

export const JURUSAN = {
  meta: {
    title: 'Program Keahlian',
    description:
      'Enam program keahlian SMK Negeri 1 Nusantara: TKJ, RPL, TKR, TPM, AKL, dan DKV beserta kompetensi dan prospek kariernya.',
  },

  eyebrow: 'Program Keahlian',
  title: 'Jurusan di Sekolah Kami',
  description:
    'Enam program keahlian yang dapat dipilih calon peserta didik baru sesuai minat dan rencana karier. Setiap jurusan dilengkapi gambaran materi, keunggulan, prospek kerja, dan kampus lanjutan.',
  listTitle: 'Daftar Program Keahlian',

  /** Judul tiap daftar detail pada kartu jurusan. */
  labels: {
    pelajaran: 'Apa yang Dipelajari',
    benefit: 'Keunggulan',
    prospek: 'Prospek Kerja',
    kampus: 'Kampus Lanjutan',
  },

  // TODO: ganti data asli sekolah
  items: [
    {
      kode: 'TKJ',
      nama: 'Teknik Komputer & Jaringan',
      singkatan: 'TKJ',
      deskripsi:
        'Merakit dan merawat komputer, membangun jaringan, serta menangani dasar keamanan sistem.',
      pelajaran: [
        'Perakitan dan perawatan perangkat komputer',
        'Konfigurasi jaringan lokal dan internet',
        'Administrasi server dan layanan jaringan',
        'Dasar keamanan jaringan dan troubleshooting',
      ],
      benefit: [
        'Laboratorium jaringan berstandar industri',
        'Sertifikasi kompetensi jaringan untuk siswa kelas XII',
        'Praktik kerja lapangan di ISP dan penyedia data center',
      ],
      prospek: [
        'Teknisi jaringan',
        'Administrator server',
        'Teknisi helpdesk IT',
        'Wirausaha jasa instalasi dan perawatan jaringan',
      ],
      // TODO: ganti dengan daftar kampus alumni yang sebenarnya
      kampus: [
        'Institut Teknologi Sepuluh Nopember (ITS)',
        'Telkom University',
        'Universitas Gunadarma',
        'Politeknik Negeri Malang',
      ],
    },
    {
      kode: 'RPL',
      nama: 'Rekayasa Perangkat Lunak',
      singkatan: 'RPL',
      deskripsi:
        'Membangun aplikasi web dan mobile mulai dari perancangan, pemrograman, hingga pengujian.',
      pelajaran: [
        'Pemrograman dasar dan berorientasi objek',
        'Pembuatan aplikasi web dan mobile',
        'Perancangan dan pengelolaan basis data',
        'Pengujian perangkat lunak dan pemeliharaan aplikasi',
      ],
      benefit: [
        'Studio pemrograman dengan perangkat memadai dan akses internet',
        'Proyek nyata bersama mitra industri perangkat lunak',
        'Pembinaan lomba kompetensi bidang pemrograman',
      ],
      prospek: [
        'Web developer',
        'Mobile developer',
        'Quality assurance engineer',
        'Wirausaha jasa pembuatan aplikasi dan sistem informasi',
      ],
      // TODO: ganti dengan daftar kampus alumni yang sebenarnya
      kampus: [
        'Institut Teknologi Sepuluh Nopember (ITS)',
        'Universitas Indonesia',
        'Telkom University',
        'Universitas Gadjah Mada',
      ],
    },
    {
      kode: 'TKR',
      nama: 'Teknik Kendaraan Ringan',
      singkatan: 'TKR',
      deskripsi:
        'Servis mesin, kelistrikan, dan sistem pemindah tenaga kendaraan ringan sesuai prosedur industri.',
      pelajaran: [
        'Perawatan mesin kendaraan ringan',
        'Sistem kelistrikan dan elektronika otomotif',
        'Sistem pemindah tenaga dan chassis',
        'Tune-up dan diagnosa kerusakan kendaraan',
      ],
      benefit: [
        'Bengkel otomotif dengan peralatan diagnosa modern',
        'Praktik kerja di dealer resmi dan bengkel mitra',
        'Uji kompetensi keahlian bersama asesor industri',
      ],
      prospek: [
        'Mekanik bengkel resmi',
        'Teknisi dealer otomotif',
        'Staf quality control perakitan kendaraan',
        'Wirausaha bengkel dan jasa servis kendaraan',
      ],
      // TODO: ganti dengan daftar kampus alumni yang sebenarnya
      kampus: [
        'Universitas Negeri Yogyakarta',
        'Universitas Sebelas Maret',
        'Politeknik Negeri Bandung',
        'Universitas Pendidikan Indonesia',
      ],
    },
    {
      kode: 'TPM',
      nama: 'Teknik Pemesinan',
      singkatan: 'TPM',
      deskripsi:
        'Mengoperasikan mesin bubut, frais, dan gerinda, serta membaca gambar teknik manufaktur.',
      pelajaran: [
        'Membaca dan menggambar teknik',
        'Pengoperasian mesin bubut dan frais',
        'Pengukuran presisi dan kontrol kualitas',
        'Perawatan mesin produksi dan keselamatan kerja',
      ],
      benefit: [
        'Workshop pemesinan dengan mesin konvensional dan CNC',
        'Sertifikasi juru teknik mesin bersama mitra industri',
        'Proyek produksi komponen secara presisi',
      ],
      prospek: [
        'Operator mesin produksi',
        'Juru gambar teknik',
        'Quality control manufaktur',
        'Wirausaha bengkel las dan produksi komponen',
      ],
      // TODO: ganti dengan daftar kampus alumni yang sebenarnya
      kampus: [
        'Institut Teknologi Bandung',
        'Universitas Brawijaya',
        'Politeknik Negeri Semarang',
        'Universitas Diponegoro',
      ],
    },
    {
      kode: 'AKL',
      nama: 'Akuntansi & Keuangan Lembaga',
      singkatan: 'AKL',
      deskripsi:
        'Menyusun laporan keuangan, mengelola administrasi pajak, dan menjalankan siklus akuntansi.',
      pelajaran: [
        'Siklus akuntansi perusahaan jasa dan dagang',
        'Pengelolaan administrasi perpajakan',
        'Aplikasi komputer akuntansi',
        'Penyusunan laporan keuangan lembaga',
      ],
      benefit: [
        'Praktik akuntansi dengan aplikasi yang dipakai dunia kerja',
        'Magang di kantor akuntansi dan lembaga keuangan mitra',
        'Pembinaan etika profesi dan ketelitian kerja',
      ],
      prospek: [
        'Staf akuntansi perusahaan',
        'Staf administrasi pajak',
        'Teller dan staf bank',
        'Wirausaha jasa pembukuan usaha kecil',
      ],
      // TODO: ganti dengan daftar kampus alumni yang sebenarnya
      kampus: [
        'Universitas Diponegoro',
        'Universitas Bina Nusantara',
        'Universitas Padjadjaran',
        'Politeknik Negeri Jakarta',
      ],
    },
    {
      kode: 'DKV',
      nama: 'Desain Komunikasi Visual',
      singkatan: 'DKV',
      deskripsi:
        'Merancang identitas visual, ilustrasi digital, serta konten foto dan video untuk kebutuhan industri kreatif.',
      pelajaran: [
        'Perancangan desain grafis dan tipografi',
        'Ilustrasi digital dan pengolahan gambar',
        'Fotografi dan videografi',
        'Perancangan identitas visual dan kemasan',
      ],
      benefit: [
        'Studio kreatif dengan komputer dan kamera memadai',
        'Proyek desain nyata untuk kegiatan sekolah dan mitra',
        'Pembinaan portofolio untuk studi lanjut dan dunia kerja',
      ],
      prospek: [
        'Desainer grafis',
        'Editor video dan motion graphic',
        'Content creator',
        'Wirausaha jasa desain dan percetakan',
      ],
      // TODO: ganti dengan daftar kampus alumni yang sebenarnya
      kampus: [
        'Institut Teknologi Bandung',
        'Universitas Pendidikan Indonesia',
        'Universitas Multimedia Nusantara',
        'Institut Seni Indonesia',
      ],
    },
  ],
}
