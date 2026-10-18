/**
 * Konten bersama situs publik: identitas sekolah, navigasi, hero teaser, dan
 * footer. Konten per topik ada di file terpisah (profil.ts, jurusan.ts,
 * fasilitas.ts, ekskul.ts, ppdb.ts, berita.ts, kontak.ts).
 *
 * Catatan: ganti data asli sekolah.
 *
 * Semua teks, angka statistik, dan tautan di bawah ini adalah CONTOH. Ganti
 * dengan data asli sekolah sebelum dipakai di produksi.
 */

export const LANDING = {
  meta: {
    siteName: 'Sismart',
    defaultDescription:
      'Portal resmi sekolah: profil, program keahlian, fasilitas, ekstrakurikuler, dan informasi PPDB.',
  },

  brand: {
    portalName: 'Sismart',
    portalLabel: 'Portal Sekolah',
  },

  // TODO: ganti data asli sekolah
  school: {
    name: 'SMK Negeri 1 Nusantara',
    shortName: 'SMKN 1 Nusantara',
    accreditation: 'Terakreditasi A',
    motto: 'Kompeten, berkarakter, berdaya saing.',
  },

  nav: [
    { label: 'Profil', href: '/profil' },
    { label: 'Jurusan', href: '/jurusan' },
    { label: 'Fasilitas', href: '/fasilitas' },
    { label: 'Ekskul', href: '/ekskul' },
    { label: 'Berita', href: '/#berita' },
    { label: 'PPDB', href: '/ppdb' },
    { label: 'Kontak', href: '/kontak' },
  ],

  actions: {
    login: 'Masuk',
    dashboard: 'Dashboard',
    loginNote: 'Masuk ke akun Sismart',
    openMenu: 'Buka menu navigasi',
    closeMenu: 'Tutup menu navigasi',
    seeAll: 'Lihat semua',
  },

  hero: {
    eyebrow: 'Portal Sekolah',
    title: 'Sismart',
    // Nama sekolah dirender dari `school.name`.
    tagline:
      'Satu pintu layanan digital sekolah: cek akademik, absensi, administrasi, dan pengumuman tanpa berpindah aplikasi.',
    description:
      'Jelajahi profil, program keahlian, fasilitas, dan kegiatan sekolah melalui halaman-halaman berikut.',
    primaryCta: { label: 'Informasi PPDB', href: '/ppdb' },
    secondaryCta: { label: 'Masuk' },
    // TODO: ganti data asli sekolah
    stats: [
      { value: '600+', label: 'Siswa aktif' },
      { value: '45', label: 'Guru & tenaga kependidikan' },
      { value: '6', label: 'Program keahlian' },
      { value: '12', label: 'Ekstrakurikuler' },
    ],
  },

  footer: {
    description:
      'Portal digital sekolah untuk layanan akademik, administrasi, dan informasi bagi warga sekolah.',
    navTitle: 'Halaman',
    contactTitle: 'Kontak',
    // TODO: ganti tautan media sosial sekolah
    social: [
      { label: 'Instagram', href: '#' },
      { label: 'YouTube', href: '#' },
      { label: 'Facebook', href: '#' },
    ],
    copyright: 'Seluruh hak cipta dilindungi.',
  },
}
