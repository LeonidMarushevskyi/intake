import {Map, List} from 'immutable'
import {findByCode} from 'selectors'
import {createSelector} from 'reselect'

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

export const getResultLanguagesSelector = (state, result) => createSelector(
  (state) => state.get('languages'),
  () => (result.get('languages') || List()),
  (statusCodes, languages) => (
    languages
      .sort((item) => item.get('primary'))
      .map((language) => (
        findByCode(statusCodes.toJS(), language.get('id')).value)
      )

  )
)(state)

const formatSSN = (ssn) => ssn && ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
export const getPeopleResultsSelector = (state) => getPeopleSearchSelector(state)
  .get('results')
  .map((result) => {
    const address = result.getIn(['addresses', 0], null)
    const phoneNumber = result.getIn(['phone_numbers', 0], null)
    return Map({
      firstName: result.getIn(['highlight', 'first_name'], result.get('first_name')),
      lastName: result.getIn(['highlight', 'last_name'], result.get('last_name')),
      middleName: result.get('middle_name'),
      nameSuffix: result.get('name_suffix'),
      legacyDescriptor: result.get('legacy_descriptor'),
      gender: result.get('gender'),
      languages: getResultLanguagesSelector(state, result),
      races: result.get('races'),
      ethnicity: result.get('ethnicity'),
      dateOfBirth: result.getIn(['highlight', 'date_of_birth'], result.get('date_of_birth')),
      ssn: formatSSN(result.getIn(['highlight', 'ssn'], result.get('ssn'))),
      address: address && Map({
        city: address.get('city'),
        state: address.get('state'),
        streetAddress: address.get('street_address'),
        type: '', // TODO: Implement as part of #INT-537
        zip: address.get('zip'),
      }),
      phoneNumber: phoneNumber && Map({
        number: phoneNumber.get('number'),
        type: phoneNumber.get('type'),
      }),
      isSensitive: result.get('sensitive'),
      isSealed: result.get('sealed'),
    })
  })
