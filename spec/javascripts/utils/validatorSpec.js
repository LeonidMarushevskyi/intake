import Immutable from 'immutable'
import * as Validator from 'utils/validator'

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
})

