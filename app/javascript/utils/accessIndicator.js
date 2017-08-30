export function participantFlag(participant) {
  if (participant.sealed === true) { return 'Sealed' }
  if (participant.sensitive === true) { return 'Sensitive' }
  return undefined
}
