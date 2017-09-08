import * as actions from 'actions/screeningSummaryActions'
import SCREENING_DECISION_OPTIONS from 'enums/ScreeningDecisionOptions'
import ScreeningSummary from 'investigations/ScreeningSummary'
import {Set, List} from 'immutable'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const allegations = state.getIn(['screeningSummary', 'allegations']) || List()
  const allegationTypes = allegations.reduce((uniq, alegation) => uniq.concat(alegation.get('allegation_types')), Set())
  const safetyAlerts = state.getIn(['screeningSummary', 'safety_alerts']) || List()
  const RESPONSE_TIMES = SCREENING_DECISION_OPTIONS.promote_to_referral.values
  return {
    id: ownProps.params.id,
    screeningId: state.getIn(['screeningSummary', 'id']),
    name: state.getIn(['screeningSummary', 'name']),
    safetyAlerts: safetyAlerts.toJS(),
    safetyInformation: state.getIn(['screeningSummary', 'safety_information']),
    decisionRationale: state.getIn(['screeningSummary', 'additional_information']),
    responseTime: RESPONSE_TIMES[state.getIn(['screeningSummary', 'decision_detail'])],
    allegations: allegationTypes.toJS(),
    loaded: Boolean(state.getIn(['screeningSummary', 'id'])),
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({actions: bindActionCreators(actions, dispatch)})

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningSummary)
