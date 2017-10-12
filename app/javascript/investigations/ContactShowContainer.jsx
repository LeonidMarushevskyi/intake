import ContactShow from 'investigations/ContactShow'
import {
  getStatusValueSelector,
  getPurposeValueSelector,
  getCommunicationMethodValueSelector,
  getLocationValueSelector,
} from 'selectors/contactSelectors'
import * as actions from 'actions/contactActions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const contact = state.get('contact')
  return {
    communicationMethod: getCommunicationMethodValueSelector(state),
    id: ownProps.params.id,
    investigationId: ownProps.params.investigation_id,
    location: getLocationValueSelector(state),
    note: contact.get('note'),
    purpose: getPurposeValueSelector(state),
    startedAt: contact.get('started_at'),
    status: getStatusValueSelector(state),
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({actions: bindActionCreators(actions, dispatch)})

export default connect(mapStateToProps, mapDispatchToProps)(ContactShow)
