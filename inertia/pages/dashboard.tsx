import Page from '~/components/page'
import { LayoutGrid } from 'lucide-react'
import AppLayout from '~/layouts/app'

export default function Dashboard() {
  return (
    <Page title="Dashboard" hideTitle>
      <div className="empty">
        <div className="empty__mark">
          <LayoutGrid size={22} />
        </div>
        <h1>Dasbor Anda siap</h1>
        <p>
          Sengaja dibiarkan kosong. Titik awal yang bersih tanpa apa pun yang perlu dibatalkan.
          Tambahkan rute dan komponen pertama Anda untuk memulai.
        </p>
        <p className="mono" style={{ fontSize: 12.5, color: 'var(--subtle)', marginTop: 4 }}>
          Mulai dari <span className="kbd">inertia/pages/dashboard.tsx</span>
        </p>
      </div>
    </Page>
  )
}

Dashboard.layout = [AppLayout]
