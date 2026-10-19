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
import { ROLES } from '#services/roles'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

// Halaman publik situs sekolah. Semua dapat diakses tanpa login.
router.on('/profil').renderInertia('publik/profil', {}).as('publik.profil')
router.on('/jurusan').renderInertia('publik/jurusan', {}).as('publik.jurusan')
router.on('/fasilitas').renderInertia('publik/fasilitas', {}).as('publik.fasilitas')
router.on('/ekskul').renderInertia('publik/ekskul', {}).as('publik.ekskul')
router.on('/berita').renderInertia('publik/berita', {}).as('publik.berita')
router.on('/ppdb').renderInertia('publik/ppdb', {}).as('publik.ppdb')
router.on('/kontak').renderInertia('publik/kontak', {}).as('publik.kontak')

router
  .group(() => {
    router.get('login', [controllers.Session, 'create']).as('session.create')
    router.post('login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

// Reachable by any authenticated user: it is where the role gate sends
// accounts without a role, and they must still be able to log out.
router
  .group(() => {
    router.on('/aktivasi-budget').renderInertia('aktivasi_budget', {}).as('activation')
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.on('/dashboard').renderInertia('dashboard', {}).as('dashboard')
  })
  .use([middleware.auth(), middleware.roleActivated()])

router
  .group(() => {
    router.on('/admin').renderInertia('admin', {}).as('admin')
  })
  .use([middleware.auth(), middleware.roleActivated(), middleware.role([ROLES.admin])])
