import NarrativeForm from 'views/NarrativeForm'
import {
  getReportNarrativeValueSelector,
  getScreeningWithEditsSelector,
  getVisibleErrorsSelector,
} from 'selectors/narrativeFormSelectors'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {setField, resetFieldValues, touchField, touchAllFields} from 'actions/narrativeFormActions'
import {save as saveScreening} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {
    screening: getScreeningSelector(state).toJS(),
    screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
    reportNarrative: {
      value: getReportNarrativeValueSelector(state),
      errors: getVisibleErrorsSelector(state).get('report_narrative').toJS(),
    },
  }
)

const mergeProps = (stateProps, dispatchProps) => {
  const {dispatch} = dispatchProps
  const {reportNarrative, screening, screeningWithEdits} = stateProps

  const onCancel = () => {
    dispatch(resetFieldValues(screening))
    dispatch(touchAllFields())
    dispatch(setCardMode('narrative-card', SHOW_MODE))
  }

  const onSave = () => {
    dispatch(saveScreening(screeningWithEdits))
    dispatch(touchAllFields())
    dispatch(setCardMode('narrative-card', SHOW_MODE))
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
