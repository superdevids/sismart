import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'
import { Button } from '~/components/ui/button'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const { props } = usePage()
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 xl:px-8">
          <Logo size={28} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" className="rounded-lg">
              <Link route={props.user ? 'panel' : 'session.create'}>
                {props.user ? 'Panel' : 'Masuk'}
              </Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
      <FlashToasts />
    </div>
  )
}
