import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

export const USER_ROLES = ['siswa', 'orang_tua', 'guru', 'staff', 'kepsek', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]

export default class User extends compose(
  UserSchema,

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
