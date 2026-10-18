# 05 — SPEC Fase 0 & Status Verifikasi

`SPEC-W-20261017-001-v1.1` · Workflow `W-20261017-001-sismart` · status 18 Okt 2026.

## Keputusan mengikat

Lihat `02-keputusan-desain.md` (D1–D13).

## AC Fase 0 & status

| ID   | Kriteria                                                      | Status                        | Bukti                                                                                                                           |
| ---- | ------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| AC-1 | compose up pg; `npm run dev` koneksi pg; migration sukses     | **PASS** (Tara, SNAP-3)       | container healthy; migration dari volume kosong; TCP dev-server→pg terbukti; `GET /login` 200                                   |
| AC-2 | login kode unik+password; session & logout; password ter-hash | **PENDING (T-006 PAUSED)**    | Rocky APPROVED; 8 titik wajib Rocky belum diverifikasi Tara — termasuk tambahan dari audit: **bukti rotasi session saat login** |
| AC-3 | role mengontrol akses route                                   | **PENDING (T-006)**           | idem                                                                                                                            |
| AC-4 | CRUD data induk                                               | NOT MULAI — **belum berspek** | spec data induk wajib dibuat sebelum wave                                                                                       |
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
| —    | T-007 docs        | Max   | 6 file docs                       |
| WV-3 | T-008 audit docs  | Rocky | REJECTED → revisi (T-009 mapping) |

Snapshot: SNAP-1 baseline (81 file) · SNAP-2 pasca-T-001 (11 file) · **SNAP-3 pasca-T-004 (berlaku)** — manifest hash lengkap: `appendix-snapshot-manifests.md`. _Catatan audit (M8/B3): manifest manual, repo belum git — inisialisasi git menunggu persetujuan._

## Temuan terbuka

- **MINOR** — migration destruktif (up & down); jangan rollback pada DB berdata. (aturan tertulis)
- **MINOR→TERJADWAL** — regex terima sequence `000` (+ test assert valid) vs D3 001–999 → koreksi kode+test (T-009).
- **MINOR→TERJADWAL** — `TZ=UTC` di `.env.example` vs D12 `Asia/Jakarta` → koreksi (T-009).
- **INFO** — user tanpa role bisa `/dashboard`; ditinjau saat dashboard final.
- **INFO** — belum ada rate-limit/lockout & password policy umum → hardening menyusul.
- **INFO** — pesan akun-nonaktif dapat membedakan eksistensi akun → keputusan sadar, review hardening.
- **NOT_PROVEN** — rotasi session saat login (bukti test belum ada; masuk T-006).
- **BELUM DIPUTUSKAN** — desain backup & audit trail (D13); git init (B3).
- **OUT_OF_SCOPE** — self-registration & reset password (belum diminta).

## Keputusan menunggu user

- **git init + baseline commit** (audit B3).
- Resume T-006 (verifikasi auth) bila dikehendaki.
- Midtrans produksi: menunggu kredensial sekolah + persetujuan terpisah.
