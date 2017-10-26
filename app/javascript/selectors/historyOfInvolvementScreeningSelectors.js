import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import {getHistoryOfInvolvementSelector} from 'selectors/historyOfInvolvementSelectors'
import nameFormatter from 'utils/nameFormatter'
import COUNTIES from 'enums/Counties'
import {ROLE_TYPE_NON_REPORTER} from 'enums/RoleType'

export const getScreeningsSelector = createSelector(
  getHistoryOfInvolvementSelector,
  (hoi) => hoi.get('screenings', List())
)

export const getScreeningAtIndexSelector = (state, index) => (
  getScreeningsSelector(state).get(index, Map())
)

export const getPeopleWhoAreNotJustReportersSelector = createSelector(
  getScreeningAtIndexSelector,
  (screening) => (
    screening.get('all_people', List()).filter((person) => {
      const roles = person.get('roles', List())
      return roles.some((role) => ROLE_TYPE_NON_REPORTER.includes(role)) || roles.isEmpty()
    })
  )
)

export const getPeopleNamesSelector = createSelector(
  getPeopleWhoAreNotJustReportersSelector,
  (people) => people.map((person) => nameFormatter(person.toJS())).join(', ')
)

export const getReporterNameSelector = createSelector(
  getScreeningAtIndexSelector,
  (screening) => nameFormatter({...screening.get('reporter').toJS(), name_default: ''})
)

export const getWorkerNameSelector = createSelector(
  getScreeningAtIndexSelector,
  (screening) => screening.getIn(['assigned_social_worker', 'last_name'], '')
)

export const getCountyNameSelector = createSelector(
  getScreeningAtIndexSelector,
  (screening) => COUNTIES[screening.get('county_name')] || ''
)

export const getStatusSelector = createSelector(
  getScreeningAtIndexSelector,
  (screening) => {
    if (screening.get('end_date')) {
      return 'Closed'
    } else {
      return 'In Progress'
    }
  }
)
