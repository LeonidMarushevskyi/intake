import {createSelector} from 'reselect'
import {fromJS} from 'immutable'
export const getPeopleSelector = (state) => state.get('peopleForm')
export const getPeopleWithEditsSelector = createSelector(
  getPeopleSelector,
  (people) => {
    return people.map((person) => fromJS({
    }))
  }
)
