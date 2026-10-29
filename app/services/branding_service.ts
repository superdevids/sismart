import Setting from '#models/setting'

/**
 * Settings keys that belong to branding. Changing a value here (or in the
 * `settings` table) is all the admin needs to rebrand the product; no code
 * change, no deploy.
 */
export const BRANDING_KEYS = {
  name: 'brand.name',
  shortName: 'brand.short_name',
  tagline: 'brand.tagline',
  institutionType: 'brand.institution_type',
} as const

/**
 * The brand shown when nothing has been configured yet. Keys default to these
 * values so the app always renders a sensible name.
 */
export const BRANDING_DEFAULTS = {
  name: 'SMKN 1 Indonesia',
  shortName: 'SMKN 1 Indonesia',
  tagline: 'Sistem informasi sekolah',
  institutionType: 'Sekolah',
} as const

export type Branding = {
  name: string
  shortName: string
  tagline: string
  institutionType: string
}

/**
 * Reads branding from the settings store.
 *
 * The whole table is small, so it is loaded once per process call and cached;
 * call `forget()` after an admin updates a setting so the next read is fresh.
 */
class BrandingService {
  private cache: Branding | null = null
  private loaded = false

  async all(): Promise<Branding> {
    if (this.loaded && this.cache) {
      return this.cache
    }

    try {
      const rows = await Setting.query().whereIn('key', Object.values(BRANDING_KEYS))
      const byKey = new Map(rows.map((row) => [row.key, row.value]))

      this.cache = {
        name: byKey.get(BRANDING_KEYS.name) || BRANDING_DEFAULTS.name,
        shortName: byKey.get(BRANDING_KEYS.shortName) || BRANDING_DEFAULTS.shortName,
        tagline: byKey.get(BRANDING_KEYS.tagline) || BRANDING_DEFAULTS.tagline,
        institutionType:
          byKey.get(BRANDING_KEYS.institutionType) || BRANDING_DEFAULTS.institutionType,
      }
      this.loaded = true

      return this.cache
    } catch {
      /**
       * The settings table may not exist yet (fresh checkout before
       * `migration:run`) or the database may be unreachable. Branding must
       * never be the reason a page fails to render, so fall back to defaults
       * without caching the failure.
       */
      return { ...BRANDING_DEFAULTS }
    }
  }

  /**
   * Persist a single branding value. Empty strings are stored as-is so an
   * admin can intentionally blank a field; the reader falls back to defaults.
   */
  async set(key: (typeof BRANDING_KEYS)[keyof typeof BRANDING_KEYS], value: string) {
    await Setting.updateOrCreate({ key }, { key, value })
    this.forget()
  }

  /**
   * Drop the in-memory cache so the next `all()` re-reads the store.
   */
  forget() {
    this.cache = null
    this.loaded = false
  }
}

const branding = new BrandingService()
export default branding
