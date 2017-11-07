import {createSelector} from 'reselect'
import {fromJS, List, Map} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {
  isRequiredCreate,
  isFutureDatetimeCreate,
  isBeforeDatetimeCreate,
  combineCompact,
} from 'utils/validator'

export const getScreeningInformationFormSelector = (state) => state.get('screeningInformationForm')
export const getScreeningWithEditsSelector = createSelector(
  getScreeningSelector,
  (state) => state.getIn(['screeningInformationForm', 'name', 'value']),
  (state) => state.getIn(['screeningInformationForm', 'assignee', 'value']),
  (state) => state.getIn(['screeningInformationForm', 'communication_method', 'value']),
  (state) => state.getIn(['screeningInformationForm', 'started_at', 'value']),
  (state) => state.getIn(['screeningInformationForm', 'ended_at', 'value']),
  (screening, name, assignee, communicationMethod, startedAt, endedAt) => screening.set('name', name)
    .set('assignee', assignee)
    .set('communication_method', communicationMethod)
    .set('started_at', startedAt)
    .set('ended_at', endedAt)
)
const getErrorsSelector = createSelector(
  (state) => state.getIn(['screeningInformationForm', 'assignee', 'value']),
  (state) => state.getIn(['screeningInformationForm', 'communication_method', 'value']),
  (state) => state.getIn(['screeningInformationForm', 'started_at', 'value']),
  (state) => state.getIn(['screeningInformationForm', 'ended_at', 'value']),
  (assignee, communicationMethod, startedAt, endedAt) => fromJS({
    assignee: combineCompact(
      isRequiredCreate(assignee, 'Please enter an assigned worker.')
    ),
    communication_method: combineCompact(
      isRequiredCreate(communicationMethod, 'Please select a communication method.')
    ),
    ended_at: combineCompact(
      isFutureDatetimeCreate(endedAt, 'The end date and time cannot be in the future.')
    ),
    started_at: combineCompact(
      isRequiredCreate(startedAt, 'Please enter a screening start date.'),
      isFutureDatetimeCreate(startedAt, 'The start date and time cannot be in the future.'),
      isBeforeDatetimeCreate(
        endedAt,
        startedAt,
        'The start date and time must be before the end date and time.'
      )
    ),
  })
)
const getTouchedFieldsSelector = createSelector(
  (state) => state.get('screeningInformationForm'),
  (screeningInformationForm) => (
    screeningInformationForm.filter((field) => {
      if (List.isList(field)) {
        return field.some((item) => item.get('touched'))
      } else {
        return field.get('touched')
      }
    }).keySeq().toList()
  )
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
