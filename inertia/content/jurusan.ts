/**
 * Konten halaman JURUSAN / program keahlian (`/jurusan`).
 *
 * Catatan: ganti data asli sekolah.
 */

import type { GambarKey } from './gambar'

export const JURUSAN = {
  meta: {
    title: 'Program Keahlian',
    description:
      'Enam program keahlian SMK Negeri 1 Nusantara: TKJ, RPL, TKR, TPM, AKL, dan DKV beserta kompetensi dan prospek kariernya.',
  },

  eyebrow: 'Program Keahlian',
  title: 'Jurusan di Sekolah Kami',
  description:
    'Enam program keahlian yang dapat dipilih calon peserta didik baru sesuai minat dan rencana karier.',
  listTitle: 'Daftar Program Keahlian',

  // TODO: ganti data asli sekolah
  items: [
    {
      code: 'TKJ',
      name: 'Teknik Komputer & Jaringan',
      description:
        'Merakit dan merawat komputer, membangun jaringan, serta menangani dasar keamanan sistem.',
      competencies: ['Jaringan komputer', 'Perawatan perangkat', 'Keamanan dasar'],
      prospects: ['Teknisi jaringan', 'Administrator server', 'Helpdesk IT'],
      image: 'jurusanTkj' as GambarKey,
    },
    {
      code: 'RPL',
      name: 'Rekayasa Perangkat Lunak',
      description:
        'Membangun aplikasi web dan mobile mulai dari perancangan, pemrograman, hingga pengujian.',
      competencies: ['Pemrograman web', 'Basis data', 'Pengujian aplikasi'],
      prospects: ['Web developer', 'Mobile developer', 'Quality assurance'],
      image: 'jurusanRpl' as GambarKey,
    },
    {
      code: 'TKR',
      name: 'Teknik Kendaraan Ringan',
      description:
        'Servis mesin, kelistrikan, dan sistem pemindah tenaga kendaraan ringan sesuai prosedur industri.',
      competencies: ['Servis mesin', 'Kelistrikan otomotif', 'Tune-up'],
      prospects: ['Mekanik bengkel', 'Teknisi dealer', 'Wirausaha otomotif'],
      image: 'jurusanTkr' as GambarKey,
    },
    {
      code: 'TPM',
      name: 'Teknik Pemesinan',
      description:
        'Mengoperasikan mesin bubut, frais, dan gerinda, serta membaca gambar teknik manufaktur.',
      competencies: ['Gambar teknik', 'Mesin bubut & frais', 'Pengukuran presisi'],
      prospects: ['Operator mesin produksi', 'Juru gambar teknik', 'Quality control'],
      image: 'jurusanTpm' as GambarKey,
    },
    {
      code: 'AKL',
      name: 'Akuntansi & Keuangan Lembaga',
      description:
        'Menyusun laporan keuangan, mengelola administrasi pajak, dan menjalankan siklus akuntansi.',
      competencies: ['Siklus akuntansi', 'Perpajakan dasar', 'Aplikasi keuangan'],
      prospects: ['Staf akuntansi', 'Staf administrasi pajak', 'Teller bank'],
      image: 'jurusanAkl' as GambarKey,
    },
    {
      code: 'DKV',
      name: 'Desain Komunikasi Visual',
      description:
        'Merancang identitas visual, ilustrasi digital, serta konten foto dan video untuk kebutuhan industri kreatif.',
      competencies: ['Desain grafis', 'Fotografi & video', 'Tipografi'],
      prospects: ['Desainer grafis', 'Editor video', 'Content creator'],
      image: 'jurusanDkv' as GambarKey,
    },
  ],
}
