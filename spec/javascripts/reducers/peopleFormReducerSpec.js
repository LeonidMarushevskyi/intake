import * as matchers from 'jasmine-immutable-matchers'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'
import peopleFormReducer from 'reducers/peopleFormReducer'
import {Map, fromJS} from 'immutable'

describe('peopleFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on fetch screening success', () => {
    it('populates the people form', () => {
      const action = fetchScreeningSuccess({
        participants: [{
          id: 'participant_one',
          roles: ['a', 'b'],
          legacy_descriptor: 'legacy descriptor one',
          first_name: 'first name one',
        }, {
          id: 'participant_two',
          roles: ['c'],
          legacy_descriptor: 'legacy descriptor two',
          first_name: 'first name two',
        }],
      })
      expect(peopleFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          participant_one: {
            roles: {value: ['a', 'b']},
            legacy_descriptor: {value: 'legacy descriptor one'},
            first_name: {value: 'first name one'},
          },
          participant_two: {
            roles: {value: ['c']},
            legacy_descriptor: {value: 'legacy descriptor two'},
            first_name: {value: 'first name two'},
          },
        })
      )
    })
  })
  describe('on fetch screening failure', () => {
    it('returns the last state', () => {
      const lastState = fromJS({
        participant_one: {
          roles: {value: ['a', 'b']},
          legacy_descriptor: {value: 'legacy descriptor one'},
        },
        participant_two: {
          roles: {value: ['c']},
          legacy_descriptor: {value: 'legacy descriptor two'},
        },
      })
      const action = fetchScreeningFailure()
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          participant_one: {
            roles: {value: ['a', 'b']},
            legacy_descriptor: {value: 'legacy descriptor one'},
          },
          participant_two: {
            roles: {value: ['c']},
            legacy_descriptor: {value: 'legacy descriptor two'},
          },
        })
      )
    })
  })
})
