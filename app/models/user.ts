import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

export const USER_ROLES = ['siswa', 'orang_tua', 'guru', 'staff', 'kepsek', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]

export default class User extends compose(
  UserSchema,
  /**
   * Sismart authenticates by unique login code, so the auth finder looks the
   * user up by `loginCode`. The `password` column stays nullable and is only
   * used if a second factor is added later for sensitive roles.
   */
  withAuthFinder(hash, {
    uids: ['loginCode'],
    passwordColumnName: 'password',
  })
) {
  get initials() {
    const source = this.fullName ?? this.loginCode ?? ''
    const [first, last] = source.split(' ')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${(first ?? '').slice(0, 2)}`.toUpperCase()
  }

  get isAdmin() {
    return this.role === 'admin'
  }
}
