import Immutable from 'immutable'
import _ from 'lodash'
import moment from 'moment'

const isRequired = (value, errorMessage) => {
  if (_.isEmpty(value) || _.isEmpty(value.trim())) {
    return errorMessage
  } else {
    return undefined
  }
}

const isNotInTheFuture = (value, errorMessage) => {
  const now = moment().toISOString()
  if (value > now) {
    return errorMessage
  } else {
    return undefined
  }
}

const isBeforeOtherDate = (value, errorMessage, otherValue) => {
  if (value && otherValue() && value >= otherValue()) {
    return errorMessage
  }
  return undefined
}

const VALIDATORS = Immutable.fromJS({
  isRequired: isRequired,
  isNotInTheFuture: isNotInTheFuture,
  isBeforeOtherDate: isBeforeOtherDate,
})

export function validateField({value, rules}) {
  const errorMessages = rules.map((ruleOptions) => {
    const ruleName = ruleOptions.get('rule')
    const errorMessage = ruleOptions.get('message')
    const otherValue = ruleOptions.get('otherValue')

    const validation = VALIDATORS.get(ruleName)
    return validation(value, errorMessage, otherValue)
  })
  return errorMessages.filterNot((message) => message === undefined)
}
