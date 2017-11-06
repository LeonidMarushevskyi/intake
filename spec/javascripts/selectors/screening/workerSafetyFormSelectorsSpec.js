import {fromJS, List} from 'immutable'
import {
  getAlertValuesSelector,
  getInformationValueSelector,
  getScreeningWithEditsSelector,
} from 'selectors/screening/workerSafetyFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('workerSafetyFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getAlertValuesSelector', () => {
    it('returns a value when one is present', () => {
      const workerSafetyForm = {safety_alerts: {value: ['ABC']}}
      const state = fromJS({workerSafetyForm})
      expect(getAlertValuesSelector(state)).toEqual(List(['ABC']))
    })

    it('returns undefined when safety alerts is not present', () => {
      const workerSafetyForm = {}
      const state = fromJS({workerSafetyForm})
      expect(getAlertValuesSelector(state)).toEqual(undefined)
    })
  })

  describe('getInformationValueSelector', () => {
    it('returns a value when one is present', () => {
      const workerSafetyForm = {safety_information: {value: 'ABC'}}
      const state = fromJS({workerSafetyForm})
      expect(getInformationValueSelector(state)).toEqual('ABC')
    })

    it('returns undefined when safety information is not present', () => {
      const workerSafetyForm = {}
      const state = fromJS({workerSafetyForm})
      expect(getInformationValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getScreeningWithEditsSelector', () => {
    it('returns a screening with updated safety fields if the form has a value', () => {
      const screening = {safety_alerts: ['ABC'], safety_information: 'DEF'}
      const workerSafetyForm = {
        safety_alerts: {value: ['123'], touched: true},
        safety_information: {value: '456', touched: true},
      }
      const state = fromJS({screening, workerSafetyForm})
      expect(getScreeningWithEditsSelector(state))
        .toEqualImmutable(fromJS({safety_alerts: List(['123']), safety_information: '456'}))
    })
  })
})
