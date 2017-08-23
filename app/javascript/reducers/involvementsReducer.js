import {
  CREATE_SCREENING_SUCCESS,
  FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {List} from 'immutable'

export default createReducer(List(), {
  [CREATE_SCREENING_SUCCESS](_state, _action) { return List() },
  [FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS](_state, action) { return action.history_of_involvements },
})
