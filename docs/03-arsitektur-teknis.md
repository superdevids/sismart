# 03 — Arsitektur Teknis

## Bootstrap dari nol (dev)

1. Prasyarat: Node ≥24, Docker (engine jalan).
2. Salin `.env.example` → `.env`; isi `APP_KEY` via `node ace generate:key` (jangan pakai APP_KEY dev untuk produksi; **jangan mengkopi `.env` antar mesin**).
3. Set `DB_*` (default port 5432; di mesin dengan konflik port, override `DB_PORT=5433` — lihat D2). `TZ=Asia/Jakarta` (D12; koreksi `.env.example` dijadwalkan).
4. `docker compose up -d` (tunggu healthy) → `node ace migration:run` → `node ace admin:create` (kredensial dari `ADMIN_*` env).
5. `npm run dev`; verifikasi: `npm run lint`, `npm run typecheck`, `npm test`.

## Stack & struktur

- **Backend:** AdonisJS 7 (TypeScript) — session + shield (CSRF) + Lucid ORM + VineJS; hash scrypt (cost 16384).
- **Frontend:** Inertia React 19 + Vite 8 + Tailwind v4 (plugin `@tailwindcss/vite`; `@import 'tailwindcss'` di `inertia/css/app.css`).
- **Database:** PostgreSQL 17 di Docker (dev/prod); SQLite khusus suite test (`config/database.ts` pilih via `NODE_ENV`).
- **Alias import backend:** lihat `package.json → imports` (`#controllers/*`, `#models/*`, `#services/*`, `#middleware/*`, dst. — tidak ada bare `#`). Frontend: `~/` → `inertia/`, `@generated` → `.adonisjs/client/`.

## Infrastruktur

`docker-compose.yml`: `postgres:17-alpine` (container `sismart-postgres`), volume `postgres_data`, healthcheck `pg_isready`, port `127.0.0.1:${DB_PORT:-5432}:5432`, kredensial dari env. Container milik project lain TIDAK boleh disentuh.

Env: `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_DATABASE`, `APP_KEY`, `ADMIN_KODE_UNIK/ADMIN_PASSWORD/ADMIN_NAME`. `.env` di-gitignore; `.env.example` hanya placeholder.

Perintah harian: `npm run dev` (serve+HMR) · `node ace migration:run` · `npm test` · `npm run lint` · `npm run typecheck` · `npm run build`.

## Auth & identitas

- `users`: `kode_unik` (UNIQUE, menggantikan email), `full_name`, `password` (scrypt), `role_id` FK nullable `ON DELETE SET NULL`, `is_active`.
- `roles` di-seed migration (sumber tunggal `app/services/roles.ts`): admin, kepala_sekolah, guru, staff, siswa, wali.
- Login: `verifyCredentials` → cek `is_active` → `auth.use('web').login()`. Pesan error uniform untuk kode-tak-ada vs password-salah (anti-enumeration). **Catatan audit:** pesan akun-nonaktif berbeda dan secara teknis membedakan akun-ada-tapi-nonaktif — keputusan sadar utk UX, ditinjau saat hardening.
- **Rotasi session saat login: BELUM TERBUKTI dengan test** (koded framework me-regenerate, tapi tidak ada asersi) — verifikasi masuk T-006. Dilarang mengklaim "terverifikasi".
- Route: `/` publik · `login` (guest-only) · `/dashboard` (auth-only) · `/admin` (auth + role admin). **Belum ada menu per-role** — nav sidebar statis (`inertia/layouts/app.tsx`), halaman dashboard masih placeholder sebagian berbahasa Inggris; rupa final ditunda sampai modul ditulis.
- Bootstrap admin: `node ace admin:create` (idempotent, dari env, password min 8).
- CSRF aktif utk semua POST; token invalid → 302 redirect back (perilaku bawaan shield, terverifikasi test).

## RBAC

`app/middleware/role_middleware.ts` — named `role([...])`, selalu setelah `auth()`. `hasRole()` default-deny (role NULL = ditolak di route ber-role).

## Kualitas, migration & version control

- Japa: unit + functional + browser; helper HTTP test menangani XSRF tanpa menonaktifkan CSRF.
- **Migration immutable** (jangan edit yang sudah ter-apply). `1792200000001_alter_users_table.ts` destruktif: `up()` drop+recreate `users`; `down()` merekonstruksi tabel email **lawas** — **jangan `migrate:rollback` pada DB berisi data.**
- **Version control: repo BELUM `git init`** — kebijakan snapshot/hash saat ini bertumpu pada manifest manual (lihat `appendix-snapshot-manifests.md`). Inisialisasi git + baseline commit menunggu persetujuan user (DECISION REQUIRED 18 Okt).
- Gate kualitas per wave: lint + typecheck + test + build; Rocky (review adversarial); Tara (verifikasi berbasis bukti).

## Gotcha developer

- CSS custom existing **unlayered** menang atas `@layer utilities`; kalau utility tidak berpengaruh, itu sebabnya.
- Hash service lazily (`withAuthFinder(() => hash.use())`) agar CLI/Ace tidak crash sebelum boot.
- `database/schema.ts` auto-generated oleh `migration:run` — jangan edit manual.
- `public/assets` bisa stale di dev — `npm run build` sebelum uji produksi/deploy.
