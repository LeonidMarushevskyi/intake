import {
  systemCodeDisplayValue,
  getStatusesSelector,
  getPurposesSelector,
  getLocationsSelector,
  getCommunicationMethodsSelector,
} from 'selectors/systemCodeSelectors'
import nameFormatter from 'utils/nameFormatter'
import {List} from 'immutable'
import {createSelector} from 'reselect'
export const getStatusValueSelector = createSelector(
  (state) => state.getIn(['contact', 'status']),
  getStatusesSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getPurposeValueSelector = createSelector(
  (state) => state.getIn(['contact', 'purpose']),
  getPurposesSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getLocationValueSelector = createSelector(
  (state) => state.getIn(['contact', 'location']),
  getLocationsSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getCommunicationMethodValueSelector = createSelector(
  (state) => state.getIn(['contact', 'communication_method']),
  getCommunicationMethodsSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)

export const getFormattedPeopleSelector = createSelector(
  (state) => state.getIn(['contact', 'people']),
  (people = List()) => people.map((person) => nameFormatter(person.toJS()))
)
