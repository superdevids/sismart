import vine from '@vinejs/vine'

/**
 * Validator for Sismart login.
 *
 * Sismart uses a single authentication path: every user signs in with a unique
 * login code. There is no email/password login.
 */
export const loginCodeValidator = vine.create({
  loginCode: vine
    .string()
    .trim()
    .minLength(4)
    .maxLength(32)
    .regex(/^[A-Za-z0-9-]+$/),
})
