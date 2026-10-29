# Sismart

Sistem informasi sekolah (single-lembaga) — AdonisJS 7 + Lucid + Inertia + React 19 + PostgreSQL.

## Menjalankan

### 1. Database (PostgreSQL 18 via Docker)

```bash
npm run db:up
```

Menyalakan container `sismart-postgres` di `127.0.0.1:5432` dengan:

| Item          | Nilai                                     |
| ------------- | ----------------------------------------- |
| User          | `sismart`                                 |
| Password      | `sismart123`                              |
| Database dev  | `sismart`                                 |
| Database test | `sismart_test` (dibuat otomatis)          |
| Volume        | `sismart_sismart-pgdata` (data persisten) |

Volume membuat data bertahan saat container dihapus — `docker compose down` tidak menghapus data, `docker compose down -v` menghapusnya.

### 2. Skema & data contoh

```bash
npm run db:setup
```

Menjalankan `migration:run` lalu `db:seed`. Seeder menulis 5 baris branding dan 9 akun contoh.

### 3. Aplikasi

```bash
npm run dev
```

### Akun contoh

Semua akun memakai password **`pass1234`**:

| ID Pengguna | Peran     |
| ----------- | --------- |
| `A00001`    | admin     |
| `K00001`    | kepsek    |
| `G00001`    | guru      |
| `G00002`    | guru      |
| `T00001`    | staff     |
| `S2026001`  | siswa     |
| `S2026002`  | siswa     |
| `S2026003`  | siswa     |
| `O2026001`  | orang tua |

`node ace db:seed` **menimpa** password akun contoh kembali ke `pass1234` setiap kali dijalankan.

## Gate

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Semua harus hijau sebelum pekerjaan dianggap selesai. Test berjalan di database `sismart_test` (dipilih lewat `.env.test`) dan memakai `migrate()` + `truncate()` sekali di awal suite.

## Perintah lain

```bash
npm run db:down     # hentikan container
npm run db:setup    # migration:run + db:seed
node ace migration:fresh   # bangun ulang skema dari nol
```

## Dokumentasi

| Dokumen       | Isi                               |
| ------------- | --------------------------------- |
| `docs/PRD.md` | Kebutuhan produk, persona, modul  |
| `docs/TRD.md` | Arsitektur, stack, auth, keamanan |
| `docs/AFD.md` | Alur pengguna per role            |
| `docs/DBD.md` | Design brief, token, arah visual  |
| `docs/BSD.md` | Skema database lengkap            |
| `docs/IPD.md` | Rencana implementasi 8 fase       |
