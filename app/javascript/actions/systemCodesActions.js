export const FETCH_SYSTEM_CODES = 'FETCH_SYSTEM_CODES'
export const FETCH_SYSTEM_CODES_SUCCESS = 'FETCH_SYSTEM_CODES_SUCCESS'
export const FETCH_SYSTEM_CODES_FAILURE = 'FETCH_SYSTEM_CODES_FAILURE'
export function fetch() {
  return {type: FETCH_SYSTEM_CODES}
}
export function fetchSuccess(systemCodes) {
  return {type: FETCH_SYSTEM_CODES_SUCCESS, payload: {systemCodes}}
}
export function fetchFailure(error) {
  return {type: FETCH_SYSTEM_CODES_FAILURE, payload: {error}}
}

