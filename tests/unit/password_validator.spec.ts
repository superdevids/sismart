import { test } from '@japa/runner'
import { PASSWORD_MIN_LENGTH, passwordValidator } from '#validators/password'

test.group('Password validator', () => {
  test('accepts the minimum length and rejects anything shorter', async ({ assert }) => {
    const accepted = await passwordValidator.validate({
      password: 'x'.repeat(PASSWORD_MIN_LENGTH),
    })
    assert.equal(accepted.password, 'x'.repeat(PASSWORD_MIN_LENGTH))

    await assert.rejects(() =>
      passwordValidator.validate({ password: 'x'.repeat(PASSWORD_MIN_LENGTH - 1) })
    )
  })
})
