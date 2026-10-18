import { Link } from '@adonisjs/inertia/react'
import Logo from '~/components/logo'
import { LANDING } from '~/content/landing'
import { KONTAK } from '~/content/kontak'
import { Container, focusRing } from './ui'

const columnTitleClass = 'text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]'

/**
 * Footer publik: identitas portal, navigasi antar halaman, kontak sekolah, dan
 * tautan media sosial.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear()
  const linkedChannels = KONTAK.channels.filter(
    (channel) => channel.icon === 'phone' || channel.icon === 'mail' || channel.icon === 'whatsapp'
  )

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--card)]">
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1.2fr]">
          <div className="max-w-[44ch]">
            <Logo size={26} />
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] text-pretty">
              {LANDING.footer.description}
            </p>
            <p className="mt-3 text-sm font-medium">{LANDING.school.name}</p>
            <p className="text-sm text-[var(--muted)]">{LANDING.school.accreditation}</p>
          </div>

          <nav aria-label="Navigasi footer">
            <h2 className={columnTitleClass}>{LANDING.footer.navTitle}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {LANDING.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)] ${focusRing}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={columnTitleClass}>{LANDING.footer.contactTitle}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-[var(--muted)]">
              {KONTAK.address.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
              {linkedChannels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={'href' in channel ? channel.href : undefined}
                    className={`transition-colors hover:text-[var(--ink)] ${focusRing}`}
                  >
                    {channel.label}: {channel.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--line)] pt-6 text-[13px] text-[var(--muted)] md:mt-12 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {LANDING.brand.portalName} · {LANDING.school.name}. {LANDING.footer.copyright}
          </p>
          <ul className="flex flex-wrap items-center gap-4">
            {LANDING.footer.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`transition-colors hover:text-[var(--ink)] ${focusRing}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
