import type { ReactNode } from 'react'

/**
 * Halaman panel sengaja dibiarkan kosong: tanpa sidebar, tanpa header, tanpa
 * navigasi. Kerangka aplikasi akan dibangun ulang saat modulnya dikerjakan.
 */
export default function BlankLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-background">{children}</div>
}
