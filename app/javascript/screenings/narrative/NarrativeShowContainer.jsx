import NarrativeShow from 'screenings/narrative/NarrativeShow'
// import {getErrorsSelector} from 'selectors/narrativeFormSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {
    errors: [],
    narrative: state.getIn(['screening', 'report_narrative']),
  }
)

export default connect(mapStateToProps)(NarrativeShow)
