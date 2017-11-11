import * as matchers from 'jasmine-immutable-matchers'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'
import {createPersonSuccess, createPersonFailure} from 'actions/personCardActions'
import {
  setField,
  addAddress,
  deleteAddress,
  addPhone,
  deletePhone,
} from 'actions/peopleFormActions'
import peopleFormReducer from 'reducers/peopleFormReducer'
import {Map, fromJS} from 'immutable'

describe('peopleFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on fetch screening', () => {
    it('populates the people form on success', () => {
      const action = fetchScreeningSuccess({
        participants: [{
          id: 'participant_one',
          addresses: [],
          approximate_age: '2',
          approximate_age_units: 'days',
          date_of_birth: '2/2/2222',
          gender: 'male',
          languages: ['English'],
          roles: ['a', 'b'],
          legacy_descriptor: 'legacy descriptor one',
          first_name: 'first name one',
          middle_name: 'middle name one',
          last_name: 'last name one',
          name_suffix: 'name suffix one',
          phone_numbers: [],
          ssn: 'ssn one',
          races: [
            {race: 'race_1', race_detail: 'race_detail_1'},
            {race: 'race_2', race_detail: 'race_detail_2'},
          ],
          ethnicity: {
            ethnicity_detail: ['Mexican'],
            hispanic_latino_origin: 'Yes',
          },
        }, {
          id: 'participant_two',
          addresses: [{
            street_address: '1234 Some Lane',
            city: 'Somewhere',
            state: 'CA',
            zip: '55555',
            type: 'Home',
          }],
          roles: ['c'],
          legacy_descriptor: 'legacy descriptor two',
          approximate_age: '3',
          approximate_age_units: 'months',
          date_of_birth: '3/3/3333',
          gender: '',
          languages: [],
          first_name: 'first name two',
          middle_name: 'middle name two',
          last_name: 'last name two',
          name_suffix: 'name suffix two',
          phone_numbers: [{number: '1234567890', type: 'Home'}],
          ssn: 'ssn two',
          races: [],
          ethnicity: {
            ethnicity_detail: [],
            hispanic_latino_origin: null,
          },
        }],
      })
      expect(peopleFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          participant_one: {
            roles: {value: ['a', 'b']},
            addresses: [],
            approximate_age: {value: '2'},
            approximate_age_units: {value: 'days'},
            date_of_birth: {value: '2/2/2222'},
            gender: {value: 'male'},
            languages: {value: ['English']},
            legacy_descriptor: {value: 'legacy descriptor one'},
            first_name: {value: 'first name one'},
            middle_name: {value: 'middle name one'},
            last_name: {value: 'last name one'},
            name_suffix: {value: 'name suffix one'},
            phone_numbers: [],
            ssn: {value: 'ssn one'},
            races: {
              race_1: {value: true},
              race_2: {value: true},
            },
            raceDetails: {
              race_1: {value: 'race_detail_1'},
              race_2: {value: 'race_detail_2'},
            },
            ethnicity: {
              ethnicity_detail: {value: ['Mexican']},
              hispanic_latino_origin: {value: 'Yes'},
            },
          },
          participant_two: {
            roles: {value: ['c']},
            addresses: [{
              street: {value: '1234 Some Lane'},
              city: {value: 'Somewhere'},
              state: {value: 'CA'},
              zip: {value: '55555'},
              type: {value: 'Home'},
            }],
            approximate_age: {value: '3'},
            approximate_age_units: {value: 'months'},
            date_of_birth: {value: '3/3/3333'},
            gender: {value: ''},
            languages: {value: []},
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
            races: {},
            raceDetails: {},
            ethnicity: {
              ethnicity_detail: {value: []},
              hispanic_latino_origin: {value: null},
            },
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
        approximate_age: {value: '2'},
        approximate_age_units: {value: 'days'},
        date_of_birth: {value: '2/2/2222'},
        gender: {value: 'male'},
        languages: {value: ['English']},
        roles: {value: ['a', 'b']},
        legacy_descriptor: {value: 'legacy descriptor one'},
        first_name: {value: 'first name one'},
        middle_name: {value: 'middle name one'},
        last_name: {value: 'last name one'},
        name_suffix: {value: 'name suffix one'},
        ssn: {value: 'ssn one'},
        phone_numbers: [],
        addresses: [],
        races: {},
        raceDetails: {},
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: ['Mexican'],
        },
      },
    })
    it('returns people form with the added person on success', () => {
      const newPerson = {
        approximate_age: '3',
        approximate_age_units: 'months',
        date_of_birth: '3/3/3333',
        gender: '',
        languages: [],
        id: 'participant_two',
        roles: ['c'],
        legacy_descriptor: 'legacy descriptor two',
        first_name: 'first name two',
        middle_name: 'middle name two',
        last_name: 'last name two',
        name_suffix: 'name suffix two',
        ssn: 'ssn two',
        phone_numbers: [{number: '1234567890', type: 'Home'}],
        addresses: [{
          street_address: '1234 Some Lane',
          city: 'Somewhere',
          state: 'CA',
          zip: '55555',
          type: 'Home',
        }],
        races: [],
        ethnicity: {
          hispanic_latino_origin: null,
          ethnicity_detail: [],
        },
      }
      const action = createPersonSuccess(newPerson)
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(fromJS({
        participant_one: {
          approximate_age: {value: '2'},
          approximate_age_units: {value: 'days'},
          date_of_birth: {value: '2/2/2222'},
          gender: {value: 'male'},
          languages: {value: ['English']},
          roles: {value: ['a', 'b']},
          legacy_descriptor: {value: 'legacy descriptor one'},
          first_name: {value: 'first name one'},
          middle_name: {value: 'middle name one'},
          last_name: {value: 'last name one'},
          name_suffix: {value: 'name suffix one'},
          ssn: {value: 'ssn one'},
          phone_numbers: [],
          addresses: [],
          races: {},
          raceDetails: {},
          ethnicity: {
            hispanic_latino_origin: 'Yes',
            ethnicity_detail: ['Mexican'],
          },
        },
        participant_two: {
          approximate_age: {value: '3'},
          approximate_age_units: {value: 'months'},
          date_of_birth: {value: '3/3/3333'},
          gender: {value: ''},
          languages: {value: []},
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
          addresses: [{
            street: {value: '1234 Some Lane'},
            city: {value: 'Somewhere'},
            state: {value: 'CA'},
            zip: {value: '55555'},
            type: {value: 'Home'},
          }],
          races: {},
          raceDetails: {},
          ethnicity: {
            hispanic_latino_origin: {value: null},
            ethnicity_detail: {value: []},
          },
        },
      }))
    })
    it('returns the last person form state on failure', () => {
      const action = createPersonFailure()
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(lastState)
    })
  })

  describe('on addAddress', () => {
    it('adds a new empty address item for the given person id', () => {
      const lastState = fromJS({
        person_one: {addresses: []},
        person_two: {addresses: []},
      })
      const action = addAddress('person_one')
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          person_one: {addresses: [{
            street: {value: null},
            city: {value: null},
            state: {value: null},
            zip: {value: null},
            type: {value: null},
          }]},
          person_two: {addresses: []},
        })
      )
    })
  })

  describe('on deleteAddress', () => {
    it('deletes the address for the given person id and index', () => {
      const lastState = fromJS({
        person_one: {addresses: [{
          street: {value: '1234 Some Lane'},
          city: {value: 'Somewhere'},
          state: {value: 'CA'},
          zip: {value: '55555'},
          type: {value: 'Home'},
        }]},
        person_two: {addresses: [{
          street: {value: '5678 No Street'},
          city: {value: 'Nowhere'},
          state: {value: 'CA'},
          zip: {value: '55555'},
          type: {value: 'Cell'},
        }]},
      })
      const action = deleteAddress('person_one', 0)
      expect(peopleFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          person_one: {addresses: []},
          person_two: {addresses: [{
            street: {value: '5678 No Street'},
            city: {value: 'Nowhere'},
            state: {value: 'CA'},
            zip: {value: '55555'},
            type: {value: 'Cell'},
          }]},
        })
      )
    })
  })
})
