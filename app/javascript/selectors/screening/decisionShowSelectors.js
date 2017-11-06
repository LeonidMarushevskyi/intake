import {createSelector} from 'reselect'
import {List, Map, fromJS} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import SCREENING_DECISION from 'enums/ScreeningDecision'
import SCREENING_DECISION_OPTIONS from 'enums/ScreeningDecisionOptions'
import {isRequiredCreate, combineCompact} from 'utils/validator'

export const getErrorsSelector = createSelector(
  (state) => state.getIn(['screening', 'screening_decision']),
  (state) => state.getIn(['screening', 'screening_decision_detail']),
  (state) => state.get('allegationsForm', List()),
  (decision, decisionDetail, allegations) => (
    fromJS({
      screening_decision: combineCompact(
        isRequiredCreate(decision, 'Please enter a decision'),
        () => {
          if (decision === 'promote_to_referral' &&
            allegations.every((allegation) => allegation.get('allegationTypes').isEmpty())) {
            return 'Please enter at least one allegation to promote to referral.'
          } else {
            return undefined
          }
        }
      ),
      screening_decision_detail: combineCompact(
        () => {
          if (decision === 'promote_to_referral' && !decisionDetail) {
            return 'Please enter a response time'
          } else {
            return undefined
          }
        }
      ),
    })
  )
)

export const getDecisionSelector = createSelector(
  getScreeningSelector,
  getErrorsSelector,
  (screening, errors) => (
    Map({
      value: SCREENING_DECISION[screening.get('screening_decision')],
      errors: errors.get('screening_decision'),
    })
  )
)

export const getDecisionDetailSelector = createSelector(
  getScreeningSelector,
  getErrorsSelector,
  (screening, errors) => {
    const decision = screening.get('screening_decision')
    let decisionDetail = screening.get('screening_decision_detail')

    if (['promote_to_referral', 'screen_out'].includes(decision)) {
      decisionDetail = SCREENING_DECISION_OPTIONS[decision].values[decisionDetail]
    }
    return Map({
      value: decisionDetail,
      label: SCREENING_DECISION_OPTIONS[decision] ? SCREENING_DECISION_OPTIONS[decision].label : '',
      errors: errors.get('screening_decision_detail'),
      required: decision === 'promote_to_referral',
    })
  }
)
