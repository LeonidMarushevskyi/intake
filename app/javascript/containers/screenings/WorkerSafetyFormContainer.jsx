import WorkerSafetyForm from 'views/WorkerSafetyForm'
import {
  getAlertValuesSelector,
  getInformationValueSelector,
} from 'selectors/screening/workerSafetyFormSelectors'
import {getSafetyAlertsSelector} from 'selectors/systemCodeSelectors'
import {setField} from 'actions/workerSafetyFormActions'
import {saveCard, clearCardEdits} from 'actions/screeningActions'
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
  }
)

const mapDispatchToProps = (dispatch) => ({
  onCancel: () => {
    dispatch(clearCardEdits('worker_safety'))
    dispatch(setCardMode('worker-safety-card', SHOW_MODE))
  },
  onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
  onSave: () => {
    dispatch(saveCard('worker_safety'))
    dispatch(setCardMode('worker-safety-card', SHOW_MODE))
  },
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkerSafetyForm)
