import MarketingLayout from '~/layouts/marketing'
import { Link } from '@adonisjs/inertia/react'
import { RotateCcw, TriangleAlert } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function ServerError() {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <article className="w-full rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 font-mono text-xs font-medium text-destructive">
          <TriangleAlert size={13} strokeWidth={1.8} />
          500
        </span>

        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          Terjadi kesalahan.
        </h1>
        <p className="mt-1 text-lg text-muted-foreground">Server mengalami error tak terduga.</p>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Coba lagi beberapa saat lagi. Bila masalah berlanjut, periksa log server untuk melihat
          penyebabnya.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button className="rounded-xl" onClick={() => window.location.reload()}>
            <RotateCcw size={16} />
            Muat ulang
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link route="home">Kembali ke beranda</Link>
          </Button>
        </div>
      </article>
    </div>
  )
}

ServerError.layout = [MarketingLayout]
