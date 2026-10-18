import env from '#start/env'
import { test } from '@japa/runner'
import ace from '@adonisjs/core/services/ace'
import testUtils from '@adonisjs/core/services/test_utils'
import type { Page } from 'playwright'
import { collectPageErrors } from '#tests/browser/helpers'

/**
 * Login/session browser suite. Memakai kredensial admin dari `.env.test`
 * (ADMIN_KODE_UNIK / ADMIN_PASSWORD) yang di-seed lewat `admin:create`,
 * sama seperti suite functional.
 *
 * Form login diisi berdasarkan atribut `name` (kontrak field validator),
 * bukan label/placeholder yang bisa berubah karena i18n.
 */

const KODE_UNIK = env.get('ADMIN_KODE_UNIK')!
const PASSWORD = env.get('ADMIN_PASSWORD')!

async function loginViaForm(page: Page) {
  await page.fill('input[name="kodeUnik"]', KODE_UNIK)
  await page.fill('input[name="password"]', PASSWORD)
  await page.click('form button[type="submit"]')
  await page.assertPath('/dashboard')
}

test.group('Authentication (browser)', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
    const result = await ace.exec('admin:create', [])
    if (result.exitCode !== 0) throw new Error('admin:create command failed during test setup')
  })
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('renders the login form without fatal errors', async ({ assert, visit }) => {
    const page = await visit('/login')
    const errors = collectPageErrors(page)

    await page.assertPath('/login')
    await page.assertExists('input[name="kodeUnik"]')
    await page.assertExists('input[name="password"]')
    await page.assertExists('form button[type="submit"]')

    // Reload dengan listener terpasang agar error saat initial load tertangkap.
    await page.reload()
    await page.assertPath('/login')

    assert.deepEqual(errors.pageErrors, [], 'uncaught exceptions while rendering the login form')
    assert.deepEqual(
      errors.fatalConsoleErrors(),
      [],
      'fatal console errors while rendering the login form'
    )
  })

  test('logs the admin in with valid credentials and reaches the dashboard', async ({ visit }) => {
    const page = await visit('/login')
    await loginViaForm(page)
    await page.assertPath('/dashboard')
  })

  test('logs out and invalidates the session', async ({ visit }) => {
    const page = await visit('/login')
    await loginViaForm(page)

    // Inertia merender form logout dengan action menuju rute session.destroy.
    const logoutSelector =
      'form[action*="logout"] button[type="submit"], [data-testid="logout-button"]'
    await page.assertExists(logoutSelector)
    await page.locator(logoutSelector).first().click()
    await page.assertPath('/login')

    // Sesi harus benar-benar berakhir: /dashboard kembali mengarah ke /login.
    const afterLogout = await visit('/dashboard')
    await afterLogout.assertPath('/login')
  })

  test('redirects guests from protected pages to the login page', async ({ visit }) => {
    const page = await visit('/dashboard')
    await page.assertPath('/login')
    await page.assertExists('input[name="kodeUnik"]')
  })
})
