import {connect} from 'react-redux'
import ScreeningDecisionShow from 'views/screening_decision/ScreeningDecisionShow'

const mapStateToProps = (state, ownProps) => (
  {
    accessRestriction: {
      value: '',
    },
    additionalInformation: {
      value: '',
    },
    decision: {
      errors: [],
      value: '',
    },
    decisionDetail: {
      errors: [],
      label: 'Decision detail',
      required: false,
      value: '',
    },
    onEdit: ownProps.onEdit,
    restrictionRationale: {
      value: '',
    },
    sdmLink: ''
  }
)

export default connect(mapStateToProps)(ScreeningDecisionShow)
