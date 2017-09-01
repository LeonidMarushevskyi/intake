import {post, put} from 'utils/http'
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
  SUBMIT_SCREENING_SUCCESS,
  SUBMIT_SCREENING_FAILURE,
} from 'actions/actionTypes'

export function createScreeningSuccess(screening) {
  return {type: CREATE_SCREENING_SUCCESS, screening}
}

export function createScreeningFailure(error) {
  return {type: CREATE_SCREENING_FAILURE, error}
}

export function createScreening() {
  return (dispatch) => dispatch({type: CREATE_SCREENING})
}

export function fetchScreeningSuccess(screening) {
  return {type: FETCH_SCREENING_SUCCESS, screening}
}

export function fetchScreeningFailure(error) {
  return {type: FETCH_SCREENING_FAILURE, error}
}

export function fetchScreening(id) {
  return (dispatch) => dispatch({type: FETCH_SCREENING, id})
}

export function updateScreeningSuccess(screening) {
  return {type: UPDATE_SCREENING_SUCCESS, screening}
}

export function saveScreening(screening) {
  return (dispatch) => (
    put(`/api/v1/screenings/${screening.id}`, {screening})
      .then((jsonResponse) => dispatch(updateScreeningSuccess(jsonResponse)))
  )
}

export function updateParticipantSuccess(participant) {
  return {type: UPDATE_PARTICIPANT_SUCCESS, participant}
}

export function updateParticipantFailure(error) {
  return {type: UPDATE_PARTICIPANT_FAILURE, error}
}

export function saveParticipant(participant) {
  return (dispatch) => dispatch({type: UPDATE_PARTICIPANT, participant})
}

export function createParticipantSuccess(participant) {
  return {type: CREATE_PARTICIPANT_SUCCESS, participant}
}

export function createParticipantFailure(error) {
  return {type: CREATE_PARTICIPANT_FAILURE, error}
}

export function createParticipant(participant) {
  return (dispatch) => dispatch({type: CREATE_PARTICIPANT, participant})
}

export function deleteParticipantSuccess(id) {
  return {type: DELETE_PARTICIPANT_SUCCESS, id}
}

export function deleteParticipantFailure(error) {
  return {type: DELETE_PARTICIPANT_FAILURE, error}
}

export function deleteParticipant(id) {
  return (dispatch) => dispatch({type: DELETE_PARTICIPANT, id})
}

export function fetchHistoryOfInvolvementsSuccess(history_of_involvements) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS, history_of_involvements}
}

export function fetchHistoryOfInvolvementsFailure(error) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_FAILURE, error}
}

export function fetchHistoryOfInvolvements(id) {
  return (dispatch) => dispatch({type: FETCH_HISTORY_OF_INVOLVEMENTS, id})
}

export function submitScreeningSuccess(screening) {
  const referralId = screening.referral_id
  /* eslint-disable no-alert */
  alert(`Successfully created referral ${referralId}`)
  /* eslint-enable no-alert */
  return {type: SUBMIT_SCREENING_SUCCESS, screening}
}

export function submitScreeningFailure(jsonResponse) {
  /* eslint-disable no-alert */
  alert(jsonResponse.responseText)
  /* eslint-enable no-alert */
  return {type: SUBMIT_SCREENING_FAILURE}
}

export function submitScreening(screeningId) {
  return (dispatch) => (
    post(`/api/v1/screenings/${screeningId}/submit`, null)
      .then(
        (jsonResponse) => { dispatch(submitScreeningSuccess(jsonResponse)) },
        (jsonResponse) => { dispatch(submitScreeningFailure(jsonResponse)) }
      )
  )
}

export function fetchRelationshipsSuccess(relationships) {
  return {type: FETCH_RELATIONSHIPS_SUCCESS, relationships}
}

export function fetchRelationshipsFailure(error) {
  return {type: FETCH_RELATIONSHIPS_FAILURE, error}
}

export function fetchRelationships(id) {
  return (dispatch) => dispatch({type: FETCH_RELATIONSHIPS, id})
}
