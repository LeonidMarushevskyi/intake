import Immutable from 'immutable'

function findAllegation(allegations, victimId, perpetratorId) {
  return allegations.find((allegation) => (
    allegation.get('victim_id') === victimId &&
      allegation.get('perpetrator_id') === perpetratorId
  ))
}

function findParticipantsByRole(participants, role) {
  return participants.filter((participant) => participant.get('roles').includes(role))
}

export function addNewAllegations(screeningId, participants, allegations, allegationsEdits) {
  const flattenDepth = 1
  const victims = findParticipantsByRole(participants, 'Victim')
  const perpetrators = findParticipantsByRole(participants, 'Perpetrator')

  return victims.map((victim) => {
    const victimId = victim.get('id')

    let victimAllegationsEdits
    if (allegationsEdits) {
     victimAllegationsEdits = allegationsEdits.get(victimId)
    }

    return perpetrators.map((perpetrator) => {
      const perpetratorId = perpetrator.get('id')

      let victimPerpetratorAllegationsEdits
      if (victimAllegationsEdits) {
        victimPerpetratorAllegationsEdits = victimAllegationsEdits.get(perpetratorId)
      }

      if (victimId === perpetratorId) {
        return null
      } else {
        const persistedAllegation = findAllegation(allegations, victimId, perpetratorId)
        const allegationId = persistedAllegation ? persistedAllegation.get('id') : null

        return Immutable.fromJS({
          id: allegationId,
          perpetrator,
          perpetrator_id: perpetratorId,
          screening_id: screeningId,
          victim,
          victim_id: victimId,
          allegation_types: (victimPerpetratorAllegationsEdits || Immutable.List()),
        })
      }
    })
  }).flatten(flattenDepth).filterNot((allegation) => allegation === null)}
