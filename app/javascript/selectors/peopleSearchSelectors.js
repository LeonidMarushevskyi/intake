import {Map} from 'immutable'
import {
  mapLanguages,
  mapIsSensitive,
  mapIsSealed,
  mapRaces,
  mapEthnicities,
  mapAddress,
} from 'utils/peopleSearchHelper'
import {phoneNumberFormatter} from 'utils/phoneNumberFormatter'

const getPeopleSearchSelector = (state) => state.get('peopleSearch')
export const getSearchTermValueSelector = (state) => (
  getPeopleSearchSelector(state).get('searchTerm')
)
export const getResultsTotalValueSelector = (state) => (
  getPeopleSearchSelector(state).get('total')
)
export const getLastResultsSortValueSelector = (state) => {
  const lastResult = getPeopleSearchSelector(state).get('results').last()
  return lastResult.get('sort').toJS()
}

const formatSSN = (ssn) => ssn && ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
const formatDOB = (dob, highlight) => (highlight ? '<em>'.concat(dob, '</em>') : dob)

export const getPeopleResultsSelector = (state) => getPeopleSearchSelector(state)
  .get('results')
  .map((fullResult) => {
    const result = fullResult.get('_source')
    const phoneNumber = result.getIn(['phone_numbers', 0], null)
    const highlightDateOfBirth = fullResult.hasIn(['highlight', 'searchable_date_of_birth'])
    return Map({
      legacy_id: result.get('id'),
      firstName: fullResult.getIn(['highlight', 'first_name', 0], result.get('first_name')),
      lastName: fullResult.getIn(['highlight', 'last_name', 0], result.get('last_name')),
      middleName: result.get('middle_name'),
      nameSuffix: result.get('name_suffix'),
      legacyDescriptor: result.get('legacy_descriptor'),
      gender: result.get('gender'),
      languages: mapLanguages(state, result),
      races: mapRaces(state, result),
      ethnicity: mapEthnicities(state, result),
      dateOfBirth: formatDOB(result.get('date_of_birth'), highlightDateOfBirth),
      ssn: formatSSN(fullResult.getIn(['highlight', 'ssn', 0], result.get('ssn'))),
      address: mapAddress(state, result),
      phoneNumber: phoneNumber && Map({
        number: phoneNumberFormatter(phoneNumber.get('number')),
        type: phoneNumber.get('type'),
      }),
      isSensitive: mapIsSensitive(result),
      isSealed: mapIsSealed(result),
    })
  })
