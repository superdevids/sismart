import {
  Activity,
  BookOpen,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  MoonStar,
  Phone,
  Utensils,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { type JURUSAN } from '~/content/jurusan'
import { type FASILITAS } from '~/content/fasilitas'
import { type EKSKUL } from '~/content/ekskul'
import { type BERITA } from '~/content/berita'
import { type PPDB } from '~/content/ppdb'
import { type KONTAK } from '~/content/kontak'
import { GAMBAR } from '~/content/gambar'
import Photo from './photo'
import { cardClass } from './ui'

type Major = (typeof JURUSAN.items)[number]
type Facility = (typeof FASILITAS.items)[number]
type EkskulCategory = (typeof EKSKUL.categories)[number]
type NewsItem = (typeof BERITA.items)[number]
type Pathway = (typeof PPDB.pathways)[number]
type Channel = (typeof KONTAK.channels)[number]

/** Ikon fasilitas dipetakan dari kunci `icon` di `content/fasilitas.ts`. */
const FACILITY_ICONS: Record<string, LucideIcon> = {
  monitor: Monitor,
  wrench: Wrench,
  book: BookOpen,
  activity: Activity,
  mosque: MoonStar,
  utensils: Utensils,
}

/** Ikon kanal kontak dipetakan dari kunci `icon` di `content/kontak.ts`. */
const CHANNEL_ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  mail: Mail,
  whatsapp: MessageCircle,
  clock: MapPin,
}

export function MajorCard({ major, detailed = false }: { major: Major; detailed?: boolean }) {
  return (
    <article className={`flex flex-col overflow-hidden ${cardClass}`}>
      <Photo image={GAMBAR[major.image]} width={800} height={500} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="inline-flex w-fit items-center rounded-[var(--r)] bg-brand-blue px-2.5 py-1 font-mono text-[12px] font-semibold tracking-[0.06em] text-white">
          {major.code}
        </span>
        <h3 className="mt-4 text-[16px] font-semibold leading-snug">{major.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)] text-pretty">
          {major.description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {major.competencies.map((competency) => (
            <li
              key={competency}
              className="rounded-full border border-[var(--line-2)] px-2.5 py-1 text-[12px] text-[var(--ink-2)]"
            >
              {competency}
            </li>
          ))}
        </ul>
        {detailed && (
          <div className="mt-5 border-t border-[var(--line)] pt-4">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              Prospek karier
            </h4>
            <ul className="mt-2 flex flex-col gap-1.5">
              {major.prospects.map((prospect) => (
                <li key={prospect} className="flex gap-2 text-[13.5px] text-[var(--ink-2)]">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-brand-orange"
                  />
                  <span>{prospect}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}

export function FacilityCard({ facility }: { facility: Facility }) {
  const Icon = FACILITY_ICONS[facility.icon] ?? MapPin

  return (
    <article className={`flex flex-col overflow-hidden ${cardClass}`}>
      <Photo image={GAMBAR[facility.image]} width={800} height={600} className="aspect-[4/3]" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="grid h-11 w-11 place-items-center rounded-[var(--r)] border border-[var(--line-2)] text-brand-blue">
          <Icon size={20} aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-[15.5px] font-semibold">{facility.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] text-pretty">
          {facility.description}
        </p>
      </div>
    </article>
  )
}

export function EkskulCard({ category }: { category: EkskulCategory }) {
  return (
    <article className={`flex flex-col overflow-hidden ${cardClass}`}>
      <Photo image={GAMBAR[category.image]} width={800} height={600} className="aspect-[4/3]" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-[15.5px] font-semibold">{category.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] text-pretty">
          {category.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {category.items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-[var(--line-2)] px-2.5 py-1 text-[12px] text-[var(--ink-2)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className={`flex flex-col overflow-hidden ${cardClass}`}>
      <Photo image={GAMBAR[item.image]} width={800} height={500} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[12px] text-[var(--muted)]">
          <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-brand-orange" />
          <span className="font-medium text-[var(--ink-2)]">{item.category}</span>
          <span aria-hidden="true">·</span>
          <span>{item.date}</span>
        </div>
        <h3 className="mt-4 text-[16px] font-semibold leading-snug">{item.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)] text-pretty">
          {item.excerpt}
        </p>
      </div>
    </article>
  )
}

export function PathwayCard({ pathway }: { pathway: Pathway }) {
  return (
    <article className={`flex flex-col p-5 sm:p-6 ${cardClass}`}>
      <span className="w-fit rounded-full bg-brand-blue/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-brand-blue">
        {pathway.badge}
      </span>
      <h3 className="mt-4 text-[15.5px] font-semibold tracking-[-0.01em]">{pathway.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] text-pretty">
        {pathway.description}
      </p>
    </article>
  )
}

export function ChannelIcon({ icon }: { icon: string }) {
  const Icon = CHANNEL_ICONS[icon] ?? MapPin
  return <Icon size={16} aria-hidden="true" />
}

/** Item kanal kontak sebagai baris ikon + label + nilai (opsional bertaut). */
export function ChannelRow({ channel }: { channel: Channel }) {
  const content = (
    <>
      <span className="grid h-9 w-9 flex-none place-items-center rounded-[var(--r)] border border-[var(--line-2)] text-brand-blue">
        <ChannelIcon icon={channel.icon} />
      </span>
      <span>
        <span className="block text-[12px] uppercase tracking-[0.08em] text-[var(--muted)]">
          {channel.label}
        </span>
        <span className="block text-sm font-medium">{channel.value}</span>
      </span>
    </>
  )

  return (
    <li className="flex items-start gap-3">
      {'href' in channel && channel.href ? (
        <a href={channel.href} className="flex items-start gap-3 hover:opacity-80">
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  )
}
