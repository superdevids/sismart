import { test } from '@japa/runner'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Logic tests for Sismart sign-in (code-only authentication).
 *
 * These exercise the authentication logic itself — validation, code
 * verification, the active-account rule, session creation and redirect
 * targets. They never inspect rendered UI; visual judgement is manual.
 *
 * Two API-client details matter here:
 * - `redirects(0)` stops the client following the redirect, so we can assert
 *   on the real 302 + Location instead of the rendered destination page.
 * - a prior GET establishes a session cookie so `.withCsrfToken()` is valid.
 */
async function openSignin(client: any) {
  await client.get('/auth/signin')
}

test.group('Auth / sign-in (logic)', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  async function makeUser(
    overrides: Partial<{
      loginCode: string
      role: string
      isActive: boolean
      fullName: string
    }> = {}
  ) {
    return User.create({
      loginCode: overrides.loginCode ?? 'S2026001',
      fullName: overrides.fullName ?? 'Siswa Contoh',
      role: (overrides.role ?? 'siswa') as any,
      isActive: overrides.isActive ?? true,
    } as any)
  }

  test('kode valid membuat sesi dan mengarahkan ke dashboard', async ({ client, assert }) => {
    const user = await makeUser()
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: user.loginCode })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/dashboard')
  })

  test('kode tidak valid ditolak dan kembali ke halaman masuk', async ({ client, assert }) => {
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: 'TIDAKADA' })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('akun nonaktif tidak bisa masuk walau kodenya benar', async ({ client, assert }) => {
    const user = await makeUser({ loginCode: 'SNONAKTIF', isActive: false })
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: user.loginCode })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('kode dinormalisasi menjadi huruf besar saat dicocokkan', async ({ client, assert }) => {
    await makeUser({ loginCode: 'S2026002' })
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: 's2026002' })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/dashboard')
  })

  test('kode terlalu pendek gagal validasi dan kembali ke halaman masuk', async ({
    client,
    assert,
  }) => {
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .header('referer', '/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: 'A' })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('kode dengan karakter terlarang gagal validasi', async ({ client, assert }) => {
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .header('referer', '/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: 'abc def!!' })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('last_login_at diperbarui setelah masuk', async ({ client, assert }) => {
    const user = await makeUser({ loginCode: 'S2026003' })
    assert.notOk(user.lastLoginAt)
    await openSignin(client)

    await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: user.loginCode })

    await user.refresh()
    assert.ok(user.lastLoginAt)
  })

  test('POST tanpa CSRF token tidak mengautentikasi', async ({ client, assert }) => {
    const user = await makeUser({ loginCode: 'S2026004' })

    const response = await client.post('/auth/signin').form({ loginCode: user.loginCode })

    // CSRF ditolak: tidak ada redirect ke dashboard.
    assert.notEqual(response.headers().location, '/dashboard')
    await user.refresh()
    assert.isNull(user.lastLoginAt)
  })

  test('halaman masuk dapat dibuka (status saja; UI dinilai manual)', async ({ client }) => {
    const response = await client.get('/auth/signin')
    response.assertStatus(200)
  })

  test('/login lama dialihkan ke /auth/signin', async ({ client, assert }) => {
    const response = await client.get('/login').redirects(0)

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })
})

test.group('Auth / protected area (logic)', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('pengguna belum masuk diarahkan ke halaman masuk', async ({ client, assert }) => {
    const response = await client.get('/dashboard').redirects(0)

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('pengguna yang sudah masuk dapat membuka dashboard', async ({ client }) => {
    const user = await User.create({
      loginCode: 'S2026010',
      fullName: 'Siswa Masuk',
      role: 'siswa' as any,
      isActive: true,
    } as any)

    const response = await client.get('/dashboard').loginAs(user)

    response.assertStatus(200)
  })
})
