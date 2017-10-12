import {createSelector} from 'reselect'
import {Map, fromJS, List} from 'immutable'
import {dateTimeFormatter} from 'utils/dateFormatter'
import {
  isRequiredCreate,
  isFutureDatetimeCreate,
  isBeforeDatetimeCreate,
  combineCompact,
} from 'utils/validator'
import nameFormatter from 'utils/nameFormatter'

export const getPeopleSelector = createSelector(
  (state) => state.get('contactForm'),
  (contactForm) => contactForm.get('people') || List()
)
export const getTouchedFieldsSelector = createSelector(
  (state) => state.get('contactForm'),
  (contactForm) => (
    contactForm.filter((field) => {
      if (List.isList(field)) {
        return field.some((item) => item.get('touched'))
      } else {
        return field.get('touched')
      }
    }).keySeq().toList()
  )
)
export const getErrorsSelector = createSelector(
  (state) => state.getIn(['contactForm', 'started_at', 'value']),
  (state) => state.getIn(['contactForm', 'investigation_started_at', 'value']),
  (state) => state.getIn(['contactForm', 'communication_method', 'value']),
  (state) => state.getIn(['contactForm', 'location', 'value']),
  (state) => state.getIn(['contactForm', 'status', 'value']),
  (state) => state.getIn(['contactForm', 'purpose', 'value']),
  getPeopleSelector,
  (startedAt, investigationStartedAt, communicationMethod, location, status, purpose, people) => fromJS({
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
    people: combineCompact(
      () => {
        if (people.some((person) => person.get('selected'))) {
          return undefined
        } else {
          return 'At least one person must be present for a contact'
        }
      }
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
export const getFormattedContactPeople = createSelector(
  getPeopleSelector,
  (people) => (
    people.map((person) => Map({name: nameFormatter(person.toJS()), selected: person.get('selected')}))
  )
)
export const getSelectedPeopleIdsSelector = createSelector(
  getPeopleSelector,
  (people = List()) => (
    people.filter((person) => person.get('selected'))
      .map((person) => Map({legacy_descriptor: person.get('legacy_descriptor')}))
  )
)
