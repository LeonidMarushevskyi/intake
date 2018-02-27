import NarrativeForm from 'views/NarrativeForm'
import {
  getReportNarrativeValueSelector,
  getVisibleErrorsSelector,
} from 'selectors/screening/narrativeFormSelectors'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {setField, resetFieldValues, touchField, touchAllFields} from 'actions/narrativeFormActions'
import {saveCard} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {
    screening: getScreeningSelector(state).toJS(),
    reportNarrative: {
      value: getReportNarrativeValueSelector(state),
      errors: getVisibleErrorsSelector(state).get('report_narrative').toJS(),
    },
  }
)

const mapDispatchToProps = (dispatch) => ({
  onBlur: (fieldName) => dispatch(touchField(fieldName)),
  onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
  onSave: () => {
    dispatch(saveCard('narrative'))
    dispatch(touchAllFields())
    dispatch(setCardMode('narrative-card', SHOW_MODE))
  },
  dispatch,
})

const mergeProps = (stateProps, dispatchProps) => {
  const {dispatch, ...actions} = dispatchProps
  const {screening, ...props} = stateProps

  const onCancel = () => {
    dispatch(resetFieldValues(screening))
    dispatch(touchAllFields())
    dispatch(setCardMode('narrative-card', SHOW_MODE))
  }

  return {
    onCancel,
    ...props,
    ...actions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NarrativeForm)
