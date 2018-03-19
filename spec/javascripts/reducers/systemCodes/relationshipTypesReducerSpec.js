import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import relationshipTypesReducer from 'reducers/systemCodes/relationshipTypesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('relationshipTypesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SYSTEM_CODES_COMPLETE', () => {
    it('returns the relationship type system codes', () => {
      const action = fetchSuccess([
        {code: '245', value: 'Mother (Adoptive)', category: 'relationship_type'},
        {code: '456', value: 'Monterey', category: 'county_type'},
      ])
      expect(relationshipTypesReducer(List(), action)).toEqualImmutable(fromJS([
        {code: '245', value: 'Mother (Adoptive)', category: 'relationship_type'},
      ]))
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(relationshipTypesReducer(List(), action)).toEqualImmutable(List())
    })
  })
})
