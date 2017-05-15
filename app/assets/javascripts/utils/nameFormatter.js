import NAME_SUFFIXES from 'NameSuffixes'

const nameFormatter = (nameableObject) => {
  const first_name = nameableObject.get('first_name') || nameableObject.get('related_person_first_name')
  const last_name = nameableObject.get('last_name') || nameableObject.get('related_person_last_name')
  const middle_name = nameableObject.get('middle_name')
  const name_suffix = nameableObject.get('name_suffix')

  if (first_name || last_name) {
    const names = [first_name || '(Unknown first name)']
    if (middle_name) { names.push(middle_name) }
    names.push(last_name || '(Unknown last name)')
    const name = names.join(' ')

    if (['ii', 'iii', 'iv'].includes(name_suffix)) {
      return `${name} ${NAME_SUFFIXES[name_suffix]}`
    } else if (name_suffix) {
      return `${name}, ${NAME_SUFFIXES[name_suffix]}`
    } else {
      return name
    }
  } else {
    return 'Unknown person'
  }
}

export default nameFormatter
