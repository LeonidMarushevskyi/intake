export function participantFlag(participant) {
  if (participant.sealed === true) { return 'Sealed' }
  if (participant.sensitive === true) { return 'Sensitive' }
  return undefined
}

export function accessDescription(accessCode) {
  if (accessCode === 'R') { return 'Sealed' }
  if (accessCode === 'S') { return 'Sensitive' }
  if (accessCode === 'SEALED') { return 'Sealed' }
  if (accessCode === 'SENSITIVE') { return 'Sensitive' }
  return undefined
}
