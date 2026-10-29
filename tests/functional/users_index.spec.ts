import { test } from '@japa/runner'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Users / index (logic)', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  async function seedUsers() {
    await User.create({
      loginCode: 'A00001',
      fullName: 'Admin Sismart',
      role: 'admin' as any,
      isActive: true,
    } as any)
    await User.create({
      loginCode: 'G00001',
      fullName: 'Budi Santoso',
      role: 'guru' as any,
      isActive: true,
    } as any)
    await User.create({
      loginCode: 'S2026001',
      fullName: 'Ayu Lestari',
      role: 'siswa' as any,
      isActive: false,
    } as any)
  }

  async function asAdmin() {
    return User.findByOrFail('loginCode', 'A00001')
  }

  test('pengguna belum masuk diarahkan ke halaman masuk', async ({ client, assert }) => {
    const response = await client.get('/pengguna').redirects(0)

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('pengguna masuk dapat membuka daftar pengguna', async ({ client }) => {
    await seedUsers()
    const admin = await asAdmin()

    const response = await client.get('/pengguna').loginAs(admin)

    response.assertStatus(200)
  })

  test('seluruh akun dikembalikan tanpa filter', async ({ client, assert }) => {
    await seedUsers()
    const admin = await asAdmin()

    const response = await client.get('/pengguna').withInertia().loginAs(admin)
    const body = response.inertiaProps as any

    response.assertStatus(200)
    assert.equal(body.meta.total, 3)
    assert.lengthOf(body.users, 3)
  })

  test('filter peran hanya mengembalikan peran tersebut', async ({ client, assert }) => {
    await seedUsers()
    const admin = await asAdmin()

    const response = await client.get('/pengguna').qs({ role: 'guru' }).withInertia().loginAs(admin)
    const body = response.inertiaProps as any

    assert.equal(body.meta.total, 1)
    assert.equal(body.users[0].role, 'guru')
  })

  test('pencarian nama menemukan satu akun', async ({ client, assert }) => {
    await seedUsers()
    const admin = await asAdmin()

    const response = await client.get('/pengguna').qs({ q: 'Ayu' }).withInertia().loginAs(admin)
    const body = response.inertiaProps as any

    assert.equal(body.meta.total, 1)
    assert.equal(body.users[0].loginCode, 'S2026001')
  })

  test('pencarian kode masuk juga bekerja', async ({ client, assert }) => {
    await seedUsers()
    const admin = await asAdmin()

    const response = await client.get('/pengguna').qs({ q: 'G00001' }).withInertia().loginAs(admin)
    const body = response.inertiaProps as any

    assert.equal(body.meta.total, 1)
    assert.equal(body.users[0].fullName, 'Budi Santoso')
  })

  test('filter peran tidak sah diabaikan, bukan error', async ({ client, assert }) => {
    await seedUsers()
    const admin = await asAdmin()

    const response = await client
      .get('/pengguna')
      .qs({ role: 'superadmin' })
      .withInertia()
      .loginAs(admin)
    const body = response.inertiaProps as any

    response.assertStatus(200)
    assert.equal(body.meta.total, 3)
  })

  test('label peran diterjemahkan ke bahasa Indonesia', async ({ client, assert }) => {
    await seedUsers()
    const admin = await asAdmin()

    const response = await client
      .get('/pengguna')
      .qs({ role: 'kepsek' })
      .withInertia()
      .loginAs(admin)
    const body = response.inertiaProps as any

    assert.isArray(body.roleOptions)
    const kepsek = body.roleOptions.find((o: any) => o.value === 'kepsek')
    assert.equal(kepsek?.label, 'Kepala sekolah')
  })
})

test.group('Dashboard / index (logic)', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('menghitung total akun dan akun aktif dari basis data', async ({ client, assert }) => {
    const admin = await User.create({
      loginCode: 'A00001',
      fullName: 'Admin',
      role: 'admin' as any,
      isActive: true,
    } as any)
    await User.create({
      loginCode: 'S00001',
      fullName: 'Siswa Nonaktif',
      role: 'siswa' as any,
      isActive: false,
    } as any)

    const response = await client.get('/dashboard').withInertia().loginAs(admin)
    const body = response.inertiaProps as any

    response.assertStatus(200)
    assert.equal(body.stats.total, 2)
    assert.equal(body.stats.active, 1)
  })

  test('sebaran peran memuat seluruh peran yang tersedia', async ({ client, assert }) => {
    const admin = await User.create({
      loginCode: 'A00001',
      fullName: 'Admin',
      role: 'admin' as any,
      isActive: true,
    } as any)

    const response = await client.get('/dashboard').withInertia().loginAs(admin)
    const body = response.inertiaProps as any

    assert.lengthOf(body.roleBreakdown, 6)
    const adminRow = body.roleBreakdown.find((r: any) => r.role === 'admin')
    assert.equal(adminRow?.total, 1)
  })

  test('akun terbaru dibatasi lima baris', async ({ client, assert }) => {
    const admin = await User.create({
      loginCode: 'A00001',
      fullName: 'Admin',
      role: 'admin' as any,
      isActive: true,
    } as any)

    for (let i = 0; i < 8; i++) {
      await User.create({
        loginCode: `S20260${10 + i}`,
        fullName: `Siswa ${i}`,
        role: 'siswa' as any,
        isActive: true,
      } as any)
    }

    const response = await client.get('/dashboard').withInertia().loginAs(admin)
    const body = response.inertiaProps as any

    assert.lengthOf(body.recentUsers, 5)
  })
})
