import {createSelector} from 'reselect'
import {Map} from 'immutable'

/* eslint-disable no-invalid-this */
const systemCodeDisplayValue = (code, systemCodes, noSetValue = Map(), context = this) => systemCodes.find(
  (systemCode) => systemCode.get('code') === code, context, noSetValue
).get('value')
/* eslint-enable no-invalid-this */
const statusesSelector = (state) => state.get('contactStatuses')
const purposesSelector = (state) => state.get('contactPurposes')
const locationsSelector = (state) => state.get('locations')
const communicationMethodsSelector = (state) => state.get('communicationMethods')

export const currentStatusSelector = createSelector(
  (state) => state.getIn(['contact', 'status', 'value']),
  statusesSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const currentPurposeSelector = createSelector(
  (state) => state.getIn(['contact', 'purpose', 'value']),
  purposesSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const currentLocationSelector = createSelector(
  (state) => state.getIn(['contact', 'location', 'value']),
  locationsSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const currentCommunicationMethodSelector = createSelector(
  (state) => state.getIn(['contact', 'communication_method', 'value']),
  communicationMethodsSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
