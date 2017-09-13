import * as actions from 'actions/contactActions'
import ContactValidator from 'investigations/contacts/ContactValidator'
import InvestigationContact from 'investigations/InvestigationContact'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const errors = (contact) => (
  new ContactValidator(contact).validate()
)

const mapStateToProps = (state, ownProps) => ({
  investigationId: ownProps.params.investigation_id,
  contact: state.get('contact').toJS(),
  statuses: state.get('contactStatuses').toJS(),
  errors: errors(state.get('contact').toJS()),
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(InvestigationContact)
