/**
 * Konten halaman KONTAK (`/kontak`).
 *
 * Catatan: ganti data asli sekolah.
 */

import type { GambarKey } from './gambar'

export const KONTAK = {
  meta: {
    title: 'Kontak & Lokasi',
    description: 'Alamat, telepon, email, jam operasional, dan WhatsApp SMK Negeri 1 Nusantara.',
  },

  eyebrow: 'Kontak',
  title: 'Kontak & Lokasi',
  description: 'Silakan berkunjung atau menghubungi kami pada jam operasional sekolah.',
  image: 'kontakGedung' as GambarKey,

  // TODO: ganti data asli sekolah
  address: {
    label: 'Alamat',
    lines: [
      'Jalan Pendidikan No. 12, Kelurahan Sukamaju',
      'Kecamatan Nusantara, Kota Nusantara 40123',
    ],
  },

  // TODO: ganti nomor dan surel yang sebenarnya
  channels: [
    {
      icon: 'phone',
      label: 'Telepon',
      value: '(022) 1234567',
      href: 'tel:+62221234567',
    },
    {
      icon: 'mail',
      label: 'Email',
      value: 'info@smkn1nusantara.sch.id',
      href: 'mailto:info@smkn1nusantara.sch.id',
    },
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: '+62 812-3456-7890',
      href: 'https://wa.me/6281234567890',
    },
    {
      icon: 'clock',
      label: 'Jam operasional',
      value: 'Senin – Jumat, 07.00 – 16.00 WIB',
    },
  ],

  mapNote: 'Peta lokasi akan ditampilkan setelah sekolah mengaktifkan layanan peta.',
}
