import * as types from 'actions/actionTypes'
import * as Utils from 'utils/http'
import Immutable from 'immutable'

export function parseBlankAddresses(person) {
  const addresses = person.addresses
  if (addresses) {
    const blankIndexes = []
    const elementsToRemove = 1
    addresses.map((address, index) => {
      if ((address.street_address === null || address.street_address === '') &&
        (address.city === null || address.city === '') &&
        (address.state === null || address.state === '') &&
        (address.zip === null || address.zip === '') &&
        (address.type === null || address.type === '')) {
        blankIndexes.push(index)
      }
    })
    blankIndexes.reverse().map((indexToDelete) => {
      addresses.splice(indexToDelete, elementsToRemove)
    })
  }
  return {person}
}

export function fetchPersonSuccess(person) {
  return {type: types.FETCH_PERSON_SUCCESS, person: Immutable.fromJS(person)}
}

export function fetchPerson(personId) {
  return (dispatch) =>
    Utils.request('GET', `/people/${personId}.json`)
      .then((jsonResponse) => dispatch(fetchPersonSuccess(jsonResponse)))
}

export function createPersonSuccess(person) {
  return {type: types.CREATE_PERSON_SUCCESS, person: Immutable.fromJS(person)}
}

export function createPerson(person) {
  parseBlankAddresses(person)
  return (dispatch) =>
    Utils.request('POST', '/people.json', JSON.stringify({person: person}), {contentType: 'application/json'})
      .then((jsonResponse) => dispatch(createPersonSuccess(jsonResponse)))
}

export function updatePersonSuccess(person) {
  return {type: types.UPDATE_PERSON_SUCCESS, person: Immutable.fromJS(person)}
}

export function updatePerson(person) {
  parseBlankAddresses(person)
  return (dispatch) => {
    const {id: personId} = person
    return Utils.request('PUT', `/people/${personId}.json`, JSON.stringify({person: person}), {contentType: 'application/json'})
      .then((jsonResponse) => dispatch(updatePersonSuccess(jsonResponse)))
  }
}
