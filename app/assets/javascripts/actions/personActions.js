import * as types from 'actions/actionTypes'
import * as Utils from 'utils/http'
import Immutable from 'immutable'

export function fetchPersonSuccess(person) {
  return {type: types.FETCH_PERSON_SUCCESS, person}
}

export function fetchPerson(personId) {
  return (dispatch) =>
    Utils.request('GET', `/people/${personId}.json`)
      .then((jsonResponse) => {
        dispatch(fetchPersonSuccess(Immutable.fromJS(jsonResponse)))
      })
}

export function createPersonSuccess(person) {
  return {type: types.CREATE_PERSON_SUCCESS, person}
}

export function createPerson(person) {
  return (dispatch) =>
    Utils.request('POST', '/people.json', JSON.stringify(person), {contentType: 'application/json'})
      .then((jsonResponse) => {
        dispatch(createPersonSuccess(Immutable.fromJS(jsonResponse)))
      })
}

export function updatePersonSuccess(person) {
  return {type: types.UPDATE_PERSON_SUCCESS, person}
}

export function updatePerson(person) {
  return (dispatch) => {
    const {person: {id: personId}} = person
    return Utils.request('PUT', `/people/${personId}.json`, person)
      .then((jsonResponse) => {
        dispatch(updatePersonSuccess(Immutable.fromJS(jsonResponse)))
      })
  }
}
