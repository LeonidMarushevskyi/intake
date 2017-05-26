import NAME_SUFFIXES from 'NameSuffixes'
import _ from 'lodash'

const addSuffix = (name, suffix) => {
  if (['ii', 'iii', 'iv'].includes(suffix)) {
    return `${name} ${NAME_SUFFIXES[suffix]}`
  } else if (suffix) {
    return `${name}, ${NAME_SUFFIXES[suffix]}`
  } else {
    return name
  }
}

const nameFormatter = (nameableObject, options) => {
  const formatOptions = options || {}
  const nameType = formatOptions.name_type
  const nameDefault = formatOptions.name_default

  let firstNameKey
  let lastNameKey
  let middleNameKey
  let suffixKey

  if (nameType) {
    firstNameKey = `${nameType}_first_name`
    lastNameKey = `${nameType}_last_name`
    middleNameKey = `${nameType}_middle_name`
    suffixKey = `${nameType}_name_suffix`
  } else {
    firstNameKey = 'first_name'
    lastNameKey = 'last_name'
    middleNameKey = 'middle_name'
    suffixKey = 'name_suffix'
  }

  const firstName = nameableObject.get(firstNameKey)
  const lastName = nameableObject.get(lastNameKey)
  const middleName = nameableObject.get(middleNameKey)
  const nameSuffix = nameableObject.get(suffixKey)

  if (firstName || lastName) {
    const names = [firstName || '(Unknown first name)']
    if (middleName) { names.push(middleName) }
    names.push(lastName || '(Unknown last name)')
    const name = names.join(' ')
    return addSuffix(name, nameSuffix)
  } else if (middleName) {
    const name = `Unknown ${middleName}`
    return addSuffix(name, nameSuffix)
  } else if (_.isUndefined(nameDefault)) {
    return 'Unknown Person'
  } else {
    return nameDefault
  }
}

export default nameFormatter
