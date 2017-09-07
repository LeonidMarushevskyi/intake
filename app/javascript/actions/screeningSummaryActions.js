export const FETCH_SCREENING_SUMMARY = 'FETCH_SCREENING_SUMMARY'
export const FETCH_SCREENING_SUMMARY_SUCCESS = 'FETCH_SCREENING_SUMMARY_SUCCESS'
export const FETCH_SCREENING_SUMMARY_FAILURE = 'FETCH_SCREENING_SUMMARY_FAILURE'

export function fetchSuccess(screeningSummary) {
  return {type: FETCH_SCREENING_SUMMARY_SUCCESS, screeningSummary}
}

export function fetchFailure(error) {
  return {type: FETCH_SCREENING_SUMMARY_FAILURE, error}
}

export function fetch(id) {
  return {type: FETCH_SCREENING_SUMMARY, id}
}
