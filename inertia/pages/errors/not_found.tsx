import MarketingLayout from '~/layouts/marketing'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, Compass } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <article className="w-full rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-xs font-medium text-muted-foreground">
          <Compass size={13} strokeWidth={1.8} />
          404
        </span>

        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          Halaman tidak ditemukan.
        </h1>
        <p className="mt-1 text-lg text-muted-foreground">Rute ini belum ada.</p>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Alamat yang Anda tuju tidak tersedia. Periksa kembali URL-nya, atau kembali ke halaman
          utama.
        </p>

        <Button asChild className="mt-7 rounded-xl">
          <Link route="home">
            <ArrowLeft size={16} />
            Kembali ke beranda
          </Link>
        </Button>
      </article>
    </div>
  )
}

NotFound.layout = [MarketingLayout]
