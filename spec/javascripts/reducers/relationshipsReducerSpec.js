import * as matchers from 'jasmine-immutable-matchers'
import relationshipsReducer from 'reducers/relationshipsReducer'
import {
  fetchRelationshipsSuccess,
  fetchRelationshipsFailure,
  createScreeningSuccess,
  createScreeningFailure,
} from 'actions/screeningActions'
import {List, fromJS} from 'immutable'

describe('relationshipsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_RELATIONSHIPS_COMPLETE', () => {
    it('returns the relationships from the action on success', () => {
      const relationships = fromJS([{id: 1}, {id: 2}])
      const action = fetchRelationshipsSuccess(relationships.toJS())
      expect(relationshipsReducer(List(), action)).toEqualImmutable(relationships)
    })
    it('returns the last state on failure', () => {
      const oldState = fromJS([{id: 1}])
      const action = fetchRelationshipsFailure()
      expect(relationshipsReducer(oldState, action))
        .toEqual(oldState)
    })
  })

  describe('on CREATE_SCREENING_COMPLETE', () => {
    it('returns an empty immutable list on success', () => {
      const oldState = fromJS([{id: 1}])
      const action = createScreeningSuccess([])
      expect(relationshipsReducer(oldState, action).isEmpty()).toEqual(true)
    })
    it('returns the last state on failure', () => {
      const oldState = fromJS([{id: 1}])
      const action = createScreeningFailure()
      expect(relationshipsReducer(oldState, action))
        .toEqual(oldState)
    })
  })
})
