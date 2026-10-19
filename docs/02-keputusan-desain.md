# 02 â€” Keputusan Desain (semuanya user-approved)

Semua keputusan di bawah terkunci dari sesi diskusi 17â€“18 Okt 2026 dan mengikat implementasi. Perubahan hanya lewat keputusan user terbaru, dicatat di sini sebagai revisi.

## D1 â€” Stack

**AdonisJS 7 + Inertia React 19 + Tailwind CSS v4 + PostgreSQL on-premise (Docker).** Backend session-based. Validasi VineJS. Tanpa library RBAC eksternal. Alias import backend per `package.json â†’ imports` (`#controllers/*`, `#models/*`, `#services/*`, dst.); frontend `~/` â†’ `inertia/` dan `@generated` (via `vite.config.ts`).

## D2 â€” Database & hosting

PostgreSQL **on-premise** via `docker-compose.yml` (volume `postgres_data`, healthcheck, binding `127.0.0.1`). Suite test **SQLite** (`NODE_ENV=test`). **Port kanonik: 5432** (default compose & `.env.example`); dev lokal di mesin pemilik project memakai override `DB_PORT=5433` karena 5432 terpakai container lain â€” bukan standar. Deploy produksi: fleksibel **on-premise sekolah atau VPS**.

## D3 â€” Kode unik (login tanpa SSO)

Identitas login = kode unik + password; **Google SSO batal**.

- **Siswa:** `S` + 2 digit tahun masuk + 2 digit kode program studi + 1 digit gender (1=L, 0=P) + 3 digit sequence **001â€“999**, reset tiap tahun ajaran. Contoh `S26101001`.
- **Karyawan:** `K` + 2 digit tahun masuk + 1 digit gender + 3 digit sequence. Contoh `K261001`.
- **Status koreksi (selesai 18 Okt):** regex kini menolak sequence `000` (`(?!000)`) dan test dikoreksi â€” review Rocky T-010 `APPROVED` (menunggu commit berikutnya). Generator nomor sequence tetap dibangun bersama modul data induk.
- Generator nomor sequence dibangun bersama modul data induk.

## D4 â€” Portal & peran + akun wali

1 portal multi-role: admin, kepala_sekolah, guru, staff, siswa, wali. **Wali punya akun: 1 akun wali per siswa.** Opsi "1 akun per keluarga" **ditolak** (tidak dipilih). Struktur akun wali disiapkan sekarang; fiturnya menyusul.

## D5 â€” Absensi

- Granularitas siswa: **harian** â€” status hadir/sakit/izin/alfa/terlambat.
- Metode: **manual web + QR dinamis** (QR berganti Â±30 detik, siswa scan via HP sendiri). Fallback manual selalu tersedia.

## D6 â€” Pembayaran SPP

Dua jalur: (a) **tunai di bendahara**, kuitansi digital tercat; (b) **transfer via Midtrans** + webhook konfirmasi.
Eksekusi: **sandbox dulu**; produksiä½† butuh akun/key milik sekolah + persetujuan user terpisah (aksi eksternal & berbayar).

## D7 â€” Penggajian

**Campuran:** tunjangan kehadiran dihitung otomatis dari absensi guru; komponen lain (jabatan, kinerja, potongan BPJS/koperasi) input manual bendahara.

## D8 â€” CBT

Beban puncak **>300 siswa bersamaan** â†’ connection pooling, indeks ketat, **uji beban = AC wajib modul CBT**. Jenis soal, acak urutan, timer auto-submit: rinci saat spec modul CBT.

## D9 â€” Data awal

**Import massal Excel/CSV diperlukan** untuk siswa & pegawai (validasi duplikat, preview sebelum commit).

## D10 â€” Urutan build

Semua modul dibangun; eksekusi per wave setelah fondasi. Fondasi memblokir semuanya (dependency teknis).

## D11 â€” Kebijakan operasional

- Tanpa persetujuan user: tidak ada commit/push/deploy/publish, aksi eksternal/berbayar, penghapusan data.
- Secret tidak pernah masuk source/log/laporan; admin bootstrap hanya via env (`ADMIN_*`).
- Spec berubah versi bila perilaku/scope/AC berubah.

## D12 â€” Timezone (hasil audit)

Baku: **`Asia/Jakarta` (WIB)** â€” konsisten keputusan user "UI Indonesia, Rupiah, WIB". `.env.example` saat ini `TZ=UTC` â†’ **koreksi dijadwalkan (T-009)**. Semua penyimpanan waktu mengikuti keputusan ini; absensi/SPP/gaji nyata jangan dijalankan sebelum koreksi.

## D13 â€” Backup & audit trail (status: BELUM DIPUTUSKAN)

Prinsip sudah disepakati (wajib sebelum data finansial nyata), **desainnya belum**: backend/jadwal `pg_dump` + lokasi + **uji restore berkala**; desain audit trail (tabel audit vs event log) belum dipilih. Dicatat eksplisit agar tidak dikira sudah ada.

## D14 - Rate-limit & password policy (keputusan 18 Okt)

Dikerjakan sekarang, ringan: lockout sementara per kode unik pada percobaan login gagal beruntun + password min 8 karakter saat pembuatan user apa pun. Hardening lanjutan menyusul.

## D15 - Pesan akun nonaktif (keputusan 18 Okt)

Disamakan dengan pesan kredensial salah ("Kode unik atau password salah.") - menutup kebocoran eksistensi akun. Akun nonaktif tetap tidak bisa login.

## D16 - User tanpa role (keputusan 18 Okt)

Diberi gate: dialihkan ke halaman "menunggu aktivasi" (tidak melihat dashboard). Halaman minimal dulu; rupa final menyusul di wave dashboard.

## D17 - Backup: desain jalan sekarang (keputusan 18 Okt)

Sebelum wave data induk: script pg_dump terjadwal (docker-compose + volume backup terpisah) + dokumen/prosedur uji restore. Desain audit trail masuk spec data induk.

## D18 - Palet identitas (keputusan 18 Okt)

Warna base Sismart: #FCDF1C (yellow), #555C7D (slate), #1C46FC (blue), #FCA91C (orange), #7D7753 (olive). Dipetakan ke design token + Tailwind @theme bridge. RENCANA LANJUTAN: dashboard admin (khusus admin) dapat custom warna tema di kemudian hari; nilai ini = base default.

## D19 - Font identitas (keputusan 18 Okt)

Plus Jakarta Sans, self-host (tanpa CDN eksternal), fallback ke system stack. System stack lama tetap fallback.

## D20 - Logo (keputusan 18 Okt)

Wordmark "Sismart" + icon SVG geometris; di masa depan dapat diganti logo milik sekolah (custom upload/binding).

## D21 - Halaman beranda (keputusan 18 Okt)

Halaman / menjadi landing sekolah minimalis (identitas + tombol masuk), menggantikan marketing boilerplate AdonisJS. Semua copy UI diterjemahkan ke Bahasa Indonesia (bisa menggelinding dari kebijakan UI Indonesia).

## D22 - .env.test (keputusan 18 Okt)

Ikut ter-track git (isi: kredensial test non-produksi). Repo harus tetap private.

## D24 - Data induk defaults (keputusan 19 Okt)

SPEC WV-7 (docs/07) FINAL dengan default: jurusan standar TKJ=10/RPL=11/DKV=12/AKL=13/OTM=14/TKR=15 (editable admin, perubahan kode tidak migrasi silang siswa lama); import keduanya xlsx+CSV dengan dependency exceljs; staff (TU) boleh input/edit siswa saja; kolom siswa = nama, gender, TTL, alamat, agama, NISN nullable, jurusan, rombel, tahun masuk, data wali; dashboard default statistik ringkas + menu per role. Password awal wajib ganti (must_change_password).

## D23 - Backlog 4 MINOR frontend (keputusan 18 Okt)

Empat temuan MINOR hasil review Rocky (T-018b) DIPUTUSKAN menjadi backlog non-blocking (fix tiga kali dibatalkan sebelum menulis kode):

1. Fallback `<title>` masih '- AdonisJS' (inertia/app.tsx:9) + `VITE_APP_NAME` belum di .env.example
2. Kontras `text-brand-blue` (#1c46fc) di dark mode ~2.9:1 < AA untuk teks kecil - sebaiknya `.text-accent` adaptif (5 titik di landing)
3. Menu mobile publik belum punya click-outside + focus-return (Escape sudah ada)
4. Tap target 36px pada hamburger publik & pil anchor (rekomendasi 40px)
5. (Baru, hasil verifikasi Tara T-022) App shell mobile: klik-luar menutup menu tapi fokus tidak kembali ke toggle (Escape sudah benar) - tambahkan menuButtonRef.focus() pada handler click-outside (inertia/layouts/app.tsx)
6. (Baru, T-022) Kontras text-brand-blue di dark terukur 2.92:1 - konfirmasi terukur untuk item 2
   Kewajiban: dikerjakan sebelum rilis produksi publik; landing page sekolah tidak boleh publikasi selama item 1-2 belum selesai.
