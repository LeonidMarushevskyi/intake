import _ from 'lodash'

const ssnFormatter = (ssn) => {
  if (_.isEmpty(ssn)) {
    return ''
  }
  // eslint-disable-next-line no-magic-numbers
  if (ssn.length === 9 && !ssn.includes('-')) {
    // eslint-disable-next-line no-magic-numbers
    ssn = `${ssn.substring(0, 3)}-${ssn.substring(3, 5)}-${ssn.substring(5, 9)}`
  }
  return ssn.replace(/_/g, ' ')
}

export default ssnFormatter
