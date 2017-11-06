import {createSelector} from 'reselect'
import {getScreeningSelector} from 'selectors/screeningSelectors'

export const getAlertValuesSelector = createSelector(
  (state) => state.get('workerSafetyForm'),
  (workerSafetyForm) => workerSafetyForm.getIn(['safety_alerts', 'value'])
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
