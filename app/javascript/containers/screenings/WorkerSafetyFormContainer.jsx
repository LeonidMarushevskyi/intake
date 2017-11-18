import WorkerSafetyForm from 'views/WorkerSafetyForm'
import {
  getAlertValuesSelector,
  getInformationValueSelector,
  getScreeningWithEditsSelector,
} from 'selectors/screening/workerSafetyFormSelectors'
import {getSafetyAlertsSelector} from 'selectors/systemCodeSelectors'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {setField, resetFieldValues} from 'actions/workerSafetyFormActions'
import {save as saveScreening} from 'actions/screeningActions'
import {connect} from 'react-redux'

const mapStateToProps = (state, _ownProps) => (
  {
    alertOptions: getSafetyAlertsSelector(state),
    safetyAlerts: {
      value: getAlertValuesSelector(state).toJS(),
    },
    safetyInformation: {
      value: getInformationValueSelector(state),
    },
    screening: getScreeningSelector(state).toJS(),
    screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
  }
)

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {dispatch} = dispatchProps
  const {alertOptions, safetyAlerts, safetyInformation, screening, screeningWithEdits} = stateProps
  const {toggleMode} = ownProps

  const onCancel = () => {
    const {safety_alerts, safety_information} = screening
    dispatch(resetFieldValues({safety_alerts, safety_information}))
    toggleMode()
  }

  const onSave = () => {
    dispatch(saveScreening(screeningWithEdits))
    toggleMode()
  }

  return {
    onCancel,
    onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
    onSave,
    alertOptions,
    safetyAlerts,
    safetyInformation,
    toggleMode,
  }
}

export default connect(mapStateToProps, null, mergeProps)(WorkerSafetyForm)
