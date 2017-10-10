import * as contactFormActions from 'actions/contactFormActions'
import {create} from 'actions/contactActions'
import ContactForm from 'investigations/ContactForm'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
  getStatusesSelector,
  getPurposesSelector,
  getLocationsSelector,
  getCommunicationMethodsSelector,
  getInPersonCommunicationMethodValueSelector,
  getOfficeLocationCodeValueSelector,
} from 'selectors/systemCodeSelectors'

import {
  getVisibleErrorsSelector,
  getHasErrorsValueSelector,
  getPeopleSelector,
  getSelectedPeopleIdsSelector,
} from 'selectors/contactFormSelectors'

const mapStateToProps = (state, ownProps) => {
  const contactForm = state.get('contactForm')
  return {
    investigationId: ownProps.params.investigation_id,
    startedAt: contactForm.getIn(['started_at', 'value']),
    communicationMethod: contactForm.getIn(['communication_method', 'value']),
    location: contactForm.getIn(['location', 'value']),
    status: contactForm.getIn(['status', 'value']),
    note: contactForm.getIn(['note', 'value']),
    purpose: contactForm.getIn(['purpose', 'value']),
    errors: getVisibleErrorsSelector(state).toJS(),
    valid: !getHasErrorsValueSelector(state),
    statuses: getStatusesSelector(state).toJS(),
    purposes: getPurposesSelector(state).toJS(),
    communicationMethods: getCommunicationMethodsSelector(state).toJS(),
    inPersonCode: getInPersonCommunicationMethodValueSelector(state),
    officeLocationCode: getOfficeLocationCodeValueSelector(state),
    locations: getLocationsSelector(state).toJS(),
    people: getPeopleSelector(state).toJS(),
    selectedPeopleIds: getSelectedPeopleIdsSelector(state).toJS(),
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => {
  const actions = Object.assign(contactFormActions, {create})
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm)
