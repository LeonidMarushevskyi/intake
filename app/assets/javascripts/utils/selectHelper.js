export function selectOptions(lookupObject) {
  const keys = Object.keys(lookupObject)
  return keys.map((key) => Object.assign({
    label: lookupObject[key],
    value: key,
  }))
}
