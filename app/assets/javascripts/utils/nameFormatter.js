import NAME_SUFFIXES from 'NameSuffixes'

const addSuffix = (name, suffix) => {
  if (['ii', 'iii', 'iv'].includes(suffix)) {
    return `${name} ${NAME_SUFFIXES[suffix]}`
  } else if (suffix) {
    return `${name}, ${NAME_SUFFIXES[suffix]}`
  } else {
    return name
  }
}

const nameFormatter = (nameableObject) => {
  const firstName = nameableObject.get('first_name') || nameableObject.get('related_person_first_name')
  const lastName = nameableObject.get('last_name') || nameableObject.get('related_person_last_name')
  const middleName = nameableObject.get('middle_name')
  const nameSuffix = nameableObject.get('name_suffix')

  if (firstName || lastName) {
    const names = [firstName || '(Unknown first name)']
    if (middleName) { names.push(middleName) }
    names.push(lastName || '(Unknown last name)')
    const name = names.join(' ')
    return addSuffix(name, nameSuffix)
  } else if (middleName) {
    const name = `Unknown ${middleName}`
    return addSuffix(name, nameSuffix)
  } else {
    return 'Unknown Person'
  }
}

export default nameFormatter
