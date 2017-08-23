import relationshipsReducer from 'reducers/relationshipsReducer'
import {
  fetchRelationshipsByScreeningIdSuccess,
  createScreeningSuccess,
} from 'actions/screeningActions'
import {List, fromJS} from 'immutable'

describe('relationshipsReducer', () => {
  describe('on FETCH_RELATIONSHIPS_SUCCESS', () => {
    it('returns the relationships from the action', () => {
      const relationships = [{id: 1}, {id: 2}]
      const action = fetchRelationshipsByScreeningIdSuccess(relationships)
      expect(relationshipsReducer(List(), action).toJS()).toEqual(relationships)
    })
  })

  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns an empty immutable list', () => {
      const action = createScreeningSuccess({})
      expect(relationshipsReducer(fromJS({relationships: [{id: 1}]}), action)).toEqual(List())
    })
  })
})
