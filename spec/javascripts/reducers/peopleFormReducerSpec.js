import * as matchers from 'jasmine-immutable-matchers'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'
import {setField} from 'actions/peopleFormActions'
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
          middle_name: 'middle name one',
          last_name: 'last name one',
          name_suffix: 'name suffix one',
          ssn: 'ssn one',
        }, {
          id: 'participant_two',
          roles: ['c'],
          legacy_descriptor: 'legacy descriptor two',
          first_name: 'first name two',
          middle_name: 'middle name two',
          last_name: 'last name two',
          name_suffix: 'name suffix two',
          ssn: 'ssn two',
        }],
      })
      expect(peopleFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          participant_one: {
            roles: {value: ['a', 'b']},
            legacy_descriptor: {value: 'legacy descriptor one'},
            first_name: {value: 'first name one'},
            middle_name: {value: 'middle name one'},
            last_name: {value: 'last name one'},
            name_suffix: {value: 'name suffix one'},
            ssn: {value: 'ssn one'},
          },
          participant_two: {
            roles: {value: ['c']},
            legacy_descriptor: {value: 'legacy descriptor two'},
            first_name: {value: 'first name two'},
            middle_name: {value: 'middle name two'},
            last_name: {value: 'last name two'},
            name_suffix: {value: 'name suffix two'},
            ssn: {value: 'ssn two'},
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
  describe('on set person form field', () => {
    it('returns the updated form state', () => {
      const lastState = fromJS({
        participant_one: {
          roles: {value: []},
        },
        participant_two: {
          roles: {value: ['c']},
        },
      })
      const action = setField('participant_one', ['roles'], ['a', 'b'])
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          participant_one: {
            roles: {value: ['a', 'b']},
          },
          participant_two: {
            roles: {value: ['c']},
          },
        })
      )
    })
  })
})
