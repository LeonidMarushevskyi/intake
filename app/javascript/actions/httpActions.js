export const HTTP_COMPLETE = 'HTTP_COMPLETE'
export function httpError(url, response) {
  return {type: HTTP_COMPLETE, payload: {url, response}, error: true}
}
export function httpSuccess(url, response) {
  return {type: HTTP_COMPLETE, payload: {url, response}}
}
