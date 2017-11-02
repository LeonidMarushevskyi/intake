export const FETCH_SCREENINGS = 'FETCH_SCREENINGS'
export const FETCH_SCREENINGS_COMPLETE = 'FETCH_SCREENINGS_COMPLETE'
export function fetch() {
  return {type: FETCH_SCREENINGS}
}
export function fetchSuccess(screenings) {
  return {type: FETCH_SCREENINGS_COMPLETE, payload: {screenings}}
}
export function fetchFailure(error) {
  return {type: FETCH_SCREENINGS_COMPLETE, payload: {error}, error: true}
}

