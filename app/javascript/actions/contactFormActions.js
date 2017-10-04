export const BUILD_CONTACT = 'BUILD_CONTACT'
export const BUILD_CONTACT_SUCCESS = 'BUILD_CONTACT_SUCCESS'
export const BUILD_CONTACT_FAILURE = 'BUILD_CONTACT_FAILURE'
export const SET_CONTACT_FIELD = 'SET_CONTACT_FIELD'
export const TOUCH_CONTACT_FIELD = 'TOUCH_CONTACT_FIELD'
export const TOUCH_ALL_CONTACT_FIELDS = 'TOUCH_ALL_CONTACT_FIELDS'
export function build({investigation_id}) {
  return {type: BUILD_CONTACT, investigation_id}
}
export function buildSuccess({investigation_id, investigation_started_at, people}) {
  return {type: BUILD_CONTACT_SUCCESS, investigation_id, investigation_started_at, people}
}
export function buildFailure(error) {
  return {type: BUILD_CONTACT_FAILURE, error}
}
export function setField(field, value) {
  return {type: SET_CONTACT_FIELD, field, value}
}
export function touchField(field) {
  return {type: TOUCH_CONTACT_FIELD, field}
}
export function touchAllFields() {
  return {type: TOUCH_ALL_CONTACT_FIELDS}
}
