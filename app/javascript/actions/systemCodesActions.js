export const FETCH_SYSTEM_CODES = 'FETCH_SYSTEM_CODES'
export const FETCH_SYSTEM_CODES_COMPLETE = 'FETCH_SYSTEM_CODES_COMPLETE'
export function fetch() {
  return {type: FETCH_SYSTEM_CODES}
}
export function fetchSuccess(systemCodes) {
  return {type: FETCH_SYSTEM_CODES_COMPLETE, payload: {systemCodes}}
}
export function fetchFailure(error) {
  return {type: FETCH_SYSTEM_CODES_COMPLETE, payload: {error}, error: true}
}

