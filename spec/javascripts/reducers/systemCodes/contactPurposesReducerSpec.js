import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import contactPurposesReducer from 'reducers/systemCodes/contactPurposesReducer'
import {fetchSuccess} from 'actions/systemCodesActions'

describe('contactPurposesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_SUCCESS', () => {
    it('returns the system codes for contact_purpose category', () => {
      const action = fetchSuccess([
        {code: 'S', value: 'Scheduled', category: 'contact_status'},
        {code: '1', value: 'Purpose 1', category: 'contact_purpose'},
        {code: '2', value: 'Purpose 2', category: 'contact_purpose'},
      ])
      expect(contactPurposesReducer(List(), action)).toEqual(fromJS([
        {code: '1', value: 'Purpose 1', category: 'contact_purpose'},
        {code: '2', value: 'Purpose 2', category: 'contact_purpose'},
      ]))
    })
  })
})
