import * as matchers from 'jasmine-immutable-matchers'
import {fetchSuccess} from 'actions/investigationPeopleActions'
import {fetchSuccess as fetchInvestigationSuccess} from 'actions/investigationActions'
import investigationPeopleReducer from 'reducers/investigationPeopleReducer'
import {List, fromJS} from 'immutable'

describe('investigationPeoplReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  const people = [{first_name: 'Bob'}]

  describe('on FETCH_INVESTIGATION_PEOPLE_SUCCESS', () => {
    it('returns the list of people from the action', () => {
      const action = fetchSuccess(people)
      expect(investigationPeopleReducer(List(), action)).toEqualImmutable(
        fromJS(people)
      )
    })
  })
  describe('on FETCH_INVESTIGATION_SUCCESS', () => {
    it('returns the list of people on the investigation action', () => {
      const investigation = {people}
      const action = fetchInvestigationSuccess(investigation)
      expect(investigationPeopleReducer(List(), action)).toEqualImmutable(
        fromJS(people)
      )
    })
  })
})
