# 13 — Rencana Perbaikan (konsolidasi 4 audit, 19 Okt)

Sumber: Audit-A (security/backend), Audit-B (frontend/design), Audit-C (test coverage), Audit-D (ops/proses) atas commit `70d2179`. Tindak lanjut UI (T-024..T-027, commit `25df654`) sudah diterapkan & disetujui Rocky; beberapa temuan Audit-B otomatis terselesaikan (dibubuhkan ✔).

## H1 — Perbaikan SEGERA (usulan: wave perbaikan berikutnya, ~1-2 hari kerja)

| ID  | Temuan                                                                                                                  | Sumber             | Effort | Aksi                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ------------------ | ------ | ---------------------------------------------------------------------------------------------------- |
| P1  | Error pages 404/500 masih Inggris + tanpa h1/Head (not_found.tsx:5-18, server_error.tsx:5-19)                           | B-BLOCKER          | S      | Tulis ulang ID + layout standar + h1                                                                 |
| P2  | Lockout DoS: tidak ada throttle per-IP — 5 percobaan anonim bisa mengunci kode siapa saja (kode mudah ditebak)          | A-MAJOR-1          | M      | IP-limiter longgar (20-30 POST/login/15mnt) + pesan tetap seragam                                    |
| P3  | `admin:create` bisa mempromosikan user existing → admin tanpa konfirmasi (updateOrCreate by kode apa pun)               | A-MAJOR-2          | S      | Abort bila user existing bukan admin + flag `--force` + test                                         |
| P4  | Title fallback 'AdonisJS' + `VITE_APP_NAME` absen + edge title + logger `APP_NAME` tak terdeklarasi                     | B-MAJOR, D-F5      | S      | Fallback 'Sismart', edge title, env keys (`VITE_APP_NAME`, `APP_NAME`)                               |
| P5  | Rotasi session login NOT_PROVEN (tidak ada test asersi cookie)                                                          | A-MINOR-1          | S      | Test Tara: cookie session berubah sebelum/sesudah login                                              |
| P6  | Password policy hanya di admin:create                                                                                   | A-MINOR-2          | S      | Validator sentral min 8 dipakai semua jalur (WV-7 akan membuat user)                                 |
| P7  | Menu mobile publik tanpa/kurang click-outside + focus-return; error form login tak terasosiasi (`aria-describedby`)     | B-MAJOR ×2         | S      | Port pola app shell + asosiasi error; plus BeritaTeaser link `/berita` + komentar basi (T-029 MINOR) |
| P8  | Favicon + OG meta nihil; sosial footer `href="#"` mati; ikon jam pakai MapPin                                           | B-MAJOR/MINOR      | S      | Favicon dari logo SVG + OG dasar; sosial diisi/ disembunyikan; ikon Clock                            |
| P9  | `login_attempts` bloat tanpa cleanup; CSP off; settings.tsx Inggris; hex mentah server_error; theme_toggle aria Inggris | A/B MINOR          | S      | Lazy-delete + (opsional) CSP reportOnly; Indonesianisasi + tokennisasi                               |
| P10 | Docker/ops: TZ env di compose, `GET /health`, CI GitHub Actions minimal (lint+typecheck+test)                           | D-F1/F2/F9, C-HIGH | S/M    | CI = decision Q; health+TZ wave berikutnya                                                           |

## H2 — Masuk WV-7 (data induk; spec 07 perlu 2 amendemen)

| ID  | Temuan                                                                                                 | Aksi                                                           |
| --- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| P11 | AC-DI-6 backup TIDAK memuat retensi/offsite/jadwal uji-restore (janji docs/12 §2)                      | Amend AC-DI-6a — butuh keputusan offsite & retensi (Q)         |
| P12 | Audit trail (D17) tidak muncul di deliverable WV-7                                                     | Putuskan desain (kolom created_by/updated_by vs tabel log) — Q |
| P13 | Tidak ada index strategis & angka=numeric (users.role_id/index, siswa composite, NISN unique-nullable) | Masuk migration WV-7                                           |
| P14 | Password dipakai semua jalur create/import → diikat P6 + import menolak lemah                          | Bagian AC-DI-4                                                 |

## H3 — Pra-produksi (sebelum data nyata/deploy)

| ID  | Temuan                                                                                                                                                                                                        | Aksi                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| P15 | Dockerfile app + service compose + process manager + `SESSION_DRIVER=cookie` smoke + uptime monitoring                                                                                                        | Wave pre-prod (docs/12 §1) |
| P16 | Konten CONTOH → data asli sekolah; gambar self-host; peta nyata; sosial asli                                                                                                                                  | Input dari sekolah (user)  |
| P17 | CI lengkap (incl. PG service test + browser scheduled); jalankan `npm audit fix --force` hanya saat upgrade toolchain (jangan sekarang — breaking hot-hook; 23 high = braces via dev-chain saja, non-runtime) | Setelah CI dasar jalan     |
| P18 | Load test CBT >300 (D8) + pool 20-30 + k6                                                                                                                                                                     | Wave CBT                   |

## Backlog terdaftar (tidak berulang di sini)

- D23-1..6 (title, kontras brand-blue 2.92:1 terukur, a11y menu publik, tap target, fokus click-outside app shell, ukuran ulang axe)
- Tambahan Audit-B: "Jalur Zuhud" (konfirmasi istilah sekolah), transisi tema hormati reduced-motion, route helper Tuyau (INFO)

## Yang SUDAH KUAT (jangan diubah)

Uper-set lockout atomik + test; anti-enumeration berhasil men-message tunggal; komposisi middleware; cookie flags; scrypt; zero plaintext; transformer minimal; CORS prod deny; 35/35 ×2 no-flaky; parity env 16/16; docs jujur.

## Catatan audit toolchain

`npm audit`: 0 critical, 23 high SEMUA transif dev-toolchain (`braces` via hot-hook/assembler) — tidak terekspos runtime; fix force = downgrade breaking → jadwalkan upgrade Adonis toolchain terjadwal, bukan sekarang.
