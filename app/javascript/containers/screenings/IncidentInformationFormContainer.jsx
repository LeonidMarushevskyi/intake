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
import {getScreeningSelector} from 'selectors/screeningSelectors'
import IncidentInformationForm from 'views/IncidentInformationForm'
import {
  setField,
  touchAllFields,
  touchField,
  resetFieldValues,
} from 'actions/incidentInformationFormActions'
import {saveCard} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'

const mapStateToProps = (state) => ({
  errors: getVisibleErrorsSelector(state).toJS(),
  incidentDate: getIncidentDateSelector(state),
  screening: getScreeningSelector(state).toJS(),
  selectedCounty: getIncidentCountySelector(state),
  address: getAddressSelector(state).toJS(),
  selectedLocationType: getLocationTypeSelector(state),
  counties: getCountiesSelector(state),
  usStates: getStates(),
  locationTypes: getLocationTypes(),
})

const mapDispatchToProps = (dispatch) => ({
  onBlur: (fieldName) => dispatch(touchField(fieldName)),
  onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
  onSave: () => {
    dispatch(saveCard('incident_information'))
    dispatch(touchAllFields())
    dispatch(setCardMode('incident-information-card', SHOW_MODE))
  },
  dispatch,
})

const mergeProps = (stateProps, dispatchProps) => {
  const {dispatch, ...actions} = dispatchProps
  const {screening, ...props} = stateProps

  const onCancel = () => {
    dispatch(resetFieldValues(screening))
    dispatch(touchAllFields())
    dispatch(setCardMode('incident-information-card', SHOW_MODE))
  }

  return {
    onCancel,
    ...props,
    ...actions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(IncidentInformationForm)
