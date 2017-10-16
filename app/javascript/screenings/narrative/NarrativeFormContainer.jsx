import NarrativeForm from 'screenings/narrative/NarrativeForm'
import {
  getReportNarrativeValueSelector,
  getScreeningSelector,
  getScreeningWithEditsSelector,
  getVisibleErrorsSelector,
} from 'selectors/narrativeFormSelectors'
import * as narrativeFormActions from 'actions/narrativeFormActions'
import {saveScreening} from 'actions/screeningActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const mapStateToProps = (state, ownProps) => (
  {
    onCancel: ownProps.onCancel,
    errors: getVisibleErrorsSelector(state).get('report_narrative').toJS(),
    reportNarrative: getReportNarrativeValueSelector(state),
    screening: getScreeningSelector(state).toJS(),
    screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
  }
)

const mapDispatchToProps = (dispatch, _ownProps) => {
  const actions = {...narrativeFormActions, saveScreening}
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(NarrativeForm)
