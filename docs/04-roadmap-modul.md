# 04 — Roadmap 7 Modul

Semua modul akan dibangun (D10). Fondasi memblokir semuanya. Tiap modul wajib punya spec + AC sendiri sebelum wave-nya dibuka. Pola eksekusi: **Cody implement → Rocky review → Tara verifikasi.**

## Fase & modul

### Fase 0 — FONDASI (parsial)

- **Selesai & approved:** infra (Docker+pg+Tailwind), auth kode unik, RBAC 6 role — SNAP-3; verifikasi Tara final PAUSED (T-006).
- **Belum mulai & BELUM BERSPEK (masuk definisi Fase 0):**
  - **Data induk:** siswa, pegawai (guru/staff/TU), jurusan/program studi, rombel X/XI/XII, mapel, tahun ajaran/semester, **generator sequence kode unik** (reset per tahun ajaran), import Excel/CSV (duplikat-check + preview). **Spec + skema relasi terhadap `users.kode_unik` wajib disusun sebelum wave dibuka.**
  - **Dashboard multi-role:** menu per role, responsif desktop. (Nav saat ini statis; dashboard placeholder.)

### Fase 1 — Operasional harian

**Absensi (D5):** presensi harian siswa (hadir/sakit/izin/alfa/terlambat), QR dinamis ±30 dtk, input manual guru/admin, rekap harian/bulanan; presensi guru (yang dipakai gaji).
**SPP (D6):** tagihan bulanan per siswa (jenis biaya tambahan dirinci saat spec), tunai+bendahara/kuitansi digital, Midtrans (sandbox dulu), tunggakan & laporan.

### Fase 2 — KBM digital

**Akademik lanjutan:** jadwal pelajaran per rombel, jam pelajaran, nilai, rapor, siklus tahun ajaran (naik tingkat/lulus/pindah/keluar).
**E-learning:** materi per mapel/kelas, tugas+deadline, pengumpulan, penilaian; kebutuhan storage file diukur saat spec.

### Fase 3 — Ujian & penggajian

**CBT (D8):** bank soal (PG/PG kompleks/esai), sesi ujian terjadwal, timer auto-submit, acak urutan, grading otomatis+manual, **load test >300 concurrent = AC wajib**.
**Penggajian (D7, D13):** komponen gaji, tunjangan kehadiran otomatis dari absensi, input manual lainnya, slip gaji. Akses: admin/bendahara + kepala_sekolah read-only; backup harus sudah jalan.

### Fase 4 — Aset

**Inventaris:** kategori, lokasi ruang, kondisi, peminjaman/pengembalian, laporan; QR label aset = opsional, dikonfirmasi saat spec.

## Prioritas antar-fase

Urutan di atas = default; bisa dinaikkan/diturunkan lewat keputusan user (mis. mendekati ujian semester, akademik/rapor naik prioritas). Perubahan urutan bukan perubahan spec kecuali mengubah scope/AC modul.

## Risiko lintas modul

| Risiko                            | Kaitan | Mitigasi                                                  |
| --------------------------------- | ------ | --------------------------------------------------------- |
| Data finansial (SPP, gaji)        | F1, F3 | RBAC ketat, **D13 backup+audit wajib sebelum data nyata** |
| Beban CBT >300 bersamaan          | F3     | Pooling, indeks, load test = AC                           |
| QR butuh HP + jaringan            | F1     | Fallback manual selalu tersedia                           |
| Konflik port 5432 di server       | Infra  | `DB_PORT` env (kanonik 5432; dev lokal 5433 = override)   |
| CSS unlayered vs utility Tailwind | all UI | uji visual tiap halaman baru                              |
| Tanpa VCS (repo belum git)        | infra  | DECISION REQUIRED; lihat 06-audit B3                      |
