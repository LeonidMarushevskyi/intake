import * as actions from 'actions/screeningSummaryActions'
import SCREENING_DECISION_OPTIONS from 'enums/ScreeningDecisionOptions'
import ScreeningSummary from 'investigations/ScreeningSummary'
import {List} from 'immutable'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
  getScreeningSummarySelector,
  getAllegationTypesSelector,
} from 'selectors/screeningSummarySelectors'

const mapStateToProps = (state, ownProps) => {
  const screeningSummary = getScreeningSummarySelector(state)
  const safetyAlerts = screeningSummary.get('safety_alerts') || List()
  const RESPONSE_TIMES = SCREENING_DECISION_OPTIONS.promote_to_referral.values
  return {
    id: ownProps.params.id,
    screeningId: screeningSummary.get('id'),
    name: screeningSummary.get('name'),
    safetyAlerts: safetyAlerts.toJS(),
    safetyInformation: screeningSummary.get('safety_information'),
    decisionRationale: screeningSummary.get('additional_information'),
    responseTime: RESPONSE_TIMES[screeningSummary.get('decision_detail')],
    allegations: getAllegationTypesSelector(state).toJS(),
    loaded: Boolean(screeningSummary.get('id')),
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({actions: bindActionCreators(actions, dispatch)})

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningSummary)
