import Immutable from 'immutable'

export function addNewAllegations(screeningId, participants) {
  const flattenDepth = 1
  const victims = participants.filter((participant) => participant.get('roles').includes('Victim'))
  const perpetrators = participants.filter((participant) => participant.get('roles').includes('Perpetrator'))
  return victims.map((victim) => (
    perpetrators.map((perpetrator) => {
      if (victim.get('id') !== perpetrator.get('id')) {
        return Immutable.Map({
          id: null,
          perpetrator,
          perpetrator_id: perpetrator.get('id'),
          screening_id: screeningId,
          victim,
          victim_id: victim.get('id'),
        })
      }
      return null
    })
  )).flatten(flattenDepth).filterNot((allegation) => allegation === null)
}
