# 05 â€” SPEC Fase 0 & Status Verifikasi

`SPEC-W-20261017-001-v1.1` Â· Workflow `W-20261017-001-sismart` Â· status 18 Okt 2026.

## Keputusan mengikat

Lihat `02-keputusan-desain.md` (D1â€“D13).

## AC Fase 0 & status

| ID   | Kriteria                                                      | Status                        | Bukti                                                                                                                           |
| ---- | ------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| AC-1 | compose up pg; `npm run dev` koneksi pg; migration sukses     | **PASS** (Tara, SNAP-3)       | container healthy; migration dari volume kosong; TCP dev-serverâ†’pg terbukti; `GET /login` 200                                   |
| AC-2 | login kode unik+password; session & logout; password ter-hash | **PENDING (T-006 PAUSED)**    | Rocky APPROVED; 8 titik wajib Rocky belum diverifikasi Tara â€” termasuk tambahan dari audit: **bukti rotasi session saat login** |
| AC-3 | role mengontrol akses route                                   | **PENDING (T-006)**           | idem                                                                                                                            |
| AC-4 | CRUD data induk                                               | NOT MULAI â€” **belum berspek** | spec data induk wajib dibuat sebelum wave                                                                                       |
| AC-5 | dashboard multi-role responsif                                | NOT MULAI                     | menu per-role belum dibangun (nav statis)                                                                                       |
| AC-6 | lint/typecheck/test lulus; tanpa secret                       | **PASS** (infra)              | exit 0; scan bersih; suite 15 test                                                                                              |

## Riwayat wave & snapshot

| Wave | Task              | Agent | Hasil                             |
| ---- | ----------------- | ----- | --------------------------------- |
| WV-1 | T-001 infra       | Cody  | READY_FOR_REVIEW                  |
| WV-1 | T-002 review      | Rocky | APPROVED                          |
| WV-1 | T-003 test        | Tara  | PASSED                            |
| WV-2 | T-004 auth+roles  | Cody  | READY_FOR_REVIEW                  |
| WV-2 | T-005 review auth | Rocky | APPROVED (1 MINOR, 4 INFO)        |
| WV-2 | T-006 test auth   | Tara  | PAUSED (SAP-3 valid)              |
| â€”    | T-007 docs        | Max   | 6 file docs                       |
| WV-3 | T-008 audit docs  | Rocky | REJECTED â†’ revisi (T-009 mapping) |
| WV-4 | T-011 branding foundation | Cody | APPROVED (T-018b) |
| WV-4 | T-012 landing percobaan-1 | Cody | INVALID_REPORT - ulang sebagai multi-page (T-015) |
| WV-4 | T-013 i18n + hardening D14-D16 | Cody | APPROVED (T-018a; 1 MINOR race -> T-019) |
| WV-4 | T-014 test browser PREP | Tara | READY_FOR_EXECUTION (11 test, NOT_PROVEN) |
| WV-5 | T-015 situs publik multi-page + Unsplash | Cody | APPROVED (T-018b) |
| WV-5 | T-016 dark mode smoother + mobile-first CSS | Cody | APPROVED (T-018b) |
| WV-5 | T-017 app shell mobile nav | Cody | APPROVED (T-018b) |
| WV-6 | T-018a/b review wave gabungan | Rocky | APPROVED keduanya (MINOR: race, title, kontras brand-blue, menu publik a11y, tap target) |
| WV-6 | T-019 fix race lockout | Cody | READY_FOR_REVIEW |
| WV-6 | T-020 fix 4 MINOR frontend | Cody | berjalan (background) |
| WV-6 | T-021 review fix race | Rocky | BLOCKED (provider 2x) - retry menyusul |

Snapshot: SNAP-1 baseline (81 file) Â· SNAP-2 pasca-T-001 (11 file) Â· **SNAP-3 pasca-T-004 (berlaku)** â€” manifest hash lengkap: `appendix-snapshot-manifests.md`. _Catatan audit (M8/B3): manifest manual, repo belum git â€” inisialisasi git menunggu persetujuan._

## Temuan terbuka

- **MINOR** â€” migration destruktif (up & down); jangan rollback pada DB berdata. (aturan tertulis)
- **MINORâ†’TERJADWAL** â€” regex terima sequence `000` (+ test assert valid) vs D3 001â€“999 â†’ koreksi kode+test (T-009).
- **MINORâ†’TERJADWAL** â€” `TZ=UTC` di `.env.example` vs D12 `Asia/Jakarta` â†’ koreksi (T-009).
- **INFO** â€” user tanpa role bisa `/dashboard`; ditinjau saat dashboard final.
- **INFO** â€” belum ada rate-limit/lockout & password policy umum â†’ hardening menyusul.
- **INFO** â€” pesan akun-nonaktif dapat membedakan eksistensi akun â†’ keputusan sadar, review hardening.
- **NOT_PROVEN** â€” rotasi session saat login (bukti test belum ada; masuk T-006).
- **BELUM DIPUTUSKAN** â€” desain backup & audit trail (D13); git init (B3).
- **OUT_OF_SCOPE** â€” self-registration & reset password (belum diminta).

## Keputusan menunggu user

- **git init + baseline commit** (audit B3).
- Resume T-006 (verifikasi auth) bila dikehendaki.
- Midtrans produksi: menunggu kredensial sekolah + persetujuan terpisah.
