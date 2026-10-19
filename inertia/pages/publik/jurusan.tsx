import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'
import { JURUSAN } from '~/content/jurusan'
import { GAMBAR } from '~/content/gambar'
import PageHero from '~/components/landing/page_hero'
import { MajorCard } from '~/components/landing/cards'
import { Section, SectionHeader } from '~/components/landing/ui'

/**
 * Halaman lengkap JURUSAN: satu kolom, tiap program keahlian dijabarkan dengan
 * materi, keunggulan, prospek kerja, dan kampus lanjutan.
 */
export default function JurusanPage() {
  return (
    <>
      <Head title={JURUSAN.meta.title}>
        <meta name="description" content={JURUSAN.meta.description} />
      </Head>

      <main className="page">
        <PageHero
          eyebrow={JURUSAN.eyebrow}
          title={JURUSAN.title}
          description={JURUSAN.description}
          image={GAMBAR.jurusanTkj}
        />

        <Section id="jurusan">
          <SectionHeader title={JURUSAN.listTitle} />
          <ul className="mt-10 grid gap-6">
            {JURUSAN.items.map((major) => (
              <li key={major.kode}>
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
