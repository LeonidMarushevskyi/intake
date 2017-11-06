export const CREATE_PERSON = 'CREATE_PERSON'
export const CREATE_PERSON_COMPLETE = 'CREATE_PERSON_COMPLETE'
export const DELETE_PERSON = 'DELETE_PERSON'
export const DELETE_PERSON_COMPLETE = 'DELETE_PERSON_COMPLETE'
export const UPDATE_PERSON = 'UPDATE_PERSON'
export const UPDATE_PERSON_COMPLETE = 'UPDATE_PERSON_COMPLETE'

export function updateParticipantSuccess(participant) {
  return {type: UPDATE_PERSON_COMPLETE, payload: {participant}}
}
export function updateParticipantFailure(error) {
  return {type: UPDATE_PERSON_COMPLETE, payload: {error}, error: true}
}
export function saveParticipant(participant) {
  return {type: UPDATE_PERSON, payload: {participant}}
}
export function createParticipantSuccess(participant) {
  return {type: CREATE_PERSON_COMPLETE, payload: {participant}}
}
export function createParticipantFailure(error) {
  return {type: CREATE_PERSON_COMPLETE, payload: {error}, error: true}
}
export function createParticipant(participant) {
  return {type: CREATE_PERSON, payload: {participant}}
}
export function deleteParticipantSuccess(id) {
  return {type: DELETE_PERSON_COMPLETE, payload: {id}}
}
export function deleteParticipantFailure(error) {
  return {type: DELETE_PERSON_COMPLETE, payload: {error}, error: true}
}
export function deleteParticipant(id) {
  return {type: DELETE_PERSON, payload: {id}}
}
