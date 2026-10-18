# 02 — Keputusan Desain (semuanya user-approved)

Semua keputusan di bawah terkunci dari sesi diskusi 17–18 Okt 2026 dan mengikat implementasi. Perubahan hanya lewat keputusan user terbaru, dicatat di sini sebagai revisi.

## D1 — Stack

**AdonisJS 7 + Inertia React 19 + Tailwind CSS v4 + PostgreSQL on-premise (Docker).** Backend session-based. Validasi VineJS. Tanpa library RBAC eksternal. Alias import backend per `package.json → imports` (`#controllers/*`, `#models/*`, `#services/*`, dst.); frontend `~/` → `inertia/` dan `@generated` (via `vite.config.ts`).

## D2 — Database & hosting

PostgreSQL **on-premise** via `docker-compose.yml` (volume `postgres_data`, healthcheck, binding `127.0.0.1`). Suite test **SQLite** (`NODE_ENV=test`). **Port kanonik: 5432** (default compose & `.env.example`); dev lokal di mesin pemilik project memakai override `DB_PORT=5433` karena 5432 terpakai container lain — bukan standar. Deploy produksi: fleksibel **on-premise sekolah atau VPS**.

## D3 — Kode unik (login tanpa SSO)

Identitas login = kode unik + password; **Google SSO batal**.

- **Siswa:** `S` + 2 digit tahun masuk + 2 digit kode program studi + 1 digit gender (1=L, 0=P) + 3 digit sequence **001–999**, reset tiap tahun ajaran. Contoh `S26101001`.
- **Karyawan:** `K` + 2 digit tahun masuk + 1 digit gender + 3 digit sequence. Contoh `K261001`.
- **Status koreksi (hasil audit):** regex `app/services/kode_unik.ts` saat ini masih menerima sequence `000` dan ada test yang meng-assert-valid — **bertentangan dengan aturan 001–999**. Koreksi dijadwalkan (Cody: pattern+validator; Tara: koreksi test). Dilarang memakai `000` di data nyata.
- Generator nomor sequence dibangun bersama modul data induk.

## D4 — Portal & peran + akun wali

1 portal multi-role: admin, kepala_sekolah, guru, staff, siswa, wali. **Wali punya akun: 1 akun wali per siswa.** Opsi "1 akun per keluarga" **ditolak** (tidak dipilih). Struktur akun wali disiapkan sekarang; fiturnya menyusul.

## D5 — Absensi

- Granularitas siswa: **harian** — status hadir/sakit/izin/alfa/terlambat.
- Metode: **manual web + QR dinamis** (QR berganti ±30 detik, siswa scan via HP sendiri). Fallback manual selalu tersedia.

## D6 — Pembayaran SPP

Dua jalur: (a) **tunai di bendahara**, kuitansi digital tercat; (b) **transfer via Midtrans** + webhook konfirmasi.
Eksekusi: **sandbox dulu**; produksi但 butuh akun/key milik sekolah + persetujuan user terpisah (aksi eksternal & berbayar).

## D7 — Penggajian

**Campuran:** tunjangan kehadiran dihitung otomatis dari absensi guru; komponen lain (jabatan, kinerja, potongan BPJS/koperasi) input manual bendahara.

## D8 — CBT

Beban puncak **>300 siswa bersamaan** → connection pooling, indeks ketat, **uji beban = AC wajib modul CBT**. Jenis soal, acak urutan, timer auto-submit: rinci saat spec modul CBT.

## D9 — Data awal

**Import massal Excel/CSV diperlukan** untuk siswa & pegawai (validasi duplikat, preview sebelum commit).

## D10 — Urutan build

Semua modul dibangun; eksekusi per wave setelah fondasi. Fondasi memblokir semuanya (dependency teknis).

## D11 — Kebijakan operasional

- Tanpa persetujuan user: tidak ada commit/push/deploy/publish, aksi eksternal/berbayar, penghapusan data.
- Secret tidak pernah masuk source/log/laporan; admin bootstrap hanya via env (`ADMIN_*`).
- Spec berubah versi bila perilaku/scope/AC berubah.

## D12 — Timezone (hasil audit)

Baku: **`Asia/Jakarta` (WIB)** — konsisten keputusan user "UI Indonesia, Rupiah, WIB". `.env.example` saat ini `TZ=UTC` → **koreksi dijadwalkan (T-009)**. Semua penyimpanan waktu mengikuti keputusan ini; absensi/SPP/gaji nyata jangan dijalankan sebelum koreksi.

## D13 — Backup & audit trail (status: BELUM DIPUTUSKAN)

Prinsip sudah disepakati (wajib sebelum data finansial nyata), **desainnya belum**: backend/jadwal `pg_dump` + lokasi + **uji restore berkala**; desain audit trail (tabel audit vs event log) belum dipilih. Dicatat eksplisit agar tidak dikira sudah ada.
