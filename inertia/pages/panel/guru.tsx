import type { ReactElement } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'

export default function GuruPanel() {
  return <Page title="Panel guru" hideTitle description={undefined} />
}

GuruPanel.layout = (page: ReactElement) => <AppLayout title="Panel guru">{page}</AppLayout>
