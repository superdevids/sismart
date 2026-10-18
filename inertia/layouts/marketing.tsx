import { type ReactNode } from 'react'
import FlashToasts from '~/components/flash_toasts'
import SiteFooter from '~/components/landing/site_footer'
import SiteHeader from '~/components/landing/site_header'

/**
 * Kerangka halaman publik: header (logo, navigasi, tombol masuk), konten
 * halaman, lalu footer.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <FlashToasts />
    </>
  )
}
