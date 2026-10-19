import vine from '@vinejs/vine'

/**
 * Minimum password length agreed for every account the platform stores,
 * regardless of the path that creates or changes it (D14, P6). Kept in one
 * place so the bootstrap command, WV-7 user creation and any future
 * password-change flow enforce the same rule.
 */
export const PASSWORD_MIN_LENGTH = 8

/**
 * Central password validator. Create paths validate an object carrying the
 * `password` field; the bootstrap command validates the same rule directly.
 */
export const passwordValidator = vine.create({
  password: vine.string().minLength(PASSWORD_MIN_LENGTH),
})
