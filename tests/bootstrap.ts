import { assert } from '@japa/assert'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { apiClient } from '@japa/api-client'
import { shieldApiClient } from '@adonisjs/shield/plugins/api_client'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { dbAssertions } from '@adonisjs/lucid/plugins/db'
import testUtils from '@adonisjs/core/services/test_utils'
import { browserClient } from '@japa/browser-client'
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import { authBrowserClient } from '@adonisjs/auth/plugins/browser_client'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
import { sessionBrowserClient } from '@adonisjs/session/plugins/browser_client'
import { inertiaApiClient } from '@adonisjs/inertia/plugins/api_client'

export const plugins: Config['plugins'] = [
  assert(),
  apiClient(),
  shieldApiClient(),
  sessionApiClient(app),
  authApiClient(app),
  inertiaApiClient(app),
  pluginAdonisJS(app),
  dbAssertions(app),
  browserClient({ runInSuites: ['browser'] }),
  sessionBrowserClient(app),
  authBrowserClient(app),
]

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    async () => {
      const truncate = await testUtils.db().truncate()
      await truncate()
    },
  ],
  teardown: [],
}

export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
