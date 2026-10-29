import './css/app.css'
import { client } from './client'
import { createRoot } from 'react-dom/client'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react'

/**
 * Fallback document title used before an Inertia page sets its own. The
 * brand name itself comes from shared props on each page render.
 */
const appName = import.meta.env.VITE_APP_NAME || 'Sismart'

createInertiaApp({
  title: (title) => (title ? `${title} - Sismart` : appName),
  resolve: async (name) => {
    const page = await resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx')
    )
    return page.default
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <App {...props} />
      </TuyauProvider>
    )
  },
  progress: {
    // Ikut token design system, bukan nilai literal.
    color: 'var(--primary)',
  },
})
