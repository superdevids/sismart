import { type ReactNode, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { ChevronRight, PanelLeft } from 'lucide-react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'
import AppSidebar from '~/components/app_sidebar'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'

export default function AppLayout({ children }: { children: ReactNode }) {
  const { component, url } = usePage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const crumbs = buildBreadcrumbs(component, url)

  return (
    <div className="flex min-h-dvh bg-background">
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
              className="lg:hidden"
            >
              <PanelLeft />
            </Button>

            <Separator orientation="vertical" className="hidden h-5 sm:block" />

            <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
              <ol className="flex items-center gap-1.5 text-sm">
                {crumbs.map((c, i) => {
                  const last = i === crumbs.length - 1
                  return (
                    <li key={c.label} className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'truncate',
                          last ? 'font-medium text-foreground' : 'text-muted-foreground'
                        )}
                        aria-current={last ? 'page' : undefined}
                      >
                        {c.label}
                      </span>
                      {!last && (
                        <ChevronRight
                          className="size-3.5 shrink-0 text-muted-foreground/70"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>

            <div className="ml-auto flex items-center gap-1.5">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <FlashToasts />
    </div>
  )
}

function buildBreadcrumbs(component: string, url: string): { label: string }[] {
  const KNOWN: Record<string, string> = {
    'pages/dashboard': 'Dasbor',
    'pages/home': 'Beranda',
  }

  const root = KNOWN[component] ?? titleize(component.split('/').pop() ?? 'Dasbor')
  const path = url.split('?')[0]
  const segments = path.split('/').filter(Boolean)

  const crumbs = [{ label: root }]
  segments.forEach((segment) => {
    const label = titleize(segment)
    if (label.toLowerCase() !== root.toLowerCase()) crumbs.push({ label })
  })

  return crumbs.filter((c, i, arr) => i === 0 || c.label !== arr[i - 1].label)
}

function titleize(value: string): string {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}
