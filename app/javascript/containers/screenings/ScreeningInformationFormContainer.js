import {connect} from 'react-redux'
import ScreeningInformationForm from 'views/ScreeningInformationForm'
import COMMUNICATION_METHOD from 'enums/CommunicationMethod'
import {setField, resetFieldValues, touchField, touchAllFields} from 'actions/screeningInformationFormActions'
import {
  getScreeningInformationFormSelector,
  getVisibleErrorsSelector,
} from 'selectors/screening/screeningInformationFormSelectors'
import {saveCard} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'

const mapStateToProps = (state) => {
  const screening = getScreeningSelector(state)
  const screeningInformationForm = getScreeningInformationFormSelector(state)
  const communicationMethods = Object.keys(COMMUNICATION_METHOD)
    .map((value) => ({value, label: COMMUNICATION_METHOD[value]}))
  return {
    screening: screening.toJS(),
    assignee: screeningInformationForm.getIn(['assignee', 'value']),
    assigneeDisabled: Boolean(screening.get('assignee_staff_id')),
    communicationMethod: screeningInformationForm.getIn(['communication_method', 'value']),
    communicationMethods,
    endedAt: screeningInformationForm.getIn(['ended_at', 'value']),
    errors: getVisibleErrorsSelector(state).toJS(),
    name: screeningInformationForm.getIn(['name', 'value']),
    startedAt: screeningInformationForm.getIn(['started_at', 'value']),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onBlur: (fieldName) => dispatch(touchField(fieldName)),
  onChange: (fieldName, value) => dispatch(setField(fieldName, value)),
  onSave: () => {
    dispatch(saveCard('screening_information'))
    dispatch(touchAllFields())
    dispatch(setCardMode('screening-information-card', SHOW_MODE))
  },
  dispatch,
})

const mergeProps = (stateProps, dispatchProps) => {
  const {screening, ...props} = stateProps
  const {dispatch, ...actions} = dispatchProps
  const onCancel = () => {
    dispatch(resetFieldValues(screening))
    dispatch(touchAllFields())
    dispatch(setCardMode('screening-information-card', SHOW_MODE))
  }
  return {
    onCancel,
    ...props,
    ...actions,
  }
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ScreeningInformationForm)
