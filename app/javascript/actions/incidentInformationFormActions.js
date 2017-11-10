export const RESET_INCIDENT_INFORMATION_FORM_FIELDS =
  'RESET_INCIDENT_INFORMATION_FORM_FIELDS'
export const SET_INCIDENT_INFORMATION_FORM_FIELD = 'SET_INCIDENT_INFORMATION_FORM_FIELD'
export const TOUCH_ALL_INCIDENT_INFORMATION_FORM_FIELDS = 'TOUCH_ALL_INCIDENT_INFORMATION_FORM_FILEDS'
export const TOUCH_INCIDENT_INFORMATION_FORM_FIELD = 'TOUCH_INCIDENT_INFORMATION_FORM_FIELD'

export function resetFieldValues(screening) {
  return {type: RESET_INCIDENT_INFORMATION_FORM_FIELDS, payload: {screening}}
}

export function setField(fieldSet, value) {
  return {type: SET_INCIDENT_INFORMATION_FORM_FIELD, payload: {fieldSet, value}}
}
export function touchField(field) {
  return {type: TOUCH_INCIDENT_INFORMATION_FORM_FIELD, payload: {field}}
}
export function touchAllFields() {
  return {type: TOUCH_ALL_INCIDENT_INFORMATION_FORM_FIELDS}
}
