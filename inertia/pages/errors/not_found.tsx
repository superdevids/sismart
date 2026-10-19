import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import MarketingLayout from '~/layouts/marketing'

export default function NotFound() {
  return (
    <>
      <Head title="Halaman tidak ditemukan" />
      <div className="home">
        <article className="prose-card">
          <div className="pc-top">
            <span className="pc-status mono tag">
              <span className="dot" /> 404
            </span>
          </div>
          <h1 className="heading-display mt-6">Halaman tidak ditemukan</h1>
          <p className="pc-para">
            Alamat yang Anda tuju tidak ada atau sudah dipindahkan. Periksa kembali tautannya, lalu
            coba lagi.
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

NotFound.layout = [MarketingLayout]
