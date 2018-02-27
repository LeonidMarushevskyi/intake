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
  getAdditionalInfoRequiredSelector,
} from 'selectors/screening/decisionFormSelectors'
import {saveCard} from 'actions/screeningActions'
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
    sdmPath: sdmPath(),
    isAdditionalInfoRequired: getAdditionalInfoRequiredSelector(state),
  }
)

const mapDispatchToProps = (dispatch) => ({
  onBlur: (field) => dispatch(touchField({field})),
  onChange: (field, value) => {
    dispatch(setField({field, value}))
    if (field === 'screening_decision') {
      dispatch(setField({field: 'screening_decision_detail', value: null}))
    }
    if (field === 'access_restrictions' && value === '') {
      dispatch(setField({field: 'restrictions_rationale', value: null}))
    }
  },
  onSave: () => {
    dispatch(saveCard('decision'))
    dispatch(touchAllFields())
    dispatch(setCardMode('decision-card', SHOW_MODE))
  },
  dispatch,
})

const mergeProps = (stateProps, dispatchProps) => {
  const {dispatch, ...actions} = dispatchProps
  const {resetValues, ...props} = stateProps

  const onCancel = () => {
    dispatch(resetFieldValues({...resetValues}))
    dispatch(setCardMode('decision-card', SHOW_MODE))
  }

  return {
    onCancel,
    ...props,
    ...actions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ScreeningDecisionForm)

