import { test } from '@japa/runner'
import { loginValidator } from '#validators/user'

test.group('Login validator', () => {
  test('accepts a well-formed kode unik and password', async ({ assert }) => {
    const payload = await loginValidator.validate({
      kodeUnik: 'S26101001  ',
      password: 'secret123',
    })

    assert.equal(payload.kodeUnik, 'S26101001')
  })

  test('rejects malformed kode unik values', async ({ assert }) => {
    for (const kodeUnik of ['not-a-code', 'X261001', 'K26100', 's26101001']) {
      await assert.rejects(() => loginValidator.validate({ kodeUnik, password: 'secret123' }))
    }
  })
})
