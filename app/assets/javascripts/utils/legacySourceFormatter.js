export default function legacySourceFormatter({legacy_friendly_table, legacy_friendly_id}) {
  const legacySourceStringParts = []

  if (legacy_friendly_table) {
    legacySourceStringParts.push(legacy_friendly_table)
  }

  if (legacy_friendly_id) {
    legacySourceStringParts.push(`ID ${legacy_friendly_id}`)
  }

  if (legacy_friendly_table || legacy_friendly_id) {
    legacySourceStringParts.push('in CWS-CMS')
  }

  return legacySourceStringParts.join(' ')
}
