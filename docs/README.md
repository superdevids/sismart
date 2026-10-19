# Sismart �?" Sistem Informasi Sekolah Pintar

| [07-spec-data-induk.md](./07-spec-data-induk.md) | SPEC WV-7 (DRAFT): data induk, generator kode unik, import, dashboard |
| [08-petunjuk-pengembang.md](./08-petunjuk-pengembang.md) | Developer handbook: konvensi, git, testing, DoD |
| [09-referensi-runtime.md](./09-referensi-runtime.md) | As-built: routes, model, matrix akses, alur login, test |
| [10-design-system.md](./10-design-system.md) | Palet, token, tipografi, komponen, a11y, gambar |
| [11-modul-detil.md](./11-modul-detil.md) | Spec detail 7 modul bisnis (pra-wave) |
| [12-ops-deploy-keamanan.md](./12-ops-deploy-keamanan.md) | Deploy, backup/restore, keamanan, sizing CBT |
| [13-rencana-perbaikan.md](./13-rencana-perbaikan.md) | Rencana perbaikan konsolidasi 4 audit (H1/H2/H3) |
Dokumen pengembangan produk. Sumber kebenaran tertulis dari seluruh keputusan diskusi (17�?"18 Okt 2026). Diaudit Rocky 18 Okt 2026 (T-008); hasil revisi masuk pada versi ini �?" riwayat temuan: `06-audit-2026-10-18.md`.

## Daftar dokumen

| Dokumen                                                            | Isi                                                  |
| ------------------------------------------------------------------ | ---------------------------------------------------- |
| [01-vision-scope.md](./01-vision-scope.md)                         | Tujuan, pengguna, peran, scope in/out, lisensi       |
| [02-keputusan-desain.md](./02-keputusan-desain.md)                 | Semua keputusan mengikat (D1�?"D12)                    |
| [03-arsitektur-teknis.md](./03-arsitektur-teknis.md)               | Setup bootstrap, stack, infra, auth & RBAC, konvensi |
| [04-roadmap-modul.md](./04-roadmap-modul.md)                       | 7 modul, fase, risiko lintas modul                   |
| [05-spec-fase-0-status.md](./05-spec-fase-0-status.md)             | AC Fase 0 + status verifikasi + snapshot             |
| [06-audit-2026-10-18.md](./06-audit-2026-10-18.md)                 | Hasil audit dokumentasi + rencana perbaikan          |
| [appendix-snapshot-manifests.md](./appendix-snapshot-manifests.md) | Manifest hash snapshot (bukti verifikasi)            |

## Status (18 Okt 2026)

- **Fondasi AUTH & INFRA:** selesai & approved Rocky (SNAP-3); verifikasi Tara (T-006) PAUSED �?" snapshot masih valid.
- **Data induk & dashboard multi-role:** BELUM MULAI, BELUM BERSPEK �?" spec-nya wajib dibuat sebelum wave berikutnya dibuka.
- **7 modul bisnis:** not started; sebagian belum bisa dispesifikasi sampai detail bisnis dari sekolah tersedia (lihat 04).

## Quick start (dev)

Lihat seksi "Bootstrap dari nol" di [03-arsitektur-teknis.md](./03-arsitektur-teknis.md).

## Aturan penting yang berlaku seterusnya

1. **Migration immutable** �?" jangan edit migration yang sudah ter-apply; selalu tambah migration baru. `1792200000001_alter_users_table.ts` **destruktif** (up: drop+recreate users; down: kembalikan tabel email lawas). **Jangan jalankan `migrate:rollback` pada DB yang berisi data.**
2. Kode unik tunduk format `app/services/kode_unik.ts`; aturan binding: sequence **001-999** (sudah di-enforce di regex - fix T-009 APPROVED Rocky; commit menyusul).
3. Self-registration & reset password belum dibangun dan belum diminta �?" dilarang muncul diam-diam.
4. Data SPP & gaji = finansial sensitif: akses per role ketat; **backend backup (pg_dump + uji restore) wajib ada SEBELUM data nyata masuk** �?" desainnya belum diputuskan (lihat 02/D13).
5. Menu sidebar per-role **belum dibangun** (nav saat ini statis) �?" dilarang mengklaim sebaliknya di dokumen/kode.
