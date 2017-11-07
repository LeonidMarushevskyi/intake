export const FETCH_SCREENING_ALLEGATIONS = 'FETCH_SCREENING_ALLEGATIONS'
export const FETCH_SCREENING_ALLEGATIONS_COMPLETE = 'FETCH_SCREENING_ALLEGATIONS_COMPLETE'

export function fetchSuccess(allegations) {
  return {type: FETCH_SCREENING_ALLEGATIONS_COMPLETE, payload: {allegations}}
}

export function fetchFailure(error) {
  return {type: FETCH_SCREENING_ALLEGATIONS_COMPLETE, payload: {error}, error: true}
}

export function fetch(screeningId) {
  return {type: FETCH_SCREENING_ALLEGATIONS, payload: {screeningId}}
}
