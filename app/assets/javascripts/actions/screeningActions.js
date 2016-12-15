import * as Utils from 'utils/http'
import * as types from 'actions/actionTypes'
import Immutable from 'immutable'

export function createScreeningSuccess(screening) {
  return {type: types.CREATE_SCREENING_SUCCESS, screening: Immutable.fromJS(screening)}
}

export function createScreening() {
  return (dispatch) => (
    Utils.request('POST', '/screenings', null, {contentType: 'application/json'})
    .then((jsonResponse) => dispatch(createScreeningSuccess(jsonResponse)))
  )
}

export function fetchScreeningSuccess(screening) {
  return {type: types.FETCH_SCREENING_SUCCESS, screening: Immutable.fromJS(screening)}
}

export function fetchScreening(screeningId) {
  return (dispatch) => (
    Utils.request('GET', `/screenings/${screeningId}.json`, null, {contentType: 'application/json'})
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
      `/screenings/${screening.id}.json`,
      JSON.stringify({screening: screening}),
      {contentType: 'application/json'}
    ).then((jsonResponse) => dispatch(updateScreeningSuccess(jsonResponse)))
  )
}
