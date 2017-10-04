export const BUILD_CONTACT = 'BUILD_CONTACT'
export const SET_CONTACT_FIELD = 'SET_CONTACT_FIELD'
export const TOUCH_CONTACT_FIELD = 'TOUCH_CONTACT_FIELD'
export function build({investigation_id}) {
  return {type: BUILD_CONTACT, investigation_id}
}
export function setField(field, value) {
  return {type: SET_CONTACT_FIELD, field, value}
}
export function touchField(field) {
  return {type: TOUCH_CONTACT_FIELD, field}
}
