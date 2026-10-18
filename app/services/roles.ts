/**
 * Roles recognised by the platform. Defined once so the migration that seeds
 * them, the authorization middleware and the bootstrap command cannot drift.
 */
export const ROLES = {
  admin: 'admin',
  kepalaSekolah: 'kepala_sekolah',
  guru: 'guru',
  staff: 'staff',
  siswa: 'siswa',
  wali: 'wali',
} as const

export type RoleName = (typeof ROLES)[keyof typeof ROLES]

/**
 * True when the given name is a role the platform recognises. Accounts without
 * a role, or holding a name that is no longer known, count as not yet activated.
 */
export function isKnownRoleName(name: string | null | undefined): boolean {
  return !!name && (Object.values(ROLES) as string[]).includes(name)
}

const ROLE_LABELS: Record<RoleName, string> = {
  [ROLES.admin]: 'Administrator',
  [ROLES.kepalaSekolah]: 'Kepala Sekolah',
  [ROLES.guru]: 'Guru',
  [ROLES.staff]: 'Staff',
  [ROLES.siswa]: 'Siswa',
  [ROLES.wali]: 'Wali Murid',
}

/**
 * Rows inserted while the `roles` table is created. The tuple is kept as plain
 * objects so the migration can pass it straight to `multiInsert`.
 */
export const ROLE_SEEDS = (Object.values(ROLES) as RoleName[]).map((name) => ({
  name,
  label: ROLE_LABELS[name],
}))
