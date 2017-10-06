export const CREATE_CONTACT = 'CREATE_CONTACT'
export const CREATE_CONTACT_SUCCESS = 'CREATE_CONTACT_SUCCESS'
export const CREATE_CONTACT_FAILURE = 'CREATE_CONTACT_FAILURE'
export function create({investigation_id, started_at, status, note, purpose, communication_method, location, people}) {
  return {type: CREATE_CONTACT, investigation_id, started_at, status, note, purpose, communication_method, location, people}
}
export function createSuccess({id, started_at, status, note, purpose, communication_method, location}) {
  return {type: CREATE_CONTACT_SUCCESS, id, started_at, status, note, purpose, communication_method, location}
}
export function createFailure(error) {
  return {type: CREATE_CONTACT_FAILURE, error}
}
