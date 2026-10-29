# IPD — Implementation Plan Documentation

> **Produk:** Sismart
> **Versi dokumen:** 1.0
> **Tanggal:** 2026-10-29
> **Status:** Planned
> **Owner:** Pemilik Sismart
> **Terkait:** `PRD.md`, `TRD.md`, `AFD.md`, `DBD.md`, `BSD.md`

---

## 0. Cara Pakai Dokumen Ini

- Pekerjaan dipecah menjadi **fase** → **task bernomor** (`TASK-xxx`).
- Setiap task punya: deskripsi, acceptance criteria (AC), dependensi, dan status.
- Kolom `Paralel` menandai apakah task dapat dikerjakan bersamaan dengan task lain **dalam fase yang sama** (berguna untuk kerja multi-agent).
- Status: `[ ]` belum, `[~]` in progress, `[x]` selesai, `[!]` blocked.

**Definisi Selesai (DoD) global** — berlaku untuk setiap task:

1. Semua AC terpenuhi **dengan bukti** (output command/hasil nyata).
2. `npm run typecheck` hijau.
3. `npm run lint` hijau.
4. `npm test` hijau (test relevan ditulis bila belum ada).
5. `npm run build` hijau (untuk task yang menyentuh frontend/build).
6. Tidak ada secret/scope creep.
7. Laporan singkat: status, bukti, risiko.

**Aturan keras (dari pengalaman):**

- **Test flaky = gagal.** Jangan retry sampai hijau.
- Uang/auth → **mutation test** (≥3 cacat disuntik, semua tertangkap) bila tersedia.
- **Jangan** jalankan `tsc` tanpa `--noEmit`.
- **Jangan** edit `database/schema.ts` manual.
- Browser test → `waitForSelector` dulu; jalankan `npm run build` bersamaan.

---

## Fase 0 — Fondasi

**Goal:** autentikasi kode unik, RBAC, master data. Basis semua modul.

| Task     | Deskripsi                                                            | AC                                                        | Dependensi         | Paralel |
| -------- | -------------------------------------------------------------------- | --------------------------------------------------------- | ------------------ | ------- |
| TASK-001 | Keputusan teknis: format kode unik final                             | Dokumen keputusan format (panjang, prefiks, cek-digit)    | —                  |         |
| TASK-002 | Migration revisi `users` (login_code, role, is_active, dll)          | Migration naik & turun bersih; `schema.ts` ter-regenerate | TASK-001           |         |
| TASK-003 | Model `User` + enum role + helper                                    | Model bertipe, enum role, test unit                       | TASK-002           | ✓       |
| TASK-004 | Validator login (kode unik + password) + migrasi dari email/password | Test: login valid/invalid/tidak aktif/password salah      | TASK-003           | ✓       |
| TASK-005 | Controller Session (login/logout) pakai kode unik + password         | AC alur AFD §2.1 lulus                                    | TASK-004           |         |
| TASK-006 | Middleware `role` / `can` (fail-closed)                              | Test: akses tanpa izin → 403                              | TASK-003           | ✓       |
| TASK-007 | Katalog permission + seeding role                                    | Katalog permission terdaftar; test                        | TASK-006           |         |
| TASK-008 | Rate limit / lockout login                                           | Test: N gagal → terkunci M menit                          | TASK-005           | ✓       |
| TASK-009 | Migration master data (academic_years, classes, subjects)            | Migration + model + seeder                                | TASK-002           | ✓       |
| TASK-010 | CRUD master data (admin)                                             | Test functional CRUD + RBAC                               | TASK-009, TASK-006 |         |
| TASK-011 | Halaman login UI (kode unik + password)                              | Halaman render; form submit; error tampil                 | TASK-005           | ✓       |
| TASK-012 | Redirect dashboard per role                                          | Test: tiap role → dashboard benar                         | TASK-005           | ✓       |

**Gate fase:** login kode unik + password berfungsi end-to-end; RBAC fail-closed terbukti; master data dapat dikelola.

---

## Fase 1 — SIAKAD Inti

**Goal:** siswa, kelas, absensi, nilai, rapor.

| Task     | Deskripsi                                              | AC                                               | Dependensi                         | Paralel |
| -------- | ------------------------------------------------------ | ------------------------------------------------ | ---------------------------------- | ------- |
| TASK-101 | Migration `students` + `parent_student`                | Migration + model + relasi                       | TASK-009                           | ✓       |
| TASK-102 | CRUD data siswa (staff/admin)                          | Test CRUD + validasi NIS unik                    | TASK-101                           |         |
| TASK-103 | Impor data siswa dari Excel/CSV                        | Pratinjau + validasi + simpan                    | TASK-102                           |         |
| TASK-104 | Tautkan orang tua ↔ siswa                              | Test relasi multi-anak                           | TASK-101                           | ✓       |
| TASK-105 | Migration `attendances` + input absensi                | Test input + rekap                               | TASK-101                           | ✓       |
| TASK-106 | Migration `grades` + input nilai manual                | Test input + validasi rentang                    | TASK-101                           | ✓       |
| TASK-107 | **Input nilai via paste Excel**                        | Pratinjau baris error; simpan setelah konfirmasi | TASK-106                           |         |
| TASK-108 | Generator rapor per siswa/semester                     | Output rapor benar; test                         | TASK-106, TASK-011 (kurikulum TBD) |         |
| TASK-109 | Migration `schedules` + penjadwalan                    | Test CRUD + tampilan                             | TASK-009                           | ✓       |
| TASK-110 | Halaman siswa/orang tua (lihat nilai, absensi, jadwal) | Test view + RBAC                                 | TASK-105, TASK-106                 |         |
| TASK-111 | Audit log untuk perubahan nilai                        | Test: setiap perubahan tercatat                  | TASK-106                           | ✓       |

**Gate fase:** guru dapat input nilai (manual & paste), absensi tersimpan, siswa/orang tua dapat melihat datanya.

---

## Fase 2 — Keuangan

**Goal:** SPP, tagihan, pembayaran (tunai + Midtrans), laporan.

| Task     | Deskripsi                                                    | AC                                            | Dependensi         | Paralel |
| -------- | ------------------------------------------------------------ | --------------------------------------------- | ------------------ | ------- |
| TASK-201 | Migration `fees`, `invoices`, `payments`, `payment_webhooks` | Migration + model                             | TASK-101           | ✓       |
| TASK-202 | Service pembuatan tagihan (massal per kelas)                 | Test: tagihan ter-generate benar              | TASK-201           |         |
| TASK-203 | Pencatatan pembayaran tunai (transaksi atomik)               | Test: update invoice + insert payment atomic  | TASK-201           | ✓       |
| TASK-204 | Idempotency & anti double-submit                             | Test: dua submit → satu pembayaran            | TASK-203           |         |
| TASK-205 | Integrasi Midtrans (create transaction)                      | Test dengan sandbox                           | TASK-201           | ✓       |
| TASK-206 | Webhook Midtrans (verifikasi SHA-512 dari body)              | Test: signature valid/invalid                 | TASK-205           |         |
| TASK-207 | Rekonsiliasi: nilai dari DB order, bukan payload             | Test: manipulasi payload tidak mengubah nilai | TASK-206           |         |
| TASK-208 | Laporan keuangan + daftar tunggakan                          | Output laporan benar; test                    | TASK-202, TASK-203 |         |
| TASK-209 | Halaman orang tua: tagihan + bayar                           | Test view + initiate pembayaran               | TASK-205           |         |
| TASK-210 | Mutation test khusus uang                                    | ≥3 cacat disuntik, semua tertangkap           | TASK-203..207      |         |

**Gate fase:** tagihan, pembayaran tunai & online, dan laporan akurat; pembayaran tidak bisa dobel; webhook aman.

---

## Fase 3 — Portal + CMS

**Goal:** halaman publik + pengelolaan konten.

| Task     | Deskripsi                                  | AC                                     | Dependensi | Paralel |
| -------- | ------------------------------------------ | -------------------------------------- | ---------- | ------- |
| TASK-301 | Migration `posts`, `banners`               | Migration + model                      | TASK-002   | ✓       |
| TASK-302 | CMS: CRUD berita/halaman/banner            | Test CRUD + RBAC admin                 | TASK-301   |         |
| TASK-303 | Portal publik (profil, berita, pengumuman) | Halaman publik render                  | TASK-302   |         |
| TASK-304 | Penjadwalan publish konten                 | Test: konten muncul pada waktu publish | TASK-302   | ✓       |
| TASK-305 | SEO dasar (meta, sitemap)                  | Meta & sitemap valid                   | TASK-303   | ✓       |
| TASK-306 | **[Opsional]** Aktifkan SSR untuk portal   | SSR render; build chunk SSR ter-emit   | TASK-303   |         |

**Gate fase:** portal publik tampil dan dapat dikelola via CMS.

---

## Fase 4 — PPDB

**Goal:** pendaftaran siswa baru online + seleksi.

| Task     | Deskripsi                                           | AC                                                 | Dependensi | Paralel |
| -------- | --------------------------------------------------- | -------------------------------------------------- | ---------- | ------- |
| TASK-401 | Migration `registrations`, `registration_documents` | Migration + model                                  | TASK-002   | ✓       |
| TASK-402 | Formulir pendaftaran publik + unggah berkas         | Validasi tipe/ukuran; kode akses dihasilkan        | TASK-401   |         |
| TASK-403 | Verifikasi berkas oleh admin                        | Test alur status                                   | TASK-402   |         |
| TASK-404 | Seleksi + pengumuman hasil                          | Test status lulus/tidak                            | TASK-403   |         |
| TASK-405 | Cek status oleh calon siswa (kode)                  | Test lookup status                                 | TASK-402   | ✓       |
| TASK-406 | Keamanan unggah berkas (whitelist, CSP sandbox)     | Test: tipe terlarang ditolak; SVG tidak executable | TASK-402   | ✓       |

**Gate fase:** calon siswa dapat mendaftar online dan cek status; admin dapat menyeleksi.

---

## Fase 5 — Learning / CBT

**Goal:** materi, tugas, bank soal, ujian.

| Task     | Deskripsi                                                            | AC                          | Dependensi | Paralel |
| -------- | -------------------------------------------------------------------- | --------------------------- | ---------- | ------- |
| TASK-501 | Migration `materials`, `assignments`, `assignment_submissions`       | Migration + model           | TASK-101   | ✓       |
| TASK-502 | Unggah materi + publikasi ke kelas                                   | Test CRUD + akses           | TASK-501   |         |
| TASK-503 | Tugas: buat, kumpul, nilai                                           | Test alur lengkap           | TASK-501   |         |
| TASK-504 | Migration `question_banks`, `exams`, `exam_attempts`, `exam_answers` | Migration + model           | TASK-101   | ✓       |
| TASK-505 | Bank soal + pembuatan ujian                                          | Test CRUD                   | TASK-504   |         |
| TASK-506 | CBT: pelaksanaan ujian + auto-nilai PG                               | Test skoring benar          | TASK-505   |         |
| TASK-507 | Anti-curang dasar (batas waktu, satu attempt)                        | Test: attempt ganda ditolak | TASK-506   |         |

**Gate fase:** guru dapat membuat ujian; siswa mengerjakan CBT; skor PG otomatis benar.

---

## Fase 6 — Operasional + Support

| Task     | Deskripsi                                            | AC                  | Dependensi         | Paralel |
| -------- | ---------------------------------------------------- | ------------------- | ------------------ | ------- |
| TASK-601 | Migration `inventories`, `letters`, `agendas`        | Migration + model   | TASK-002           | ✓       |
| TASK-602 | CRUD inventaris + mutasi                             | Test CRUD           | TASK-601           |         |
| TASK-603 | Surat masuk/keluar + penomoran                       | Test penomoran unik | TASK-601           | ✓       |
| TASK-604 | Agenda kegiatan                                      | Test CRUD           | TASK-601           | ✓       |
| TASK-605 | Migration `tickets`, `ticket_replies` + alur support | Test alur tiket     | TASK-002           | ✓       |
| TASK-606 | Dashboard kepsek (KPI + laporan)                     | Test data agregat   | TASK-208, TASK-105 |         |

**Gate fase:** modul operasional & support berfungsi; kepsek punya dashboard.

---

## Fase 7 — Design System, Hardening & UU PDP

| Task     | Deskripsi                                                         | AC                                   | Dependensi         | Paralel |
| -------- | ----------------------------------------------------------------- | ------------------------------------ | ------------------ | ------- |
| TASK-701 | Jalankan riset Refero (styles/screens/flows)                      | Rekomendasi visual terkunci          | —                  |         |
| TASK-702 | Token semantik status (`--warn`, `--danger`, `--info`, `--brand`) | Token terdokumentasi & diuji kontras | TASK-701           | ✓       |
| TASK-703 | Komponen `DataTable`, `StatusPill`, `FilterBar`, `Pagination`     | Komponen reusable + test render      | TASK-702           | ✓       |
| TASK-704 | `ConfirmDialog`, `ImportPreview`, `Stepper`, `FileUpload`         | Komponen reusable + test             | TASK-702           | ✓       |
| TASK-705 | Angka tabel `tabular-nums` + konsistensi                          | Review visual lulus                  | TASK-703           | ✓       |
| TASK-706 | Responsif tabel (mobile)                                          | Uji 720px & 880px                    | TASK-703           | ✓       |
| TASK-707 | Auto tema gelap sistem (`prefers-color-scheme`)                   | Tema mengikuti sistem                | TASK-702           | ✓       |
| TASK-708 | Aksesibilitas: audit kontras, fokus, ARIA                         | WCAG AA terpenuhi                    | TASK-703           | ✓       |
| TASK-709 | Aktifkan CSP produksi                                             | CSP aktif tanpa memecah aset         | TASK-701           | ✓       |
| TASK-710 | `TZ=Asia/Jakarta` + lokalisasi UI Bahasa Indonesia                | TZ & teks ID konsisten               | —                  | ✓       |
| TASK-711 | Audit log menyeluruh (nilai, uang, akun)                          | Semua aksi sensitif tercatat         | TASK-111, TASK-203 |         |
| TASK-712 | Kepatuhan UU PDP (consent, retensi, hak hapus)                    | Dokumen + implementasi dasar         | TASK-711           |         |
| TASK-713 | Strategi & uji backup/restore                                     | Backup dibuat & restore terbukti     | Fase 2             |         |
| TASK-714 | Mutation test menyeluruh                                          | Semua area kritis tertangkap         | Fase 0–6           |         |
| TASK-715 | Audit keamanan akhir (adversarial)                                | Laporan audit + perbaikan            | Semua              |         |

**Gate fase:** seluruh sistem lolos typecheck/lint/test/build; audit keamanan & aksesibilitas lulus; backup terbukti.

---

## Ringkasan Fase & Estimasi Relatif

| Fase | Isi                   | Task | Estimasi relatif      |
| ---- | --------------------- | ---- | --------------------- |
| 0    | Fondasi               | 12   | Besar                 |
| 1    | SIAKAD                | 11   | Besar                 |
| 2    | Keuangan              | 10   | Besar (paling kritis) |
| 3    | Portal + CMS          | 6    | Sedang                |
| 4    | PPDB                  | 6    | Sedang                |
| 5    | Learning/CBT          | 7    | Sedang                |
| 6    | Operasional + Support | 6    | Sedang                |
| 7    | Design + Hardening    | 15   | Besar                 |

**Total:** ~73 task.

---

## Dependency Graph (ringkas)

```
Fase 0 ──┬──> Fase 1 ──┬──> Fase 2 ──┐
         │             ├──> Fase 5   │
         ├──> Fase 3 ──┘             │
         ├──> Fase 4                 │
         ├──> Fase 6                 │
         └──────────────────────────>Fase 7 (hardening menyeluruh)
```

Fase 1 & 2 adalah jalur kritis. Fase 3/4/6 relatif independen setelah Fase 0.

---

## Risiko & Asumsi

| ID                 | Risiko/Asumsi                                                   | Mitigasi                                                       |
| ------------------ | --------------------------------------------------------------- | -------------------------------------------------------------- |
| RISK-IPD-001       | Migrasi auth mengubah `users` — bila ada data nyata, bisa rusak | Konfirmasi DB (TBD-BSD-06); backup dulu                        |
| RISK-IPD-002       | Kode unik lemah → takeover akun                                 | Kode panjang + rate limit + lockout                            |
| RISK-IPD-003       | Salah input nilai massal                                        | Pratinjau wajib sebelum simpan                                 |
| RISK-IPD-004       | Pembayaran dobel                                                | Idempotency key + transaksi atomik + mutation test             |
| RISK-IPD-005       | Kurikulum belum diputuskan → rapor tertunda                     | Putuskan TBD-BSD-05 sebelum TASK-108                           |
| RISK-IPD-006       | Midtrans sandbox belum tersedia                                 | Kerjakan TASK-205/206 di akhir Fase 2, gunakan mock bila perlu |
| ASSUMPTION-IPD-001 | Single-tenant                                                   | Sesuai keputusan pemilik                                       |
| ASSUMPTION-IPD-002 | Dev pakai SQLite, prod Postgres                                 | Konfigurasi ganda diuji                                        |

---

## 8. Daftar [TBD] yang Memblokir Task

| TBD                          | Memblokir                    |
| ---------------------------- | ---------------------------- |
| TBD-TRD-03 (faktor kedua)    | TASK-004/005 (bila diadopsi) |
| TBD-BSD-05 (kurikulum)       | TASK-108 (rapor)             |
| TBD-06 (Midtrans)            | TASK-205 (sandbox)           |
| TBD-BSD-06 (data user nyata) | TASK-002 (migrasi)           |
| TBD-DBD-01 (warna brand)     | TASK-702                     |
