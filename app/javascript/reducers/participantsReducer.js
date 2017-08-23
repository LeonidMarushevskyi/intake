import {
  CREATE_SCREENING_SUCCESS,
  FETCH_SCREENING_SUCCESS,
  UPDATE_SCREENING_SUCCESS,
  CREATE_PARTICIPANT_SUCCESS,
  DELETE_PARTICIPANT_SUCCESS,
  UPDATE_PARTICIPANT_SUCCESS,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {List} from 'immutable'

export default createReducer(List(), {
  [CREATE_SCREENING_SUCCESS](state, action) { return action.screening.get('participants') },
  [FETCH_SCREENING_SUCCESS](state, action) { return action.screening.get('participants') },
  [UPDATE_SCREENING_SUCCESS](state, action) { return action.screening.get('participants') },
  [CREATE_PARTICIPANT_SUCCESS](state, action) { return state.unshift(action.participant) },
  [DELETE_PARTICIPANT_SUCCESS](state, action) {
    return state.filterNot((x) => x.get('id') === action.id)
  },
  [UPDATE_PARTICIPANT_SUCCESS](state, action) {
    const participantIndex = state.findIndex((x) => x.get('id') === action.participant.get('id'))
    return state.setIn([participantIndex], action.participant)
  },
})
