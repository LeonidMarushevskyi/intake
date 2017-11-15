export const RESET_SCREENING_DECISION_FIELD_VALUES = 'RESET_SCREENING_DECISION_FIELD_VALUES'
export const SET_SCREENING_DECISION_FIELD = 'SET_SCREENING_DECISION_FIELD'
export const TOUCH_SCREENING_DECISION_FIELD = 'TOUCH_SCREENING_DECISION_FIELD'
export const TOUCH_ALL_SCREENING_DECISION_FIELDS = 'TOUCH_ALL_SCREENING_DECISION_FIELDS'
export function resetFieldValues({
  screening_decision,
  screening_decision_detail,
  additional_information,
  access_restrictions,
  restrictions_rationale,
}) {
  return {
    type: RESET_SCREENING_DECISION_FIELD_VALUES,
    payload: {
      screening_decision,
      screening_decision_detail,
      additional_information,
      access_restrictions,
      restrictions_rationale,
    },
  }
}
export function setField({field, value}) {
  return {type: SET_SCREENING_DECISION_FIELD, payload: {field, value}}
}
export function touchField({field}) {
  return {type: TOUCH_SCREENING_DECISION_FIELD, payload: {field}}
}
export function touchAllFields() {
  return {type: TOUCH_ALL_SCREENING_DECISION_FIELDS}
}

