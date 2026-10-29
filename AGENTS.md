# AGENTS.md — Sismart

Panduan untuk agent AI yang bekerja di repositori ini.

## Aturan wajib

1. **Selalu push ke GitHub.** Setiap perubahan — kecil maupun besar — **wajib** di-commit dan di-push ke `https://github.com/superdevids/sismart` (branch `main`). Jangan tinggalkan perubahan hanya di working tree.
   - Repo bersifat **PUBLIC** (sengaja).
   - Jangan pernah commit `.env`, `node_modules/`, `tmp/*`, `build/`, atau `public/assets/`.
   - Jangan pernah menulis secret ke source, test, log, atau commit.

2. **Jangan edit `database/schema.ts` manual** — file itu di-generate ulang oleh `node ace migration:run`.

3. **Jangan pernah jalankan `tsc` tanpa `--noEmit`.**

4. **Gate sebelum selesai** (semua harus hijau):

   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```

5. **Test flaky = gagal.** Jangan retry sampai hijau.

6. **Uang & auth wajib mutation test** (≥3 cacat disuntik, semua tertangkap) bila runner tersedia.

## Konteks produk

Sismart adalah sistem informasi sekolah (single-lembaga). Dokumentasi lengkap ada di `docs/`:

| Dokumen       | Isi                                                        |
| ------------- | ---------------------------------------------------------- |
| `docs/PRD.md` | Product Requirements — persona, modul, FR/NFR              |
| `docs/TRD.md` | Technical Requirements — arsitektur, stack, auth, keamanan |
| `docs/AFD.md` | App Flow — alur pengguna per role                          |
| `docs/DBD.md` | Design Brief — token, komponen, arah visual                |
| `docs/BSD.md` | Backend Schema — skema DB lengkap                          |
| `docs/IPD.md` | Implementation Plan — 8 fase, task bernomor                |

Keputusan kunci: single-tenant, 6 role (siswa/orang_tua/guru/staff/kepsek/admin), auth kode unik, 10 modul roadmap.

## Konvensi kerja

- **Kerjakan task satu per satu sesuai instruksi pemilik.** Jangan melompat ke task lain atau mengambil inisiatif di luar yang diminta. Tunggu instruksi task berikutnya.
- **File sementara wajib di `tmp/`** di dalam project ini (bukan root, bukan `%TEMP%`), dan **hapus setelah selesai dipakai**. `tmp/` sudah di-gitignore (kecuali `.gitkeep`).
- **Jangan test UI/UX dan jangan ambil screenshot.** Tampilan dinilai manual oleh pemilik. Test otomatis hanya untuk logic (mis. logic-login: validasi, verifikasi kode, sesi, redirect), bukan tampilan.
  - Larangan tegas: **tidak ada screenshot** dengan tool apa pun (Playwright, argent, browser MCP, dll). Jangan memuat skill pengujian UI/screenshot untuk tujuan ini.
  - Jangan menulis test yang memeriksa markup, kelas CSS, warna, layout, atau tampilan render.
- Perubahan minimal, tanpa scope creep.
- Logika domain berat di `app/services/`, controller tipis.
- Validasi input via VineJS.
- Bahasa UI: Indonesia.
