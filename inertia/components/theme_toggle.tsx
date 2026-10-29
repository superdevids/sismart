import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePage } from '@inertiajs/react'

const COOKIE = 'app_theme'
const ONE_YEAR = 60 * 60 * 24 * 365

type Theme = 'light' | 'dark'

/**
 * Baca tema efektif: atribut `data-theme` di `<html>` (ditulis server dari
 * cookie) lebih dipercaya daripada props, karena server sudah merendernya.
 */
function readTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

/**
 * Terapkan tema ke DOM secara konsisten: `data-theme` (dipakai token CSS)
 * dan class `dark` (dipakai varian Tailwind `dark:`).
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.classList.toggle('dark', theme === 'dark')
}

export default function ThemeToggle() {
  const page = usePage()
  const [theme, setTheme] = useState<Theme>(
    () => readTheme() ?? (page.props.preferences?.theme as Theme) ?? 'light'
  )

  /**
   * Sinkronkan DOM dengan state saat mount. Tanpa ini, `data-theme` dari
   * server dan class `dark` bisa tidak sesuai, sehingga token warna dan
   * varian Tailwind memilih tema berbeda.
   */
  useEffect(() => {
    applyTheme(theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    document.cookie = `${COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`
  }

  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      title={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      className="inline-grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {isDark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
    </button>
  )
}
