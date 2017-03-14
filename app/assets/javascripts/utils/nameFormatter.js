
const nameFormatter = (nameableObject) => {
  const first_name = nameableObject.get('first_name')
  const last_name = nameableObject.get('last_name')
  if (first_name || last_name) {
    return [
      first_name || '(Unknown first name)',
      last_name || '(Unknown last name)',
    ].join(' ')
  } else {
    return 'Unknown person'
  }
}

export default nameFormatter
