import {createSelector} from 'reselect'
import {List, Map, Set} from 'immutable'
import {getInvestigationSelector} from 'selectors/investigationSelectors'

export const getScreeningSummarySelector = createSelector(
  getInvestigationSelector,
  (investigation) => investigation.get('screening_summary') || Map()
)
export const getAllegationTypesSelector = createSelector(
  getScreeningSummarySelector,
  (screeningSummary) => {
    const allegations = screeningSummary.get('allegations') || List()
    return allegations.reduce((uniq, alegation) => uniq.concat(alegation.get('allegation_types')), Set())
  }
)
