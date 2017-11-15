export const RESET_WORKER_SAFETY_FIELD_VALUES = 'RESET_WORKER_SAFETY_FIELD_VALUES'
export const SET_WORKER_SAFETY_FIELD = 'SET_WORKER_SAFETY_FIELD'
export function resetFieldValues({safety_alerts, safety_information}) {
  return {
    type: RESET_WORKER_SAFETY_FIELD_VALUES,
    payload: {safety_alerts, safety_information},
  }
}
export function setField(field, value) {
  return {type: SET_WORKER_SAFETY_FIELD, payload: {field, value}}
}
