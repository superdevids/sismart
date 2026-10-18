import env from '#start/env'

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * Small cookie-aware HTTP client for functional tests. It keeps a cookie jar
 * per instance and replays the XSRF-TOKEN cookie as the `x-xsrf-token` header
 * on state-changing requests, mirroring what the Inertia React client does so
 * requests pass the shield CSRF guard.
 *
 * Redirects are not followed, so tests can assert the exact status code and
 * `Location` header of the response.
 */
export class TestHttpClient {
  readonly baseUrl = `http://${env.get('HOST')}:${env.get('PORT')}`
  #cookies = new Map<string, string>()

  #cookieHeader() {
    return [...this.#cookies].map(([name, value]) => `${name}=${value}`).join('; ')
  }

  #rememberCookies(response: Response) {
    for (const rawCookie of response.headers.getSetCookie()) {
      const [pair] = rawCookie.split(';')
      const separator = pair.indexOf('=')
      const name = pair.slice(0, separator).trim()
      const value = pair.slice(separator + 1).trim()

      if (!value) {
        this.#cookies.delete(name)
      } else {
        this.#cookies.set(name, value)
      }
    }
  }

  async request(
    method: string,
    path: string,
    body?: Record<string, string>,
    headers: Record<string, string> = {}
  ) {
    const requestHeaders: Record<string, string> = { accept: 'text/html', ...headers }

    const cookie = this.#cookieHeader()
    if (cookie && !('cookie' in requestHeaders)) requestHeaders.cookie = cookie

    // Callers may suppress the token by passing an explicit (empty) header.
    const csrfToken = this.#cookies.get('XSRF-TOKEN')
    if (csrfToken && UNSAFE_METHODS.has(method) && !('x-xsrf-token' in requestHeaders)) {
      requestHeaders['x-xsrf-token'] = csrfToken
    }

    let payload: string | undefined
    if (body) {
      requestHeaders['content-type'] = 'application/x-www-form-urlencoded'
      payload = new URLSearchParams(body).toString()
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: requestHeaders,
      body: payload,
      redirect: 'manual',
    })

    this.#rememberCookies(response)
    return response
  }

  get(path: string, headers?: Record<string, string>) {
    return this.request('GET', path, undefined, headers)
  }

  post(path: string, body?: Record<string, string>, headers?: Record<string, string>) {
    return this.request('POST', path, body, headers)
  }

  /**
   * Read the current value of a cookie held by the jar (test-only accessor,
   * used to assert session regeneration around login).
   */
  getCookie(name: string): string | undefined {
    return this.#cookies.get(name)
  }
}
