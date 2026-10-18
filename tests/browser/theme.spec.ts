import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { themeToggle, waitForDataTheme, waitForLandingContent } from '#tests/browser/helpers'

/**
 * Theme toggle browser suite. Mengunci perilaku:
 *  - data-theme pada <html> berubah light -> dark -> light
 *  - cookie app_theme ikut diperbarui (persistensi)
 *  - setelah reload, tema dipulihkan dari cookie oleh server (SSR edge).
 *
 * Kontrol dicari secara resilient (data-testid -> class -> ikon) karena
 * aria-label bisa berubah oleh i18n.
 */
test.group('Theme toggle', (group) => {
  group.setup(() => testUtils.db().migrate())
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('toggles data-theme light -> dark -> light and keeps app_theme cookie in sync', async ({
    assert,
    visit,
  }) => {
    const page = await visit('/')
    const toggle = await themeToggle(page)

    // Default tanpa cookie adalah light (dari edge layout + inertia middleware).
    // waitForDataTheme auto-retry (bukan getAttribute langsung) karena atribut
    // bisa belum terpasang sesaat setelah visit pada mesin lambat.
    await waitForDataTheme(page, 'light')
    assert.equal(await page.getAttribute('html', 'data-theme'), 'light')

    // light -> dark (tunggu React menerapkan atribut sebelum assert cookie)
    await toggle.click()
    await waitForDataTheme(page, 'dark')
    assert.equal(await page.getAttribute('html', 'data-theme'), 'dark')
    await page.assertCookie('app_theme', 'dark')

    // dark -> light
    await toggle.click()
    await waitForDataTheme(page, 'light')
    assert.equal(await page.getAttribute('html', 'data-theme'), 'light')
    await page.assertCookie('app_theme', 'light')
  })

  test('restores the persisted theme after a reload', async ({ assert, visit }) => {
    const page = await visit('/')
    const toggle = await themeToggle(page)

    // Set ke dark lalu reload: server harus membaca cookie app_theme.
    await toggle.click()
    await waitForDataTheme(page, 'dark')
    assert.equal(await page.getAttribute('html', 'data-theme'), 'dark')

    await page.reload()
    // Tunggu render + atribut tema dipulihkan sebelum assert (grace besar
    // agar stabil di mesin lambat).
    await waitForLandingContent(page)
    await waitForDataTheme(page, 'dark')
    assert.equal(await page.getAttribute('html', 'data-theme'), 'dark')
    await page.assertCookie('app_theme', 'dark')

    // Kembalikan ke light agar state tidak bocor ke test berikutnya.
    const reloadedToggle = await themeToggle(page)
    await reloadedToggle.click()
    await waitForDataTheme(page, 'light')
    assert.equal(await page.getAttribute('html', 'data-theme'), 'light')
  })
})
