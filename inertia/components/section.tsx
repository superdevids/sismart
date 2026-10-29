import { type ReactNode } from 'react'

/**
 * Sekelompok konten dalam satu halaman — misalnya sekumpulan field form —
 * dengan judul dan deskripsi opsional. Beberapa Section ditumpuk akan
 * dipisahkan garis.
 */
export default function Section({
  title,
  description,
  children,
}: {
  title?: string
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="border-b border-border py-6 last:border-b-0 last:pb-0 first:pt-0">
      {(title || description) && (
        <header className="mb-4">
          {title && (
            <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  )
}
