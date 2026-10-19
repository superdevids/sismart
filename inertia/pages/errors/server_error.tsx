import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import MarketingLayout from '~/layouts/marketing'

export default function ServerError() {
  return (
    <>
      <Head title="Terjadi kesalahan server" />
      <div className="home">
        <article className="prose-card">
          <div className="pc-top">
            <span className="pc-status mono tag text-[var(--danger)]">
              <span className="dot" /> 500
            </span>
          </div>
          <h1 className="heading-display mt-6">Terjadi kesalahan server</h1>
          <p className="pc-para">
            Server mengalami gangguan tak terduga. Coba beberapa saat lagi, dan hubungi
            administrator bila masalah berlanjut.
          </p>
          <div className="mt-6">
            <Link href="/" className="btn btn--primary">
              Kembali ke beranda
            </Link>
          </div>
        </article>
      </div>
    </>
  )
}

ServerError.layout = [MarketingLayout]
