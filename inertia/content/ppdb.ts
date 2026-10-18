/**
 * Konten halaman PPDB (`/ppdb`).
 *
 * Catatan: ganti data asli sekolah.
 *
 * Jadwal dan ketentuan berikut adalah CONTOH dan harus diperbarui sesuai
 * pengumuman resmi sekolah setiap tahun ajaran.
 */

import type { GambarKey } from './gambar'

export const PPDB = {
  meta: {
    title: 'PPDB',
    description:
      'Informasi penerimaan peserta didik baru SMK Negeri 1 Nusantara: jalur pendaftaran, jadwal, syarat, dan kontak panitia.',
  },

  eyebrow: 'PPDB',
  title: 'Penerimaan Peserta Didik Baru',
  description:
    'Informasi jalur pendaftaran, jadwal, dan syarat umum bagi calon peserta didik baru.',
  note: 'Jadwal dan ketentuan berikut adalah contoh dan akan diperbarui sesuai pengumuman resmi sekolah.',
  image: 'ppdbSiswa' as GambarKey,

  // TODO: ganti data asli sekolah
  pathways: [
    {
      name: 'Jalur Zuhud',
      badge: 'Pembinaan khusus',
      description:
        'Diperuntukkan bagi calon peserta didik yang mengikuti program pembinaan keagamaan dan kedisiplinan sekolah.',
    },
    {
      name: 'Jalur Prestasi',
      badge: 'Piagam',
      description:
        'Untuk calon peserta didik dengan prestasi akademik maupun non-akademik yang dibuktikan dengan piagam atau sertifikat.',
    },
    {
      name: 'Jalur Afirmasi',
      badge: 'Bantuan pemerintah',
      description:
        'Diperuntukkan bagi calon peserta didik dari keluarga kurang mampu yang terdaftar pada program bantuan pemerintah.',
    },
    {
      name: 'Jalur Reguler',
      badge: 'Umum',
      description:
        'Dibuka untuk seluruh calon peserta didik yang memenuhi syarat umum, dengan seleksi berdasarkan nilai rapor.',
    },
  ],

  stepsTitle: 'Alur Pendaftaran',
  steps: [
    {
      label: '1. Daftar daring',
      description: 'Isi formulir dan unggah berkas melalui laman PPDB.',
    },
    { label: '2. Verifikasi', description: 'Panitia memeriksa kelengkapan dan keaslian berkas.' },
    {
      label: '3. Seleksi',
      description: 'Penilaian sesuai jalur yang dipilih calon peserta didik.',
    },
    {
      label: '4. Daftar ulang',
      description: 'Calon yang lulus melengkapi administrasi dan seragam.',
    },
  ],

  scheduleTitle: 'Jadwal Penting',
  schedule: [
    { label: 'Pendaftaran gelombang 1', value: '1 – 20 Juni 2026' },
    { label: 'Seleksi administrasi', value: '21 – 25 Juni 2026' },
    { label: 'Pengumuman hasil', value: '30 Juni 2026' },
    { label: 'Daftar ulang', value: '1 – 5 Juli 2026' },
    { label: 'Awal tahun ajaran', value: '13 Juli 2026' },
  ],

  requirementsTitle: 'Syarat Umum',
  requirements: [
    'Fotokopi ijazah atau surat keterangan lulus SMP/MTs.',
    'Fotokopi rapor semester 1 sampai 5.',
    'Fotokopi kartu keluarga dan kartu identitas siswa.',
    'Akta kelahiran dan pasfoto 3A-4 sebanyak 3 lembar.',
    'Surat keterangan sehat (dilengkapi setelah dinyatakan lulus).',
  ],

  committee: {
    title: 'Kontak Panitia PPDB',
    description:
      'Panitia PPDB siap membantu setiap hari kerja. Hubungi kami sebelum masa pendaftaran berakhir.',
    // TODO: ganti nomor kontak panitia yang sebenarnya
    whatsapp: '6281234567890',
    whatsappLabel: 'WhatsApp Panitia',
    phone: '(022) 1234567',
    email: 'ppdb@smkn1nusantara.sch.id',
    hours: 'Senin – Jumat, 08.00 – 15.00 WIB',
  },
}
