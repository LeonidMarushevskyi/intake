import {
  CREATE_SCREENING,
  CREATE_SCREENING_COMPLETE,
  FETCH_SCREENING,
  FETCH_SCREENING_COMPLETE,
  FETCH_HISTORY_OF_INVOLVEMENTS,
  FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE,
  FETCH_RELATIONSHIPS,
  FETCH_RELATIONSHIPS_COMPLETE,
  SUBMIT_SCREENING,
  SUBMIT_SCREENING_COMPLETE,
} from 'actions/actionTypes'

export const SAVE_SCREENING = 'SAVE_SCREENING'
export const SAVE_SCREENING_COMPLETE = 'SAVE_SCREENING_COMPLETE'
export function createScreeningSuccess(screening) {
  return {type: CREATE_SCREENING_COMPLETE, payload: {screening}}
}

export function createScreeningFailure(error) {
  return {type: CREATE_SCREENING_COMPLETE, payload: {error}, error: true}
}

export function createScreening() {
  return {type: CREATE_SCREENING}
}

export function fetchScreeningSuccess(screening) {
  return {type: FETCH_SCREENING_COMPLETE, payload: {screening}}
}

export function fetchScreeningFailure(error) {
  return {type: FETCH_SCREENING_COMPLETE, payload: {error}, error: true}
}

export function fetchScreening(id) {
  return {type: FETCH_SCREENING, payload: {id}}
}
export function saveSuccess(screening) {
  return {type: SAVE_SCREENING_COMPLETE, payload: {screening}}
}
export function saveFailure(error) {
  return {type: SAVE_SCREENING_COMPLETE, payload: {error}, error: true}
}
export function save(screening) {
  return {type: SAVE_SCREENING, payload: {screening}}
}

export function fetchHistoryOfInvolvementsSuccess(history_of_involvements) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE, payload: {history_of_involvements}}
}

export function fetchHistoryOfInvolvementsFailure(error) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE, payload: {error}, error: true}
}

export function fetchHistoryOfInvolvements(id) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS, payload: {id}}
}

export function submitScreeningSuccess(screening) {
  return {type: SUBMIT_SCREENING_COMPLETE, payload: {screening}}
}

export function submitScreeningFailure(error) {
  return {type: SUBMIT_SCREENING_COMPLETE, payload: {error}, error: true}
}

export function submitScreening(id) {
  return {type: SUBMIT_SCREENING, payload: {id}}
}

export function fetchRelationshipsSuccess(relationships) {
  return {type: FETCH_RELATIONSHIPS_COMPLETE, payload: {relationships}}
}

export function fetchRelationshipsFailure(error) {
  return {type: FETCH_RELATIONSHIPS_COMPLETE, payload: {error}, error: true}
}

export function fetchRelationships(id) {
  return {type: FETCH_RELATIONSHIPS, payload: {id}}
}
