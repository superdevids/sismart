import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'
import { EKSKUL } from '~/content/ekskul'
import PageHero from '~/components/landing/page_hero'
import { EkskulCard } from '~/components/landing/cards'
import { Section, SectionHeader } from '~/components/landing/ui'

/**
 * Halaman lengkap EKSTRAKURIKULER: grid bidang kegiatan beserta anggotanya.
 */
export default function EkskulPage() {
  return (
    <>
      <Head title={EKSKUL.meta.title}>
        <meta name="description" content={EKSKUL.meta.description} />
      </Head>

      <main>
        <PageHero eyebrow={EKSKUL.eyebrow} title={EKSKUL.title} description={EKSKUL.description} />

        <Section id="ekskul">
          <SectionHeader title={EKSKUL.listTitle} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EKSKUL.categories.map((category) => (
              <li key={category.name}>
                <EkskulCard category={category} />
              </li>
            ))}
          </ul>
        </Section>
      </main>
    </>
  )
}

EkskulPage.layout = [MarketingLayout]
