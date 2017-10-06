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
  (state) => state.getIn(['contactForm', 'status', 'value']),
  getStatusesSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getPurposeValueSelector = createSelector(
  (state) => state.getIn(['contactForm', 'purpose', 'value']),
  getPurposesSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getLocationValueSelector = createSelector(
  (state) => state.getIn(['contactForm', 'location', 'value']),
  getLocationsSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getCommunicationMethodValueSelector = createSelector(
  (state) => state.getIn(['contactForm', 'communication_method', 'value']),
  getCommunicationMethodsSelector,
  (code, systemCodes) => systemCodeDisplayValue(code, systemCodes)
)
export const getTouchedFieldsSelector = createSelector(
  (state) => state.get('contactForm'),
  (contactForm) => contactForm.filter((field) => field.get('touched')).keySeq()
)
export const getFieldValuesSelector = createSelector(
  (state) => state.get('contactForm'),
  (contactForm) => contactForm.map((field) => field.get('value'))
)
