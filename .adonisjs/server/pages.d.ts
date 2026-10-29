import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/signin': ExtractProps<(typeof import('../../inertia/pages/auth/signin.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'panel/admin': ExtractProps<(typeof import('../../inertia/pages/panel/admin.tsx'))['default']>
    'panel/guru': ExtractProps<(typeof import('../../inertia/pages/panel/guru.tsx'))['default']>
    'panel/kepsek': ExtractProps<(typeof import('../../inertia/pages/panel/kepsek.tsx'))['default']>
    'panel/orang_tua': ExtractProps<(typeof import('../../inertia/pages/panel/orang_tua.tsx'))['default']>
    'panel/siswa': ExtractProps<(typeof import('../../inertia/pages/panel/siswa.tsx'))['default']>
    'panel/staff': ExtractProps<(typeof import('../../inertia/pages/panel/staff.tsx'))['default']>
    'users/index': ExtractProps<(typeof import('../../inertia/pages/users/index.tsx'))['default']>
  }
}
