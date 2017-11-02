export const FETCH_INVESTIGATION = 'FETCH_INVESTIGATION'
export const FETCH_INVESTIGATION_COMPLETE = 'FETCH_INVESTIGATION_COMPLETE'
export function fetch({id}) {
  return {type: FETCH_INVESTIGATION, payload: {id}}
}
export function fetchSuccess(investigation) {
  return {type: FETCH_INVESTIGATION_COMPLETE, payload: {investigation}}
}
export function fetchFailure(error) {
  return {type: FETCH_INVESTIGATION_COMPLETE, payload: {error}, error: true}
}
