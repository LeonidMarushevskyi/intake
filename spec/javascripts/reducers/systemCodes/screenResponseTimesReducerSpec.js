import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import screenResponseTimesReducer from 'reducers/systemCodes/screenResponseTimesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('screenResponseTimesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SYSTEM_CODES_COMPLETE', () => {
    it('returns the system codes for all categories', () => {
      const action = fetchSuccess([
        {code: '1', value: 'A', category: 'screen_response_time'},
        {code: '2', value: 'A', category: 'us_state'},
        {code: '3', value: 'B', category: 'screen_response_time'},
        {code: '3', value: 'C', category: 'counties'},
      ])
      expect(screenResponseTimesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '1', value: 'A', category: 'screen_response_time'},
        {code: '3', value: 'B', category: 'screen_response_time'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(screenResponseTimesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})

