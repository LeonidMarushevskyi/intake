import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import addressTypesReducer from 'reducers/systemCodes/addressTypesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('addressTypesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_COMPLETE', () => {
    it('returns the system codes for counties', () => {
      const action = fetchSuccess([
        {code: '123', value: 'Home', category: 'address_type'},
        {code: '456', value: 'Monterey', category: 'county_type'},
      ])
      expect(addressTypesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'Home', category: 'address_type'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(addressTypesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})
