export const CLEAR_CROSS_REPORT_AGENCY_VALUES = 'CLEAR_CROSS_REPORT_AGENCY_VALUES'
export const CLEAR_CROSS_REPORT_VALUES = 'CLEAR_CROSS_REPORT_VALUES'
export const RESET_CROSS_REPORT_VALUES = 'RESET_CROSS_REPORT_VALUES'
export const SAVE_CROSS_REPORT = 'SAVE_CROSS_REPORT'
export const SET_CROSS_REPORT_AGENCY = 'SET_CROSS_REPORT_AGENCY'
export const SET_CROSS_REPORT_AGENCY_TYPE = 'SET_CROSS_REPORT_AGENCY_TYPE'
export const SET_CROSS_REPORT_FIELD = 'SET_CROSS_REPORT_FIELD'
export const TOUCH_CROSS_REPORT_AGENCY_FIELD = 'TOUCH_CROSS_REPORT_AGENCY_FIELD'
export const TOUCH_CROSS_REPORT_FIELD = 'TOUCH_CROSS_REPORT_FIELD'
export const TOUCH_ALL_CROSS_REPORT_FIELDS = 'TOUCH_ALL_CROSS_REPORT_FIELDS'

export function clearAllFields() {
  return {type: CLEAR_CROSS_REPORT_VALUES}
}
export function clearAllAgencyFields(agencyType) {
  return {type: CLEAR_CROSS_REPORT_AGENCY_VALUES, agencyType}
}
export function resetFieldValues(screening) {
  return {type: RESET_CROSS_REPORT_VALUES, screening}
}
export function save(screening) {
  return {type: SAVE_CROSS_REPORT, screening}
}
export function setField(field, value) {
  return {type: SET_CROSS_REPORT_FIELD, field, value}
}
export function touchField(field) {
  return {type: TOUCH_CROSS_REPORT_FIELD, field}
}
export function touchAgencyField(agencyType) {
  return {type: TOUCH_CROSS_REPORT_AGENCY_FIELD, agencyType}
}
export function touchAllFields() {
  return {type: TOUCH_ALL_CROSS_REPORT_FIELDS}
}
export function setAgencyTypeField(field, value) {
  return {type: SET_CROSS_REPORT_AGENCY_TYPE, field, value}
}
export function setAgencyField(agencyType, value) {
  return {type: SET_CROSS_REPORT_AGENCY, agencyType, value}
}
