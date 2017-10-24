import {createSelector} from 'reselect'
import {isRequiredCreate, combineCompact} from 'utils/validator'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {fromJS} from 'immutable'

export const getReportNarrativeValueSelector = createSelector(
  getScreeningSelector,
  (screening) => screening.get('report_narrative')
)

export const getErrorsSelector = createSelector(
  getReportNarrativeValueSelector,
  (narrative) => (fromJS({
    report_narrative: combineCompact(isRequiredCreate(narrative, 'Please enter a narrative.')),
  }))
)
