import {createSelector} from 'reselect'
import {Map} from 'immutable'

/* eslint-disable no-invalid-this */
const systemCodeDisplayValue = (code, systemCodes, noSetValue = Map(), context = this) => systemCodes.find(
  (systemCode) => systemCode.get('code') === code, context, noSetValue
).get('value')
export const statusesSelector = (state) => state.get('contactStatuses')
export const purposesSelector = (state) => state.get('contactPurposes')
export const locationsSelector = (state) => state.get('locations')
export const communicationMethodsSelector = (state) => state.get('communicationMethods')
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
export const inPersonCommunicationMethodSelector = createSelector(
  communicationMethodsSelector,
  (systemCodes) => {
    const systemCode = systemCodes.find((systemCode) => systemCode.get('value') === 'In person', this, Map())
    return systemCode.get('code')
  }
)
/* eslint-enable no-invalid-this */
