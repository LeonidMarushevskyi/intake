import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import SAFETY_ALERT from 'enums/SafetyAlert'
import selectOptions from 'utils/selectHelper'

/* eslint-disable no-invalid-this */
export const systemCodeDisplayValue = (code, systemCodes = List(), noSetValue = Map(), context = this) => systemCodes.find(
  (systemCode) => systemCode.get('code') === code, context, noSetValue
).get('value')
/* eslint-enable no-invalid-this */
export const getStatusesSelector = (state) => state.get('contactStatuses')
export const getPurposesSelector = (state) => state.get('contactPurposes')
export const getLocationsSelector = (state) => state.get('locations')
export const getCommunicationMethodsSelector = (state) => state.get('communicationMethods')
export const getAllegationTypesSelector = (state) => state.get('allegationTypes', List())
export const getSafetyAlertsSelector = (_state) => selectOptions(SAFETY_ALERT)

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
