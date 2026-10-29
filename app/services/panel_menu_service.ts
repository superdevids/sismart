import type { UserRole } from '#models/user'

/**
 * Satu baris menu pada sidebar.
 *
 * `route` diisi nama route Adonis; `disabled` menandai modul yang belum
 * dibangun sehingga tampil tetapi tidak bisa diklik. Menu tidak pernah berisi
 * tautan mati: item tanpa route dan tanpa anak selalu nonaktif.
 */
export type PanelMenuItem = {
  label: string
  icon: string
  route?: string
  disabled?: boolean
  children?: { label: string; route?: string; disabled?: boolean }[]
}

/**
 * Menu ditentukan per peran di server, bukan di frontend.
 *
 * Prinsipnya fail-closed: peran yang tidak dikenal mendapat menu kosong,
 * sehingga tidak ada jalan pintas untuk melihat tautan yang bukan haknya.
 * Modul yang belum ada ditandai `disabled` agar tidak menghasilkan 404.
 */
const MENUS: Record<UserRole, PanelMenuItem[]> = {
  admin: [
    { label: 'Dashboard', icon: 'layout-dashboard', route: 'panel' },
    {
      label: 'Administrasi',
      icon: 'settings-2',
      children: [{ label: 'Data pengguna', route: 'users.index' }],
    },
    { label: 'SIAKAD', icon: 'graduation-cap', disabled: true },
    { label: 'Keuangan', icon: 'wallet', disabled: true },
    { label: 'Operasional', icon: 'calendar-check', disabled: true },
  ],
  kepsek: [
    { label: 'Dashboard', icon: 'layout-dashboard', route: 'panel' },
    { label: 'SIAKAD', icon: 'graduation-cap', disabled: true },
    { label: 'Keuangan', icon: 'wallet', disabled: true },
    { label: 'Laporan', icon: 'file-chart-column', disabled: true },
  ],
  guru: [
    { label: 'Dashboard', icon: 'layout-dashboard', route: 'panel' },
    { label: 'SIAKAD', icon: 'graduation-cap', disabled: true },
    { label: 'Pembelajaran', icon: 'book-open', disabled: true },
    { label: 'Penilaian', icon: 'clipboard-list', disabled: true },
  ],
  staff: [
    { label: 'Dashboard', icon: 'layout-dashboard', route: 'panel' },
    { label: 'Operasional', icon: 'calendar-check', disabled: true },
    { label: 'Keuangan', icon: 'wallet', disabled: true },
  ],
  siswa: [
    { label: 'Dashboard', icon: 'layout-dashboard', route: 'panel' },
    { label: 'Nilai', icon: 'clipboard-list', disabled: true },
    { label: 'Jadwal', icon: 'calendar-days', disabled: true },
    { label: 'Pembelajaran', icon: 'book-open', disabled: true },
  ],
  orang_tua: [
    { label: 'Dashboard', icon: 'layout-dashboard', route: 'panel' },
    { label: 'Anak saya', icon: 'users-round', disabled: true },
    { label: 'Keuangan', icon: 'wallet', disabled: true },
    { label: 'Jadwal', icon: 'calendar-days', disabled: true },
  ],
}

export function menuForRole(role: string | null | undefined): PanelMenuItem[] {
  if (!role) return []
  return MENUS[role as UserRole] ?? []
}
