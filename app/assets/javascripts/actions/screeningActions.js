import * as Utils from 'utils/http'

export function save(id, screening) {
  const url = `/screenings/${id}.json`
  return Utils.request('PUT', url, JSON.stringify({screening: screening}), {contentType: 'application/json'})
}

export function fetch(id) {
  return Utils.request('GET', `/screenings/${id}.json`, null, {contentType: 'application/json'})
}

export function create() {
  return Utils.request('POST', '/screenings.json')
}
