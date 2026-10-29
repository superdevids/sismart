import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'
import { router, usePage } from '@inertiajs/react'
import { CircleAlert, CircleCheck } from 'lucide-react'

export default function FlashToasts() {
  const { flash } = usePage()

  useEffect(() => {
    return router.on('start', () => toast.dismiss('flash'))
  }, [])

  useEffect(() => {
    if (flash.error) toast.error(flash.error, { id: 'flash' })
    if (flash.success) toast.success(flash.success, { id: 'flash' })
  }, [flash])

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-full items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-card-foreground shadow-lg shadow-foreground/5',
          title: 'font-medium leading-snug',
          description: 'mt-0.5 text-xs text-muted-foreground',
          icon: 'mt-0.5 shrink-0',
          success: '[&_[data-icon]]:text-success',
          error: '[&_[data-icon]]:text-destructive',
          actionButton:
            'ml-auto rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground',
          cancelButton:
            'ml-auto rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground',
          closeButton: 'rounded-md text-muted-foreground hover:text-foreground',
        },
      }}
      icons={{
        success: <CircleCheck size={18} strokeWidth={1.8} />,
        error: <CircleAlert size={18} strokeWidth={1.8} />,
      }}
    />
  )
}
