import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {
  SET_PEOPLE_FORM_FIELD,
  ADD_PEOPLE_FORM_ADDRESS,
  DELETE_PEOPLE_FORM_ADDRESS,
  ADD_PEOPLE_FORM_PHONE_NUMBER,
  DELETE_PEOPLE_FORM_PHONE_NUMBER,
} from 'actions/peopleFormActions'
import {CREATE_PERSON_COMPLETE} from 'actions/personCardActions'

const buildAddresses = (addresses) => {
  if (addresses) {
    return addresses.map(({street_address, city, state, zip, type}) => ({
      street: {value: street_address},
      city: {value: city},
      state: {value: state},
      zip: {value: zip},
      type: {value: type},
    }))
  } else {
    return []
  }
}

const buildPhoneNumbers = (phoneNumbers) => {
  if (phoneNumbers) {
    return phoneNumbers.map(({number, type}) => ({
      number: {value: number},
      type: {value: type},
    }))
  } else {
    return []
  }
}
const buildRaces = (races = []) => races.reduce((racesValue, {race}) => ({
  ...racesValue,
  [race]: {value: true},
}), {})
const buildRaceDetails = (races = []) => races.reduce((racesValue, {race, race_detail}) => ({
  ...racesValue,
  [race]: {value: race_detail},
}), {})

const buildEthnicity = (ethnicity = {}) => {
  const {hispanic_latino_origin = null, ethnicity_detail = []} = ethnicity
  return {
    hispanic_latino_origin: {value: hispanic_latino_origin},
    ethnicity_detail: {value: ethnicity_detail},
  }
}

const buildPerson = ({
  addresses,
  approximate_age,
  approximate_age_units,
  date_of_birth,
  first_name,
  gender,
  languages,
  last_name,
  legacy_descriptor,
  middle_name,
  name_suffix,
  phone_numbers,
  roles,
  ssn,
  sensitive,
  sealed,
  races,
  ethnicity,
}) => fromJS({
  addresses: buildAddresses(addresses),
  approximate_age: {value: approximate_age},
  approximate_age_units: {value: approximate_age_units},
  date_of_birth: {value: date_of_birth},
  first_name: {value: first_name},
  gender: {value: gender},
  languages: {value: languages},
  last_name: {value: last_name},
  legacy_descriptor: {value: legacy_descriptor},
  middle_name: {value: middle_name},
  name_suffix: {value: name_suffix},
  phone_numbers: buildPhoneNumbers(phone_numbers),
  roles: {value: roles},
  ssn: {value: ssn},
  sensitive: {value: sensitive},
  sealed: {value: sealed},
  races: buildRaces(races),
  race_details: buildRaceDetails(races),
  ethnicity: buildEthnicity(ethnicity),
})
export default createReducer(Map(), {
  [CREATE_PERSON_COMPLETE]: (state, {payload: {person}, error}) => {
    if (error) {
      return state
    } else {
      return state.set(person.id, buildPerson(person))
    }
  },
  [FETCH_SCREENING_COMPLETE]: (state, {payload: {screening}, error}) => {
    if (error) {
      return state
    } else {
      return screening.participants.reduce((people, participant) => (
        people.set(participant.id, buildPerson(participant))
      ), Map())
    }
  },
  [SET_PEOPLE_FORM_FIELD]: (state, {payload: {personId, fieldSet, value}}) => state.setIn([personId, ...fieldSet, 'value'], fromJS(value)),
  [ADD_PEOPLE_FORM_ADDRESS]: (state, {payload: {personId}}) => {
    const currentAddresses = state.getIn([personId, 'addresses'])
    const nullValue = {value: null}
    const newAddress = fromJS({
      street: nullValue,
      city: nullValue,
      state: nullValue,
      zip: nullValue,
      type: nullValue,
    })
    return state.setIn([personId, 'addresses'], currentAddresses.push(newAddress))
  },
  [ADD_PEOPLE_FORM_PHONE_NUMBER]: (state, {payload: {personId}}) => {
    const currentPhones = state.getIn([personId, 'phone_numbers'])
    const newPhone = fromJS({number: {value: null}, type: {value: null}})
    return state.setIn([personId, 'phone_numbers'], currentPhones.push(newPhone))
  },
  [DELETE_PEOPLE_FORM_ADDRESS]: (state, {payload: {personId, addressIndex}}) => {
    const currentAddresses = state.getIn([personId, 'addresses'])
    return state.setIn([personId, 'addresses'], currentAddresses.delete(addressIndex))
  },
  [DELETE_PEOPLE_FORM_PHONE_NUMBER]: (state, {payload: {personId, phoneIndex}}) => {
    const currentPhones = state.getIn([personId, 'phone_numbers'])
    return state.setIn([personId, 'phone_numbers'], currentPhones.delete(phoneIndex))
  },
})
