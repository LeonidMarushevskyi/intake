import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import countyCodesReducer from 'reducers/systemCodes/countyCodesReducer'
import {fetchSuccess} from 'actions/systemCodesActions'

describe('countyCodesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_SUCCESS', () => {
    it('returns the system codes for communication_method category', () => {
      const action = fetchSuccess([
        {code: '123', value: 'San Francisco', category: 'county_type'},
        {code: '456', value: 'Monterey', category: 'county_type'},
        {code: '789', value: 'Sacramento', category: 'address_county'},
        {code: 'ABC', value: 'San Diego', category: 'county_type'},
      ])
      expect(countyCodesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'San Francisco', category: 'county_type'},
        {code: '456', value: 'Monterey', category: 'county_type'},
        {code: 'ABC', value: 'San Diego', category: 'county_type'},
      ]))
    })
  })
})
