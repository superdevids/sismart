import Page from '~/components/page'
import { Hourglass, LogOut } from 'lucide-react'
import { Form } from '@adonisjs/inertia/react'
import AppLayout from '~/layouts/app'

export default function AktivasiBudget() {
  return (
    <Page title="Akun menunggu aktivasi" hideTitle>
      <div className="empty">
        <div className="empty__mark">
          <Hourglass size={22} />
        </div>
        <h1>Akun menunggu aktivasi</h1>
        <p>
          Akun Anda belum diberi peran. Hubungi administrator sekolah untuk mengaktifkan akses Anda.
        </p>
        <Form route="session.destroy">
          <button type="submit" className="btn btn--secondary">
            <LogOut size={15} /> Keluar
          </button>
        </Form>
      </div>
    </Page>
  )
}

AktivasiBudget.layout = [AppLayout]
