/**
 * Pusat URL gambar situs publik.
 *
 * Catatan: gambar placeholder, ganti asset asli sekolah.
 *
 * Semua URL di bawah adalah hotlink Unsplash (tanpa API key). Setiap URL sudah
 * diverifikasi merespons HTTP 200 sebelum dipakai. Bila hotlink tidak dapat
 * dipertahankan, gunakan `gambarFallback()` yang menunjuk ke picsum.photos.
 */

export type Gambar = {
  /** ID foto Unsplash (bagian setelah `photo-` pada URL). */
  id: string
  /** Teks alternatif deskriptif untuk pembaca layar. */
  alt: string
}

const UNSPLASH_BASE = 'https://images.unsplash.com/photo-'

/**
 * Bangun URL Unsplash pada lebar dan tinggi tertentu. `fit=crop` menjaga rasio
 * yang diminta dan `q=80` menekan ukuran berkas agar ramah seluler.
 */
export function gambarUrl(image: Gambar, width: number, height: number) {
  return `${UNSPLASH_BASE}${image.id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`
}

/** URL cadangan bila hotlink Unsplash tidak dapat dipakai. */
export function gambarFallback(seed: string, width: number, height: number) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

/** Katalog gambar situs. Kunci dipakai oleh komponen dan file konten. */
export const GAMBAR = {
  hero: { id: '1523240795612-9a054b0db644', alt: 'Siswa berdiskusi di dalam kelas' },
  profilSekolah: { id: '1562774053-701939374585', alt: 'Tampak depan gedung sekolah' },
  profilSambutan: {
    id: '1517048676732-d65bc937f952',
    alt: 'Kepala sekolah memberi sambutan di depan warga sekolah',
  },
  jurusanTkj: {
    id: '1531482615713-2afd69097998',
    alt: 'Praktik perakitan dan konfigurasi jaringan komputer',
  },
  jurusanRpl: { id: '1498050108023-c5249f4df085', alt: 'Siswa menulis kode program di laptop' },
  jurusanTkr: { id: '1615906655593-ad0386982a0f', alt: 'Praktik servis kendaraan ringan' },
  jurusanTpm: { id: '1487754180451-c456f719a1fc', alt: 'Pengoperasian mesin bubut di bengkel' },
  jurusanAkl: { id: '1454165804606-c3d57bc86b40', alt: 'Praktik penyusunan laporan keuangan' },
  jurusanDkv: { id: '1541178735493-479c1a27ed24', alt: 'Perancangan desain komunikasi visual' },
  fasilitasLab: { id: '1519389950473-47ba0277781c', alt: 'Laboratorium komputer untuk praktik' },
  fasilitasWorkshop: { id: '1517420704952-d9f39e95b43e', alt: 'Area bengkel praktik kerja siswa' },
  fasilitasPerpustakaan: { id: '1481627834876-b7833e8f5570', alt: 'Ruang perpustakaan sekolah' },
  fasilitasLapangan: { id: '1517649763962-0c623066013b', alt: 'Lapangan olahraga sekolah' },
  fasilitasMasjid: { id: '1542816417-0983c9c9ad53', alt: 'Masjid sekolah' },
  fasilitasKantin: { id: '1427504494785-3a9ca7044f45', alt: 'Kantin sekolah' },
  ekskulOlahraga: {
    id: '1546519638-68e109498ffc',
    alt: 'Kegiatan ekstrakurikuler olahraga bola basket',
  },
  ekskulSeni: {
    id: '1550439062-609e1531270e',
    alt: 'Kegiatan ekstrakurikuler seni dan kreativitas',
  },
  ekskulSains: { id: '1533228100845-08145b01de14', alt: 'Kelompok karya ilmiah remaja berdiskusi' },
  ekskulBahasa: { id: '1522202176988-66273c2fd55f', alt: 'Latihan percakapan English Club' },
  ekskulKepemimpinan: {
    id: '1522071820081-009f0129c71c',
    alt: 'Latihan kepemimpinan dan organisasi siswa',
  },
  ekskulKeagamaan: { id: '1504328345606-18bbc8c9d7d1', alt: 'Kegiatan keagamaan siswa' },
  beritaMpls: {
    id: '1517245386807-bb43f82c33c4',
    alt: 'Kegiatan masa pengenalan lingkungan sekolah',
  },
  beritaPrestasi: {
    id: '1555066931-4365d14bab8c',
    alt: 'Siswa mengikuti lomba kompetensi keahlian',
  },
  beritaMitra: {
    id: '1521791136064-7986c2920216',
    alt: 'Penandatanganan kerja sama dengan mitra industri',
  },
  ppdbSiswa: {
    id: '1434030216411-0b793f4b4173',
    alt: 'Calon peserta didik mengikuti proses pendaftaran',
  },
  kontakGedung: { id: '1580582932707-520aed937b7b', alt: 'Bangunan sekolah dilihat dari halaman' },
} satisfies Record<string, Gambar>

export type GambarKey = keyof typeof GAMBAR
