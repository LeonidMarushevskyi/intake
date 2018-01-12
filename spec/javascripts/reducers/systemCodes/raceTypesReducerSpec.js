import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import raceTypesReducer from 'reducers/systemCodes/raceTypesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('raceTypesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_COMPLETE', () => {
    it('returns the system codes for race types category', () => {
      const action = fetchSuccess([
        {code: '123', value: 'California', category: 'race_type'},
        {code: 'ABC', value: 'What', category: 'screening_status'},
      ])
      expect(raceTypesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'California', category: 'race_type'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(raceTypesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})

