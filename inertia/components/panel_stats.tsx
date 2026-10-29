import { type ReactNode } from 'react'
import {
  Baby,
  BookOpen,
  Briefcase,
  CheckCircle2,
  CircleDashed,
  GraduationCap,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { cn } from '~/lib/utils'

export type Role = 'siswa' | 'orang_tua' | 'guru' | 'staff' | 'kepsek' | 'admin'

type RoleTone = {
  label: string
  greeting: string
  icon: LucideIcon
  tone: string
  ring: string
  bar: string
}

export const ROLE_META: Record<Role, RoleTone> = {
  admin: {
    label: 'Admin',
    greeting: 'Selamat datang kembali',
    icon: ShieldCheck,
    tone: 'bg-primary text-primary-foreground',
    ring: 'ring-primary/25',
    bar: 'bg-primary',
  },
  kepsek: {
    label: 'Kepala sekolah',
    greeting: 'Selamat datang kembali',
    icon: Briefcase,
    tone: 'bg-info text-info-foreground',
    ring: 'ring-info/25',
    bar: 'bg-info',
  },
  guru: {
    label: 'Guru',
    greeting: 'Selamat mengajar',
    icon: BookOpen,
    tone: 'bg-secondary text-secondary-foreground',
    ring: 'ring-secondary/25',
    bar: 'bg-secondary',
  },
  staff: {
    label: 'Staff',
    greeting: 'Selamat bertugas',
    icon: Users,
    tone: 'bg-warning text-warning-foreground',
    ring: 'ring-warning/25',
    bar: 'bg-warning',
  },
  siswa: {
    label: 'Siswa',
    greeting: 'Semangat belajar',
    icon: GraduationCap,
    tone: 'bg-accent text-accent-foreground',
    ring: 'ring-accent/30',
    bar: 'bg-accent',
  },
  orang_tua: {
    label: 'Orang tua',
    greeting: 'Terima kasih telah mendampingi',
    icon: Baby,
    tone: 'bg-success text-success-foreground',
    ring: 'ring-success/25',
    bar: 'bg-success',
  },
}

export function roleLabel(role: string | null | undefined): string {
  if (!role) return '—'
  return ROLE_META[role as Role]?.label ?? role
}

export function HeroPanel({
  role,
  fullName,
  loginCode,
  summary,
  aside,
}: {
  role: Role
  fullName: string | null
  loginCode: string | null
  summary: string
  aside?: ReactNode
}) {
  const meta = ROLE_META[role]
  const Icon = meta.icon
  const initials = toInitials(fullName, loginCode)

  return (
    <section className="panel-glow relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            className={cn(
              'grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-bold ring-4',
              meta.tone,
              meta.ring
            )}
            aria-hidden="true"
          >
            {initials}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm text-muted-foreground">{meta.greeting}</p>
            <h2 className="truncate text-xl font-bold tracking-tight text-foreground xl:text-2xl">
              {fullName ?? 'Pengguna'}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  meta.tone
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {meta.label}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                {loginCode ?? '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4 xl:max-w-sm xl:border-t-0 xl:pt-0 xl:text-right">
          <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
          {aside}
        </div>
      </div>
    </section>
  )
}

export function MetricGrid({
  children,
  columns = 3,
}: {
  children: ReactNode
  columns?: 2 | 3 | 4
}) {
  const cols: Record<number, string> = {
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
  }

  return <div className={cn('grid gap-3 sm:grid-cols-2', cols[columns])}>{children}</div>
}

export function Metric({
  icon,
  value,
  label,
  hint,
  tone = 'default',
  progress,
}: {
  icon: ReactNode
  value: string
  label: string
  hint: string
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  progress?: number
}) {
  const tones: Record<string, { box: string; bar: string }> = {
    default: { box: 'bg-muted text-muted-foreground', bar: 'bg-muted-foreground' },
    primary: { box: 'bg-primary-soft text-primary-ink', bar: 'bg-primary' },
    success: { box: 'bg-success-soft text-success', bar: 'bg-success' },
    warning: { box: 'bg-warning-soft text-warning', bar: 'bg-warning' },
    danger: { box: 'bg-destructive-soft text-destructive-ink', bar: 'bg-destructive' },
    info: { box: 'bg-info-soft text-info', bar: 'bg-info' },
  }
  const palette = tones[tone]

  return (
    <Card size="sm" className="shadow-none transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn('grid size-10 shrink-0 place-items-center rounded-lg', palette.box)}
            aria-hidden="true"
          >
            {icon}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-2xl font-bold leading-none tabular-nums text-foreground">
              {value}
            </span>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
        </div>
        {typeof progress === 'number' && (
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={`${label}: ${progress}%`}
          >
            <div
              className={cn('h-full rounded-full transition-[width] duration-500', palette.bar)}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
        <span className="text-xs leading-relaxed text-muted-foreground">{hint}</span>
      </CardContent>
    </Card>
  )
}

export type TaskItem = {
  icon: LucideIcon
  label: string
  note: string
  status: 'siap' | 'belum'
}

export function TaskList({
  title,
  description,
  items,
  footer,
}: {
  title: string
  description: string
  items: TaskItem[]
  footer?: string
}) {
  const ready = items.filter((item) => item.status === 'siap').length

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-base font-semibold text-foreground">{title}</p>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {ready} dari {items.length} aktif
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon
          const isReady = item.status === 'siap'
          return (
            <div
              key={item.label}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                isReady
                  ? 'border-success/30 bg-success-soft/60 hover:border-success/50'
                  : 'border-border bg-background/60 hover:border-muted-foreground/40'
              )}
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-lg',
                  isReady ? 'bg-success-soft text-success' : 'bg-muted text-muted-foreground'
                )}
                aria-hidden="true"
              >
                <Icon className="size-4" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <span className="truncate text-xs text-muted-foreground">{item.note}</span>
              </div>
              <span
                className={cn(
                  'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  isReady
                    ? 'bg-success text-success-foreground'
                    : 'border border-border bg-muted text-muted-foreground'
                )}
              >
                {isReady ? (
                  <CheckCircle2 className="size-3" aria-hidden="true" />
                ) : (
                  <CircleDashed className="size-3" aria-hidden="true" />
                )}
                {isReady ? 'Aktif' : 'Menyusul'}
              </span>
            </div>
          )
        })}
        {footer && <p className="pt-1 text-xs leading-relaxed text-muted-foreground">{footer}</p>}
      </CardContent>
    </Card>
  )
}

export function QuickLink({
  icon,
  label,
  note,
  tone = 'primary',
}: {
  icon: LucideIcon
  label: string
  note: string
  tone?: 'primary' | 'success' | 'warning' | 'info' | 'default'
}) {
  const Icon = icon
  const tones: Record<string, string> = {
    primary: 'bg-primary-soft text-primary-ink',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    info: 'bg-info-soft text-info',
    default: 'bg-muted text-muted-foreground',
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-3 py-2.5">
      <span
        className={cn('grid size-9 shrink-0 place-items-center rounded-lg', tones[tone])}
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="truncate text-xs text-muted-foreground">{note}</span>
      </div>
    </div>
  )
}

export function InfoCard({
  title,
  children,
  tone = 'info',
}: {
  title: string
  children: ReactNode
  tone?: 'info' | 'success' | 'warning'
}) {
  const tones: Record<string, { wrap: string; dot: string }> = {
    info: { wrap: 'bg-info-soft border-info/25', dot: 'bg-info' },
    success: { wrap: 'bg-success-soft border-success/25', dot: 'bg-success' },
    warning: { wrap: 'bg-warning-soft border-warning/25', dot: 'bg-warning' },
  }
  const palette = tones[tone]

  return (
    <div className={cn('rounded-xl border px-3.5 py-3', palette.wrap)}>
      <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <span className={cn('size-1.5 rounded-full', palette.dot)} aria-hidden="true" />
        {title}
      </p>
      <div className="text-xs leading-relaxed text-foreground/80">{children}</div>
    </div>
  )
}

export function toInitials(name: string | null, code: string | null) {
  const source = (name ?? '').trim()
  if (source) {
    const parts = source.split(/\s+/)
    const first = parts[0]?.[0] ?? ''
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
    return `${first}${last}`.toUpperCase()
  }
  return (code ?? '—').slice(0, 2).toUpperCase()
}

export function percent(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0
}
