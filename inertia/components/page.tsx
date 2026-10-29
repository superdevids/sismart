import { type ReactNode } from 'react'
import { Head } from '@inertiajs/react'
import { cn } from '~/lib/utils'

/**
 * Kerangka satu halaman aplikasi: menetapkan judul dokumen, lalu menampilkan
 * judul halaman, deskripsi opsional, dan aksi (tombol/tautan) yang rata kanan.
 * Pakai `hideTitle` bila hanya ingin menetapkan judul dokumen.
 */
export default function Page({
  title,
  hideTitle = false,
  description,
  actions,
  children,
}: {
  title: string
  hideTitle?: boolean
  description?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}) {
  const hasHeader = !hideTitle || description || actions

  return (
    <div className={cn('mx-auto w-full max-w-7xl', 'px-4 py-8 sm:px-6 md:py-12 lg:px-8')}>
      <Head title={title} />
      {hasHeader && (
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            {!hideTitle && (
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </div>
  )
}
