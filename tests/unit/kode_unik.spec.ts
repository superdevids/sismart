import { test } from '@japa/runner'
import { isValidKodeUnik } from '#services/kode_unik'

test.group('Kode unik format', () => {
  test('accepts student codes (S + year + program + gender + sequence)', ({ assert }) => {
    assert.isTrue(isValidKodeUnik('S26101001'))
    assert.isTrue(isValidKodeUnik('S26100099'))
    assert.isTrue(isValidKodeUnik('S27011999'))
  })

  test('accepts employee codes (K + year + gender + sequence)', ({ assert }) => {
    assert.isTrue(isValidKodeUnik('K261001'))
    assert.isTrue(isValidKodeUnik('K261000'))
    assert.isTrue(isValidKodeUnik('K270999'))
  })

  test('rejects values that do not match the format', ({ assert }) => {
    const invalid = [
      '',
      'S26101001 ',
      's26101001',
      'X261001',
      'S2610',
      'S2610100',
      'S261010000',
      'S26102001',
      'K26100',
      'K2610001',
      'K279999',
      'admin',
    ]

    for (const value of invalid) {
      assert.isFalse(isValidKodeUnik(value))
    }
  })
})
