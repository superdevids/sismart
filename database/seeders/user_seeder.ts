import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

const DEMO_PASSWORD = 'pass1234'

const PEOPLE = [
  { loginCode: 'A00001', fullName: 'Admin Sismart', role: 'admin' },
  { loginCode: 'K00001', fullName: 'Dra. Siti Rahayu', role: 'kepsek' },
  { loginCode: 'G00001', fullName: 'Budi Santoso, S.Pd.', role: 'guru' },
  { loginCode: 'G00002', fullName: 'Rina Wulandari, S.Pd.', role: 'guru' },
  { loginCode: 'T00001', fullName: 'Agus Prasetyo', role: 'staff' },
  { loginCode: 'S2026001', fullName: 'Ayu Lestari', role: 'siswa' },
  { loginCode: 'S2026002', fullName: 'Bagas Pratama', role: 'siswa' },
  { loginCode: 'S2026003', fullName: 'Citra Dewi', role: 'siswa' },
  { loginCode: 'O2026001', fullName: 'Ibu Ayu Lestari', role: 'orang_tua' },
] as const

export default class extends BaseSeeder {
  async run() {
    for (const person of PEOPLE) {
      const existing = await User.findBy('loginCode', person.loginCode)

      if (existing) {
        existing.password = DEMO_PASSWORD
        await existing.save()
        continue
      }

      await User.create({
        fullName: person.fullName,
        loginCode: person.loginCode,
        role: person.role,
        isActive: true,
        password: DEMO_PASSWORD,
      })
    }
  }
}
