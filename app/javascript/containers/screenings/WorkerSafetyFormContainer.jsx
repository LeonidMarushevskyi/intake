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
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
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

const mergeProps = (stateProps, dispatchProps) => {
  const {dispatch} = dispatchProps
  const {alertOptions, safetyAlerts, safetyInformation, screening, screeningWithEdits} = stateProps

  const onCancel = () => {
    const {safety_alerts, safety_information} = screening
    dispatch(resetFieldValues({safety_alerts, safety_information}))
    dispatch(setCardMode('worker-safety-card', SHOW_MODE))
  }

  const onSave = () => {
    dispatch(saveScreening(screeningWithEdits))
    dispatch(setCardMode('worker-safety-card', SHOW_MODE))
  }

  return {
    onCancel,
    onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
    onSave,
    alertOptions,
    safetyAlerts,
    safetyInformation,
  }
}

export default connect(mapStateToProps, null, mergeProps)(WorkerSafetyForm)
