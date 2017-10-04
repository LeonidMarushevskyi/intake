import * as contactFormActions from 'actions/contactFormActions'
import {create} from 'actions/contactActions'
import ContactFormValidator from 'investigations/contacts/ContactFormValidator'
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

const errors = (contactForm) => (
  new ContactFormValidator(contactForm).validate()
)

const mapStateToProps = (state, ownProps) => {
  const contactForm = state.get('contactForm')
  const contactValues = contactForm.map((field) => field.get('value')).toJS()
  const contactTouchedFields = contactForm.filter((field) => field.get('touched')).keySeq().toJS()
  return {
    investigationId: ownProps.params.investigation_id,
    startedAt: contactForm.getIn(['started_at', 'value']),
    communicationMethod: contactForm.getIn(['communication_method', 'value']),
    location: contactForm.getIn(['location', 'value']),
    status: contactForm.getIn(['status', 'value']),
    note: contactForm.getIn(['note', 'value']),
    purpose: contactForm.getIn(['purpose', 'value']),
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
  const actions = Object.assign(contactFormActions, {create})
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact)
