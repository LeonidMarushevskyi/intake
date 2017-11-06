export const RESET_ALLEGATIONS_FORM = 'RESET_ALLEGATIONS_FORM'
export const SET_ALLEGATION_TYPES = 'SET_ALLEGATION_TYPES'
export function resetAllegations({allegations}) {
  return {type: RESET_ALLEGATIONS_FORM, payload: {allegations}}
}
export function setAllegationTypes({victimId, perpetratorId, allegationTypes}) {
  return {type: SET_ALLEGATION_TYPES, payload: {victimId, perpetratorId, allegationTypes}}
}
