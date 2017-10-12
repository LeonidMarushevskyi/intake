export const SET_CROSS_REPORT_FIELD = 'SET_CROSS_REPORT_FIELD'

export function setField(field, value) {
  return {type: SET_CROSS_REPORT_FIELD, field, value}
}
