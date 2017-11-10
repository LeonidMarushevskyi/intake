import {createSelector} from 'reselect'
import {fromJS, List, Map} from 'immutable'
import {ROLE_TYPE_NON_REPORTER, ROLE_TYPE_REPORTER} from 'enums/RoleType'
export const getPeopleSelector = (state) => state.get('peopleForm')
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import PHONE_NUMBER_TYPE from 'enums/PhoneNumberType'
import ADDRESS_TYPE from 'enums/AddressType'
import US_STATE from 'enums/USState'

export const getPeopleWithEditsSelector = createSelector(
  getPeopleSelector,
  getScreeningIdValueSelector,
  (people, screeningId) => people.map((person, personId) => fromJS({
    screening_id: screeningId,
    id: personId,
    first_name: person.getIn(['first_name', 'value']),
    middle_name: person.getIn(['middle_name', 'value']),
    last_name: person.getIn(['last_name', 'value']),
    name_suffix: person.getIn(['name_suffix', 'value']),
    phone_numbers: person.get('phone_numbers', List()).map((phoneNumber) => Map({
      number: phoneNumber.getIn(['number', 'value']),
      type: phoneNumber.getIn(['type', 'value']),
    })),
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

export const getFilteredPersonRolesSelector = (state, personId) => {
  const selectedRoles = state.getIn(['peopleForm', personId, 'roles', 'value'], List())
  const hasReporterRole = selectedRoles.some((role) => ROLE_TYPE_REPORTER.includes(role))
  return fromJS([
    ...ROLE_TYPE_NON_REPORTER.map((value) => ({label: value, value, disabled: false})),
    ...ROLE_TYPE_REPORTER.map((value) => ({label: value, value, disabled: hasReporterRole})),
  ])
}

export const getAddressTypeOptionsSelector = () => fromJS(ADDRESS_TYPE.map((type) => ({value: type, label: type})))
export const getStateOptionsSelector = () => fromJS(US_STATE.map(({code, name}) => ({value: code, label: name})))

export const getPersonAddressesSelector = (state, personId) => (
  state.get('peopleForm', Map()).get(personId).get('addresses', List()).map((address) => (
    Map({
      street: address.getIn(['street', 'value']) || '',
      city: address.getIn(['city', 'value']) || '',
      state: address.getIn(['state', 'value']) || '',
      zip: address.getIn(['zip', 'value']) || '',
      type: address.getIn(['type', 'value']) || '',
    })
  ))
)
