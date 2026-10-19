# Akun Pengembangan (DEV ONLY)

Dokumen ini mendaftar akun fixture untuk pengembangan lokal, satu akun per role.
Akun dibuat oleh command `node ace dev:accounts`.

> **DEV ONLY.** Akun ini memakai password lemah dan publik. Jangan pernah
> menyalinnya ke produksi. Command `dev:accounts` menolak berjalan ketika
> `NODE_ENV=production` (exit code 1).

## Cara pakai

```bash
node ace dev:accounts
```

Command bersifat idempotent: menjalankannya lagi akan meng-upsert akun
berdasarkan `kode_unik`, sehingga password dan role dikembalikan ke nilai di
bawah. Role diambil dari tabel `roles` (diseed oleh migrasi), jadi jalankan
migrasi terlebih dahulu bila tabel belum ada.

## Daftar akun

Semua akun memakai password: **`pass1234`**

| Kode unik   | Role             | Nama           |
| ----------- | ---------------- | -------------- |
| `K261001`   | `admin`          | Admin Sismart  |
| `K261002`   | `kepala_sekolah` | Kepala Sekolah |
| `K261003`   | `guru`           | Guru Sismart   |
| `K261004`   | `staff`          | Staff Sismart  |
| `K261005`   | `wali`           | Wali Sismart   |
| `S26101001` | `siswa`          | Siswa TKJ      |
| `S26111002` | `siswa`          | Siswa RPL      |

Catatan:

- Format kode unik mengikuti keputusan desain (docs/02): siswa
  `S` + tahun masuk + kode prodi + gender + sequence; karyawan (dan wali)
  `K` + tahun masuk + gender + sequence.
- Wali belum punya format kode tersendiri, sehingga meminjam pola `K`
  (keputusan dev; WV-7 dapat menyesuaikan).
- Halaman login menampilkan blok "Akun untuk pengembangan" berisi daftar yang
  sama, tetapi **hanya saat mode development** (`inDev`).
