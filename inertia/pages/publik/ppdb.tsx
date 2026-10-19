import { Head } from '@inertiajs/react'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import MarketingLayout from '~/layouts/marketing'
import { PPDB } from '~/content/ppdb'
import { GAMBAR } from '~/content/gambar'
import PageHero from '~/components/landing/page_hero'
import { PathwayCard } from '~/components/landing/cards'
import { Section, SectionHeader, cardClass, focusRing } from '~/components/landing/ui'

/**
 * Halaman lengkap PPDB: jalur pendaftaran, alur, jadwal, syarat, dan kontak
 * panitia (WhatsApp, telepon, email).
 */
export default function PpdbPage() {
  const committee = PPDB.committee
  const waHref = `https://wa.me/${committee.whatsapp}`
  const phoneHref = `tel:${committee.phone.replace(/[^\d+]/g, '')}`

  return (
    <>
      <Head title={PPDB.meta.title}>
        <meta name="description" content={PPDB.meta.description} />
      </Head>

      <main className="page">
        <PageHero
          eyebrow={PPDB.eyebrow}
          title={PPDB.title}
          description={PPDB.description}
          image={GAMBAR[PPDB.image]}
        />

        <Section id="ppdb">
          <p className="rounded-[var(--r)] border border-dashed border-[var(--line-2)] px-4 py-3 text-[13px] leading-relaxed text-[var(--muted)] text-pretty">
            {PPDB.note}
          </p>

          <div className="mt-10">
            <SectionHeader title="Jalur Pendaftaran" headingLevel={2} />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PPDB.pathways.map((pathway) => (
                <li key={pathway.name}>
                  <PathwayCard pathway={pathway} />
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="alur" tone="muted">
          <SectionHeader title={PPDB.stepsTitle} headingLevel={2} />
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PPDB.steps.map((step) => (
              <li key={step.label} className={`p-5 ${cardClass}`}>
                <h3 className="text-[15px] font-semibold">{step.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] text-pretty">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="jadwal">
          <SectionHeader title="Jadwal & Syarat" headingLevel={2} />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className={`p-6 sm:p-7 ${cardClass}`}>
              <h3 className="text-[15.5px] font-semibold tracking-[-0.01em]">
                {PPDB.scheduleTitle}
              </h3>
              <dl className="mt-4 flex flex-col">
                {PPDB.schedule.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--line)] py-2.5 last:border-b-0"
                  >
                    <dt className="text-sm text-[var(--muted)]">{entry.label}</dt>
                    <dd className="text-sm font-medium">{entry.value}</dd>
                  </div>
                ))}
              </dl>
            </article>

            <article className={`p-6 sm:p-7 ${cardClass}`}>
              <h3 className="text-[15.5px] font-semibold tracking-[-0.01em]">
                {PPDB.requirementsTitle}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {PPDB.requirements.map((requirement) => (
                  <li
                    key={requirement}
                    className="flex gap-3 text-sm leading-relaxed text-[var(--ink-2)]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-brand-orange"
                    />
                    <span className="text-pretty">{requirement}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Section>

        <Section id="panitia" tone="muted">
          <SectionHeader title={committee.title} description={committee.description} />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <a
              href={waHref}
              className={`flex items-center gap-3 p-5 hover:opacity-90 ${cardClass} ${focusRing}`}
            >
              <MessageCircle size={20} className="text-brand-blue" aria-hidden="true" />
              <span>
                <span className="block text-[12px] uppercase tracking-[0.08em] text-[var(--muted)]">
                  {committee.whatsappLabel}
                </span>
                <span className="block text-sm font-medium">+{committee.whatsapp}</span>
              </span>
            </a>
            <a
              href={phoneHref}
              className={`flex items-center gap-3 p-5 hover:opacity-90 ${cardClass} ${focusRing}`}
            >
              <Phone size={20} className="text-brand-blue" aria-hidden="true" />
              <span>
                <span className="block text-[12px] uppercase tracking-[0.08em] text-[var(--muted)]">
                  Telepon
                </span>
                <span className="block text-sm font-medium">{committee.phone}</span>
              </span>
            </a>
            <a
              href={`mailto:${committee.email}`}
              className={`flex items-center gap-3 p-5 hover:opacity-90 ${cardClass} ${focusRing}`}
            >
              <Mail size={20} className="text-brand-blue" aria-hidden="true" />
              <span>
                <span className="block text-[12px] uppercase tracking-[0.08em] text-[var(--muted)]">
                  Email
                </span>
                <span className="block text-sm font-medium break-all">{committee.email}</span>
              </span>
            </a>
          </div>
          <p className="mt-4 text-[13px] text-[var(--muted)]">{committee.hours}</p>
        </Section>
      </main>
    </>
  )
}

PpdbPage.layout = [MarketingLayout]
