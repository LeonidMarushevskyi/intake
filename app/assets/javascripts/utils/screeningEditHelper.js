/* eslint-disable no-invalid-this */
import Immutable from 'immutable'
import {addNewAllegations} from 'utils/allegationsHelper'

export function setField(fieldSeq, value, callback) {
  const screeningEdits = this.state.screeningEdits.setIn(fieldSeq, value)
  this.setState({screeningEdits: screeningEdits}, callback)
}

export function cardSave(fieldList) {
  let screening
  if (fieldList.includes('allegations')) {
    const allegations = addNewAllegations(
      this.props.screening.get('id'),
      this.props.participants,
      this.props.screening.get('allegations'),
      this.state.screeningEdits.get('allegations')
    ).filterNot((allegation) => allegation.get('allegation_types').isEmpty())

    screening = this.state.screening.set('allegations', allegations)
  } else {
    const changes = this.state.screeningEdits.filter((value, key) =>
      fieldList.includes(key) && value !== undefined
    )
    screening = this.mergeScreeningWithEdits(changes)
  }
  return this.props.actions.saveScreening(screening.toJS())
}

export function createParticipant(person) {
  const {params} = this.props
  const participant = Object.assign({}, person, {screening_id: params.id, person_id: person.id, id: null})
  this.props.actions.createParticipant(participant)
}

export function cancelEdit(fieldList) {
  const updatedEdits = this.state.screeningEdits.filterNot((value, key) => fieldList.includes(key))
  this.setState({screeningEdits: updatedEdits})
}

export function cancelParticipantEdit(id) {
  const updatedParticipantsEdits = this.state.participantsEdits.delete(id)
  this.setState({participantsEdits: updatedParticipantsEdits})
}

export function deleteParticipant(id) {
  this.props.actions.deleteParticipant(id)
}

export function setParticipantField(id, value) {
  const participantsEdits = this.state.participantsEdits.set(id, value)
  this.setState({participantsEdits: participantsEdits})
}

export function saveParticipant(participant) {
  return this.props.actions.saveParticipant(participant.toJS())
    .then(() => {
      this.props.actions.fetchScreening(this.props.params.id)
    })
}

export function mergeScreeningWithEdits(changes) {
  // Lists require to be reassigned the edits instead of appending.
  const lists = changes.filter((val) => val.constructor.name === 'List')
  const nonlists = changes.filterNot((val) => val.constructor.name === 'List')
  let screening = this.state.screening
  lists.map((v, k) => {
    screening = screening.set(k, v)
  })
  return screening.mergeDeep(nonlists)
}

export function participants() {
  // We want to merge the keys of each participant, but we don't want deep merge
  // to combine the address lists for us. So, we do a custom merge at one level deep.
  const mergedParticipants = this.props.participants.map((participant) => {
    const participantId = participant.get('id')
    const relevantEdits = this.state.participantsEdits.get(participantId)
    const participantEdits = (relevantEdits || Immutable.Map())
    return participant.merge(participantEdits)
  })

  return mergedParticipants
}
