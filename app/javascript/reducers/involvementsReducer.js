import {
  CREATE_SCREENING_COMPLETE,
  FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE,
  CLEAR_HISTORY_OF_INVOLVEMENTS,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [CREATE_SCREENING_COMPLETE](state, {error}) {
    if (error) {
      return state
    } else {
      return Map()
    }
  },
  [FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE](state, {payload: {history_of_involvements}, error}) {
    if (error) {
      return state
    } else {
      return fromJS(history_of_involvements)
    }
  },
  [CLEAR_HISTORY_OF_INVOLVEMENTS]() {
    return Map()
  },
})
