import { Head } from '@inertiajs/react'
import { MapPin } from 'lucide-react'
import MarketingLayout from '~/layouts/marketing'
import { KONTAK } from '~/content/kontak'
import { GAMBAR } from '~/content/gambar'
import PageHero from '~/components/landing/page_hero'
import { ChannelRow } from '~/components/landing/cards'
import { Section, cardClass } from '~/components/landing/ui'

/**
 * Halaman lengkap KONTAK: alamat, kanal kontak (telepon, email, WhatsApp, jam
 * operasional), dan keterangan peta.
 */
export default function KontakPage() {
  return (
    <>
      <Head title={KONTAK.meta.title}>
        <meta name="description" content={KONTAK.meta.description} />
      </Head>

      <main className="page">
        <PageHero
          eyebrow={KONTAK.eyebrow}
          title={KONTAK.title}
          description={KONTAK.description}
          image={GAMBAR[KONTAK.image]}
        />

        <Section id="kontak">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                  {KONTAK.address.label}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-2)]">
                  {KONTAK.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              <ul className="flex flex-col gap-4">
                {KONTAK.channels.map((channel) => (
                  <ChannelRow key={channel.label} channel={channel} />
                ))}
              </ul>
            </div>

            <div
              className={`flex min-h-[280px] flex-col items-center justify-center gap-3 border-dashed p-8 text-center ${cardClass}`}
            >
              <MapPin size={22} className="text-brand-blue" aria-hidden="true" />
              <p className="max-w-[42ch] text-sm leading-relaxed text-[var(--muted)] text-pretty">
                {KONTAK.mapNote}
              </p>
            </div>
          </div>
        </Section>
      </main>
    </>
  )
}

KontakPage.layout = [MarketingLayout]
