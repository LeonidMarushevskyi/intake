const userNameFormatter = ({
  first_name,
  last_name,
  notAvailable = 'Not Available',
}) => {
  if (first_name || last_name) {
    const names = [first_name || '(Unknown first name)']
    names.push(last_name || '(Unknown last name)')
    const userFullName = names.join(' ')
    return userFullName
  } else {
    return notAvailable
  }
}

export default userNameFormatter