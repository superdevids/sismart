import env from '#start/env'
import { test } from '@japa/runner'
import Role from '#models/role'
import User from '#models/user'
import ace from '@adonisjs/core/services/ace'
import testUtils from '@adonisjs/core/services/test_utils'
import { ROLES, type RoleName } from '#services/roles'
import { TestHttpClient } from '#tests/helpers/http_client'

const PASSWORD = 'secret123'

async function createUser(kodeUnik: string, roleName: RoleName, isActive = true) {
  const role = await Role.findByOrFail('name', roleName)
  return User.create({
    kodeUnik,
    fullName: `User ${kodeUnik}`,
    password: PASSWORD,
    roleId: role.id,
    isActive,
  })
}

async function login(client: TestHttpClient, kodeUnik: string, password = PASSWORD) {
  await client.get('/login')
  return client.post('/login', { kodeUnik, password }, { referer: `${client.baseUrl}/login` })
}

test.group('Authentication', (group) => {
  group.setup(() => testUtils.db().migrate())
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('logs in with valid credentials and reaches the dashboard', async ({ assert }) => {
    await createUser('S26101123', ROLES.siswa)

    const client = new TestHttpClient()
    const response = await login(client, 'S26101123')

    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/dashboard')

    const dashboard = await client.get('/dashboard')
    assert.equal(dashboard.status, 200)
  })

  test('rejects wrong credentials without creating a session', async ({ assert }) => {
    await createUser('S26101124', ROLES.siswa)

    const client = new TestHttpClient()
    const response = await login(client, 'S26101124', 'wrong-password')

    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/login')

    const dashboard = await client.get('/dashboard')
    assert.equal(dashboard.status, 302)
    assert.include(dashboard.headers.get('location') ?? '', '/login')
  })

  test('does not authenticate an inactive account', async ({ assert }) => {
    await createUser('S26101127', ROLES.siswa, false)

    const client = new TestHttpClient()
    const response = await login(client, 'S26101127')

    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/login')

    const dashboard = await client.get('/dashboard')
    assert.equal(dashboard.status, 302)
  })

  test('rejects a kode unik that does not match the required format', async ({ assert }) => {
    const client = new TestHttpClient()
    await client.get('/login')

    const response = await client.post(
      '/login',
      { kodeUnik: 'not-a-code', password: PASSWORD },
      { referer: `${client.baseUrl}/login` }
    )

    // Format failures are rejected by the validator before touching the store.
    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/login')
  })

  test('redirects guests away from protected routes', async ({ assert }) => {
    const client = new TestHttpClient()
    const response = await client.get('/dashboard')

    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/login')
  })

  test('clears the session on logout', async ({ assert }) => {
    await createUser('S26101125', ROLES.guru)

    const client = new TestHttpClient()
    await login(client, 'S26101125')

    const logout = await client.post('/logout', {}, { referer: `${client.baseUrl}/dashboard` })
    assert.equal(logout.status, 302)

    const dashboard = await client.get('/dashboard')
    assert.equal(dashboard.status, 302)
    assert.include(dashboard.headers.get('location') ?? '', '/login')
  })

  test('denies a logged-in user whose role is not allowed on the route', async ({ assert }) => {
    await createUser('S26101126', ROLES.siswa)

    const client = new TestHttpClient()
    await login(client, 'S26101126')

    const response = await client.get('/admin')
    assert.equal(response.status, 403)
  })

  test('allows the admin role on the admin route', async ({ assert }) => {
    await createUser('K261001', ROLES.admin)

    const client = new TestHttpClient()
    await login(client, 'K261001')

    const response = await client.get('/admin')
    assert.equal(response.status, 200)
  })

  test('rejects state-changing requests without a valid CSRF token', async ({ assert }) => {
    const client = new TestHttpClient()
    await client.get('/login')

    const response = await client.request(
      'POST',
      '/login',
      { kodeUnik: 'S26101123', password: PASSWORD },
      { 'referer': `${client.baseUrl}/login`, 'x-xsrf-token': '' }
    )

    // Shield's default browser behaviour: flash an error and redirect back
    // (HTTP 302), never a 200 that would look like a successful request.
    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/login')
  })
})

test.group('Admin bootstrap command', (group) => {
  group.setup(() => testUtils.db().migrate())
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('creates an admin with a hashed password from env variables', async ({ assert }) => {
    const kodeUnik = env.get('ADMIN_KODE_UNIK')!
    const password = env.get('ADMIN_PASSWORD')!

    const result = await ace.exec('admin:create', [])
    assert.equal(result.exitCode, 0)

    const user = await User.findByOrFail('kode_unik', kodeUnik)
    const role = await Role.findOrFail(user.roleId!)

    assert.equal(role.name, ROLES.admin)
    assert.notEqual(user.password, password)
    assert.isTrue(await user.verifyPassword(password))
  })
})
