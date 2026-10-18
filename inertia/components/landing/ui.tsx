import { type ReactNode } from 'react'

/**
 * Perkakas tata letak bersama untuk halaman publik: lebar kontainer, ritme
 * jarak antar-section, judul section, dan gaya focus yang konsisten.
 *
 * Pendekatan mobile-first: gaya dasar berlaku untuk layar kecil (stack, teks
 * fluid), lalu ditingkatkan progresif memakai breakpoint Tailwind `sm:`/`md:`/`lg:`.
 */

export const containerClass = 'mx-auto w-full max-w-[1120px] px-5 sm:px-6 lg:px-8'

export const focusRing =
  'rounded-[var(--r)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]'

export const eyebrowClass = 'font-mono text-[11px] uppercase tracking-[0.14em] text-brand-blue'

/**
 * Judul utama yang fluid: ukurannya mengikuti lebar viewport lewat `clamp()`
 * sehingga teks tetap nyaman dari layar kecil sampai besar tanpa lompatan
 * breakpoint.
 */
export const displayTitleClass = 'text-[clamp(2.125rem,6vw,3.5rem)]'

/** Judul section dengan ukuran fluid yang lebih kecil dari judul halaman. */
export const sectionTitleClass = 'text-[clamp(1.5rem,3.2vw,2.125rem)]'

export const cardClass = 'rounded-[var(--r-lg)] border border-[var(--line-2)] bg-[var(--card)]'

export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`${containerClass} ${className}`}>{children}</div>
}

/**
 * Satu section halaman: menetapkan jarak vertikal, latar selang-seling, dan
 * `scroll-mt` agar anchor header tidak menutupi judul saat dilompati.
 */
export function Section({
  id,
  tone = 'default',
  className = '',
  children,
}: {
  id: string
  tone?: 'default' | 'muted'
  className?: string
  children: ReactNode
}) {
  const background = tone === 'muted' ? 'bg-[var(--card)] border-y border-[var(--line)]' : ''

  return (
    <section id={id} className={`scroll-mt-24 py-14 md:py-20 ${background} ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  headingLevel = 2,
}: {
  eyebrow?: string
  title: string
  description?: string
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'

  return (
    <header className="max-w-[720px]">
      {eyebrow && <p className={eyebrowClass}>{eyebrow}</p>}
      <Heading
        className={`mt-3 text-balance font-semibold leading-tight tracking-[-0.02em] ${sectionTitleClass}`}
      >
        {title}
      </Heading>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)] text-pretty">
          {description}
        </p>
      )}
    </header>
  )
}
