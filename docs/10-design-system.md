# 10 — Design System Sismart

Sumber kebenaran visual. Perubahan tampilan wajib mengikuti dokumen ini; yang ada di sini adalah penerjemahan fakta `inertia/css/app.css` + keputusan D18–D21.

## 1. Palet

### Brand (keputusan D18 — base, nanti bisa ditiadakan/di-custom admin)

| Token          | Hex       | Pemakaian                                                            |
| -------------- | --------- | -------------------------------------------------------------------- |
| `brand-blue`   | `#1C46FC` | aksen interaktif utama: link aktif, badge eyebrow, highlight         |
| `brand-orange` | `#FCA91C` | aksen sekunder: badge, ikon penyerruhan                              |
| `brand-yellow` | `#FCDF1C` | highlight / penanda (jangan dipakai untuk teks di atas latar terang) |
| `brand-slate`  | `#555C7D` | permukaan sekunder / blok warna tenang                               |
| `brand-olive`  | `#7D7753` | permukaan sekunder alternatif                                        |

### Netral / semantik

| Token               | Light               | Dark                | Pemakaian                                     |
| ------------------- | ------------------- | ------------------- | --------------------------------------------- |
| `--paper`           | `#f5f5f6`           | `#0b0c10`           | layer background halaman                      |
| `--card`            | `#ffffff`           | `#12141a`           | kartu/panel                                   |
| `--card-2`          | —                   | `#181b22`           | dark: permukaan "raised" (elevasi layer)      |
| `--ink`             | `#0a0a0b`           | `#e8eaf0`           | teks utama (dark: TIDAK putih murni)          |
| `--ink-2`           | `#2a2c30`           | `#c2c8d4`           | teks sekunder                                 |
| `--muted`           | `#6b6f76`           | `#99a1b3`           | teks redup (kontras AA utk body)              |
| `--subtle`          | `#7a7f88`           | `#6b7383`           | teks dekoratif kecil (min 3:1)                |
| `--line`/`--line-2` | `#ededee`/`#dddfe2` | `#222634`/`#2e3444` | border lembut                                 |
| `--accent`          | = brand-blue        | tint `#7d97ff`      | **pakai ini untuk teks aksen** (adaptif dark) |
| error               | `#c0392b`           | `#e0685c`           | pesan saldo                                   |
| `--ok`              | `#18794e`           | `#3ecf8e`           | sukses                                        |

**Aturan dark mode (D16+):** ladder elevasi `paper < card < card-2`; border biru-abu lembut; shadow = glow lembut (`--shadow-1/2/3`); teks utama `#e8eaf0`; jangan pakai hex hitam/putih murni. Transisi tema `.25s` hanya di `html/body`.

## 2. Tipografi

- **Utama:** Plus Jakarta Sans Variable (self-host via `@fontsource-variable/plus-jakarta-sans`, unicode-range per subset) — fallback system stack.
- **Mono:** ui-monospace stack (kode unik, label/tag `.tag`).
- **Serif:** ui-serif/Georgia — hanya untuk judul editorial (`.auth__title`, `.empty h1`).
- Base 15px / 1.55; input ≥16px di mobile (anti iOS zoom); heading hierarchy h1→h2→h3 tanpa loncatan.

## 3. Komponen primitives (`@layer components`)

`.btn` (+`--primary/--secondary/--ghost/--block/--sm`), `.field` (+`__label/__input/__hint/__error`), `.iconbtn` (hit-area 40px), `.header--bar/--floating`, `.subnav`, `.page`, `.panel`, `.section`, `.sidebar-layout`, `.empty`, `.kbd`, `.tag`, `.il` (inline link), `.mono`, `.stack/.pile` (khusus boilerplate home lama — deprecated saat landing final).

**Pemakaian akse:** warna aksen via utility token (`bg-brand-blue`, `text-accent`) — dilarang hex baru di halaman. Teks kecil aksen di dark wajib `text-accent` (bukan `text-brand-blue` — kontras 2.92:1 terukur, backlog D23-2).

## 4. Aksesibilitas (kewajiban, bukan opsional)

- Focus-visible ring 3px (`--ring`) di semua interaktif; jangan `outline: none` tanpa pengganti.
- Icon-only button: `aria-label` wajib.
- Menu mobile: `aria-expanded` + `aria-controls` + Escape + click-outside + focus-return (pola `layouts/app.tsx` — rekan: `site_header.tsx` masih perlu click-outside/focus-return = backlog D23-3).
- Target sentuh ≥40px efektif; `prefers-reduced-motion` dihormati; gambar `alt` deskriptif + `loading="lazy"` + dimensi eksplisit (anti layout-shift); error form terkait input (`aria-invalid` + `aria-describedby` via input-feedback).

## 5. Gambar

- Sumber: Unsplash hotlink placeholder (central di `inertia/content/gambar.ts`), fallback otomatis `picsum.photos` (`onError` sekali); alt wajib; overlay gradient token agar menyatu semua tema.
- Produksi: ganti asset asli sekolah — GA cukup satu file gambar.ts.

## 6. Copywriting

- Bahasa Indonesia baku & ramah; tidak ada bahasa marketing AdonisJS/teknologi di UI publik; placeholder data diberi komentar `// TODO: ganti data asli sekolah` di file(content).
- Pesan error: informatif, tidak menuduh, tidak membocorkan keteradaan akun.
