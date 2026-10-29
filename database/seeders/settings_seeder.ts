import Setting from '#models/setting'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { BRANDING_DEFAULTS, BRANDING_KEYS } from '#services/branding_service'

export default class extends BaseSeeder {
  async run() {
    const defaults: Array<[string, string]> = [
      [BRANDING_KEYS.name, BRANDING_DEFAULTS.name],
      [BRANDING_KEYS.shortName, BRANDING_DEFAULTS.shortName],
      [BRANDING_KEYS.tagline, BRANDING_DEFAULTS.tagline],
      [BRANDING_KEYS.institutionType, BRANDING_DEFAULTS.institutionType],
      [BRANDING_KEYS.accreditation, BRANDING_DEFAULTS.accreditation],
    ]

    for (const [key, value] of defaults) {
      const existing = await Setting.findBy('key', key)
      if (!existing) {
        await Setting.create({ key, value })
      }
    }
  }
}
