import Immutable from 'immutable'
import _ from 'lodash'

const isRequired = (friendlyName, value) => {
  const errorMessage = `${friendlyName} is required`
  if (_.isEmpty(value) || _.isEmpty(value.trim())) {
    return errorMessage
  } else {
    return undefined
  }
}

const VALIDATORS = Immutable.fromJS({
  isRequired: isRequired,
})

export function validateField({friendlyName, value, rules}) {
  const errorMessages = rules.map((ruleName) => {
    const validation = VALIDATORS.get(ruleName)
    return validation(friendlyName, value)
  })
  return errorMessages.filterNot((message) => message === undefined)
}
