import _ from 'lodash'

const validSSNLength = 9
const ssnFormatter = (ssn) => {
  if (_.isEmpty(ssn)) {
    return ''
  }
  if (ssn.length === validSSNLength && !ssn.includes('-')) {
    // eslint-disable-next-line no-magic-numbers
    ssn = `${ssn.substring(0, 3)}-${ssn.substring(3, 5)}-${ssn.substring(5, 9)}`
  }
  return ssn.replace(/_/g, ' ')
}

export default ssnFormatter
