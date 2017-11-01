export const SAVE_CONTACT = 'SAVE_CONTACT'
export const SAVE_CONTACT_COMPLETE = 'SAVE_CONTACT_COMPLETE'
export const FETCH_CONTACT = 'FETCH_CONTACT'
export const FETCH_CONTACT_COMPLETE = 'FETCH_CONTACT_COMPLETE'
export function save({id, investigation_id, started_at, status, note, purpose, communication_method, location, people}) {
  return {
    type: SAVE_CONTACT,
    payload: {
      id,
      investigation_id,
      started_at,
      status,
      note,
      purpose,
      communication_method,
      location,
      people,
    },
  }
}
export function saveSuccess({id, started_at, status, note, purpose, communication_method, location}) {
  return {
    type: SAVE_CONTACT_COMPLETE,
    payload: {
      id,
      started_at,
      status,
      note,
      purpose,
      communication_method,
      location,
    },
  }
}
export function saveFailure(error) {
  return {type: SAVE_CONTACT_COMPLETE, payload: {error}, error: true}
}
export function fetch(investigationId, id) {
  return {
    type: FETCH_CONTACT,
    payload: {investigation_id: investigationId, id},
  }
}
export function fetchSuccess(investigationId, {id, started_at, status, note, purpose, communication_method, location, people}) {
  return {
    type: FETCH_CONTACT_COMPLETE,
    payload: {
      investigation_id: investigationId,
      id, started_at,
      status,
      note,
      purpose,
      communication_method,
      location,
      people,
    },
  }
}
export function fetchFailure(error) {
  return {type: FETCH_CONTACT_COMPLETE, payload: {error}, error: true}
}
