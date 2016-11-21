import * as Utils from 'utils/http'

export function create(screeningId, participant) {
  return Utils.request('POST', `/screenings/${screeningId}/participants.json`, {participant: participant})
}
