import type { ReactElement } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'

export default function SiswaPanel() {
  return <Page title="Panel siswa" hideTitle description={undefined} />
}

SiswaPanel.layout = (page: ReactElement) => <AppLayout title="Panel siswa">{page}</AppLayout>
