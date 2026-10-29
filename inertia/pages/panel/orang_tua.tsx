import Page from '~/components/page'
import BlankLayout from '~/layouts/blank'

export default function OrangTuaPanel() {
  return <Page title="Panel orang tua" hideTitle description={undefined} />
}

OrangTuaPanel.layout = [BlankLayout]
