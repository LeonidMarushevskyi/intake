import NarrativeShow from 'screenings/narrative/NarrativeShow'
import {
  getErrorsSelector,
  getReportNarrativeValueSelector,
} from 'selectors/narrativeShowSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {
    errors: getErrorsSelector(state).get('report_narrative').toJS(),
    narrative: getReportNarrativeValueSelector(state),
  }
)

export default connect(mapStateToProps)(NarrativeShow)
