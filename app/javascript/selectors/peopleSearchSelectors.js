import {
  List,
  Map,
} from 'immutable'
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
const formatPhoneNumber = (phoneNumber) => phoneNumber && Map({
  number: phoneNumberFormatter(phoneNumber.get('number')),
  type: phoneNumber.get('type'),
})

// Try to find a match from a list of highlights by stripping out <em> tags
const highlightNameField = (exactName, highlights) => (highlights.find(
  (highlight) => highlight.replace(/<(\/)?em>/g, '') === exactName
) || exactName)

const maybeHighlightedField = (result, highlight, key) => highlight.getIn(
  [key, 0],
  highlightNameField(result.get(key), highlight.get('autocomplete_search_bar', List()))
)

export const getPeopleResultsSelector = (state) => getPeopleSearchSelector(state)
  .get('results')
  .map((fullResult) => {
    const result = fullResult.get('_source', Map())
    const highlight = fullResult.get('highlight', Map())
    return Map({
      legacy_id: result.get('id'),
      firstName: maybeHighlightedField(result, highlight, 'first_name'),
      lastName: maybeHighlightedField(result, highlight, 'last_name'),
      middleName: result.get('middle_name'),
      nameSuffix: result.get('name_suffix'),
      legacyDescriptor: result.get('legacy_descriptor'),
      gender: result.get('gender'),
      languages: mapLanguages(state, result),
      races: mapRaces(state, result),
      ethnicity: mapEthnicities(state, result),
      dateOfBirth: formatDOB(result.get('date_of_birth'), highlight.has('searchable_date_of_birth')),
      ssn: formatSSN(highlight.getIn(['ssn', 0], result.get('ssn'))),
      address: mapAddress(state, result),
      phoneNumber: formatPhoneNumber(result.getIn(['phone_numbers', 0], null)),
      isSensitive: mapIsSensitive(result),
      isSealed: mapIsSealed(result),
    })
  })
