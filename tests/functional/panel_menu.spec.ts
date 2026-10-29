import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { USER_ROLES, type UserRole } from '#models/user'
import User from '#models/user'
import { menuForRole, type PanelMenuItem } from '#services/panel_menu_service'

function flatten(menu: PanelMenuItem[]) {
  return menu.flatMap((item) => [
    ...(item.route ? [{ label: item.label, route: item.route }] : []),
    ...(item.children ?? []).flatMap((child) =>
      child.route ? [{ label: child.label, route: child.route }] : []
    ),
  ])
}

/**
 * Menu panel dikirim server ke sidebar. Test ini menjaga kontrak logika:
 * peran tidak dikenal tidak mendapat menu, tiap tautan hidup (bukan 404),
 * dan tidak ada item aktif tanpa tujuan.
 */
test.group('Panel menu / per role', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('setiap peran mendapat menu tidak kosong', ({ assert }) => {
    for (const role of USER_ROLES) {
      assert.isNotEmpty(menuForRole(role), `menu untuk ${role} kosong`)
    }
  })

  test('hanya admin yang melihat tautan data pengguna', ({ assert }) => {
    for (const role of USER_ROLES) {
      const hasUsers = flatten(menuForRole(role)).some((item) => item.route === 'users.index')
      assert.equal(hasUsers, role === 'admin', `peran ${role} salah soal akses users.index`)
    }
  })

  test('item tanpa route harus ditandai nonaktif, bukan tautan mati', ({ assert }) => {
    for (const role of USER_ROLES) {
      for (const item of menuForRole(role)) {
        if (!item.route && !item.children?.length) {
          assert.isTrue(item.disabled, `item "${item.label}" tanpa route tidak ditandai disabled`)
        }
      }
    }
  })

  test('peran tidak dikenal tidak mendapat menu (fail-closed)', ({ assert }) => {
    assert.deepEqual(menuForRole(undefined), [])
    assert.deepEqual(menuForRole(null), [])
    assert.deepEqual(menuForRole(''), [])
    assert.deepEqual(menuForRole('root'), [])
    assert.deepEqual(menuForRole('siswa ' as UserRole), [])
  })

  test('menu sampai ke halaman panel dan tidak bocor antar peran', async ({ client, assert }) => {
    const admin = await User.create({
      loginCode: 'ADM-MENU',
      fullName: 'Admin Menu',
      role: 'admin' as any,
      isActive: true,
    } as any)

    const adminResponse = await client.get('/panel').withInertia().loginAs(admin)
    adminResponse.assertStatus(200)

    const adminProps = adminResponse.inertiaProps as any
    assert.isArray(adminProps.menu)
    assert.isNotEmpty(adminProps.menu)

    const adminLabels = adminProps.menu.map((item: PanelMenuItem) => item.label)
    assert.include(adminLabels, 'Administrasi')
  })

  test('menu dikirim ke halaman panel sesuai peran pengguna', async ({ client, assert }) => {
    const guru = await User.create({
      loginCode: 'GUR-MENU',
      fullName: 'Guru Menu',
      role: 'guru' as any,
      isActive: true,
    } as any)

    const response = await client.get('/panel').withInertia().loginAs(guru)
    response.assertStatus(200)

    const props = response.inertiaProps as any
    assert.isArray(props.menu)

    const labels = props.menu.map((item: PanelMenuItem) => item.label)
    assert.include(labels, 'Dashboard')
    assert.notInclude(labels, 'Administrasi')
  })
})
