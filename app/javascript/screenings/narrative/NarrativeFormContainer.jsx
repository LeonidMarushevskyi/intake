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

const mapStateToProps = (state, _ownProps) => (
  {
    errors: getVisibleErrorsSelector(state).toJS(),
    reportNarrative: getReportNarrativeValueSelector(state),
    screening: getScreeningSelector(state).toJS(),
    screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
  }
)

const mapDispatchToProps = (dispatch, _ownProps) => {
  const actions = {...narrativeFormActions, saveScreening}
  return {...bindActionCreators(actions, dispatch)}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {setField, resetFieldValues, touchField, touchAllFields, saveScreening} = dispatchProps
  const {errors, reportNarrative, screening, screeningWithEdits} = stateProps
  const {toggleShow} = ownProps

  const onCancel = () => {
    resetFieldValues(screening)
    touchAllFields()
    toggleShow()
  }

  const onSave = () => {
    saveScreening(screeningWithEdits)
    touchAllFields()
    toggleShow()
  }

  return {
    onBlur: (fieldName) => dispatch(touchField(fieldName)),
    onCancel,
    onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
    onSave,
    reportNarrative,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NarrativeForm)
