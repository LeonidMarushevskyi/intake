import Immutable from 'immutable'
import VALIDATIONS from 'ValidationRules'
import _ from 'lodash'
import moment from 'moment'

class ScreeningValidator {
  constructor({screening, allegations}) {
    this.screening = screening
    this.allegations = allegations
    this.VALIDATORS = Immutable.fromJS({
      isNotInTheFuture: this.isNotInTheFuture.bind(this),
      isRequired: this.isRequired.bind(this),
      isRequiredIf: this.isRequiredIf.bind(this),
      isInvalidIf: this.isInvalidIf.bind(this),
    })
  }

  areValidAllegationsPresent() {
    return this.allegations.some((allegation) => !allegation.get('allegation_types').isEmpty())
  }

  isNotInTheFuture({value, errorMessage}) {
    const now = moment().toISOString()
    if (value > now) {
      return errorMessage
    } else {
      return undefined
    }
  }

  isRequired({value, errorMessage}) {
    if ((_.isEmpty(value) || _.isEmpty(value.trim())) && value !== true) {
      return errorMessage
    }
    return undefined
  }

  isRequiredIf({value, errorMessage, condition}) {
    if (condition(value, this)) {
      return this.isRequired({value, errorMessage})
    }
    return undefined
  }

  isInvalidIf({value, condition, errorMessage}) {
    if (condition(value, this)) {
      return errorMessage
    } else {
      return undefined
    }
  }

  validateField({value, rules}) {
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

      const validation = this.VALIDATORS.get(opts.ruleName)
      return validation(opts)
    })
    return errorMessages.filterNot((message) => message === undefined)
  }

  validateAllFields({screening, fieldValidations}) {
    const errors = {}
    fieldValidations.map((rules, fieldShortName) => {
      errors[fieldShortName] = this.validateField({
        value: screening.get(fieldShortName),
        rules,
      })
    })
    return Immutable.Map(errors)
  }

  validateScreening() {
    const errors = {}
    VALIDATIONS.map((cardValidations, cardName) => (
      errors[cardName] = this.validateAllFields({
        screening: this.screening,
        fieldValidations: cardValidations,
      })
    ))
    return Immutable.Map(errors)
  }
}

export default ScreeningValidator
