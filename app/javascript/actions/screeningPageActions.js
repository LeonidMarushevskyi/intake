export const SET_SCREENING_PAGE_MODE = 'SET_SCREENING_PAGE_MODE'
export const SET_PERSON_CARD_MODE = 'SET_PERSON_CARD_MODE'
export function setPageMode(mode) {
  return {type: SET_SCREENING_PAGE_MODE, payload: {mode}}
}
export function setPersonCardMode(personId, mode) {
  return {type: SET_PERSON_CARD_MODE, payload: {personId, mode}}
}
