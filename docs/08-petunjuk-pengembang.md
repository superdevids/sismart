# 08 — Petunjuk Pengembang (Developer Handbook)

Panduan kerja harian untuk siapa pun yang menyentuh kode Sismart. Baca berurutan: Setup (03) → dokumen ini → design system (10).

## 1. Konvensi proyek

| Topik             | Konvensi                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bahasa            | TypeScript strict (2 tsconfig: backend + inertia). Jangan pakai `any` tanpa alasan tertulis                                                                                                                        |
| Penamaan backend  | Model PascalCase singular (`User`, `Role`), tabel snake_case plural, kolom snake_case; alias import `#models/*`, `#controllers/*`, `#services/*` (lihat `package.json → imports`)                                  |
| Penamaan frontend | Halaman `inertia/pages/<area>/<nama>.tsx`; komponen `inertia/components/`; data konten publik `inertia/content/*.ts`; layout `inertia/layouts/`                                                                    |
| CSS               | Prioritas: utility Tailwind + token token (`bg-card`, `text-ink`, `brand-*`). Kelas primitives (`.btn`, `.field`) hidup di `@layer components` di `inertia/css/app.css` — jangan tulis rule renggang di luar layer |
| Validasi          | Selalu `request.validateUsing(<validator>)` — validator di `app/validators/`; jangan akses `request.body()` langsung                                                                                               |
| Authorization     | Selalu lewat middleware: `auth()` → `role([...])` → (akun `roleActivated`) — jangan cek role manual di controller                                                                                                  |
| Pesan & copy UI   | Bahasa Indonesia. Pesan kegagalan login BERSAMA di satu konstanta (anti-enumeration — jangan pecah)                                                                                                                |
| Migration         | **Immutable.** Selalu file migrasi baru. Dilarang `migrate:rollback` pada DB berisi data (lihat aturan README no.1)                                                                                                |
| Secret            | Tidak pernah masuk source/log/report. Semua via env (`.env` lokal, `.env.example` placeholder)                                                                                                                     |

## 2. Alur kerja git

- Branch tunggal `main` (komitmen langsung baseline+wave; disetujui user sebelum push — per project agreement 18 Okt).
- Pesan commit: awalan gelombang/task + ringkasan + referensi dokumen (`wv3-wv6: race-fix lockout ...; docs D18-D23`).
- Setiap wave kode produksi: **Cody implement → Rocky review adversarial → Tara verifikasi** — tidak ada jalan pintas tanpa keputusan user eksplisit.
- Snapshot manifest: identitas via commit SHA (menggantikan manifest hash manual; lihat `appendix-snapshot-manifests.md` untuk sejarah pra-git).

## 3. Pengujian (Japa)

| Suite      | Lokasi                       | Kebutuhan                                       | Cara jalan                 |
| ---------- | ---------------------------- | ----------------------------------------------- | -------------------------- |
| unit       | `tests/unit/*.spec.ts`       | tidak ada (pure function)                       | otomatis via `npm test`    |
| functional | `tests/functional/*.spec.ts` | SQLite (otomatis `NODE_ENV=test`)               | `node ace test functional` |
| browser    | `tests/browser/*.spec.ts`    | Chromium Playwright + **`npm run build` fresh** | `node ace test browser`    |

- **Aturan penting browser:** app berjalan CSR (`ssr.enabled: false`) — konten muncul 400–700ms setelah event `load`. **Selalu tunggu render** (`waitForLandingContent()` di `tests/browser/helpers.ts`) sebelum membaca DOM. Tanpa ini test gagal palsu.
- Functional test: pola `migrate()` + `withGlobalTransaction`; seed admin via `admin:create` dari `.env.test` (`K261001`/password test).
- Test baru wajib: deterministik (tanpa sleep), tidak hard-assert copy (selector kontrak: id/name/aria), dan tidak menurunkan count (saat ini 35).

## 4. Sopir harian

```bash
npm run dev          # dev server + HMR (perlu Postgres via docker compose up -d)
npm test             # unit + functional + browser
npm run lint         # eslint
npm run typecheck    # tsc ×2
npm run build        # node ace build — WAJIB sebelum uji produksi/deploy
node ace migration:run
node ace admin:create   # bootstrap admin dari env, idempotent
```

## 5. Gotcha yang sudah terbukti (jangan diulang orang lain)

1. CSS custom unlayered vs `@layer utilities` — kini sudah dilayer; tambahan rule baru WAJIB masuk layer.
2. `withAuthFinder(() => hash.use())` lazy — agar CLI/Ace tidak crash sebelum boot.
3. Lockout login memakai upsert atomik (`ON CONFLICT DO UPDATE`) — jangan ganti ke baca-tulis agar tidak kembali ke race.
4. Tailwind v4: `@theme static` dipakai agar token brand tidak di-tree-shake.
5. `public/assets` bisa stale di dev — build sebelum uji visual produksi.
6. Windows `core.autocrlf` → warning LF/CRLF saat commit: aman, blob tersimpan LF.

## 6. Definisi selesai (DoD) per perubahan kode

lint ✓ typecheck ✓ semua test hijau ✓ build ✓ review Rocky ✓ bukti aktual (bukan klaim) ✓ — tanpa satu pun, wave tidak ditutup.
