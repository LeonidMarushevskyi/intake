import * as Utils from 'utils/http'
import * as types from 'actions/actionTypes'
import Immutable from 'immutable'

export function createScreeningSuccess(screening) {
  return {type: types.CREATE_SCREENING_SUCCESS, screening: Immutable.fromJS(screening)}
}

export function createScreening() {
  return (dispatch) => (
    Utils.request('POST', '/api/v1/screenings', null, {contentType: 'application/json'})
    .then((jsonResponse) => dispatch(createScreeningSuccess(jsonResponse)))
  )
}

export function fetchScreeningSuccess(screening) {
  return {type: types.FETCH_SCREENING_SUCCESS, screening: Immutable.fromJS(screening)}
}

export function fetchScreening(screeningId) {
  return (dispatch) => (
    Utils.request('GET', `/api/v1/screenings/${screeningId}`, null, {contentType: 'application/json'})
    .then((jsonResponse) => dispatch(fetchScreeningSuccess(jsonResponse)))
  )
}

export function updateScreeningSuccess(screening) {
  return {type: types.UPDATE_SCREENING_SUCCESS, screening: Immutable.fromJS(screening)}
}

export function saveScreening(screening) {
  return (dispatch) => (
    Utils.request(
      'PUT',
      `/api/v1/screenings/${screening.id}`,
      JSON.stringify({screening: screening}),
      {contentType: 'application/json'}
    ).then((jsonResponse) => dispatch(updateScreeningSuccess(jsonResponse)))
  )
}

export function updateParticipantSuccess(participant) {
  return {type: types.UPDATE_PARTICIPANT_SUCCESS, participant: Immutable.fromJS(participant)}
}

export function saveParticipant(participant) {
  return (dispatch) => (
    Utils.request(
      'PUT',
        `/api/v1/participants/${participant.id}`,
        JSON.stringify({participant: participant}),
        {contentType: 'application/json'}
    )
    .then((jsonResponse) => dispatch(updateParticipantSuccess(jsonResponse)))
  )
}

export function createParticipantSuccess(participant) {
  return {type: types.CREATE_PARTICIPANT_SUCCESS, participant: Immutable.fromJS(participant)}
}

export function createParticipant(participant) {
  return (dispatch) => (
    Utils.request(
      'POST',
      '/api/v1/participants',
      JSON.stringify({participant: participant}),
      {contentType: 'application/json'}
    )
    .then((jsonResponse) => {
      dispatch(createParticipantSuccess(jsonResponse))
    })
  )
}

export function deleteParticipantSuccess(id) {
  return {type: types.DELETE_PARTICIPANT_SUCCESS, id: id}
}

export function deleteParticipant(id) {
  return (dispatch) => (
    Utils.request(
      'DELETE',
        `/api/v1/participants/${id}`,
        null,
        {contentType: 'application/json'}
    )
    .then(() => dispatch(deleteParticipantSuccess(id)))
  )
}

export function fetchHistoryOfInvolvementsSuccess(history_of_involvements) {
  return {
    type: types.FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS,
    history_of_involvements: Immutable.fromJS(history_of_involvements),
  }
}

export function fetchHistoryOfInvolvements(screeningId) {
  return (dispatch) => (
    Utils.request(
      'GET',
        `/api/v1/screenings/${screeningId}/history_of_involvements`,
        null,
        {contentType: 'application/json'}
    )
    .then((jsonResponse) => dispatch(fetchHistoryOfInvolvementsSuccess(jsonResponse)))
  )
}

export function submitScreeningSuccess() {
  return {
    type: types.SUBMIT_SCREENING_SUCCESS,
  }
}

export function submitScreening(screeningId) {
  return (dispatch) => (
    Utils.request(
      'POST',
        `/api/v1/screenings/${screeningId}/submit`,
        null,
        {contentType: 'application/json'}
    )
    .then(
      (jsonResponse) => {
        /* eslint-disable no-alert */
        alert('Successfully submitted screening')
        dispatch(submitScreeningSuccess(jsonResponse))
      },
      (jsonResponse) => alert(jsonResponse.responseText)
      /* eslint-enable no-alert */
    )
  )
}

