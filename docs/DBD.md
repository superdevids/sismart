# DBD — Design Brief Documentation

> **Produk:** Sismart
> **Versi dokumen:** 1.0
> **Tanggal:** 2026-10-29
> **Status:** Draft untuk review pemilik
> **Terkait:** `PRD.md` (M9 Design), `TRD.md`, `AFD.md`

---

## 0. Catatan Metode & Sumber

Dokumen ini disusun **research-first** dengan bukti dari sumber nyata, bukan tebakan:

1. **Sumber primer:** `inertia/css/app.css` (908 baris) — token, komponen, dan aturan tema yang **benar-benar ada** di starter.
2. **Komponen nyata:** `Page`, `Section`, `NavLink`, `ThemeToggle`, `FlashToasts`, `Logo` di `inertia/components/`.
3. **Layout nyata:** `marketing`, `auth`, `app` di `inertia/layouts/`.

**Keterbatasan yang disadari:** Refero MCP (layer styles/screens/flows) **tidak tersedia** di lingkungan ini, sehingga riset visual eksternal tidak dijalankan. Dokumen ini **tidak** mengklaim arah visual hasil benchmark kompetitor. Bagian "arah desain Sismart" di bawah adalah **rekomendasi** yang harus disetujui pemilik, bukan hasil studi referensi — ini dicatat jujur sesuai aturan anti-mengarang.

---

## 1. Design Brief (Ringkas)

```
Designing Sismart — sistem informasi sekolah untuk operator sekolah (staff/guru)
dan orang tua/siswa, di platform web (desktop-first, responsif mobile).

Tujuan utama pengguna:  menyelesaikan tugas administratif & akademik dengan cepat
                        dan tanpa salah (input nilai, tagihan, absensi).

Tone:                   tenang, rapi, terpercaya, padat-informasi. Bukan playful.
                        Ini alat kerja dengan data sensitif (nilai, uang) —
                        kejelasan mengalahkan dekorasi.

Objection/risiko utama: "Saya takut salah input / takut data bocor / takut sulit dipakai."

Harus diingat:          Kejelasan status (lunas/belum, valid/tidak valid) dan
                        pencegahan salah-input harus terasa di setiap layar.

Constraint:             AdonisJS + Inertia + React; CSS murni dengan token (bukan Tailwind);
                        tema terang/gelap; UU PDP; WCAG AA minimum.

Riset dibutuhkan:       styles (arah visual), screens (pola tabel/form/dashboard),
                        flows (input nilai, pembayaran). [TIDAK DIJALANKAN — lihat §0]

Path:                   Melanjutkan design system starter yang ada, diperluas untuk
                        kebutuhan data-heavy Sismart (tabel, form massal, dashboard).
```

---

## 2. Sistem Desain yang Ada (Terverifikasi)

Design system starter ini **berbasis token CSS variabel** dengan satu prinsip jelas: _"Tokens are the only thing you need to touch to re-theme."_ Ini fondasi bagus yang dipertahankan.

### 2.1 Token Warna

**Terang (`:root`):**

| Token                 | Nilai                 | Peran                    |
| --------------------- | --------------------- | ------------------------ |
| `--paper`             | `#f5f5f6`             | Latar halaman            |
| `--card`              | `#ffffff`             | Permukaan kartu/panel    |
| `--ink`               | `#0a0a0b`             | Teks utama               |
| `--ink-2`             | `#2a2c30`             | Teks sekunder kuat       |
| `--muted`             | `#6b6f76`             | Teks sekunder            |
| `--subtle`            | `#a4a8af`             | Teks tersier/placeholder |
| `--line` / `--line-2` | `#ededee` / `#dddfe2` | Garis pemisah            |
| `--btn` / `--btn-fg`  | `#0a0a0b` / `#ffffff` | Tombol primer            |
| `--ring`              | `rgba(10,10,11,.13)`  | Fokus ring               |
| `--field`             | `#ffffff`             | Input                    |
| `--ok`                | `#18794e`             | Sukses                   |

**Gelap (`:root[data-theme='dark']`):** `--paper #08080a`, `--card #111114`, `--ink #ededee`, `--ok #3ecf8e`, dst.

**Observasi:** palet ini **monokrom netral** dengan satu aksen hijau (`--ok`) dan merah error (`#c0392b`). **Tidak ada warna brand/primary berwarna** — tombol primer hitam/putih. Ini memudahkan Sismart memakai satu warna identitas nanti tanpa merombak token.

### 2.2 Tipografi

| Token     | Nilai                                                                    |
| --------- | ------------------------------------------------------------------------ |
| `--sans`  | System stack: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, ...` |
| `--mono`  | `ui-monospace, SFMono-Regular, Menlo, Consolas, ...`                     |
| `--serif` | `ui-serif, Georgia, Cambria, ...`                                        |

- Body: 15px, line-height 1.55.
- **Serif dipakai untuk display** (`.pc-lead` 34px, `.auth__title` 27px, `.empty h1` 26px) — pilihan editorial yang disengaja.

### 2.3 Spacing & Radius

| Token    | Nilai                       |
| -------- | --------------------------- |
| `--r`    | `8px` (radius kecil)        |
| `--r-lg` | `14px` (radius kartu/panel) |

Spacing memakai nilai px langsung (bukan skala token): 4, 6, 8, 10, 12, 15, 16, 18, 20, 24, 28, 30, ... Konsisten tapi belum tertokenisasi.

### 2.4 Komponen yang Sudah Ada

| Komponen       | Kelas                                                | Catatan                                           |
| -------------- | ---------------------------------------------------- | ------------------------------------------------- |
| Tombol         | `.btn`, `--primary/--secondary/--ghost/--block/--sm` | Tinggi 38px (sm 34px), hit area diperluas ke 40px |
| Field          | `.field`, `.field__input/label/error/hint`           | Tinggi 40px, state invalid, autofill di-handle    |
| Icon button    | `.iconbtn`                                           | 36px visual, hit 40px                             |
| Inline link    | `.il`                                                | Underline halus                                   |
| Panel          | `.panel`                                             | Kartu dengan border                               |
| Page           | `.page`, `.page__header/title/description/actions`   | Kerangka halaman                                  |
| Section        | `.section`, `.section__title/description/body`       | Grup konten                                       |
| Sidebar layout | `.sidebar-layout`, `__nav/item/content`              | Nav 240px + konten                                |
| Empty state    | `.empty`, `.empty__mark`                             | Untuk halaman kosong                              |
| Kbd            | `.kbd`                                               | Tampilan tombol keyboard                          |
| Toast          | `[data-sonner-toaster]`                              | Sonner customized                                 |

**Yang belum ada (dibutuhkan Sismart):**

- **Tabel data** (daftar siswa, nilai, tagihan) — komponen inti yang belum ada.
- **Pill/badge status** (lunas/belum, hadir/alpa, aktif/nonaktif).
- **Pagination, filter bar, search**.
- **Modal/dialog konfirmasi** (untuk aksi destruktif).
- **Stat card / KPI** untuk dashboard kepsek.
- **Step/wizard** (PPDB, impor).
- **Pratinjau tabel impor** (untuk paste Excel / impor CSV).

---

## 3. Arah Desain Sismart (Rekomendasi — perlu persetujuan)

> **Catatan:** karena riset referensi eksternal tidak dijalankan (§0), ini **usulan** berbasis kebutuhan produk + sistem yang ada, bukan hasil benchmark. Pemilik harus menyetujui/mengubah.

### 3.1 Prinsip

1. **Kejelasan mengalahkan dekorasi.** Data angka (nilai, uang, tanggal) harus terbaca sekilas; tabel rapat boleh, tapi jangan padat-menyesakkan.
2. **Status selalu terlihat.** Setiap entitas penting punya indikator visual status (warna + label + ikon, bukan warna saja — untuk aksesibilitas buta warna).
3. **Pencegahan salah-input** lebih penting dari kecepatan: pratinjau wajib sebelum komit massal.
4. **Konsisten dengan sistem yang ada.** Jangan bawa palet baru; perluas token.

### 3.2 Warna & Semantik

Pertahankan palet monokrom. Tambahkan token semantik status (usulan):

| Token usulan | Peran                                               | Nilai usulan                      |
| ------------ | --------------------------------------------------- | --------------------------------- |
| `--brand`    | Warna identitas sekolah (dapat dikonfigurasi admin) | **[TBD-DBD-01]** (mis. `#2563eb`) |
| `--ok` (ada) | Sukses / lunas / hadir                              | `#18794e`                         |
| `--warn`     | Peringatan / tertunda / izin                        | **[TBD-DBD-02]** (mis. `#b45309`) |
| `--danger`   | Error / alpa / tunggakan (red yang ada: `#c0392b`)  | `#c0392b`                         |
| `--info`     | Info / catatan                                      | **[TBD-DBD-03]**                  |

**Aturan:** status **tidak boleh** hanya mengandalkan warna — selalu sertakan label teks atau ikon.

### 3.3 Tipografi untuk Data

- Angka dalam tabel (nilai, nominal uang): gunakan `--mono` dengan `font-variant-numeric: tabular-nums` agar kolom angka sejajar.
- Judul halaman tetap serif? **Rekomendasi: TIDAK untuk halaman dalam aplikasi.** Serif cocok untuk marketing/auth (kesan editorial), tapi untuk tool kerja lebih baik sans yang tegas. **[TBD-DBD-04]**

### 3.4 Komponen Baru Prioritas

| Komponen                               | Dipakai di                     | Prioritas |
| -------------------------------------- | ------------------------------ | --------- |
| `DataTable` (header, sort, pagination) | Sismart-wide                   | Must      |
| `StatusPill`                           | tagihan, absensi, status siswa | Must      |
| `FilterBar`                            | daftar siswa, nilai, keuangan  | Must      |
| `ConfirmDialog`                        | aksi destruktif                | Must      |
| `StatCard`                             | dashboard kepsek/admin         | Should    |
| `ImportPreview`                        | paste Excel, impor CSV         | Must      |
| `Stepper`                              | PPDB                           | Should    |
| `FileUpload` (validasi tipe/ukuran)    | PPDB, materi                   | Should    |
| `Pagination`                           | semua list                     | Must      |

### 3.5 Tata Letak

- **App layout** (sudah ada): header bar 60px + subnav 48px + `.app-main`.
- **Sidebar layout** (sudah ada) untuk area bermenu banyak (SIAKAD, Keuangan).
- **Content max-width** 1080px (`.page`) — untuk tabel lebar, **[TBD-DBD-05]** boleh full-width?
- **Responsif:** breakpoint 880px & 720px (sudah ada). Tabel lebar → perlu mode scroll horizontal atau kartu bertumpuk di mobile. **[TBD-DBD-06]**

### 3.6 Tema

- Terang/gelap sudah berfungsi via `data-theme` + cookie.
- **[TBD-DBD-07]** Deteksi otomatis `prefers-color-scheme` (belum ada).
- Kontras: `--ok` di terang `#18794e` pada `--card` putih → perlu diverifikasi WCAG AA (target ≥4.5:1 untuk teks).

---

## 4. Motion & Mikro-interaksi

Sistem yang ada sudah punya motion yang sopan:

- `.btn:active` → `scale(0.96)`
- `.themetoggle__icon` cross-fade + blur
- `.prose-card` staggered rise (dihormati `prefers-reduced-motion`)
- `.lrow:hover` geser + panah

**Aturan untuk Sismart:**

- **Wajib** hormati `prefers-reduced-motion: reduce`.
- Animasi **tipis** (kecepatan data bukan hiburan): durasi 150–300ms, easing `cubic-bezier(0.2, 0, 0, 1)`.
- Animasi bermakna: transisi status, reveal tabel, feedback simpan. **Bukan** dekorasi norak.
- Animasi **tidak boleh** menunda aksi data.

---

## 5. Aksesibilitas

| Aspek         | Target                                                 |
| ------------- | ------------------------------------------------------ |
| Kontras teks  | WCAG AA (≥4.5:1 teks normal, ≥3:1 teks besar)          |
| Status        | Jangan warna saja — sertakan label/ikon                |
| Fokus         | `:focus-visible` dengan ring (sudah ada polanya)       |
| Form          | `aria-invalid` pada state error (sudah dipakai)        |
| Tabel         | Header benar (`<th scope>`), caption/summary           |
| Target sentuh | ≥ 40px (pola `.btn--sm`/`.iconbtn::after` sudah benar) |
| Zoom          | Layout tetap utuh hingga 200% zoom                     |
| Bahasa        | `lang="id"` pada dokumen                               |

---

## 6. Anti-Pattern (yang Dilarang)

- Mengandalkan **warna saja** untuk status.
- **Modal** untuk hal yang bisa inline (boros klik).
- Animasi **dekoratif berat** (parallax berlebihan, loading dramatis) pada tool kerja.
- **Tabel tanpa kemampuan sortir/filter** pada data besar (>50 baris).
- Menimpa **tanpa konfirmasi** untuk aksi destruktif (hapus siswa, batalkan pembayaran).
- **Tombol tanpa state** (loading/disabled) → memicu double-submit pada aksi uang. **Wajib** estado.

---

## 7. Checklist Implementasi Desain

- [ ] Token warna semantik status ditambahkan (`--warn`, `--danger`, `--info`, `--brand`)
- [ ] Komponen `DataTable`, `StatusPill`, `FilterBar`, `ConfirmDialog`, `ImportPreview` dibuat
- [ ] Angka tabel pakai `tabular-nums`
- [ ] Semua form punya state loading/disabled
- [ ] Semua status punya label + ikon (bukan warna saja)
- [ ] `prefers-reduced-motion` dihormati
- [ ] Uji kontras setiap pasangan warna baru
- [ ] `lang="id"` dipasang
- [ ] Tabel responsif diuji di 720px & 880px
- [ ] Semua halaman di-review dengan `prefers-color-scheme` gelap

---

## 8. Daftar [TBD] Desain

| ID         | Pertanyaan                                                                     |
| ---------- | ------------------------------------------------------------------------------ |
| TBD-DBD-01 | Warna brand/identitas sekolah (tetap atau dapat dikonfigurasi admin?)          |
| TBD-DBD-02 | Nilai token `--warn`                                                           |
| TBD-DBD-03 | Nilai token `--info`                                                           |
| TBD-DBD-04 | Serif untuk heading halaman dalam-app atau sans?                               |
| TBD-DBD-05 | Content max-width untuk tabel lebar                                            |
| TBD-DBD-06 | Pola tabel di mobile (scroll vs kartu)                                         |
| TBD-DBD-07 | Auto-detect tema gelap sistem                                                  |
| TBD-DBD-08 | Jalankan riset Refero (styles/screens/flows) sebelum implementasi visual final |
