# 09 — Referensi Arsitektur Runtime (as-built)

Dokumen fakta kondisi terbang per **commit `70d2179`**. Perbarui dokumen ini setiap wave yang mengubah struktur.

## Alur request publik & auth

```
Browser ──> Adonis HTTP (start/kernel.ts middleware stack)
  shield (CSRF) → session → auth (silent) → inertia
Routes (start/routes.ts):
  /                        renderInertia home (teaser publik)
  /profil /jurusan /fasilitas /ekskul /ppdb /kontak   renderInertia publik
  /login GET+POST          guest-only (middleware.guest)
  /dashboard               auth + roleActivated
  /admin                   auth + roleActivated + role([admin])
  /aktivasi-budget         auth-only (tanpa gate) — halaman tunggu akun tanpa role
  /logout POST             auth-only
```

## Alur login (app/controllers/session_controller.ts)

1. `loginValidator` (format kode unik regex + trim) — format salah ditolak di sini (public info saja).
2. Cek lockout (`LoginAttempts.isLockedOut`, 5 gagal / 15 menit per kode unik — tabel `login_attempts`, upsert atomik `ON CONFLICT DO UPDATE`).
3. `User.verifyCredentials` (scrypt).
4. Gagal apa pun (kode tak ada / password salah / akun nonaktif / lockout) → **satu konstanta** `INVALID_CREDENTIALS_MESSAGE` + 302 back (anti-enumeration).
5. Sukses → cek role usable: role NULL/asing → redirect `/aktivasi-budget`; role valid → `auth.login()` (session regenerate framework) → `/dashboard`.
6. Sukses login menghapus baris lockout kode tersebut.

## Model & relasi (per `70d2179`)

- `users`: `kode_unik` (unique regex S/K), `full_name`, `password` (scrypt hash), `role_id` → `roles` (nullable, ON DELETE SET NULL), `is_active`.
- `roles` (seed): admin, kepala_sekolah, guru, staff, siswa, wali (sumber: `app/services/roles.ts` — `isKnownRoleName`).
- `login_attempts`: `kode_unik` unique, `failed_count`, `window_started_at` (epoch-ms bigint — normalisasi `Number()` untuk PG/SQLite).
- (WV-7 target — lihat 07): jurusan, tahun_ajaran, siswa, pegawai, rombel, data_wali.

## Matrix akses role (saat ini)

| Route/fitur                                            | admin      | kepala_sekolah | guru  | staff | siswa | wali  | tanpa role |
| ------------------------------------------------------ | ---------- | -------------- | ----- | ----- | ----- | ----- | ---------- |
| `/` publik semua                                       | ✔          | ✔              | ✔     | ✔     | ✔     | ✔     | ✔          |
| `/login`                                               | guest only |                |       |       |       |       |            |
| `/dashboard`                                           | ✔          | ✔              | ✔     | ✔     | ✔     | ✔     | → aktivasi |
| `/admin`                                               | ✔          | ✖ 403          | ✖ 403 | ✖ 403 | ✖ 403 | ✖ 403 | → aktivasi |
| _(WV-7 menambah: menu per modul mengikuti matrix ini)_ |

## Konfigurasi penting

| Config               | Nilai kunci                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `config/database.ts` | `NODE_ENV=test` → sqlite (`tmp/db.sqlite3`); selain itu pg dari env                                                   |
| `config/hash.ts`     | scrypt, cost 16384                                                                                                    |
| `config/shield.ts`   | CSRF aktif semua method mutasi; token invalid → 302 redirect back (bukan 403 body — perilaku bawaan shield, disadari) |
| `config/inertia.ts`  | `ssr.enabled: false` → app CSR penuh; browser test wajib tungguhydrate                                                |
| `config/session.ts`  | driver dari env (test: memory)                                                                                        |
| `inertia/app.tsx`    | `appName = VITE_APP_NAME \|\| 'Sismart'` (fallback AdonisJS = backlog D23-1)                                          |

## Statistik test (per `70d2179`)

- Unit: 5 (kode_unik 3, user_validator 2) — boundary termasuk tolak sequence `000`
- Functional: 19 (auth happy/unhappy, lockout 3 + paralel 2, RBAC, activation, CSRF)
- Browser: 11 (landing 4, login 4, theme 3) — semua memakai waiter CSR (`waitForLandingContent`)
- Total 35 — **prasyarat CI: `npm run build` sebelum suite browser**

## Inventaris sesuatu yang dibuat & siapa pemilik koneksinya

| Artefak                    | File                      | Dipakai oleh                                              |
| -------------------------- | ------------------------- | --------------------------------------------------------- |
| `waitForLandingContent()`  | tests/browser/helpers.ts  | landing + login spec                                      |
| `KODE_UNIK_PATTERN`        | app/services/kode_unik.ts | validator, admin:create, unit test                        |
| `roleActivated` middleware | app/middleware/           | routes dashboard/admin                                    |
| `@theme static` token      | inertia/css/app.css       | semua halaman (utility `brand-*`, `card/ink/paper/muted`) |
