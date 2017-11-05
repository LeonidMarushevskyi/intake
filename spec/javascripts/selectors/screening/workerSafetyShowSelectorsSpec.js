import {List, fromJS} from 'immutable'
import {
  getAlertValuesSelector,
  getInformationValueSelector,
} from 'selectors/screening/workerSafetyShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('workerSafetyShowSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getAlertValuesSelector', () => {
    it('returns a value when one is present', () => {
      const screening = {safety_alerts: ['ABC'], safety_information: 'stuff'}
      const state = fromJS({screening})
      expect(getAlertValuesSelector(state)).
        toEqualImmutable(List(['ABC']))
    })

    it('returns undefined when safety_alerts not present', () => {
      const screening = {}
      const state = fromJS({screening})
      expect(getAlertValuesSelector(state)).
        toEqual(undefined)
    })
  })

  describe('getInformationValueSelector', () => {
    it('returns a value when one is present', () => {
      const screening = {safety_alerts: ['ABC'], safety_information: 'stuff'}
      const state = fromJS({screening})
      expect(getInformationValueSelector(state)).
        toEqual('stuff')
    })

    it('returns undefined when safety_alerts not present', () => {
      const screening = {}
      const state = fromJS({screening})
      expect(getInformationValueSelector(state)).
        toEqual(undefined)
    })
  })
})
