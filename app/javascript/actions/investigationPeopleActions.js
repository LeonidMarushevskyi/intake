export const FETCH_INVESTIGATION_PEOPLE = 'FETCH_INVESTIGATION_PEOPLE'
export const FETCH_INVESTIGATION_PEOPLE_SUCCESS = 'FETCH_INVESTIGATION_PEOPLE_SUCCESS'
export const FETCH_INVESTIGATION_PEOPLE_FAILURE = 'FETCH_INVESTIGATION_PEOPLE_FAILURE'

export function fetchSuccess(people) {
  return {type: FETCH_INVESTIGATION_PEOPLE_SUCCESS, people}
}

export function fetchFailure(error) {
  return {type: FETCH_INVESTIGATION_PEOPLE_FAILURE, error}
}

export function fetch({investigationId}) {
  return {type: FETCH_INVESTIGATION_PEOPLE, investigationId}
}

