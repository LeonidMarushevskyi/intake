import {
  CREATE_SCREENING_COMPLETE,
  FETCH_SCREENING_COMPLETE,
  UPDATE_SCREENING_COMPLETE,
} from 'actions/actionTypes'
import {
  CREATE_PERSON_COMPLETE,
  DELETE_PERSON_COMPLETE,
  UPDATE_PERSON_COMPLETE,
} from 'actions/personCardActions'
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
  [CREATE_PERSON_COMPLETE](state, {payload: {participant}, error}) {
    if (error) {
      return state
    } else {
      const newParticipant = fromJS(participant)
      return state.unshift(newParticipant)
    }
  },
  [DELETE_PERSON_COMPLETE](state, {payload: {id}, error}) {
    if (error) {
      return state
    } else {
      return state.filterNot((x) => x.get('id') === id)
    }
  },
  [UPDATE_PERSON_COMPLETE](state, {payload: {participant}, error}) {
    if (error) {
      return state
    } else {
      const updatedParticipant = fromJS(participant)
      const participantIndex = state.findIndex((x) => x.get('id') === updatedParticipant.get('id'))
      return state.setIn([participantIndex], updatedParticipant)
    }
  },
})
