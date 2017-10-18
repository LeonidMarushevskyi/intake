export const RESET_CROSS_REPORT_FIELD_VALUES = 'RESET_CROSS_REPORT_FIELD_VALUES'
export const SET_CROSS_REPORT_FIELD = 'SET_CROSS_REPORT_FIELD'
export const SET_CROSS_REPORT_AGENCY_TYPE_FIELD = 'SET_CROSS_REPORT_AGENCY_TYPE_FIELD'
export const SET_CROSS_REPORT_AGENCY_FIELD = 'SET_CROSS_REPORT_AGENCY_FIELD'
export const TOUCH_CROSS_REPORT_FIELD = 'TOUCH_CROSS_REPORT_FIELD'
export const TOUCH_CROSS_REPORT_AGENCY_FIELD = 'TOUCH_CROSS_REPORT_AGENCY_FIELD'

export function resetFieldValues(screening) {
  return {type: RESET_CROSS_REPORT_FIELD_VALUES, screening}
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
export function setAgencyTypeField(field, value) {
  return {type: SET_CROSS_REPORT_AGENCY_TYPE_FIELD, field, value}
}
export function setAgencyField(agencyType, value) {
  return {type: SET_CROSS_REPORT_AGENCY_FIELD, agencyType, value}
}
