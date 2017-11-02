import {
  CREATE_SCREENING_COMPLETE,
  FETCH_SCREENING_COMPLETE,
  UPDATE_SCREENING_COMPLETE,
  CREATE_PARTICIPANT_COMPLETE,
  DELETE_PARTICIPANT_COMPLETE,
  UPDATE_PARTICIPANT_COMPLETE,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'

const getParticipantsOnScreening = (state, {payload, error}) => {
  if (error) {
    return state
  } else {
    return fromJS(payload.screening.participants)
  }
}

export default createReducer(List(), {
  [CREATE_SCREENING_COMPLETE]: getParticipantsOnScreening,
  [FETCH_SCREENING_COMPLETE]: getParticipantsOnScreening,
  [UPDATE_SCREENING_COMPLETE]: getParticipantsOnScreening,
  [CREATE_PARTICIPANT_COMPLETE](state, {payload: {participant}, error}) {
    if (error) {
      return state
    } else {
      const newParticipant = fromJS(participant)
      return state.unshift(newParticipant)
    }
  },
  [DELETE_PARTICIPANT_COMPLETE](state, {payload: {id}, error}) {
    if (error) {
      return state
    } else {
      return state.filterNot((x) => x.get('id') === id)
    }
  },
  [UPDATE_PARTICIPANT_COMPLETE](state, {payload: {participant}, error}) {
    if (error) {
      return state
    } else {
      const updatedParticipant = fromJS(participant)
      const participantIndex = state.findIndex((x) => x.get('id') === updatedParticipant.get('id'))
      return state.setIn([participantIndex], updatedParticipant)
    }
  },
})
