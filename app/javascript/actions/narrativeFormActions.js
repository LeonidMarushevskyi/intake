export const RESET_NARRATIVE_FIELD_VALUES = 'RESET_NARRATIVE_FIELD_VALUES'
export const SET_NARRATIVE_FIELD = 'SET_NARRATIVE_FIELD'
export const TOUCH_NARRATIVE_FIELD = 'TOUCH_NARRATIVE_FIELD'
export const TOUCH_ALL_NARRATIVE_FIELDS = 'TOUCH_ALL_NARRATIVE_FIELDS'
export function resetFieldValues(screening) {
  return {type: RESET_NARRATIVE_FIELD_VALUES, payload: {screening}}
}
export function setField(field, value) {
  return {type: SET_NARRATIVE_FIELD, payload: {field, value}}
}
export function touchField(field) {
  return {type: TOUCH_NARRATIVE_FIELD, payload: {field}}
}
export function touchAllFields() {
  return {type: TOUCH_ALL_NARRATIVE_FIELDS}
}
