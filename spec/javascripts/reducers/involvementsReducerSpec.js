import involvementsReducer from 'reducers/involvementsReducer'
import * as screeningActions from 'actions/screeningActions'
import Immutable from 'immutable'

describe('involvementsReducer', () => {
  describe('on FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS', () => {
    it('returns the involvements from the action', () => {
      const involvements = [{id: 1}, {id: 2}]
      const action = screeningActions.fetchHistoryOfInvolvementsSuccess(involvements)
      expect(involvementsReducer(Immutable.List(), action).toJS()).toEqual(involvements)
    })
  })

  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns an empty immutable list', () => {
      const action = screeningActions.createScreeningSuccess({})
      expect(involvementsReducer(Immutable.fromJS({history_of_involvements: [{id: 1}]}), action)).toEqual(Immutable.List())
    })
  })
})
