import {createSelector} from 'reselect'
import {List, Map} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import SCREENING_DECISION from 'enums/ScreeningDecision'
import SCREENING_DECISION_OPTIONS from 'enums/ScreeningDecisionOptions'

export const getDecisionSelector = createSelector(
  getScreeningSelector,
  (screening) => (
    Map({
      value: SCREENING_DECISION[screening.get('screening_decision')],
      errors: List(),
    })
  )
)

export const getDecisionDetailSelector = createSelector(
  getScreeningSelector,
  (screening) => {
    const decision = screening.get('screening_decision')
    let decisionDetail = screening.get('screening_decision_detail')

    if (['promote_to_referral', 'screen_out'].includes(decision)) {
      decisionDetail = SCREENING_DECISION_OPTIONS[decision].values[decisionDetail]
    }
    return Map({
      value: decisionDetail,
      errors: List(),
      label: SCREENING_DECISION_OPTIONS[decision] ? SCREENING_DECISION_OPTIONS[decision].label : '',
      required: decision === 'promote_to_referral',
    })
  }
)
