/**
 * Konten halaman FASILITAS (`/fasilitas`).
 *
 * Catatan: ganti data asli sekolah.
 */

import type { GambarKey } from './gambar'

export const FASILITAS = {
  meta: {
    title: 'Fasilitas',
    description:
      'Sarana pendukung belajar SMK Negeri 1 Nusantara: laboratorium komputer, workshop praktik, perpustakaan, lapangan, masjid, dan kantin.',
  },

  eyebrow: 'Fasilitas',
  title: 'Sarana Pendukung Belajar',
  description:
    'Fasilitas yang kami rawat agar proses belajar tetap aman, nyaman, dan mendekati suasana kerja sebenarnya.',
  listTitle: 'Sarana & Prasarana',

  // TODO: ganti data asli sekolah
  items: [
    {
      icon: 'monitor',
      title: 'Laboratorium Komputer',
      description: 'Empat lab komputer dengan jaringan gigabit dan perangkat praktik terbaru.',
      image: 'fasilitasLab' as GambarKey,
    },
    {
      icon: 'wrench',
      title: 'Workshop Praktik',
      description:
        'Bengkel otomotif, pemesinan, dan area kerja kelistrikan sesuai standar industri.',
      image: 'fasilitasWorkshop' as GambarKey,
    },
    {
      icon: 'book',
      title: 'Perpustakaan',
      description: 'Koleksi buku kejuruan, jurnal, dan ruang baca tenang dengan akses internet.',
      image: 'fasilitasPerpustakaan' as GambarKey,
    },
    {
      icon: 'activity',
      title: 'Lapangan Olahraga',
      description: 'Lapangan serbaguna untuk futsal, basket, dan voli serta area upacara.',
      image: 'fasilitasLapangan' as GambarKey,
    },
    {
      icon: 'mosque',
      title: 'Masjid Sekolah',
      description: 'Tempat ibadah berkapasitas memadai untuk kegiatan keagamaan warga sekolah.',
      image: 'fasilitasMasjid' as GambarKey,
    },
    {
      icon: 'utensils',
      title: 'Kantin & Koperasi',
      description:
        'Kantin bersih dan koperasi siswa dengan harga terjangkau serta pengawasan kebersihan.',
      image: 'fasilitasKantin' as GambarKey,
    },
  ],
}
