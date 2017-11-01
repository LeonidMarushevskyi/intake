export const HTTP_COMPLETE = 'HTTP_COMPLETE'

export function httpError(response) {
  return {type: HTTP_COMPLETE, payload: response, error: true}
}

export function httpSuccess(response) {
  return {type: HTTP_COMPLETE, payload: response}
}
