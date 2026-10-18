import { type Gambar } from '~/content/gambar'
import Photo from './photo'
import { Container, displayTitleClass, eyebrowClass } from './ui'

/**
 * Kepala halaman publik (bukan beranda): eyebrow, judul `<h1>`, deskripsi, dan
 * gambar pendamping opsional. Mobile-first: konten menumpuk, lalu menjadi dua
 * kolom pada layar lebar.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string
  title: string
  description: string
  image?: Gambar
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] pt-28 pb-12 sm:pt-32 md:pt-36 md:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-16 right-[-6rem] h-64 w-64 rounded-full bg-brand-blue opacity-10 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
          <div>
            <p className={eyebrowClass}>{eyebrow}</p>
            <h1
              className={`mt-3 text-balance font-semibold leading-[1.1] tracking-[-0.03em] ${displayTitleClass}`}
            >
              {title}
            </h1>
            <p className="mt-4 max-w-[60ch] text-[15.5px] leading-relaxed text-[var(--muted)] text-pretty sm:text-[16.5px]">
              {description}
            </p>
          </div>

          {image && (
            <Photo
              image={image}
              width={1200}
              height={800}
              priority
              className="aspect-[16/10] w-full rounded-[var(--r-lg)] border border-[var(--line-2)] md:aspect-[4/3]"
            />
          )}
        </div>
      </Container>
    </section>
  )
}
