import Role from '#models/role'
import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

export default class User extends compose(
  UserSchema,
  // Pass a lazy hash factory: the hash service is only assigned once the app
  // has booted, and this model may be imported earlier (for example while Ace
  // discovers commands).
  withAuthFinder(() => hash.use(), { uids: ['kode_unik'] })
) {
  @belongsTo(() => Role, { foreignKey: 'roleId' })
  declare role: BelongsTo<typeof Role>

  get initials() {
    const name = this.fullName ?? this.kodeUnik
    const [first, last] = name.split(' ')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }

  /**
   * True when the loaded role name is one of the given roles. The role relation
   * must be loaded first (the role middleware does it).
   */
  hasRole(...names: string[]) {
    return this.role ? names.includes(this.role.name) : false
  }
}
