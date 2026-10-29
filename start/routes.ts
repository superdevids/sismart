/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

/**
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
|
| Sismart signs every user in with a unique login code. The canonical
| sign-in page lives at `/auth/signin`; the legacy `/login` path redirects
| there so no second door exists.
|
*/
router
  .group(() => {
    router.get('auth/signin', [controllers.Session, 'create']).as('session.create')
    router.post('auth/signin', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

router.get('login', ({ response }) => response.redirect().toRoute('session.create'))

router
  .group(() => {
    router.on('/dashboard').renderInertia('dashboard', {}).as('dashboard')
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')
  })
  .use(middleware.auth())
