import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {
  SET_PEOPLE_FORM_FIELD,
  ADD_PEOPLE_FORM_PHONE_NUMBER,
  DELETE_PEOPLE_FORM_PHONE_NUMBER,
} from 'actions/peopleFormActions'
import {CREATE_PERSON_COMPLETE} from 'actions/personCardActions'

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

const buildPerson = ({
  first_name,
  last_name,
  legacy_descriptor,
  middle_name,
  name_suffix,
  phone_numbers,
  roles,
  ssn,
}) => fromJS({
  first_name: {value: first_name},
  last_name: {value: last_name},
  legacy_descriptor: {value: legacy_descriptor},
  middle_name: {value: middle_name},
  name_suffix: {value: name_suffix},
  phone_numbers: buildPhoneNumbers(phone_numbers),
  roles: {value: roles},
  ssn: {value: ssn},
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
  [ADD_PEOPLE_FORM_PHONE_NUMBER]: (state, {payload: {personId}}) => {
    const currentPhones = state.getIn([personId, 'phone_numbers'])
    const newPhone = fromJS({number: {value: null}, type: {value: null}})
    return state.setIn([personId, 'phone_numbers'], currentPhones.push(newPhone))
  },
  [DELETE_PEOPLE_FORM_PHONE_NUMBER]: (state, {payload: {personId, phoneIndex}}) => {
    const currentPhones = state.getIn([personId, 'phone_numbers'])
    return state.setIn([personId, 'phone_numbers'], currentPhones.delete(phoneIndex))
  },
})
