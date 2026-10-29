import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('auth/signin', [controllers.Session, 'create']).as('session.create')
    router.post('auth/signin', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

router.get('login', ({ response }) => response.redirect().toRoute('session.create'))

router
  .group(() => {
    router.get('/dashboard', [controllers.Dashboard, 'index']).as('dashboard')
    router.get('/pengguna', [controllers.Users, 'index']).as('users.index')
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')
  })
  .use(middleware.auth())
