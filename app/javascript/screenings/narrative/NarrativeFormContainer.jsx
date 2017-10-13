import NarrativeForm from 'screenings/narrative/NarrativeForm'
// import {getErrorsSelector} from 'selectors/narrativeFormSelectors'
// import * as narrativeFormActions from 'actions/narrativeFormActions'
// import {saveScreening as 'save'} from 'actions/screeningActions'
import {connect} from 'react-redux'
// import {bindActionCreators} from 'redux'

const mapStateToProps = (state, ownProps) => (
  {
    onCancel: ownProps.onCancel,
    errors: [],
    reportNarrative: state.getIn(['screening', 'report_narrative']),
    screening: state.get('screening').toJS(),
    screeningWithEdits: {},
  }
)

const mapDispatchToProps = (_dispatch, _ownProps) => (
  // const actions = Object.assign(narrativeFormActions, {saveScreening})
  // return {actions: bindActionCreators(actions, dispatch)}
  {actions: {}}
)

export default connect(mapStateToProps, mapDispatchToProps)(NarrativeForm)

