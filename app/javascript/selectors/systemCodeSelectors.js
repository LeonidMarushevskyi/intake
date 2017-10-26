import {createSelector} from 'reselect'
import {List, Map} from 'immutable'

export const getStatusesSelector = (state) => state.get('contactStatuses')
export const getPurposesSelector = (state) => state.get('contactPurposes')
export const getLocationsSelector = (state) => state.get('locations')
export const getCommunicationMethodsSelector = (state) => state.get('communicationMethods')
export const getAllegationTypesSelector = (state) => state.get('allegationTypes', List())

/* eslint-disable no-invalid-this */
export const getInPersonCommunicationMethodValueSelector = createSelector(
  getCommunicationMethodsSelector,
  (systemCodes) => {
    const systemCode = systemCodes.find((systemCode) => systemCode.get('value') === 'In person', this, Map())
    return systemCode.get('code')
  }
)
export const getOfficeLocationCodeValueSelector = createSelector(
  getLocationsSelector,
  (systemCodes) => {
    const systemCode = systemCodes.find((systemCode) => systemCode.get('value') === 'CWS Office', this, Map())
    return systemCode.get('code')
  }
)
/* eslint-enable no-invalid-this */
