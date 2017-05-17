import relationshipsReducer from 'reducers/relationshipsReducer'
import * as screeningActions from 'actions/screeningActions'
import Immutable from 'immutable'

describe('relationshipsReducer', () => {
  describe('on FETCH_RELATIONSHIPS_SUCCESS', () => {
    it('returns the relationships from the action', () => {
      const relationships = [{id: 1}, {id: 2}]
      const action = screeningActions.fetchRelationshipsByScreeningIdSuccess(relationships)
      expect(relationshipsReducer(Immutable.List(), action).toJS()).toEqual(relationships)
    })
  })

  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns an empty immutable list', () => {
      const action = screeningActions.createScreeningSuccess({})
      expect(relationshipsReducer(Immutable.fromJS({relationships: [{id: 1}]}), action)).toEqual(Immutable.List())
    })
  })
})
