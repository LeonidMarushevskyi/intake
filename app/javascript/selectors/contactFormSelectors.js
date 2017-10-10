import {createSelector} from 'reselect'
import {
  getStatusesSelector,
  getPurposesSelector,
  getLocationsSelector,
  getCommunicationMethodsSelector,
} from 'selectors/systemCodeSelectors'
import {Map, fromJS, List} from 'immutable'
import {dateTimeFormatter} from 'utils/dateFormatter'
import {
  isRequiredCreate,
  isFutureDatetimeCreate,
  isBeforeDatetimeCreate,
  combineCompact,
} from 'utils/validator'

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
export const getErrorsSelector = createSelector(
  (state) => state.getIn(['contactForm', 'started_at', 'value']),
  (state) => state.getIn(['contactForm', 'investigation_started_at', 'value']),
  (state) => state.getIn(['contactForm', 'communication_method', 'value']),
  (state) => state.getIn(['contactForm', 'location', 'value']),
  (state) => state.getIn(['contactForm', 'status', 'value']),
  (state) => state.getIn(['contactForm', 'purpose', 'value']),
  (startedAt, investigationStartedAt, communicationMethod, location, status, purpose) => fromJS({
    started_at: combineCompact(
      isRequiredCreate(startedAt, 'Please enter a contact date'),
      isFutureDatetimeCreate(startedAt, 'The date and time cannot be in the future'),
      isBeforeDatetimeCreate(
        startedAt,
        investigationStartedAt,
        `The contact date/time must be after the investigation start date of ${dateTimeFormatter(investigationStartedAt)}`
      )
    ),
    communication_method: combineCompact(
      isRequiredCreate(communicationMethod, 'Please enter the communication method')
    ),
    location: combineCompact(
      isRequiredCreate(location, 'Please enter the contact location')
    ),
    status: combineCompact(
      isRequiredCreate(status, 'Please enter a contact status')
    ),
    purpose: combineCompact(
      isRequiredCreate(purpose, 'Please enter a contact purpose')
    ),
  })
)
export const getVisibleErrorsSelector = createSelector(
  getErrorsSelector,
  getTouchedFieldsSelector,
  (errors, touchedFields) => errors.reduce(
    (filteredErrors, fieldErrors, field) => {
      if (touchedFields.includes(field)) {
        return filteredErrors.set(field, fieldErrors)
      } else {
        return filteredErrors.set(field, List())
      }
    },
    Map()
  )
)
export const getHasErrorsValueSelector = createSelector(
  getErrorsSelector,
  (errors) => errors.some((fieldErrors) => !fieldErrors.isEmpty())
)
export const getSelectedPeopleIdsSelector = createSelector(
  (state) => state.getIn(['contactForm', 'people']),
  (people = List()) => people.filter((person) => person.get('selected')).map((person) => person.get('id'))
)
