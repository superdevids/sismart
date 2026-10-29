import type { ReactElement } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'

export default function AdminPanel() {
  return <Page title="Panel admin" hideTitle description={undefined} />
}

AdminPanel.layout = (page: ReactElement) => <AppLayout title="Panel admin">{page}</AppLayout>
