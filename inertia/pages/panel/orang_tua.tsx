import type { ReactElement } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'

export default function OrangTuaPanel() {
  return <Page title="Panel orang tua" hideTitle description={undefined} />
}

OrangTuaPanel.layout = (page: ReactElement) => <AppLayout title="Panel orang tua">{page}</AppLayout>
