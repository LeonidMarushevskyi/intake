import NarrativeShow from 'screenings/narrative/NarrativeShow'
import {
  getVisibleErrorsSelector,
  getReportNarrativeValueSelector,
} from 'selectors/narrativeFormSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {
    errors: getVisibleErrorsSelector(state).get('report_narrative').toJS(),
    narrative: getReportNarrativeValueSelector(state),
  }
)

export default connect(mapStateToProps)(NarrativeShow)
