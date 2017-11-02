export const FETCH_COUNTY_AGENCIES = 'FETCH_COUNTY_AGENCIES'
export const FETCH_COUNTY_AGENCIES_COMPLETE = 'FETCH_COUNTY_AGENCIES_COMPLETE'
export function fetch(countyId) {
  return {type: FETCH_COUNTY_AGENCIES, payload: {countyId}}
}
export function fetchSuccess(countyAgencies) {
  return {type: FETCH_COUNTY_AGENCIES_COMPLETE, payload: {countyAgencies}}
}
export function fetchFailure(error) {
  return {type: FETCH_COUNTY_AGENCIES_COMPLETE, payload: {error}, error: true}
}
