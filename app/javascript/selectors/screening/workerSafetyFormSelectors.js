import {createSelector} from 'reselect'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {List} from 'immutable'

export const getAlertValuesSelector = createSelector(
  (state) => state.get('workerSafetyForm'),
  (workerSafetyForm) => workerSafetyForm.getIn(['safety_alerts', 'value']) || List([])
)

export const getInformationValueSelector = createSelector(
  (state) => state.get('workerSafetyForm'),
  (workerSafetyForm) => workerSafetyForm.getIn(['safety_information', 'value'])
)

export const getScreeningWithEditsSelector = createSelector(
  getScreeningSelector,
  getAlertValuesSelector,
  getInformationValueSelector,
  (screening, alerts, information) => screening.set('safety_alerts', alerts).set('safety_information', information)
)
