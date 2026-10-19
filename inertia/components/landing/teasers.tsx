import { Link } from '@adonisjs/inertia/react'
import { LANDING } from '~/content/landing'
import { PROFIL } from '~/content/profil'
import { JURUSAN } from '~/content/jurusan'
import { FASILITAS } from '~/content/fasilitas'
import { EKSKUL } from '~/content/ekskul'
import { BERITA } from '~/content/berita'
import { PPDB } from '~/content/ppdb'
import { KONTAK } from '~/content/kontak'
import TeaserSection from './teaser'
import { ChannelRow, EkskulCard, FacilityCard, MajorCard, NewsCard, PathwayCard } from './cards'
import { cardClass, focusRing } from './ui'

const gridClass = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
const valueCardClass = `p-5 ${cardClass}`

/** Cuplikan profil: paragraf singkat + angka kunci sekolah. */
export function ProfilTeaser() {
  return (
    <TeaserSection
      id="profil"
      eyebrow={PROFIL.eyebrow}
      title={PROFIL.title}
      href="/profil"
      linkLabel={`${LANDING.actions.seeAll} profil`}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Deskripsi sengaja dirender di kontainer yang sama dengan paragraf
            agar lebar dan perataannya identik (sebelumnya di header section). */}
        <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-[var(--ink-2)] text-pretty">
          <p>{PROFIL.description}</p>
          {PROFIL.paragraphs.slice(0, 2).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-4">
          {PROFIL.facts.map((fact) => (
            <div key={fact.label} className={valueCardClass}>
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                <span className="block text-[24px] font-semibold tracking-[-0.02em] text-brand-blue">
                  {fact.value}
                </span>
                <span className="mt-1 block text-[13px] text-[var(--muted)]">{fact.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </TeaserSection>
  )
}

/** Cuplikan tiga program keahlian pertama. */
export function JurusanTeaser() {
  return (
    <TeaserSection
      id="jurusan"
      tone="muted"
      eyebrow={JURUSAN.eyebrow}
      title={JURUSAN.title}
      description={JURUSAN.description}
      href="/jurusan"
      linkLabel={`${LANDING.actions.seeAll} jurusan`}
    >
      <ul className={gridClass}>
        {JURUSAN.items.slice(0, 3).map((major) => (
          <li key={major.kode}>
            <MajorCard major={major} showCode={false} />
          </li>
        ))}
      </ul>
    </TeaserSection>
  )
}

/** Cuplikan tiga fasilitas pertama. */
export function FasilitasTeaser() {
  return (
    <TeaserSection
      id="fasilitas"
      eyebrow={FASILITAS.eyebrow}
      title={FASILITAS.title}
      description={FASILITAS.description}
      href="/fasilitas"
      linkLabel={`${LANDING.actions.seeAll} fasilitas`}
    >
      <ul className={gridClass}>
        {FASILITAS.items.slice(0, 3).map((facility) => (
          <li key={facility.title}>
            <FacilityCard facility={facility} />
          </li>
        ))}
      </ul>
    </TeaserSection>
  )
}

/** Cuplikan tiga bidang ekstrakurikuler pertama. */
export function EkskulTeaser() {
  return (
    <TeaserSection
      id="ekskul"
      tone="muted"
      eyebrow={EKSKUL.eyebrow}
      title={EKSKUL.title}
      description={EKSKUL.description}
      href="/ekskul"
      linkLabel={`${LANDING.actions.seeAll} ekskul`}
    >
      <ul className={gridClass}>
        {EKSKUL.categories.slice(0, 3).map((category) => (
          <li key={category.name}>
            <EkskulCard category={category} />
          </li>
        ))}
      </ul>
    </TeaserSection>
  )
}

/** Cuplikan berita terbaru dengan tautan ke halaman berita lengkap. */
export function BeritaTeaser() {
  return (
    <TeaserSection
      id="berita"
      eyebrow={BERITA.eyebrow}
      title={BERITA.title}
      description={BERITA.description}
      href="/berita"
      linkLabel={`${LANDING.actions.seeAll} berita`}
    >
      <ul className={gridClass}>
        {BERITA.items.map((item) => (
          <li key={item.title}>
            <NewsCard item={item} />
          </li>
        ))}
      </ul>
    </TeaserSection>
  )
}

/** Cuplikan jalur PPDB dan dua jadwal terdekat. */
export function PpdbTeaser() {
  return (
    <TeaserSection
      id="ppdb"
      tone="muted"
      eyebrow={PPDB.eyebrow}
      title={PPDB.title}
      description={PPDB.description}
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PPDB.pathways.slice(0, 3).map((pathway) => (
          <li key={pathway.name}>
            <PathwayCard pathway={pathway} />
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
        {PPDB.scheduleTitle}
      </h3>
      <dl className={`mt-3 ${cardClass}`}>
        {PPDB.schedule.slice(0, 2).map((entry, index) => (
          <div
            key={entry.label}
            className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 ${
              index > 0 ? 'border-t border-[var(--line)]' : ''
            }`}
          >
            <dt className="text-sm text-[var(--muted)]">{entry.label}</dt>
            <dd className="text-sm font-medium">{entry.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <Link href="/ppdb" className={`btn bg-brand-blue text-white hover:opacity-90 ${focusRing}`}>
          {LANDING.actions.seeAll} informasi PPDB
        </Link>
      </div>
    </TeaserSection>
  )
}

/** Cuplikan kontak: alamat dan kanal utama. */
export function KontakTeaser() {
  return (
    <TeaserSection
      id="kontak"
      eyebrow={KONTAK.eyebrow}
      title={KONTAK.title}
      description={KONTAK.description}
      href="/kontak"
      linkLabel={`${LANDING.actions.seeAll} kontak`}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
            {KONTAK.address.label}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-2)]">
            {KONTAK.address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <ul className="flex flex-col gap-4">
          {KONTAK.channels.slice(0, 3).map((channel) => (
            <ChannelRow key={channel.label} channel={channel} />
          ))}
        </ul>
      </div>
    </TeaserSection>
  )
}
