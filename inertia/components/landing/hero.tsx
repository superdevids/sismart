import { ArrowRight } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { LANDING } from '~/content/landing'
import { GAMBAR } from '~/content/gambar'
import Photo from './photo'
import { Container, displayTitleClass, focusRing } from './ui'

/**
 * Hero beranda: identitas portal + sekolah, tagline, dua ajakan utama,
 * cuplikan gambar, dan ringkasan statistik sekolah.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 md:pt-40 md:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-10 right-[-6rem] h-72 w-72 rounded-full bg-brand-yellow opacity-20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-8rem] h-80 w-80 rounded-full bg-brand-blue opacity-10 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--line-2)] bg-[var(--card)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
              {LANDING.hero.eyebrow}
            </p>

            <h1
              className={`mt-5 font-semibold leading-[1.05] tracking-[-0.03em] ${displayTitleClass}`}
            >
              {LANDING.hero.title}
            </h1>
            <p className="mt-3 text-[16px] font-medium text-[var(--ink-2)] sm:text-[18px]">
              {LANDING.school.name}
            </p>
            <p className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-[var(--muted)] text-pretty">
              {LANDING.hero.tagline}
            </p>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-[var(--muted)] text-pretty">
              {LANDING.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={LANDING.hero.primaryCta.href}
                className={`btn bg-brand-blue text-white hover:opacity-90 ${focusRing}`}
              >
                {LANDING.hero.primaryCta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                route="session.create"
                className={`btn btn--secondary ${focusRing}`}
                title={LANDING.actions.loginNote}
              >
                {LANDING.hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Photo
              image={GAMBAR.hero}
              width={1200}
              height={800}
              priority
              className="aspect-[4/3] w-full rounded-[var(--r-lg)] border border-[var(--line-2)]"
            />
            <div className="rounded-[var(--r-lg)] bg-brand-blue p-5 text-white sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/90">
                {LANDING.brand.portalLabel}
              </p>
              <p className="mt-2 text-[18px] font-semibold leading-snug">
                {LANDING.school.shortName}
              </p>
              <p className="mt-1 text-sm text-white/90">{LANDING.school.accreditation}</p>
            </div>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--line)] pt-10 md:mt-14 md:grid-cols-4">
          {LANDING.hero.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[13px] text-[var(--muted)]">{stat.label}</dt>
              <dd className="mt-1 text-[26px] font-semibold tracking-[-0.02em] text-brand-blue sm:text-[30px]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
