# 07 — SPEC Wave Data Induk + Dashboard (penutup Fase 0)

`SPEC-001-v1.2 · WV-7` · Status: **FINAL v1.0** — 5 pertanyaan bisnis dijawab dengan default tercatat (bagian "Keputusan Default", 19 Okt; semua mudah diubah via admin UI/konfigurasi).

## Keputusan Default Q1–Q5 (disahkan 19 Okt — ubah kapan saja di admin/UI)

- **Q1 jurusan (kode 2-digit):** pakai set standar → TKJ=10, RPL=11, DKV=12, AKL=13, OTM=14, TKR=15. Admin bisa rename/tambah jurusan + ubah kode via UI (kode lama yang sudah terpakai di kode unik TIDAK di-migrate otomatis — perubahan kode hanya berlaku untuk siswa baru).
- **Q2 format import:** **keduanya** Excel (.xlsx) + CSV. Dependency parser: `exceljs` (MIT, maintenance aktif). Template unduh dari halaman import.
- **Q3 hak staff/TU:** admin = penuh; staff = boleh input/edit **siswa** saja (baca jurusan/rombel/mapel); bendahara nanti (SPP) terpisah; guru/siswa/wali read-only data kelas masing-masing.
- **Q4 kolom siswa:** nama, jenis kelamin, tempat+tanggal lahir, alamat, agama (dropdown), NISN (opsional nullable), jurusan, rombel, tahun masuk, data wali (nama, hubungan, telp). Kolom tambahan mudah ditambah via migration baru bila sekolah minta.
- **Q5 dashboard:** default sederhana — kartu statistik (total siswa aktif, pegawai, rombel, jurusan; siswa per jurusan; status akun belum-aktif) + menu per role. Widget lain = backlog.

## Tujuan

Melengkapi fondasi: seluruh data induk terkelola via CRUD admin, generator kode unik otomatis, import massal Excel/CSV, dan dashboard yang tampil sesuai role. Setelah wave ini, sekolah bisa mulai mengisi data nyata dan Sismart siap menerima modul bisnis (Fase 1).

## Entitas & skema (ringkas)

| Tabel          | Kolom kunci                                                                                                                      | Catatan                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `jurusan`      | `kode_2digit` (UNIQUE — dipakai di kode unik siswa), `nama`, `deskripsi`, `is_active`                                            | contoh: TKJ, RPL, DKV, AKL, OTM, TKR                 |
| `tahun_ajaran` | `tahun_mulai`, `semester` (ganjil/genap), `is_active` (SATU aktif)                                                               | rollover = proses admin, bukan otomatis              |
| `siswa`        | `user_id` FK, `jurusan_id`, `rombel_id` nullable, `tahun_masuk`, `tanggal_lahir`, `alamat`, `status` (aktif/lulus/pindah/keluar) | identitas login = users.kode_unik (format S)         |
| `pegawai`      | `user_id` FK, `jabatan`, `tahun_masuk`, `nuptk/nip nullable`, `status`                                                           | guru/staff/TU/kepala_sekolah — role menentukan akses |
| `rombel`       | `nama`, `tingkat` (X/XI/XII), `jurusan_id`, `tahun_ajaran_id`, `wali_kelas_id` (pegawai)                                         | wali kelas = role fitur dari pegawai                 |
| `data_wali`    | `siswa_id`, `nama_wali`, `user_id` nullable (akun wali), `hubungan`, `telp`                                                      | 1 wali per siswa (D4)                                |

Aturan generator kode unik (D3): sequence itu atomik (transaksi + UNIQUE + retry collision), format S/K sesuai `kode_unik.ts`, **reset per tahun masuk baru** — counter dihitung dari data existing tahun-ts b, bukan tabel counter terpisah (KISS).

## Deliverable

1. Migration + model + validasi semua tabel di atas (migration baru, immutable rule)
2. CRUD admin: jurusan, tahun ajaran, rombel, mapel, siswa (beserta pembuatan akun user + wali), pegawai — akses `admin` (+staff/TU baca-saja? lihat Q3)
3. Generator kode unik atomik + unit test collision
4. **Import Excel/CSV** siswa & pegawai: template kolom, upload → validasi per baris (format kode, duplikat, relasi jurusan/rombel) → preview tabel hasil validasi → commit eksplisit; laporan per-baris gagal+alasan
5. **Dashboard multi-role**: menu navigasi per role (admin/staff/guru/kepsek/siswa/wali) + kartu statistik ringkas (jumlah siswa/pegawai/rombel per jurusan) — query sederhana ter-index
6. Halaman aktivasi akun (cetak/hantar kredensial awal): admin melihat password sementara SEKALI saat pembuatan, wajib ganti password saat login pertama (field `must_change_password`)
7. **Backup D17 (wajib di wave ini):** `pg_dump` script + entry docker-compose (service cad) + dokumen uji restore + uji restore aktual bukti

## Acceptance criteria

- **AC-DI-1:** CRUD semua tabel induk berfungsi tervalidasi; akses ditolak untuk non-admin (kecuali disetujui Q3); teruji functional test per role
- **AC-DI-2:** Generator kode unik: format benar, UNIQUE, sequential 001+ tanpa collision saat parallel (test konkurensi), reset per tahun masuk — test unit
- **AC-DI-3:** Import Excel/CSV: 3 jalur (template benar diterima; baris invalid ditolak dengan alasan per baris; commit eksplisit); test tanpa file nyata menggunakan fixture
- **AC-DI-4:** Pembuatan siswa → akun user + kode unik + password sementara tertampil sekali; `must_change_password` memaksa ganti password di login pertama; wali akun bisa dibuat dan menautkan siswa
- **AC-DI-5:** Dashboard: admin melihat semua; guru melihat menu guru; siswa/wali menu mereka; statistik angka benar (dicek test db seeded)
- **AC-DI-6:** Backup: pg_dump jalan, file terbentuk di volume, restore teruji ke DB fresh (bukti)
- **AC-DI-7:** lint + typecheck + full test suite + build lulus; tidak ada regresi (35 test semuanya tetap hijau + test baru)

## Pertanyaan bisnis (menentukan spec final)

- **Q1:** Daftar jurusan + kode 2-digit (butuh untuk kode unik) — pakai set standar? atau daftar asli sekolah (sebutkan)?
- **Q2:** Format import: Excel saja / CSV saja / keduanya? (butuh dependency parser — perlu persetujuanmu)
- **Q3:** Staff/TU boleh menginput data apa saja, atau read-only fitur tertentu? (default: admin penuh, staff boleh input siswa saja)
- **Q4:** Data profil siswa minimal: nama, jenis kelamin, TTL, alamat, jurusan, rombel, data wali (nama+telp) — cukup, atau ada kolom tambahan wajib (NISN, divisi agama, dsb.)?
- **Q5:** Dashboard: statistik ringkas default cukup, atau ada widget tertentu yang kamu mau?

## Scope out wave ini

- Jadwal pelajaran, nilai, rapor (Fase 2); slip/kartu PDF; notifikasi email/WA; modul bisnis lain
