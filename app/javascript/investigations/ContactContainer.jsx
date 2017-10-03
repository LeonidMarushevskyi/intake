import * as contactActions from 'actions/contactActions'
import {fetch as fetchPeople} from 'actions/investigationPeopleActions'
import ContactValidator from 'investigations/contacts/ContactValidator'
import Contact from 'investigations/Contact'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
  getStatusesSelector,
  getPurposesSelector,
  getLocationsSelector,
  getCommunicationMethodsSelector,
  getInPersonCommunicationMethodValueSelector,
} from 'selectors/systemCodeSelectors'

const filteredErrors = (touchedFields, errors) => (
  touchedFields.reduce((filteredErrors, field) => (
    Object.assign(filteredErrors, {[field]: errors[field]})
  ), {})
)

const errors = (contact) => (
  new ContactValidator(contact).validate()
)

const mapStateToProps = (state, ownProps) => {
  const contact = state.get('contact')
  const contactValues = contact.map((field) => field.get('value')).toJS()
  const contactTouchedFields = contact.filter((field) => field.get('touched')).keySeq().toJS()
  return {
    investigationId: ownProps.params.investigation_id,
    startedAt: contact.getIn(['started_at', 'value']),
    communicationMethod: contact.getIn(['communication_method', 'value']),
    location: contact.getIn(['location', 'value']),
    status: contact.getIn(['status', 'value']),
    note: contact.getIn(['note', 'value']),
    purpose: contact.getIn(['purpose', 'value']),
    errors: filteredErrors(contactTouchedFields, errors(contactValues)),
    statuses: getStatusesSelector(state).toJS(),
    purposes: getPurposesSelector(state).toJS(),
    communicationMethods: getCommunicationMethodsSelector(state).toJS(),
    inPersonCode: getInPersonCommunicationMethodValueSelector(state),
    locations: getLocationsSelector(state).toJS(),
    people: state.get('investigationPeople').toJS(),
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => {
  const actions = Object.assign(contactActions, {fetchPeople})
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact)
