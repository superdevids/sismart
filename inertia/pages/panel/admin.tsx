import Page from '~/components/page'
import BlankLayout from '~/layouts/blank'

export default function AdminPanel() {
  return <Page title="Panel admin" hideTitle description={undefined} />
}

AdminPanel.layout = [BlankLayout]
