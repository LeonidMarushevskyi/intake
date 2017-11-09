import {createSelector} from 'reselect'
import {fromJS, List, Map} from 'immutable'
export const getPeopleSelector = (state) => state.get('peopleForm')
import PHONE_NUMBER_TYPE from 'enums/PhoneNumberType'

export const getPeopleWithEditsSelector = createSelector(
  getPeopleSelector,
  (people) => people.map((person, personId) => fromJS({
    id: personId,
    first_name: person.getIn(['first_name', 'value']),
    middle_name: person.getIn(['middle_name', 'value']),
    last_name: person.getIn(['last_name', 'value']),
    name_suffix: person.getIn(['name_suffix', 'value']),
    roles: person.getIn(['roles', 'value']),
    ssn: person.getIn(['ssn', 'value']),
  }))
)

export const getPhoneNumberTypeOptions = () => fromJS(PHONE_NUMBER_TYPE.map((type) => ({value: type, label: type})))

export const getPersonPhoneNumbersSelector = (state, personId) => (
  state.get('peopleForm', Map()).get(personId).get('phone_numbers', List()).map((phoneNumber) => (
    Map({
      number: phoneNumber.getIn(['number', 'value']) || '',
      type: phoneNumber.getIn(['type', 'value']) || '',
    })
  ))
)
