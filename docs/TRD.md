# TRD — Technical Requirements Document

> **Produk:** Sismart
> **Versi dokumen:** 1.0
> **Tanggal:** 2026-10-29
> **Status:** Draft untuk review pemilik
> **Terkait:** `PRD.md`, `DBD.md`, `BSD.md`, `IPD.md`

---

## 0. Catatan Sumber

Disusun dari kondisi nyata di disk (starter AdonisJS 7) + keputusan pemilik 2026-10-29 (single-sekolah, auth kode unik, 6 role, 10 modul, roadmap penuh). Yang belum diputuskan ditandai `[TBD]`.

**Prinsip teknis:** ikuti konvensi starter yang sudah ada; jangan tambah dependency/abstraksi tanpa kebutuhan nyata; perubahan minimal dan dapat dibuktikan.

---

## 1. Ringkasan Arsitektur

**Pola:** Monolith modular full-stack.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React 19)                    │
│         Inertia.js (adapter) + Tuyau (type-safe URL)     │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP (Inertia page props / form)
┌──────────────────────────▼──────────────────────────────┐
│                  AdonisJS 7 Server (Node 24)             │
│  ┌──────────┬──────────┬───────────┬─────────┬─────────┐ │
│  │ Routes   │Middleware│Controllers│Services │Models   │ │
│  ├──────────┴──────────┴───────────┴─────────┴─────────┤ │
│  │              Lucid ORM (tidak ada query mentah)      │ │
│  └──────────────────────────┬───────────────────────────┘ │
└─────────────────────────────┼───────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  PostgreSQL [TBD]  │  (dev saat ini: SQLite)
                    └────────────────────┘
```

**Karakteristik:**

- Server-rendered routing + rich client interactivity (Inertia), tanpa API terpisah kecuali yang memang perlu.
- Semua data lewat **Lucid ORM** (model + migration + schema generator).
- Validasi input lewat **VineJS**.
- Respons API (bila ada) via serializer `{ data }` (sudah ada di `providers/api_provider.ts`).

---

## 2. Stack Teknologi (terverifikasi dari `package.json`)

| Lapisan          | Teknologi                            | Versi           |
| ---------------- | ------------------------------------ | --------------- |
| Runtime          | Node.js                              | >= 24           |
| Framework        | AdonisJS core                        | ^7.5.2          |
| Auth             | @adonisjs/auth                       | ^10.1.0         |
| ORM              | @adonisjs/lucid                      | ^22.4.2         |
| Session          | @adonisjs/session                    | ^8.1.0          |
| Security         | @adonisjs/shield                     | ^9.0.0          |
| CORS             | @adonisjs/cors                       | ^3.0.0          |
| Static           | @adonisjs/static                     | ^2.0.1          |
| Frontend bridge  | @adonisjs/inertia + @inertiajs/react | ^5.0.1 / ^3.7.1 |
| Routing typesafe | @tuyau/core                          | ^1.2.2          |
| Validasi         | @vinejs/vine                         | ^4.4.0          |
| View engine      | edge.js                              | ^6.5.1          |
| UI               | React                                | ^19.3.0         |
| Ikon             | lucide-react                         | ^1.48.0         |
| Toast            | sonner                               | ^2.0.8          |
| Bundler          | Vite                                 | ^8.3.0          |
| Bahasa           | TypeScript                           | ~6.0.3          |
| Date/time        | luxon                                | ^3.7.2          |
| Testing          | Japa (runner/assert/browser-client)  | ^5.3.0          |
| DB driver dev    | better-sqlite3                       | ^13.0.3         |
| DB driver prod   | **[TBD]** pg                         | —               |

**[TBD-TRD-01]** Driver PostgreSQL (`pg`) belum terpasang; `config/database.ts` mengomentari konfigurasi `pg`.

---

## 3. Struktur Aplikasi (mengikuti konvensi AdonisJS)

```
app/
├── controllers/       # handler HTTP
├── middleware/        # request pipeline
├── models/            # Lucid models
├── services/          # logika domain (uang, nilai, dsb)
├── validators/        # skema VineJS
├── transformers/      # serialisasi model → JSON (tipe aman)
└── exceptions/        # error handler
config/                # konfigurasi (app, auth, database, session, ...)
database/
├── migrations/        # skema DB
└── schema.ts          # GENERATED — jangan edit manual
start/                 # routes, kernel, env, validator
inertia/               # frontend React (pages, layouts, components)
tests/                 # Japa (unit, functional, browser)
providers/             # service provider kustom
```

**Aturan:**

- `database/schema.ts` di-generate otomatis oleh `node ace migration:run` — **dilarang edit manual**.
- Logika domain berat (mis. pembayaran, perhitungan nilai) diletakkan di `app/services/`, bukan di controller.
- Controller tipis: validasi → service → respons.

---

## 4. Autentikasi & Otorisasi

### 4.1 Autentikasi (kode unik)

| Aspek                 | Keputusan                                                          |
| --------------------- | ------------------------------------------------------------------ |
| Mekanisme             | **Kode unik** (satu jalur, sesuai keputusan pemilik)               |
| Beda starter saat ini | Memakai email/password → **WAJIB dimigrasi**                       |
| Guard                 | Session guard `web` (sudah ada di `config/auth.ts`)                |
| Session               | Cookie, `httpOnly`, `sameSite: lax`, `secure` di produksi, umur 2h |
| Remember-me           | Nonaktif (konsisten starter)                                       |
| Lockout               | **[TBD-TRD-02]** setelah N gagal / M menit                         |

**Perubahan yang diperlukan dari starter:**

- Tabel `users`: ganti `email`/`password` menjadi `login_code` (unik) + `role`.
- Validator: ganti `loginValidator`/`signupValidator` untuk kode unik.
- `config/auth.ts`: `sessionUserProvider` tetap, tapi model diubah.
- **Catatan keamanan:** kode unik sebagai satu-satunya faktor berisiko bila mudah ditebak. Mitigasi: kode cukup panjang + rate limit + lockout. **[TBD-TRD-03]** apakah perlu faktor kedua untuk role admin/keuangan?

> **Rekomendasi arsitek:** untuk role `admin`/`staff` (akses keuangan), pertimbangkan **password tambahan di atas kode unik**. Ini meningkatkan keamanan tanpa mengubah pola login dasar. Menunggu keputusan pemilik.

### 4.2 Otorisasi (RBAC)

- **Role** disimpan di kolom `role` pada `users` (enum 6 nilai).
- **Permission** lebih granular dari role → **[TBD-TRD-04]** model permission:
  - Opsi A: murni role-based (sederhana, cukup untuk awal).
  - Opsi B: tabel `permissions` + `role_permissions` (fail-closed, kunci-katalog).
- **Aturan fail-closed (dari pengalaman sebelumnya):** permission key harus terdaftar di katalog sebelum dipakai; tanpa izin → 403. Ini mencegah 403 massal akibat key hilang.
- Middleware `auth` dan `guest` sudah ada; tambah middleware `role`/`can` untuk modul.

---

## 5. Data & Persistensi

| Aspek   | Keputusan                                                  |
| ------- | ---------------------------------------------------------- |
| ORM     | Lucid                                                      |
| Dev DB  | SQLite (`tmp/db.sqlite3`) — **hanya untuk pengembangan**   |
| Prod DB | **[TBD-TRD-05]** PostgreSQL (rekomendasi)                  |
| Migrasi | `node ace migration:run`; schema auto-generate             |
| Seed    | Perlu seeder untuk master data (tahun ajaran, role, mapel) |
| Backup  | **[TBD-TRD-06]** strategi (dump berkala, retensi)          |

**Aturan transaksi & uang (dari pengalaman proyek sejenis):**

- Operasi uang (pembayaran, tagihan) **wajib ter-transaksi atomik**.
- Multi-langkah uang lintas-entitas → pola saga dengan kompensasi + idempotency key, karena transaksi Lucid tidak bisa join transaksi pemanggil lintas pool.
- Webhook pembayaran (Midtrans): verifikasi signature **SHA-512 dari body mentah**; nilai dibaca dari **DB order**, bukan payload.

---

## 6. Frontend

| Aspek            | Keputusan                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Bridge           | Inertia (`inertia.render(...)`) + adapter React                                                 |
| Routing typesafe | Tuyau (`urlFor(route)`) — sudah dipakai di `nav_link.tsx`                                       |
| SSR              | **Nonaktif** saat ini (`config/inertia.ts`), `inertia/ssr.tsx` sudah disiapkan                  |
| Styling          | CSS murni (`inertia/css/app.css`, 884 baris) + tema `data-theme`                                |
| Tema             | Toggle manual via cookie `app_theme` (1 tahun); **[TBD-TRD-07]** tambah `prefers-color-scheme`? |
| Toast            | Sonner (sudah ada `flash_toasts.tsx`)                                                           |
| Layout           | `marketing`, `auth`, `app` (sudah ada)                                                          |

**Keputusan SSR:** tetap **CSR** untuk fase awal (sederhana, dev server ringan). Bila SEO portal publik jadi prioritas (M5), SSR diaktifkan — ingat gotcha: `ssr.enabled: true` saja tidak cukup, wajib `serverEntryPoints` di `vite.config.ts` dan chunk SSR harus ter-emit.

---

## 7. API & Kontrak Respons

- **Primer:** Inertia (props ke halaman) — tidak ada REST API terpisah untuk UI.
- **Bila perlu API** (webhook, integrasi):
  - Serializer membungkus `{ data }` (`providers/api_provider.ts`).
  - **[TBD-TRD-08]** apakah kontrak penuh `{ code, status, message, data }` (seperti pola proyek sebelumnya) atau cukup `{ data }`?
- **Webhook masuk** (Midtrans, WhatsApp callback): dikecualikan dari CSRF, diamankan via signature/secret.

---

## 8. Keamanan

| Kontrol               | Status                                    | Catatan                                  |
| --------------------- | ----------------------------------------- | ---------------------------------------- |
| CSRF                  | Aktif (`config/shield.ts`)                | Kecualikan webhook                       |
| CSP                   | **Nonaktif**                              | **[TBD-TRD-09]** aktifkan untuk produksi |
| X-Frame-Options       | DENY                                      | Jika perlu embedding → ubah              |
| HSTS                  | Aktif (180 hari)                          | Butuh HTTPS di produksi                  |
| Content-type sniffing | nosniff                                   | OK                                       |
| Hashing               | scrypt (cost 16384)                       | Cukup untuk kode unik                    |
| CORS                  | Dev: semua origin; Prod: allowlist kosong | Isi allowlist di produksi                |
| Secret                | `APP_KEY` di `.env` (tidak ter-commit)    | Jangan tulis ke log/source               |

**Risiko keamanan yang wajib ditangani:**

- Kode unik mudah ditebak → rate limit + lockout + panjang kode memadai.
- Upload berkas (PPDB, materi) → whitelist tipe, batas ukuran, sajikan dengan CSP sandbox (SVG stored-XSS vektor nyata).
- Data pribadi siswa (UU PDP) → enkripsi at-rest bila memungkinkan, akses minimum, audit log.

---

## 9. Non-Functional Realization

| NFR                       | Cara mewujudkan                                                             |
| ------------------------- | --------------------------------------------------------------------------- |
| NFR-001 Deployment ringan | Docker/compose atau `node ace serve --hmr`; build lalu `node bin/server.js` |
| NFR-002 DB produksi       | PostgreSQL + migrasi                                                        |
| NFR-003 Backup            | Dump DB terjadwal + retensi; **wajib sebelum data nyata**                   |
| NFR-006 Zona waktu        | `TZ=Asia/Jakarta` (saat ini `TZ=UTC` → **[TBD-TRD-10]** ubah)               |
| NFR-007 Bahasa            | UI Bahasa Indonesia (starter masih Inggris → harus dilokalisasi)            |
| NFR-008 Performa          | Indeks DB pada kolom pencarian (NIS, kode unik, periode)                    |
| NFR-010 Audit             | Tabel `audit_logs` untuk nilai & pembayaran                                 |

---

## 10. Testing Strategy

| Suite      | Cakupan                                         | Wajib sebelum merge     |
| ---------- | ----------------------------------------------- | ----------------------- |
| Unit       | Fungsi murni, service (perhitungan nilai, uang) | Ya                      |
| Functional | Route + controller + validasi + RBAC            | Ya                      |
| Browser    | Alur kritis (login, input nilai, pembayaran)    | Ya untuk alur uang/auth |

**Aturan (dari pengalaman proyek sebelumnya):**

- **Test tidak boleh flaky.** Flaky = gagal.
- Uang/auth **wajib** mutation test (minimal 3 cacat disuntik, semua tertangkap) bila runner tersedia.
- Browser test **wajib `waitForSelector`** sebelum baca DOM (SSR mati → render CSR asinkron).
- `npm run build` **wajib** dijalankan bersamaan dengan browser test (build basi = body kosong).
- Test berbagi state dunia harus diisolasi (satu server per test bila menyentuh state).

---

## 11. Gate Kualitas (dijalankan dari `package.json`)

```bash
npm run typecheck   # tsc --noEmit (server) + tsc --noEmit (inertia)
npm run lint        # eslint .
npm test            # japa (node ace test)
npm run build       # node ace build
```

Semua harus hijau sebelum pekerjaan dianggap selesai. **Jangan pernah** jalankan `tsc` tanpa `--noEmit`.

---

## 12. Deployment & Operasi

- **Dev:** `npm run dev` (HMR).
- **Prod:** `npm run build` → `npm start` (`node bin/server.js`).
- **[TBD-TRD-11]** Container/CI mana? (Docker compose pernah dipakai; GitHub Actions belum ada)
- **Monitoring:** log ke file (`config/logger.ts`); **[TBD-TRD-12]** log aggregation?

---

## 13. Daftar [TBD] Teknis

| ID         | Pertanyaan                                         |
| ---------- | -------------------------------------------------- |
| TBD-TRD-01 | Pasang driver `pg` + aktifkan konfigurasi Postgres |
| TBD-TRD-02 | Kebijakan lockout (N gagal / M menit)              |
| TBD-TRD-03 | Faktor kedua untuk role sensitif?                  |
| TBD-TRD-04 | Model permission: role-only vs tabel permission    |
| TBD-TRD-05 | Konfirmasi PostgreSQL produksi                     |
| TBD-TRD-06 | Strategi backup & retensi                          |
| TBD-TRD-07 | Auto-detect tema gelap sistem                      |
| TBD-TRD-08 | Kontrak respons API penuh                          |
| TBD-TRD-09 | Aktifkan CSP                                       |
| TBD-TRD-10 | Set `TZ=Asia/Jakarta`                              |
| TBD-TRD-11 | Container & CI/CD                                  |
| TBD-TRD-12 | Log aggregation / monitoring                       |
