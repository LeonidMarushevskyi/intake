import {createSelector} from 'reselect'
import {fromJS} from 'immutable'
export const getPeopleSelector = (state) => state.get('peopleForm')
export const getPeopleWithEditsSelector = createSelector(
  getPeopleSelector,
  (people) => people.map((person, personId) => fromJS({
    id: personId,
    first_name: person.getIn(['first_name', 'value']),
    middle_name: person.getIn(['middle_name', 'value']),
    last_name: person.getIn(['last_name', 'value']),
    name_suffix: person.getIn(['name_suffix', 'value']),
    roles: person.getIn(['roles', 'value']),
    ssn: person.getIn(['ssn', 'value']),
  }))
)
