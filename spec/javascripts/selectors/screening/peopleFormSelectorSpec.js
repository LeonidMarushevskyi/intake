import {fromJS} from 'immutable'
import {getPeopleWithEditsSelector} from 'selectors/screening/peopleFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('peopleFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getPeopleWithEditsSelector', () => {
    it('returns formated people object map', () => {
      const peopleForm = {
        one: {
          first_name: {value: 'one'},
          middle_name: {value: 'middle one'},
          last_name: {value: 'last one'},
          name_suffix: {value: 'suffix one'},
          roles: {value: ['a', 'b']},
          ssn: {value: '123'},
        },
        two: {
          first_name: {value: 'two'},
          middle_name: {value: 'middle two'},
          last_name: {value: 'last two'},
          name_suffix: {value: 'suffix two'},
          roles: {value: ['c']},
          ssn: {value: '321'},
        },
        three: {
          first_name: {value: 'three'},
          middle_name: {value: 'middle three'},
          last_name: {value: 'last three'},
          name_suffix: {value: 'suffix three'},
          roles: {value: []},
          ssn: {value: null},
        },
      }
      const state = fromJS({peopleForm})
      expect(getPeopleWithEditsSelector(state)).toEqualImmutable(fromJS({
        one: {
          id: 'one',
          first_name: 'one',
          middle_name: 'middle one',
          last_name: 'last one',
          name_suffix: 'suffix one',
          roles: ['a', 'b'],
          ssn: '123',
        },
        two: {
          id: 'two',
          first_name: 'two',
          middle_name: 'middle two',
          last_name: 'last two',
          name_suffix: 'suffix two',
          roles: ['c'],
          ssn: '321',
        },
        three: {
          id: 'three',
          first_name: 'three',
          middle_name: 'middle three',
          last_name: 'last three',
          name_suffix: 'suffix three',
          roles: [],
          ssn: null,
        },
      }))
    })
  })
})
