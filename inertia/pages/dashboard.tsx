import Page from '~/components/page'
import { LayoutGrid } from 'lucide-react'
import AppLayout from '~/layouts/app'

export default function Dashboard() {
  return (
    <Page title="Dashboard" hideTitle>
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card px-6 py-14 text-center text-card-foreground shadow-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
          <LayoutGrid size={22} strokeWidth={1.8} />
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground">
          Dasbor Anda sudah siap
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Halaman ini sengaja masih kosong — titik awal yang bersih tanpa ada yang perlu dibatalkan.
          Tambahkan route dan komponen pertama Anda untuk mulai.
        </p>
        <p className="mt-4 text-[12.5px] text-muted-foreground">
          Mulai di{' '}
          <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">
            inertia/pages/dashboard.tsx
          </code>
        </p>
      </div>
    </Page>
  )
}

Dashboard.layout = [AppLayout]
