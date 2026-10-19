# 12 — Operasional: Deploy, Backup, Keamanan

Runbook untuk menjalankan Sismart di dunia nyata (on-premise sekolah atau VPS). Target pembaca: kamu (IT sekolah) atau pengembang penerus.

## 1. Deployment

### Prasyarat produksi

- Server: Linux (Ubuntu/Debian disarankan) — 2 vCPU / 4GB RAM minimal (CBT >300 concurrent: lihat §4); Node ≥24; Docker + Compose.
- Domain + HTTPS (Caddy/Nginx + certbot) — **wajib** sebelum ada data nyata (password, SPP, gaji jalan di HTTP = tidak siap produksi).
- `.env` produksi: `APP_KEY` baru (`node ace generate:key`), `NODE_ENV=production`, DB kuat (password panjang acak), `VITE_APP_NAME=Sismart` di build, TZ=`Asia/Jakarta`.
- **Jangan kopi `.env` dev ke produksi** — APP_KEY dev dipakai ke produksi =session/config invalidation risk & credential hygiene jelek.

### Langkah rilis

```bash
git clone <repo> && cd sismart
cp .env.example .env      # isi nilai produksi
node ace generate:key
docker compose up -d      # Postgres
npm ci
node ace migration:run --force
node ace admin:create     # kredensial admin dari env produksi
npm run build
npm start                 # atau pm2 / systemd unit
```

- Health-check: `GET /login` 200; `docker compose ps` healthy; login admin sukses.
- Rollback: deploy per commit; kembalikan commit sebelumnya + **jangan rollback migration** (buat migrations baru pembeda).

### Keputusan menunggu: on-premise vs VPS (D2 masih fleksibel) — konsekuensi

| Aspek                      | On-premise                      | VPS                      |
| -------------------------- | ------------------------------- | ------------------------ |
| Akses orang tua dari rumah | butuh port-forward/VPN — risiko | mudah                    |
| Listrik/internet sekolah   | risiko mati                     | aman                     |
| Biaya                      | perangkat + listrik             | bulanan                  |
| Rekomendasi awal           | dev/staging                     | produksi awal lebih aman |

## 2. Backup & restore (D13 — desain berjalan wave WV-7)

**Prinsip: data nyata menunggu backup teruji.** Desain yang disepakati arahnya:

- `pg_dump` harian otomatis (docker-compose service cad job / host cron) → file ke volume terpisah + REKOMENDASI: salinan ke drive luar (USB/NAS/cloud berbayar setelah persetujuan).
- Retensi: harian 7 hari + mingguan 4 minggu + bulanan 12 (disesuaikan saat spec final).
- **Uji restore:** wajib setelah setup & berkala bulanan — restore ke DB fresh, bandingkan row-count tabel kunci; prosedur tertulis di runbook ini (agen dilengkapi saat IMPLEMENTASI D17).
- Restore darurat (draft): hentikan app → drop/recreate DB → `psql < dump` → jalankan migration:status (jangan run) → nyalakan app → tes login + smoke.

## 3. Keamanan checklist (sebelum publik)

Aplikasi:

- [ ] Semua route ber-modal sudah ber-middleware benar (review Rocky per wave)
- [ ] Rate-limit login + lockout aktif (SUDAH, D14) — sisa: highlight hardening kebijakan password global
- [ ] Upload file: whitelist jenis + ukuran max + rename + folder NON-public (E-learning)
- [ ] CSRF aktif (SUDAH); cookie `Secure` + `SameSite` di produksi HTTPS
- [ ] Headers (CSP, HSTS) via shield config — cek saat HTTPS matang
- [ ] Error pages tidak membocorkan stack trace di produksi
      Data:
- [ ] SPP/gaji: audit trail aktif (D13) + akses role paling kecil
- [ ] Backup restore teruji (dokumen ada)
- [ ] `.env` produksi tidak pernah masuk git; APP_KEY unik
      Orang:
- [ ] Akun nonaktif/pemecahan → deactivate (`is_active=false`) bukan hapus
- [ ] Password awal wajib ganti (WV-7: `must_change_password`)

## 4. Sizing CBT (D8 — >300 concurrent)

- Postgres `max_connections` + pool Adonis (hitungan: ~2–3 koneksi per siswa aktif short-burst → pool 20–30 cukup jika query pendek; PACK autosave jawaban SETIAP jawaban disimpan tapi dibatch).
- Index wajib sejak hari-1: semua FK, `tagihan(siswa_id,status)`, `partisipasi_ujian(ujian_id,siswa_id)` UNIQUE.
- Load test: k6/autocannon ke env staging — TARGET: p95 < 500ms pada 300 concurrent simpan jawaban.
- Log: pino ke file + rotasi; monitoring minimal: uptime cron + error alert sederhana.

## 5. Kepatuhan & data pribadi

- Data siswa/anak = data sensitif: akses kecil minimal prinsip; export hanya via fitur resmi; log audit akses Wali/guru bila diminta.
- MoU/kebijakan sekolah atas data & pemakaian sistem (luar scope teknis, tapi dicatat).
- Retensi data alumni: lulus/pindah → status berubah + data dipertahankan tergantung kebijakan sekolah (tinjau tiap beberapa tahun).
