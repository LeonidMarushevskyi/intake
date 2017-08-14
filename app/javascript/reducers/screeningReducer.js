import * as types from 'actions/actionTypes'
import Immutable from 'immutable'

export default function screeningReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case types.CREATE_SCREENING_SUCCESS:
    case types.FETCH_SCREENING_SUCCESS:
    case types.UPDATE_SCREENING_SUCCESS:
    case types.SUBMIT_SCREENING_SUCCESS:
      return action.screening
    default:
      return state
  }
}
