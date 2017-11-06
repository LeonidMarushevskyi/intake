import {connect} from 'react-redux'
import ScreeningDecisionShow from 'views/screening_decision/ScreeningDecisionShow'
import {
  getDecisionSelector,
  getDecisionDetailSelector,
} from 'selectors/screening/decisionShowSelectors'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import * as IntakeConfig from 'common/config'
import {getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import _ from 'lodash'

const mapStateToProps = (state, ownProps) => {
  let props = {
    accessRestriction: {
      value: _.capitalize(getScreeningSelector(state).get('access_restrictions')),
    },
    additionalInformation: {
      value: getScreeningSelector(state).get('additional_information'),
    },
    decision: getDecisionSelector(state).toJS(),
    decisionDetail: getDecisionDetailSelector(state).toJS(),
    restrictionRationale: {
      value: getScreeningSelector(state).get('restrictions_rationale'),
    },
    sdmLink: IntakeConfig.sdmPath(),
  }
  if (!getScreeningIsReadOnlySelector(state)) {
    props = {
      ...props,
      onEdit: ownProps.toggleMode,
    }
  }
  return props
}

export default connect(mapStateToProps)(ScreeningDecisionShow)
