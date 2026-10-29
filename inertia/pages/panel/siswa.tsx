import Page from '~/components/page'
import BlankLayout from '~/layouts/blank'

export default function SiswaPanel() {
  return <Page title="Panel siswa" hideTitle description={undefined} />
}

SiswaPanel.layout = [BlankLayout]
