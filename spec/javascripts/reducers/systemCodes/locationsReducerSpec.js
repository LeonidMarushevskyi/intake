import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import locationsReducer from 'reducers/systemCodes/locationsReducer'
import {fetchSuccess} from 'actions/systemCodesActions'

describe('locationsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_SUCCESS', () => {
    it('returns the system codes for location category', () => {
      const action = fetchSuccess([
        {code: '123', value: 'School', category: 'contact_location'},
        {code: '456', value: 'Work', category: 'contact_location'},
        {code: '789', value: 'Home', category: 'contact_location'},
        {code: 'ABC', value: 'What', category: 'screening_status'},
      ])
      expect(locationsReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'School', category: 'contact_location'},
        {code: '456', value: 'Work', category: 'contact_location'},
        {code: '789', value: 'Home', category: 'contact_location'},
      ]))
    })
  })
})

