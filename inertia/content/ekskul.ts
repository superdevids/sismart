/**
 * Konten halaman EKSTRAKURIKULER (`/ekskul`).
 *
 * Catatan: ganti data asli sekolah.
 */

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
      description:
        'Pembinaan kebugaran, sportivitas, dan kerja sama tim melalui latihan rutin dan pertandingan antarsekolah. Siswa dibimbing teknik dasar hingga strategi bertanding sesuai cabang yang diminati.',
      schedule: 'Latihan setiap Selasa dan Kamis, 15.00 – 17.00 WIB',
      coach: 'Pembina: Guru Pendidikan Jasmani & pelatih pendamping',
      items: ['Futsal', 'Bola Basket', 'Bola Voli', 'Pencak Silat'],
    },
    {
      name: 'Seni & Kreativitas',
      description:
        'Ruang berekspresi melalui musik, gambar, dan media. Anggota berlatih tampil di panggung sekolah serta memproduksi karya visual dan olah vokal secara berkala.',
      schedule: 'Latihan setiap Rabu, 15.00 – 17.00 WIB',
      coach: 'Pembina: Guru Seni Budaya',
      items: ['Paduan Suara', 'Multimedia & Jurnalistik'],
    },
    {
      name: 'Sains & Teknologi',
      description:
        'Menumbuhkan budaya meneliti dan berpikir kritis. Siswa menyusun proposal karya ilmiah, melakukan percobaan, dan mempresentasikan hasilnya pada ajang lomba.',
      schedule: 'Pertemuan setiap Jumat, 14.30 – 16.30 WIB',
      coach: 'Pembina: Guru mata pelajaran produktif',
      items: ['Karya Ilmiah Remaja'],
    },
    {
      name: 'Bahasa',
      description:
        'Melatih kemampuan berkomunikasi dalam bahasa asing melalui percakapan, debat, dan lomba. Kegiatan menekankan keberanian berbicara serta pemahaman lintas budaya.',
      schedule: 'Latihan setiap Senin, 15.00 – 16.30 WIB',
      coach: 'Pembina: Guru Bahasa Inggris',
      items: ['English Club'],
    },
    {
      name: 'Kepemimpinan & Bela Negara',
      description:
        'Membentuk disiplin, kemandirian, dan jiwa kepemimpinan melalui latihan lapangan, baris-berbaris, serta kegiatan sosial. Anggota dibina untuk memimpin dan bekerja dalam tim.',
      schedule: 'Latihan setiap Sabtu, 08.00 – 11.00 WIB',
      coach: 'Pembina: Guru PKn & pembina OSIS',
      items: ['Pramuka', 'Paskibra', 'Palang Merah Remaja'],
    },
    {
      name: 'Keagamaan',
      description:
        'Memperkuat nilai spiritual dan akhlak siswa melalui kajian rutin, pembinaan baca Al-Qur’an, dan kegiatan sosial keagamaan di lingkungan sekolah.',
      schedule: 'Kajian setiap Jumat, 14.30 – 16.00 WIB',
      coach: 'Pembina: Guru Pendidikan Agama',
      items: ['Rohis'],
    },
  ],
}
