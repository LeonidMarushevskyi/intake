import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {isRequiredCreate, combineCompact} from 'utils/validator'
import SCREENING_DECISION from 'enums/ScreeningDecision'
import ACCESS_RESTRICTIONS from 'enums/AccessRestrictions'
import SCREENING_DECISION_OPTIONS from 'enums/ScreeningDecisionOptions'

const selectOptionsFormatter = (options) => (
  Object.entries(options).map(([key, value]) => ({value: key, label: value}))
)

export const getDecisionFormSelector = (state) => state.get('screeningDecisionForm', Map())
export const getDecisionOptionsSelector = () => fromJS(selectOptionsFormatter(SCREENING_DECISION))
export const getAccessRestrictionOptionsSelector = () => fromJS(selectOptionsFormatter(ACCESS_RESTRICTIONS))

export const getDecisionValueSelector = (state) => (
  state.getIn(['screeningDecisionForm', 'screening_decision', 'value'])
)

export const getDecisionDetailValueSelector = (state) => (
  state.getIn(['screeningDecisionForm', 'screening_decision_detail', 'value'])
)

export const getDecisionDetailOptionsSelector = createSelector(
  (state) => state.getIn(['screeningDecisionForm', 'screening_decision', 'value'], ''),
  (decision) => {
    const options = SCREENING_DECISION_OPTIONS[decision] && SCREENING_DECISION_OPTIONS[decision].values
    if (options) {
      return fromJS(selectOptionsFormatter(options))
    } else {
      return List()
    }
  }
)

export const getErrorsSelector = createSelector(
  (state) => state.getIn(['screeningDecisionForm', 'screening_decision', 'value']),
  (state) => state.getIn(['screeningDecisionForm', 'screening_decision_detail', 'value']),
  (state) => state.get('allegationsForm', List()),
  (decision, decisionDetail, allegations) => (
    fromJS({
      screening_decision: combineCompact(
        isRequiredCreate(decision, 'Please enter a decision'),
        () => {
          if (decision === 'promote_to_referral' &&
            allegations.every((allegation) => allegation.get('allegationTypes').isEmpty())) {
            return 'Please enter at least one allegation to promote to referral.'
          } else {
            return undefined
          }
        }
      ),
      screening_decision_detail: combineCompact(
        () => {
          if (decision === 'promote_to_referral' && !decisionDetail) {
            return 'Please enter a response time'
          } else {
            return undefined
          }
        }
      ),
    })
  )
)

const getTouchedFieldsSelector = createSelector(
  getDecisionFormSelector,
  (decisionForm) => decisionForm.filter((field) => field.get('touched')).keySeq().toList()
)

export const getVisibleErrorsSelector = createSelector(
  getErrorsSelector,
  getTouchedFieldsSelector,
  (errors, touchedFields) => errors.reduce(
    (filteredErrors, fieldErrors, field) => {
      if (touchedFields.includes(field)) {
        return filteredErrors.set(field, fieldErrors)
      } else {
        return filteredErrors.set(field, List())
      }
    },
    Map()
  )
)

export const getDecisionDetailSelector = createSelector(
  getDecisionValueSelector,
  getDecisionDetailValueSelector,
  (state) => getVisibleErrorsSelector(state).get('screening_decision_detail'),
  (decision, value, errors) => {
    const required = decision === 'promote_to_referral'
    const label = SCREENING_DECISION_OPTIONS[decision] && SCREENING_DECISION_OPTIONS[decision].label || ''
    return Map({label: label, required, value: value || '', errors})
  }
)

export const getDecisionSelector = createSelector(
  getDecisionValueSelector,
  (state) => getVisibleErrorsSelector(state).get('screening_decision'),
  (value, errors) => Map({value, errors})
)

export const getAdditionalInformationSelector = createSelector(
  (state) => state.getIn(['screeningDecisionForm', 'additional_information', 'value']),
  (value) => Map({value: value || ''})
)

export const getAccessRestrictionSelector = createSelector(
  (state) => state.getIn(['screeningDecisionForm', 'access_restrictions', 'value']),
  (value) => Map({value: value || ''})
)

export const getRestrictionRationaleSelector = createSelector(
  (state) => state.getIn(['screeningDecisionForm', 'restrictions_rationale', 'value']),
  (value) => Map({value: value || ''})
)

export const getScreeningWithEditsSelector = createSelector(
  getScreeningSelector,
  getDecisionValueSelector,
  getDecisionDetailValueSelector,
  (state) => state.getIn(['screeningDecisionForm', 'additional_information', 'value']),
  (state) => state.getIn(['screeningDecisionForm', 'access_restrictions', 'value']),
  (state) => state.getIn(['screeningDecisionForm', 'restrictions_rationale', 'value']),
  (screening, decision, decisionDetail, additionalInformation, accessRestriction, restrictionRationale) => (
    screening.set('screening_decision', decision)
      .set('screening_decision_detail', decisionDetail)
      .set('additional_information', additionalInformation)
      .set('access_restrictions', accessRestriction)
      .set('restrictions_rationale', restrictionRationale)
  )
)

export const getResetValuesSelector = createSelector(
  getScreeningSelector,
  (screening) => Map({
    screening_decision: screening.get('screening_decision'),
    screening_decision_detail: screening.get('screening_decision_detail'),
    additional_information: screening.get('additional_information'),
    access_restrictions: screening.get('access_restrictions'),
    restrictions_rationale: screening.get('restrictions_rationale'),
  })
)
