import {connect} from 'react-redux'
import ScreeningDecisionShow from 'views/screening_decision/ScreeningDecisionShow'
import {
  getDecisionSelector,
  getDecisionDetailSelector,
} from 'selectors/screening/decisionShowSelectors'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import * as IntakeConfig from 'common/config'

const mapStateToProps = (state, ownProps) => (
  {
    accessRestriction: {
      value: getScreeningSelector(state).get('access_restrictions'),
    },
    additionalInformation: {
      value: getScreeningSelector(state).get('additional_information'),
    },
    decision: getDecisionSelector(state).toJS(),
    decisionDetail: getDecisionDetailSelector(state).toJS(),
    onEdit: ownProps.onEdit,
    restrictionRationale: {
      value: getScreeningSelector(state).get('restrictions_rationale'),
    },
    sdmLink: IntakeConfig.sdmPath(),
  }
)

export default connect(mapStateToProps)(ScreeningDecisionShow)
