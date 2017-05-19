import * as screeningActions from 'actions/screeningActions'
import participantsReducer from 'reducers/participantsReducer'
import Immutable from 'immutable'

describe('participantsReducer', () => {
  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns the participants from the action', () => {
      const screening = {id: '1', name: 'mock_screening', participants: []}
      const action = screeningActions.createScreeningSuccess(screening)
      expect(participantsReducer(Immutable.Map(), action).toJS()).toEqual([])
    })
  })

  describe('on FETCH_SCREENING_SUCCESS', () => {
    it('returns the participants from the action', () => {
      const participant = {id: '2'}
      const screening = {id: '1', name: 'mock_screening', participants: [participant]}
      const action = screeningActions.fetchScreeningSuccess(screening)
      expect(participantsReducer(Immutable.Map(), action).toJS()).toEqual([participant])
    })
  })

  describe('on UPDATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const participant = {id: '2'}
      const screening = {id: '1', name: 'mock_screening', participants: [participant]}
      const action = screeningActions.updateScreeningSuccess(screening)
      expect(participantsReducer(Immutable.Map(), action).toJS()).toEqual([participant])
    })
  })

  describe('on CREATE_PARTICIPANT_SUCCESS', () => {
    it('returns the screening with new participant from the action', () => {
      const newParticipant = {id: '2', screening_id: '1', legacy_id: '3'}
      const oldParticipant = {id: '3', screening_id: '1', legacy_id: '4'}
      const participants = Immutable.fromJS([oldParticipant])
      const action = screeningActions.createParticipantSuccess(newParticipant)
      expect(participantsReducer(participants, action).toJS()).toEqual([
        oldParticipant,
        newParticipant,
      ])
    })
  })

  describe('on UPDATE_PARTICIPANT_SUCCESS', () => {
    it('returns the screening with updated participants from the action', () => {
      const oldParticipant = {id: '2', screening_id: '3', legacy_id: '10', ssn: '12345'}
      const newParticipant = {id: '2', screening_id: '3', legacy_id: '10', ssn: '78456'}
      const participants = Immutable.fromJS([oldParticipant])
      const action = screeningActions.updateParticipantSuccess(newParticipant)
      expect(participantsReducer(participants, action).toJS()).toEqual([newParticipant])
    })
  })

  describe('on DELETE_PARTICIPANT_SUCCESS', () => {
    it('returns the screening without the deleted participant from the action', () => {
      const firstParticipant = {id: '2', screening_id: '1', person_id: '3'}
      const secondParticipant = {id: '3', screening_id: '1', person_id: '4'}
      const participants = Immutable.fromJS([firstParticipant, secondParticipant])
      const action = screeningActions.deleteParticipantSuccess(secondParticipant.id)
      expect(participantsReducer(participants, action).toJS()).toEqual([
        firstParticipant,
      ])
    })
  })
})
