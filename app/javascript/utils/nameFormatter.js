import NAME_SUFFIXES from 'enums/NameSuffixes'

const addSuffix = (name, suffix) => {
  if (['ii', 'iii', 'iv'].includes(suffix)) {
    return `${name} ${NAME_SUFFIXES[suffix]}`
  } else if (suffix) {
    return `${name}, ${NAME_SUFFIXES[suffix]}`
  } else {
    return name
  }
}

const nameFormatter = ({
  first_name,
  last_name,
  middle_name,
  name_suffix,
  name_default = 'Unknown Person',
}) => {
  if (first_name || last_name) {
    const names = [first_name || '(Unknown first name)']
    if (middle_name) { names.push(middle_name) }
    names.push(last_name || '(Unknown last name)')
    const name = names.join(' ')
    return addSuffix(name, name_suffix)
  } else if (middle_name) {
    const name = `Unknown ${middle_name}`
    return addSuffix(name, name_suffix)
  } else {
    return name_default
  }
}

export default nameFormatter
