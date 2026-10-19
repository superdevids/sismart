# 11 — Spesifikasi Detil 7 Modul (pra-spesifikasi wave)

Peta detail per modul sebelum spesifikasi formal per wave dibuat. Semua berbasis keputusan D1–D23. Setiap modul wajib naik-kan menjadi spec formal (pola `docs/07`) sebelum pengembangannya; dokumen ini = kerangka kerja & pencegah kegagalan bisnis.

## 1. Modul Absensi (Fase 1)

**Fitur:** presensi harian siswa (hadir/sakit/izin/alfa/terlambat); QR dinamis rotasi ±30 detik (siswa scan via HP, anti titip-absen); input manual guru/admin; presensi guru (hari kerja); rekap harian/bulanan per kelas & siswa; kaitan ke gaji (D7).

**Entitas inti:** `absensi_siswa (id, siswa_id, tanggal, status, metode[manual/qr], диcatat_oleh, keterangan)`, `absensi_pegawai (…)`, `qr_token (token, expires_at, dipakai_oleh)` — UNIQUE(siswa_id, tanggal).

**AC potensial:** grief 1 siswa 1 baris/hari; QR kadaluarsa ditolak; guru hanya bisa absen kelas/dari jadwalnya; rekap konsisten (test seeded); fallback manual selalu bisa.

**Risiko:** HP tanpa jaringan (fallback manual); QR replay (token sekali-pakai/rotasi ketat); jam server WIB (D12).

## 2. Modul SPP (Fase 1)

**Fitur:** tagihan bulanan per siswa (+ jenis biaya lain bila diputuskan saat spec), pembayaran tunai di bendahara + kuitansi digital, transfer via **Midtrans** (sandbox dulu; produksi butuh kredensial sekolah + persetujuan terpisah), webhook konfirmasi otomatis, tunggakan, laporan bulanan.

**Entitas inti:** `jenis_pembayaran`, `tagihan (siswa_id, jenis, periode, nominal, jatuh_tempo, status)`, `pembayaran (tagihan_id, metode[tunai/gateway], ref_midtrans nullable, kasir, bukti)`, `pembayaran_bank_log` (webhook idempotent).

**AC potensial:** tagihan tidak bisa dua kali lunas; kasir hanya bisa lunas → kuitansi; webhook idempotent (replay ditolak); tunggakan = unpaid & lewat jatuh tempo; laporan reconsile.

**Risiko:** UANG — idempotensi webhook, audit trail (D13), pembulatan/decimal (pakai string/int rupiah, jangan float); akses ketat (kasir saja).

## 3. Modul Akademik lanjutan (Fase 2)

**Fitur:** jadwal pelajaran per rombel (slot mingguan), pedoman jam, data nilai per mapel per siswa per semester, rapor (buku nilai → PC cetak), siklus tahun ajaran: naik tingkat / mengulang / lulus / pindah / keluar.

**Entitas inti selain data induk:** `jadwal (rombel_id, mapel_id, pegawai_id, hari, jam_mulai, jam_selesai)`, `nilai (siswa_id, mapel_id, tahun_ajaran_id, jenis[harian/uts/uas], angka)`, `rapor (…, status)`, `riwayat_kelas (siswa_id, rombel_id, tahun_ajaran_id, hasil_naik/tinggal/lulus)`.

**AC potensial:** jadwal tidak bentrok (guru/kelas/ruang); nilai range 0–100 tervalidasi; rapor konsisten dengan nilai; rollover uji-skenario penuh.

**Risiko:** rollover tahun ajaran = operasi besar (WAJIB backup + dry-run); nilai = data sensitif siswa.

## 4. Modul E-Learning (Fase 2)

**Fitur:** materi per mapel/rombel (dokumen/link), tugas + deadline, pengumpulan siswa, penilaian guru, komentar minimal.

**Entitas inti:** `materi (mapel_id, rombel_id, judul, file/link, urutan)`, `tugas (materi…/mapel, deadline, bobot)`, `pengumpulan (tugas_id, siswa_id, file, submitted_at, nilai, feedback)`.

**AC potensial:** hanya siswa rombel bersangkutan melihat; deadline dingin (submit telah di tandah telat); file size/type tervalidasi; storage lokal diukur.

**Risiko:** kapasitas disk server on-premise; antivirus/jenis file (larang exe/script upload).

## 5. Modul CBT (Fase 3)

**Fitur:** bank soal (PG/PG-kompleks/esai per mapel+tingkat), paket ujian, sesi ujian terjadwal, timer + auto-submit saat waktu habis, urutan soal teracak per siswa, grading otomatis PG + manual esai oleh guru, hasil/analisa.

**Entitas inti:** `bank_soal (mapel_id, tingkat, tipe, pertanyaan, opsi JSON, kunci, bobot)`, `ujian (mapel_id, rombel_id, durasi_menit, jadwal_mulai/selesai, acak bool)`, `partisipasi_ujian (ujian_id, siswa_id, mulai, selesai, status, skor)`, `jawaban_siswa (partisipasi_id, soal_id, jawaban, skor_manual)`.

**AC potensial:** **load test >300 siswa concurrent (D8) = AC WAJIB**; anti-refresh/reset jawaban tersimpan per-jawaban (autosave); timer server-authority (client-time tidak dipercaya); siswa lain tidak bisa lihat soal di luar sesinya; nanti: bypass check.

**Risiko:** puncak konkurensi (pooling + indeks + load-test nyata); jaringan sekolah drop mid-exam (autosave minimal 10 Detik); integritas (soal tidak bocor sebelum mulai).

## 6. Modul Penggajian (Fase 3)

**Fitur:** komponen gaji (gapok/tunjangan jabatan/potongan — input manual D7), tunjangan kehadiran OTOMATIS dari absensi pegawai (D7), periode payroll, slip gaji (PDF cetak), rekap.

**Entitas inti:** `komponen_gaji (nama, tipe[tambahan/potongan], sumber[manual/absensi], nominal/rumus)`, `payroll_period`, `slip (pegawai_id, periode_id, komponen breakdown JSON, total, status[paid])`.

**AC potensial:** tunjangan kehadiran terhitung dari rekap absensi (test seeded absensi); pembulatan konsisten; periode dikunci (perubahan absensi pasca-lock tidak mengubah slip); akses: hanya admin/bendahara (+ kepsek read-only).

**Risiko:** UANG — presisi angka, audit trail setiap perubahan komponen; PII & sensitivitas (gaji = data paling sensitif di sistem).

## 7. Modul Inventaris (Fase 4)

**Fitur:** kategori barang, data barang (kode barcode opsional), lokasi ruang, kondisi, peminjaman/pengembalian (guru/kelas), laporan tahunan, penurunan (hapus mutasi).

**Entitas inti:** `kategori`, `barang (kode, nama, kategori, lokasi, kondisi[baik/rusak-ringan/rusak-berat], jumlah/satuan, tahun_beli)`, `peminjaman (barang_id, peminjam, tgl_pinjam/tenggat/kembali, kondisi-baik)`.

**AC potensial:** stok tidak minus; peminjaman overdue terlihat; tindak perubahan status diaudit; laporan tahunan konsisten.

**QR label aset:** opsional — konfirmasi saat spec.

## Matriks lintas modul (keputusan arah desain)

| Kebutuhan bersama         | Jawaban arah                                                                                       |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| Audit trail               | D13 — tabel audit generik vs event log: diputuskan saat spec SPP (modul pertama yang bermata uang) |
| Notifikasi                | Tidak ada infra email/WA → semua "tampilkan di portal"; WA/email = opsional fase lambat            |
| Export laporan            | Min: CSV/Excel server-side report per modul (dibawa saat modul dibuat, bukan setelahnya)           |
| PDF (kuitansi/slip/rapor) | pustaka PDF server-side — pilih saat spec SPP                                                      |
| Angka uang                | integer rupiah (tanpa desimal) — BEBAS float                                                       |
