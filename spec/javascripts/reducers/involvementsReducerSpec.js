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
})
