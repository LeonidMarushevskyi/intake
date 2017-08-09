import Immutable from 'immutable'
import _ from 'lodash'
import moment from 'moment'

const isRequired = ({value, errorMessage}) => {
  if ((_.isEmpty(value) || _.isEmpty(value.trim())) && value !== true) {
    return errorMessage
  }
  return undefined
}

const isRequiredIf = ({value, errorMessage, condition}) => {
  if (condition()) {
    return isRequired({value, errorMessage})
  }
  return undefined
}

const isNotInTheFuture = ({value, errorMessage}) => {
  const now = moment().toISOString()
  if (value > now) {
    return errorMessage
  } else {
    return undefined
  }
}

const isBeforeOtherDate = ({value, errorMessage, otherValue}) => {
  if (value && otherValue() && value >= otherValue()) {
    return errorMessage
  }
  return undefined
}

const VALIDATORS = Immutable.fromJS({
  isRequired: isRequired,
  isRequiredIf: isRequiredIf,
  isNotInTheFuture: isNotInTheFuture,
  isBeforeOtherDate: isBeforeOtherDate,
})

export function validateField({value, rules}) {
  if (_.isEmpty(rules)) {
    return Immutable.List()
  }
  const errorMessages = rules.map((ruleOptions) => {
    const opts = {
      value: value,
      ruleName: ruleOptions.get('rule'),
      errorMessage: ruleOptions.get('message'),
      condition: ruleOptions.get('condition'),
      otherValue: ruleOptions.get('otherValue'),
    }

    const validation = VALIDATORS.get(opts.ruleName)
    return validation(opts)
  })
  return errorMessages.filterNot((message) => message === undefined)
}

export function validateAllFields({screening, fieldValidations}) {
  const errors = {}
  fieldValidations.map((rules, fieldShortName) => {
    errors[fieldShortName] = validateField({
      value: screening.get(fieldShortName),
      rules,
    })
  })
  return Immutable.Map(errors)
}
