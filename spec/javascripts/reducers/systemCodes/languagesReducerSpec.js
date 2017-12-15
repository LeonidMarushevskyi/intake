import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import languagesReducer from 'reducers/systemCodes/languagesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('languagesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_COMPLETE', () => {
    it('returns the system codes for ethnicity types category', () => {
      const action = fetchSuccess([
        {code: '123', value: 'English', category: 'language'},
        {code: 'ABC', value: 'What', category: 'screening_status'},
      ])
      expect(languagesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'English', category: 'language'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(languagesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})

