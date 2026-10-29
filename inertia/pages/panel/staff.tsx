import type { ReactElement } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'

export default function StaffPanel() {
  return <Page title="Panel tata usaha" hideTitle description={undefined} />
}

StaffPanel.layout = (page: ReactElement) => <AppLayout title="Panel tata usaha">{page}</AppLayout>
