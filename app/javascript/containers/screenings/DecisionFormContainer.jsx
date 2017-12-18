import {connect} from 'react-redux'
import ScreeningDecisionForm from 'views/ScreeningDecisionForm'
import {
  getAccessRestrictionOptionsSelector,
  getAccessRestrictionSelector,
  getAdditionalInformationSelector,
  getDecisionDetailOptionsSelector,
  getDecisionDetailSelector,
  getDecisionOptionsSelector,
  getDecisionSelector,
  getResetValuesSelector,
  getRestrictionRationaleSelector,
  getScreeningWithEditsSelector,
  getAdditionalInfoRequiredSelector,
} from 'selectors/screening/decisionFormSelectors'
import {save as saveScreening} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {
  resetFieldValues,
  setField,
  touchField,
  touchAllFields,
} from 'actions/screeningDecisionFormActions'
import {sdmPath} from 'common/config'

const mapStateToProps = (state) => (
  {
    accessRestriction: getAccessRestrictionSelector(state).toJS(),
    accessRestrictionOptions: getAccessRestrictionOptionsSelector().toJS(),
    additionalInformation: getAdditionalInformationSelector(state).toJS(),
    decision: getDecisionSelector(state).toJS(),
    decisionDetail: getDecisionDetailSelector(state).toJS(),
    decisionDetailOptions: getDecisionDetailOptionsSelector(state).toJS(),
    decisionOptions: getDecisionOptionsSelector().toJS(),
    resetValues: getResetValuesSelector(state).toJS(),
    restrictionRationale: getRestrictionRationaleSelector(state).toJS(),
    screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
    sdmPath: sdmPath(),
    isAdditionalInfoRequired: getAdditionalInfoRequiredSelector(state),
  }
)

const mergeProps = (stateProps, dispatchProps) => {
  const {dispatch} = dispatchProps
  const {
    accessRestriction,
    accessRestrictionOptions,
    additionalInformation,
    decision,
    decisionOptions,
    decisionDetail,
    decisionDetailOptions,
    resetValues,
    restrictionRationale,
    screeningWithEdits,
    sdmPath,
    isAdditionalInfoRequired,
  } = stateProps

  const onSave = () => {
    dispatch(saveScreening(screeningWithEdits))
    dispatch(touchAllFields())
    dispatch(setCardMode('decision-card', SHOW_MODE))
  }

  const onCancel = () => {
    dispatch(resetFieldValues({...resetValues}))
    dispatch(setCardMode('decision-card', SHOW_MODE))
  }

  const onChange = (field, value) => {
    dispatch(setField({field, value}))
    if (field === 'screening_decision') {
      dispatch(setField({field: 'screening_decision_detail', value: null}))
    }
    if (field === 'access_restrictions' && value === '') {
      dispatch(setField({field: 'restrictions_rationale', value: null}))
    }
    if (field === 'additional_information' && value === '') {
      dispatch(setField({field: 'additional_information', value: null}))
    }
  }
  const onBlur = (field) => dispatch(touchField({field}))

  return {
    accessRestriction,
    accessRestrictionOptions,
    additionalInformation,
    decision,
    decisionDetail,
    decisionDetailOptions,
    decisionOptions,
    onBlur,
    onCancel,
    onChange,
    onSave,
    restrictionRationale,
    sdmPath,
    isAdditionalInfoRequired,
  }
}

export default connect(mapStateToProps, null, mergeProps)(ScreeningDecisionForm)

