import {connect} from 'react-redux'
import ScreeningInformationForm from 'screenings/screeningInformation/ScreeningInformationForm'
import COMMUNICATION_METHOD from 'enums/CommunicationMethod'
import {
  getScreeningInformationFormSelector,
  getVisibleErrorsSelector,
} from 'selectors/screeningInformationFormSelectors'
import {getScreeningSelector} from 'selectors/screeningSelectors'

const mapStateToProps = (state, _ownProps) => {
  const screening = getScreeningSelector(state)
  const screeningInformationForm = getScreeningInformationFormSelector(state)
  const communicationMethods = Object.keys(COMMUNICATION_METHOD)
    .map((value) => ({value, label: COMMUNICATION_METHOD[value]}))
  return {
    assignee: screeningInformationForm.getIn(['assignee', 'value']),
    assigneeDisabled: Boolean(screening.get('assignee_staff_id')),
    communicationMethod: screeningInformationForm.getIn(['communication_method', 'value']),
    communicationMethods,
    endedAt: screeningInformationForm.getIn(['ended_at', 'value']),
    errors: getVisibleErrorsSelector(state).toJS(),
    name: screeningInformationForm.getIn(['name', 'value']),
    startedAt: screeningInformationForm.getIn(['started_at', 'value']),
  }
}
export default connect(mapStateToProps, {})(ScreeningInformationForm)
