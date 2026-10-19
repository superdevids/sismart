import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'
import { BERITA } from '~/content/berita'
import { GAMBAR } from '~/content/gambar'
import PageHero from '~/components/landing/page_hero'
import { NewsCard } from '~/components/landing/cards'
import { Section, SectionHeader } from '~/components/landing/ui'

/**
 * Halaman lengkap BERITA: daftar kartu teks berita sekolah (kategori, tanggal,
 * judul, dan ringkasan).
 */
export default function BeritaPage() {
  return (
    <>
      <Head title={BERITA.meta.title}>
        <meta name="description" content={BERITA.meta.description} />
      </Head>

      <main className="page">
        <PageHero
          eyebrow={BERITA.eyebrow}
          title={BERITA.title}
          description={BERITA.description}
          image={GAMBAR.beritaPrestasi}
        />

        <Section id="berita">
          <SectionHeader title={BERITA.listTitle} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BERITA.items.map((item) => (
              <li key={item.title}>
                <NewsCard item={item} />
              </li>
            ))}
          </ul>
        </Section>
      </main>
    </>
  )
}

BeritaPage.layout = [MarketingLayout]
