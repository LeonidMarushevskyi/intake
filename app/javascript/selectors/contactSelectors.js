import {createSelector} from 'reselect'
import {
  getStatusesSelector,
  getPurposesSelector,
  getLocationsSelector,
  getCommunicationMethodsSelector,
} from 'selectors/systemCodeSelectors'
import {Map} from 'immutable'

/* eslint-disable no-invalid-this */
const systemCodeDisplayValue = (code, systemCodes, noSetValue = Map(), context = this) => systemCodes.find(
  (systemCode) => systemCode.get('code') === code, context, noSetValue
).get('value')
/* eslint-enable no-invalid-this */
export const getStatusValueSelector = createSelector(
  (state) => state.getIn(['contact', 'status', 'value']),
  getStatusesSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getPurposeValueSelector = createSelector(
  (state) => state.getIn(['contact', 'purpose', 'value']),
  getPurposesSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getLocationValueSelector = createSelector(
  (state) => state.getIn(['contact', 'location', 'value']),
  getLocationsSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getCommunicationMethodValueSelector = createSelector(
  (state) => state.getIn(['contact', 'communication_method', 'value']),
  getCommunicationMethodsSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
