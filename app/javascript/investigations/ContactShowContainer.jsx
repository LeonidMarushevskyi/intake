import ContactShow from 'investigations/ContactShow'
import {
  getStatusValueSelector,
  getPurposeValueSelector,
  getCommunicationMethodValueSelector,
  getLocationValueSelector,
} from 'selectors/contactFormSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const contact = state.get('contactForm')
  return {
    investigationId: ownProps.params.investigation_id,
    startedAt: contact.getIn(['started_at', 'value']),
    status: getStatusValueSelector(state),
    purpose: getPurposeValueSelector(state),
    communicationMethod: getCommunicationMethodValueSelector(state),
    location: getLocationValueSelector(state),
    note: contact.getIn(['note', 'value']),
  }
}

export default connect(mapStateToProps)(ContactShow)
