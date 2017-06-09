import Immutable from 'immutable'
import _ from 'lodash'

function findAllegation(allegations, victimId, perpetratorId) {
  return allegations.find((allegation) => (
    allegation.get('victim_id') === victimId &&
      allegation.get('perpetrator_id') === perpetratorId
  ))
}

function findParticipantsByRole(participants, role) {
  return participants.filter((participant) => (participant.get('roles')).includes(role))
}

function buildAllegations(screeningId, participants, allegations, allegationsEdits) {
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
        const allegationTypes = persistedAllegation ? persistedAllegation.get('allegation_types') : null

        return Immutable.fromJS({
          id: allegationId,
          perpetrator,
          perpetrator_id: perpetratorId,
          screening_id: screeningId,
          victim,
          victim_id: victimId,
          allegation_types: (victimPerpetratorAllegationsEdits || allegationTypes || Immutable.List()),
        })
      }
    })
  }).flatten(flattenDepth).filterNot((allegation) => allegation === null)
}

export function sortedAllegationsList(screeningId, participants, allegations, allegationsEdits) {
  const unsortedAllegations = buildAllegations(screeningId, participants, allegations, allegationsEdits).toJS()

  const sortFields = [
    (allegation) => (allegation.victim.date_of_birth || ''),
    'victim.last_name',
    'victim.first_name',
    (allegation) => (allegation.perpetrator.date_of_birth || ''),
    'perpetrator.last_name',
    'perpetrator.first_name',
  ]

  const sortOrder = [
    'desc',
    'asc',
    'asc',
    'desc',
    'asc',
    'asc',
  ]

  const sortedAllegations = _.orderBy(unsortedAllegations, sortFields, sortOrder)
  return Immutable.fromJS(sortedAllegations)
}

export function removeInvalidAllegations(participant, allegations) {
  // allegations are stored in memory as {victim_id: {perp_id: [allegation_types]}}
  const id = participant.get('id')
  const roles = participant.get('roles') || Immutable.List()
  let filteredAllegations = allegations || Immutable.Map()

  if (!roles.includes('Victim')) {
    filteredAllegations = filteredAllegations.delete(id)
  }

  if (!roles.includes('Perpetrator')) {
    filteredAllegations = filteredAllegations.map((allegation) => allegation.delete(id))
  }

  return filteredAllegations
}
