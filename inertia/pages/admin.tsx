import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { ShieldCheck } from 'lucide-react'

export default function Admin() {
  return (
    <Page title="Admin" hideTitle>
      <div className="empty">
        <div className="empty__mark">
          <ShieldCheck size={22} />
        </div>
        <h1>Admin area</h1>
        <p>Halaman ini hanya dapat diakses oleh pengguna dengan role admin.</p>
      </div>
    </Page>
  )
}

Admin.layout = [AppLayout]
