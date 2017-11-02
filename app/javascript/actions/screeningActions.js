import {put} from 'utils/http'
import {
  CREATE_SCREENING,
  CREATE_SCREENING_COMPLETE,
  UPDATE_SCREENING_COMPLETE,
  FETCH_SCREENING,
  FETCH_SCREENING_COMPLETE,
  CREATE_PARTICIPANT,
  CREATE_PARTICIPANT_COMPLETE,
  DELETE_PARTICIPANT,
  DELETE_PARTICIPANT_COMPLETE,
  UPDATE_PARTICIPANT,
  UPDATE_PARTICIPANT_COMPLETE,
  FETCH_HISTORY_OF_INVOLVEMENTS,
  FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE,
  FETCH_RELATIONSHIPS,
  FETCH_RELATIONSHIPS_COMPLETE,
  SUBMIT_SCREENING,
  SUBMIT_SCREENING_COMPLETE,
} from 'actions/actionTypes'

export function createScreeningSuccess(screening) {
  return {type: CREATE_SCREENING_COMPLETE, payload: {screening}}
}

export function createScreeningFailure(error) {
  return {type: CREATE_SCREENING_COMPLETE, payload: {error}, error: true}
}

export function createScreening() {
  return {type: CREATE_SCREENING}
}

export function fetchScreeningSuccess(screening) {
  return {type: FETCH_SCREENING_COMPLETE, payload: {screening}}
}

export function fetchScreeningFailure(error) {
  return {type: FETCH_SCREENING_COMPLETE, payload: {error}, error: true}
}

export function fetchScreening(id) {
  return {type: FETCH_SCREENING, payload: {id}}
}

export function updateScreeningSuccess(screening) {
  return {type: UPDATE_SCREENING_COMPLETE, payload: {screening}}
}

export function saveScreening(screening) {
  return (dispatch) => (
    put(`/api/v1/screenings/${screening.id}`, {screening})
      .then((jsonResponse) => dispatch(updateScreeningSuccess(jsonResponse)))
  )
}

export function updateParticipantSuccess(participant) {
  return {type: UPDATE_PARTICIPANT_COMPLETE, payload: {participant}}
}

export function updateParticipantFailure(error) {
  return {type: UPDATE_PARTICIPANT_COMPLETE, payload: {error}, error: true}
}

export function saveParticipant(participant) {
  return {type: UPDATE_PARTICIPANT, payload: {participant}}
}

export function createParticipantSuccess(participant) {
  return {type: CREATE_PARTICIPANT_COMPLETE, payload: {participant}}
}

export function createParticipantFailure(error) {
  return {type: CREATE_PARTICIPANT_COMPLETE, payload: {error}, error: true}
}

export function createParticipant(participant) {
  return {type: CREATE_PARTICIPANT, payload: {participant}}
}

export function deleteParticipantSuccess(id) {
  return {type: DELETE_PARTICIPANT_COMPLETE, payload: {id}}
}

export function deleteParticipantFailure(error) {
  return {type: DELETE_PARTICIPANT_COMPLETE, payload: {error}, error: true}
}

export function deleteParticipant(id) {
  return {type: DELETE_PARTICIPANT, payload: {id}}
}

export function fetchHistoryOfInvolvementsSuccess(history_of_involvements) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE, payload: {history_of_involvements}}
}

export function fetchHistoryOfInvolvementsFailure(error) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE, payload: {error}, error: true}
}

export function fetchHistoryOfInvolvements(id) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS, payload: {id}}
}

export function submitScreeningSuccess(screening) {
  return {type: SUBMIT_SCREENING_COMPLETE, payload: {screening}}
}

export function submitScreeningFailure(error) {
  return {type: SUBMIT_SCREENING_COMPLETE, payload: {error}, error: true}
}

export function submitScreening(id) {
  return {type: SUBMIT_SCREENING, payload: {id}}
}

export function fetchRelationshipsSuccess(relationships) {
  return {type: FETCH_RELATIONSHIPS_COMPLETE, payload: {relationships}}
}

export function fetchRelationshipsFailure(error) {
  return {type: FETCH_RELATIONSHIPS_COMPLETE, payload: {error}, error: true}
}

export function fetchRelationships(id) {
  return {type: FETCH_RELATIONSHIPS, payload: {id}}
}
