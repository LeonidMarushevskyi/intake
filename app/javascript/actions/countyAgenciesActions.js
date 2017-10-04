export const FETCH_COUNTY_AGENCIES = 'FETCH_COUNTY_AGENCIES'
export const FETCH_COUNTY_AGENCIES_SUCCESS = 'FETCH_COUNTY_AGENCIES_SUCCESS'
export const FETCH_COUNTY_AGENCIES_FAILURE = 'FETCH_COUNTY_AGENCIES_FAILURE'
export function fetch(countyId) {
  return {type: FETCH_COUNTY_AGENCIES, countyId}
}
export function fetchSuccess(countyAgencies) {
  return {type: FETCH_COUNTY_AGENCIES_SUCCESS, countyAgencies}
}
export function fetchFailure(error) {
  return {type: FETCH_COUNTY_AGENCIES_FAILURE, error}
}
