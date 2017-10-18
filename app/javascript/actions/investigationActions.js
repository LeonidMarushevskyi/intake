export const FETCH_INVESTIGATION = 'FETCH_INVESTIGATION'
export const FETCH_INVESTIGATION_SUCCESS = 'FETCH_INVESTIGATION_SUCCESS'
export const FETCH_INVESTIGATION_FAILURE = 'FETCH_INVESTIGATION_FAILURE'
export function fetch({id}) {
  return {type: FETCH_INVESTIGATION, id}
}
export function fetchSuccess(investigation) {
  return {type: FETCH_INVESTIGATION_SUCCESS, investigation}
}
export function fetchFailure(error) {
  return {type: FETCH_INVESTIGATION_FAILURE, error}
}
