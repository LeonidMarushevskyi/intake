import ContactShow from 'investigations/ContactShow'
import {
  currentStatusSelector,
  currentPurposeSelector,
  currentCommunicationMethodSelector,
  currentLocationSelector,
} from 'selectors/contactSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const contact = state.get('contact')
  return {
    investigationId: ownProps.params.investigation_id,
    startedAt: contact.getIn(['started_at', 'value']),
    status: currentStatusSelector(state),
    purpose: currentPurposeSelector(state),
    communicationMethod: currentCommunicationMethodSelector(state),
    location: currentLocationSelector(state),
    note: contact.getIn(['note', 'value']),
  }
}

export default connect(mapStateToProps)(ContactShow)
