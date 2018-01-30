import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import addressCountiesReducer from 'reducers/systemCodes/addressCountiesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('AddressCountiesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SYSTEM_CODES_COMPLETE', () => {
    it('returns the system codes for counties', () => {
      const action = fetchSuccess([
        {code: '01', value: 'San Francisco', category: 'address_county'},
        {code: '02', value: 'Monterey', category: 'address_county'},
        {code: '03', value: 'Sacramento', category: 'county_type'},
        {code: '99', value: 'State Of California', category: 'address_county'},
      ])
      expect(addressCountiesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '01', value: 'San Francisco', category: 'address_county'},
        {code: '02', value: 'Monterey', category: 'address_county'},
        {code: '99', value: 'State Of California', category: 'address_county'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(addressCountiesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})