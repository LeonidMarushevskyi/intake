import {
  CREATE_SCREENING_COMPLETE,
  FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'

export default createReducer(List(), {
  [CREATE_SCREENING_COMPLETE](state, {error}) {
    if (error) {
      return state
    } else {
      return List()
    }
  },
  [FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE](state, {payload: {history_of_involvements}, error}) {
    if (error) {
      return state
    } else {
      return fromJS(history_of_involvements)
    }
  },
})
