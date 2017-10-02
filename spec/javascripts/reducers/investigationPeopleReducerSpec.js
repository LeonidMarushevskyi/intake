import * as matchers from 'jasmine-immutable-matchers'
import {fetchSuccess} from 'actions/investigationPeopleActions'
import investigationPeopleReducer from 'reducers/investigationPeopleReducer'
import {List, fromJS} from 'immutable'

describe('investigationPeoplReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  describe('on FETCH_INVESTIGATION_PEOPLE_SUCCESS', () => {
    it('returns the list of people from the action', () => {
      const people = fromJS([{first_name: 'Bob'}])
      const action = fetchSuccess(people.toJS())
      expect(investigationPeopleReducer(List(), action)).toEqualImmutable(people)
    })
  })
})
