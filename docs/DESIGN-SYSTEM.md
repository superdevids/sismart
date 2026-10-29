# Design System — Sismart

> **Versi:** 1.0 · **Tanggal:** 2026-10-29
> **Sumber kebenaran tunggal:** `inertia/css/app.css` (blok `@theme` + token semantik)
> **Status nilai:** semua di bawah adalah **DEFAULT** dan dapat diubah tanpa menyentuh komponen.

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

| Token                     | Hex       | Peran                           |
| ------------------------- | --------- | ------------------------------- |
| `--palette-blue-600`      | `#2C75FC` | Biru utama → `primary`          |
| `--palette-blue-500`      | `#4B77C9` | Biru lembut → `secondary`       |
| `--palette-blue-400`      | `#566C96` | Biru pucat → `muted-foreground` |
| `--palette-slate-600`     | `#4D5563` | Garis → `border`, `input`       |
| `--palette-slate-900`     | `#2A2D33` | Teks → `foreground`             |
| `--palette-lime`          | `#BDFC2B` | Aksen → `accent`                |
| `--palette-red`           | `#FC4A2B` | Bahaya → `destructive`          |
| `--palette-yellow`        | `#FCD42B` | Peringatan → `warning`          |
| `--palette-orange`        | `#FC9F2B` | Oranye (cadangan)               |
| `--palette-green`         | `#2BFC2B` | Sukses → `success`              |
| `--palette-cyan`          | `#2BE3FC` | Info → `info`                   |
| `--palette-yellow-bright` | `#FCE52B` | Kuning terang (cadangan)        |
| `--palette-amber`         | `#FCBA2B` | Amber (cadangan)                |

> **Jangan pakai `--palette-*` langsung di komponen.** Gunakan token semantik di §3.2.

### 3.2 Token semantik

| Token                  | Terang    | Gelap     | Utilitas                  |
| ---------------------- | --------- | --------- | ------------------------- |
| `--background`         | `#F7F8FA` | `#16191F` | `bg-background`           |
| `--foreground`         | `#2A2D33` | `#E8EAED` | `text-foreground`         |
| `--card`               | `#FDFDFE` | `#1D2128` | `bg-card`                 |
| `--primary`            | `#2C75FC` | `#4A86F7` | `bg-primary`              |
| `--primary-foreground` | `#F7F9FC` | `#10131A` | `text-primary-foreground` |
| `--secondary`          | `#4B77C9` | `#5A82CD` | `bg-secondary`            |
| `--muted`              | `#EEF1F5` | `#232830` | `bg-muted`                |
| `--muted-foreground`   | `#566C96` | `#9AA5B8` | `text-muted-foreground`   |
| `--accent`             | `#BDFC2B` | `#BDFC2B` | `bg-accent`               |
| `--destructive`        | `#FC4A2B` | `#E85F43` | `bg-destructive`          |
| `--success`            | `#2BFC2B` | `#4FD96B` | `bg-success`              |
| `--warning`            | `#FCD42B` | `#E8C43C` | `bg-warning`              |
| `--info`               | `#2BE3FC` | `#48C9E0` | `bg-info`                 |
| `--border` / `--input` | `#4D5563` | `#333A45` | `border-border`           |
| `--ring`               | `#2C75FC` | `#4A86F7` | `ring-ring`               |

**Aturan warna soft:** tidak ada `#FFF`/`#000`. Light memakai `#F7F8FA`–`#FDFDFE`; dark `#16191F`–`#232830`. `--primary-foreground` light = `#F7F9FC` (bukan putih murni).

**Contrast note (perlu ditinjau saat dipakai):** `--success` (#2BFC2B / #4FD96B) dan `--warning` (#FCD42B / #E8C43C) sangat terang — teks di atasnya harus `--foreground` (gelap), bukan putih.

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
| `cn()` util (`clsx` + `tailwind-merge`) | `inertia/lib/utils.ts`             | ✅ ada |

Menambah komponen shadcn: taruh di `inertia/components/ui/`, gunakan `cn()` dan token semantik.

---

## 8. Tema gelap

Aktif lewat **class `.dark`** atau atribut **`[data-theme='dark']`** pada `<html>` (keduanya didukung, agar kompatibel dengan `ThemeToggle` yang sudah ada).

---

## 9. Cara Mengubah (untuk admin/developer nanti)

| Ingin mengubah     | Ubah di                                               |
| ------------------ | ----------------------------------------------------- |
| Warna brand        | `--palette-blue-600` (dan turunannya) di `@theme`     |
| Font               | `--font-sans` + `<link>` Google Fonts                 |
| Bobot dipakai      | Skala resmi §2.1: `200/300/400/500/600/700/800`       |
| Kerapatan spasi    | `--spacing` (desktop & mobile)                        |
| Sudut komponen     | `--radius`                                            |
| Warna tema gelap   | blok `.dark`                                          |
| Breakpoint desktop | media query `1279.98px` + nilai `1280px` (dua tempat) |

**Catatan:** branding nama sekolah (bukan visual) dikelola admin lewat tabel `settings` (`BrandingService`), bukan di file ini.

---

## 10. Bukti Implementasi

- `npm run build` → CSS ter-emit, `.bg-primary{background-color:var(--primary)}` ada, hex `#2C75FC` ada.
- `npm run typecheck` / `npm run lint` / `npm test` (12) hijau.
