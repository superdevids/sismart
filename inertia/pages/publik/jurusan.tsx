import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'
import { JURUSAN } from '~/content/jurusan'
import PageHero from '~/components/landing/page_hero'
import { MajorCard } from '~/components/landing/cards'
import { Section, SectionHeader } from '~/components/landing/ui'

/**
 * Halaman lengkap JURUSAN: grid kartu tiap program keahlian dengan detail
 * kompetensi dan prospek karier.
 */
export default function JurusanPage() {
  return (
    <>
      <Head title={JURUSAN.meta.title}>
        <meta name="description" content={JURUSAN.meta.description} />
      </Head>

      <main>
        <PageHero
          eyebrow={JURUSAN.eyebrow}
          title={JURUSAN.title}
          description={JURUSAN.description}
        />

        <Section id="jurusan">
          <SectionHeader title={JURUSAN.listTitle} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {JURUSAN.items.map((major) => (
              <li key={major.code}>
                <MajorCard major={major} detailed />
              </li>
            ))}
          </ul>
        </Section>
      </main>
    </>
  )
}

JurusanPage.layout = [MarketingLayout]
