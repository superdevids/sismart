import type { Page } from 'playwright'

/**
 * Kontrak id anchor section landing page yang dijanjikan tersedia (Cody-B).
 * Dipakai landing.spec.ts untuk memastikan setiap section punya id stabil
 * sehingga nav anchor bisa men-targetnya.
 */
export const LANDING_SECTION_IDS = [
  'profil',
  'jurusan',
  'fasilitas',
  'ekskul',
  'ppdb',
  'kontak',
] as const

/**
 * Kontrak link PAGE pada nav header publik (keputusan user: section index
 * pills dihapus, nav header kini menautkan ke halaman publik terpisah).
 * Dipakai landing.spec.ts untuk memastikan setiap link nav tersedia dan
 * menavigasi ke path yang benar.
 */
export const LANDING_NAV_PAGE_HREFS = [
  '/profil',
  '/jurusan',
  '/fasilitas',
  '/ekskul',
  '/berita',
  '/ppdb',
  '/kontak',
] as const

/**
 * Menempelkan listener pada `page` untuk menangkap error fatal saat navigasi.
 *
 * - `pageerror`  : uncaught exception (benar-benar fatal, selalu dibagikan).
 * - `console.error`: dibagikan kecuali noise resource yang tidak terkait
 *   (favicon 404, resource opsional gagal dimuat) agar tidak flaky.
 *
 * Kembalikan object berisi dua array yang akan terisi selama halaman berjalan.
 */
export function collectPageErrors(page: Page) {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []

  page.on('pageerror', (err) => pageErrors.push(err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })

  const isIgnorable = (text: string) => /favicon|failed to load resource/i.test(text)

  return {
    pageErrors,
    consoleErrors,
    fatalConsoleErrors: () => consoleErrors.filter((t) => !isIgnorable(t)),
  }
}

/**
 * Timeout tunggu render CSR. App memakai `ssr.enabled: false`, jadi konten
 * baru dirender React ratusan ms setelah `load`. Grace 15s supaya stabil di
 * mesin lambat (bukan fixed sleep pendek).
 */
export const RENDER_TIMEOUT = 15_000

/**
 * Menunggu halaman selesai dirender CSR: `<main>` harus ada dan tidak kosong.
 *
 * Dipakai sebelum membaca DOM (innerText/$$eval/count) karena DOM masih kosong
 * sesaat setelah `visit()`/`reload()`. Mengembalikan `true` bila ter-render dan
 * `false` bila timeout — tidak melempar, supaya test yang menangkap fatal error
 * tetap bisa menjalankan assertion error-capture-nya (pageerror/console.error).
 */
export async function waitForLandingContent(page: Page, timeout = RENDER_TIMEOUT) {
  try {
    await page.waitForSelector('main:not(:empty)', { state: 'visible', timeout })
    return true
  } catch {
    return false
  }
}

/**
 * Menunggu atribut `data-theme` pada `<html>` mencapai nilai yang diharapkan.
 * Dibutuhkan karena `getAttribute` biasa tidak auto-retry, sedangkan update
 * atribut oleh React terjadi setelah event klik diproses.
 */
export async function waitForDataTheme(
  page: Page,
  theme: 'light' | 'dark',
  timeout = RENDER_TIMEOUT
) {
  await page.waitForSelector(`html[data-theme="${theme}"]`, { timeout })
}

/**
 * Level heading (h1..h6) yang terlihat di viewport/layout, sesuai urutan DOM.
 * Heading tersembunyi (drawer mobile, off-screen) difilter out lewat
 * `getClientRects().length`, supaya hierarchy check tidak kena duplikat
 * markup responsif.
 */
export async function visibleHeadingLevels(page: Page): Promise<number[]> {
  return page.$$eval('h1,h2,h3,h4,h5,h6', (els) =>
    els.filter((el) => el.getClientRects().length > 0).map((el) => Number(el.tagName[1]))
  )
}

/**
 * Menemukan kontrol theme toggle secara resilient.
 *
 * Urutan percobaan selector:
 *  1. `data-testid="theme-toggle"` — kontrak stabil bila Cody menyediakannya.
 *  2. `header button.iconbtn` — hook class yang ada saat ini.
 *  3. `header button:has(.themetoggle__icon)` — hook pada ikon Sun/Moon.
 *
 * Tidak bergantung pada copy/aria-label yang bisa berubah karena i18n.
 */
export async function themeToggle(page: Page) {
  const candidates = [
    'button[data-testid="theme-toggle"]',
    'header button.iconbtn',
    'header button:has(.themetoggle__icon)',
  ]

  // Kontrol berada di header yang dirender CSR; tunggu dulu sebelum count()
  // supaya tidak membaca DOM kosong. Bila tidak ada kandidat sama sekali,
  // jatuh ke loop lalu lempar error yang informatif (bukan timeout Playwright).
  await page
    .waitForSelector(candidates.join(', '), { state: 'visible', timeout: RENDER_TIMEOUT })
    .catch(() => {})

  for (const selector of candidates) {
    const locator = page.locator(selector)
    if ((await locator.count()) > 0) return locator.first()
  }

  throw new Error('Theme toggle control not found on page')
}
