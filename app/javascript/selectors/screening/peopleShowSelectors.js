import GENDERS from 'enums/Genders'
import legacySourceFormatter from 'utils/legacySourceFormatter'
import nameFormatter from 'utils/nameFormatter'
import ssnFormatter from 'utils/ssnFormatter'
import {fromJS} from 'immutable'
import {dateFormatter} from 'utils/dateFormatter'
import {flagPrimaryLanguage} from 'common/LanguageInfo'

export const getFormattedPersonInformationSelector = (state, personId) => {
  const person = state.get('participants').find((person) => person.get('id') === personId) || fromJS({})
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
    ethnicity: hispanic_latino_origin && `${hispanic_latino_origin}${(ethnicity_detail && ` - ${ethnicity_detail}`) || ''}`,
    gender: GENDERS[person.get('gender')],
    languages: person.get('languages') && flagPrimaryLanguage((person.toJS().languages) || []).join(', '),
    legacySource: legacyDescriptor && legacySourceFormatter(legacyDescriptor.toJS()),
    name: nameFormatter(person.toJS()),
    races: races,
    roles: person.get('roles', []),
    ssn: person.get('ssn') && ssnFormatter(person.get('ssn')),
  })
}