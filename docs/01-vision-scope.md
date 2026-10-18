# 01 — Visi & Scope

## Latar belakang

Sismart dibangun karena seluruh pengelolaan sekolah (SMK, >600 siswa aktif) masih **manual**: akademik, SPP, e-learning, CBT, absensi, gaji, inventaris. Project penugasan resmi, time frame **≥ 3 bulan**, dan harus benar-benar terpakai sekolah — bukan demo.

## Tujuan

Satu sistem web terintegrasi: **satu portal, multi-role**.

## Pengguna & peran

| Peran                  | Akses utama                                             |
| ---------------------- | ------------------------------------------------------- |
| `admin`                | Seluruh sistem: data induk, manajemen user, konfigurasi |
| `kepala_sekolah`       | Read-only semua laporan & pemantauan                    |
| `guru`                 | Absensi, e-learning, CBT, nilai, data kelas yang diampu |
| `staff` (TU/bendahara) | SPP, kepegawaian, inventaris, administrasi              |
| `siswa`                | Lihat nilai/rapor, e-learning, CBT, tagihan SPP         |
| `wali` (orang tua)     | Lihat nilai, absensi, tagihan SPP **anaknya**           |

> Detail akun wali: **1 akun wali per siswa** (keputusan D4). Fitur akses wali disiapkan struktur datanya, dibangun menyusul.

Login: **kode unik + password** (lihat `02-keputusan-desain.md` D3). Tidak ada registrasi mandiri; akun dibuat/dikelola admin.

## Scope in

- **Fase 0 — Fondasi:** infra Docker+PostgreSQL, Tailwind, auth, RBAC, data induk, dashboard multi-role
- **Fase 1–4 — Modul bisnis:** absensi, SPP, e-learning, CBT, penggajian, inventaris, akademik lanjutan (jadwal, nilai, rapor)
- Fitur import massal (Excel/CSV) untuk data siswa & pegawai existing
- UI bahasa Indonesia, Rupiah, timezone WIB (`Asia/Jakarta`), tahun ajaran ganjil/genap

## Scope out (eksplisit tidak dibangun)

- Integrasi hardware RFID/fingerprint; aplikasi mobile native; SMS/WA gateway
- Self-registration & lupa password (belum diminta; bisa masuk fase lanjutan bila nanti diminta)
- Migrasi data historis massal (import CSV cukup untuk kebutuhan awal)
- Hosting Supabase (dipilih PostgreSQL on-premise/Docker)

## Rencana deployment

Fleksibel: **on-premise sekolah atau VPS** (keputusan D2). Prasyarat sebelum produksi: backup DB otomatis + uji restore, HTTPS, `APP_KEY` khusus produksi (lihat D11/D13 dan 03-bootstrap).

## Lisensi & kepemilikan

Proprietary — milik sekolah, penggunaan internal. `package.json` tercatat `UNLICENSED`; status legal formal (hak pakai, kontrak pengembang) menyusul di luar scope teknis.
