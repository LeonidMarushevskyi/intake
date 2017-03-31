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

export function addNewAllegations(screeningId, participants, allegations) {
  const flattenDepth = 1
  const victims = findParticipantsByRole(participants, 'Victim')
  const perpetrators = findParticipantsByRole(participants, 'Perpetrator')

  return victims.map((victim) => (
    perpetrators.map((perpetrator) => {
      const victimId = victim.get('id')
      const perpetratorId = perpetrator.get('id')

      if (victimId === perpetratorId) {
        return null
      } else {
        const persistedAllegation = findAllegation(allegations, victimId, perpetratorId)
        const allegationId = persistedAllegation ? persistedAllegation.get('id') : null

        return Immutable.Map({
          id: allegationId,
          perpetrator,
          perpetrator_id: perpetratorId,
          screening_id: screeningId,
          victim,
          victim_id: victimId,
        })
      }
    })
  )).flatten(flattenDepth).filterNot((allegation) => allegation === null)
}
