export const CREATE_PARTICIPANT = 'CREATE_PARTICIPANT'
export const CREATE_PARTICIPANT_COMPLETE = 'CREATE_PARTICIPANT_COMPLETE'
export const DELETE_PARTICIPANT = 'DELETE_PARTICIPANT'
export const DELETE_PARTICIPANT_COMPLETE = 'DELETE_PARTICIPANT_COMPLETE'
export const UPDATE_PARTICIPANT = 'UPDATE_PARTICIPANT'
export const UPDATE_PARTICIPANT_COMPLETE = 'UPDATE_PARTICIPANT_COMPLETE'

export function updateParticipantSuccess(participant) {
  return {type: UPDATE_PARTICIPANT_COMPLETE, payload: {participant}}
}
export function updateParticipantFailure(error) {
  return {type: UPDATE_PARTICIPANT_COMPLETE, payload: {error}, error: true}
}
export function saveParticipant(participant) {
  return {type: UPDATE_PARTICIPANT, payload: {participant}}
}
export function createParticipantSuccess(participant) {
  return {type: CREATE_PARTICIPANT_COMPLETE, payload: {participant}}
}
export function createParticipantFailure(error) {
  return {type: CREATE_PARTICIPANT_COMPLETE, payload: {error}, error: true}
}
export function createParticipant(participant) {
  return {type: CREATE_PARTICIPANT, payload: {participant}}
}
export function deleteParticipantSuccess(id) {
  return {type: DELETE_PARTICIPANT_COMPLETE, payload: {id}}
}
export function deleteParticipantFailure(error) {
  return {type: DELETE_PARTICIPANT_COMPLETE, payload: {error}, error: true}
}
export function deleteParticipant(id) {
  return {type: DELETE_PARTICIPANT, payload: {id}}
}
