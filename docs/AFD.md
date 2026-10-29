# AFD — App Flow Documentation

> **Produk:** Sismart
> **Versi dokumen:** 1.0
> **Tanggal:** 2026-10-29
> **Status:** Draft untuk review pemilik
> **Terkait:** `PRD.md`, `TRD.md`, `IPD.md` (detail teknis tiap langkah)

---

## 0. Cara Membaca

Setiap alur ditulis sebagai: **aktor → prasyarat → langkah → sistem → hasil/keadaan akhir**. Titik keputusan ditandai `◇`, jalur error ditandai `⚠`.

Notasi ringkas alur juga diberikan sebagai diagram teks.

---

## 1. Peta Alur Tingkat Tinggi

```
Pengguna
   │
   ▼
[LOGIN KODE UNIK] ──⚠ gagal/lockout──> [pesan error]
   │ sukses
   ▼
[DASHBOARD sesuai ROLE]
   │
   ├─ siswa      → nilai, jadwal, absensi, materi, tugas, pengumuman
   ├─ orang_tua  → nilai anak, tagihan, riwayat bayar
   ├─ guru       → input nilai, absensi, materi, tugas, jadwal
   ├─ staff      → SPP, pembayaran, data siswa, inventaris, surat
   ├─ kepsek     → dashboard agregat, laporan, approval
   └─ admin      → akun, role, master data, CMS, konfigurasi
```

---

## 2. Autentikasi

### 2.1 Login dengan Kode Unik

**Aktor:** semua role.
**Prasyarat:** akun aktif dengan `login_code` valid dan password terpasang.

```
1. Pengguna buka /auth/signin
2. Masukkan ID Pengguna dan password
   ◇ ID Pengguna/password salah? → ⚠ "ID Pengguna atau password salah, atau akun tidak aktif."
   ◇ Akun nonaktif?         → ⚠ pesan yang sama (tidak membocorkan status akun)
   ◇ Sudah terkunci?        → ⚠ "Coba lagi dalam M menit"
3. Sistem verifikasi ID Pengguna lalu password
   ◇ Keduanya cocok?
      → sistem buat sesi, catat login, arahkan ke dashboard role
      ⚠ Gagal → tambah hitungan gagal; bila ≥ N → kunci akun M menit
4. Selesai: pengguna di dashboard sesuai role
```

**Aturan:**

- Pesan error **generik**: tidak membedakan ID Pengguna salah, password salah, akun nonaktif, atau akun tanpa password.
- ID Pengguna dinormalisasi ke huruf besar sebelum dicocokkan; password **tidak** di-trim.
- **[TBD-AFD-01]** N gagal & durasi M mengikuti `TBD-TRD-02`.
- Alur ganti password belum ada (lihat catatan TRD §4.1).

**Alur logout:** POST `/logout` → hapus sesi → redirect `/login`.

### 2.2 Redirect Otomatis

- Pengguna **sudah login** mencoba akses `/login` → redirect ke dashboard (guest middleware, sudah ada).
- Pengguna **belum login** mencoba akses halaman terlindungi → redirect `/login` (auth middleware, sudah ada).
- Redirect tujuan disesuaikan per role (bukan dashboard generik) → **[TBD-AFD-02]**.

---

## 3. Alur Siswa

### 3.1 Melihat Nilai

```
1. Siswa login → dashboard
2. Menu "Nilai" → pilih semester
3. Sistem tampilkan daftar nilai per mata pelajaran (read-only)
4. Hasil: siswa melihat nilai; tidak bisa mengubah
```

### 3.2 Melihat Jadwal & Absensi

```
1. Menu "Jadwal" → tampil jadwal pelajaran mingguan
2. Menu "Absensi" → tampil rekap kehadiran per periode
```

### 3.3 Tugas / CBT (M4)

```
1. Menu "Tugas" → daftar tugas aktif
2. Buka tugas → (bila CBT) mulai ujian → jawab → kirim
3. Sistem nilai otomatis (PG) → siswa lihat skor
```

---

## 4. Alur Orang Tua

### 4.1 Memantau Anak

```
1. Orang tua login → dashboard
2. Sistem tampilkan daftar anak yang tertaut (◇ satu anak atau lebih)
3. Pilih anak → lihat nilai, absensi, jadwal
```

**Catatan:** relasi orang tua ↔ siswa harus dimodelkan (lihat `DBD.md`). **[TBD-AFD-03]** satu akun ortu untuk beberapa anak?

### 4.2 Melihat & Membayar Tagihan

```
1. Menu "Tagihan" → daftar tagihan anak (lunas/belum)
2. ◇ Pilih tagihan belum lunas
3. ◇ Metode:
      Tunai   → petunjuk bayar ke staff → staff catat → status lunas
      Online  → buka halaman pembayaran (Midtrans) → bayar
4. Sistem terima webhook pembayaran → verifikasi signature → tandai lunas
5. Hasil: status tagihan berubah; orang tua lihat riwayat
   ⚠ Pembayaran gagal/kedaluwarsa → status tetap belum lunas; bisa coba lagi
```

**Aturan kritis:** status lunas **hanya** dari webhook terverifikasi atau pencatatan staff; **bukan** dari klien.

---

## 5. Alur Guru

### 5.1 Input Nilai (termasuk Paste Excel)

```
1. Guru login → menu "Input Nilai"
2. Pilih kelas + mata pelajaran + jenis penilaian
3. Pilih metode input:
      A. Manual  → isi per siswa
      B. Paste   → salin kolom dari Excel dan tempel
4. Sistem validasi (format, rentang nilai, siswa cocok)
   ◇ Ada baris tidak valid? → tampilkan PRATINJAU dengan baris error → guru perbaiki/batalkan
5. Simpan → sistem simpan nilai + catat audit (siapa, kapan)
6. Hasil: nilai tersimpan; dapat direkap ke rapor
```

**Aturan:**

- **Wajib pratinjau sebelum simpan** untuk input massal (cegah nilai salah masuk).
- Rentang & skala nilai mengikuti **[TBD-AFD-04]** (0–100? skala huruf? konfigurasi per mapel?).

### 5.2 Absensi

```
1. Menu "Absensi" → pilih kelas + tanggal/pertemuan
2. Tandai status per siswa (hadir/izin/sakit/alpa)
3. Simpan → rekap absensi diperbarui
```

### 5.3 Materi & Tugas (M4)

```
1. Menu "Materi" → unggah berkas/tautan → publikasikan ke kelas
2. Menu "Tugas" → buat tugas (judul, tenggat, lampiran) → siswa melihat
3. Sistem terima pengumpulan siswa → guru nilai → umpan balik
```

---

## 6. Alur Staff / Tata Usaha

### 6.1 Mengelola SPP & Pembayaran

```
1. Staff login → menu "Keuangan"
2. Buat tagihan:
      Massal → pilih kelas/periode → generate tagihan seluruh siswa
      Satuan → pilih siswa → buat tagihan
3. Catat pembayaran tunai:
      Cari siswa → pilih tagihan → input nominal → simpan (transaksi atomik)
4. Verifikasi pembayaran online:
      Sistem tampilkan pembayaran masuk dari webhook → cocokkan
5. Rekap:
      Laporan pemasukan per periode, daftar tunggakan
6. Hasil: pembukuan SPP mutakhir; laporan siap cetak/unduh
   ⚠ Double-click / submit ganda → idempotency mencegah pembayaran dobel
```

### 6.2 Data Siswa

```
1. Menu "Siswa" → tambah/edit data siswa (biodata, NIS, kelas, status)
2. Sistem validasi (NIS unik, kelas valid)
3. Simpan → data diperbarui
   ◇ Impor massal dari Excel? → pratinjau → simpan
```

### 6.3 Operasional (M3)

- Inventaris: catat aset, kondisi, lokasi, mutasi.
- Surat: catat surat masuk/keluar, penomoran otomatis.
- Agenda: catat kegiatan sekolah.

---

## 7. Alur Kepala Sekolah

```
1. Kepsek login → dashboard agregat
2. Lihat ringkasan: jumlah siswa, kehadiran, keuangan, agenda mendatang
3. ◇ Perlu approval? → buka item approval (mis. pengeluaran) → setujui/tolak
4. Unduh laporan ringkas
```

**Catatan:** akses kepsek bersifat **lihat + approval**, bukan input data operasional. **[TBD-AFD-05]** daftar approval yang benar-benar dibutuhkan.

---

## 8. Alur Administrator

### 8.1 Mengelola Pengguna & Role

```
1. Admin login → menu "Pengguna"
2. Tambah pengguna → isi identitas → sistem GENERATE kode unik → tetapkan password awal → pilih role
3. Simpan → kode + password awal ditampilkan untuk didistribusikan
   ◇ Reset kode/password? → generate ulang → nilai lama tidak berlaku
4. Nonaktifkan/hapus user → akses dicabut
```

### 8.2 Master Data

```
1. Menu "Master Data"
2. Kelola: tahun ajaran, kelas, mata pelajaran, konfigurasi penilaian
3. Perubahan berlaku untuk input selanjutnya; data lama TIDAK diubah retroaktif
   (kecuali eksplisit diminta)
```

### 8.3 CMS (M8)

```
1. Menu "Konten" → pilih jenis (berita/halaman/banner)
2. Buat/edit → ◇ publikasikan sekarang atau jadwalkan
3. Hasil: konten tampil di portal (M5)
```

---

## 9. Alur Publik (PPDB & Portal)

### 9.1 Portal Publik (M5)

```
1. Pengunjung buka halaman publik (tanpa login)
2. Lihat: profil sekolah, berita, pengumuman, informasi PPDB
3. Konten berasal dari CMS (M8)
```

### 9.2 PPDB (M6)

```
1. Calon siswa buka /ppdb → isi formulir + unggah berkas (validasi tipe & ukuran)
2. Sistem beri kode akses status pendaftaran
3. Admin verifikasi berkas → proses seleksi → terbitkan hasil
4. Calon siswa cek status dengan kode
   ⚠ Berkas tidak valid → status "perlu perbaikan" + catatan
```

---

## 10. Alur Support (M7)

```
1. Pengguna buat tiket (kategori, deskripsi, lampiran)
2. Status: baru → diproses → selesai (bisa ditutup)
3. Admin/staff menanggapi di dalam tiket
4. Pengguna dapat membuka kembali bila belum selesai
```

---

## 11. Alur Error & Edge Case Global

| Kondisi               | Perilaku                                               |
| --------------------- | ------------------------------------------------------ |
| 404                   | Halaman `errors/not_found` (sudah ada)                 |
| 500                   | Halaman `errors/server_error` (sudah ada)              |
| Validasi gagal        | Pesan per-field (starter sudah mendukung via `errors`) |
| Tidak punya izin      | 403 (fail-closed)                                      |
| Sesi habis            | Redirect ke `/login`                                   |
| Upload tipe terlarang | Tolak dengan pesan jelas                               |

---

## 12. Daftar [TBD] Alur

| ID         | Pertanyaan                                               |
| ---------- | -------------------------------------------------------- |
| TBD-AFD-01 | Parameter lockout (N, M)                                 |
| TBD-AFD-02 | Redirect dashboard per role                              |
| TBD-AFD-03 | Relasi ortu multi-anak                                   |
| TBD-AFD-04 | Skala & rentang nilai, konfigurasi per mapel             |
| TBD-AFD-05 | Daftar approval kepsek                                   |
| TBD-AFD-06 | Alur reset kode unik yang hilang (self-service vs admin) |
