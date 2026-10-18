import { type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { Section, SectionHeader, focusRing } from './ui'

/**
 * Section teaser pada beranda: cuplikan singkat satu topik (2-3 item) plus
 * tautan "Lihat semua" menuju halaman lengkapnya.
 */
export default function TeaserSection({
  id,
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  tone = 'default',
  children,
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  href?: string
  linkLabel?: string
  tone?: 'default' | 'muted'
  children: ReactNode
}) {
  return (
    <Section id={id} tone={tone}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        {href && linkLabel && (
          <Link
            href={href}
            className={`inline-flex w-fit shrink-0 items-center gap-2 text-[14px] font-semibold text-brand-blue transition-opacity hover:opacity-80 ${focusRing}`}
          >
            {linkLabel}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="mt-10 md:mt-12">{children}</div>
    </Section>
  )
}
