export const FETCH_INVESTIGATION_SUCCESS = 'FETCH_INVESTIGATION_SUCCESS'
export function fetchSuccess(investigation) {
  return {type: FETCH_INVESTIGATION_SUCCESS, investigation}
}
