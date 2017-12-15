import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import usStatesReducer from 'reducers/systemCodes/usStatesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('usStatesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_COMPLETE', () => {
    it('returns the system codes for ethnicity types category', () => {
      const action = fetchSuccess([
        {code: '123', value: 'California', category: 'us_state'},
        {code: 'ABC', value: 'What', category: 'screening_status'},
      ])
      expect(usStatesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'California', category: 'us_state'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(usStatesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})

