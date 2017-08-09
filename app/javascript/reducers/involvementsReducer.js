import * as types from 'actions/actionTypes'
import Immutable from 'immutable'

export default function involvementsReducer(state = Immutable.List(), action) {
  switch (action.type) {
    case types.CREATE_SCREENING_SUCCESS:
      return Immutable.List()
    case types.FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS:
      return action.history_of_involvements
    default:
      return state
  }
}
