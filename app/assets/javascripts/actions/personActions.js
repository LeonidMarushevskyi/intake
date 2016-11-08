import * as types from 'actions/actionTypes'
import * as Utils from 'utils/http'
import Immutable from 'immutable'

export function fetchPersonSuccess(person) {
  return {type: types.FETCH_PERSON_SUCCESS, person}
}

export function fetchPerson(personId) {
  return (dispatch) =>
    Utils.request('GET', `/people/${personId}.json`)
      .then((xhrResp) => {
        dispatch(fetchPersonSuccess(Immutable.fromJS(xhrResp.responseJSON)))
      })
}
