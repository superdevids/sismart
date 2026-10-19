import { ArrowRight } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { LANDING } from '~/content/landing'
import { GAMBAR, gambarUrl } from '~/content/gambar'
import Photo from './photo'
import { Container, focusRing } from './ui'

/**
 * Hero beranda: latar gambar layar penuh dengan lapisan gelap agar teks putih
 * tetap kontras. `LANDING.hero.videoUrl` opsional; bila diisi, video dipakai
 * sebagai latar dengan `poster` dari gambar `GAMBAR.hero`.
 */
export default function Hero() {
  const media = GAMBAR.hero
  const videoUrl = LANDING.hero.videoUrl

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 md:pt-36 md:pb-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {videoUrl ? (
          <video
            className="h-full w-full object-cover"
            src={videoUrl}
            poster={gambarUrl(media, 1920, 1080)}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Photo
            image={media}
            width={1920}
            height={1080}
            priority
            overlay={false}
            className="h-full w-full"
          />
        )}
        <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/60 to-black/50" />
      </div>

      <Container>
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
              {LANDING.hero.eyebrow}
            </p>

            <h1 className="heading-display mt-5 text-white">{LANDING.hero.title}</h1>
            <p className="mt-3 text-[16px] font-medium text-white/90 sm:text-[18px]">
              {LANDING.school.name}
            </p>
            <p className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-white/85 text-pretty">
              {LANDING.hero.tagline}
            </p>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-white/75 text-pretty">
              {LANDING.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={LANDING.hero.primaryCta.href}
                className={`btn bg-brand-blue text-white hover:opacity-90 ${focusRing}`}
              >
                {LANDING.hero.primaryCta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                route="session.create"
                className={`btn btn--secondary ${focusRing}`}
                title={LANDING.actions.loginNote}
              >
                {LANDING.hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="rounded-[var(--r-lg)] border border-white/20 bg-white/10 p-5 text-white backdrop-blur-sm sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">
              {LANDING.brand.portalLabel}
            </p>
            <p className="mt-2 text-[18px] font-semibold leading-snug">
              {LANDING.school.shortName}
            </p>
            <p className="mt-1 text-sm text-white/80">{LANDING.school.accreditation}</p>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/20 pt-10 md:mt-14 md:grid-cols-4">
          {LANDING.hero.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[13px] text-white/70">{stat.label}</dt>
              <dd className="mt-1 text-[26px] font-semibold tracking-[-0.02em] text-white sm:text-[30px]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
