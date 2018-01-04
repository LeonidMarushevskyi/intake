import {List, Map, fromJS} from 'immutable'
import GENDERS from 'enums/Genders'
import legacySourceFormatter from 'utils/legacySourceFormatter'
import nameFormatter from 'utils/nameFormatter'
import ssnFormatter from 'utils/ssnFormatter'
import {dateFormatter} from 'utils/dateFormatter'
import {flagPrimaryLanguage} from 'common/LanguageInfo'
import US_STATE from 'enums/USState'
import {isRequiredIfCreate, combineCompact} from 'utils/validator'

export const getNamesRequiredSelector = (state, personId) => {
  const person = state.get('participants').find((person) => person.get('id') === personId) || Map()
  const roles = person.get('roles', List())
  return (roles.includes('Victim') || roles.includes('Collateral'))
}

const getAlertMessageByRole = (roles) => {
  if (roles.includes('Victim')) {
    return 'Alleged victims must be identified with a name, even Doe or Unknown, and must be under the age of 18'
  } else if (roles.includes('Collateral')) {
    return 'Collateral must be identified with a name, even Doe or Unknown.'
  }
  return undefined
}

export const getPersonAlertErrorMessageSelector = (state, personId) => {
  const required = getNamesRequiredSelector(state, personId)
  const person = state.get('participants').find((person) => person.get('id') === personId) || Map()
  const lastName = person.get('last_name')
  const firstName = person.get('first_name')
  const roles = person.get('roles', List())
  if (required && !(firstName && lastName)) {
    return getAlertMessageByRole(roles)
  }
  return undefined
}

const VALID_SSN_LENGTH = 9
const SSN_MIDDLE_SECTION_START = 3
const SSN_MIDDLE_SECTION_END = 5

export const getErrorsSelector = (state, personId) => {
  const person = state.get('participants').find((person) => person.get('id') === personId) || Map()
  const ssn = person.get('ssn') || ''
  const ssnWithoutHyphens = ssn.replace(/-|_/g, '')
  const lastName = person.get('last_name')
  const firstName = person.get('first_name')
  const roles = person.get('roles', List())
  return fromJS({
    name: combineCompact(
      isRequiredIfCreate(firstName, 'Please enter a first name.', () => (roles.includes('Victim') || roles.includes('Collateral'))),
      isRequiredIfCreate(lastName, 'Please enter a last name.', () => (roles.includes('Victim') || roles.includes('Collateral')))
    ),
    ssn: combineCompact(
      () => {
        if (ssnWithoutHyphens.length > 0 && ssnWithoutHyphens.length < VALID_SSN_LENGTH) {
          return 'Social security number must be 9 digits long.'
        } else {
          return undefined
        }
      },
      () => {
        if (ssnWithoutHyphens.startsWith('9')) {
          return 'Social security number cannot begin with 9.'
        } else {
          return undefined
        }
      },
      () => {
        if (ssnWithoutHyphens.startsWith('666')) {
          return 'Social security number cannot begin with 666.'
        } else {
          return undefined
        }
      },
      () => {
        if (
          ssnWithoutHyphens.startsWith('000') ||
          ssnWithoutHyphens.endsWith('0000') ||
          ssnWithoutHyphens.substring(SSN_MIDDLE_SECTION_START, SSN_MIDDLE_SECTION_END) === '00'
        ) {
          return 'Social security number cannot contain all 0s in a group.'
        } else {
          return undefined
        }
      }
    ),
  })
}

export const getFormattedPersonInformationSelector = (state, personId) => {
  const person = state.get('participants').find((person) => person.get('id') === personId) || Map()
  const errors = getErrorsSelector(state, personId)
  const legacyDescriptor = person.get('legacy_descriptor')
  const showApproximateAge = !person.get('date_of_birth') && person.get('approximate_age')
  const approximateAge = showApproximateAge ?
    [person.get('approximate_age'), person.get('approximate_age_units')].join(' ') : undefined
  const dateOfBirth = person.get('date_of_birth') && dateFormatter(person.get('date_of_birth'))

  const races = person.get('races') && person.get('races').map((raceInformation) => {
    const race = raceInformation.get('race')
    const raceDetail = raceInformation.get('race_detail')
    const raceDetailText = (raceDetail && ` - ${raceDetail}`) || ''
    return `${race}${raceDetailText}`
  }).join(', ')
  const {hispanic_latino_origin, ethnicity_detail} = person.toJS().ethnicity || {}
  return fromJS({
    approximateAge: approximateAge,
    dateOfBirth: dateOfBirth,
    ethnicity: hispanic_latino_origin && `${hispanic_latino_origin}${(ethnicity_detail.length > 0 && ` - ${ethnicity_detail}`) || ''}`,
    gender: GENDERS[person.get('gender')],
    languages: person.get('languages') && flagPrimaryLanguage((person.toJS().languages) || []).join(', '),
    legacySource: legacyDescriptor && legacySourceFormatter(legacyDescriptor.toJS()),
    name: Map({
      value: nameFormatter(person.toJS()),
      errors: errors.get('name'),
      required: getNamesRequiredSelector(state, personId),
    }),
    races: races,
    roles: person.get('roles', List()),
    ssn: {value: ssnFormatter(person.get('ssn')), errors: errors.get('ssn')},
    alertErrorMessage: getPersonAlertErrorMessageSelector(state, personId),
  })
}

const formattedPhoneNumber = (phoneNumber) => {
  if (phoneNumber) {
    // eslint-disable-next-line no-magic-numbers
    return `(${phoneNumber.substr(0, 3)})${phoneNumber.substr(3, 3)}-${phoneNumber.substr(6, 4)}`
  } else {
    return ''
  }
}

export const getPersonFormattedPhoneNumbersSelector = (state, personId) => (
  state.get('participants', List()).find((person) => person.get('id') === personId)
    .get('phone_numbers', List()).map((phoneNumber) => (
      Map({
        number: formattedPhoneNumber(phoneNumber.get('number')),
        type: phoneNumber.get('type'),
      })
    )
    )
)

const formattedState = (stateCode) => {
  const state = US_STATE.find((state) => state.code === stateCode)
  return state ? state.name : ''
}

export const getPersonFormattedAddressesSelector = (state, personId) => (
  state.get('participants', List()).find((person) => person.get('id') === personId)
    .get('addresses', List()).map((address) => (
      Map({
        street: address.get('street_address'),
        city: address.get('city'),
        state: formattedState(address.get('state')),
        zip: address.get('zip'),
        type: address.get('type'),
      })
    )
    )
)
