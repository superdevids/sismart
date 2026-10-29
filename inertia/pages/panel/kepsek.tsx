import Page from '~/components/page'
import BlankLayout from '~/layouts/blank'

export default function KepsekPanel() {
  return <Page title="Panel kepala sekolah" hideTitle description={undefined} />
}

KepsekPanel.layout = [BlankLayout]
