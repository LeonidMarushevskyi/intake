import NarrativeForm from 'screenings/narrative/NarrativeForm'
import {
  getReportNarrativeValueSelector,
  getScreeningWithEditsSelector,
  getVisibleErrorsSelector,
} from 'selectors/narrativeFormSelectors'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {setField, resetFieldValues, touchField, touchAllFields} from 'actions/narrativeFormActions'
import {saveScreening} from 'actions/screeningActions'
import {connect} from 'react-redux'

const mapStateToProps = (state, _ownProps) => (
  {
    screening: getScreeningSelector(state).toJS(),
    screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
    reportNarrative: {
      value: getReportNarrativeValueSelector(state),
      errors: getVisibleErrorsSelector(state).get('report_narrative').toJS(),
    },
  }
)

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {dispatch} = dispatchProps
  const {reportNarrative, screening, screeningWithEdits} = stateProps
  const {toggleShow} = ownProps

  const onCancel = () => {
    dispatch(resetFieldValues(screening))
    dispatch(touchAllFields())
    toggleShow()
  }

  const onSave = () => {
    dispatch(saveScreening(screeningWithEdits))
    dispatch(touchAllFields())
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

export default connect(mapStateToProps, null, mergeProps)(NarrativeForm)
