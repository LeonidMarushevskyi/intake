export default function legacySourceFormatter(legacyObject) {
  const legacyTable = legacyObject.get('legacy_friendly_table')
  const legacyId = legacyObject.get('legacy_friendly_id')
  const legacySourceStringParts = []

  if (legacyTable) {
    legacySourceStringParts.push(legacyTable)
  }

  if (legacyId) {
    legacySourceStringParts.push(`ID ${legacyId}`)
  }

  if (legacyTable || legacyId) {
    legacySourceStringParts.push('in CWS-CMS')
  }

  return legacySourceStringParts.join(' ')
}
