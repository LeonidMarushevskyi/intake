import * as actions from 'actions/contactActions'
import ContactValidator from 'investigations/contacts/ContactValidator'
import Contact from 'investigations/Contact'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const filteredErrors = (touchedFields, errors) => (
  touchedFields.reduce((filteredErrors, field) => (
    Object.assign(filteredErrors, {[field]: errors[field]})
  ), {})
)

const errors = (contact) => (
  new ContactValidator(contact).validate()
)

const mapStateToProps = (state, ownProps) => {
  const contactFields = state.get('contact')
  const contactValues = contactFields.map((field) => field.get('value')).toJS()
  const contactTouchedFields = contactFields.filter((field) => field.get('touched')).keySeq().toJS()
  return {
    investigationId: ownProps.params.investigation_id,
    contact: contactValues,
    errors: filteredErrors(contactTouchedFields, errors(contactValues)),
    statuses: state.get('contactStatuses').toJS(),
    purposes: state.get('contactPurposes').toJS(),
    communicationMethods: state.get('communicationMethods').toJS(),
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Contact)
