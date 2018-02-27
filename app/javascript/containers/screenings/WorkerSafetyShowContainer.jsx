import WorkerSafetyShow from 'views/WorkerSafetyShow'
import {
  getAlertValuesSelector,
  getInformationValueSelector,
} from 'selectors/screening/workerSafetyShowSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {
    safetyAlerts: getAlertValuesSelector(state).toJS(),
    safetyInformation: getInformationValueSelector(state),
  }
)

export default connect(mapStateToProps)(WorkerSafetyShow)
