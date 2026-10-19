import { test } from '@japa/runner'
import Role from '#models/role'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { ROLES, type RoleName } from '#services/roles'
import { TestHttpClient } from '#tests/helpers/http_client'

const PASSWORD = 'secret123'
const SESSION_COOKIE = 'adonis-session'

async function createUser(kodeUnik: string, roleName: RoleName) {
  const role = await Role.findByOrFail('name', roleName)
  return User.create({
    kodeUnik,
    fullName: `User ${kodeUnik}`,
    password: PASSWORD,
    roleId: role.id,
    isActive: true,
  })
}

async function login(client: TestHttpClient, kodeUnik: string, password = PASSWORD) {
  await client.get('/login')
  return client.post('/login', { kodeUnik, password }, { referer: `${client.baseUrl}/login` })
}

/** Session id set on one response (last Set-Cookie for the name wins), or undefined. */
function sessionCookieFrom(response: Response): string | undefined {
  let value: string | undefined
  for (const raw of response.headers.getSetCookie()) {
    const [pair] = raw.split(';')
    const separator = pair.indexOf('=')
    if (pair.slice(0, separator).trim() === SESSION_COOKIE) {
      value = pair.slice(separator + 1).trim()
    }
  }
  return value
}

/**
 * The session cookie is a signed value (`s:<payload>.<signature>`); values that
 * fail unsigning are silently replaced by a fresh session, so a realistic
 * fixation attempt replays a cookie the attacker obtained legitimately.
 */
async function attackerSessionCookie(): Promise<string> {
  const attacker = new TestHttpClient()
  await attacker.get('/login')
  const cookie = attacker.getCookie(SESSION_COOKIE)
  if (!cookie) throw new Error('no session cookie was issued on the login page')
  return cookie
}

test.group('Session rotation on login', (group) => {
  group.setup(() => testUtils.db().migrate())
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('issues a new session id on a successful login', async ({ assert }) => {
    await createUser('S26101301', ROLES.siswa)

    const client = new TestHttpClient()
    await client.get('/login')
    const before = client.getCookie(SESSION_COOKIE)
    assert.isString(before, 'no session cookie is issued before login')

    const response = await client.post(
      '/login',
      { kodeUnik: 'S26101301', password: PASSWORD },
      { referer: `${client.baseUrl}/login` }
    )
    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/dashboard')

    const after = client.getCookie(SESSION_COOKIE)
    assert.isString(after, 'no session cookie after login')
    assert.notEqual(after, before, 'session id must rotate on login')
    assert.notEqual(sessionCookieFrom(response), before, 'login response must reissue the cookie')

    // The rotated session is the authenticated one.
    const dashboard = await client.get('/dashboard')
    assert.equal(dashboard.status, 200)

    console.log(`  [evidence] session cookie before login: ${before}`)
    console.log(`  [evidence] session cookie after login:  ${after}`)
  })

  test('the pre-login session id no longer authenticates after login', async ({ assert }) => {
    await createUser('S26101302', ROLES.siswa)

    const client = new TestHttpClient()
    await client.get('/login')
    const before = client.getCookie(SESSION_COOKIE)
    assert.isString(before, 'no session cookie is issued before login')

    const response = await login(client, 'S26101302')
    assert.include(response.headers.get('location') ?? '', '/dashboard')

    // Replay the captured pre-login cookie from a fresh client: it must be a guest.
    const replay = new TestHttpClient()
    const guest = await replay.get('/dashboard', { cookie: `${SESSION_COOKIE}=${before}` })
    assert.equal(guest.status, 302)
    assert.include(guest.headers.get('location') ?? '', '/login')

    // While the rotated cookie kept by the login client still works.
    const stillAuthed = await client.get('/dashboard')
    assert.equal(stillAuthed.status, 200)
  })

  test('a planted pre-login session id is replaced and never authenticates', async ({ assert }) => {
    await createUser('S26101303', ROLES.siswa)

    // Realistic fixation setup: the attacker signs up for a session of their
    // own and plants that valid cookie into the victim's browser. Both the
    // victim's GET and POST of the login form carry the planted cookie.
    const planted = await attackerSessionCookie()
    const victim = new TestHttpClient()

    const loginPage = await victim.get('/login', { cookie: `${SESSION_COOKIE}=${planted}` })
    assert.equal(loginPage.status, 200)
    assert.isString(victim.getCookie('XSRF-TOKEN'), 'no XSRF cookie issued on the login page')

    const response = await victim.post(
      '/login',
      { kodeUnik: 'S26101303', password: PASSWORD },
      { referer: `${victim.baseUrl}/login`, cookie: `${SESSION_COOKIE}=${planted}` }
    )
    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/dashboard')

    const issued = sessionCookieFrom(response)
    assert.isString(issued, 'login response did not reissue a session cookie')
    assert.notEqual(issued, planted, 'planted session id survived the login (fixation possible)')

    // The attacker replays their original cookie: it must no longer authenticate.
    const replay = new TestHttpClient()
    const guest = await replay.get('/dashboard', { cookie: `${SESSION_COOKIE}=${planted}` })
    assert.equal(guest.status, 302)
    assert.include(guest.headers.get('location') ?? '', '/login')

    console.log(`  [evidence] planted cookie:              ${planted}`)
    console.log(`  [evidence] cookie issued at login:      ${issued}`)
  })

  test('rotation still happens after a failed attempt in the same session', async ({ assert }) => {
    await createUser('S26101304', ROLES.siswa)

    const client = new TestHttpClient()
    await login(client, 'S26101304', 'wrong-password')

    const afterFailure = client.getCookie(SESSION_COOKIE)
    assert.isString(afterFailure)

    const response = await login(client, 'S26101304')
    assert.include(response.headers.get('location') ?? '', '/dashboard')

    const after = client.getCookie(SESSION_COOKIE)
    assert.isString(after)
    assert.notEqual(after, afterFailure, 'session id must rotate on the successful retry')

    const dashboard = await client.get('/dashboard')
    assert.equal(dashboard.status, 200)
  })

  test('a second login after logout rotates again', async ({ assert }) => {
    await createUser('S26101305', ROLES.siswa)

    const client = new TestHttpClient()
    const first = await login(client, 'S26101305')
    assert.include(first.headers.get('location') ?? '', '/dashboard')
    const firstSession = client.getCookie(SESSION_COOKIE)
    assert.isString(firstSession)

    const logout = await client.post('/logout', {}, { referer: `${client.baseUrl}/dashboard` })
    assert.equal(logout.status, 302)

    await client.get('/login')
    const beforeSecond = client.getCookie(SESSION_COOKIE)
    assert.isString(beforeSecond)

    const second = await login(client, 'S26101305')
    assert.include(second.headers.get('location') ?? '', '/dashboard')

    const secondSession = client.getCookie(SESSION_COOKIE)
    assert.isString(secondSession)
    assert.notEqual(secondSession, beforeSecond, 'second login must rotate the session id')
    assert.notEqual(secondSession, firstSession, 'second login must not reuse the first session id')

    const dashboard = await client.get('/dashboard')
    assert.equal(dashboard.status, 200)
  })

  test('concurrent logins of the same user get distinct rotated ids', async ({ assert }) => {
    await createUser('S26101306', ROLES.siswa)

    const first = new TestHttpClient()
    const second = new TestHttpClient()
    await Promise.all([first.get('/login'), second.get('/login')])

    const beforeFirst = first.getCookie(SESSION_COOKIE)
    const beforeSecond = second.getCookie(SESSION_COOKIE)
    assert.isString(beforeFirst)
    assert.isString(beforeSecond)

    const [firstResponse, secondResponse] = await Promise.all([
      login(first, 'S26101306'),
      login(second, 'S26101306'),
    ])
    assert.include(firstResponse.headers.get('location') ?? '', '/dashboard')
    assert.include(secondResponse.headers.get('location') ?? '', '/dashboard')

    const afterFirst = first.getCookie(SESSION_COOKIE)
    const afterSecond = second.getCookie(SESSION_COOKIE)
    assert.isString(afterFirst)
    assert.isString(afterSecond)
    assert.notEqual(afterFirst, beforeFirst, 'first concurrent login did not rotate')
    assert.notEqual(afterSecond, beforeSecond, 'second concurrent login did not rotate')
    assert.notEqual(afterFirst, afterSecond, 'concurrent logins collided on one session id')
  })

  test('a malformed pre-login session cookie is discarded, never authenticates', async ({
    assert,
  }) => {
    await createUser('S26101307', ROLES.siswa)

    // A tampered/undecodable cookie cannot verify its signature, so the server
    // must treat it as no session at all: issue a fresh valid one instead.
    const garbage = 'not-a-signed-cookie.tampered-value'
    const client = new TestHttpClient()

    const loginPage = await client.get('/login', { cookie: `${SESSION_COOKIE}=${garbage}` })
    assert.equal(loginPage.status, 200, 'a malformed session cookie must not break the login page')

    const fresh = client.getCookie(SESSION_COOKIE)
    assert.isString(fresh, 'no replacement session cookie issued')
    assert.notEqual(fresh, garbage, 'malformed cookie was accepted as the session id')

    // The normal jar (fresh cookie + XSRF pair) completes the login and rotates.
    const response = await login(client, 'S26101307')
    assert.equal(response.status, 302)
    assert.include(response.headers.get('location') ?? '', '/dashboard')

    const issued = client.getCookie(SESSION_COOKIE)
    assert.isString(issued)
    assert.notEqual(issued, fresh, 'login did not rotate the replacement session')

    // Replaying the malformed value is always a guest.
    const replay = new TestHttpClient()
    const guest = await replay.get('/dashboard', { cookie: `${SESSION_COOKIE}=${garbage}` })
    assert.equal(guest.status, 302)
    assert.include(guest.headers.get('location') ?? '', '/login')
  })
})
