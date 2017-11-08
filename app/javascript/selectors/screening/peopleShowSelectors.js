import GENDERS from 'enums/Genders'
import legacySourceFormatter from 'utils/legacySourceFormatter'
import nameFormatter from 'utils/nameFormatter'
import ssnFormatter from 'utils/ssnFormatter'
import {fromJS} from 'immutable'
import {dateFormatter} from 'utils/dateFormatter'
import {flagPrimaryLanguage} from 'common/LanguageInfo'

export const getFormattedPersonInformationSelector = (state, personId) => {
  const person = state.get('participants').find((person) => person.get('id') === personId)
  const legacyDescriptor = person.get('legacy_descriptor')
  const races = person.get('races') && person.get('races').map((raceInformation) => {
    const race = raceInformation.get('race')
    const raceDetail = raceInformation.get('race_detail')
    const raceDetailText = (raceDetail && ` - ${raceDetail}`) || ''
    return `${race}${raceDetailText}`
  }).join(', ')
  const {hispanic_latino_origin, ethnicity_detail} = person.toJS().ethnicity || {}
  return fromJS({
    legacySource: legacyDescriptor ? legacySourceFormatter(legacyDescriptor.toJS()) : '',
    name: nameFormatter(person.toJS()),
    gender: GENDERS[person.get('gender')],
    roles: person.get('roles', []),
    languages: flagPrimaryLanguage((person.toJS().languages) || []).join(', '),
    dateOfBirth: dateFormatter(person.get('date_of_birth')),
    approximateAge: [person.get('approximate_age'), person.get('approximate_age_units')].join(' '),
    ssn: ssnFormatter(person.get('ssn')),
    races: races,
    ethnicity: hispanic_latino_origin && `${hispanic_latino_origin}${(ethnicity_detail && ` - ${ethnicity_detail}`) || ''}`,
  })
}