import * as matchers from 'jasmine-immutable-matchers'
import {
  createScreeningSuccess,
  fetchScreeningSuccess,
  updateScreeningSuccess,
  createParticipantSuccess,
  deleteParticipantSuccess,
  updateParticipantSuccess,
} from 'actions/screeningActions'
import participantsReducer from 'reducers/participantsReducer'
import {List, fromJS} from 'immutable'

describe('participantsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns the participants from the action', () => {
      const screening = fromJS({participants: []})
      const action = createScreeningSuccess(screening.toJS())
      expect(participantsReducer(List(), action).isEmpty()).toEqual(true)
    })
  })

  describe('on FETCH_SCREENING_SUCCESS', () => {
    it('returns the participants from the action', () => {
      const screening = fromJS({participants: [{id: '2'}]})
      const participants = screening.get('participants')
      const action = fetchScreeningSuccess(screening.toJS())
      expect(participantsReducer(List(), action)).toEqualImmutable(participants)
    })
  })

  describe('on UPDATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = fromJS({participants: [{id: '2'}]})
      const participants = screening.get('participants')
      const action = updateScreeningSuccess(screening.toJS())
      expect(participantsReducer(List(), action)).toEqualImmutable(participants)
    })
  })

  describe('on CREATE_PARTICIPANT_SUCCESS', () => {
    const newParticipant = fromJS({id: '2'})
    let action
    beforeEach(() => (action = createParticipantSuccess(newParticipant.toJS())))

    it('returns the screening with new participant from the action', () => {
      const newParticipants = fromJS([newParticipant])
      expect(participantsReducer(List(), action)).toEqualImmutable(newParticipants)
    })

    it('adds new participants to the beginning of the list', () => {
      const oldParticipant = {id: '3'}
      const oldState = fromJS([oldParticipant])
      const newParticipants = fromJS([newParticipant, oldParticipant])
      expect(participantsReducer(oldState, action)).toEqualImmutable(newParticipants)
    })
  })

  describe('on UPDATE_PARTICIPANT_SUCCESS', () => {
    it('returns the screening with updated participants from the action', () => {
      const newParticipant = {id: '1', first_name: 'John'}
      const oldParticipant = {id: '1'}
      const oldState = fromJS([oldParticipant])
      const newParticipants = fromJS([newParticipant])
      const action = updateParticipantSuccess(newParticipant)
      expect(participantsReducer(oldState, action)).toEqualImmutable(newParticipants)
    })
  })

  describe('on DELETE_PARTICIPANT_SUCCESS', () => {
    it('returns the screening without the deleted participant from the action', () => {
      const firstParticipant = {id: '2'}
      const secondParticipant = {id: '3'}
      const oldState = fromJS([firstParticipant, secondParticipant])
      const action = deleteParticipantSuccess(secondParticipant.id)
      const newParticipants = fromJS([firstParticipant])
      expect(participantsReducer(oldState, action)).toEqualImmutable(newParticipants)
    })
  })
})
