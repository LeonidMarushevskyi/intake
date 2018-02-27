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
  getRestrictionRationaleSelector,
  getAdditionalInfoRequiredSelector,
} from 'selectors/screening/decisionFormSelectors'
import {saveCard, clearCardEdits} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {
  setField,
  touchField,
  touchAllFields,
} from 'actions/screeningDecisionFormActions'
import {sdmPath} from 'common/config'

export const cardName = 'decision-card'

const mapStateToProps = (state) => (
  {
    accessRestriction: getAccessRestrictionSelector(state).toJS(),
    accessRestrictionOptions: getAccessRestrictionOptionsSelector().toJS(),
    additionalInformation: getAdditionalInformationSelector(state).toJS(),
    decision: getDecisionSelector(state).toJS(),
    decisionDetail: getDecisionDetailSelector(state).toJS(),
    decisionDetailOptions: getDecisionDetailOptionsSelector(state).toJS(),
    decisionOptions: getDecisionOptionsSelector().toJS(),
    restrictionRationale: getRestrictionRationaleSelector(state).toJS(),
    sdmPath: sdmPath(),
    isAdditionalInfoRequired: getAdditionalInfoRequiredSelector(state),
  }
)

const mapDispatchToProps = (dispatch) => ({
  onBlur: (field) => dispatch(touchField({field})),
  onCancel: () => {
    dispatch(clearCardEdits(cardName))
    dispatch(setCardMode(cardName, SHOW_MODE))
  },
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
    dispatch(saveCard(cardName))
    dispatch(touchAllFields())
    dispatch(setCardMode(cardName, SHOW_MODE))
  },
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningDecisionForm)

