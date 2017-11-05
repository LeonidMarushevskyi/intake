import {createSelector} from 'reselect'
import {getScreeningSelector} from 'selectors/screeningSelectors'

export const getAlertValuesSelector = createSelector(
  getScreeningSelector,
  (screening) => screening.get('safety_alerts')
)

export const getInformationValueSelector = createSelector(
  getScreeningSelector,
  (screening) => screening.get('safety_information')
)
