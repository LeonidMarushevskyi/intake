import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import communicationMethodsReducer from 'reducers/systemCodes/communicationMethodsReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('communicationMethodsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_STATUS_CODES_COMPLETE', () => {
    it('returns the system codes for communication_method category', () => {
      const action = fetchSuccess([
        {code: '123', value: 'Phone', category: 'communication_method'},
        {code: '456', value: 'Mail', category: 'communication_method'},
        {code: '789', value: 'In Person', category: 'communication_method'},
        {code: 'ABC', value: 'What', category: 'screening_status'},
      ])
      expect(communicationMethodsReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '123', value: 'Phone', category: 'communication_method'},
        {code: '456', value: 'Mail', category: 'communication_method'},
        {code: '789', value: 'In Person', category: 'communication_method'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(communicationMethodsReducer(List(), action)).toEqualImmutable(List())
    })
  })
})
