import {HTTP_FAILURE} from 'actions/actionTypes'

export function httpError(responseJSON) {
  return {type: HTTP_FAILURE, payload: responseJSON}
}
