import ContactShow from 'investigations/ContactShow'
import {connect} from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const contact = state.get('contact')
  const statusCode = contact.getIn(['status', 'value'])
  const purposeCode = contact.getIn(['purpose', 'value'])
  const communicationMethodCode = contact.getIn(['communication_method', 'value'])
  const locationCode = contact.getIn(['location', 'value'])
  const contactStatuses = state.get('contactStatuses').toJS()
  const contactPurposes = state.get('contactPurposes').toJS()
  const locations = state.get('locations').toJS()
  const communicationMethods = state.get('communicationMethods').toJS()
  const systemCodeDisplayValue = (systemCodes, value) => {
    const systemCode = systemCodes.find(({code}) => code === value) || {}
    return systemCode.value
  }
  return {
    investigationId: ownProps.params.investigation_id,
    startedAt: contact.getIn(['started_at', 'value']),
    status: systemCodeDisplayValue(contactStatuses, statusCode),
    purpose: systemCodeDisplayValue(contactPurposes, purposeCode),
    communicationMethod: systemCodeDisplayValue(communicationMethods, communicationMethodCode),
    location: systemCodeDisplayValue(locations, locationCode),
    note: contact.getIn(['note', 'value']),
  }
}

export default connect(mapStateToProps)(ContactShow)
