import involvementsReducer from 'reducers/involvementsReducer'
import {
  fetchHistoryOfInvolvementsSuccess,
  createScreeningSuccess,
} from 'actions/screeningActions'
import {List, fromJS} from 'immutable'

describe('involvementsReducer', () => {
  describe('on FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS', () => {
    it('returns the involvements from the action', () => {
      const involvements = [{id: 1}, {id: 2}]
      const oldState = List()
      const action = fetchHistoryOfInvolvementsSuccess(involvements)
      expect(involvementsReducer(oldState, action).toJS()).toEqual(involvements)
    })
  })

  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns an empty immutable list', () => {
      const action = createScreeningSuccess({})
      const oldState = fromJS({history_of_involvements: [{id: 1}]})
      expect(involvementsReducer(oldState, action)).toEqual(List())
    })
  })
})
