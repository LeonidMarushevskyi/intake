import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import allegationTypesReducer from 'reducers/systemCodes/allegationTypesReducer'
import {fetchSuccess} from 'actions/systemCodesActions'

describe('allegationTypesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_SUCCESS', () => {
    it('returns the system codes for allegation_type category', () => {
      const action = fetchSuccess([
        {code: '123', value: 'General Neglect', category: 'allegation_type'},
        {code: '456', value: 'Severe Neglect', category: 'allegation_type'},
        {code: '789', value: 'Physical Abuse', category: 'allegation_type'},
        {code: 'ABC', value: 'What', category: 'screening_status'},
      ])
      expect(allegationTypesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'General Neglect', category: 'allegation_type'},
        {code: '456', value: 'Severe Neglect', category: 'allegation_type'},
        {code: '789', value: 'Physical Abuse', category: 'allegation_type'},
      ]))
    })
  })
})

