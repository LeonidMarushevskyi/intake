import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import unableToDetermineCodesReducer from 'reducers/systemCodes/unableToDetermineCodesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('unableToDetermineCodesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_COMPLETE', () => {
    it('returns the system codes for unable to determine codes category', () => {
      const action = fetchSuccess([
        {code: '123', value: 'California', category: 'unable_to_determine_code'},
      ])
      expect(unableToDetermineCodesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'California', category: 'unable_to_determine_code'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(unableToDetermineCodesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})

