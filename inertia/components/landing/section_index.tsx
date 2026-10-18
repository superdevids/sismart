import { Container, focusRing } from './ui'

/**
 * Indeks bagian pada beranda: tautan anchor cepat ke tiap section teaser.
 * Ditempatkan tepat di bawah hero agar pengunjung bisa melompat ke topik.
 */
const LINKS = [
  { label: 'Profil', href: '#profil' },
  { label: 'Jurusan', href: '#jurusan' },
  { label: 'Fasilitas', href: '#fasilitas' },
  { label: 'Ekskul', href: '#ekskul' },
  { label: 'Berita', href: '#berita' },
  { label: 'PPDB', href: '#ppdb' },
  { label: 'Kontak', href: '#kontak' },
]

export default function SectionIndex() {
  return (
    <div className="border-y border-[var(--line)] bg-[var(--card)]">
      <Container className="py-5">
        <nav aria-label="Indeks halaman">
          <ul className="flex flex-wrap gap-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`inline-flex h-9 items-center rounded-full border border-[var(--line-2)] bg-[var(--paper)] px-4 text-[13.5px] font-medium text-[var(--ink-2)] transition-colors hover:border-brand-blue hover:text-brand-blue ${focusRing}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  )
}
