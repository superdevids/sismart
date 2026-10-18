import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'
import { FASILITAS } from '~/content/fasilitas'
import PageHero from '~/components/landing/page_hero'
import { FacilityCard } from '~/components/landing/cards'
import { Section, SectionHeader } from '~/components/landing/ui'

/**
 * Halaman lengkap FASILITAS: grid kartu sarana dengan gambar dan deskripsi.
 */
export default function FasilitasPage() {
  return (
    <>
      <Head title={FASILITAS.meta.title}>
        <meta name="description" content={FASILITAS.meta.description} />
      </Head>

      <main>
        <PageHero
          eyebrow={FASILITAS.eyebrow}
          title={FASILITAS.title}
          description={FASILITAS.description}
        />

        <Section id="fasilitas">
          <SectionHeader title={FASILITAS.listTitle} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FASILITAS.items.map((facility) => (
              <li key={facility.title}>
                <FacilityCard facility={facility} />
              </li>
            ))}
          </ul>
        </Section>
      </main>
    </>
  )
}

FasilitasPage.layout = [MarketingLayout]
