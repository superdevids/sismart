import { Mail, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react'
import { JURUSAN } from '~/content/jurusan'
import { type FASILITAS } from '~/content/fasilitas'
import { type EKSKUL } from '~/content/ekskul'
import { type BERITA } from '~/content/berita'
import { type PPDB } from '~/content/ppdb'
import { type KONTAK } from '~/content/kontak'
import { cardClass } from './ui'

type Major = (typeof JURUSAN.items)[number]
type Facility = (typeof FASILITAS.items)[number]
type EkskulCategory = (typeof EKSKUL.categories)[number]
type NewsItem = (typeof BERITA.items)[number]
type Pathway = (typeof PPDB.pathways)[number]
type Channel = (typeof KONTAK.channels)[number]

/** Ikon kanal kontak dipetakan dari kunci `icon` di `content/kontak.ts`. */
const CHANNEL_ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  mail: Mail,
  whatsapp: MessageCircle,
  clock: MapPin,
}

/** Daftar berpoin berlabel untuk kartu jurusan versi rinci. */
function DetailList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
        {label}
      </h4>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-[13.5px] leading-relaxed text-[var(--ink-2)]">
            <span
              aria-hidden="true"
              className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-brand-orange"
            />
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MajorCard({
  major,
  detailed = false,
  showCode = true,
}: {
  major: Major
  detailed?: boolean
  showCode?: boolean
}) {
  return (
    <article className={`p-5 sm:p-6 ${cardClass}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {showCode && (
          <span className="inline-flex w-fit items-center rounded-[var(--r)] bg-brand-blue px-2.5 py-1 font-mono text-[12px] font-semibold tracking-[0.06em] text-white">
            {major.kode}
          </span>
        )}
        <h3 className="text-[16px] font-semibold leading-snug">{major.nama}</h3>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] text-pretty">
        {major.deskripsi}
      </p>

      {detailed ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <DetailList label={JURUSAN.labels.pelajaran} items={major.pelajaran} />
          <DetailList label={JURUSAN.labels.benefit} items={major.benefit} />
          <DetailList label={JURUSAN.labels.prospek} items={major.prospek} />
          <DetailList label={JURUSAN.labels.kampus} items={major.kampus} />
        </div>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {major.pelajaran.map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-[var(--line-2)] px-2.5 py-1 text-[12px] text-[var(--ink-2)]"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <article className={`p-5 sm:p-6 ${cardClass}`}>
      <h3 className="text-[15.5px] font-semibold">{facility.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-2)] text-pretty">
        {facility.description}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] text-pretty">
        {facility.detail}
      </p>
    </article>
  )
}

export function EkskulCard({ category }: { category: EkskulCategory }) {
  return (
    <article className={`p-5 sm:p-6 ${cardClass}`}>
      <h3 className="text-[15.5px] font-semibold">{category.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-2)] text-pretty">
        {category.description}
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--muted)]">
        {category.schedule}
        <span className="block">{category.coach}</span>
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
    </article>
  )
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className={`flex flex-col p-5 sm:p-6 ${cardClass}`}>
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
