export function participantFlag(participant) {
  if (participant.sealed === true) { return 'Sealed' }
  if (participant.sensitive === true) { return 'Sensitive' }
  return undefined
}

export function accessDescription(accessCode) {
  let description = undefined
  if (accessCode === 'R') { description = 'Sealed' }
  if (accessCode === 'S') { description = 'Sensitive' }
  if (accessCode === 'SEALED') { description = 'Sealed' }
  if (accessCode === 'SENSITIVE') { description = 'Sensitive' }
  return description
}
