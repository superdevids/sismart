import type { ReactElement } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'

export default function KepsekPanel() {
  return <Page title="Panel kepala sekolah" hideTitle description={undefined} />
}

KepsekPanel.layout = (page: ReactElement) => (
  <AppLayout title="Panel kepala sekolah">{page}</AppLayout>
)
