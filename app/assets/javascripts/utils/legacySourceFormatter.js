export default function legacySourceFormatter({legacy_table_description, legacy_ui_id}) {
  const legacySourceStringParts = []

  if (legacy_table_description) {
    legacySourceStringParts.push(legacy_table_description)
  }

  if (legacy_ui_id) {
    legacySourceStringParts.push(`ID ${legacy_ui_id}`)
  }

  if (legacy_table_description || legacy_ui_id) {
    legacySourceStringParts.push('in CWS-CMS')
  }

  return legacySourceStringParts.join(' ')
}
