import { type Gambar } from '~/content/gambar'
import Photo from './photo'
import { Container, eyebrowClass } from './ui'

/**
 * Kepala halaman publik (bukan beranda): eyebrow, judul `<h1>`, dan deskripsi
 * di atas latar gambar. Gambar dirender sebagai lapisan latar dengan overlay
 * bertoken tema (`hero-media__overlay`) plus lapisan `--paper` tipis agar teks
 * tetap terbaca di mode terang maupun gelap.
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
    <section className="relative isolate overflow-hidden border-b border-[var(--line)] pt-28 pb-14 sm:pt-32 md:pt-36 md:pb-20">
      {image && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[var(--paper)]"
        >
          <Photo
            image={image}
            width={1920}
            height={1080}
            priority
            overlay={false}
            className="h-full w-full opacity-40"
          />
          <span className="hero-media__overlay" />
        </div>
      )}

      <Container className="relative">
        <p className={eyebrowClass}>{eyebrow}</p>
        <h1 className="heading-display mt-3 text-balance">{title}</h1>
        <p className="mt-4 max-w-[60ch] text-[15.5px] leading-relaxed text-[var(--muted)] text-pretty sm:text-[16.5px]">
          {description}
        </p>
      </Container>
    </section>
  )
}
