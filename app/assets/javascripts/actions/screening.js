import * as Utils from 'utils/http'

export function save(id, screening) {
  const url = `/screenings/${id}.json`
  return Utils.request('PUT', url, {screening: screening})
}

export function fetch(id) {
  return Utils.request('GET', `/screenings/${id}.json`)
}
