/**
 * Konten halaman EKSTRAKURIKULER (`/ekskul`).
 *
 * Catatan: ganti data asli sekolah.
 */

import type { GambarKey } from './gambar'

export const EKSKUL = {
  meta: {
    title: 'Ekstrakurikuler',
    description:
      'Dua belas kegiatan ekstrakurikuler SMK Negeri 1 Nusantara: olahraga, seni, sains, bahasa, kepemimpinan, dan keagamaan.',
  },

  eyebrow: 'Ekstrakurikuler',
  title: 'Kembangkan Bakat di Luar Kelas',
  description:
    'Beragam pilihan kegiatan untuk menumbuhkan minat, kepemimpinan, dan kebugaran siswa.',
  listTitle: 'Bidang Ekstrakurikuler',

  // TODO: ganti data asli sekolah
  categories: [
    {
      name: 'Olahraga',
      description: 'Pembinaan kebugaran, sportivitas, dan kerja sama tim.',
      image: 'ekskulOlahraga' as GambarKey,
      items: ['Futsal', 'Bola Basket', 'Bola Voli', 'Pencak Silat'],
    },
    {
      name: 'Seni & Kreativitas',
      description: 'Ruang berekspresi melalui musik, gambar, dan media.',
      image: 'ekskulSeni' as GambarKey,
      items: ['Paduan Suara', 'Multimedia & Jurnalistik'],
    },
    {
      name: 'Sains & Teknologi',
      description: 'Menumbuhkan budaya meneliti dan berpikir kritis.',
      image: 'ekskulSains' as GambarKey,
      items: ['Karya Ilmiah Remaja'],
    },
    {
      name: 'Bahasa',
      description: 'Melatih kemampuan berkomunikasi dalam bahasa asing.',
      image: 'ekskulBahasa' as GambarKey,
      items: ['English Club'],
    },
    {
      name: 'Kepemimpinan & Bela Negara',
      description: 'Membentuk disiplin, kemandirian, dan jiwa kepemimpinan.',
      image: 'ekskulKepemimpinan' as GambarKey,
      items: ['Pramuka', 'Paskibra', 'Palang Merah Remaja'],
    },
    {
      name: 'Keagamaan',
      description: 'Memperkuat nilai spiritual dan akhlak siswa.',
      image: 'ekskulKeagamaan' as GambarKey,
      items: ['Rohis'],
    },
  ],
}
