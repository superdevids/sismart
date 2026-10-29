import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

/**
 * Sumber kebenaran lebar layar.
 *
 * Dibaca lewat `useSyncExternalStore` supaya render server dan render klien
 * tidak berselisih: server selalu dianggap desktop, klien menyesuaikan diri
 * setelah hidrasi tanpa memicu peringatan hydration mismatch.
 */
const MOBILE_QUERY = '(max-width: 1023px)'

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )
}

/**
 * State sidebar bergaya TailAdmin:
 * - `isExpanded`  : desktop melebar (288px) atau menciut jadi rail (90px)
 * - `isHovered`   : rail menciut temporer melebar saat kursor masuk
 * - `isMobileOpen`: laci penuh di layar kecil, ditutup otomatis saat pindah
 *                   halaman maupun saat layar melebar menjadi desktop
 */
export function useSidebar() {
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => !prev)
    setIsHovered(false)
  }, [])

  const toggleMobileSidebar = useCallback(() => setIsMobileOpen((prev) => !prev), [])

  const closeMobileSidebar = useCallback(() => setIsMobileOpen(false), [])

  const toggleSubmenu = useCallback((key: string) => {
    setOpenSubmenu((prev) => (prev === key ? null : key))
  }, [])

  // Saat layar melebar menjadi desktop, laci mobile ditutup karena tidak lagi
  // relevan. Ditangani di dalam callback event, bukan di badan effect.
  useEffect(() => {
    const onResize = () => {
      if (!window.matchMedia(MOBILE_QUERY).matches) setIsMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Di layar kecil sidebar selalu tampil penuh; di desktop ia mengikuti
  // expand/hover. Nilai ini dipakai untuk memutuskan label ditampilkan.
  const showLabels = isMobile || isExpanded || isHovered

  return useMemo(
    () => ({
      isMobile,
      isExpanded,
      isMobileOpen,
      isHovered,
      showLabels,
      openSubmenu,
      setIsHovered,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
      toggleSubmenu,
    }),
    [
      isMobile,
      isExpanded,
      isMobileOpen,
      isHovered,
      showLabels,
      openSubmenu,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
      toggleSubmenu,
    ]
  )
}
