export const FETCH_COUNTY_AGENCY = 'FETCH_COUNTY_AGENCY'
export const FETCH_COUNTY_AGENCY_SUCCESS = 'FETCH_COUNTY_AGENCY_SUCCESS'
export const FETCH_COUNTY_AGENCY_FAILURE = 'FETCH_COUNTY_AGENCY_FAILURE'
export function fetch(countyId) {
  return {type: FETCH_COUNTY_AGENCY, countyId}
}
export function fetchSuccess(countyAgency) {
  return {type: FETCH_COUNTY_AGENCY_SUCCESS, countyAgency}
}
export function fetchFailure(error) {
  return {type: FETCH_COUNTY_AGENCY_FAILURE, error}
}
