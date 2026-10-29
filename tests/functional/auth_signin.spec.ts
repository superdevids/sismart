import { test } from '@japa/runner'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'

const AUTH_PASSWORD = 'rahasia-uji-123'

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
      password: string | null
    }> = {}
  ) {
    const password = overrides.password === null ? null : (overrides.password ?? AUTH_PASSWORD)

    return User.create({
      loginCode: overrides.loginCode ?? 'S2026001',
      fullName: overrides.fullName ?? 'Siswa Contoh',
      role: (overrides.role ?? 'siswa') as any,
      isActive: overrides.isActive ?? true,
      password,
    } as any)
  }

  test('kode dan password benar membuat sesi dan mengarahkan ke panel', async ({
    client,
    assert,
  }) => {
    const user = await makeUser()
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: user.loginCode, password: AUTH_PASSWORD })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/panel')
  })

  test('kode tidak valid ditolak dan kembali ke halaman masuk', async ({ client, assert }) => {
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: 'TIDAKADA', password: AUTH_PASSWORD })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('password salah ditolak walau kodenya benar', async ({ client, assert }) => {
    const user = await makeUser()
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: user.loginCode, password: 'password-keliru' })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')

    await user.refresh()
    assert.isNull(user.lastLoginAt)
  })

  test('akun tanpa password tidak bisa masuk', async ({ client, assert }) => {
    const user = await makeUser({ loginCode: 'STANPAPASS', password: null })
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: user.loginCode, password: AUTH_PASSWORD })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('akun nonaktif tidak bisa masuk walau kode dan password benar', async ({
    client,
    assert,
  }) => {
    const user = await makeUser({ loginCode: 'SNONAKTIF', isActive: false })
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: user.loginCode, password: AUTH_PASSWORD })

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
      .form({ loginCode: 's2026002', password: AUTH_PASSWORD })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/panel')
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
      .form({ loginCode: 'A', password: AUTH_PASSWORD })

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
      .form({ loginCode: 'abc def!!', password: AUTH_PASSWORD })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('password terlalu pendek gagal validasi', async ({ client, assert }) => {
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .header('referer', '/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: 'S2026001', password: 'pendek' })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('password kosong tidak mengautentikasi', async ({ client, assert }) => {
    const user = await makeUser({ loginCode: 'S2026005' })
    await openSignin(client)

    const response = await client
      .post('/auth/signin')
      .header('referer', '/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: user.loginCode, password: '' })

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')

    await user.refresh()
    assert.isNull(user.lastLoginAt)
  })

  test('last_login_at diperbarui setelah masuk', async ({ client, assert }) => {
    const user = await makeUser({ loginCode: 'S2026003' })
    assert.notOk(user.lastLoginAt)
    await openSignin(client)

    await client
      .post('/auth/signin')
      .withCsrfToken()
      .redirects(0)
      .form({ loginCode: user.loginCode, password: AUTH_PASSWORD })

    await user.refresh()
    assert.ok(user.lastLoginAt)
  })

  test('POST tanpa CSRF token tidak mengautentikasi', async ({ client, assert }) => {
    const user = await makeUser({ loginCode: 'S2026004' })

    const response = await client
      .post('/auth/signin')
      .form({ loginCode: user.loginCode, password: AUTH_PASSWORD })

    assert.notEqual(response.headers().location, '/panel')
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
    const response = await client.get('/panel').redirects(0)

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('pengguna yang sudah masuk dapat membuka panel', async ({ client }) => {
    const user = await User.create({
      loginCode: 'S2026010',
      fullName: 'Siswa Masuk',
      role: 'siswa' as any,
      isActive: true,
      password: AUTH_PASSWORD,
    } as any)

    const response = await client.get('/panel').loginAs(user)

    response.assertStatus(200)
  })
})
