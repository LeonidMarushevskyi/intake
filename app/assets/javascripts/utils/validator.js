import Immutable from 'immutable'
import _ from 'lodash'

const isRequired = (value, errorMessage) => {
  if (_.isEmpty(value) || _.isEmpty(value.trim())) {
    return errorMessage
  } else {
    return undefined
  }
}

const VALIDATORS = Immutable.fromJS({
  isRequired: isRequired,
})

export function validateField({value, rules}) {
  const errorMessages = rules.map((ruleOptions) => {
    const ruleName = ruleOptions.get('rule')
    const errorMessage = ruleOptions.get('message')

    const validation = VALIDATORS.get(ruleName)
    return validation(value, errorMessage)
  })
  return errorMessages.filterNot((message) => message === undefined)
}
