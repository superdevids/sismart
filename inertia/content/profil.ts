/**
 * Konten halaman PROFIL sekolah (`/profil`).
 *
 * Catatan: ganti data asli sekolah.
 */

import type { GambarKey } from './gambar'

export const PROFIL = {
  meta: {
    title: 'Profil Sekolah',
    description:
      'Sejarah singkat, visi, misi, nilai keunggulan, dan sambutan kepala sekolah SMK Negeri 1 Nusantara.',
  },

  eyebrow: 'Profil',
  title: 'Tentang Sekolah',
  description:
    'SMK Negeri 1 Nusantara menyiapkan lulusan siap kerja sekaligus siap melanjutkan pendidikan tinggi melalui pembelajaran berbasis praktik dan kemitraan industri.',
  image: 'profilSekolah' as GambarKey,

  // TODO: ganti data asli sekolah
  paragraphs: [
    'Sekolah kami berdiri sejak 1998 dan saat ini menaungi enam program keahlian dengan bengkel dan laboratorium yang mengikuti standar industri.',
    'Kurikulum disusun bersama mitra dunia usaha dan dunia industri, sehingga siswa terbiasa mengerjakan proyek nyata, magang, dan sertifikasi kompetensi sebelum lulus.',
    'Pembinaan karakter menjadi fondasi: disiplin, tanggung jawab, kolaborasi, dan kepedulian sosial tumbuh melalui kegiatan sekolah maupun ekstrakurikuler.',
  ],

  // TODO: ganti data asli sekolah
  facts: [
    { value: '1998', label: 'Tahun berdiri' },
    { value: '6', label: 'Program keahlian' },
    { value: 'A', label: 'Akreditasi' },
    { value: '40+', label: 'Mitra industri' },
  ],

  sambutan: {
    eyebrow: 'Sambutan',
    title: 'Sambutan Kepala Sekolah',
    // TODO: ganti data asli sekolah
    name: 'Drs. Ahmad Fauzi, M.Pd.',
    role: 'Kepala SMK Negeri 1 Nusantara',
    quote:
      'Kami percaya setiap siswa punya potensi unik. Tugas sekolah adalah memastikan potensi itu tumbuh menjadi kompetensi yang berguna bagi diri, keluarga, dan masyarakat. Mari bersinergi antara sekolah, industri, dan orang tua demi masa depan anak-anak kita.',
    image: 'profilSambutan' as GambarKey,
  },

  vision: {
    title: 'Visi',
    text: 'Menjadi sekolah menengah kejuruan rujukan yang menghasilkan lulusan kompeten, berkarakter, dan berdaya saing global.',
  },

  mission: {
    title: 'Misi',
    items: [
      'Menyelenggarakan pembelajaran vokasi yang selaras dengan kebutuhan dunia kerja.',
      'Membangun budaya disiplin, jujur, dan bertanggung jawab di seluruh warga sekolah.',
      'Memperkuat kemitraan dengan industri untuk praktik kerja, magang, dan penyerapan lulusan.',
      'Mendampingi siswa mengembangkan bakat melalui ekstrakurikuler dan kompetisi.',
      'Memanfaatkan teknologi informasi untuk layanan akademik dan administrasi yang cepat dan transparan.',
    ],
  },

  values: {
    title: 'Keunggulan',
    // TODO: ganti data asli sekolah
    items: [
      {
        title: 'Berbasis praktik',
        description:
          'Porsi pembelajaran praktik diperbesar di bengkel, laboratorium, dan proyek nyata bersama mitra industri.',
      },
      {
        title: 'Kemitraan industri',
        description:
          'Kerja sama magang dan rekrutmen dengan perusahaan mitra di wilayah sekitar sekolah.',
      },
      {
        title: 'Sertifikasi kompetensi',
        description:
          'Siswa disiapkan mengikuti uji sertifikasi keahlian sebelum menyelesaikan studi.',
      },
      {
        title: 'Lingkungan suportif',
        description:
          'Bimbingan konseling, pembinaan karakter, dan pendampingan karier bagi setiap siswa.',
      },
    ],
  },
}
