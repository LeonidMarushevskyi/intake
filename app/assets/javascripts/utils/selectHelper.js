export default function selectOptions(options) {
  return options.map((option) => Object.assign({
    label: option,
    value: option,
  }))
}
