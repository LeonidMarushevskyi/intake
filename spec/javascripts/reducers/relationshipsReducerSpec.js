import * as matchers from 'jasmine-immutable-matchers'
import relationshipsReducer from 'reducers/relationshipsReducer'
import {
  fetchRelationshipsByScreeningIdSuccess,
  createScreeningSuccess,
} from 'actions/screeningActions'
import {List, fromJS} from 'immutable'

describe('relationshipsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_RELATIONSHIPS_SUCCESS', () => {
    it('returns the relationships from the action', () => {
      const relationships = fromJS([{id: 1}, {id: 2}])
      const action = fetchRelationshipsByScreeningIdSuccess(relationships.toJS())
      expect(relationshipsReducer(List(), action)).toEqualImmutable(relationships)
    })
  })

  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns an empty immutable list', () => {
      const oldState = fromJS([{id: 1}])
      const action = createScreeningSuccess([])
      expect(relationshipsReducer(oldState, action).isEmpty()).toEqual(true)
    })
  })
})
