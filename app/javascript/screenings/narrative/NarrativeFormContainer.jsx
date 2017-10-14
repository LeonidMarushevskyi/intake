import NarrativeForm from 'screenings/narrative/NarrativeForm'
// import {getErrorsSelector} from 'selectors/narrativeFormSelectors'
import * as narrativeFormActions from 'actions/narrativeFormActions'
import {saveScreening} from 'actions/screeningActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const mapStateToProps = (state, ownProps) => {
  const reportNarrative = state.getIn(['narrativeForm', 'report_narrative', 'value'])
  return {
    onCancel: ownProps.onCancel,
    errors: [],
    reportNarrative,
    screening: state.get('screening').toJS(),
    screeningWithEdits: state.get('screening').set('report_narrative', reportNarrative).toJS(),
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => {
  const actions = {...narrativeFormActions, saveScreening}
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(NarrativeForm)

