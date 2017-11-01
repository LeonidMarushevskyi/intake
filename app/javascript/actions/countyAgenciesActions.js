export const FETCH_COUNTY_AGENCIES = 'FETCH_COUNTY_AGENCIES'
export const FETCH_COUNTY_AGENCIES_SUCCESS = 'FETCH_COUNTY_AGENCIES_SUCCESS'
export const FETCH_COUNTY_AGENCIES_FAILURE = 'FETCH_COUNTY_AGENCIES_FAILURE'
export function fetch(countyId) {
  return {type: FETCH_COUNTY_AGENCIES, payload: {countyId}}
}
export function fetchSuccess(countyAgencies) {
  return {type: FETCH_COUNTY_AGENCIES_SUCCESS, payload: {countyAgencies}}
}
export function fetchFailure(error) {
  return {type: FETCH_COUNTY_AGENCIES_FAILURE, payload: {error}}
}
