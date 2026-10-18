import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'
import { PROFIL } from '~/content/profil'
import { GAMBAR } from '~/content/gambar'
import PageHero from '~/components/landing/page_hero'
import Photo from '~/components/landing/photo'
import { Section, SectionHeader, cardClass } from '~/components/landing/ui'

/**
 * Halaman lengkap PROFIL sekolah: deskripsi, sambutan, visi, misi, dan nilai
 * keunggulan.
 */
export default function ProfilPage() {
  return (
    <>
      <Head title={PROFIL.meta.title}>
        <meta name="description" content={PROFIL.meta.description} />
      </Head>

      <main>
        <PageHero
          eyebrow={PROFIL.eyebrow}
          title={PROFIL.title}
          description={PROFIL.description}
          image={GAMBAR[PROFIL.image]}
        />

        <Section id="profil">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-5 text-[15.5px] leading-relaxed text-[var(--ink-2)] text-pretty">
              {PROFIL.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
              {PROFIL.facts.map((fact) => (
                <div key={fact.label} className={`p-5 ${cardClass}`}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <span className="block text-[26px] font-semibold tracking-[-0.02em] text-brand-blue">
                      {fact.value}
                    </span>
                    <span className="mt-1 block text-[13px] text-[var(--muted)]">{fact.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        <Section id="sambutan" tone="muted">
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <Photo
              image={GAMBAR[PROFIL.sambutan.image]}
              width={800}
              height={600}
              className="aspect-[4/3] w-full rounded-[var(--r-lg)] border border-[var(--line-2)]"
            />
            <div>
              <SectionHeader
                eyebrow={PROFIL.sambutan.eyebrow}
                title={PROFIL.sambutan.title}
                headingLevel={2}
              />
              <blockquote className="mt-6 border-l-2 border-brand-blue pl-5 text-[15.5px] leading-relaxed text-[var(--ink-2)] text-pretty">
                “{PROFIL.sambutan.quote}”
              </blockquote>
              <p className="mt-5 text-sm font-semibold">{PROFIL.sambutan.name}</p>
              <p className="text-sm text-[var(--muted)]">{PROFIL.sambutan.role}</p>
            </div>
          </div>
        </Section>

        <Section id="visi-misi">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className={`p-6 sm:p-8 ${cardClass}`}>
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-blue">
                {PROFIL.vision.title}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)] text-pretty">
                {PROFIL.vision.text}
              </p>
            </article>
            <article className={`p-6 sm:p-8 ${cardClass}`}>
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-blue">
                {PROFIL.mission.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {PROFIL.mission.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-[var(--ink-2)]">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-brand-orange"
                    />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-12">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em]">{PROFIL.values.title}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {PROFIL.values.items.map((value, index) => (
                <article key={value.title} className={`p-6 ${cardClass}`}>
                  <p className="font-mono text-[12px] text-brand-blue">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 text-[15.5px] font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] text-pretty">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Section>
      </main>
    </>
  )
}

ProfilPage.layout = [MarketingLayout]
