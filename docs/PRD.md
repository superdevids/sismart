# PRD — Product Requirements Document

> **Produk:** Sismart
> **Versi dokumen:** 1.0
> **Tanggal:** 2026-10-29
> **Status:** Draft untuk review pemilik
> **Pemilik produk:** Pemilik Sismart

---

## 0. Catatan Sumber & Kebenaran

Dokumen ini disusun dari:

1. **Kondisi nyata di disk** — starter AdonisJS 7 + Inertia + React 19 (`app/`, `inertia/`, `config/`, `database/`). Yang terbukti ada: auth email/password, satu tabel `users`, halaman home/dashboard/login/signup, layout marketing/auth/app.
2. **Konteks historis Sismart** yang dikonfirmasi pemilik pada 2026-10-29:
   - Sistem **sekolah** (SD–SMK) tingkat lembaga tunggal.
   - **6 role**: siswa, orang_tua, guru, staff, kepsek, admin.
   - **Auth: kode unik + password** (satu jalur auth; kode mengidentifikasi akun, password membuktikan pemiliknya).
   - **10 modul** sebagai roadmap penuh.
   - Deployment **single-sekolah** (satu instalasi = satu lembaga).

**Aturan penulisan:** semua requirement diberi ID (`FR-*`, `NFR-*`). Yang **belum diputuskan pemilik** ditandai eksplisit `[TBD]` — tidak diisi dengan tebakan.

**Gap yang disadari:** kode di disk saat ini adalah starter generik. Tidak ada satu pun fitur Sismart yang terimplementasi. Dokumen ini mendefinisikan **apa yang harus dibangun**, bukan mengklaim apa yang sudah ada.

---

## 1. Ringkasan Eksekutif

Sismart adalah sistem informasi sekolah terpadu untuk **satu lembaga pendidikan** (SD, SMP, SMA, atau SMK). Tujuannya: menyatukan administrasi akademik, keuangan, operasional, pembelajaran, dan komunikasi dalam satu aplikasi web yang dapat dijalankan **on-premise** di server sekolah maupun di cloud.

**Masalah yang diselesaikan:**

- Data siswa, nilai, dan keuangan tersebar di berkas Excel dan buku fisik → sulit direkap, rawan hilang.
- Orang tua tidak punya akses langsung ke nilai/kehadiran/tagihan anak.
- Proses PPDB (penerimaan siswa baru) dan pembayaran SPP masih manual.

**Prinsip produk:**

- **Sederhana dulu, modular** — monolith modular, bukan microservice.
- **Satu lembaga per instalasi** — isolasi data secara fisik, bukan lewat tenant logic.
- **Operable tanpa tim IT besar** — backup lokal, deployment ringan.

---

## 2. Target Pengguna & Persona

| Persona            | Role sistem | Kebutuhan utama                                       |
| ------------------ | ----------- | ----------------------------------------------------- |
| Siswa              | `siswa`     | Lihat jadwal, nilai, materi, tugas, pengumuman        |
| Orang tua          | `orang_tua` | Pantau nilai, kehadiran, tagihan SPP anak             |
| Guru               | `guru`      | Input nilai, absensi, materi, tugas, jadwal mengajar  |
| Staff / Tata Usaha | `staff`     | Kelola SPP, pembayaran, data siswa, surat, inventaris |
| Kepala Sekolah     | `kepsek`    | Dashboard ringkas, laporan agregat, approval          |
| Administrator      | `admin`     | Kelola akun, role, master data, konfigurasi sistem    |

**[TBD-01]** Detail hak akses granular per role (permission matrix) — lihat PRD §7 dan DBD.

---

## 3. Ruang Lingkup

### 3.1 Termasuk (In scope) — 10 modul roadmap

| Kode | Modul              | Ringkas                                                                  |
| ---- | ------------------ | ------------------------------------------------------------------------ |
| M0   | **Fondasi**        | Auth kode unik, RBAC, master data (tahun ajaran, kelas, mapel, pengguna) |
| M1   | **SIAKAD**         | Siswa, kelas, jadwal, absensi, nilai, rapor                              |
| M2   | **Keuangan**       | SPP, tagihan, pembayaran (Midtrans), laporan keuangan                    |
| M3   | **Operasional**    | Inventaris, surat-menyurat, agenda, sarana-prasarana                     |
| M4   | **Learning / CBT** | Materi, tugas, bank soal, ujian berbasis komputer                        |
| M5   | **Portal**         | Halaman publik, pengumuman, info sekolah                                 |
| M6   | **PPDB**           | Pendaftaran siswa baru online, seleksi, pengumuman                       |
| M7   | **Support**        | Tiket bantuan, FAQ, penghubung ke admin                                  |
| M8   | **CMS**            | Kelola konten portal (berita, halaman, banner)                           |
| M9   | **Design**         | Design system, tema, komponen UI konsisten                               |

### 3.2 Tidak termasuk (Out of scope)

- Asrama, kantin/koperasi siswa, transportasi/antar-jemput (dibuang pada keputusan sebelumnya).
- Multi-sekolah / multi-tenant dalam satu instalasi.
- Aplikasi native mobile (mobile-web responsif saja). **[TBD-02]** PWA?
- Integrasi Dapodik (wajib? kapan?). **[TBD-03]**

---

## 4. Functional Requirements

### M0 — Fondasi

| ID     | Requirement                                                                               | Prioritas |
| ------ | ----------------------------------------------------------------------------------------- | --------- |
| FR-001 | Sistem menyediakan autentikasi **kode unik + password** (email bukan identitas login).    | Must      |
| FR-002 | Kode unik dibedakan per jenis pengguna (mis. prefiks `S` untuk siswa, `K` untuk lainnya). | Must      |
| FR-003 | Sistem memiliki 6 role: siswa, orang_tua, guru, staff, kepsek, admin.                     | Must      |
| FR-004 | Akses fitur dibatasi berbasis role (permission fail-closed: tanpa izin → 403).            | Must      |
| FR-005 | Admin dapat mengelola master data: tahun ajaran, kelas, mata pelajaran, pengguna.         | Must      |
| FR-006 | Sistem memiliki mekanisme lockout setelah percobaan login gagal berulang.                 | Should    |
| FR-007 | Sesi login kedaluwarsa otomatis setelah periode tidak aktif.                              | Must      |

### M1 — SIAKAD

| ID     | Requirement                                                               | Prioritas |
| ------ | ------------------------------------------------------------------------- | --------- |
| FR-010 | Staff/admin mengelola data siswa (biodata, NIS, kelas, status).           | Must      |
| FR-011 | Guru menginput absensi siswa per pertemuan.                               | Must      |
| FR-012 | Guru menginput nilai (mendukung **paste dari Excel** untuk input massal). | Must      |
| FR-013 | Sistem menghasilkan rapor per siswa per semester.                         | Must      |
| FR-014 | Guru menyusun jadwal pelajaran per kelas.                                 | Should    |
| FR-015 | Siswa/orang tua dapat melihat nilai, absensi, dan jadwal.                 | Must      |

### M2 — Keuangan

| ID     | Requirement                                                                           | Prioritas |
| ------ | ------------------------------------------------------------------------------------- | --------- |
| FR-020 | Staff/admin mengelola tagihan SPP per siswa per periode.                              | Must      |
| FR-021 | Sistem mencatat pembayaran (tunai & online via Midtrans).                             | Must      |
| FR-022 | Sistem menghasilkan laporan keuangan (rekap pemasukan, tunggakan).                    | Must      |
| FR-023 | Orang tua dapat melihat tagihan & riwayat pembayaran anak.                            | Must      |
| FR-024 | Pembayaran online terverifikasi lewat webhook Midtrans (signature SHA-512 dari body). | Must      |

### M3 — Operasional

| ID     | Requirement                              | Prioritas |
| ------ | ---------------------------------------- | --------- |
| FR-030 | Pengelolaan inventaris/sarana-prasarana. | Should    |
| FR-031 | Surat masuk/keluar dan penomoran.        | Should    |
| FR-032 | Agenda kegiatan sekolah.                 | Could     |

### M4 — Learning / CBT

| ID     | Requirement                                  | Prioritas |
| ------ | -------------------------------------------- | --------- |
| FR-040 | Guru mengunggah materi pembelajaran.         | Should    |
| FR-041 | Guru membuat tugas dan menerima pengumpulan. | Should    |
| FR-042 | Bank soal dan ujian berbasis komputer (CBT). | Could     |
| FR-043 | Sistem menilai otomatis soal pilihan ganda.  | Could     |

### M5 — Portal

| ID     | Requirement                                                    | Prioritas |
| ------ | -------------------------------------------------------------- | --------- |
| FR-050 | Halaman publik menampilkan profil sekolah, pengumuman, berita. | Must      |
| FR-051 | Portal menampilkan konten yang dikelola lewat CMS (M8).        | Should    |

### M6 — PPDB

| ID     | Requirement                                               | Prioritas |
| ------ | --------------------------------------------------------- | --------- |
| FR-060 | Pendaftaran siswa baru online (formulir + upload berkas). | Should    |
| FR-061 | Admin mengelola seleksi dan menerbitkan pengumuman hasil. | Should    |
| FR-062 | Calon siswa mendapat kode akses status pendaftaran.       | Should    |

### M7 — Support

| ID     | Requirement                               | Prioritas |
| ------ | ----------------------------------------- | --------- |
| FR-070 | Pengguna dapat membuat tiket bantuan.     | Could     |
| FR-071 | Admin/staff menanggapi dan menutup tiket. | Could     |

### M8 — CMS

| ID     | Requirement                                                | Prioritas |
| ------ | ---------------------------------------------------------- | --------- |
| FR-080 | Admin mengelola berita, halaman statis, dan banner portal. | Should    |
| FR-081 | CMS mendukung penjadwalan konten (publish terjadwal).      | Could     |

### M9 — Design

| ID     | Requirement                                                                    | Prioritas |
| ------ | ------------------------------------------------------------------------------ | --------- |
| FR-090 | Tersedia design system: token warna, tipografi, skala spasi, radius, komponen. | Should    |
| FR-091 | Dukungan tema terang/gelap secara site-wide.                                   | Should    |
| FR-092 | Seluruh halaman responsif (mobile-friendly).                                   | Must      |

---

## 5. Non-Functional Requirements

| ID      | Requirement                               | Target                                                               |
| ------- | ----------------------------------------- | -------------------------------------------------------------------- |
| NFR-001 | Deployment ringan, on-prem server sekolah | Dapat berjalan di VPS/PC server biasa                                |
| NFR-002 | Database produksi                         | **[TBD-04]** Confirm: PostgreSQL (memory menyebut 5433)              |
| NFR-003 | Backup                                    | Backup lokal berkala; data keuangan & nilai wajib tercover           |
| NFR-004 | Keamanan                                  | CSRF aktif, header keamanan lengkap, secret tidak masuk log/source   |
| NFR-005 | Kepatuhan                                 | UU PDP: consent, retensi, hak hapus data siswa                       |
| NFR-006 | Zona waktu                                | Asia/Jakarta                                                         |
| NFR-007 | Bahasa UI                                 | Bahasa Indonesia                                                     |
| NFR-008 | Performa                                  | Halaman utama < 2s pada jaringan lokal sekolah                       |
| NFR-009 | Aksesibilitas                             | Kontras WCAG AA minimal untuk teks utama                             |
| NFR-010 | Auditabilitas                             | Perubahan data sensitif (nilai, pembayaran) tercatat (who/what/when) |

---

## 6. Alur Pengguna Utama

Ringkas; detail di `AFD.md`.

1. **Login** — pengguna masuk dengan kode unik + password → diarahkan ke dashboard sesuai role.
2. **Guru input nilai** — pilih kelas/mapel → input (atau paste Excel) → simpan.
3. **Orang tua cek tagihan** — login → lihat daftar tagihan anak → bayar online / lihat riwayat.
4. **Staff kelola SPP** — buat tagihan massal → verifikasi pembayaran → rekap.
5. **Admin kelola pengguna** — buat akun + kode unik + password awal → tetapkan role → aktifkan.

---

## 7. Role & Hak Akses (Ringkas)

| Modul                   | siswa              | orang_tua     | guru   | staff       | kepsek        | admin        |
| ----------------------- | ------------------ | ------------- | ------ | ----------- | ------------- | ------------ |
| Fondasi (akun/master)   | —                  | —             | —      | —           | Lihat         | Kelola penuh |
| SIAKAD                  | Lihat nilai/jadwal | Lihat anak    | Input  | Kelola data | Lihat semua   | Kelola       |
| Keuangan                | —                  | Lihat & bayar | —      | Kelola      | Lihat laporan | Kelola       |
| Operasional             | —                  | —             | —      | Kelola      | Lihat         | Kelola       |
| Learning/CBT            | Ikut & lihat       | Lihat         | Kelola | —           | Lihat         | Kelola       |
| Portal/CMS/PPDB/Support | Lihat              | Lihat         | Lihat  | Kelola      | Lihat         | Kelola       |

**[TBD-05]** Matriks penuh & permission key — difinalisasi di `DBD.md` §Akses.

---

## 8. Metrik Keberhasilan

| Metrik                              | Baseline | Target                      |
| ----------------------------------- | -------- | --------------------------- |
| Pengguna aktif harian (guru/staff)  | 0        | ≥ 80% staf terdaftar        |
| Orang tua yang login ≥ 1×/bulan     | 0        | ≥ 50%                       |
| Waktu input nilai per kelas         | manual   | turun ≥ 50% via paste Excel |
| Tingkat kegagalan pembayaran online | —        | < 2%                        |

---

## 9. Asumsi & Risiko

| ID      | Asumsi/Risiko                                            | Mitigasi                                                                  |
| ------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| ASM-001 | Sekolah punya server listrik/UPS & jaringan lokal stabil | Dokumentasi kebutuhan minimum; fallback offline                           |
| ASM-002 | Satu lembaga per instalasi (single-tenant)               | Isolasi fisik; jalur upgrade multi-tenant didokumentasikan sebagai risiko |
| RSK-001 | Data nilai/keuangan sensitif bocor                       | Enkripsi, backup terenkripsi, audit log, akses minimum                    |
| RSK-002 | Input massal nilai Excel salah format                    | Validasi + pratinjau sebelum simpan                                       |
| RSK-003 | Migrasi data lama dari Excel                             | Fase impor khusus; validasi + rekonsiliasi                                |

---

## 10. Ketergantungan Eksternal

| Layanan          | Kegunaan                | Status                              |
| ---------------- | ----------------------- | ----------------------------------- |
| Midtrans         | Pembayaran online       | **[TBD-06]** Kredensial belum ada   |
| WhatsApp Gateway | Notifikasi tagihan/PPDB | **[TBD-07]** Penyedia belum dipilih |
| Backup storage   | Backup off-site         | **[TBD-08]**                        |

---

## 11. Roadmap Fase (ringkas — detail di `IPD.md`)

- **Fase 0** — Fondasi: auth kode unik, RBAC, master data.
- **Fase 1** — SIAKAD inti.
- **Fase 2** — Keuangan (SPP + Midtrans).
- **Fase 3** — Portal + CMS.
- **Fase 4** — PPDB.
- **Fase 5** — Learning/CBT.
- **Fase 6** — Operasional + Support.
- **Fase 7** — Design system polish + hardening + UU PDP.

---

## 12. Daftar [TBD] yang Menunggu Keputusan Pemilik

| ID     | Pertanyaan                                           |
| ------ | ---------------------------------------------------- |
| TBD-01 | Permission matrix granular per role                  |
| TBD-02 | Perlu PWA / mobile install?                          |
| TBD-03 | Integrasi Dapodik diperlukan?                        |
| TBD-04 | Konfirmasi DB produksi (PostgreSQL?)                 |
| TBD-05 | Detail permission key per modul                      |
| TBD-06 | Kredensial Midtrans (sandbox/produksi)               |
| TBD-07 | Penyedia WhatsApp gateway                            |
| TBD-08 | Strategi backup off-site                             |
| TBD-09 | Format kode unik final (panjang, prefiks, cek-digit) |
| TBD-10 | Kurikulum acuan rapor (K13 / Merdeka)                |
