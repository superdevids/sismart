import Page from '~/components/page'
import BlankLayout from '~/layouts/blank'

export default function StaffPanel() {
  return <Page title="Panel tata usaha" hideTitle description={undefined} />
}

StaffPanel.layout = [BlankLayout]
