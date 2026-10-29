# BSD — Backend Schema Documentation

> **Produk:** Sismart
> **Versi dokumen:** 1.0
> **Tanggal:** 2026-10-29
> **Status:** Draft untuk review pemilik
> **Terkait:** `PRD.md`, `TRD.md`, `IPD.md`

---

## 0. Catatan Sumber & Konvensi

Disusun dari kondisi nyata (`database/migrations/`, `database/schema.ts`, `config/database.ts`) + keputusan pemilik (single-sekolah, auth kode unik, 6 role).

**Konvensi Lucid (mengikuti starter):**

- Nama tabel: **snake_case plural** (`users`, `class_subjects`).
- Primary key: `increments('id')`.
- Timestamp: `created_at` (notNullable), `updated_at` (nullable).
- `database/schema.ts` **di-generate otomatis** — jangan edit manual.
- Semua perubahan skema lewat **migration file**.
- **[TBD-BSD-01]** Gunakan UUID atau auto-increment? Saat ini starter memakai `increments` (integer). Untuk data sensitif sekolah, auto-increment sederhana & cukup; UUID menambah kompleksitas. **Rekomendasi: tetap integer.**

**Status:** semua skema di bawah adalah **RANCANGAN** — akan ditulis sebagai migration pada implementasi. Yang belum diputuskan ditandai `[TBD]`.

---

## 1. Skema Eksisting (Terverifikasi)

### `users` (ada sekarang)

```
users
├── id                    increments      PK
├── full_name             string          nullable
├── email                 string(254)     notNullable, unique
├── password              string          notNullable
├── created_at            timestamp       notNullable
└── updated_at            timestamp       nullable
```

**Dimigrasi** untuk auth kode unik + password (lihat §2.1). `email` tidak lagi jalur utama; `password` dipakai sebagai faktor kedua.

---

## 2. Skema Target

### 2.1 `users` (revisi)

**Perubahan:** tambah `login_code`, `role`, `is_active`, `last_login_at`; `email` jadi opsional (kontak); `password` dipakai sebagai faktor kedua dan wajib untuk akun baru.

```
users
├── id                    increments      PK
├── login_code            string(24)      notNullable, unique   ← kode unik login
├── full_name             string(255)     notNullable
├── role                  enum            notNullable  ('siswa','orang_tua','guru','staff','kepsek','admin')
├── is_active             boolean         notNullable, default true
├── email                 string(254)     nullable, unique      ← opsional, untuk kontak
├── password              string          nullable              ← faktor kedua; di-hash model, wajib untuk akun baru
├── last_login_at         timestamp       nullable
├── created_at            timestamp       notNullable
└── updated_at            timestamp       nullable

INDEX: login_code (unique), role, is_active
```

**Catatan keamanan:** kode unik **bukan lagi satu-satunya faktor** — password diwajibkan untuk semua role (keputusan 2026-10-29). Kode tetap harus cukup panjang/acak agar tidak mudah ditebak. **[TBD-BSD-03]** format kode: prefiks `S`/`K` + angka? (lihat PRD TBD-09).

---

### 2.2 Fondasi (M0)

```
academic_years                          ← tahun ajaran
├── id                    increments      PK
├── name                  string          notNullable  (mis. "2026/2027")
├── start_date            date            notNullable
├── end_date              date            notNullable
├── is_active             boolean         notNullable, default false
├── created_at / updated_at
INDEX: name (unique)

classes                                 ← kelas (mis. "X IPA 1")
├── id                    increments      PK
├── academic_year_id      FK → academic_years  notNullable
├── name                  string          notNullable
├── level                 string          nullable  (mis. "X", "XI", "XII")
├── homeroom_teacher_id   FK → users      nullable  (wali kelas)
├── created_at / updated_at
INDEX: (academic_year_id, name) unique

subjects                                ← mata pelajaran
├── id                    increments      PK
├── code                  string          notNullable, unique  (mis. "MAT")
├── name                  string          notNullable
├── created_at / updated_at
```

### 2.3 SIAKAD (M1)

```
students                                ← data siswa (profil akademik)
├── id                    increments      PK
├── user_id               FK → users      nullable  (bila siswa punya akun)
├── nis                   string          notNullable, unique
├── nisn                  string          nullable, unique
├── full_name             string          notNullable
├── gender                enum            nullable  ('L','P')
├── birth_date            date            nullable
├── birth_place           string          nullable
├── address               text            nullable
├── class_id              FK → classes    nullable
├── status                enum            notNullable  ('aktif','lulus','pindah','keluar')
├── created_at / updated_at
INDEX: nis (unique), nisn (unique), class_id, status

parent_student                          ← relasi orang tua ↔ siswa (many-to-many)
├── id                    increments      PK
├── parent_user_id        FK → users      notNullable
├── student_id            FK → students   notNullable
├── relation              enum            notNullable  ('ayah','ibu','wali')
├── created_at / updated_at
INDEX: (parent_user_id, student_id) unique

attendances                             ← absensi
├── id                    increments      PK
├── student_id            FK → students   notNullable
├── class_id              FK → classes    notNullable
├── subject_id            FK → subjects   nullable
├── date                  date            notNullable
├── status                enum            notNullable  ('hadir','izin','sakit','alpa')
├── note                  string          nullable
├── recorded_by           FK → users      notNullable
├── created_at / updated_at
INDEX: (student_id, date), (class_id, date)

grades                                  ← nilai
├── id                    increments      PK
├── student_id            FK → students   notNullable
├── class_id              FK → classes    notNullable
├── subject_id            FK → subjects   notNullable
├── academic_year_id      FK → academic_years  notNullable
├── type                  enum            notNullable  ('tugas','uts','uas','praktik','akhir')
├── score                 decimal(5,2)    notNullable
├── weight                decimal(4,2)    nullable  (bobot)
├── recorded_by           FK → users      notNullable
├── created_at / updated_at
INDEX: (student_id, subject_id, type), class_id

schedules                               ← jadwal pelajaran
├── id                    increments      PK
├── class_id              FK → classes    notNullable
├── subject_id            FK → subjects   notNullable
├── teacher_id            FK → users      notNullable
├── day_of_week           tinyint         notNullable  (1..7)
├── start_time            time            notNullable
├── end_time              time            notNullable
├── room                  string          nullable
├── created_at / updated_at
```

**[TBD-BSD-04]** Struktur `grades` — apakah satu nilai per komponen penilaian, atau rekap rapor terpisah? Bergantung kurikulum (`TBD-BSD-05`: K13 vs Merdeka).

### 2.4 Keuangan (M2)

```
fees                                    ← definisi tagihan (mis. "SPP Juli")
├── id                    increments      PK
├── name                  string          notNullable
├── academic_year_id      FK → academic_years  notNullable
├── period                string          nullable  (mis. "2026-07")
├── amount                decimal(14,2)   notNullable
├── type                  enum            notNullable  ('spp','lainnya')
├── created_at / updated_at

invoices                                ← tagihan per siswa
├── id                    increments      PK
├── student_id            FK → students   notNullable
├── fee_id                FK → fees       notNullable
├── amount_due            decimal(14,2)   notNullable
├── amount_paid           decimal(14,2)   notNullable, default 0
├── status                enum            notNullable  ('belum','sebagian','lunas','batal')
├── due_date              date            nullable
├── created_at / updated_at
INDEX: student_id, status, (student_id, fee_id) unique

payments                                ← pembayaran
├── id                    increments      PK
├── invoice_id            FK → invoices   notNullable
├── amount                decimal(14,2)   notNullable
├── method                enum            notNullable  ('tunai','online')
├── provider              string          nullable  (mis. "midtrans")
├── provider_ref          string          nullable, unique  ← order id / transaction id
├── idempotency_key       string          nullable, unique  ← cegah dobel
├── status                enum            notNullable  ('pending','berhasil','gagal','kedaluwarsa')
├── paid_at               timestamp       nullable
├── recorded_by           FK → users      nullable  (bila tunai)
├── created_at / updated_at
INDEX: invoice_id, status, provider_ref (unique), idempotency_key (unique)

payment_webhooks                        ← log webhook masuk (audit)
├── id                    increments      PK
├── provider              string          notNullable
├── provider_ref          string          nullable
├── raw_body              text            notNullable
├── signature_valid       boolean         notNullable
├── processed             boolean         notNullable, default false
├── created_at            timestamp       notNullable
INDEX: provider_ref, created_at
```

**Aturan transaksi (kritis):**

- Update `invoices.amount_paid` + insert `payments` **wajib dalam satu transaksi**.
- Idempotency: `payments.idempotency_key` unik mencegah pembayaran dobel dari double-submit/webhook ganda.
- Nilai pembayaran **selalu** dibaca dari `invoices.amount_due` di DB, **bukan** dari payload webhook.
- Verifikasi signature Midtrans dari **raw body**.

### 2.5 Operasional (M3)

```
inventories
├── id, code (unique), name, category, quantity (int), unit (string),
├── condition (enum: 'baik','rusak_ringan','rusak_berat'), location,
├── acquired_at (date, nullable), note, created_at, updated_at

letters
├── id, reference_number (unique), type (enum: 'masuk','keluar'),
├── subject, sender, recipient, letter_date (date),
├── file_path (nullable), created_at, updated_at

agendas
├── id, title, description, start_at (datetime), end_at (datetime, nullable),
├── location, created_at, updated_at
```

### 2.6 Learning / CBT (M4)

```
materials
├── id, class_id (FK), subject_id (FK), teacher_id (FK users),
├── title, description, file_path (nullable), url (nullable),
├── published_at (timestamp, nullable), created_at, updated_at

assignments
├── id, class_id (FK), subject_id (FK), teacher_id (FK users),
├── title, description, due_at (datetime), max_score (decimal), created_at, updated_at

assignment_submissions
├── id, assignment_id (FK), student_id (FK),
├── file_path (nullable), submitted_at, score (decimal, nullable),
├── feedback (text, nullable), created_at, updated_at
INDEX: (assignment_id, student_id) unique

question_banks
├── id, subject_id (FK), teacher_id (FK users), question_type (enum: 'pg','esai'),
├── question (text), options (json, nullable), correct_answer (text, nullable),
├── created_at, updated_at

exams
├── id, title, subject_id (FK), class_id (FK), teacher_id (FK users),
├── start_at, end_at, duration_minutes (int), is_published (bool), created_at, updated_at

exam_attempts
├── id, exam_id (FK), student_id (FK), started_at, finished_at (nullable),
├── score (decimal, nullable), created_at, updated_at
INDEX: (exam_id, student_id)

exam_answers
├── id, attempt_id (FK), question_bank_id (FK), answer (text),
├── is_correct (bool, nullable), score (decimal, nullable), created_at
```

### 2.7 PPDB (M6)

```
registrations
├── id, registration_code (unique), full_name, gender, birth_date, birth_place,
├── address, parent_name, parent_phone, previous_school,
├── status (enum: 'baru','verifikasi','lulus','tidak_lulus','perbaikan'),
├── note (text, nullable), created_at, updated_at
INDEX: registration_code (unique), status

registration_documents
├── id, registration_id (FK), type (enum: 'ijazah','kk','akta','foto','lainnya'),
├── file_path, created_at
```

### 2.8 CMS (M8) & Portal (M5)

```
posts                                   ← berita/halaman
├── id, slug (unique), title, excerpt (text, nullable), content (text),
├── type (enum: 'berita','halaman'), status (enum: 'draft','published'),
├── author_id (FK users), published_at (timestamp, nullable),
├── created_at, updated_at
INDEX: slug (unique), status, type

banners
├── id, title, image_path, link (nullable), position (int), is_active (bool),
├── created_at, updated_at
```

### 2.9 Support (M7)

```
tickets
├── id, ticket_code (unique), user_id (FK), category, subject, description (text),
├── status (enum: 'baru','diproses','selesai','ditutup'),
├── priority (enum: 'rendah','sedang','tinggi'), created_at, updated_at

ticket_replies
├── id, ticket_id (FK), user_id (FK), message (text), created_at
```

### 2.10 Audit & Infra

```
audit_logs                              ← NFR-010
├── id, user_id (FK, nullable), action (string), entity (string), entity_id (int),
├── changes (json, nullable), ip (string, nullable), created_at
INDEX: (entity, entity_id), user_id, created_at

sessions                                ← bila SESSION_DRIVER=database
├── id (string PK), user_id (FK nullable), payload (text),
├── last_activity (int), created_at

rate_limits                             ← bila lockout pakai DB (bila tidak pakai cache)
├── id, key (string, unique), attempts (int), locked_until (timestamp, nullable),
├── created_at, updated_at
```

---

## 3. Ringkasan Relasi Inti

```
users (1)───(N) students          [melalui user_id]
users (1)───(N) parent_student    [sebagai parent_user_id]
students (N)───(1) classes
classes (1)───(N) schedules
classes (1)───(N) grades / attendances
subjects (1)───(N) grades / schedules
students (N)───(N) fees           [melalui invoices]
invoices (1)───(N) payments
assignments (1)───(N) assignment_submissions
exams (1)───(N) exam_attempts (1)───(N) exam_answers
```

---

## 4. Strategi Migrasi (dari starter ke Sismart)

1. **Migration `users` revisi** — tambah kolom; jangan drop `email`/`password` dulu (buat nullable).
   - **Risiko:** bila ada data user nyata. Saat ini `tmp/db.sqlite3` (dev) → kemungkinan kosong/dummy. **[TBD-BSD-06]** konfirmasi.
2. **Seeder** — tahun ajaran, mapel dasar, akun admin pertama.
3. Migration modul per-fase (lihat `IPD.md`).

**Aturan:** setiap migration punya `down()` yang benar (reversibel). Migration destruktif = hard gate.

---

## 5. Indeks & Performa

Indeks wajib (kolom sering di-filter/join):

- `students.nis`, `students.nisn`, `students.class_id`
- `attendances.(student_id, date)`, `attendances.(class_id, date)`
- `grades.(student_id, subject_id, type)`
- `invoices.student_id`, `invoices.status`, `payments.provider_ref`, `payments.idempotency_key`
- `audit_logs.(entity, entity_id)`

Untuk pencarian teks (nama siswa), **[TBD-BSD-07]** tambahkan `pg_trgm` GIN index (pengalaman proyek sebelumnya memakai ini) bila Postgres.

---

## 6. Daftar [TBD] Skema

| ID         | Pertanyaan                                             |
| ---------- | ------------------------------------------------------ |
| TBD-BSD-01 | PK integer vs UUID                                     |
| TBD-BSD-02 | Kolom password untuk faktor kedua?                     |
| TBD-BSD-03 | Format final kode unik                                 |
| TBD-BSD-04 | Struktur tabel nilai (per komponen vs rekap)           |
| TBD-BSD-05 | Kurikulum acuan (K13 / Merdeka)                        |
| TBD-BSD-06 | Apakah ada data user nyata di DB saat ini?             |
| TBD-BSD-07 | Indeks pencarian teks (pg_trgm)                        |
| TBD-BSD-08 | Kolom `options`/`changes` JSON — dukungan MySQL/SQLite |
