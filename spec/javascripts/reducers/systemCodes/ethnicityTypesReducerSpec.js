import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import ethnicityTypesReducer from 'reducers/systemCodes/ethnicityTypesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('ethnicityTypesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_COMPLETE', () => {
    it('returns the system codes for ethnicity types category', () => {
      const action = fetchSuccess([
        {code: '123', value: 'Mexican', category: 'ethnicity_type'},
        {code: 'ABC', value: 'What', category: 'screening_status'},
      ])
      expect(ethnicityTypesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'Mexican', category: 'ethnicity_type'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(ethnicityTypesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})

