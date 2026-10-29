import Setting from '#models/setting'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { BRANDING_DEFAULTS, BRANDING_KEYS } from '#services/branding_service'

/**
 * Seeds the editable branding defaults. Runs with `node ace db:seed`.
 *
 * Uses `updateOrCreate` so re-running never overwrites values the admin has
 * already customised… except on a fresh database, where it sets the defaults.
 */
export default class extends BaseSeeder {
  async run() {
    const defaults: Array<[string, string]> = [
      [BRANDING_KEYS.name, BRANDING_DEFAULTS.name],
      [BRANDING_KEYS.shortName, BRANDING_DEFAULTS.shortName],
      [BRANDING_KEYS.tagline, BRANDING_DEFAULTS.tagline],
      [BRANDING_KEYS.institutionType, BRANDING_DEFAULTS.institutionType],
    ]

    for (const [key, value] of defaults) {
      const existing = await Setting.findBy('key', key)
      if (!existing) {
        await Setting.create({ key, value })
      }
    }
  }
}
