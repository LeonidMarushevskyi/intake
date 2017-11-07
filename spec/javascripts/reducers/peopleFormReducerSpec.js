import * as matchers from 'jasmine-immutable-matchers'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'
import peopleFormReducer from 'reducers/peopleFormReducer'
import {Map, fromJS} from 'immutable'

describe('peopleFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on fetch screening success', () => {
    it('populates the people form', () => {
      const action = fetchScreeningSuccess({
        participants: [
          {id: 'participant_one', roles: ['a', 'b']},
          {id: 'participant_two', roles: ['c']},
        ],
      })
      expect(peopleFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          participant_one: {roles: {value: ['a', 'b']}},
          participant_two: {roles: {value: ['c']}},
        })
      )
    })
  })
  describe('on fetch screening failure', () => {
    it('returns the last state', () => {
      const lastState = fromJS({
        participant_one: {roles: {value: ['a', 'b']}},
        participant_two: {roles: {value: ['c']}},
      })
      const action = fetchScreeningFailure()
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          participant_one: {roles: {value: ['a', 'b']}},
          participant_two: {roles: {value: ['c']}},
        })
      )
    })
  })
})
