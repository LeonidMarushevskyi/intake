import {put} from 'utils/http'
import {
  CREATE_SCREENING,
  CREATE_SCREENING_SUCCESS,
  CREATE_SCREENING_FAILURE,
  UPDATE_SCREENING_SUCCESS,
  FETCH_SCREENING,
  FETCH_SCREENING_SUCCESS,
  FETCH_SCREENING_FAILURE,
  CREATE_PARTICIPANT,
  CREATE_PARTICIPANT_SUCCESS,
  CREATE_PARTICIPANT_FAILURE,
  DELETE_PARTICIPANT,
  DELETE_PARTICIPANT_SUCCESS,
  DELETE_PARTICIPANT_FAILURE,
  UPDATE_PARTICIPANT,
  UPDATE_PARTICIPANT_SUCCESS,
  UPDATE_PARTICIPANT_FAILURE,
  FETCH_HISTORY_OF_INVOLVEMENTS,
  FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS,
  FETCH_HISTORY_OF_INVOLVEMENTS_FAILURE,
  FETCH_RELATIONSHIPS,
  FETCH_RELATIONSHIPS_SUCCESS,
  FETCH_RELATIONSHIPS_FAILURE,
  SUBMIT_SCREENING,
  SUBMIT_SCREENING_SUCCESS,
  SUBMIT_SCREENING_FAILURE,
} from 'actions/actionTypes'

export function createScreeningSuccess(screening) {
  return {type: CREATE_SCREENING_SUCCESS, payload: {screening}}
}

export function createScreeningFailure(error) {
  return {type: CREATE_SCREENING_FAILURE, payload: {error}}
}

export function createScreening() {
  return {type: CREATE_SCREENING}
}

export function fetchScreeningSuccess(screening) {
  return {type: FETCH_SCREENING_SUCCESS, payload: {screening}}
}

export function fetchScreeningFailure(error) {
  return {type: FETCH_SCREENING_FAILURE, payload: {error}}
}

export function fetchScreening(id) {
  return {type: FETCH_SCREENING, payload: {id}}
}

export function updateScreeningSuccess(screening) {
  return {type: UPDATE_SCREENING_SUCCESS, payload: {screening}}
}

export function saveScreening(screening) {
  return (dispatch) => (
    put(`/api/v1/screenings/${screening.id}`, {screening})
      .then((jsonResponse) => dispatch(updateScreeningSuccess(jsonResponse)))
  )
}

export function updateParticipantSuccess(participant) {
  return {type: UPDATE_PARTICIPANT_SUCCESS, payload: {participant}}
}

export function updateParticipantFailure(error) {
  return {type: UPDATE_PARTICIPANT_FAILURE, payload: {error}}
}

export function saveParticipant(participant) {
  return {type: UPDATE_PARTICIPANT, payload: {participant}}
}

export function createParticipantSuccess(participant) {
  return {type: CREATE_PARTICIPANT_SUCCESS, payload: {participant}}
}

export function createParticipantFailure(error) {
  return {type: CREATE_PARTICIPANT_FAILURE, payload: {error}}
}

export function createParticipant(participant) {
  return {type: CREATE_PARTICIPANT, payload: {participant}}
}

export function deleteParticipantSuccess(id) {
  return {type: DELETE_PARTICIPANT_SUCCESS, payload: {id}}
}

export function deleteParticipantFailure(error) {
  return {type: DELETE_PARTICIPANT_FAILURE, payload: {error}}
}

export function deleteParticipant(id) {
  return {type: DELETE_PARTICIPANT, payload: {id}}
}

export function fetchHistoryOfInvolvementsSuccess(history_of_involvements) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS, payload: {history_of_involvements}}
}

export function fetchHistoryOfInvolvementsFailure(error) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_FAILURE, payload: {error}}
}

export function fetchHistoryOfInvolvements(id) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS, payload: {id}}
}

export function submitScreeningSuccess(screening) {
  return {type: SUBMIT_SCREENING_SUCCESS, payload: {screening}}
}

export function submitScreeningFailure(error) {
  return {type: SUBMIT_SCREENING_FAILURE, payload: {error}}
}

export function submitScreening(id) {
  return {type: SUBMIT_SCREENING, payload: {id}}
}

export function fetchRelationshipsSuccess(relationships) {
  return {type: FETCH_RELATIONSHIPS_SUCCESS, payload: {relationships}}
}

export function fetchRelationshipsFailure(error) {
  return {type: FETCH_RELATIONSHIPS_FAILURE, payload: {error}}
}

export function fetchRelationships(id) {
  return {type: FETCH_RELATIONSHIPS, payload: {id}}
}
