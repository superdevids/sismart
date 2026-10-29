import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { router, usePage } from '@inertiajs/react'
import { type FormEvent, useState } from 'react'
import { Search, UserRound, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

type UserRow = {
  id: number
  fullName: string | null
  loginCode: string | null
  role: string
  roleLabel: string
  isActive: boolean
  lastLoginAt: string | null
}

type Meta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

type Props = {
  users: UserRow[]
  meta: Meta
  filters: { q: string; role: string }
  roleOptions: { value: string; label: string }[]
}

export default function UsersIndex() {
  const { users, meta, filters, roleOptions } = usePage<Props>().props
  const [q, setQ] = useState(filters.q)
  const [role, setRole] = useState(filters.role)

  const apply = (next: { q?: string; role?: string; page?: number }) => {
    router.get(
      '/pengguna',
      {
        q: next.q ?? q,
        role: next.role ?? role,
        page: next.page ?? 1,
      },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    apply({ page: 1 })
  }

  const reset = () => {
    setQ('')
    setRole('')
    router.get('/pengguna', {}, { preserveState: true, preserveScroll: true, replace: true })
  }

  const hasFilter = Boolean(filters.q || filters.role)

  return (
    <Page
      title="Data pengguna"
      description="Seluruh akun yang terdaftar di Sismart beserta ID Pengguna dan perannya."
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            Daftar akun
          </CardTitle>
          <CardDescription>
            {meta.total > 0
              ? `Menampilkan ${users.length} dari ${meta.total} akun.`
              : 'Belum ada akun yang cocok.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama atau ID Penggunaâ€¦"
                aria-label="Cari pengguna"
                className="pl-8"
              />
            </div>

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
                apply({ role: e.target.value, page: 1 })
              }}
              aria-label="Filter peran"
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              <option value="">Semua peran</option>
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <Button type="submit" size="sm" className="h-9">
              Cari
            </Button>
            {hasFilter && (
              <Button type="button" variant="ghost" size="sm" className="h-9" onClick={reset}>
                Reset
              </Button>
            )}
          </form>

          {users.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-14 text-center">
              <span className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                <UserRound className="size-5" />
              </span>
              <p className="text-sm font-medium text-foreground">Tidak ada pengguna</p>
              <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                {hasFilter
                  ? 'Tidak ada akun yang cocok dengan pencarian. Coba kata kunci lain atau reset filter.'
                  : 'Tambahkan pengguna lewat seeder atau modul administrasi.'}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Nama</TableHead>
                    <TableHead>ID Pengguna</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-4">Terakhir masuk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="pl-4 font-medium">{u.fullName ?? 'â€”'}</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                          {u.loginCode ?? 'â€”'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="muted">{u.roleLabel}</Badge>
                      </TableCell>
                      <TableCell>
                        {u.isActive ? (
                          <Badge variant="success">Aktif</Badge>
                        ) : (
                          <Badge variant="destructive">Nonaktif</Badge>
                        )}
                      </TableCell>
                      <TableCell className="pr-4 text-muted-foreground">
                        {u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Belum pernah'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {meta.lastPage > 1 && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Halaman {meta.currentPage} dari {meta.lastPage}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.currentPage <= 1}
                  onClick={() => apply({ page: meta.currentPage - 1 })}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.currentPage >= meta.lastPage}
                  onClick={() => apply({ page: meta.currentPage + 1 })}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Page>
  )
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'â€”'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

UsersIndex.layout = [AppLayout]
