import {connect} from 'react-redux'
import {
  getIncidentDateSelector,
  getIncidentCountySelector,
  getAddressSelector,
  getLocationTypeSelector,
} from 'selectors/screening/incidentInformationSelector'
import IncidentInformationShow from 'views/incidentInformation/IncidentInformationShow'

const mapStateToProps = (state, ownProps) => ({
  errors: ownProps.errors || [],
  incidentDate: getIncidentDateSelector(state),
  incidentCounty: getIncidentCountySelector(state),
  address: getAddressSelector(state).toJS(),
  locationType: getLocationTypeSelector(state),
})

export default connect(mapStateToProps)(IncidentInformationShow)
