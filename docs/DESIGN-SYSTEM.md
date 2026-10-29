# Design System — Sismart

> **Versi:** 1.0 · **Tanggal:** 2026-10-29
> **Sumber kebenaran tunggal:** `inertia/css/app.css` (blok `@theme` + token semantik)
> **Status nilai:** semua di bawah adalah **DEFAULT** dan dapat diubah tanpa menyentuh komponen.

---

## 0. Aturan Gaya: Tailwind dulu, CSS native pengecualian

**Default project ini Tailwind CSS v4.** Gaya halaman dan komponen ditulis sebagai utilitas di JSX.

| Boleh                                | Dilarang                                                              |
| ------------------------------------ | --------------------------------------------------------------------- |
| Utilitas Tailwind di `className`     | `style={{…}}` inline untuk properti yang punya utilitas               |
| Utilitas kustom via `@utility`       | Selektor manual (`body {}`, `:focus-visible {}`, `* {}`) di `app.css` |
| Token via `@theme` / `@theme inline` | Hex literal di komponen (harus lewat token semantik)                  |
| Variant `dark:` untuk tema gelap     | Blok `.dark {}` baru di luar blok token                               |
| `@custom-variant` untuk variant baru | `<style>` di dalam komponen                                           |

**Pengecualian yang diizinkan — harus benar-benar tidak bisa di Tailwind:**

1. `@keyframes` → wajib di CSS (Tailwind tidak punya cara mendefinisikannya; dipakai lewat `--animate-*`).
2. `@utility` untuk pola `background-image` berganda yang tidak bisa disusun utilitas `bg-*`/`gradient-*` (mis. `surface-grid`, `panel-glow`).
3. Blok definisi token (`:root`, `.dark`) — ini data, bukan gaya.
4. Token `--spacing` responsif yang dipilih lewat media query (nilai, bukan selektor elemen).

Setiap penambahan CSS native **wajib** disertai alasan "tidak bisa di Tailwind" di komentar, dan diverifikasi ikut ter-emit di CSS hasil build.

### 0.1 Padanan yang dipakai (jangan bikin CSS untuk ini)

| Kebutuhan                      | Cara Tailwind                                  |
| ------------------------------ | ---------------------------------------------- |
| warna latar/teks/garis         | `bg-*`, `text-*`, `border-*` dari token        |
| warna bayangan bernuansa token | `shadow-*` (nilai `--shadow-sm` memakai token) |
| `font-variant-numeric`         | `tabular-nums`                                 |
| kerapatan angka                | `--spacing` tunggal → semua `p-*`, `gap-*`     |
| perataan teks                  | `text-balance`, `text-pretty`                  |
| skema warna kontrol browser    | `scheme-light` / `scheme-dark`                 |
| animasi masuk                  | `animate-rise`, `animate-fade`                 |
| tema gelap                     | variant `dark:`                                |

---

## 1. Prinsip

1. **Satu sumber.** Warna, font, radius, dan spasi hanya didefinisikan di `inertia/css/app.css`. Komponen membaca token, tidak menulis hex.
2. **Mobile-first.** Semua penulisan dimulai dari layout mobile, lalu ditingkatkan untuk desktop.
3. **Dua layout saja.** `xl` (desktop) dan lebih kecil (mobile). Tidak ada breakpoint lain.
4. **Satu unit spasi.** 6px desktop / 4px mobile — bukan skala 4/8/12/16 yang terpisah-pisah.
5. **Selalu ada light & dark mode.**
6. **Warna soft: dilarang `#FFF` dan `#000`** (dan turunannya). Latar tidak pernah putih penuh / hitam penuh; teks di atas warna tidak memakai putih murni. Tidak terlalu terang, tidak terlalu gelap.

---

## 2. Tipografi

| Token         | Nilai                                     | Catatan                                                                         |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------- |
| `--font-sans` | `'Plus Jakarta Sans'` (+ fallback system) | Wajib dimuat via `<link>` Google Fonts di `resources/views/inertia_layout.edge` |
| `--font-mono` | system monospace                          | Hanya untuk kode/angka teknis                                                   |

Bobot yang dimuat: `200;300;400;500;600;700;800`.

### 2.1 Skala bobot (WAJIB — hanya nilai ini)

| Token                     | Nilai | Nama        | Pakai untuk                                |
| ------------------------- | ----- | ----------- | ------------------------------------------ |
| `--font-weight-thin`      | `200` | extra-light | teks dekoratif besar / display halus       |
| `--font-weight-light`     | `300` | light       | paragraf pengantar, caption panjang        |
| `--font-weight-normal`    | `400` | normal      | **body text** (default)                    |
| `--font-weight-medium`    | `500` | medium      | label form, item navigasi                  |
| `--font-weight-semibold`  | `600` | semibold    | **judul kecil, kicker, sub-judul, tombol** |
| `--font-weight-bold`      | `700` | bold        | judul halaman / section utama              |
| `--font-weight-extrabold` | `800` | extra-bold  | angka KPI besar, hero display              |

**Aturan pemakaian:**

- **Jangan pakai bobot di luar skala** (mis. `560`, `550`, `650`). Font tidak memuatnya dan browser membulatkan diam-diam.
- Pilih bobot **berdasarkan fungsi hierarki**, bukan "biar tebal": body `400` → label `500` → sub-judul/tombol `600` → judul `700` → display `800`.
- Dalam satu blok teks, **maksimal 2 bobot**.
- Ikon di samping teks mengikuti bobot teksnya.

**Mengubah font:** ganti `--font-sans` di `@theme` **dan** URL Google Fonts di edge layout.

---

## 3. Warna

### 3.1 Palet primitif (13 warna, urutan dipertahankan)

| Token                     | Hex       | Peran                                                             |
| ------------------------- | --------- | ----------------------------------------------------------------- |
| `--palette-blue-600`      | `#2C75FC` | Biru acuan (token semantik memakai turunan lebih pekat `#2563EB`) |
| `--palette-blue-500`      | `#4B77C9` | Biru lembut (token `secondary` memakai `#3F68B8`)                 |
| `--palette-blue-400`      | `#566C96` | Biru pucat → `muted-foreground`                                   |
| `--palette-slate-600`     | `#4D5563` | Acuan slate (garis memakai `#D9DEE8`)                             |
| `--palette-slate-900`     | `#2A2D33` | Teks → `foreground`                                               |
| `--palette-lime`          | `#BDFC2B` | Aksen → `accent`                                                  |
| `--palette-red`           | `#FC4A2B` | Acuan bahaya (token memakai `#C7371C`)                            |
| `--palette-yellow`        | `#FCD42B` | Acuan peringatan (token memakai `#9A6206`)                        |
| `--palette-orange`        | `#FC9F2B` | Oranye (cadangan)                                                 |
| `--palette-green`         | `#2BFC2B` | Acuan sukses (token memakai `#15734A`)                            |
| `--palette-cyan`          | `#2BE3FC` | Acuan info (token memakai `#0E6D80`)                              |
| `--palette-yellow-bright` | `#FCE52B` | Kuning terang (cadangan)                                          |
| `--palette-amber`         | `#FCBA2B` | Amber (cadangan)                                                  |

> **Jangan pakai `--palette-*` langsung di komponen.** Gunakan token semantik di §3.2.
>
> **Catatan penting (perubahan 2026-10-29):** sebagian nilai primitif hanya acuan warna — nilai semantik sengaja lebih pekat/gelap karena primitif gagal WCAG AA sebagai warna teks atau latar tombol. Contoh terukur: `#2C75FC` hanya **3,94:1** untuk teks putih di tombol; `#FC4A2B` hanya **3,36:1** sebagai teks. Jangan "membalikkan" token semantik ke nilai primitif tanpa menghitung ulang kontras.

### 3.2 Token semantik

| Token                  | Terang    | Gelap     | Utilitas                       |
| ---------------------- | --------- | --------- | ------------------------------ |
| `--background`         | `#F7F8FA` | `#16191F` | `bg-background`                |
| `--foreground`         | `#2A2D33` | `#E8EAED` | `text-foreground`              |
| `--card`               | `#FDFDFE` | `#1D2128` | `bg-card`                      |
| `--primary`            | `#2563EB` | `#5B93F8` | `bg-primary`                   |
| `--primary-foreground` | `#F7F9FC` | `#10131A` | `text-primary-foreground`      |
| `--primary-soft`       | `#E8EFFD` | `#1E293F` | `bg-primary-soft`              |
| `--primary-ink`        | `#1F55CF` | `#8FB5FB` | `text-primary-ink`             |
| `--secondary`          | `#3F68B8` | `#5A82CD` | `bg-secondary`                 |
| `--muted`              | `#EEF1F5` | `#232830` | `bg-muted`                     |
| `--muted-foreground`   | `#566C96` | `#9AA7BD` | `text-muted-foreground`        |
| `--accent`             | `#BDFC2B` | `#BDFC2B` | `bg-accent`                    |
| `--destructive`        | `#C7371C` | `#F2684D` | `bg-destructive`               |
| `--destructive-soft`   | `#FBE9E5` | `#3A221F` | `bg-destructive-soft`          |
| `--destructive-ink`    | `#B32E14` | `#F59480` | `text-destructive-ink`         |
| `--success`            | `#15734A` | `#4FDD4F` | `bg-success`                   |
| `--success-soft`       | `#E3F4EA` | `#1D3324` | `bg-success-soft`              |
| `--warning`            | `#9A6206` | `#F3CF55` | `bg-warning`                   |
| `--warning-soft`       | `#FDF3DC` | `#3A3320` | `bg-warning-soft`              |
| `--info`               | `#0E6D80` | `#4FE6FC` | `bg-info`                      |
| `--info-soft`          | `#E2F5F9` | `#173038` | `bg-info-soft`                 |
| `--border`             | `#D9DEE8` | `#333A45` | `border-border`                |
| `--border-strong`      | `#C3CAD8` | `#424B59` | dipakai via `--border` turunan |
| `--ring`               | `#2563EB` | `#5B93F8` | `ring-ring`                    |

**Aturan warna soft:** tidak ada `#FFF`/`#000`. Light memakai `#F7F8FA`–`#FDFDFE`; dark `#16191F`–`#232830`.

**Pola pasangan warna (WAJIB):**

- Teks di atas `*-soft` **wajib** memakai `*-ink` untuk `primary` dan `destructive` (varian `-soft` menurunkan kontras ~0,6). Contoh benar: `bg-primary-soft text-primary-ink`.
- `success`, `warning`, `info` boleh langsung di atas latar `-soft`-nya (semua ≥4,5:1 terverifikasi).
- Teks di atas `bg-primary` memakai `text-primary-foreground` (4,90:1 terang, 6,17:1 gelap).

**Bukti kontras (dihitung, bukan asumsi):** 21 pasangan kritis diuji, **0 gagal**, ambang WCAG AA 4,5:1. Nilai terendah = `--warning` di `--warning-soft` (4,61 terang). Bila menambah pasangan warna baru, hitung ulang sebelum dipakai.

---

## 4. Spasi

**Satu unit**: `--spacing` = **6px** di desktop (`>=1280px`), **4px** di mobile.

| Konteks       | Nilai |
| ------------- | ----- |
| Desktop (xl)  | 6px   |
| Mobile (< xl) | 4px   |

**Xl breakpoint:** `1280px`.

**Contoh pemakaian:** `p-4` = 24px desktop / 16px mobile. `gap-2` = 12px / 8px.

> Konsekuensi: jarak berskala otomatis. Jangan menulis px manual; pakai kelipatan unit.

---

## 5. Radius

| Token          | Nilai             |
| -------------- | ----------------- |
| `--radius`     | `0.625rem` (10px) |
| `--radius-sm`  | `radius - 4px`    |
| `--radius-md`  | `radius - 2px`    |
| `--radius-lg`  | `radius`          |
| `--radius-xl`  | `radius + 4px`    |
| `--radius-2xl` | `radius + 8px`    |

---

## 6. Layout

Hanya dua tipe:

| Nama               | Kondisi          | Perilaku                          |
| ------------------ | ---------------- | --------------------------------- |
| **Desktop layout** | `>= 1280px` (xl) | Spasi 6px, grid boleh multi-kolom |
| **Mobile layout**  | `< 1280px`       | Spasi 4px, satu kolom utama       |

**Mobile-first:** tulis gaya mobile dulu, lalu `@media (min-width: 1280px)` atau `xl:`.

---

## 7. Komponen (shadcn/ui)

| Komponen                                | Lokasi                             | Status |
| --------------------------------------- | ---------------------------------- | ------ |
| `Button` (+ varian & `asChild`)         | `inertia/components/ui/button.tsx` | ✅ ada |
| `Badge` (+ varian status)               | `inertia/components/ui/badge.tsx`  | ✅ ada |
| `Card` (+ `CardHeader`, `CardContent`)  | `inertia/components/ui/card.tsx`   | ✅ ada |
| `Input`                                 | `inertia/components/ui/input.tsx`  | ✅ ada |
| `Label`                                 | `inertia/components/ui/label.tsx`  | ✅ ada |
| `Table` (+ header/body/row/cell)        | `inertia/components/ui/table.tsx`  | ✅ ada |
| `cn()` util (`clsx` + `tailwind-merge`) | `inertia/lib/utils.ts`             | ✅ ada |

**Hanya enam komponen di atas yang di-vendor.** Komponen shadcn lain sengaja dihapus pada 2026-10-29 karena tidak dipakai satu pun halaman dan `unused` di repo (komponen tanpa pemakai ikut ter-typecheck & ter-lint sehingga menambah noise tanpa nilai). Kode halaman yang sudah ada tidak boleh menambah komponen baru "untuk nanti"; tambahkan saat benar-benar dipakai.

Menambah komponen shadcn: taruh di `inertia/components/ui/`, gunakan `cn()` dan token semantik, lalu jalankan gate penuh.

### 7.1 Komponen panel (belum ada)

Tidak ada komponen panel bersama saat ini: keenam halaman `inertia/pages/panel/*.tsx` sengaja dikosongkan (commit `7802763`). Saat modul panel dibangun, komponen bersama (hero identitas, metrik/KPI, daftar tugas, info bertona) dibuat di `inertia/components/` lalu dipakai keenam role agar konsisten.

**Aturan status (berlaku saat komponen dibuat):** status **selalu** memakai label teks + ikon, tidak pernah warna saja (aksesibilitas buta warna). Label yang dipakai: `Aktif` / `Menyusul` — hindari kata negatif seperti "belum bisa dipakai" sebagai label utama.

**Aksen per role (rencana):** admin = `primary`, kepsek = `info`, guru = `secondary`, staff = `warning`, siswa = `accent`, orang tua = `success`. Aksen dipakai pada hero panel dan batang grafik, **bukan** dasar warna seluruh halaman.

---

## 8. Tema gelap

Aktif lewat **class `.dark`** atau atribut **`[data-theme='dark']`** pada `<html>` (keduanya didukung, agar kompatibel dengan `ThemeToggle` yang sudah ada).

---

## 9. Cara Mengubah (untuk admin/developer nanti)

| Ingin mengubah     | Ubah di                                                         |
| ------------------ | --------------------------------------------------------------- |
| Warna brand        | `--primary`, `--primary-soft`, `--primary-ink` (tiga sekaligus) |
| Font               | `--font-sans` + `<link>` Google Fonts                           |
| Bobot dipakai      | Skala resmi §2.1: `200/300/400/500/600/700/800`                 |
| Kerapatan spasi    | `--spacing` (desktop & mobile)                                  |
| Sudut komponen     | `--radius`                                                      |
| Warna tema gelap   | blok `.dark`                                                    |
| Breakpoint desktop | media query `1279.98px` + nilai `1280px` (dua tempat)           |

**Jebakan yang sudah terbukti di proyek ini (jangan diulang):**

1. **Jangan menambah token warna yang namanya bertabrakan dengan utilitas Tailwind lain.** `--color-border-strong` dan `--color-edge` **tidak ter-emit** menjadi kelas; Tailwind membuangnya diam-diam dan CSS tetap sukses dibangun. Ganti warna garis lewat `border-muted-foreground/40` atau utility kustom.
2. **Selalu verifikasi hasil build**, jangan percaya build hijau. Cek langsung di `public/assets/*.css`:
   ```powershell
   $t = Get-Content (Get-ChildItem public/assets/*.css)[0] -Raw
   $t -match '\.bg-primary-soft\{'
   ```
3. **Mengubah `--primary` wajib mengubah `--primary-ink` juga**, karena `--primary-ink` dipakai sebagai teks di atas `--primary-soft`.

**Catatan:** branding nama sekolah (bukan visual) dikelola admin lewat tabel `settings` (`BrandingService`), bukan di file ini.

---

## 10. Bukti Implementasi

Diperbarui 2026-10-29 setelah penyeragaman panel enam role:

- **Kontras:** 21 pasangan warna kritis (terang + gelap) dihitung, **0 gagal** ambang WCAG AA 4,5:1.
- **Typecheck** `0` · **Lint** `0` · **Build** sukses · **Test** 39 lulus / 0 gagal.
- **Utilitas baru ter-emit** (dicek di CSS hasil build): `bg-primary-soft`, `text-primary-ink`, `text-destructive-ink`, `bg-success-soft`, `bg-warning-soft`, `bg-info-soft`, `panel-glow`.
- **Bug diperbaiki:** `migration:rollback` sebelumnya gagal `email set not null ... contains null values`; kini rollback + migrate ulang terbukti bersih.
