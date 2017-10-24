import * as contactFormActions from 'actions/contactFormActions'
import {save} from 'actions/contactActions'
import ContactForm from 'investigations/ContactForm'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
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
  getFormattedPeopleSelector,
  getSelectedPeopleIdsSelector,
} from 'selectors/contactFormSelectors'

const mapStateToProps = (state, ownProps) => {
  const contactForm = state.get('contactForm')
  const id = ownProps.params.id
  return {
    communicationMethod: contactForm.getIn(['communication_method', 'value']),
    communicationMethods: getCommunicationMethodsSelector(state).toJS(),
    errors: getVisibleErrorsSelector(state).toJS(),
    hasCancel: Boolean(id),
    id,
    inPersonCode: getInPersonCommunicationMethodValueSelector(state),
    investigationId: ownProps.params.investigation_id,
    location: contactForm.getIn(['location', 'value']),
    locations: getLocationsSelector(state).toJS(),
    note: contactForm.getIn(['note', 'value']),
    officeLocationCode: getOfficeLocationCodeValueSelector(state),
    people: getFormattedPeopleSelector(state).toJS(),
    purpose: contactForm.getIn(['purpose', 'value']),
    purposes: getPurposesSelector(state).toJS(),
    selectedPeopleIds: getSelectedPeopleIdsSelector(state).toJS(),
    startedAt: contactForm.getIn(['started_at', 'value']),
    status: contactForm.getIn(['status', 'value']),
    statuses: getStatusesSelector(state).toJS(),
    valid: !getHasErrorsValueSelector(state),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const investigationId = ownProps.params.investigation_id
  const id = ownProps.params.id
  const contactShowPath = `/investigations/${investigationId}/contacts/${id}`
  const actions = Object.assign(contactFormActions, {save})
  return {
    actions: bindActionCreators(actions, dispatch),
    onCancel: () => dispatch(push(contactShowPath)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm)
