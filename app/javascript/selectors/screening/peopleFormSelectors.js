import selectOptions from 'utils/selectHelper'
import APPROXIMATE_AGE_UNITS from 'enums/ApproximateAgeUnits'
import Genders from 'enums/Genders'
import LANGUAGES from 'enums/Languages'
import {createSelector} from 'reselect'
import {fromJS, List, Map} from 'immutable'
import {ROLE_TYPE_NON_REPORTER, ROLE_TYPE_REPORTER} from 'enums/RoleType'

const formatEnums = (enumObject) =>
  Object.keys(enumObject).map((item) => ({label: enumObject[item], value: item}))

export const getPeopleSelector = (state) => state.get('peopleForm')
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import PHONE_NUMBER_TYPE from 'enums/PhoneNumberType'
import ADDRESS_TYPE from 'enums/AddressType'
import US_STATE from 'enums/USState'
import {RACE_DETAILS} from 'enums/Races'
import {ETHNICITY_DETAILS} from 'enums/Ethnicity'

export const getPeopleWithEditsSelector = createSelector(
  getPeopleSelector,
  getScreeningIdValueSelector,
  (people, screeningId) => people.map((person, personId) => {
    const isAgeDisabled = Boolean(person.getIn(['date_of_birth', 'value']))
    const hispanic_latino_origin = person.getIn(['ethnicity', 'hispanic_latino_origin', 'value'])
    let ethnicity_detail
    if (hispanic_latino_origin === 'Yes') {
      ethnicity_detail = person.getIn(['ethnicity', 'ethnicity_detail', 'value'])
    } else {
      ethnicity_detail = []
    }
    return fromJS({
      screening_id: screeningId,
      id: personId,
      approximate_age: isAgeDisabled ? null : person.getIn(['approximate_age', 'value']),
      approximate_age_units: isAgeDisabled ? null : person.getIn(['approximate_age_units', 'value']),
      date_of_birth: person.getIn(['date_of_birth', 'value']),
      first_name: person.getIn(['first_name', 'value']),
      gender: person.getIn(['gender', 'value']),
      languages: person.getIn(['languages', 'value']),
      legacy_descriptor: person.getIn(['legacy_descriptor', 'value']),
      middle_name: person.getIn(['middle_name', 'value']),
      last_name: person.getIn(['last_name', 'value']),
      name_suffix: person.getIn(['name_suffix', 'value']),
      phone_numbers: person.get('phone_numbers', List()).map((phoneNumber) => Map({
        number: phoneNumber.getIn(['number', 'value']),
        type: phoneNumber.getIn(['type', 'value']),
      })),
      addresses: person.get('addresses', List()).map((address) => Map({
        street_address: address.getIn(['street', 'value']),
        city: address.getIn(['city', 'value']),
        state: address.getIn(['state', 'value']),
        zip: address.getIn(['zip', 'value']),
        type: address.getIn(['type', 'value']),
      })),
      roles: person.getIn(['roles', 'value']),
      ssn: person.getIn(['ssn', 'value']),
      ethnicity: {hispanic_latino_origin, ethnicity_detail},
      races: person.get('races', Map()).reduce((races, raceValue, raceKey) => {
        const raceDetails = person.getIn(['race_details', raceKey, 'value'], null)
        if (raceValue.get('value')) {
          return [...races, {race: raceKey, race_detail: raceDetails}]
        } else {
          return races
        }
      }, []),
    })
  })
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

export const getIsApproximateAgeDisabledSelector = (state, personId) => (
  Boolean(state.getIn(['peopleForm', personId, 'date_of_birth', 'value']))
)

export const getApproximateAgeUnitOptionsSelector = () => fromJS(formatEnums(APPROXIMATE_AGE_UNITS))
export const getLanguageOptionsSelector = () => fromJS(selectOptions(LANGUAGES))
export const getGenderOptionsSelector = () => fromJS(formatEnums(Genders))

export const getPersonDemographicsSelector = (state, personId) => {
  const person = state.getIn(['peopleForm', personId], Map())
  return fromJS({
    approximateAge: person.getIn(['approximate_age', 'value']) || '',
    approximateAgeUnit: person.getIn(['approximate_age_units', 'value']) || 'years',
    dateOfBirth: person.getIn(['date_of_birth', 'value']) || '',
    gender: person.getIn(['gender', 'value']) || '',
    languages: person.getIn(['languages', 'value']) || [],
  })
}

export const getPersonRacesSelector = (state, personId) => {
  const personRaces = state.getIn(['peopleForm', personId, 'races'])
  return Object.keys(RACE_DETAILS).reduce(
    (races, race) => races.set(race, personRaces.getIn([race, 'value'], false)),
    Map()
  )
}
export const getPersonRaceDetailsSelector = (state, personId) => {
  const personRaces = state.getIn(['peopleForm', personId, 'race_details'])
  return Object.keys(RACE_DETAILS).reduce(
    (races, race) => races.set(race, personRaces.getIn([race, 'value'], '')),
    Map()
  )
}

export const getAreEthnicityFieldsDisabledForPersonSelector = (state, personId) => (
  Boolean(state.getIn(['peopleForm', personId, 'ethnicity', 'hispanic_latino_origin', 'value']))
)

export const getPersonHispanicLatinoOriginValueSelector = (state, personId) => (
  state.getIn(['peopleForm', personId, 'ethnicity', 'hispanic_latino_origin', 'value'])
)

export const getEthnicityDetailOptionsSelector = () => (
  fromJS(ETHNICITY_DETAILS.map((detail) => ({value: detail, label: detail})))
)

export const getPersonEthnicityDetaiValueSelector = (state, personId) => (
  state.getIn(['peopleForm', personId, 'ethnicity', 'ethnicity_detail', 'value', 0])
)
export const getIsRaceIndeterminateValueSelector = (state, personId) => {
  const isUnknown =
    state.getIn(['peopleForm', personId, 'races', 'Unknown', 'value'])
  const isAbandoned =
    state.getIn(['peopleForm', personId, 'races', 'Abandoned', 'value'])
  const isDeclinedToAnswer =
    state.getIn(['peopleForm', personId, 'races', 'Declined to answer', 'value'])

  return Boolean(isUnknown || isAbandoned || isDeclinedToAnswer)
}
