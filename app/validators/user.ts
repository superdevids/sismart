import vine from '@vinejs/vine'
import { KODE_UNIK_PATTERN } from '#services/kode_unik'

/**
 * Validator to use before validating user credentials during login. The kode
 * unik format is checked up-front so malformed input never reaches the query.
 */
export const loginValidator = vine.create({
  kodeUnik: vine.string().trim().regex(KODE_UNIK_PATTERN),
  password: vine.string(),
})
