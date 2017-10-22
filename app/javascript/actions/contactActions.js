export const CREATE_CONTACT = 'CREATE_CONTACT'
export const CREATE_CONTACT_SUCCESS = 'CREATE_CONTACT_SUCCESS'
export const CREATE_CONTACT_FAILURE = 'CREATE_CONTACT_FAILURE'
export const FETCH_CONTACT = 'FETCH_CONTACT'
export const FETCH_CONTACT_SUCCESS = 'FETCH_CONTACT_SUCCESS'
export const FETCH_CONTACT_FAILURE = 'FETCH_CONTACT_FAILURE'
export function save({id, investigation_id, started_at, status, note, purpose, communication_method, location, people}) {
  return {type: CREATE_CONTACT, id, investigation_id, started_at, status, note, purpose, communication_method, location, people}
}
export function createSuccess({id, started_at, status, note, purpose, communication_method, location}) {
  return {type: CREATE_CONTACT_SUCCESS, id, started_at, status, note, purpose, communication_method, location}
}
export function createFailure(error) {
  return {type: CREATE_CONTACT_FAILURE, error}
}
export function fetch(investigationId, id) {
  return {type: FETCH_CONTACT, investigation_id: investigationId, id}
}
export function fetchSuccess(investigationId, {id, started_at, status, note, purpose, communication_method, location, people}) {
  return {type: FETCH_CONTACT_SUCCESS, investigation_id: investigationId, id, started_at, status, note, purpose, communication_method, location, people}
}
export function fetchFailure(error) {
  return {type: FETCH_CONTACT_FAILURE, error}
}
