import {connect} from 'react-redux'
import {
  getIncidentDateSelector,
  getIncidentCountySelector,
  getAddressSelector,
  getLocationTypeSelector,
  getScreeningWithEditsSelector,
  getCounties,
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
import {save as saveScreening} from 'actions/screeningActions'

const mapStateToProps = (state, _ownProps) => ({
  errors: getVisibleErrorsSelector(state).toJS(),
  incidentDate: getIncidentDateSelector(state),
  screening: getScreeningSelector(state).toJS(),
  screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
  selectedCounty: getIncidentCountySelector(state),
  address: getAddressSelector(state).toJS(),
  selectedLocationType: getLocationTypeSelector(state),
  counties: getCounties(),
  usStates: getStates(),
  locationTypes: getLocationTypes(),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {dispatch} = dispatchProps
  const {
    screening,
    screeningWithEdits,
    ...usedProps
  } = stateProps
  const {toggleShow} = ownProps

  const onSave = () => {
    dispatch(saveScreening(screeningWithEdits))
    dispatch(touchAllFields())
    toggleShow()
  }
  const onCancel = () => {
    dispatch(resetFieldValues(screening))
    dispatch(touchAllFields())
    toggleShow()
  }
  const onChange = (fieldName, value) => dispatch(setField(fieldName, value))
  const onBlur = (fieldName) => dispatch(touchField(fieldName))
  return {
    ...usedProps,
    onSave,
    onCancel,
    onChange,
    onBlur,
  }
}

export default connect(mapStateToProps, null, mergeProps)(IncidentInformationForm)
