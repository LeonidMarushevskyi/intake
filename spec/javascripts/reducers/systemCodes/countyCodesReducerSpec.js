import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import countiesReducer from 'reducers/systemCodes/countiesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('countiesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SYSTEM_CODES_COMPLETE', () => {
    it('returns the system codes for counties', () => {
      const action = fetchSuccess([
        {code: '123', value: 'San Francisco', category: 'county_type'},
        {code: '456', value: 'Monterey', category: 'county_type'},
        {code: '789', value: 'Sacramento', category: 'address_county'},
        {code: 'ABC', value: 'San Diego', category: 'county_type'},
      ])
      expect(countiesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'San Francisco', category: 'county_type'},
        {code: '456', value: 'Monterey', category: 'county_type'},
        {code: 'ABC', value: 'San Diego', category: 'county_type'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(countiesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})
