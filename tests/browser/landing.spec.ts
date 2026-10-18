import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import {
  LANDING_SECTION_IDS,
  RENDER_TIMEOUT,
  collectPageErrors,
  visibleHeadingLevels,
  waitForLandingContent,
} from '#tests/browser/helpers'

/**
 * Landing page browser suite. Seluruh assertion memakai kontrak struktur
 * (id anchor, tag, atribut) — bukan copy teks — supaya tidak rapuh terhadap
 * perubahan wording/i18n.
 *
 * Kontrak yang diuji (disampaikan ke Cody-B):
 *  - section dengan id: profil, jurusan, fasilitas, ekskul, ppdb, kontak
 *  - nav anchor di header menautkan ke section tersebut
 *  - tidak ada tautan domain adonisjs.com (termasuk docs/plus)
 */
test.group('Landing page', (group) => {
  group.setup(() => testUtils.db().migrate())
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('renders the landing page with content and no fatal errors', async ({ assert, visit }) => {
    const page = await visit('/')
    const errors = collectPageErrors(page)

    await page.assertPath('/')

    // Tunggu render CSR sebelum memutus halaman kosong (ssr.enabled: false,
    // konten muncul ratusan ms setelah `load`).
    const renderedOnLoad = await waitForLandingContent(page)
    const bodyText = await page.locator('body').innerText()

    // Reload dengan listener terpasang untuk menangkap error saat initial load.
    await page.reload()
    await page.assertPath('/')
    const renderedAfterReload = await waitForLandingContent(page)

    // Error fatal didahulukan agar pemicu kegagalan render terlihat lebih dulu.
    assert.deepEqual(errors.pageErrors, [], 'uncaught exceptions during landing page load')
    assert.deepEqual(errors.fatalConsoleErrors(), [], 'fatal console errors on landing page')

    // Kedua navigasi wajib benar-benar merender konten (bukan DOM kosong yang
    // lolos karena belum sempat melihat error apa pun).
    assert.isTrue(renderedOnLoad, 'landing page did not render content on initial load')
    assert.isTrue(renderedAfterReload, 'landing page did not render content after reload')

    // Halaman harus memuat konten utama yang non-kosong (Inertia hydrate).
    assert.isNotEmpty(bodyText.trim(), 'landing page body has no text content')
  })

  test('exposes every contracted section anchor with non-empty content', async ({
    assert,
    visit,
  }) => {
    const page = await visit('/')

    // Tunggu render CSR sebelum memeriksa section (DOM masih kosong sesaat
    // setelah visit pada app tanpa SSR).
    await waitForLandingContent(page)

    for (const id of LANDING_SECTION_IDS) {
      await page.assertExists(`#${id}`)

      const sectionText = await page.locator(`#${id}`).first().innerText()
      assert.isNotEmpty(sectionText.trim(), `section #${id} has no content`)
    }
  })

  test('contains no links to adonisjs.com domains', async ({ assert, visit }) => {
    const page = await visit('/')

    // Tunggu render agar pemeriksaan link tidak lolos karena DOM masih kosong.
    await waitForLandingContent(page)

    const hrefs = await page.$$eval('a[href]', (links) =>
      links.map((link) => link.getAttribute('href') ?? '')
    )

    const offenders = hrefs.filter((href) => href.includes('adonisjs.com'))
    assert.deepEqual(offenders, [], 'landing page links to adonisjs.com domains')
  })

  test('keeps a consistent heading hierarchy without skipped levels', async ({ assert, visit }) => {
    const page = await visit('/')

    // Tunggu render CSR dan heading h1 benar-benar terlihat sebelum membaca
    // struktur heading ($$eval tidak auto-retry).
    await waitForLandingContent(page)
    await page.waitForSelector('h1', { state: 'visible', timeout: RENDER_TIMEOUT })

    const levels = await visibleHeadingLevels(page)
    assert.isNotEmpty(levels, 'no visible headings on the landing page')
    assert.equal(levels[0], 1, 'first visible heading must be an <h1>')

    for (let i = 1; i < levels.length; i++) {
      const jump = levels[i] - levels[i - 1]
      assert.isAtMost(
        jump,
        1,
        `heading hierarchy skips a level: h${levels[i - 1]} followed by h${levels[i]}`
      )
    }
  })

  test('header nav anchor scrolls to its target section', async ({ assert, visit }) => {
    const page = await visit('/')

    // Tunggu render CSR: nav anchor baru tersedia setelah React hydrate.
    await waitForLandingContent(page)

    // Anchor nav yang tersedia di header, fallback ke nav biasa, lalu link mana pun.
    const navSelector = 'header a[href^="#"], nav a[href^="#"], a[href^="#"]'
    const anchorHrefs = await page.$$eval(navSelector, (links) =>
      links
        .filter((link) => link.getClientRects().length > 0)
        .map((link) => link.getAttribute('href') ?? '')
    )

    // Pilih anchor kontrak yang tersedia; section terakhir diprioritaskan agar
    // pergeseran scroll pasti terjadi dari posisi atas halaman.
    const target =
      [...LANDING_SECTION_IDS.map((id) => `#${id}`)]
        .reverse()
        .find((href) => anchorHrefs.includes(href)) ?? anchorHrefs.find((href) => href.length > 1)

    assert.isDefined(
      target,
      'landing header must expose at least one in-page anchor link (e.g. #profil)'
    )

    // Pastikan posisi awal di puncak halaman agar scroll benar-benar teruji.
    // Callback evaluate berjalan di browser; lib tsconfig tanpa DOM, jadi
    // jendela browser diakses lewat globalThis (berupa window di konteks browser).
    type BrowserGlobals = {
      scrollTo(x: number, y: number): void
      innerHeight: number
      document: {
        getElementById(
          id: string
        ): { getBoundingClientRect(): { top: number; bottom: number } } | null
      }
    }

    await page.evaluate(() => (globalThis as unknown as BrowserGlobals).scrollTo(0, 0))
    const link = page.locator(`a[href="${target}"]`).first()
    await link.click()

    await page.assertUrlContains(target!)

    // Section target harus benar-benar masuk ke viewport setelah klik.
    const sectionId = target!.slice(1)
    await page.waitForFunction(
      (id) => {
        const g = globalThis as unknown as BrowserGlobals
        const el = g.document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top < g.innerHeight && rect.bottom > 0
      },
      sectionId,
      { timeout: 5000 }
    )
  })
})
