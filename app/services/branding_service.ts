import Setting from '#models/setting'

export const BRANDING_KEYS = {
  name: 'brand.name',
  shortName: 'brand.short_name',
  tagline: 'brand.tagline',
  institutionType: 'brand.institution_type',
  accreditation: 'brand.accreditation',
} as const

export const BRANDING_DEFAULTS = {
  name: 'SMKN 1 Indonesia',
  shortName: 'SMKN 1 Indonesia',
  tagline: 'Sistem informasi sekolah',
  institutionType: 'Sekolah',
  accreditation: 'Terakreditasi A',
} as const

export type Branding = {
  name: string
  shortName: string
  tagline: string
  institutionType: string
  accreditation: string
}

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
        accreditation: byKey.get(BRANDING_KEYS.accreditation) || BRANDING_DEFAULTS.accreditation,
      }
      this.loaded = true

      return this.cache
    } catch {
      return { ...BRANDING_DEFAULTS }
    }
  }

  async set(key: (typeof BRANDING_KEYS)[keyof typeof BRANDING_KEYS], value: string) {
    await Setting.updateOrCreate({ key }, { key, value })
    this.forget()
  }

  forget() {
    this.cache = null
    this.loaded = false
  }
}

const branding = new BrandingService()
export default branding
