import env from '#start/env'
import { test } from '@japa/runner'
import Role from '#models/role'
import User from '#models/user'
import ace from '@adonisjs/core/services/ace'
import db from '@adonisjs/lucid/services/db'
import testUtils from '@adonisjs/core/services/test_utils'
import { ROLES, type RoleName } from '#services/roles'
import { recordFailedAttempt } from '#services/login_attempts'
import { TestHttpClient } from '#tests/helpers/http_client'

const PASSWORD = 'secret123'
const INVALID_CREDENTIALS = 'Kode unik atau password salah.'

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

  test('answers an inactive account exactly like a wrong password', async ({ assert }) => {
    await createUser('S26101150', ROLES.siswa)
    await createUser('S26101151', ROLES.siswa, false)

    const wrongPassword = new TestHttpClient()
    await login(wrongPassword, 'S26101150', 'wrong-password')
    const wrongPasswordResponse = await wrongPassword.get('/login')
    const wrongPasswordPage = await wrongPasswordResponse.text()

    const inactive = new TestHttpClient()
    await login(inactive, 'S26101151')
    const inactiveResponse = await inactive.get('/login')
    const inactivePage = await inactiveResponse.text()

    assert.include(wrongPasswordPage, INVALID_CREDENTIALS)
    assert.include(inactivePage, INVALID_CREDENTIALS)
  })

  test('locks out after five failures, even when the credentials are valid', async ({ assert }) => {
    await createUser('S26101160', ROLES.siswa)

    const client = new TestHttpClient()
    for (let attempt = 0; attempt < 5; attempt++) {
      await login(client, 'S26101160', 'wrong-password')
    }

    const response = await login(client, 'S26101160')
    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/login')

    const dashboard = await client.get('/dashboard')
    assert.equal(dashboard.status, 302)
  })

  test('clears the failure counter after a successful login', async ({ assert }) => {
    await createUser('S26101161', ROLES.siswa)

    const first = new TestHttpClient()
    for (let attempt = 0; attempt < 4; attempt++) {
      await login(first, 'S26101161', 'wrong-password')
    }
    const success = await login(first, 'S26101161')
    assert.include(success.headers.get('location') ?? '', '/dashboard')

    const second = new TestHttpClient()
    for (let attempt = 0; attempt < 4; attempt++) {
      await login(second, 'S26101161', 'wrong-password')
    }
    const afterReset = await login(second, 'S26101161')
    assert.include(afterReset.headers.get('location') ?? '', '/dashboard')
  })

  test('keeps the throttle scoped to the kode unik it was triggered for', async ({ assert }) => {
    await createUser('S26101170', ROLES.siswa)
    await createUser('S26101171', ROLES.siswa)

    const client = new TestHttpClient()
    for (let attempt = 0; attempt < 5; attempt++) {
      await login(client, 'S26101170', 'wrong-password')
    }

    const other = await login(client, 'S26101171')
    assert.include(other.headers.get('location') ?? '', '/dashboard')
  })

  test('sends a user without a role to the activation page', async ({ assert }) => {
    await User.create({
      kodeUnik: 'S26101180',
      fullName: 'Tanpa Peran',
      password: PASSWORD,
      roleId: null,
      isActive: true,
    })

    const client = new TestHttpClient()
    const response = await login(client, 'S26101180')

    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/aktivasi-budget')

    const dashboard = await client.get('/dashboard')
    assert.equal(dashboard.status, 302)
    assert.include(dashboard.headers.get('location') ?? '', '/aktivasi-budget')

    const activation = await client.get('/aktivasi-budget')
    assert.equal(activation.status, 200)
  })

  test('sends a user with an unrecognised role to the activation page', async ({ assert }) => {
    const role = await Role.create({ name: 'peran_lama', label: 'Peran Lama' })
    await User.create({
      kodeUnik: 'S26101181',
      fullName: 'Peran Asing',
      password: PASSWORD,
      roleId: role.id,
      isActive: true,
    })

    const client = new TestHttpClient()
    const response = await login(client, 'S26101181')

    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/aktivasi-budget')
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

test.group('Login attempt throttling', (group) => {
  group.setup(() => testUtils.db().migrate())
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('records ten simultaneous failures for the same code without losing a count', async ({
    assert,
  }) => {
    const kodeUnik = 'S26101200'

    // Ten concurrent failures racing to insert the first row used to raise a
    // unique violation and lose increments; a single statement must keep them all.
    await Promise.all(Array.from({ length: 10 }, () => recordFailedAttempt(kodeUnik)))

    const row = await db.from('login_attempts').where('kode_unik', kodeUnik).first()
    assert.equal(Number(row?.failed_count), 10)
  })

  test('stays locked out when ten failures arrive in parallel', async ({ assert }) => {
    const kodeUnik = 'S26101201'
    await createUser(kodeUnik, ROLES.siswa)

    const clients = Array.from({ length: 10 }, () => new TestHttpClient())
    await Promise.all(clients.map((client) => client.get('/login')))

    const responses = await Promise.all(
      clients.map((client) =>
        client.post(
          '/login',
          { kodeUnik, password: 'wrong-password' },
          { referer: `${client.baseUrl}/login` }
        )
      )
    )

    // A unique violation on the insert would surface here as a 500.
    for (const response of responses) {
      assert.equal(response.status, 302)
      assert.include(response.headers.get('location') ?? '', '/login')
    }

    // The counter must not collapse towards zero and the throttle must still
    // refuse an otherwise valid sign-in.
    const row = await db.from('login_attempts').where('kode_unik', kodeUnik).first()
    assert.isTrue(Number(row?.failed_count) >= 5)

    const after = new TestHttpClient()
    const blocked = await login(after, kodeUnik)
    assert.equal(blocked.status, 302)
    assert.include(blocked.headers.get('location') ?? '', '/login')

    const dashboard = await after.get('/dashboard')
    assert.equal(dashboard.status, 302)
  })

  test('restarts the counter once the window has expired', async ({ assert }) => {
    const kodeUnik = 'S26101202'
    const staleWindow = Date.now() - 16 * 60 * 1000

    await db.table('login_attempts').insert({
      kode_unik: kodeUnik,
      failed_count: 5,
      window_started_at: staleWindow,
    })

    await recordFailedAttempt(kodeUnik)

    const row = await db.from('login_attempts').where('kode_unik', kodeUnik).first()
    assert.equal(Number(row?.failed_count), 1)
    assert.isAbove(Number(row?.window_started_at), staleWindow)
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
