import WorkerSafetyForm from 'views/WorkerSafetyForm'
import {
  getAlertValuesSelector,
  getInformationValueSelector,
} from 'selectors/screening/workerSafetyFormSelectors'
import {getSafetyAlertsSelector} from 'selectors/systemCodeSelectors'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {setField, resetFieldValues} from 'actions/workerSafetyFormActions'
import {saveCard} from 'actions/screeningActions'
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
  }
)

const mapDispatchToProps = (dispatch) => ({
  onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
  onSave: () => {
    dispatch(saveCard('worker_safety'))
    dispatch(setCardMode('worker-safety-card', SHOW_MODE))
  },
  dispatch,
})

const mergeProps = (stateProps, dispatchProps) => {
  const {dispatch, ...actions} = dispatchProps
  const {screening, ...props} = stateProps

  const onCancel = () => {
    const {safety_alerts, safety_information} = screening
    dispatch(resetFieldValues({safety_alerts, safety_information}))
    dispatch(setCardMode('worker-safety-card', SHOW_MODE))
  }

  return {
    onCancel,
    ...actions,
    ...props,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkerSafetyForm)
