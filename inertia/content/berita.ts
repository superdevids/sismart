/**
 * Konten BERITA & AGENDA sekolah.
 *
 * Catatan: ganti dengan berita asli sekolah.
 *
 * Berita ditampilkan lengkap pada beranda karena belum ada halaman berita
 * tersendiri pada rilis ini.
 */

import type { GambarKey } from './gambar'

export const BERITA = {
  eyebrow: 'Berita & Agenda',
  title: 'Kabar Terbaru Sekolah',
  description: 'Kegiatan, prestasi, dan agenda penting yang perlu diketahui warga sekolah.',

  // TODO: ganti dengan berita asli sekolah
  items: [
    {
      category: 'Agenda',
      date: '20 Juli 2026',
      title: 'Masa Pengenalan Lingkungan Sekolah',
      excerpt:
        'Pengenalan tata tertib, fasilitas, dan kegiatan sekolah bagi peserta didik baru tahun ajaran ini.',
      image: 'beritaMpls' as GambarKey,
    },
    {
      category: 'Prestasi',
      date: '12 Juni 2026',
      title: 'Juara Lomba Kompetensi Siswa Tingkat Wilayah',
      excerpt:
        'Tim siswa meraih juara pada cabang lomba jaringan komputer dan desain komunikasi visual.',
      image: 'beritaPrestasi' as GambarKey,
    },
    {
      category: 'Info',
      date: '5 Juni 2026',
      title: 'Penandatanganan Kerja Sama dengan Mitra Industri',
      excerpt:
        'Sekolah menambah mitra magang baru untuk memperluas kesempatan praktik kerja siswa kelas XI.',
      image: 'beritaMitra' as GambarKey,
    },
  ],
}
