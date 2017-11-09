import * as matchers from 'jasmine-immutable-matchers'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'
import {createPersonSuccess, createPersonFailure} from 'actions/personCardActions'
import {setField, addPhone, deletePhone} from 'actions/peopleFormActions'
import peopleFormReducer from 'reducers/peopleFormReducer'
import {Map, fromJS} from 'immutable'

describe('peopleFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on fetch screening', () => {
    it('populates the people form on success', () => {
      const action = fetchScreeningSuccess({
        participants: [{
          id: 'participant_one',
          roles: ['a', 'b'],
          legacy_descriptor: 'legacy descriptor one',
          first_name: 'first name one',
          middle_name: 'middle name one',
          last_name: 'last name one',
          name_suffix: 'name suffix one',
          phone_numbers: [],
          ssn: 'ssn one',
        }, {
          id: 'participant_two',
          roles: ['c'],
          legacy_descriptor: 'legacy descriptor two',
          first_name: 'first name two',
          middle_name: 'middle name two',
          last_name: 'last name two',
          name_suffix: 'name suffix two',
          phone_numbers: [{number: '1234567890', type: 'Home'}],
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
            phone_numbers: [],
            ssn: {value: 'ssn one'},
          },
          participant_two: {
            roles: {value: ['c']},
            legacy_descriptor: {value: 'legacy descriptor two'},
            first_name: {value: 'first name two'},
            middle_name: {value: 'middle name two'},
            last_name: {value: 'last name two'},
            name_suffix: {value: 'name suffix two'},
            phone_numbers: [{
              number: {value: '1234567890'},
              type: {value: 'Home'},
            }],
            ssn: {value: 'ssn two'},
          },
        })
      )
    })
    it('returns the last state on failure', () => {
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

  describe('on addPhone', () => {
    it('adds a new empty phone item for the given person id', () => {
      const lastState = fromJS({
        person_one: {phone_numbers: []},
        person_two: {phone_numbers: []},
      })
      const action = addPhone('person_one')
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          person_one: {phone_numbers: [{number: {value: null}, type: {value: null}}]},
          person_two: {phone_numbers: []},
        })
      )
    })
  })

  describe('on deletePhone', () => {
    it('deletes the phone item for the given person id and index', () => {
      const lastState = fromJS({
        person_one: {phone_numbers: [{number: {value: '1234567890'}, type: {value: 'Home'}}]},
        person_two: {phone_numbers: [{number: {value: '0987654321'}, type: {value: 'Cell'}}]},
      })
      const action = deletePhone('person_one', 0)
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          person_one: {phone_numbers: []},
          person_two: {phone_numbers: [{number: {value: '0987654321'}, type: {value: 'Cell'}}]},
        })
      )
    })
  })
  describe('on CREATE_PERSON_COMPLETE', () => {
    const lastState = fromJS({
      participant_one: {
        roles: {value: ['a', 'b']},
        legacy_descriptor: {value: 'legacy descriptor one'},
        first_name: {value: 'first name one'},
        middle_name: {value: 'middle name one'},
        last_name: {value: 'last name one'},
        name_suffix: {value: 'name suffix one'},
        ssn: {value: 'ssn one'},
        phone_numbers: [],
      },
    })
    it('returns people form with the added person on success', () => {
      const newPerson = {
        id: 'participant_two',
        roles: ['c'],
        legacy_descriptor: 'legacy descriptor two',
        first_name: 'first name two',
        middle_name: 'middle name two',
        last_name: 'last name two',
        name_suffix: 'name suffix two',
        ssn: 'ssn two',
        phone_numbers: [{number: '1234567890', type: 'Home'}],
      }
      const action = createPersonSuccess(newPerson)
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(fromJS({
        participant_one: {
          roles: {value: ['a', 'b']},
          legacy_descriptor: {value: 'legacy descriptor one'},
          first_name: {value: 'first name one'},
          middle_name: {value: 'middle name one'},
          last_name: {value: 'last name one'},
          name_suffix: {value: 'name suffix one'},
          ssn: {value: 'ssn one'},
          phone_numbers: [],
        },
        participant_two: {
          roles: {value: ['c']},
          legacy_descriptor: {value: 'legacy descriptor two'},
          first_name: {value: 'first name two'},
          middle_name: {value: 'middle name two'},
          last_name: {value: 'last name two'},
          name_suffix: {value: 'name suffix two'},
          ssn: {value: 'ssn two'},
          phone_numbers: [{
            number: {value: '1234567890'},
            type: {value: 'Home'},
          }],
        },
      }))
    })
    it('returns the last person form state on failure', () => {
      const action = createPersonFailure()
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(lastState)
    })
  })
})
