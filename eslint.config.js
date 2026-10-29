import { configApp } from '@adonisjs/eslint-config'
import { react } from '@adonisjs/eslint-config/react'

export default [
  ...configApp(...react),
  {
    // Komponen shadcn/ui adalah kode vendored. Konvensi nama file (kebab-case),
    // penamaan variabel internal, dan pembayangan identifier di dalamnya berbeda
    // dari konvensi proyek ini. Menamainya ulang akan mematahkan `shadcn add`
    // di masa depan, jadi aturan gaya dikecualikan — aturan kebenaran tetap aktif.
    files: ['inertia/components/ui/**/*.tsx'],
    rules: {
      '@unicorn/filename-case': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-shadow': 'off',
    },
  },
]
