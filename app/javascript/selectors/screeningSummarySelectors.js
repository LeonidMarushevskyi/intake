import {createSelector} from 'reselect'
import {List, Set} from 'immutable'

export const getScreeningSummarySelector = (state) => state.get('screeningSummary')
export const getAllegationTypesSelector = createSelector(
  getScreeningSummarySelector,
  (screeningSummary) => {
    const allegations = screeningSummary.get('allegations') || List()
    return allegations.reduce((uniq, alegation) => uniq.concat(alegation.get('allegation_types')), Set())
  }
)
