import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'
import { LANDING } from '~/content/landing'
import Hero from '~/components/landing/hero'
import {
  BeritaTeaser,
  EkskulTeaser,
  FasilitasTeaser,
  JurusanTeaser,
  KontakTeaser,
  PpdbTeaser,
  ProfilTeaser,
} from '~/components/landing/teasers'

/**
 * Beranda: cuplikan ringkas tiap topik. Setiap section menyediakan 2-3 item
 * contoh dan tautan menuju halaman lengkapnya. Teks diambil dari
 * `inertia/content/*.ts`.
 */
export default function Home() {
  return (
    <>
      <Head title={`${LANDING.meta.siteName} — ${LANDING.school.shortName}`}>
        <meta name="description" content={LANDING.meta.defaultDescription} />
      </Head>

      <main>
        <Hero />
        <ProfilTeaser />
        <JurusanTeaser />
        <FasilitasTeaser />
        <EkskulTeaser />
        <BeritaTeaser />
        <PpdbTeaser />
        <KontakTeaser />
      </main>
    </>
  )
}

Home.layout = [MarketingLayout]
