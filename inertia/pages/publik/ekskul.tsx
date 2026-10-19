import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'
import { EKSKUL } from '~/content/ekskul'
import { GAMBAR } from '~/content/gambar'
import PageHero from '~/components/landing/page_hero'
import { EkskulCard } from '~/components/landing/cards'
import { Section, SectionHeader } from '~/components/landing/ui'

/**
 * Halaman lengkap EKSTRAKURIKULER: satu kolom, tiap bidang dijelaskan dengan
 * deskripsi, jadwal latihan, pembina, dan kegiatan anggotanya.
 */
export default function EkskulPage() {
  return (
    <>
      <Head title={EKSKUL.meta.title}>
        <meta name="description" content={EKSKUL.meta.description} />
      </Head>

      <main className="page">
        <PageHero
          eyebrow={EKSKUL.eyebrow}
          title={EKSKUL.title}
          description={EKSKUL.description}
          image={GAMBAR.ekskulOlahraga}
        />

        <Section id="ekskul">
          <SectionHeader title={EKSKUL.listTitle} />
          <ul className="mt-10 grid gap-6">
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
