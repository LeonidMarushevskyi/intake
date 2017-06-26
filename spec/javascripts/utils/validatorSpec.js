import Immutable from 'immutable'
import * as Validator from 'utils/validator'
import moment from 'moment'

describe('Validator', () => {
  describe('validateField', () => {
    describe('when there are no arguments', () => {
      const args = {
        value: '',
        rules: Immutable.List(),
      }

      let validationResult

      beforeEach(() => {
        validationResult = Validator.validateField(args)
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
        validationResult = Validator.validateField(args)
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
        validationResult = Validator.validateField(args)
      })

      it('returns errors for the passed value', () => {
        expect(validationResult.count()).toEqual(1)
      })

      it('includes fieldName in the returned error message', () => {
        expect(validationResult.first()).toContain('Give me a social worker')
      })
    })
  })

  describe('isRequired', () => {
    const sharedArgs = {
      rules: Immutable.fromJS([{rule: 'isRequired', message: 'Give me a social worker'}]),
    }

    it('is not valid when the value is null', () => {
      const args = {
        ...sharedArgs,
        value: null,
      }
      expect(Validator.validateField(args).count()).toEqual(1)
    })

    it('is not valid when the value is an empty string', () => {
      const args = {
        ...sharedArgs,
        value: '',
      }
      expect(Validator.validateField(args).count()).toEqual(1)
    })

    it('is not valid when the value is nothing but whitespace', () => {
      const args = {
        ...sharedArgs,
        value: '    \n\n\t\t',
      }
      expect(Validator.validateField(args).count()).toEqual(1)
    })

    it('is valid when the value contains at least one non-whitespace character', () => {
      const args = {
        ...sharedArgs,
        value: 'A',
      }
      expect(Validator.validateField(args).count()).toEqual(0)
    })

    it('includes the proper error message when the value is not valid', () => {
      const args = {
        ...sharedArgs,
        value: '',
      }
      expect(Validator.validateField(args).first()).toEqual('Give me a social worker')
    })
  })

  describe('isNotInTheFuture', () => {
    const sharedArgs = {
      rules: Immutable.fromJS([{rule: 'isNotInTheFuture', message: 'You are not a time traveler'}]),
    }

    it('is not valid when the value is in the future', () => {
      const tomorrow = moment().add(1, 'days').toISOString()

      const args = {
        ...sharedArgs,
        value: tomorrow,
      }

      expect(Validator.validateField(args).count()).toEqual(1)
    })

    it('is valid when the value is in the past', () => {
      const args = {
        ...sharedArgs,
        value: moment().toISOString(),
      }

      expect(Validator.validateField(args).count()).toEqual(0)
    })

    it('is valid when the value is equal to the current time', () => {
      const stubbedDate = '5999-01-01T01:01:01.001Z'
      spyOn(moment.prototype, 'toISOString').and.returnValue(stubbedDate)

      const args = {
        ...sharedArgs,
        value: stubbedDate,
      }

      expect(Validator.validateField(args).count()).toEqual(0)
    })

    it('is valid when the value is one milisecond less than to the current time', () => {
      const stubbedDate = '5999-01-01T01:01:01.001Z'
      spyOn(moment.prototype, 'toISOString').and.returnValue(stubbedDate)

      const args = {
        ...sharedArgs,
        value: moment(stubbedDate).subtract(1, 'milliseconds'),
      }

      expect(Validator.validateField(args).count()).toEqual(0)
    })

    it('is valid when the value is an empty string', () => {
      const args = {
        ...sharedArgs,
        value: '',
      }

      expect(Validator.validateField(args).count()).toEqual(0)
    })

    it('is valid when the value is null', () => {
      const args = {
        ...sharedArgs,
        value: null,
      }

      expect(Validator.validateField(args).count()).toEqual(0)
    })

    it('includes the proper error message when the value is invalid', () => {
      const tomorrow = moment().add(1, 'days').toISOString()

      const args = {
        ...sharedArgs,
        value: tomorrow,
      }

      expect(Validator.validateField(args).first()).toEqual('You are not a time traveler')
    })
  })

  describe('isBeforeOtherDate', () => {
    it('includes the proper error message when the value is invalid', () => {
      const args = {
        value: moment('1999-06-01').toISOString(),
        rules: Immutable.fromJS([{
          rule: 'isBeforeOtherDate',
          message: 'Get it together',
          otherValue: () => (moment('1999-01-01').toISOString()),
        }]),
      }

      expect(Validator.validateField(args).first()).toEqual('Get it together')
    })

    it('is not valid when the value is after the other value', () => {
      const args = {
        rules: Immutable.fromJS([{
          rule: 'isBeforeOtherDate',
          message: 'Get it together',
          otherValue: () => ('1999-01-01T01:01:01.001Z'),
        }]),
        value: '1999-01-01T01:01:01.002Z',
      }

      expect(Validator.validateField(args).count()).toEqual(1)
    })

    it('is not valid when the value and other value are the same', () => {
      const args = {
        rules: Immutable.fromJS([{
          rule: 'isBeforeOtherDate',
          message: 'Get it together',
          otherValue: () => (moment('1999-01-01').toISOString()),
        }]),
        value: moment('1999-01-01').toISOString(),
      }

      expect(Validator.validateField(args).count()).toEqual(1)
    })

    it('is valid when the value is before the other value', () => {
      const args = {
        rules: Immutable.fromJS([{
          rule: 'isBeforeOtherDate',
          message: 'Get it together',
          otherValue: () => '1999-01-01T01:01:01.002Z',
        }]),
        value: '1999-01-01T01:01:01.001Z',
      }

      expect(Validator.validateField(args).count()).toEqual(0)
    })

    describe('when value date is present, but otherValue is not a date', () => {
      it('is valid when the otherValue is empty string', () => {
        const args = {
          rules: Immutable.fromJS([{
            rule: 'isBeforeOtherDate',
            message: 'Get it together',
            otherValue: () => (''),
          }]),
          value: moment('1999-06-01').toISOString(),
        }

        expect(Validator.validateField(args).count()).toEqual(0)
      })

      it('is valid when the otherValue is null', () => {
        const args = {
          rules: Immutable.fromJS([{
            rule: 'isBeforeOtherDate',
            message: 'Get it together',
            otherValue: () => (null),
          }]),
          value: moment('1999-06-01').toISOString(),
        }

        expect(Validator.validateField(args).count()).toEqual(0)
      })
    })

    describe('when otherValue is present, but value is not a date', () => {
      const argsWithOtherValue = {
        rules: Immutable.fromJS([{
          rule: 'isBeforeOtherDate',
          message: 'Get it together',
          otherValue: () => (moment('1999-06-01').toISOString()),
        }]),
      }

      it('is valid when the value is null', () => {
        const args = {
          ...argsWithOtherValue,
          value: null,
        }

        expect(Validator.validateField(args).count()).toEqual(0)
      })

      it('is valid when the value is an empty string', () => {
        const args = {
          ...argsWithOtherValue,
          value: '',
        }

        expect(Validator.validateField(args).count()).toEqual(0)
      })
    })

    describe('when neither value nor otherValue is a date', () => {
      it('is valid when both value and otherValue are empty strings', () => {
        const args = {
          rules: Immutable.fromJS([{
            rule: 'isBeforeOtherDate',
            message: 'Get it together',
            otherValue: () => (''),
          }]),
          value: '',
        }

        expect(Validator.validateField(args).count()).toEqual(0)
      })

      it('is valid when both value and otherValue are null', () => {
        const args = {
          rules: Immutable.fromJS([{
            rule: 'isBeforeOtherDate',
            message: 'Get it together',
            otherValue: () => (null),
          }]),
          value: null,
        }

        expect(Validator.validateField(args).count()).toEqual(0)
      })

      it('is valid when value is empty string and otherValue is null', () => {
        const args = {
          rules: Immutable.fromJS([{
            rule: 'isBeforeOtherDate',
            message: 'Get it together',
            otherValue: () => (null),
          }]),
          value: '',
        }

        expect(Validator.validateField(args).count()).toEqual(0)
      })

      it('is valid when value is null and otherValue is empty string', () => {
        const args = {
          rules: Immutable.fromJS([{
            rule: 'isBeforeOtherDate',
            message: 'Get it together',
            otherValue: () => (''),
          }]),
          value: null,
        }

        expect(Validator.validateField(args).count()).toEqual(0)
      })
    })
  })
})

