import {createSelector} from 'reselect'
import {isRequiredCreate, combineCompact} from 'utils/validator'
import {Map, fromJS, List} from 'immutable'

export const getScreeningSelector = (state) => (state.get('screening') || Map())

export const getReportNarrativeValueSelector = createSelector(
  (state) => state.get('narrativeForm'),
  (narrativeForm) => narrativeForm.getIn(['report_narrative', 'value'])
)

export const getScreeningWithEditsSelector = createSelector(
  getScreeningSelector,
  getReportNarrativeValueSelector,
  (screening, reportNarrative) => screening.set('report_narrative', reportNarrative)
)

export const getTouchedFieldsSelector = createSelector(
  (state) => state.get('narrativeForm'),
  (narrativeForm) => narrativeForm.filter((field) => field.get('touched')).keySeq()
)

export const getErrorsSelector = createSelector(
  getReportNarrativeValueSelector,
  (narrative) => (fromJS({
    report_narrative: combineCompact(isRequiredCreate(narrative, 'Please enter a narrative.')),
  }))
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
