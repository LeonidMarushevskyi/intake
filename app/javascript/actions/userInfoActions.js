export const FETCH_USER_INFO = 'FETCH_USER_INFO'
export const FETCH_USER_INFO_COMPLETE = 'FETCH_USER_INFO_COMPLETE'

export function fetch() {
  return {type: FETCH_USER_INFO}
}

export function fetchSuccess(userInfo) {
  return {
    type: FETCH_USER_INFO_COMPLETE,
    payload: {userInfo},
  }
}

export function fetchFailure(error) {
  return {
    type: FETCH_USER_INFO_COMPLETE,
    payload: {error},
    error: true,
  }
}
