import {
  CREATE_SCREENING_SUCCESS,
  FETCH_SCREENING_SUCCESS,
  UPDATE_SCREENING_SUCCESS,
  CREATE_PARTICIPANT_SUCCESS,
  DELETE_PARTICIPANT_SUCCESS,
  UPDATE_PARTICIPANT_SUCCESS,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'

const getParticipantsOnScreening = (state, {screening: {participants}}) => (
  fromJS(participants)
)

export default createReducer(List(), {
  [CREATE_SCREENING_SUCCESS]: getParticipantsOnScreening,
  [FETCH_SCREENING_SUCCESS]: getParticipantsOnScreening,
  [UPDATE_SCREENING_SUCCESS]: getParticipantsOnScreening,
  [CREATE_PARTICIPANT_SUCCESS](state, action) {
    const newParticipant = fromJS(action.participant)
    return state.unshift(newParticipant)
  },
  [DELETE_PARTICIPANT_SUCCESS](state, action) {
    return state.filterNot((x) => x.get('id') === action.id)
  },
  [UPDATE_PARTICIPANT_SUCCESS](state, action) {
    const updatedParticipant = fromJS(action.participant)
    const participantIndex = state.findIndex((x) => x.get('id') === updatedParticipant.get('id'))
    return state.setIn([participantIndex], updatedParticipant)
  },
})
