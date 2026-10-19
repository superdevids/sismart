import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'
import { FASILITAS } from '~/content/fasilitas'
import { GAMBAR } from '~/content/gambar'
import PageHero from '~/components/landing/page_hero'
import { FacilityCard } from '~/components/landing/cards'
import { Section, SectionHeader } from '~/components/landing/ui'

/**
 * Halaman lengkap FASILITAS: satu kolom, tiap sarana dijelaskan dengan
 * kapasitas, fasilitas internal, jam pakai, dan kegunaannya (tanpa ikon).
 */
export default function FasilitasPage() {
  return (
    <>
      <Head title={FASILITAS.meta.title}>
        <meta name="description" content={FASILITAS.meta.description} />
      </Head>

      <main className="page">
        <PageHero
          eyebrow={FASILITAS.eyebrow}
          title={FASILITAS.title}
          description={FASILITAS.description}
          image={GAMBAR.fasilitasLab}
        />

        <Section id="fasilitas">
          <SectionHeader title={FASILITAS.listTitle} />
          <ul className="mt-10 grid gap-6">
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
