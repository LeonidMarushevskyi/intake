import * as types from 'actions/actionTypes'
import * as Utils from 'utils/http'
import Immutable from 'immutable'

export function parseBlankAddresses(person) {
  const addresses = person.addresses
  if (addresses) {
    const addressesToKeep = []
    addresses.map((address) => {
      const fieldsToConsider = [address.street_address, address.city, address.state, address.zip]
      if (fieldsToConsider.join('').trim()) {
        addressesToKeep.push(address)
      }
    })
    person.addresses = addressesToKeep
  }
  return {person}
}

export function parseBlankPhoneNumber(person) {
  const phoneNumbers = person.phone_numbers
  if (phoneNumbers) {
    const phoneNumbersToKeep = []
    phoneNumbers.map((phoneNumber) => {
      if (phoneNumber.number && phoneNumber.number.trim()) {
        phoneNumbersToKeep.push(phoneNumber)
      }
    })
    person.phone_numbers = phoneNumbersToKeep
  }
  return {person}
}

export function fetchPersonSuccess(person) {
  return {type: types.FETCH_PERSON_SUCCESS, person: Immutable.fromJS(person)}
}

export function fetchPerson(personId) {
  return (dispatch) =>
    Utils.request('GET', `/api/v1/people/${personId}`)
      .then((jsonResponse) => dispatch(fetchPersonSuccess(jsonResponse)))
}

export function createPersonSuccess(person) {
  return {type: types.CREATE_PERSON_SUCCESS, person: Immutable.fromJS(person)}
}

export function createPerson(person) {
  parseBlankAddresses(person)
  parseBlankPhoneNumber(person)
  return (dispatch) =>
    Utils.request('POST', '/api/v1/people', JSON.stringify({person: person}), {contentType: 'application/json'})
      .then((jsonResponse) => dispatch(createPersonSuccess(jsonResponse)))
}

export function updatePersonSuccess(person) {
  return {type: types.UPDATE_PERSON_SUCCESS, person: Immutable.fromJS(person)}
}

export function updatePerson(person) {
  parseBlankAddresses(person)
  parseBlankPhoneNumber(person)
  return (dispatch) => {
    const {id: personId} = person
    return Utils.request('PUT', `/api/v1/people/${personId}`, JSON.stringify({person: person}), {contentType: 'application/json'})
      .then((jsonResponse) => dispatch(updatePersonSuccess(jsonResponse)))
  }
}
