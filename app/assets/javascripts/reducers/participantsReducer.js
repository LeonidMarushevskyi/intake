import * as types from 'actions/actionTypes'
import Immutable from 'immutable'

export default function participantsReducer(state = Immutable.List(), action) {
  switch (action.type) {
    case types.CREATE_SCREENING_SUCCESS:
    case types.FETCH_SCREENING_SUCCESS:
    case types.UPDATE_SCREENING_SUCCESS:
      return action.screening.get('participants')
    case types.CREATE_PARTICIPANT_SUCCESS:
      return state.push(action.participant)
    default:
      return state
  }
}
