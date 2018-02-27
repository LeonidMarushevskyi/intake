import {connect} from 'react-redux'
import {
  getIncidentDateSelector,
  getIncidentCountySelector,
  getAddressSelector,
  getLocationTypeSelector,
  getCountiesSelector,
  getStates,
  getLocationTypes,
  getVisibleErrorsSelector,
} from 'selectors/screening/incidentInformationFormSelector'
import IncidentInformationForm from 'views/IncidentInformationForm'
import {
  setField,
  touchAllFields,
  touchField,
} from 'actions/incidentInformationFormActions'
import {saveCard, clearCardEdits} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'

export const cardName = 'incident-information-card'

const mapStateToProps = (state) => ({
  errors: getVisibleErrorsSelector(state).toJS(),
  incidentDate: getIncidentDateSelector(state),
  selectedCounty: getIncidentCountySelector(state),
  address: getAddressSelector(state).toJS(),
  selectedLocationType: getLocationTypeSelector(state),
  counties: getCountiesSelector(state),
  usStates: getStates(),
  locationTypes: getLocationTypes(),
})

const mapDispatchToProps = (dispatch) => ({
  onBlur: (fieldName) => dispatch(touchField(fieldName)),
  onCancel: () => {
    dispatch(clearCardEdits(cardName))
    dispatch(touchAllFields())
    dispatch(setCardMode(cardName, SHOW_MODE))
  },
  onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
  onSave: () => {
    dispatch(saveCard(cardName))
    dispatch(touchAllFields())
    dispatch(setCardMode(cardName, SHOW_MODE))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(IncidentInformationForm)
