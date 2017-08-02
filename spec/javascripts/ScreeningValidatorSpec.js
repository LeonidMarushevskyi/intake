import Immutable from 'immutable'
import ScreeningValidator from 'ScreeningValidator'
import moment from 'moment'

describe('ScreeningValidator', () => {
  describe('validateScreening', () => {
    it('returns an errors object keyed with the card names', () => {
      const screening = Immutable.fromJS({screening_decision: 'promote_to_referral'})
      const allegations = Immutable.fromJS([{allegation_types: []}])
      const validator = new ScreeningValidator({screening: screening, allegations: allegations})
      const errors = validator.validateScreening()
      expect(errors.keySeq().includes('decision_card')).toEqual(true)
      expect(errors.get('decision_card').keySeq().includes('screening_decision')).toEqual(true)
    })
  })

  describe('validateField', () => {
    describe('when there are no arguments', () => {
      const args = {
        value: '',
        rules: Immutable.List(),
      }

      let validationResult

      beforeEach(() => {
        validationResult = new ScreeningValidator({}).validateField(args)
      })

      it('returns an empty list', () => {
        expect(validationResult).toEqual(Immutable.List())
      })
    })

    describe('When there are arguments, but all values are valid', () => {
      const args = {
        value: 'Sally Worker',
        rules: Immutable.fromJS([{rule: 'isRequired', message: 'Give me a social worker'}]),
      }

      let validationResult

      beforeEach(() => {
        validationResult = new ScreeningValidator({}).validateField(args)
      })

      it('returns an empty list', () => {
        expect(validationResult).toEqual(Immutable.List())
      })
    })

    describe('when there are errors', () => {
      const args = {
        value: '',
        rules: Immutable.fromJS([{rule: 'isRequired', message: 'Give me a social worker'}]),
      }

      let validationResult

      beforeEach(() => {
        validationResult = new ScreeningValidator({}).validateField(args)
      })

      it('returns errors for the passed value', () => {
        expect(validationResult.count()).toEqual(1)
      })

      it('includes fieldName in the returned error message', () => {
        expect(validationResult.first()).toContain('Give me a social worker')
      })
    })
  })

  describe('validateAllFields', () => {
    let fieldValidations
    let screening

    describe('when there are no arguments', () => {
      it('returns an empty errors map', () => {
        expect(new ScreeningValidator({}).validateAllFields({screening: Immutable.Map(), fieldValidations: Immutable.Map()})).toEqual(Immutable.Map())
      })
    })

    describe('when there are values that are valid', () => {
      it('returns an empty errors map', () => {
        screening = Immutable.fromJS({some_field: 'is filled in'})
        fieldValidations = Immutable.fromJS({some_field: [
          {rule: 'isRequired', message: 'Please enter a narrative.'},
        ]})
        expect(new ScreeningValidator({}).validateAllFields({screening: screening, fieldValidations: fieldValidations}).get('some_field').toJS()).toEqual([])
      })
    })

    describe('when there are NOT values that are valid', () => {
      it('returns an errors map', () => {
        screening = Immutable.fromJS({some_field: ''})
        fieldValidations = Immutable.fromJS({some_field: [
          {rule: 'isRequired', message: 'Please enter a field.'},
        ]})
        expect(new ScreeningValidator({}).validateAllFields({screening: screening, fieldValidations: fieldValidations}).get('some_field').toJS()).toContain('Please enter a field.')
      })
    })
  })

  describe('areValidAllegationsPresent', () => {
    it('returns false when allegations is an empty list', () => {
      const allegations = Immutable.List()
      const validator = new ScreeningValidator({allegations: allegations})
      expect(validator.areValidAllegationsPresent()).toEqual(false)
    })

    it('returns true when at least one allegation has a type', () => {
      const allegations = Immutable.fromJS([
        {allegation_types: []},
        {allegation_types: ['exploitation']},
      ])
      const validator = new ScreeningValidator({allegations: allegations})
      expect(validator.areValidAllegationsPresent()).toEqual(true)
    })

    it('returns false when no allegations have types', () => {
      const allegations = Immutable.fromJS([
        {allegation_types: []},
        {allegation_types: []},
      ])
      const validator = new ScreeningValidator({allegations: allegations})
      expect(validator.areValidAllegationsPresent()).toEqual(false)
    })
  })

  describe('isRequired', () => {
    const message = 'Give me a social worker'
    const sharedArgs = {
      errorMessage: message,
    }

    it('is not valid when the value is false', () => {
      const args = {
        ...sharedArgs,
        value: false,
      }
      const validator = new ScreeningValidator({})
      expect(validator.isRequired(args)).toEqual(message)
    })

    it('is not valid when the value is null', () => {
      const args = {
        ...sharedArgs,
        value: null,
      }
      const validator = new ScreeningValidator({})
      expect(validator.isRequired(args)).toEqual(message)
    })

    it('is not valid when the value is an empty string', () => {
      const args = {
        ...sharedArgs,
        value: '',
      }
      const validator = new ScreeningValidator({})
      expect(validator.isRequired(args)).toEqual(message)
    })

    it('is not valid when the value is nothing but whitespace', () => {
      const args = {
        ...sharedArgs,
        value: '    \n\n\t\t',
      }
      const validator = new ScreeningValidator({})
      expect(validator.isRequired(args)).toEqual(message)
    })

    it('is valid when the value is true', () => {
      const args = {
        ...sharedArgs,
        value: true,
      }
      const validator = new ScreeningValidator({})
      expect(validator.isRequired(args)).toEqual(undefined)
    })

    it('is valid when the value contains at least one non-whitespace character', () => {
      const args = {
        ...sharedArgs,
        value: 'A',
      }
      const validator = new ScreeningValidator({})
      expect(validator.isRequired(args)).toEqual(undefined)
    })

    it('includes the proper error message when the value is not valid', () => {
      const args = {
        ...sharedArgs,
        value: '',
      }
      const validator = new ScreeningValidator({})
      expect(validator.isRequired(args)).toEqual(message)
    })
  })

  describe('isRequiredIf', () => {
    const message = 'Give me an agency name'
    const sharedArgs = {
      errorMessage: message,
      condition: () => true,
    }

    describe('when condition is met', () => {
      it('returns the error message if the value is empty', () => {
        const validator = new ScreeningValidator({})
        expect(validator.isRequiredIf(sharedArgs)).toEqual(message)
      })

      it('is valid if the value is not empty', () => {
        const args = {
          ...sharedArgs,
          value: 'Abc',
        }
        const validator = new ScreeningValidator({})
        expect(validator.isRequiredIf(args)).toEqual(undefined)
      })
    })

    describe('when condition is not met', () => {
      it('is valid even if the value is empty or undefined', () => {
        const args = {
          ...sharedArgs,
          condition: () => false,
        }
        const validator = new ScreeningValidator({})
        expect(validator.isRequiredIf(args)).toEqual(undefined)
      })
    })

    describe('when condition is dependent on values in the validator', () => {
      it('passes the value and validator to the condition', () => {
        const args = {
          ...sharedArgs,
          condition: (value, validator) => (value === validator.allegations),
        }
        const validator = new ScreeningValidator({})
        expect(validator.isRequiredIf(args)).toEqual(message)
      })
    })
  })

  describe('isInvalidIf', () => {
    it('returns undefined when the condition passed evaluates to false', () => {
      const args = {
        value: '',
        condition: () => (3 === 4),
        errorMessage: 'Values must be equal',
      }
      const validator = new ScreeningValidator({})
      expect(validator.isInvalidIf(args)).toEqual(undefined)
    })

    it('returns the error message when the condition passed evaluates to true', () => {
      const message = 'Values must be equal'
      const args = {
        value: '',
        condition: () => (`${4}` === '4'),
        errorMessage: 'Values must be equal',
      }
      const validator = new ScreeningValidator({})
      expect(validator.isInvalidIf(args)).toEqual(message)
    })

    it('passes the value and validator as arguments to the callback', () => {
      const message = 'Values must be equal'
      const args = {
        value: undefined,
        condition: (value, validator) => (validator.screening === value),
        errorMessage: 'Values must be equal',
      }
      const validator = new ScreeningValidator({})
      expect(validator.isInvalidIf(args)).toEqual(message)
    })
  })

  describe('isNotInTheFuture', () => {
    const message = 'You are not a time traveler'
    const sharedArgs = {
      errorMessage: message,
    }

    it('is not valid when the value is in the future', () => {
      const tomorrow = moment().add(1, 'days').toISOString()
      const args = {...sharedArgs, value: tomorrow}
      const validator = new ScreeningValidator({})
      expect(validator.isNotInTheFuture(args)).toEqual(message)
    })

    it('is valid when the value is in the past', () => {
      const args = {...sharedArgs, value: moment().toISOString()}
      const validator = new ScreeningValidator({})
      expect(validator.isNotInTheFuture(args)).toEqual(undefined)
    })

    it('is valid when the value is equal to the current time', () => {
      const stubbedDate = '5999-01-01T01:01:01.001Z'
      spyOn(moment.prototype, 'toISOString').and.returnValue(stubbedDate)
      const args = {...sharedArgs, value: stubbedDate}
      const validator = new ScreeningValidator({})
      expect(validator.isNotInTheFuture(args)).toEqual(undefined)
    })

    it('is valid when the value is one milisecond less than to the current time', () => {
      const stubbedDate = '5999-01-01T01:01:01.001Z'
      spyOn(moment.prototype, 'toISOString').and.returnValue(stubbedDate)
      const args = {...sharedArgs, value: moment(stubbedDate).subtract(1, 'milliseconds')}
      const validator = new ScreeningValidator({})
      expect(validator.isNotInTheFuture(args)).toEqual(undefined)
    })

    it('is valid when the value is an empty string', () => {
      const args = {...sharedArgs, value: ''}
      const validator = new ScreeningValidator({})
      expect(validator.isNotInTheFuture(args)).toEqual(undefined)
    })

    it('is valid when the value is null', () => {
      const args = {...sharedArgs, value: null}
      const validator = new ScreeningValidator({})
      expect(validator.isNotInTheFuture(args)).toEqual(undefined)
    })

    it('includes the proper error message when the value is invalid', () => {
      const tomorrow = moment().add(1, 'days').toISOString()
      const args = {...sharedArgs, value: tomorrow}
      const validator = new ScreeningValidator({})
      expect(validator.isNotInTheFuture(args)).toEqual(message)
    })
  })
})

