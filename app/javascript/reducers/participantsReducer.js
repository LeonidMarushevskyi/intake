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

const getParticipantsOnScreening = (state, {payload: {screening: {participants}}}) => (
  fromJS(participants)
)

export default createReducer(List(), {
  [CREATE_SCREENING_SUCCESS]: getParticipantsOnScreening,
  [FETCH_SCREENING_SUCCESS]: getParticipantsOnScreening,
  [UPDATE_SCREENING_SUCCESS]: getParticipantsOnScreening,
  [CREATE_PARTICIPANT_SUCCESS](state, {payload: {participant}}) {
    const newParticipant = fromJS(participant)
    return state.unshift(newParticipant)
  },
  [DELETE_PARTICIPANT_SUCCESS](state, {payload: {id}}) {
    return state.filterNot((x) => x.get('id') === id)
  },
  [UPDATE_PARTICIPANT_SUCCESS](state, {payload: {participant}}) {
    const updatedParticipant = fromJS(participant)
    const participantIndex = state.findIndex((x) => x.get('id') === updatedParticipant.get('id'))
    return state.setIn([participantIndex], updatedParticipant)
  },
})
