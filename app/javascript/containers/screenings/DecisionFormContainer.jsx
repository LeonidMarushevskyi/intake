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
} from 'selectors/screening/decisionFormSelectors'
import {saveScreening} from 'actions/screeningActions'
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
  }
)

const mergeProps = (stateProps, dispatchProps, ownProps) => {
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
  } = stateProps
  const {toggleMode} = ownProps

  const onSave = () => {
    toggleMode()
    dispatch(saveScreening(screeningWithEdits))
    dispatch(touchAllFields())
  }

  const onCancel = () => {
    toggleMode()
    dispatch(resetFieldValues({...resetValues}))
  }

  const onChange = (field, value) => {
    dispatch(setField({field, value}))
    if (field === 'screening_decision') {
      dispatch(setField({field: 'screening_decision_detail', value: null}))
    }
    if (field === 'access_restrictions' && value === '') {
      dispatch(setField({field: 'restrictions_rationale', value: null}))
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
  }
}

export default connect(mapStateToProps, null, mergeProps)(ScreeningDecisionForm)

