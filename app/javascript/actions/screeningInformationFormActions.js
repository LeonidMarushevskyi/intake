export const RESET_SCREENING_INFORMATION_FORM_FIELD_VALUES = 'RESET_SCREENING_INFORMATION_FORM_FIELD_VALUES'
export const SET_SCREENING_INFORMATION_FORM_FIELD = 'SET_SCREENING_INFORMATION_FORM_FIELD'
export const TOUCH_SCREENING_INFORMATION_FORM_FIELD = 'TOUCH_SCREENING_INFORMATION_FORM_FIELD'
export const TOUCH_ALL_SCREENING_INFORMATION_FORM_FIELDS = 'TOUCH_ALL_SCREENING_INFORMATION_FORM_FIELDS'
export function resetFieldValues({name, assignee, started_at, ended_at, communication_method}) {
  return {
    type: RESET_SCREENING_INFORMATION_FORM_FIELD_VALUES,
    payload: {name, assignee, started_at, ended_at, communication_method},
  }
}
export function setField(field, value) {
  return {type: SET_SCREENING_INFORMATION_FORM_FIELD, payload: {field, value}}
}
export function touchField(field) {
  return {type: TOUCH_SCREENING_INFORMATION_FORM_FIELD, payload: {field}}
}
export function touchAllFields() {
  return {type: TOUCH_ALL_SCREENING_INFORMATION_FORM_FIELDS}
}
