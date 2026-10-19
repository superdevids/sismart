import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePage } from '@inertiajs/react'

const COOKIE = 'app_theme'
const ONE_YEAR = 60 * 60 * 24 * 365

export default function ThemeToggle() {
  const page = usePage()
  const [theme, setTheme] = useState<'light' | 'dark'>(page.props.preferences?.theme ?? 'light')

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    document.cookie = `${COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`
  }

  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      className="iconbtn"
      onClick={toggle}
      aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      title={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
    >
      <Sun size={16} className={`themetoggle__icon ${isDark ? 'themetoggle__icon--on' : ''}`} />
      <Moon size={16} className={`themetoggle__icon ${isDark ? '' : 'themetoggle__icon--on'}`} />
    </button>
  )
}
