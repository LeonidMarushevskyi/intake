export const SET_CONTACT = 'SET_CONTACT'
export function setContact({investigation_id, started_at}) {
  return {type: SET_CONTACT, investigation_id, started_at}
}
