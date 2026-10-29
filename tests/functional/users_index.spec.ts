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

  test('pencarian ID Pengguna juga bekerja', async ({ client, assert }) => {
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

test.group('Panel / per role (logic)', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  const ROLES = ['siswa', 'orang_tua', 'guru', 'staff', 'kepsek', 'admin'] as const

  const COMPONENTS: Record<string, string> = {
    siswa: 'panel/siswa',
    orang_tua: 'panel/orang_tua',
    guru: 'panel/guru',
    staff: 'panel/staff',
    kepsek: 'panel/kepsek',
    admin: 'panel/admin',
  }

  for (const role of ROLES) {
    test(`peran ${role} mendapat komponen panel ${COMPONENTS[role]}`, async ({
      client,
      assert,
    }) => {
      const user = await User.create({
        loginCode: `USER-${role}`,
        fullName: `Pengguna ${role}`,
        role: role as any,
        isActive: true,
      } as any)

      const response = await client.get('/panel').withInertia().loginAs(user)
      const body = response.inertiaProps as any

      response.assertStatus(200)
      response.assertInertiaComponent(COMPONENTS[role])
      assert.equal(body.profile.role, role)
      assert.equal(body.profile.loginCode, `USER-${role}`)
    })
  }

  test('semua peran memakai URL yang sama', async ({ client, assert }) => {
    for (const role of ROLES) {
      const user = await User.create({
        loginCode: `URL-${role}`,
        fullName: `Pengguna ${role}`,
        role: role as any,
        isActive: true,
      } as any)

      const response = await client.get('/panel').withInertia().loginAs(user)
      assert.equal(response.status(), 200)
      assert.equal(response.inertiaComponent, COMPONENTS[role])
    }
  })

  test('pengguna belum masuk dialihkan dari /panel', async ({ client, assert }) => {
    const response = await client.get('/panel').redirects(0)

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/auth/signin')
  })

  test('/dashboard lama dialihkan ke /panel', async ({ client, assert }) => {
    const response = await client.get('/dashboard').redirects(0)

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/panel')
  })

  test('panel tidak lagi mengirim statistik agregat ke peran mana pun', async ({
    client,
    assert,
  }) => {
    const admin = await User.create({
      loginCode: 'ADM-STAT',
      fullName: 'Admin',
      role: 'admin' as any,
      isActive: true,
    } as any)
    await User.create({
      loginCode: 'SIS-STAT',
      fullName: 'Siswa',
      role: 'siswa' as any,
      isActive: false,
    } as any)

    const response = await client.get('/panel').withInertia().loginAs(admin)
    const body = response.inertiaProps as any

    // Panel sengaja dikosongkan: props agregat tidak boleh dikirim lagi.
    assert.notProperty(body, 'stats')
    assert.notProperty(body, 'roleBreakdown')
    assert.notProperty(body, 'recentUsers')
    assert.notProperty(body, 'trend')
  })

  test('kepsek juga tidak menerima statistik agregat', async ({ client, assert }) => {
    const kepsek = await User.create({
      loginCode: 'KEP-STAT',
      fullName: 'Kepsek',
      role: 'kepsek' as any,
      isActive: true,
    } as any)
    await User.create({
      loginCode: 'GUR-STAT',
      fullName: 'Guru',
      role: 'guru' as any,
      isActive: true,
    } as any)

    const response = await client.get('/panel').withInertia().loginAs(kepsek)
    const body = response.inertiaProps as any

    assert.notProperty(body, 'stats')
    assert.notProperty(body, 'trend')
  })

  test('guru tidak menerima data akun terbaru', async ({ client, assert }) => {
    const guru = await User.create({
      loginCode: 'GUR-ONLY',
      fullName: 'Guru',
      role: 'guru' as any,
      isActive: true,
    } as any)

    const response = await client.get('/panel').withInertia().loginAs(guru)
    const body = response.inertiaProps as any

    assert.notProperty(body, 'recentUsers')
    assert.notProperty(body, 'roleBreakdown')
  })

  test('siswa dan orang tua hanya menerima profil, tanpa statistik', async ({ client, assert }) => {
    for (const role of ['siswa', 'orang_tua'] as const) {
      const user = await User.create({
        loginCode: `MIN-${role}`,
        fullName: `Pengguna ${role}`,
        role: role as any,
        isActive: true,
      } as any)

      const response = await client.get('/panel').withInertia().loginAs(user)
      const body = response.inertiaProps as any

      assert.notProperty(body, 'stats')
      assert.property(body, 'profile')
    }
  })
})

test.group('Users / akses peran (logic)', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('non-admin dialihkan dari daftar pengguna', async ({ client, assert }) => {
    const guru = await User.create({
      loginCode: 'GUR-NOACCESS',
      fullName: 'Guru',
      role: 'guru' as any,
      isActive: true,
    } as any)

    const response = await client.get('/pengguna').redirects(0).loginAs(guru)

    response.assertStatus(302)
    assert.equal(response.headers()['location'], '/panel')
  })

  test('admin tetap dapat membuka daftar pengguna', async ({ client }) => {
    const admin = await User.create({
      loginCode: 'ADM-OK',
      fullName: 'Admin',
      role: 'admin' as any,
      isActive: true,
    } as any)

    const response = await client.get('/pengguna').loginAs(admin)

    response.assertStatus(200)
  })
})
