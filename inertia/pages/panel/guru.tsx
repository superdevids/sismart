import Page from '~/components/page'
import BlankLayout from '~/layouts/blank'

export default function GuruPanel() {
  return <Page title="Panel guru" hideTitle description={undefined} />
}

GuruPanel.layout = [BlankLayout]
