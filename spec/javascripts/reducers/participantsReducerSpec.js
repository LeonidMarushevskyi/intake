import * as matchers from 'jasmine-immutable-matchers'
import {
  createScreeningSuccess,
  createScreeningFailure,
  fetchScreeningSuccess,
  fetchScreeningFailure,
  updateScreeningSuccess,
  createParticipantSuccess,
  createParticipantFailure,
  deleteParticipantSuccess,
  deleteParticipantFailure,
  updateParticipantSuccess,
  updateParticipantFailure,
} from 'actions/screeningActions'
import participantsReducer from 'reducers/participantsReducer'
import {List, fromJS} from 'immutable'

describe('participantsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on CREATE_SCREENING_COMPLETE', () => {
    it('returns the participants from the action on success', () => {
      const screening = fromJS({participants: []})
      const action = createScreeningSuccess(screening.toJS())
      expect(participantsReducer(List(), action).isEmpty()).toEqual(true)
    })
    it('returns the last state on failure', () => {
      const action = createScreeningFailure()
      expect(participantsReducer(List(), action)).toEqual(List())
    })
  })

  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('returns the participants from the action on success', () => {
      const screening = fromJS({participants: [{id: '2'}]})
      const participants = screening.get('participants')
      const action = fetchScreeningSuccess(screening.toJS())
      expect(participantsReducer(List(), action)).toEqualImmutable(participants)
    })
    it('returns the last state on failure', () => {
      const action = fetchScreeningFailure()
      expect(participantsReducer(List(), action)).toEqual(List())
    })
  })

  describe('on UPDATE_SCREENING_COMPLETE', () => {
    it('returns the screening from the action on success', () => {
      const screening = fromJS({participants: [{id: '2'}]})
      const participants = screening.get('participants')
      const action = updateScreeningSuccess(screening.toJS())
      expect(participantsReducer(List(), action)).toEqualImmutable(participants)
    })
  })

  describe('on CREATE_PARTICIPANT_COMPLETE', () => {
    it('returns the screening with new participant from the action on success', () => {
      const newParticipant = fromJS({id: '2'})
      const action = createParticipantSuccess(newParticipant.toJS())
      const newParticipants = fromJS([newParticipant])
      expect(participantsReducer(List(), action)).toEqualImmutable(newParticipants)
    })

    it('adds new participants to the beginning of the list', () => {
      const newParticipant = fromJS({id: '2'})
      const action = createParticipantSuccess(newParticipant.toJS())
      const oldParticipant = {id: '3'}
      const oldState = fromJS([oldParticipant])
      const newParticipants = fromJS([newParticipant, oldParticipant])
      expect(participantsReducer(oldState, action)).toEqualImmutable(newParticipants)
    })
    it('returns the last state on failure', () => {
      const action = createParticipantFailure()
      expect(participantsReducer(List(), action)).toEqual(List())
    })
  })

  describe('on UPDATE_PARTICIPANT_COMPLETE', () => {
    it('returns the screening with updated participants from the action on success', () => {
      const newParticipant = {id: '1', first_name: 'John'}
      const oldParticipant = {id: '1'}
      const oldState = fromJS([oldParticipant])
      const newParticipants = fromJS([newParticipant])
      const action = updateParticipantSuccess(newParticipant)
      expect(participantsReducer(oldState, action)).toEqualImmutable(newParticipants)
    })
    it('returns the last state on failure', () => {
      const action = updateParticipantFailure()
      expect(participantsReducer(List(), action)).toEqual(List())
    })
  })

  describe('on DELETE_PARTICIPANT_COMPLETE', () => {
    it('returns the screening without the deleted participant from the action on success', () => {
      const firstParticipant = {id: '2'}
      const secondParticipant = {id: '3'}
      const oldState = fromJS([firstParticipant, secondParticipant])
      const action = deleteParticipantSuccess(secondParticipant.id)
      const newParticipants = fromJS([firstParticipant])
      expect(participantsReducer(oldState, action)).toEqualImmutable(newParticipants)
    })
    it('returns the last state on failure', () => {
      const action = deleteParticipantFailure()
      expect(participantsReducer(List(), action)).toEqual(List())
    })
  })
})
