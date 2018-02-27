export const CREATE_PERSON = 'CREATE_PERSON'
export const CREATE_PERSON_COMPLETE = 'CREATE_PERSON_COMPLETE'
export const DELETE_PERSON = 'DELETE_PERSON'
export const DELETE_PERSON_COMPLETE = 'DELETE_PERSON_COMPLETE'
export const UPDATE_PERSON = 'UPDATE_PERSON'
export const UPDATE_PERSON_COMPLETE = 'UPDATE_PERSON_COMPLETE'
export const CREATE_SNAPSHOT_PERSON = 'CREATE_SNAPSHOT_PERSON'
export const DELETE_SNAPSHOT_PERSON = 'DELETE_SNAPSHOT_PERSON'
export const CLEAR_PEOPLE = 'CLEAR_PEOPLE'

export function updatePersonSuccess(person) {
  return {type: UPDATE_PERSON_COMPLETE, payload: {person}}
}
export function updatePersonFailure(error) {
  return {type: UPDATE_PERSON_COMPLETE, payload: {error}, error: true}
}
export function savePerson(personId) {
  return {type: UPDATE_PERSON, payload: {personId}}
}
export function createPersonSuccess(person) {
  return {type: CREATE_PERSON_COMPLETE, payload: {person}}
}
export function createPersonFailure(error) {
  return {type: CREATE_PERSON_COMPLETE, payload: {error}, error: true}
}
export function createPerson(person) {
  return {type: CREATE_PERSON, payload: {person}}
}
export function deletePersonSuccess(id) {
  return {type: DELETE_PERSON_COMPLETE, payload: {id}}
}
export function deletePersonFailure(error) {
  return {type: DELETE_PERSON_COMPLETE, payload: {error}, error: true}
}
export function deletePerson(id) {
  return {type: DELETE_PERSON, payload: {id}}
}
export function createSnapshotPerson(person) {
  return {type: CREATE_SNAPSHOT_PERSON, payload: {person}}
}
export function deleteSnapshotPerson(id) {
  return {type: DELETE_SNAPSHOT_PERSON, payload: {id}}
}
export function clearPeople() {
  return {type: CLEAR_PEOPLE}
}
