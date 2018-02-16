import {
  CLEAR_HISTORY_OF_INVOLVEMENTS,
  FETCH_HISTORY_OF_INVOLVEMENTS,
  FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE,
} from 'actions/actionTypes'

export function clearHistoryOfInvolvement() {
  return {type: CLEAR_HISTORY_OF_INVOLVEMENTS}
}
export function fetchHistoryOfInvolvementsSuccess(history_of_involvements) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE, payload: {history_of_involvements}}
}
export function fetchHistoryOfInvolvementsFailure(error) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE, payload: {error}, error: true}
}
export function fetchHistoryOfInvolvements(type, id) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS, payload: {type, id}}
}
