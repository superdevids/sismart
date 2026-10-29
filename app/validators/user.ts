import vine from '@vinejs/vine'

export const loginCodeValidator = vine.create({
  loginCode: vine
    .string()
    .trim()
    .minLength(4)
    .maxLength(32)
    .regex(/^[A-Za-z0-9-]+$/),
  password: vine.string().minLength(8).maxLength(64),
})
