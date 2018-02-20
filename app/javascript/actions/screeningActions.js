import {
  CREATE_SCREENING,
  CREATE_SCREENING_COMPLETE,
  FETCH_SCREENING,
  FETCH_SCREENING_COMPLETE,
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
export function submitScreeningSuccess(screening) {
  return {type: SUBMIT_SCREENING_COMPLETE, payload: {screening}}
}
export function submitScreeningFailure(error) {
  return {type: SUBMIT_SCREENING_COMPLETE, payload: {error}, error: true}
}
export function submitScreening(id) {
  return {type: SUBMIT_SCREENING, payload: {id}}
}
